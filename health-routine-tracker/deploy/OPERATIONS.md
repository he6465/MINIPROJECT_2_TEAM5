# 운영 운영 가이드 (Prod)

## 환경 변수 (대표)

- `CORS_ALLOWED_ORIGIN_PATTERNS`: 게이트웨이 허용 오리진 패턴 (쉼표 구분)
  - 예) `http://localhost,http://127.0.0.1,https://your-domain.example`
- `MARIADB_ROOT_PASSWORD`, `MARIADB_DATABASE`, `MARIADB_USER`, `MARIADB_PASSWORD`
- (선택) `JWT_SECRET` 등 서비스별 시크릿

## 기동/중지

```bash
# 전체 (빌드 포함)
docker compose -f docker-compose-prod.yml up -d --build

# 부분 재배포
docker compose -f docker-compose-prod.yml up -d --build gateway
```

중지/정리:

```bash
docker compose -f docker-compose-prod.yml down
```

## 상태 확인

- 컨테이너: `docker compose -f docker-compose-prod.yml ps`
- 게이트웨이 헬스: `curl -i http://localhost:8080/actuator/health`
- Nginx 경유 헬스: `curl -i http://localhost/actuator/health`
- Eureka: 브라우저에서 `http://localhost:8761`

## Swagger (게이트웨이 경유)

- 루틴: `http://localhost/routines/swagger-ui`
- 댓글: `http://localhost/comments/swagger-ui`
- 좋아요: `http://localhost/likes/swagger-ui`
- 통계: `http://localhost/stats/swagger-ui`

## 캐시 동작 확인(Nginx)

```bash
# 두 번 연속 호출 시 MISS → HIT
curl -s -D - -o /dev/null 'http://localhost/routines/public?page=1&size=5'
curl -s -D - -o /dev/null 'http://localhost/routines/public?page=1&size=5'
```

정책: GET + 무인증 + `/routines|/stats`에 한하여 10초 캐시. Authorization/비-GET은 BYPASS.

## 스모크 테스트

```bash
BASE_URL=http://localhost USER_ID=1 ./scripts/smoke.sh
```

흐름: Gateway Health → Routine Health → Public 목록 → 루틴 생성/보정 → 댓글 생성/목록 → 좋아요 토글/카운트/내가눌렀는지.

## 자주 있는 이슈

- 502 (Nginx): 게이트웨이가 늦게 뜬 직후. `docker exec -it hrt-nginx-cache nginx -s reload`로 재해석.
- 503 (/routines/**): 게이트웨이의 레지스트리 미갱신. `docker compose -f docker-compose-prod.yml restart gateway`.
- 403 (공개 목록): `/routines/public`을 공개 경로로 허용했는지 prod 보안 설정 확인.
- MariaDB unhealthy: 헬스 커맨드 수정(본 compose에 반영됨). DB 정상 동작 여부는 서비스 로그/응답으로 교차 확인.

