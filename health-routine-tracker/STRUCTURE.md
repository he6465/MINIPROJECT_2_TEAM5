# Health Routine Tracker - MSA 구조

## ✅ 현재 서비스 구성 (Plan_v2.md 기준)

```
Gateway (8080) → Eureka (8761)
    ├── Auth Service (8081)
    ├── Routine Service (8082)
    ├── Comment Service (8083)
    ├── Like Service (8084)
    └── Stats Service (8085)

Infrastructure:
- MariaDB (3306)
- Redis (6379)
```

## 📁 폴더 구조

```
health-routine-tracker/
├── gateway/              ✅ API Gateway
├── eureka-server/        ✅ Service Discovery
├── auth-service/         ✅ 인증/인가
├── routine-service/      ✅ 루틴 CRUD
├── comment-service/      ✅ 댓글
├── like-service/         ✅ 좋아요
├── stats-service/        ✅ 통계
├── frontend/             ✅ React
├── docs/                 ✅ MSA 문서들
│   ├── MSA_DESIGN.md
│   ├── BOUNDARIES.md
│   └── SECRETS.md
├── docker-compose-msa.yml ✅ MSA용 Docker Compose
├── build-all-msa.sh       ✅ 빌드 스크립트
└── EXECUTION_GUIDE.md     ✅ 실행 가이드
```

## ❌ 불필요한 파일들

- `backend/` - 구버전 모놀리스 (MSA 전환 완료)
- `docker-compose.yml` - 구버전 컴포즈 파일
- `build-and-run.*` - 구버전 빌드 스크립트

## 🚀 실행 방법

```bash
# 빌드
./build-all-msa.sh

# 실행
docker-compose -f docker-compose-msa.yml up -d

# 확인
curl http://localhost:8080/actuator/health
```

