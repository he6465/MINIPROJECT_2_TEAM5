## Health Routine Tracker — Mini Project 2 (MSA/Cloud)

본 문서는 기존 README를 변경하지 않고, 미니프로젝트 2의 요구사항(스프링 클라우드 기반 MSA 전환, SCG 부하분산 및 성능 측정, nginx 캐시 프록시, EC2 배포, CI/CD) 충족을 위한 전용 가이드입니다.

### 목표와 산출물
- **핵심 목표**
  - Spring Cloud를 활용한 MSA 구조 전환: Service Discovery(Eureka), Spring Cloud Gateway(SCG, LB)
  - nGrinder로 SCG Load Balancing Scale-out 성능 리포팅
  - SCG ↔ Service 사이 **nginx 캐시 프록시** 도입 및 효과 검증
  - AWS EC2에서 Cloud Native 환경 구축 및 서비스 운영
  - 선택된 서비스 기준 **CI/CD 파이프라인** 구축 및 무중단 배포 전략 수립
- **최종 산출물**
  - 프로젝트 수행 계획서(WBS 포함), 요구사항 정의서, API 명세(Swagger), 테스트 결과서, 서비스 아키텍처, ERD, 구축 결과 보고서(PPT+PDF)

### 리포지토리 구조 개요
- `backend/`: Spring Boot 기반 백엔드(현 시점 단일 서비스 → 단계적 분리 대상)
- `frontend/`: React + Vite 기반 프런트엔드
- `build-and-run.(sh|bat)`: 로컬/EC2에서 통합 빌드·실행 스크립트
- `EXECUTION_GUIDE.md`: 실행 관련 보조 문서

### 아키텍처(타깃)
- 클라이언트 → SCG(API Gateway + Load Balancing) → nginx Cache Proxy → 개별 Spring Boot 서비스
- Service Discovery(Eureka)로 서비스 인스턴스 동적 등록/탐색
- nGrinder는 SCG 엔드포인트에 부하를 가해 Scale-out 효과 및 캐시 효과 검증

참고 다이어그램(개념):
```
Client(nGrinder) → Spring Cloud Gateway → nginx Cache Proxy → Spring Boot Services
```

> 초기 단계에서는 현재 `backend` 단일 서비스로 시작 후, `user`, `routine`, `social` 등으로 점진 분리합니다.

---

### 팀 구성 및 역할 분담 (7명)
- **아키텍트/백엔드 총괄(1명)**
  - 책임: MSA 설계 원칙·서비스 경계, 공통 모듈(에러/DTO/유틸), API 규약, SCG 라우팅/필터 표준, 보안 가이드
  - 산출물: 아키텍처 다이어그램, 공통 라이브러리, SCG 표준 문서, 설계서
  - KPI: 서비스 간 결합도↓, 공통 모듈 재사용률↑, 변경 리드타임↓
- **DevOps/SRE(1명)**
  - 책임: Docker/Compose, EC2 네트워킹·보안그룹, nginx 캐시 프록시 운영, CI/CD, 무중단 배포, 관측성(로그/메트릭/트레이싱)
  - 산출물: docker-compose, nginx conf, GitHub Actions 워크플로우, 운영 가이드, 대시보드
  - KPI: 배포 MTTR↓, 실패 롤백시간↓, 가용성↑
- **서비스A 오너 — User/Auth(1명)**
  - 책임: 인증/인가, 사용자 도메인, 토큰 전략, Swagger, ERD, 계약 테스트(소비자/제공자)
  - 산출물: user-service API/ERD/Swagger, 통합 테스트, 읽기 API(부하 대상) 정리
  - KPI: Auth 오류율↓, p95↓, 문서 최신성 100%
- **서비스B 오너 — Routine/Stats(1명)**
  - 책임: 루틴·통계 도메인, 조회 최적화, 캐시 키/TTL 협의, DB 인덱스·쿼리 튜닝
  - 산출물: routine-service API/ERD/Swagger, 캐시 후보 리스트, SQL 튜닝 리포트
  - KPI: 캐시 적용 후 p95↓, RPS↑, DB 부하↓
- **서비스C 오너 — Social(게시글/댓글/좋아요)(1명)**
  - 책임: 피드/댓글/좋아요, 정렬·페이지네이션 규약, 쿼리 최적화, Swagger
  - 산출물: social-service API/ERD/Swagger, 인덱스 전략, 읽기 전용 API 부하 후보
  - KPI: 목록 조회 p95↓, 에러율↓
- **프런트엔드 리드(1명)**
  - 책임: 페이지/라우팅, 상태관리, 공통 UI, MSW/테스트 스텁, SCG 베이스URL/토큰 연동, X-Cache-Status 헤더 시각화
  - 산출물: 페이지 구현, e2e 스모크, API 연동 문서, 부하 스크립트 헬퍼
  - KPI: e2e 통과율↑, 사용자 플로우 성공률↑
- **성능/QA 리드(1명)**
  - 책임: nGrinder 시나리오/스크립트/프로파일, 베이스라인→스케일아웃→캐시 비교, 테스트 결과서, 품질 게이트
  - 산출물: 부하 스크립트, 리포트·그래프, 병목 분석/개선안, 테스트 결과서
  - KPI: 리포트 재현성↑, 병목 제거 건수↑

협업 운영(권장)
- 세레모니: 데일리(15m), 위클리 동기화(아키텍트/DevOps/QA/각 서비스/FE)
- 산출물 소유: 서비스 오너(Swagger/ERD), QA(테스트·부하 리포트), DevOps(CI/CD·배포 가이드), 아키텍트(아키텍처 문서)
- 3주 마일스톤: 1주차 스캐폴드·CI/CD·베이스라인 → 2주차 기능+nginx 캐시 PoC+Scale-out 리허설 → 3주차 튜닝/리포트/발표자료

이름 매핑 템플릿(예)
```text
아키텍트: ____ / DevOps: ____ / 성능·QA: ____
User/Auth: ____ / Routine·Stats: ____ / Social: ____ / FE: ____
```

---

### 일정/마일스톤 (10/23–10/29)
- **D-6 | 10/23 킥오프**
  - 역할 확정·산출물 오너 지정, 브랜치 전략 합의
  - 베이스 프로젝트 정리, `Eureka`/`SCG` 스캐폴드, FE 베이스 라우팅
  - CI/CD 초안(빌드만), nGrinder 설치·보안그룹/에이전트 연결
- **D-5 | 10/24**
  - 서비스 보일러플레이트 분리(`user`/`routine`/`social`), 공통 모듈 분리
  - SCG 라우팅/필터 초안, 헬스체크 엔드포인트 정리
  - docker-compose 초안, 베이스라인 부하 설계서 확정
- **D-4 | 10/25**
  - 기능 연결 최소 경로(읽기 API) 완료, Swagger 오픈
  - 캐시 후보 엔드포인트·키·TTL 후보 도출, nginx conf PoC(dev)
  - nGrinder 베이스라인 실행(A: 단일 인스턴스/무캐시), 대시보드 초안
- **D-3 | 10/26**
  - Scale-out 구성(멀티 인스턴스) 및 SCG LB 검증, 테스트 B 실행
  - 병목 분석(네트워크/DB/GC), 1차 튜닝, CI/CD 파이프라인 동작
  - 문서 갱신(아키텍처/ERD/테스트 결과서 초안)
- **D-2 | 10/27**
  - nginx 캐시 적용(C: 멀티+캐시), 키/TTL/무효화 정책 확정, 헤더(X-Cache-Status) 노출
  - B↔C 비교 리포트, 보안·관측성 보완(로그/메트릭/트레이싱)
- **D-1 | 10/28 리허설**
  - 무중단 배포/롤백 리허설, 장애주입 스모크
  - 최종 문서·PPT·데모 스크립트 확정, 발표 리허설
- **D-day | 10/29 발표**
  - 데모·리포트 공유, Q&A 백업 시나리오 준비

게이트 기준(통과 조건)
- SCG 경유 e2e 헬스체크 통과, Swagger 공개
- CI/CD: main 브랜치 빌드·배포 자동화, 실패 시 롤백 스크립트 존재
- 캐시: 읽기 API에 X-Cache-Status 노출, POST/PUT/DELETE 우회 확인
- 성능: 베이스라인 대비
  - Scale-out: RPS 유의미 증가(≥40%↑ 권장), p95 지연 감소
  - 캐시: 캐시 히트율 ≥ 60% 목표, p95 ≥ 30%↓ 또는 RPS ≥ 50%↑ 중 하나

역할별 주 담당(요약)
- 아키텍트: 설계·SCG 표준·문서 게이트 오너
- DevOps: Compose/EC2/nginx/CI-CD/무중단·롤백 리허설
- 서비스 오너 3명: 읽기 API·인덱스·캐시 후보·Swagger·계약 테스트
- FE 리드: 페이지 연동·X-Cache-Status 시각화·e2e 스모크
- 성능/QA: 시나리오·부하 실행·리포트·병목 개선 트래킹

---

### 로컬 빠른 시작(현재 단일 서비스 기준)
#### 전제 조건
- JDK 17+
- Node.js 18+ (권장 20 LTS)
- Git, Gradle Wrapper, npm

#### 1) 백엔드 실행
```bash
cd backend
./gradlew bootRun   # Windows: gradlew.bat bootRun
```
- 기본 포트는 `application.yml` 설정을 따릅니다.

#### 2) 프런트엔드 실행
```bash
cd frontend
npm ci
npm run dev
```

#### 3) 통합 스크립트(선택)
```bash
# Unix
./build-and-run.sh
# Windows
build-and-run.bat
```

---

### Spring Cloud 전환 가이드(설계/구현 체크리스트)
- **Eureka Server 구성**
  - 별도 모듈 또는 독립 인스턴스로 배치
  - 각 서비스 및 SCG가 Eureka에 등록/조회
- **Spring Cloud Gateway 구성**
  - 라우팅: `lb://{serviceId}` 패턴 사용
  - 필터: 인증/인가, 로깅/추적, Rate Limiting(옵션)
- **서비스 분리**(예시)
  - `user-service`, `routine-service`, `social-service`
  - 공통 모듈 분리(공통 DTO/에러/유틸)
- **환경 분리**
  - `dev`/`prod` 프로파일, `application-{profile}.yml`

예시(SCG 라우팅) — 제안 스니펫:
```yaml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
      routes:
        - id: routine
          uri: lb://routine-service
          predicates:
            - Path=/api/routines/**
        - id: user
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
```

---

### nginx 캐시 프록시 구성(샘플)
SCG 뒤, 서비스 앞에 nginx를 두고 GET 응답 캐싱을 적용합니다. POST/PUT/DELETE 등 변경성 있는 메서드는 캐시 우회합니다.

```nginx
# /etc/nginx/conf.d/scg-cache.conf
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=scg_cache:200m max_size=2g inactive=10m use_temp_path=off;
map $request_method $no_cache_methods {
  default 0;
  "POST" 1;
  "PUT" 1;
  "PATCH" 1;
  "DELETE" 1;
}

server {
  listen 80;
  server_name _;

  location /api/ {
    proxy_pass http://scg:8080; # SCG 컨테이너/호스트
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_cache scg_cache;
    proxy_cache_bypass $no_cache_methods;
    proxy_no_cache $no_cache_methods;
    proxy_cache_lock on;
    proxy_cache_valid 200 302 10m;
    proxy_cache_valid 404 1m;

    add_header X-Cache-Status $upstream_cache_status always;
  }
}
```
- 캐시 적중률, 응답시간, 백엔드 QPS 변화를 nGrinder/서버 메트릭과 함께 기록합니다.

---

### nGrinder 부하 테스트 가이드(요구사항 대응)
1) **환경 준비**
- Controller 1대, Agent N대(동일 VPC 권장)
- 보안그룹: Controller UI(포트 80/8080), Agent ↔ Controller 통신 포트 허용

2) **시나리오**
- 대상 엔드포인트: SCG의 `/api/...`
- 케이스
  - A. 단일 서비스 인스턴스, 캐시 미사용
  - B. 멀티 인스턴스(Scale-out), 캐시 미사용
  - C. 멀티 인스턴스 + nginx 캐시 사용
- 보고 포인트: RPS, 평균/95p/99p, 에러율, 백엔드 CPU/메모리, 네트워크, 캐시 적중률

3) **샘플 스크립트(Groovy)**
```groovy
import static net.grinder.script.Grinder.grinder
import net.grinder.plugin.http.HTTPRequest
import net.grinder.plugin.http.HTTPPluginControl
import HTTPClient.CookieModule

HTTPPluginControl.getConnectionDefaults().timeout = 10000
CookieModule.setCookiePolicyHandler(null)

def request = new HTTPRequest()

class TestRunner {
  def test()
  {
    def res = request.GET("http://<SCG_HOST>/api/routines?page=0&size=10")
    grinder.logger.info("status=${res.statusCode}")
    assert res.statusCode == 200
  }
}
```

4) **보고서 정리**
- Scale-out이 이론적 2배 성능에 못 미치는 경우 병목 분석(네트워크, DB, 캐시 미적용 구간 등)과 개선안 기술

---

### AWS EC2 배포 가이드(요약)
- 필수 패키지: `docker`, `docker compose`, `nginx`, `openjdk-17-jre`
- 네트워크: 80/443(nginx), SCG/서비스 내부 포트는 보안그룹으로 제한
- 로그/모니터링: CloudWatch Agent 또는 Prometheus + Grafana(선택)

예시 `docker-compose.yml`(개념 예):
```yaml
version: "3.9"
services:
  eureka:
    image: ghcr.io/your-org/eureka:latest
    ports: ["8761:8761"]
  scg:
    image: ghcr.io/your-org/scg:latest
    depends_on: [eureka]
  routine-service:
    image: ghcr.io/your-org/routine-service:latest
    deploy:
      replicas: 2   # scale-out 예시
    depends_on: [eureka]
  nginx:
    image: nginx:1.25
    volumes:
      - ./nginx/scg-cache.conf:/etc/nginx/conf.d/default.conf:ro
      - /var/cache/nginx:/var/cache/nginx
    ports: ["80:80"]
    depends_on: [scg]
```

---

### CI/CD(예: GitHub Actions) — 선택 서비스 적용 권장
- 트리거: `push`/`pull_request`
- 잡 구성: Lint/Build/Test → Docker Build → 레지스트리 푸시 → EC2 배포(ssh)

예시 워크플로우 스니펫:
```yaml
name: ci-cd-backend
on:
  push:
    paths: ["backend/**"]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "17"
      - name: Build
        run: |
          cd backend
          ./gradlew clean build -x test
      - name: Test
        run: |
          cd backend
          ./gradlew test
  docker-deploy:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Docker login
        run: echo ${{ secrets.REGISTRY_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
      - name: Build & Push
        run: |
          docker build -f backend/Dockerfile -t ghcr.io/${{ github.repository }}/routine-service:latest ./backend
          docker push ghcr.io/${{ github.repository }}/routine-service:latest
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /opt/hrt
            docker pull ghcr.io/${{ github.repository }}/routine-service:latest
            docker compose up -d --no-deps routine-service
```

- 무중단 배포: 다중 인스턴스 + nginx/SCG 헬스체크로 순차 갱신 또는 블루/그린 적용

---

### 품질/보안/운영 체크리스트
- 코드 품질: Lint, 단위 테스트, 통합 테스트 기준선 설정
- 보안: 민감정보는 `Secrets Manager`/GitHub Secrets 사용, HTTPS 적용(ACM+ALB 또는 nginx TLS)
- 관측성: 구조적 로그(JSON), 분산추적(OpenTelemetry), 메트릭 수집

---

### API 명세(Swagger)
- SpringDoc(OpenAPI) 사용 시 기본 경로 예: `/swagger-ui/index.html`
- 배포 환경에서는 인증 보호 또는 비활성화 정책 수립

---

### 문서 산출물 체크리스트(템플릿 연계)
- 프로젝트 수행 계획서 / WBS
- 요구사항 정의서(Use Case, 비기능 요구 포함)
- API 명세(Swagger)
- 테스트 결과서(단위/부하/nGrinder 리포트)
- 서비스 아키텍처 & ERD
- 구축 결과 보고서(PPT+PDF, 글꼴 포함)

---

### 커밋/브랜치 전략(권장)
- 브랜치: `main(master)` / `develop` / `feature/*` / `hotfix/*`
- 커밋 메시지 컨벤션: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

### 참고
- 본 README는 미니프로젝트 2 요구사항 달성을 위한 운영 문서입니다. 세부 구현물(예: Eureka/SCG 모듈, Dockerfile/워크플로우, nginx 설정 파일)은 단계적으로 추가됩니다.
