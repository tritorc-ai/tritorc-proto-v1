#!/usr/bin/env bash
# One-time setup of a fresh Ubuntu 24.04 EC2 server (run as root, e.g. through SSM Session Manager):
#   sudo bash bootstrap.sh
set -euo pipefail
apt-get update
apt-get install -y ca-certificates curl unzip
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
# AWS CLI v2 (the server uses it to read secrets and log in to ECR)
if ! command -v aws >/dev/null; then
  curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-$(uname -m).zip" -o /tmp/awscli.zip
  unzip -q /tmp/awscli.zip -d /tmp && /tmp/aws/install
fi
apt-get install -y unattended-upgrades
mkdir -p /opt/tritorc
echo "Done. Now copy docker-compose.prod.yml (as docker-compose.yml), Caddyfile and deploy.sh into /opt/tritorc, create deploy.env, chmod +x deploy.sh."
