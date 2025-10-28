#!/bin/bash

# MSA 전체 서비스 빌드 스크립트

set -e

echo "========================================="
echo "MSA 전체 서비스 빌드 시작"
echo "========================================="

SERVICES=("eureka-server" "gateway" "auth-service" "routine-service" "comment-service" "like-service" "stats-service")

for SERVICE in "${SERVICES[@]}"; do
    echo ""
    echo "[$SERVICE] 빌드 중..."
    cd $SERVICE
    ./gradlew clean bootJar --no-daemon
    cd ..
    echo "[$SERVICE] 빌드 완료 ✓"
done

echo ""
echo "========================================="
echo "모든 서비스 빌드 완료!"
echo "========================================="
echo ""
echo "다음 명령어로 MSA 환경을 실행하세요:"
echo "  docker-compose -f docker-compose-msa.yml up -d"

