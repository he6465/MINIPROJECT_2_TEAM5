# EC2 1회 세팅 가이드

## Docker & Compose 설치 (Amazon Linux 2023 / Ubuntu 공통)

```bash
sudo apt-get update -y || sudo yum update -y
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Docker Compose plugin
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

docker version && docker compose version
```

## 워크디렉터리 준비

```bash
mkdir -p ~/apps/hrt
cd ~/apps/hrt
# 첫 배포 전 .env 배치(민감 값)
cp -n health-routine-tracker/deploy/.env.example .env  # 수정 후 사용
```

## 수동 배포(검증용)

```bash
cd ~/apps/hrt/health-routine-tracker
docker compose -f docker-compose-prod.yml up -d --build
docker compose -f docker-compose-prod.yml ps
```

## 확인

- Gateway: `curl -i http://localhost:8080/actuator/health`
- Nginx 경유(캐시): `curl -i http://localhost/actuator/health`
- Swagger: `http://<EC2 IP>/routines/swagger-ui`

