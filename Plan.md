

# 🏃 건강 루틴 트래커 (Health Routine Tracker)

## 📌 1. 프로젝트 개요

- 프로젝트명 : 건강 루틴 트래커 (Health Routine Tracker)
- 목표 : 사용자가 수면, 운동, 식사, 음수량 등 건강 루틴을 기록하고, 댓글·좋아요 기능을 통해 상호작용하며, 통계 및 차트를 통해 습관을 관리할 수 있는 웹 애플리케이션을 개발한다.
- 기간 : 2025년 9월 6일 \~ 2025년 9월 12일 (총 7일)
- 팀 구성 : 6명 (프론트엔드 3명, 백엔드 3명)



## ⚙️ 2. 주요 기능 및 기술 스택

### 2.1 주요 기능

1. 회원가입/로그인 (JWT 인증)
2. 데일리 루틴 관리 (CRUD) – 수면, 운동, 식사, 물 섭취량, 메모
3. 댓글 및 좋아요 기능
4. 통계 및 시각화 (주간/월간, 달력 뷰)
5. 마이페이지 (내 기록 요약)

### 2.2 기술 스택

* **프론트엔드**: React, TypeScript, Vite, React Router, React Query, TailwindCSS, Recharts
* **백엔드**: Spring Boot 3.x, Spring Security, Spring Data JPA, MariaDB, JWT, Lombok, Gradle
* **공통**: GitHub, Notion, Postman, Vercel(FE 배포), Railway/Render(BE 배포)

---

## 📋 3. 요구사항 명세서

### 3.1 상위 기능 목록

| ID   | 기능명      | 설명                   | 입력값/출력값                   | 우선순위 |
| ---- | -------- | -------------------- | ------------------------- | ---- |
| F-01 | 회원가입     | 사용자 등록               | email, password, nickname | 상    |
| F-02 | 로그인      | JWT 발급               | email, password → JWT     | 상    |
| F-03 | 루틴 작성    | 수면, 운동, 식사, 물, 메모 기록 | routine 데이터               | 상    |
| F-04 | 루틴 조회    | 사용자별 루틴 목록/상세        | userId, date              | 상    |
| F-05 | 루틴 수정    | 기존 루틴 데이터 변경         | routineId, 수정 데이터         | 중    |
| F-06 | 루틴 삭제    | 루틴 제거                | routineId                 | 중    |
| F-07 | 댓글 작성    | 루틴에 댓글 등록            | routineId, content        | 중    |
| F-08 | 댓글 수정/삭제 | 댓글 관리                | commentId                 | 중    |
| F-09 | 좋아요 토글   | 루틴 좋아요/취소            | routineId, userId         | 중    |
| F-10 | 통계 조회    | 주간/월간 루틴 통계          | 기간 데이터                    | 중    |
| F-11 | 달력 뷰     | 루틴 등록 현황 표시          | 월별 데이터                    | 하    |
| F-12 | 마이페이지    | 내 기록 및 통계 확인         | userId                    | 중    |

---
### 3.2 상세 기능 요구(필드·검증·에러)  

### 3.2.1 Routine 필드 & 검증  

| 필드              | 타입                 | 제약                 | 예시           |
| --------------- | ------------------ | ------------------ | ------------ |
| date            | string(YYYY-MM-DD) | 필수, 사용자+date 유니크   | `2025-09-08` |
| sleepHours      | number             | 0 ≤ x ≤ 16         | 7.5          |
| exerciseType    | enum               | `WALK/RUN/GYM/ETC` | `RUN`        |
| exerciseMinutes | int                | 0 ≤ x ≤ 600        | 30           |
| meals           | string             | 0\~1000자           | `"아:샐러드…" `  |
| waterMl         | int                | 0 ≤ x ≤ 10000      | 1800         |
| note            | string             | 0\~1000자           | `"야식 참음"`    |

**예외 규칙**

- 400: 필드 검증 실패

- 401: 토큰 없음/잘못됨

- 403: 소유자 아님

- 404: 리소스 없음

- 409: 동일 날짜 루틴 중복  

---

### 3.2.2 Comment 필드 & 검증  

| 필드      | 타입     | 제약                   |
| ------- | ------ | -------------------- |
| content | string | 1\~500자 (XSS escape) |

---

### 3.3 비기능 요구사항 (NFR)

| 항목  | 목표/기준                                                      |
| --- | ---------------------------------------------------------- |
| 보안  | 비밀번호 Bcrypt(≥10 rounds), JWT HS256, CORS 허용 도메인 제한         |
| 성능  | 단순 조회 p95 < 300ms, API TPS ≥ 50 (개발 기준)                    |
| 신뢰성 | 5xx 오류율 < 1%                                               |
| 로깅  | 요청/응답 요약, 에러 스택 로그                                         |
| 가시성 | `/health` 헬스 체크, 기본 메트릭 수집                                 |
| 확장성 | DB 인덱스: Routine(userId,date), Comment(routineId,createdAt) |
| 테스트 | BE unit ≥ 40%, FE ≥ 30%, 핵심 E2E 2케이스                       |

---
### 3.4 데이터 모델(요약)  

| 테이블        | 키/제약                                                     | 주요 컬럼                                                                                       |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `users`    | PK\:id(UUID), UK\:email, UK\:nickname                    | email, passwordHash, nickname, createdAt                                                    |
| `routines` | PK\:id, UK:(userId,date), FK\:userId→users.id            | date, sleepHours, exerciseType, exerciseMinutes, meals, waterMl, note, createdAt, updatedAt |
| `comments` | PK\:id, FK\:routineId, FK\:userId                        | content, createdAt, updatedAt                                                               |
| `likes`    | PK\:id, UK:(routineId,userId), FK\:routineId, FK\:userId | createdAt                                                                                   |

---



---
## 👩‍💻 4. 직무 역할 및 활용 도구

* **FE1**: Auth UI, 네비게이션 레이아웃
* **FE2**: 루틴 CRUD UI, 댓글/좋아요 UI
* **FE3**: 마이페이지, 차트, 달력
* **BE1**: Auth API, JWT 인증, Spring Security 설정
* **BE2**: 루틴 CRUD API, 통계 API
* **BE3**: 댓글/좋아요 API, 예외처리

활용 도구: GitHub, Figma, Notion, Postman, MariaDB Workbench

---

## 📦 5. 산출물 리스트

* 프로젝트 기획서 및 계획서
* 요구사항 명세서 (FR/NFR)
* DB ERD 다이어그램
* API 명세서 (Swagger, Markdown 문서)
* FE/BE 소스코드 (GitHub)
* 배포 링크 (FE, BE)
* 최종 발표 자료 (PPT)

---

## ⏰ 6. 마일스톤

* **Day 1**: 환경 세팅, DB 설계, API 설계
* **Day 2\~3**: Auth + 루틴 CRUD 개발
* **Day 4**: 댓글/좋아요 개발
* **Day 5**: 통계/달력 개발
* **Day 6**: 통합 테스트, 버그 수정
* **Day 7**: 발표 준비 및 시연

---

## 📑 7. API 명세서
### API 공통 규칙

- 인증: 보호 API는 헤더 필요 
  
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

- 에러 포맷:

```
{ "code": "ROUTINE_DUPLICATE", "message": "Routine already exists", "details": { "date": "2025-09-08" } }
```

- 페이지네이션: ?page=1&size=20 (기본 page=1, size=20, 최대 100)

- 정렬: ?sort=field,asc|desc (기본 date,desc)

- 필터: 날짜는 ?from=YYYY-MM-DD&to=YYYY-MM-DD

- 버저닝: 헤더 Accept: application/vnd.hrt.v1+json (옵션) 또는 URL /v1/*

### 7.1 MEMBER-SERVICE (인증/회원 관리)

| No   | Domain | Description | Base URL | Detailed URL | Method | Full URL             | Auth | 응답코드            | 담당  |
| ---- | ------ | ----------- | -------- | ------------ | ------ | -------------------- | ---- | --------------- | --- |
| M-01 | MEMBER | 회원가입        | /auth    | /register    | POST   | /auth/register       | -    | 201,400,409     | BE1 |
| M-02 | MEMBER | 로그인(JWT)    | /auth    | /login       | POST   | /auth/login          | -    | 200,400,401     | BE1 |
| M-03 | MEMBER | 내 정보 조회     | /members | /me          | GET    | /members/me          | ✅    | 200,401         | BE1 |
| M-04 | MEMBER | 비밀번호 변경     | /members | /me/password | PATCH  | /members/me/password | ✅    | 204,400,401     | BE1 |
| M-05 | MEMBER | 회원 탈퇴       | /members | /{id}        | DELETE | /members/{id}        | ✅    | 204,401,403,404 | BE1 |

```
  // Request
{ "email": "a@a.com", "password": "123456", "nickname": "alice" }
// 201 Response
{ "id": "uuid", "email": "a@a.com", "nickname": "alice", "createdAt": "2025-09-06T09:00:00Z" }
// 409 Response
{ "code":"USER_DUPLICATE","message":"Email or nickname already used" }
```

```
// Request
{ "email":"a@a.com", "password":"123456" }
// 200 Response
{ "token":"<jwt>", "user": { "id":"uuid", "email":"a@a.com", "nickname":"alice" } }

```
---

### 7.2 ROUTINE-SERVICE (루틴 관리)

| No   | Domain  | Description   | Base URL  | Detailed URL                     | Method | Full URL       | Auth | 응답코드                | 담당  |
| ---- | ------- | ------------- | --------- | -------------------------------- | ------ | -------------- | ---- | ------------------- | --- |
| R-01 | ROUTINE | 루틴 생성         | /routines | -                                | POST   | /routines      | ✅    | 201,400,401,409     | BE2 |
| R-02 | ROUTINE | 루틴 목록(기간/페이지) | /routines | ?from=\&to=\&page=\&size=\&sort= | GET    | /routines      | ✅    | 200,401             | BE2 |
| R-03 | ROUTINE | 루틴 상세         | /routines | /{id}                            | GET    | /routines/{id} | ✅    | 200,401,404         | BE2 |
| R-04 | ROUTINE | 루틴 수정         | /routines | /{id}                            | PATCH  | /routines/{id} | ✅    | 200,400,401,403,404 | BE2 |
| R-05 | ROUTINE | 루틴 삭제         | /routines | /{id}                            | DELETE | /routines/{id} | ✅    | 204,401,403,404     | BE2 |

- R-01 요청/응답
```
// Request
{
  "date": "2025-09-08",
  "sleepHours": 7.5,
  "exerciseType": "RUN",
  "exerciseMinutes": 30,
  "meals": "아:계란, 점:샐러드, 저:닭가슴살",
  "waterMl": 1800,
  "note": "야식 참음"
}
// 201 Response
{
  "id":"uuid","date":"2025-09-08","sleepHours":7.5,
  "exerciseType":"RUN","exerciseMinutes":30,"meals":"…","waterMl":1800,"note":"…",
  "createdAt":"2025-09-08T00:00:00Z","updatedAt":"2025-09-08T00:00:00Z"
}
// 409 Response
{ "code":"ROUTINE_DUPLICATE","message":"Routine already exists for that date","details":{"date":"2025-09-08"} }

```  
- R-02 응답 (페이지네이션)
```  
{
  "page": 1,
  "size": 20,
  "totalElements": 134,
  "totalPages": 7,
  "content": [
    {
      "id":"uuid","date":"2025-09-08",
      "sleepHours":7,"exerciseType":"RUN","exerciseMinutes":30,
      "waterMl":2000,
      "summary":{"commentCount":2,"likeCount":5,"meLiked":true}
    }
  ]
}

```
  
---

### 7.3 COMMENT-SERVICE (댓글 관리)

| No   | Domain  | Description | Base URL  | Detailed URL   | Method | Full URL                | Auth | 응답코드                | 담당  |
| ---- | ------- | ----------- | --------- | -------------- | ------ | ----------------------- | ---- | ------------------- | --- |
| C-01 | COMMENT | 댓글 작성       | /routines | /{id}/comments | POST   | /routines/{id}/comments | ✅    | 201,400,401,404     | BE3 |
| C-02 | COMMENT | 댓글 목록       | /routines | /{id}/comments | GET    | /routines/{id}/comments | ✅    | 200,401,404         | BE3 |
| C-03 | COMMENT | 댓글 수정       | /comments | /{id}          | PATCH  | /comments/{id}          | ✅    | 200,400,401,403,404 | BE3 |
| C-04 | COMMENT | 댓글 삭제       | /comments | /{id}          | DELETE | /comments/{id}          | ✅    | 204,401,403,404     | BE3 |

- C-01 요청/응답
  
```
// Request
{ "content": "오늘 운동 멋지네요!" }
// 201 Response
{ "id":"uuid","routineId":"uuid","user":{"id":"uuid","nickname":"alice"},"content":"오늘 운동 멋지네요!","createdAt":"2025-09-08T10:00:00Z" }

```

---

### 7.4 LIKE-SERVICE (좋아요 관리)

| No. | Domain | Description | Base URL  | Detailed URL | Http Method | Full URL             | 담당자 (BE) | 상태   |
| --- | ------ | ----------- | --------- | ------------ | ----------- | -------------------- | -------- | ---- |
| 1   | LIKE   | 좋아요 토글      | /routines | /{id}/like   | POST        | /routines/{id}/like  | BE3      | 진행예정 |
| 2   | LIKE   | 좋아요 개수 조회   | /routines | /{id}/likes  | GET         | /routines/{id}/likes | BE3      | 진행예정 |

- L-01 응답

```
{ "routineId":"uuid", "liked": true, "likeCount": 6 }
```
---

### 7.5 STATS-SERVICE (통계 관리)

| No. | Domain | Description | Base URL | Detailed URL | Http Method | Full URL                          | 담당자 (BE) | 상태   |
| --- | ------ | ----------- | -------- | ------------ | ----------- | --------------------------------- | -------- | ---- |
| 1   | STATS  | 주간 통계 조회    | /stats   | /weekly      | GET         | /stats/weekly?userId=\&startDate= | BE2      | 진행예정 |
| 2   | STATS  | 월간 통계 조회    | /stats   | /monthly     | GET         | /stats/monthly?userId=\&month=    | BE2      | 진행예정 |

- S-01 응답 (주간)

```
{
  "range": ["2025-09-08","2025-09-14"],
  "summary": { "sleepAvg": 6.9, "exerciseCount": 4, "waterTotal": 13200 },
  "byDay": [
    {"date":"2025-09-08","sleep":7.0,"exercise":true,"water":1800},
    {"date":"2025-09-09","sleep":6.5,"exercise":false,"water":1500}
  ]
}
```
  
- S-02 응답 (달력 배지)

```
{
  "month": "2025-09",
  "days": [
    {"date":"2025-09-01","hasRoutine":false},
    {"date":"2025-09-02","hasRoutine":true}
  ]
}
```
---

### 8. 오류 코드 표 (공통)

| 코드                 | HTTP | 메시지                            | 설명        |
| ------------------ | ---- | ------------------------------ | --------- |
| AUTH\_REQUIRED     | 401  | Authentication required        | 토큰 없음/만료  |
| FORBIDDEN          | 403  | Forbidden                      | 소유자 아님    |
| NOT\_FOUND         | 404  | Not found                      | 리소스 없음    |
| USER\_DUPLICATE    | 409  | Email or nickname already used | 가입 중복     |
| ROUTINE\_DUPLICATE | 409  | Routine already exists         | 하루 1루틴 위반 |
| VALIDATION\_FAILED | 400  | Validation failed              | 필드 검증 오류  |
| SERVER\_ERROR      | 500  | Server error                   | 내부 오류     |


---
### 9. 테스트 케이스(샘플)

| TC    | 시나리오     | 단계                  | 기대 결과        |
| ----- | -------- | ------------------- | ------------ |
| TC-01 | 회원가입 성공  | POST /auth/register | 201, 유저 생성   |
| TC-02 | 로그인 성공   | POST /auth/login    | 200, JWT 발급  |
| TC-03 | 루틴 중복 방지 | 루틴 2회 생성            | 2번째 409      |
| TC-04 | 권한 검증    | 타 사용자 루틴 수정         | 403          |
| TC-05 | 좋아요 토글   | 토글 2회               | true → false |

---
---
### 10. 변경 관리 & 버전 정책
- 브레이킹 체인지: 메이저 버전 증가(v2)

- 비호환 없는 추가: 마이너 증가(v1.1)

- 버그픽스/문구 변경: 패치 증가(v1.0.1)

- OpenAPI 문서(/swagger-ui)와 이 명세 동기화 필수
---
## 🗄️ 11. DB ERD 다이어그램

### 📌 User–Routine–Comment–Like 관계 ERD


---

## 🚀 12. 향후 계획(확장성성)

* 친구 팔로우/공유 기능
* 목표 설정 및 알림 기능
* 모바일 앱 확장 (React Native)
* AI 기반 건강 루틴 추천 기능

---


