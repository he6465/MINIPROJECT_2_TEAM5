#!/usr/bin/env bash
set -euo pipefail

# Usage: run on EC2 host after rsync
#   ./scripts/remote_deploy.sh [compose-file]

COMPOSE_FILE=${1:-health-routine-tracker/docker-compose-prod.yml}

echo "[deploy] compose: $COMPOSE_FILE"
docker compose -f "$COMPOSE_FILE" up -d --build
docker compose -f "$COMPOSE_FILE" ps

echo "[deploy] health checks"
curl -fsS http://localhost:8080/actuator/health || true
curl -fsS http://localhost/actuator/health || true

echo "[done]"

