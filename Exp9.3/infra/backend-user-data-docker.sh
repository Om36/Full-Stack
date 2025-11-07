#!/bin/bash -xe
# User-data script to run on EC2 to build and run the backend Docker container
# Assumes parameters: GIT_REPO, GIT_BRANCH (optional)

GIT_REPO="${1:-REPLACE_WITH_GIT_REPO}"
GIT_BRANCH="${2:-main}"

yum update -y
# Install Docker
amazon-linux-extras install -y docker
service docker start
usermod -a -G docker ec2-user || true

# Install git
yum install -y git

mkdir -p /opt
cd /opt
if [ ! -d app ]; then
  git clone --single-branch --branch "$GIT_BRANCH" "$GIT_REPO" app
else
  cd app && git pull
fi
cd /opt/app

# Build and run backend container
docker build -t backend:latest ./backend
docker rm -f backend || true
docker run -d --name backend -p 3000:3000 --restart unless-stopped backend:latest
