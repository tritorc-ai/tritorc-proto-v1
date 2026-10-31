#!/usr/bin/env bash
# Creates everything the Tritorc CMS needs on AWS, in your account, with YOUR credentials.
# Run it yourself in AWS CloudShell (console top bar, the >_ icon) after switching the region to Mumbai:
#
#   1. Generate a push-notification key pair on your PC (cms/ folder):  npx web-push generate-vapid-keys
#   2. In CloudShell: upload this deploy/ folder (Actions > Upload file, as a zip) and unzip it, then
#        export VAPID_PUBLIC_KEY='...' VAPID_PRIVATE_KEY='...'
#        export GITHUB_REPO='tritorc-ai/tritorc-proto-v1'
#        export CMS_DOMAIN='cms.tritorc.com'          # optional; default "auto" = temporary <ip>.sslip.io address
#        bash aws-setup.sh
#
# It asks you to confirm before creating anything. Re-running skips what already exists (best effort).
# Approx. monthly cost (check the AWS calculator): EC2 t3.small ~$15, RDS t4g.micro ~$13-15, 20 GB storage
# each ~$2, Elastic IP ~$3.6 (public IPv4 charge), CloudFront + S3 + ECR a few dollars. About $35-45 total.

set -euo pipefail

REGION="${REGION:-ap-south-1}"
CMS_DOMAIN="${CMS_DOMAIN:-auto}"   # auto = temporary free name <server-ip>.sslip.io (HTTPS works, no DNS needed)
GITHUB_REPO="${GITHUB_REPO:?set GITHUB_REPO, e.g. tritorc-ai/tritorc-proto-v1}"
: "${VAPID_PUBLIC_KEY:?set VAPID_PUBLIC_KEY (npx web-push generate-vapid-keys)}"
: "${VAPID_PRIVATE_KEY:?set VAPID_PRIVATE_KEY}"
VAPID_SUBJECT="${VAPID_SUBJECT:-https://www.tritorc.com}"
NAME="tritorc-cms"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export AWS_DEFAULT_REGION="$REGION" AWS_PAGER=""

ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
BUCKET="${NAME}-media-${ACCOUNT}"
echo "Account $ACCOUNT, region $REGION, domain $CMS_DOMAIN, repo $GITHUB_REPO"
echo "This will create: S3 bucket + CloudFront, RDS Postgres, ECR, EC2 + Elastic IP, IAM roles, security groups, SSM secrets."
read -r -p "Type YES to continue: " ok
[ "$ok" = "YES" ] || { echo "cancelled"; exit 1; }

# ---------------------------------------------------------------- network (default VPC)
VPC="$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
[ "$VPC" != "None" ] || { echo "no default VPC in $REGION"; exit 1; }
SUBNETS="$(aws ec2 describe-subnets --filters Name=vpc-id,Values="$VPC" --query 'Subnets[].SubnetId' --output text)"
SUBNET1="$(echo "$SUBNETS" | awk '{print $1}')"

sg() { # name description -> id
  local id
  id="$(aws ec2 describe-security-groups --filters Name=group-name,Values="$1" Name=vpc-id,Values="$VPC" --query 'SecurityGroups[0].GroupId' --output text)"
  [ "$id" != "None" ] || id="$(aws ec2 create-security-group --group-name "$1" --description "$2" --vpc-id "$VPC" --query GroupId --output text)"
  echo "$id"
}
SG_EC2="$(sg ${NAME}-ec2 'Tritorc CMS server: web only')"
SG_RDS="$(sg ${NAME}-rds 'Tritorc CMS database: from the server only')"
aws ec2 authorize-security-group-ingress --group-id "$SG_EC2" --ip-permissions \
  'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]' \
  'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]' 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id "$SG_RDS" --protocol tcp --port 5432 --source-group "$SG_EC2" 2>/dev/null || true

# ---------------------------------------------------------------- Elastic IP (allocated first: the temporary domain is built from it)
ALLOC="$(aws ec2 describe-addresses --filters Name=tag:Name,Values="$NAME" --query 'Addresses[0].AllocationId' --output text)"
if [ "$ALLOC" = "None" ]; then
  ALLOC="$(aws ec2 allocate-address --domain vpc --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=${NAME}}]" --query AllocationId --output text)"
fi
EIP="$(aws ec2 describe-addresses --allocation-ids "$ALLOC" --query 'Addresses[0].PublicIp' --output text)"
if [ "$CMS_DOMAIN" = "auto" ]; then CMS_DOMAIN="${EIP//./-}.sslip.io"; fi
echo "CMS address will be: https://$CMS_DOMAIN"

# ---------------------------------------------------------------- S3 + CloudFront
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" --create-bucket-configuration LocationConstraint="$REGION" >/dev/null
fi
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

OAC_ID="$(aws cloudfront list-origin-access-controls --query "OriginAccessControlList.Items[?Name=='${NAME}-oac'].Id | [0]" --output text)"
if [ "$OAC_ID" = "None" ] || [ -z "$OAC_ID" ]; then
  OAC_ID="$(aws cloudfront create-origin-access-control --origin-access-control-config \
    "Name=${NAME}-oac,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
    --query OriginAccessControl.Id --output text)"
fi
DIST_ID="$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='${NAME}-media'].Id | [0]" --output text)"
if [ "$DIST_ID" = "None" ] || [ -z "$DIST_ID" ]; then
  cat > /tmp/cf.json <<JSON
{
  "CallerReference": "${NAME}-$(date +%s)",
  "Comment": "${NAME}-media",
  "Enabled": true,
  "PriceClass": "PriceClass_200",
  "Origins": { "Quantity": 1, "Items": [ {
    "Id": "s3", "DomainName": "${BUCKET}.s3.${REGION}.amazonaws.com",
    "S3OriginConfig": { "OriginAccessIdentity": "" }, "OriginAccessControlId": "${OAC_ID}" } ] },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3", "ViewerProtocolPolicy": "redirect-to-https", "Compress": true,
    "AllowedMethods": { "Quantity": 2, "Items": ["GET", "HEAD"] },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "OriginRequestPolicyId": "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf",
    "ResponseHeadersPolicyId": "60669652-455b-4ae9-85a4-c4c02393f86c"
  }
}
JSON
  DIST_ID="$(aws cloudfront create-distribution --distribution-config file:///tmp/cf.json --query Distribution.Id --output text)"
fi
CF_DOMAIN="$(aws cloudfront get-distribution --id "$DIST_ID" --query Distribution.DomainName --output text)"
cat > /tmp/bucket-policy.json <<JSON
{ "Version": "2012-10-17", "Statement": [ {
  "Sid": "CloudFrontRead", "Effect": "Allow", "Principal": { "Service": "cloudfront.amazonaws.com" },
  "Action": "s3:GetObject", "Resource": "arn:aws:s3:::${BUCKET}/*",
  "Condition": { "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT}:distribution/${DIST_ID}" } } } ] }
JSON
aws s3api put-bucket-policy --bucket "$BUCKET" --policy file:///tmp/bucket-policy.json

# ---------------------------------------------------------------- ECR
aws ecr describe-repositories --repository-names "$NAME" >/dev/null 2>&1 || \
  aws ecr create-repository --repository-name "$NAME" --image-scanning-configuration scanOnPush=true >/dev/null
aws ecr put-lifecycle-policy --repository-name "$NAME" --lifecycle-policy-text \
  '{"rules":[{"rulePriority":1,"description":"keep last 10","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}' >/dev/null
ECR_REGISTRY="${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"

# ---------------------------------------------------------------- RDS
DB_ID="${NAME}-db"
if ! aws rds describe-db-instances --db-instance-identifier "$DB_ID" >/dev/null 2>&1; then
  DB_PASS="$(openssl rand -hex 16)"
  aws rds create-db-subnet-group --db-subnet-group-name "$NAME" --db-subnet-group-description "$NAME" \
    --subnet-ids $SUBNETS >/dev/null 2>&1 || true
  aws rds create-db-instance --db-instance-identifier "$DB_ID" --engine postgres --engine-version 16 \
    --db-instance-class db.t4g.micro --allocated-storage 20 --storage-type gp3 --storage-encrypted \
    --master-username strapi --master-user-password "$DB_PASS" --db-name strapi \
    --vpc-security-group-ids "$SG_RDS" --db-subnet-group-name "$NAME" --no-publicly-accessible \
    --backup-retention-period 7 --auto-minor-version-upgrade --copy-tags-to-snapshot >/dev/null
  aws ssm put-parameter --name /tritorc/cms/DATABASE_PASSWORD --type SecureString --value "$DB_PASS" --overwrite >/dev/null
fi
echo "Waiting for the database (about 10 minutes)..."
aws rds wait db-instance-available --db-instance-identifier "$DB_ID"
DB_HOST="$(aws rds describe-db-instances --db-instance-identifier "$DB_ID" --query 'DBInstances[0].Endpoint.Address' --output text)"

# ---------------------------------------------------------------- secrets in SSM
put() { aws ssm put-parameter --name "/tritorc/cms/$1" --type SecureString --value "$2" --overwrite >/dev/null; }
exists() { aws ssm get-parameter --name "/tritorc/cms/$1" >/dev/null 2>&1; }
gen() { openssl rand -base64 16 | tr -d '$\n'; }
if ! exists APP_KEYS; then
  put APP_KEYS "$(gen),$(gen),$(gen),$(gen)"
  for k in API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET ENCRYPTION_KEY; do put "$k" "$(gen)"; done
fi
put VAPID_PUBLIC_KEY "$VAPID_PUBLIC_KEY"
put VAPID_PRIVATE_KEY "$VAPID_PRIVATE_KEY"
put VAPID_SUBJECT "$VAPID_SUBJECT"
put DATABASE_CLIENT postgres
put DATABASE_HOST "$DB_HOST"
put DATABASE_PORT 5432
put DATABASE_NAME strapi
put DATABASE_USERNAME strapi
put DATABASE_SSL true
put DATABASE_SSL_REJECT_UNAUTHORIZED false
put PUBLIC_URL "https://${CMS_DOMAIN}"
put IS_PROXIED true
put S3_BUCKET "$BUCKET"
put S3_REGION "$REGION"
put S3_PUBLIC_URL "https://${CF_DOMAIN}"

# ---------------------------------------------------------------- IAM: server role
cat > /tmp/ec2-trust.json <<'JSON'
{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Service": "ec2.amazonaws.com" }, "Action": "sts:AssumeRole" } ] }
JSON
aws iam get-role --role-name "${NAME}-ec2" >/dev/null 2>&1 || \
  aws iam create-role --role-name "${NAME}-ec2" --assume-role-policy-document file:///tmp/ec2-trust.json >/dev/null
aws iam attach-role-policy --role-name "${NAME}-ec2" --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
aws iam attach-role-policy --role-name "${NAME}-ec2" --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
cat > /tmp/ec2-inline.json <<JSON
{ "Version": "2012-10-17", "Statement": [
  { "Effect": "Allow", "Action": ["ssm:GetParametersByPath", "ssm:GetParameters", "ssm:GetParameter"],
    "Resource": "arn:aws:ssm:${REGION}:${ACCOUNT}:parameter/tritorc/cms*" },
  { "Effect": "Allow", "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::${BUCKET}/*" },
  { "Effect": "Allow", "Action": "s3:ListBucket", "Resource": "arn:aws:s3:::${BUCKET}" } ] }
JSON
aws iam put-role-policy --role-name "${NAME}-ec2" --policy-name "${NAME}-access" --policy-document file:///tmp/ec2-inline.json
aws iam get-instance-profile --instance-profile-name "${NAME}-ec2" >/dev/null 2>&1 || {
  aws iam create-instance-profile --instance-profile-name "${NAME}-ec2" >/dev/null
  aws iam add-role-to-instance-profile --instance-profile-name "${NAME}-ec2" --role-name "${NAME}-ec2"
  sleep 15
}

# ---------------------------------------------------------------- EC2
INSTANCE_ID="$(aws ec2 describe-instances --filters Name=tag:Name,Values="$NAME" Name=instance-state-name,Values=pending,running,stopped \
  --query 'Reservations[0].Instances[0].InstanceId' --output text)"
if [ "$INSTANCE_ID" = "None" ]; then
  WORK="$(mktemp -d)"
  cp "$HERE/docker-compose.prod.yml" "$WORK/docker-compose.yml"
  cp "$HERE/Caddyfile" "$HERE/deploy.sh" "$HERE/bootstrap.sh" "$WORK/"
  cat > "$WORK/deploy.env" <<ENV
AWS_REGION=${REGION}
ECR_REGISTRY=${ECR_REGISTRY}
ECR_REPO=${NAME}
CMS_DOMAIN=${CMS_DOMAIN}
SSM_PATH=/tritorc/cms/
ENV
  BUNDLE="$(tar czf - -C "$WORK" . | base64 -w0)"
  cat > /tmp/userdata.sh <<UD
#!/bin/bash
set -ex
mkdir -p /root/setup && echo '${BUNDLE}' | base64 -d | tar xz -C /root/setup
bash /root/setup/bootstrap.sh
cp /root/setup/docker-compose.yml /root/setup/Caddyfile /root/setup/deploy.sh /root/setup/deploy.env /opt/tritorc/
chmod +x /opt/tritorc/deploy.sh
UD
  AMI="$(aws ssm get-parameter --name /aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id --query Parameter.Value --output text)"
  INSTANCE_ID="$(aws ec2 run-instances --image-id "$AMI" --instance-type t3.small --subnet-id "$SUBNET1" \
    --security-group-ids "$SG_EC2" --iam-instance-profile Name="${NAME}-ec2" \
    --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=20,VolumeType=gp3,Encrypted=true}' \
    --metadata-options HttpTokens=required,HttpPutResponseHopLimit=2,HttpEndpoint=enabled \
    --user-data file:///tmp/userdata.sh --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${NAME}}]" \
    --query 'Instances[0].InstanceId' --output text)"
fi
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
aws ec2 associate-address --instance-id "$INSTANCE_ID" --allocation-id "$ALLOC" >/dev/null

# ---------------------------------------------------------------- IAM: GitHub deploy role (OIDC)
OIDC_ARN="arn:aws:iam::${ACCOUNT}:oidc-provider/token.actions.githubusercontent.com"
aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$OIDC_ARN" >/dev/null 2>&1 || \
  aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 >/dev/null
cat > /tmp/gh-trust.json <<JSON
{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Principal": { "Federated": "${OIDC_ARN}" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": { "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    "token.actions.githubusercontent.com:sub": "repo:${GITHUB_REPO}:environment:production" } } } ] }
JSON
aws iam get-role --role-name "${NAME}-deploy" >/dev/null 2>&1 && \
  aws iam update-assume-role-policy --role-name "${NAME}-deploy" --policy-document file:///tmp/gh-trust.json || \
  aws iam create-role --role-name "${NAME}-deploy" --assume-role-policy-document file:///tmp/gh-trust.json >/dev/null
cat > /tmp/gh-inline.json <<JSON
{ "Version": "2012-10-17", "Statement": [
  { "Effect": "Allow", "Action": "ecr:GetAuthorizationToken", "Resource": "*" },
  { "Effect": "Allow", "Action": ["ecr:BatchCheckLayerAvailability", "ecr:InitiateLayerUpload", "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload", "ecr:PutImage", "ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer"],
    "Resource": "arn:aws:ecr:${REGION}:${ACCOUNT}:repository/${NAME}" },
  { "Effect": "Allow", "Action": "ssm:SendCommand",
    "Resource": ["arn:aws:ec2:${REGION}:${ACCOUNT}:instance/${INSTANCE_ID}", "arn:aws:ssm:${REGION}::document/AWS-RunShellScript"] },
  { "Effect": "Allow", "Action": ["ssm:GetCommandInvocation", "ssm:ListCommandInvocations"], "Resource": "*" } ] }
JSON
aws iam put-role-policy --role-name "${NAME}-deploy" --policy-name "${NAME}-deploy" --policy-document file:///tmp/gh-inline.json
DEPLOY_ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${NAME}-deploy"

cat <<DONE

==================== DONE ====================
1) Address: https://${CMS_DOMAIN}   (server IP ${EIP}). For a permanent name later, see "Change the domain later" in deploy/README.md
2) GitHub: repo ${GITHUB_REPO} > Settings > Environments > production, then Settings > Variables (Actions):
     AWS_REGION=${REGION}
     AWS_DEPLOY_ROLE_ARN=${DEPLOY_ROLE_ARN}
     ECR_REPO=${NAME}
     EC2_INSTANCE_ID=${INSTANCE_ID}
     CMS_PUBLIC_URL=https://${CMS_DOMAIN}
   (or: gh variable set NAME --body VALUE --repo ${GITHUB_REPO})
3) Media CDN address (also set as STRAPI_MEDIA_URL in the frontend): https://${CF_DOMAIN}
4) Run the "CMS deploy" workflow (or merge to main). Then open https://${CMS_DOMAIN}/admin and create the admin.
   The server finishes installing Docker a few minutes after launch; the deploy waits for SSM to be ready.
DONE
