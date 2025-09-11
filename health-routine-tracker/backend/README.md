# Health Routine Tracker

## 실행
- JDK 17 필요
- 로컬 실행: `./gradlew bootRun` (Windows: `gradlew.bat bootRun`)
- 패키징: `./gradlew bootJar`
- 기본 URL: `http://localhost:8080/v1`

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

## 에러 규약
- ApiResponse: `{ success, data, message, code, details }`
- 대표 에러: `ROUTINE_DUPLICATE(409)`, `USER_DUPLICATE(409)`, `NOT_FOUND(404)`, `FORBIDDEN(403)`, `VALIDATION_FAILED(400)`, `AUTH_REQUIRED(401)`, `SERVER_ERROR(500)`

## DB
- MariaDB: `health_routine`
- 스키마 파일: 프로젝트 루트 `Health_Routine_Tracker.sql`

## CORS
- 개발 기본: `http://localhost:3000`, `http://127.0.0.1:3000`
- 배포 도메인은 `WebConfig`의 `${cors.allowed-origins}`(환경변수로 주입 가능) 사용
