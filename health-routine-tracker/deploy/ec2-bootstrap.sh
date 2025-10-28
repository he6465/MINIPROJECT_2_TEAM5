#!/usr/bin/env bash
set -euo pipefail

sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg git

# Docker Engine
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ${SUDO_USER:-$USER}

# Project directory
PROJECT_DIR=${1:-/home/ubuntu/hrt}
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Compose up (assumes repo synced to $PROJECT_DIR)
if [ ! -f .env ]; then
  echo "DB_PASSWORD=hrtpass" >> .env
  echo "DB_ROOT_PASSWORD=rootpass" >> .env
fi

docker compose up -d --build
echo "Bootstrap complete."


