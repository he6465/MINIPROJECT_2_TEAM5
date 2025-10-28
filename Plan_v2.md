
# 🧩 Health Routine Tracker – MSA 전환 및 클라우드 구축 (Mini Project 2)

## 1. 프로젝트 개요
- **기간:** 2025.10.23 ~ 2025.10.29  
- **팀 구성:** 7명 (FE 3명, BE 3명, DevOps 1명)  
- **목표:** 기존 Health Routine Tracker를 Spring Cloud 기반 MSA 구조로 전환하고, AWS EC2에 CI/CD 및 Nginx 캐싱, 성능 테스트를 구현한다.

## 2. 시스템 아키텍처 개요
### 🔹 서비스 구성
- **Gateway Service** (Spring Cloud Gateway)
- **Auth Service**
- **Routine Service**
- **Comment Service**
- **Like Service**
- **Stats Service**
- 모든 서비스는 **Eureka Server**에 등록되어 동적으로 통신.

### 🔹 인프라 구조
```
[Client] → [API Gateway] → [Nginx Cache Proxy] → [Microservices Cluster]
                                 ↓
                              [Eureka Server]
                                 ↓
                              [MariaDB / Redis]
```
- 배포 환경: AWS EC2 (오하이오 리전)
- 각 서비스 Docker 컨테이너로 실행

### 🔹 단일 EC2 · Docker Compose 토폴로지
```
[client]
   ↓
nginx-cache (80) ──> gateway(8080)
                        │
                        ├─ lb://AUTH-SERVICE(8081)
                        ├─ lb://ROUTINE-SERVICE(8082)
                        ├─ lb://COMMENT-SERVICE(8083)
                        ├─ lb://LIKE-SERVICE(8084)
                        └─ lb://STATS-SERVICE(8085)

eureka(8761) · mariadb(3306) · redis(6379)
```
- 네트워크: bridge `hrt-net`
- 재시작 정책: `restart: unless-stopped`
- 헬스체크: 각 서비스 `/actuator/health` 사용
- 세션: 무상태(JWT) 기반, 게이트웨이/서비스 간 sticky-session 미사용

## 3. 기술 스택
| 구분 | 기술 |
|------|------|
| 프론트엔드 | React, TypeScript, Vite, TailwindCSS |
| 백엔드 | Spring Boot 3.x, Spring Cloud Gateway, Eureka, JPA, MariaDB |
| DevOps | AWS EC2, Nginx, GitHub Actions, Docker, nGrinder |
| 협업도구 | GitHub, Notion, Discord |

## 4. CI/CD 구성 (GitHub Actions · Gradle · 단일 EC2 배포)
### 📦 Workflow 단계
1. **빌드 단계:** Gradle 빌드 및 테스트 실행  
2. **도커화 단계:** 서비스별 Docker 이미지 생성(EC2에서 compose로 실행)  
3. **배포 단계:** GitHub Secrets의 SSH Key로 EC2 접속 후 `docker compose up -d`  
4. **무중단 배포:** 새로운 컨테이너 기동 → `/actuator/health` 통과 → 구버전 종료

```yaml
name: ci-cd

on:
  push:
    branches: [ main ]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'
      - name: Build with Gradle
        run: ./health-routine-tracker/backend/gradlew -p health-routine-tracker/backend clean build -x test
      - name: Sync sources to EC2
        uses: burnett01/rsync-deployments@6.0.0
        with:
          switches: -avz --delete
          path: ./
          remote_path: /home/ec2-user/app
          remote_host: ${{ secrets.EC2_HOST }}
          remote_user: ec2-user
          remote_key: ${{ secrets.EC2_KEY }}
      - name: Deploy on EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_KEY }}
          script: |
            cd /home/ec2-user/app
            docker compose pull || true
            docker compose up -d --build --remove-orphans
```

## 5. 성능 테스트 및 최적화
- **도구:** nGrinder  
- **목표:** Scale-Out 전후 처리량·지연시간·자원 사용 비교 및 병목 도출  
- **지표:** TPS, 평균/95p 응답시간, 오류율, CPU/메모리, DB 커넥션 사용률  
- **시나리오:**
  - Warm-up 2m → Ramp-up 5m → Steady 10m → Ramp-down 3m
  - 동시 사용자: 100 → 300 → 600(스케일아웃) → 900 단계 증가
  - 요청 조합: GET 70%(캐시 대상), POST/PUT/DELETE 30%(비대상)
  - 스케일-인 검증: 2 → 1 인스턴스 축소 시 안정성·성능 변동 확인
- **비교군:**
  - A: 단일 인스턴스(서비스 1개)
  - B: 동일 서비스 2개로 스케일아웃(+Gateway 라운드로빈)
- **관측 포인트:**
  - Nginx `X-Cache-Status` 기반 Hit ratio, 백엔드 QPS 감소율
  - DB 인덱스, 커넥션 풀 고갈, 스레드풀 큐 적체, GC Pause 여부
  - 한계TPS 도달 시점과 원인 기록·개선안 제시

## 6. Nginx 캐싱 전략
- Gateway와 Microservice 사이에 Nginx를 프록시로 배치  
- 캐시 대상: 인증 불필요/개인화 없는 조회 API(`/stats`, `/routine` GET)  
- 비대상: 인증 필요(Authorization 헤더), 개인화 응답, 쓰기 요청(POST/PUT/PATCH/DELETE)  
- 캐시 키: `URI + Query` 기준. Authorization 헤더는 키에 포함하지 않음  
- TTL: 10~60초. 쓰기 이후에는 짧은 TTL(soft-ttl)로 일관성 확보  
- 지표: Hit ratio, 평균/95p 응답시간, 백엔드 QPS 감소율  

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:100m max_size=1g inactive=60s use_temp_path=off;
map $request_method $bypass { default 0; POST 1; PUT 1; PATCH 1; DELETE 1; }
server {
  listen 80;
  location / {
    proxy_pass http://gateway:8080;
    proxy_set_header Host $host;
    proxy_cache api_cache;
    proxy_cache_bypass $http_authorization $bypass;
    proxy_no_cache $http_authorization $bypass;
    proxy_cache_valid 200 10s;
    add_header X-Cache-Status $upstream_cache_status;
  }
}
```

## 7. 테스트 계획
- 단위 테스트: JUnit, Mockito
- 통합 테스트: Postman Collection, Swagger 문서 검증
- 부하 테스트: nGrinder
- 무중단 배포 검증: 롤링 배포 중 사용자 요청 처리 지속 여부 확인

## 7-1. 데이터베이스 및 마이그레이션
- 각 서비스별 데이터 소유권 분리(예: Auth: user/auth_*, Routine: routine_*)
- 마이그레이션 도구: **Flyway**
- 전략: 초기 스키마 `V1__init.sql` → 기능 추가마다 버전 업
- 금지: 서비스 간 테이블 직접 조회. 서비스 간 데이터 접근은 API로만 수행

## 8. AWS 운영 정책
- EC2 인스턴스 운영 시간: 평일 09:00~18:00 (수업 시간 내)
- 리소스 중지 및 보안 규정 준수 (Key/Secret 노출 금지)
- 비용 관리 및 CloudWatch 모니터링 사용

## 8-1. 관측·로그·헬스체크
- 로그: Nginx access log, Gateway/서비스 애플리케이션 로그(JSON 포맷)
- 메트릭: Actuator `/actuator/prometheus`(선택) 또는 시스템 지표(CPU/메모리/디스크)
- 헬스체크: liveness `/actuator/health/liveness`, readiness `/actuator/health/readiness`
- 배포 중 검증: 신규 인스턴스 readiness 통과 후 라우팅 전환

## 8-2. 보안·시크릿 관리
- GitHub Actions Secrets 사용: `EC2_HOST`, `EC2_KEY`, DB 비밀번호 등 저장
- EC2에는 `.env` 파일로 민감정보 주입(레포 커밋 금지), 필요 시 SSM Parameter Store 사용
- 보안그룹 원칙: 외부 80, 443만 개방 / 8761, 808x, 3306, 6379는 내부 통신만 허용

## 9. 일정 (WBS 요약)
| 일자 | 주요 내용 |
|------|------------|
| 10/23 | 프로젝트 기획, WBS 작성, 아키텍처 설계 |
| 10/24 | 서비스 분리 및 Spring Cloud 세팅 |
| 10/25 | 마이크로서비스 구현 (Auth, Routine 등) |
| 10/26 | Nginx 캐싱 및 성능 테스트 구성 |
| 10/27 | CI/CD (GitHub Actions) 구축 |
| 10/28 | 통합 테스트 및 보완 |
| 10/29 | 최종 발표 및 시연 |

## 10. 기대 효과
- 모놀리식 구조의 확장성과 유지보수성 개선
- CI/CD 자동화로 배포 효율 향상
- 캐싱 및 부하 분산을 통한 성능 최적화
- 실제 클라우드 운영 및 DevOps 실무 경험 축적

## 11. 무중단 배포 절차(롤링)
1) 새 이미지로 컨테이너 기동 → 2) readiness `/actuator/health/readiness` OK → 3) SCG 라우팅 대상 교체 → 4) 구버전 그레이스풀 셧다운(`server.shutdown=graceful`)
 - 실패 시 롤백: 이전 compose 버전으로 재기동

## 12. 산출물 매핑
- 프로젝트 수행 계획서: 본 문서(Plan_v2.md)
- WBS: 일정(9장) 상세 버전(엑셀)
- 요구사항 정의서: API/도메인 요구사항과 매핑, Swagger로 최종 검증
- API 명세서: Swagger UI/JSON 산출
- 테스트 결과서: nGrinder 지표(TPS/RT/Hit ratio), CI 로그, 무중단 배포 검증 스크린샷 포함
- 서비스 아키텍처: 2장 토폴로지 다이어그램
- ERD: 서비스별 스키마(Flyway V1 기준) 다이어그램

## 13. 보안그룹 포트 정책(요약)
- 외부 공개: 80(HTTP), 443(HTTPS 선택)
- 내부 전용: 8761(Eureka), 8080(Gateway), 8081~8085(서비스들), 3306(MariaDB), 6379(Redis)
- 원격 접속: 22(SSH, 고정 IP로 제한)

## 14. 성능 목표(정량)
- 스케일아웃 효과: 동일 워크로드 기준 TPS **+30% 이상** 향상
- 응답시간: 95퍼센타일 응답시간 **20% 이상 감소**
- Nginx 캐시: 캐시 대상 엔드포인트 Hit ratio **≥ 50%**, 캐시 구간 평균 RT **30% 이상 감소**
- 안정성: 오류율(**HTTP 5xx**) **≤ 0.5%** 유지, 테스트 전 구간에서 타임아웃 없음

## 15. 위험·완화 계획
- EC2 단일호스트 병목: CPU/네트워크 포화 감지 시 동시 사용자 상한 조정, 서비스 스레드풀/DB 커넥션 풀 상한 튜닝
- DB 인덱스 누락: nGrinder 상위 slow API 쿼리 플랜 점검 후 인덱스 추가(Flyway 마이그레이션 반영)
- 캐시 일관성: 쓰기 이후 짧은 TTL 적용, 필요 시 Admin용 `PURGE` 엔드포인트 제공(내부 접근만)
- 시크릿 노출: GitHub Actions Secrets·EC2 .env만 사용, 레포 커밋 금지 스캔(gitleaks 옵션)
- 빌드 산출물 커밋: `.gitignore` 강화, 기존 산출물 제거 PR 수행
- 롤링 배포 실패: readiness 실패 시 즉시 롤백 스크립트(이전 compose 버전 재기동)
