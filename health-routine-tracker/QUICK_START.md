# 빠른 시작 가이드

## 1. 전체 서비스 재빌드 및 실행

### Windows PowerShell
```powershell
cd health-routine-tracker
wsl bash -c "./build-all-msa.sh"
wsl bash -c "docker-compose -f docker-compose-msa.yml up -d"
```

### Linux/WSL
```bash
cd health-routine-tracker
./build-all-msa.sh
docker-compose -f docker-compose-msa.yml up -d
```

## 2. 서비스 상태 확인

```bash
# Eureka 대시보드
open http://localhost:8761

# Gateway 헬스체크
curl http://localhost:8080/actuator/health

# 모든 서비스 등록 확인
curl http://localhost:8761/eureka/apps
```

## 3. Frontend 실행

```bash
cd health-routine-tracker/frontend
npm run dev
```

브라우저: http://localhost:5173

### Swagger (Gateway를 통해 접속)
- Routine: http://localhost:8080/routines/swagger-ui
- Comments: http://localhost:8080/comments/swagger-ui
- Likes: http://localhost:8080/likes/swagger-ui
- Stats: http://localhost:8080/stats/swagger-ui

참고: Swagger가 503 또는 404를 반환하면 각 서비스 컨테이너가 Up 상태인지 확인하고, `gateway`를 재빌드/재기동 하세요.

## 4. 로그 확인

```bash
# Gateway 로그
docker logs hrt-gateway

# sub-Service 로그
docker logs hrt-routine-service
docker logs hrt-auth-service
```

## 5. 문제 해결

### Gateway에서 400 에러 발생 시
```bash
# Gateway 재시작
docker-compose -f docker-compose-msa.yml restart gateway

# 로그 확인
docker logs hrt-gateway --tail 50
```

### 특정 서비스만 재시작
```bash
docker-compose -f docker-compose-msa.yml restart <service-name>

### 루틴 목록 400/401 (Bad Request/Unauthorized) 정리
- 전체 공개 목록은 `GET /routines/public` 입니다. 사용자별 목록(`GET /routines`)은 인증 헤더 `X-User-Id`가 필요합니다.
- 프론트에서 “전체 보기”로 userId 파라미터를 비우면 `/routines/public`로 조회됩니다.
- 특정 사용자 ID로 조회하려면 로그인(또는 로컬스토리지의 `hrt:user` 존재) 상태여야 하며, 요청 헤더에 `X-User-Id`가 전달되어야 합니다.

## 6. 스모크 테스트

다음 스크립트로 Gateway를 통한 E2E 흐름을 빠르게 점검할 수 있습니다.

```bash
chmod +x ./scripts/smoke.sh
BASE_URL=http://localhost:8080 USER_ID=1 ./scripts/smoke.sh
```

## 7. 운영 설정 요약

- CORS: `CORS_ALLOWED_ORIGIN_PATTERNS` 환경변수로 운영 오리진만 허용.
- Nginx 캐시: GET + 무인증 + `/routines|/stats` 10초 캐시. `X-Cache-Status`로 MISS/HIT 확인.
- Eureka 주소: 컨테이너 네트워크용 `http://eureka-server:8761/eureka/` (prod 프로필 반영)
- MariaDB 헬스체크: `mysqladmin ping`으로 안정화 (compose 반영)

```

## 6. 전체 중지 및 정리

```bash
docker-compose -f docker-compose-msa.yml down
```

