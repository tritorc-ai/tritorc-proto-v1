# Deploying the Tritorc CMS (Strapi) on AWS

Flow: push to `main` (files under `cms/` changed) -> GitHub Actions builds the Docker image -> pushes to ECR ->
runs `deploy.sh` on the EC2 server through SSM -> health check -> automatic rollback if unhealthy.
Content lives in RDS Postgres and uploads in S3, never in the image.

| File | Purpose |
|---|---|
| `cms/Dockerfile`, `cms/.dockerignore` | production image |
| `deploy/docker-compose.prod.yml` | server: Strapi + Caddy (HTTPS). Copy to the server as `docker-compose.yml` |
| `deploy/Caddyfile` | reverse proxy and automatic certificates |
| `deploy/deploy.sh` | runs on the server: secrets from SSM, pull, restart, health check, rollback |
| `deploy/bootstrap.sh` | one-time server setup (Docker, AWS CLI) |
| `deploy/docker-compose.local.yml` | try the image on your PC with Postgres |
| `.github/workflows/cms-ci.yml` | pull request: builds the image (no push) |
| `.github/workflows/cms-deploy.yml` | main: build, push, deploy; manual run with `tag` = rollback |
| `.github/workflows/web-ci.yml` | pull request/main: tsc, lint, build of the app |

## Test on your PC first
```
docker compose -f deploy/docker-compose.local.yml up --build
```
Open http://localhost:1339/admin (health: http://localhost:1339/_health, expect 204). Stop with `down -v`.

## Fast path: one script
`deploy/aws-setup.sh` creates everything in the list below (S3 + CloudFront, RDS, ECR, EC2 + Elastic IP, IAM roles, security groups, SSM secrets) from AWS CloudShell, after you confirm. Usage is at the top of the script. The manual list below is the same thing by hand.

## One-time AWS setup (region ap-south-1 assumed)

1. **S3 bucket** (private, block public access) + **CloudFront** distribution with the bucket as origin
   (Origin Access Control). Add a bucket CORS rule: `GET`/`HEAD` from your app's address (the in-app PDF
   viewer needs it). The CloudFront address is `S3_PUBLIC_URL`.
2. **RDS Postgres 16**, `db.t4g.micro`, private subnet group, automated backups 7 days, security group
   allowing 5432 only from the server's security group. Use a password without `$` or `#`.
3. **ECR** repository (name = `ECR_REPO`), lifecycle rule: keep last 10 images.
4. **EC2** `t3.small`, Ubuntu 24.04, 20 GB gp3, Elastic IP. Security group: 80 and 443 open, **22 closed**
   (use SSM Session Manager). Set instance metadata **hop limit to 2** so containers can use the instance
   role: `aws ec2 modify-instance-metadata-options --instance-id <id> --http-put-response-hop-limit 2 --http-tokens required`.
5. **Instance role** attached to the EC2 (trust: ec2.amazonaws.com) with:
   - `AmazonSSMManagedInstanceCore` (managed policy)
   - `AmazonEC2ContainerRegistryReadOnly` (managed policy)
   - inline: `ssm:GetParametersByPath` + `ssm:GetParameters` on `arn:aws:ssm:REGION:ACCOUNT:parameter/tritorc/cms/*`,
     `kms:Decrypt` on the default `aws/ssm` key, and `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`,
     `s3:ListBucket` on the media bucket.
6. **GitHub deploy role** (OIDC): create the IAM identity provider `token.actions.githubusercontent.com`
   (audience `sts.amazonaws.com`), then a role whose trust policy allows
   `repo:tritorc-ai/<REPO>:environment:production` (use the real repository name). Permissions: ECR push to the
   repository (`ecr:GetAuthorizationToken`, `ecr:BatchCheckLayerAvailability`, `ecr:PutImage`,
   `ecr:InitiateLayerUpload`, `ecr:UploadLayerPart`, `ecr:CompleteLayerUpload`), `ssm:SendCommand` on the
   instance and on `AWS-RunShellScript`, and `ssm:GetCommandInvocation`, `ssm:ListCommandInvocations`.
7. **DNS**: `cms.tritorc.com` A record -> the Elastic IP.

## Secrets (SSM Parameter Store, type SecureString, path `/tritorc/cms/`)
One parameter per variable, name = the variable. Generate each secret with `openssl rand -base64 16`
(no `$`). Required:

`APP_KEYS` (four comma-separated), `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`,
`ENCRYPTION_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`,
`DATABASE_CLIENT=postgres`, `DATABASE_HOST`, `DATABASE_PORT=5432`, `DATABASE_NAME`, `DATABASE_USERNAME`,
`DATABASE_PASSWORD`, `DATABASE_SSL=true`, `DATABASE_SSL_REJECT_UNAUTHORIZED=false` (until the RDS CA bundle is added),
`PUBLIC_URL=https://cms.tritorc.com`, `IS_PROXIED=true`,
`S3_BUCKET`, `S3_REGION=ap-south-1`, `S3_PUBLIC_URL` (CloudFront address). Leave `S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`
**unset** (the instance role is used) and `S3_ACL` unset.
Optional: `SMTP_*`, `ENQUIRY_ALERT_TO` (see `cms/.env.example`).

## Prepare the server (once)
In Session Manager on the instance:
```
sudo bash bootstrap.sh            # copy deploy/bootstrap.sh there first
cd /opt/tritorc
# copy: docker-compose.prod.yml -> docker-compose.yml, Caddyfile, deploy.sh  (chmod +x deploy.sh)
cat > deploy.env <<'ENV'
AWS_REGION=ap-south-1
ECR_REGISTRY=<account>.dkr.ecr.ap-south-1.amazonaws.com
ECR_REPO=tritorc-cms
CMS_DOMAIN=cms.tritorc.com
SSM_PATH=/tritorc/cms/
ENV
```

## GitHub settings
Repository -> Settings -> Environments -> `production` (add yourself as required reviewer to gate deploys).
Variables (not secrets): `AWS_REGION`, `AWS_DEPLOY_ROLE_ARN`, `ECR_REPO`, `EC2_INSTANCE_ID`, `CMS_PUBLIC_URL`
(`https://cms.tritorc.com`).

## First launch
1. Merge to `main` (or run the "CMS deploy" workflow). Watch the log; the last step checks `/_health`.
2. Open `https://cms.tritorc.com/admin` and create the first Super Admin.
3. Move the data from your PC: in the production admin create a **Transfer token** (Settings -> Transfer Tokens,
   full access), then locally stop Strapi and run
   `npx strapi transfer --to https://cms.tritorc.com/admin` (it asks for the token). Content and media move; media
   lands in S3.
4. Create API tokens in the production admin (Settings -> API Tokens): read-only for the app, plus the notifications
   read/write tokens (same permissions as `cms/scripts/setup-notifications.js`). Put them in the frontend's
   environment variables (`STRAPI_API_URL`, `STRAPI_API_READ_TOKEN`, `NOTIF_API_URL`, `NOTIF_API_READ_TOKEN`,
   `NOTIF_API_WRITE_TOKEN`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = the production VAPID public key, `STRAPI_MEDIA_URL`).

## Everyday use
- Change a content type or code under `cms/`: pull request (image builds in CI) -> merge -> deployed.
  Strapi updates its tables on start. Do not rename a field and use it in the same release (a rename drops the column);
  take an RDS snapshot before risky changes.
- Roll back: Actions -> "CMS deploy" -> Run workflow -> enter an earlier image tag (a commit SHA).
- Failed deploy: `deploy.sh` restores the previous image by itself and the workflow turns red.
- Logs: Session Manager, then `cd /opt/tritorc && docker compose logs -f cms`.
- Run exactly one `cms` container: push and enquiry email jobs run inside Strapi.

## Change the domain later (temporary sslip.io -> cms.tritorc.com)
1. IT adds an A record `cms.tritorc.com` -> the Elastic IP (printed by the script, also in EC2 > Elastic IPs).
2. SSM Parameter Store: set `/tritorc/cms/PUBLIC_URL` to `https://cms.tritorc.com`.
3. On the server (Session Manager): edit `/opt/tritorc/deploy.env`, set `CMS_DOMAIN=cms.tritorc.com`.
4. GitHub variable `CMS_PUBLIC_URL` = `https://cms.tritorc.com`.
5. Run the "CMS deploy" workflow with the current tag (Caddy fetches the new certificate by itself).
6. Update `STRAPI_API_URL` / `NOTIF_API_URL` in the frontend, and note that the Strapi admin address and any tokens stay valid, only the URL changes.
