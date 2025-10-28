# MSA 서비스 분리 설계 확정서

## 1. 서비스 분리 개요

### 1.1 서비스 목록 (5개)
```
┌─────────────────┐
│ API Gateway     │ :8080
│ (Spring Cloud)  │
└────────┬────────┘
         │
    ┌────┴────┬────────┬─────────┬──────────┐
    │         │        │         │          │
┌───▼───┐ ┌──▼──┐ ┌───▼────┐ ┌──▼───┐ ┌───▼────┐
│ Auth  │ │Routine│ │Comment│ │ Like │ │ Stats  │
│:8081  │ │:8082 │ │ :8083 │ │:8084 │ │ :8085  │
└───┬───┘ └──┬──┘ └───┬────┘ └──┬───┘ └───┬────┘
    │        │        │         │         │
    └────────┴────────┴─────────┴─────────┘
                      │
                 ┌────▼────┐
                 │ MariaDB │ :3306
                 │ (공유)  │
                 └─────────┘
```

## 2. 서비스별 상세 설계

### 2.1 Auth Service (인증/인가)
**포트**: 8081  
**책임**: 사용자 인증, JWT 발급/갱신, 사용자 정보 관리

#### API 엔드포인트
```
POST   /auth/register       # 회원가입
POST   /auth/login          # 로그인 (JWT 발급)
POST   /auth/refresh        # 토큰 갱신
GET    /auth/me             # 내 정보 조회
GET    /members/{id}        # 사용자 정보 조회 (public)
GET    /members/lookup      # 닉네임으로 사용자 검색
```

#### 데이터 소유
- **테이블**: `users`, `user_roles`, `refresh_tokens`
- **의존성**: 없음 (독립적)

#### 기술 스택
- Spring Boot 3.4.1
- Spring Security + JWT
- Spring Data JPA
- MariaDB

---

### 2.2 Routine Service (루틴 관리)
**포트**: 8082  
**책임**: 루틴 CRUD, 루틴 목록 조회, 루틴 검색

#### API 엔드포인트
```
POST   /routines            # 루틴 생성
POST   /routines/upsert     # 루틴 업서트
GET    /routines            # 루틴 목록 (페이징, 필터링)
GET    /routines/{id}       # 루틴 상세 조회
PATCH  /routines/{id}       # 루틴 수정
DELETE /routines/{id}       # 루틴 삭제
GET    /routines/by-date    # 특정 날짜 루틴 조회
```

#### 데이터 소유
- **테이블**: `routines`, `routine_tags`
- **외래키**: `user_id` (Auth Service 참조)
  - **참조 방식**: API 호출로 사용자 존재 여부 확인

#### 서비스 간 통신
- **Auth Service 호출**: 사용자 정보 검증 필요 시
  - `GET /members/{id}` 호출

---

### 2.3 Comment Service (댓글 관리)
**포트**: 8083  
**책임**: 루틴 댓글 CRUD

#### API 엔드포인트
```
GET    /routines/{routineId}/comments     # 댓글 목록
POST   /routines/{routineId}/comments     # 댓글 작성
PUT    /comments/{id}                     # 댓글 수정
DELETE /comments/{id}                     # 댓글 삭제
```

#### 데이터 소유
- **테이블**: `comments`
- **외래키**: 
  - `routine_id` (Routine Service 참조)
  - `user_id` (Auth Service 참조)
  - **참조 방식**: API 호출로 존재 여부 확인

#### 서비스 간 통신
- **Routine Service 호출**: 루틴 존재 확인
  - `GET /routines/{id}` 호출
- **Auth Service 호출**: 사용자 정보 확인
  - `GET /members/{id}` 호출

---

### 2.4 Like Service (좋아요 관리)
**포트**: 8084  
**책임**: 루틴 좋아요 토글, 좋아요 수 집계

#### API 엔드포인트
```
POST   /routines/{routineId}/like         # 좋아요 추가
DELETE /routines/{routineId}/like         # 좋아요 취소
GET    /routines/{routineId}/likes        # 좋아요 수 조회
```

#### 데이터 소유
- **테이블**: `likes`
- **외래키**: 
  - `routine_id` (Routine Service 참조)
  - `user_id` (Auth Service 참조)
  - **참조 방식**: API 호출로 존재 여부 확인

#### 서비스 간 통신
- **Routine Service 호출**: 루틴 존재 확인
  - `GET /routines/{id}` 호출

---

### 2.5 Stats Service (통계 조회)
**포트**: 8085  
**책임**: 통계 데이터 조회 (읽기 전용)

#### API 엔드포인트
```
GET    /stats/top-routines               # 인기 루틴 TOP N
GET    /stats/daily                      # 일별 통계
GET    /stats/user/{userId}              # 사용자별 통계
```

#### 데이터 소유
- **테이블**: 없음 (다른 서비스 DB 조회 또는 캐시)
- **전략**: 
  - Redis 캐시 우선 조회
  - 캐시 미스 시 다른 서비스 API 호출하여 집계
  - 주기적 배치로 캐시 갱신

#### 서비스 간 통신
- **Routine Service 호출**: 루틴 데이터 조회
- **Like Service 호출**: 좋아요 데이터 조회
- **Comment Service 호출**: 댓글 데이터 조회

---

## 3. API Gateway 라우팅 설계

### 3.1 라우팅 규칙
```yaml
spring:
  cloud:
    gateway:
      routes:
        # Auth Service
        - id: auth-service
          uri: lb://AUTH-SERVICE
          predicates:
            - Path=/auth/**, /members/**
          filters:
            - RewritePath=/(?<segment>.*), /$\{segment}
        
        # Routine Service
        - id: routine-service
          uri: lb://ROUTINE-SERVICE
          predicates:
            - Path=/routines/**
          filters:
            - RewritePath=/(?<segment>.*), /$\{segment}
        
        # Comment Service
        - id: comment-service
          uri: lb://COMMENT-SERVICE
          predicates:
            - Path=/routines/*/comments/**, /comments/**
          filters:
            - RewritePath=/(?<segment>.*), /$\{segment}
        
        # Like Service
        - id: like-service
          uri: lb://LIKE-SERVICE
          predicates:
            - Path=/routines/*/like/**
          filters:
            - RewritePath=/(?<segment>.*), /$\{segment}
        
        # Stats Service
        - id: stats-service
          uri: lb://STATS-SERVICE
          predicates:
            - Path=/stats/**
          filters:
            - RewritePath=/(?<segment>.*), /$\{segment}
```

### 3.2 인증 필터 적용
```
공개 API (인증 불필요):
- POST /auth/register
- POST /auth/login
- GET  /routines (목록 조회)
- GET  /routines/{id} (상세 조회)
- GET  /stats/** (통계 조회)

인증 필요 API:
- 그 외 모든 POST, PUT, PATCH, DELETE
- GET /auth/me
```

---

## 4. 데이터베이스 전략

### 4.1 공유 데이터베이스 (초기)
- **전략**: 모든 서비스가 동일한 MariaDB 사용
- **장점**: 
  - 빠른 개발 가능
  - 트랜잭션 관리 단순
  - 데이터 일관성 보장
- **단점**: 
  - 서비스 간 결합도 높음
  - 확장성 제한

### 4.2 향후 개선 방향 (Phase 2)
- 서비스별 독립 데이터베이스 분리
- 이벤트 기반 데이터 동기화 (Kafka/RabbitMQ)
- CQRS 패턴 적용 (Stats Service)

---

## 5. 서비스 간 통신 패턴

### 5.1 동기 통신 (REST API)
```
Comment Service → Routine Service
  - 댓글 작성 시 루틴 존재 확인
  - GET /routines/{id}

Like Service → Routine Service
  - 좋아요 추가 시 루틴 존재 확인
  - GET /routines/{id}

Stats Service → All Services
  - 통계 집계 시 데이터 조회
```

### 5.2 인증 토큰 전달
```
Gateway → Service
  - JWT 토큰을 Header에 포함하여 전달
  - Header: Authorization: Bearer {token}

Service → Service
  - 내부 통신 시에도 JWT 전달
  - 각 서비스에서 JWT 검증
```

---

## 6. 트랜잭션 전략

### 6.1 원칙
- **서비스 경계 간 분산 트랜잭션 금지**
- **최종 일관성(Eventual Consistency) 지향**

### 6.2 예외 처리
```
예: 댓글 작성 시 루틴이 삭제된 경우
1. Comment Service가 Routine Service에 루틴 존재 확인
2. 루틴이 없으면 404 에러 반환
3. 클라이언트에서 재시도 또는 에러 처리
```

---

## 7. 캐싱 전략

### 7.1 Redis 캐시 대상
- **Routine 목록**: TTL 60초
- **Stats 데이터**: TTL 300초 (5분)
- **사용자 정보**: TTL 600초 (10분)

### 7.2 Nginx 캐싱
- **GET /routines**: 30초
- **GET /stats/**:  60초

---

## 8. 구현 순서

### Phase 1: 기본 MSA 구축
1. ✅ Eureka Server 구축
2. ✅ API Gateway 구축
3. 🔄 Auth Service 분리
4. 🔄 Routine Service 분리
5. 🔄 Comment Service 분리
6. 🔄 Like Service 분리
7. 🔄 Stats Service 분리

### Phase 2: 고도화
1. 서비스별 독립 DB 분리
2. 이벤트 기반 통신 도입
3. Circuit Breaker 적용 (Resilience4j)
4. 분산 추적 (Zipkin/Sleuth)

---

## 9. 비기능 요구사항

### 9.1 성능
- **응답 시간**: 평균 200ms 이하
- **TPS**: 1000 이상 (nGrinder 테스트)

### 9.2 가용성
- **목표**: 99.9% (연간 8.76시간 다운타임)
- **전략**: 
  - 서비스 다중 인스턴스 배포
  - Health Check 및 자동 재시작

### 9.3 확장성
- **수평 확장**: Docker Compose scale 지원
- **부하 분산**: Eureka + Gateway LoadBalancer

---

## 10. 보안

### 10.1 인증/인가
- **JWT 기반 인증**
- **토큰 갱신 메커니즘** (Refresh Token)
- **역할 기반 접근 제어** (ROLE_USER, ROLE_ADMIN)

### 10.2 통신 보안
- **내부 통신**: HTTP (초기), HTTPS (Phase 2)
- **외부 통신**: HTTPS 필수

---

## 11. 모니터링 & 로깅

### 11.1 모니터링
- **Actuator**: Health, Metrics 엔드포인트
- **Prometheus**: 메트릭 수집 (Phase 2)
- **Grafana**: 대시보드 (Phase 2)

### 11.2 로깅
- **구조화된 로깅**: JSON 형식
- **로그 레벨**: INFO (운영), DEBUG (개발)
- **중앙 집중식 로깅**: ELK Stack (Phase 2)

---

## 12. 배포 전략

### 12.1 Docker Compose (초기)
```yaml
services:
  eureka-server:
  gateway:
  auth-service:
  routine-service:
  comment-service:
  like-service:
  stats-service:
  mariadb:
  redis:
  nginx:
```

### 12.2 AWS EC2 (Phase 2)
- **인스턴스**: t3.medium x 2
- **로드 밸런서**: ALB
- **오토 스케일링**: CPU 70% 기준

---

## 부록: 마이그레이션 체크리스트

### Auth Service
- [ ] 프로젝트 생성 (Spring Initializr)
- [ ] User, UserRole, RefreshToken 엔티티 복사
- [ ] AuthController, UserController 복사
- [ ] UserService, JwtTokenProvider 복사
- [ ] application.yml 설정 (DB, Eureka)
- [ ] 빌드 및 테스트
- [ ] Eureka 등록 확인
- [ ] Gateway 라우팅 설정

### Routine Service
- [ ] 프로젝트 생성
- [ ] Routine, RoutineTag 엔티티 복사
- [ ] RoutineController 복사
- [ ] RoutineService 복사
- [ ] Auth Service 연동 (Feign Client)
- [ ] application.yml 설정
- [ ] 빌드 및 테스트
- [ ] Eureka 등록 확인
- [ ] Gateway 라우팅 설정

### Comment Service
- [ ] 프로젝트 생성
- [ ] Comment 엔티티 복사
- [ ] CommentController 복사
- [ ] CommentService 복사
- [ ] Routine Service 연동 (Feign Client)
- [ ] application.yml 설정
- [ ] 빌드 및 테스트
- [ ] Eureka 등록 확인
- [ ] Gateway 라우팅 설정

### Like Service
- [ ] 프로젝트 생성
- [ ] Like 엔티티 복사
- [ ] LikeController 복사
- [ ] LikeService 복사
- [ ] Routine Service 연동 (Feign Client)
- [ ] application.yml 설정
- [ ] 빌드 및 테스트
- [ ] Eureka 등록 확인
- [ ] Gateway 라우팅 설정

### Stats Service
- [ ] 프로젝트 생성
- [ ] StatsController 복사
- [ ] StatsService 복사 (집계 로직)
- [ ] Redis 캐싱 설정
- [ ] 다른 서비스 연동 (Feign Client)
- [ ] application.yml 설정
- [ ] 빌드 및 테스트
- [ ] Eureka 등록 확인
- [ ] Gateway 라우팅 설정

---

**작성일**: 2025-10-26  
**작성자**: Health Routine Tracker Team  
**버전**: 1.0

