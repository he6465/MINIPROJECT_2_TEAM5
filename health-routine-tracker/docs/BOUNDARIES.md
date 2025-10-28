# Service Boundaries and Data Ownership

## Services
- Auth Service: 인증/인가, 사용자 등록·로그인, JWT 발급/갱신
- Routine Service: 루틴 생성/조회/수정/삭제, 사용자별 루틴 관리
- Comment Service: 루틴 댓글 CRUD
- Like Service: 루틴 좋아요 토글/집계
- Stats Service: 조회 전용 통계(캐시 우선 적용 대상)

## Data Ownership (tables)
- Auth: users, user_roles, refresh_tokens
- Routine: routines, routine_tags
- Comment: comments
- Like: likes
- Stats: 물리 테이블 없음(뷰/집계 쿼리 또는 캐시)

## API Contracts (초안)
- Auth
  - POST /auth/register, POST /auth/login, POST /auth/refresh, GET /auth/me
- Routine
  - GET /routine?page=, POST /routine, GET /routine/{id}, PUT /routine/{id}, DELETE /routine/{id}
- Comment
  - GET /routine/{id}/comments, POST /routine/{id}/comments, PUT /comments/{id}, DELETE /comments/{id}
- Like
  - POST /routine/{id}/like, DELETE /routine/{id}/like, GET /routine/{id}/likes
- Stats
  - GET /stats/top-routines, GET /stats/daily, GET /stats/user/{id}

## Non-Functional
- 인증: 모든 비-조회 엔드포인트는 JWT 필수
- 캐시: Stats, Routine 목록 GET 엔드포인트는 Nginx 캐시 대상
- 트랜잭션: 서비스 경계 간 분산 트랜잭션 금지, 최종 일관성 지향


