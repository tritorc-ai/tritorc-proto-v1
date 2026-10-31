#!/usr/bin/env bash
# Runs ON the EC2 server (GitHub Actions calls it through SSM): ./deploy.sh <image-tag>
# Pulls the image, restarts Strapi, waits for it to be healthy, and goes back to the previous
# image if it never becomes healthy.
set -euo pipefail
cd /opt/tritorc

TAG="${1:?usage: deploy.sh <image-tag>}"
# deploy.env (created once by hand, see deploy/README.md) holds: AWS_REGION, ECR_REGISTRY, ECR_REPO, CMS_DOMAIN, SSM_PATH
set -a; source ./deploy.env; set +a

echo "== Secrets from SSM ${SSM_PATH}"
aws ssm get-parameters-by-path --path "$SSM_PATH" --with-decryption --recursive \
  --region "$AWS_REGION" --query 'Parameters[*].[Name,Value]' --output text \
  | while IFS=$'\t' read -r name value; do echo "${name##*/}=${value}"; done > .env.new
[ -s .env.new ] || { echo "no parameters found under $SSM_PATH"; exit 1; }
chmod 600 .env.new && mv .env.new .env

echo "== Pulling ${ECR_REPO}:${TAG}"
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"
export ECR_REGISTRY ECR_REPO CMS_DOMAIN
PREV="$(cat .last-good 2>/dev/null || true)"
IMAGE_TAG="$TAG" docker compose -f docker-compose.yml pull cms

echo "== Starting"
IMAGE_TAG="$TAG" docker compose -f docker-compose.yml up -d --remove-orphans

healthy() {
  local id; id="$(IMAGE_TAG="$1" docker compose -f docker-compose.yml ps -q cms)"
  [ -n "$id" ] && [ "$(docker inspect --format '{{.State.Health.Status}}' "$id")" = "healthy" ]
}
for i in $(seq 1 40); do
  if healthy "$TAG"; then
    echo "$TAG" > .last-good
    docker image prune -f >/dev/null
    echo "== Healthy: $TAG"
    exit 0
  fi
  sleep 5
done

echo "== NOT healthy after 200 s"
IMAGE_TAG="$TAG" docker compose -f docker-compose.yml logs --tail 60 cms || true
if [ -n "$PREV" ] && [ "$PREV" != "$TAG" ]; then
  echo "== Rolling back to $PREV"
  IMAGE_TAG="$PREV" docker compose -f docker-compose.yml up -d cms
fi
exit 1
