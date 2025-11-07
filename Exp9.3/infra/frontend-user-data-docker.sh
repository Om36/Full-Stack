#!/bin/bash -xe
# User-data script to run on EC2 to build and run the frontend Docker container
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

# Build frontend and serve with nginx inside container
if [ -f ./frontend/Dockerfile ] || [ -d ./frontend ]; then
  docker build -t frontend:latest ./frontend
  docker rm -f frontend || true
  docker run -d --name frontend -p 80:80 --restart unless-stopped frontend:latest
else
  # fallback: build with npm and run vite preview (not recommended for production)
  cd frontend || true
  npm install --production
  nohup npm run preview -- --port 80 &>/var/log/frontend.log &
fi
