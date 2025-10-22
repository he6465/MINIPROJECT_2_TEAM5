# Health Routine Tracker

## 실행
- JDK 17 필요
- 로컬 실행: `./gradlew bootRun` (Windows: `gradlew.bat bootRun`)
- 패키징: `./gradlew bootJar`
- 기본 URL: `http://localhost:8081/v1`

## 문서
- Swagger UI: `/v1/swagger-ui.html`
- Actuator: `/v1/actuator/health`, `/v1/actuator/info`, `/v1/actuator/metrics`

## 주요 엔드포인트
- Auth: `POST /auth/register`, `POST /auth/login`
- Members(임시): `POST /members/register`, `GET /members/{id}`, `GET /members/me?id=`
- Routines: `POST /routines`, `GET /routines`, `GET /routines/{id}`, `PATCH /routines/{id}`, `DELETE /routines/{id}`, `GET /routines/by-date`
- Routine Comments: `POST /routines/{routineId}/comments`, `GET /routines/{routineId}/comments`
- Comments(레거시): `PATCH /api/comments/{id}`, `DELETE /api/comments/{id}`
- Routine Likes: `POST /routines/{routineId}/like`, `GET /routines/{routineId}/likes`, `GET /routines/{routineId}/like/me`
- AI Insight: `POST /ai/insight` (요청: `{ avgSleep, exerciseDays, avgWater, exerciseType }`, 응답: text/plain)

## AI 설정(선택)
- 환경변수
  - `AI_ENABLED=true`
  - `OPENAI_API_KEY=sk-...`
  - `OPENAI_MODEL=gpt-3.5-turbo` (기본값)
  - `OPENAI_TIMEOUT_MS=10000` (기본값)
- 키/비활성 시 응답: "AI가 아직 비활성화되어 있습니다. 키 설정 후 사용해 주세요."

## 에러 규약
- ApiResponse: `{ success, data, message, code, details }`
- 대표 에러: `ROUTINE_DUPLICATE(409)`, `USER_DUPLICATE(409)`, `NOT_FOUND(404)`, `FORBIDDEN(403)`, `VALIDATION_FAILED(400)`, `AUTH_REQUIRED(401)`, `SERVER_ERROR(500)`

## DB
- MariaDB: `health_routine`
- 스키마 파일: 프로젝트 루트 `Health_Routine_Tracker.sql`

## CORS
- 개발 기본: `http://localhost:5173`, `http://127.0.0.1:5173`
- 배포 도메인은 `application.yml`의 `cors.allowed-origins` 사용(환경변수로 주입 가능)
