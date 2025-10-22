# Health Routine Tracker

## 📋 프로젝트 개요

Health Routine Tracker는 사용자의 일일 건강 루틴을 관리할 수 있는 웹 애플리케이션입니다.

### 🛠️ 기술 스택
- **백엔드**: Spring Boot 3.x + JWT + MariaDB
- **프론트엔드**: React + TypeScript + Vite + React Query
- **주요 기능**: 루틴 CRUD, 댓글/좋아요, 통계, 캘린더

## 🚀 빠른 시작

### 1. 데이터베이스 설정
```sql
-- MariaDB에서 실행
-- 프로젝트 루트의 Health_Routine_Tracker.sql 파일을 전체 실행
```

### 2. 애플리케이션 실행

#### 방법 1: 자동화 스크립트 (권장)
```bash
# Windows
build-and-run.bat

# Linux/Mac
./build-and-run.sh
```

#### 방법 2: 수동 실행
```powershell
# 프론트엔드 빌드 및 배포
cd health-routine-tracker/frontend
# (처음 1회만) npm ci --silent
npm run build --silent; powershell -NoProfile -Command "Copy-Item -Recurse -Force 'dist\*' '..\backend\src\main\resources\static\'"

# 백엔드 실행
cd ..\backend
./gradlew.bat clean build -x test
java -jar .\build\libs\health-routine-tracker-0.0.1-SNAPSHOT.jar
```

### 3. 접속
- **메인 애플리케이션**: http://localhost:8081/v1/#/
- **Swagger UI**: http://localhost:8081/v1/swagger-ui.html
- **루틴 목록**: http://localhost:8081/v1/#/posts
- **통계**: http://localhost:8081/v1/#/stats
- **로그인**: http://localhost:8081/v1/#/login
- **회원가입**: http://localhost:8081/v1/#/register

## 📖 상세 실행 가이드

**자세한 실행 방법과 문제 해결은 [EXECUTION_GUIDE.md](./EXECUTION_GUIDE.md)를 참조하세요.**

## ✅ 검증 체크리스트

1. 프론트 빌드/복사(프로젝트 루트 기준 또는 frontend 내부)
   - 루트: `cd health-routine-tracker/frontend && npm run build --silent; powershell -NoProfile -Command "Copy-Item -Recurse -Force 'dist\*' '..\backend\src\main\resources\static\'"`
   - 또는 frontend 폴더에서: `npm run build --silent; powershell -NoProfile -Command "Copy-Item -Recurse -Force 'dist\*' '..\backend\src\main\resources\static\'"`
2. 백엔드 빌드/실행
   - `cd ..\backend && .\gradlew.bat clean build -x test && java -jar .\build\libs\health-routine-tracker-0.0.1-SNAPSHOT.jar`
3. 브라우저 확인
   - 메인: `http://localhost:8081/v1/#/`
   - 통계 페이지: 상단에 “AI 인사이트” 카드가 표시되는지 확인
   - AI 키 미설정 시: “AI가 현재 비활성화되어 있습니다...” 안내 문구 표시되면 정상
4. Swagger에서 AI 엔드포인트 테스트
   - `http://localhost:8081/v1/swagger-ui.html` → `POST /v1/ai/insight`
   - 예시 바디:
     ```json
     { "avgSleep": 6.5, "exerciseDays": 3, "avgWater": 1800, "exerciseType": "RUN" }
     ```
   - 200 OK + 한국어 인사이트(또는 비활성 안내) 확인

## 🔧 환경 변수

### 프론트엔드 (.env)
```env
VITE_API_BASE_URL=/v1
VITE_USE_MSW=false
```

### 백엔드
```bash
# JWT 비밀키 (선택사항)
export HRT_JWT_SECRET="your-secret-key-here"

# AI 연동 (선택사항)
export AI_ENABLED=true                     # AI 사용 여부
export OPENAI_API_KEY="sk-..."            # OpenAI(또는 호환) API 키
export OPENAI_MODEL="gpt-3.5-turbo"       # 모델(기본 gpt-3.5-turbo)
export OPENAI_TIMEOUT_MS=10000             # 호출 타임아웃(ms)
```

## 📱 주요 기능

### 사용자 관리
- 회원가입 및 로그인 (JWT 인증)
- 프로필 관리 및 비밀번호 변경

### 루틴 관리
- 일일 건강 루틴 기록 (수면, 운동, 식사, 물 섭취량)
- 루틴 생성, 조회, 수정, 삭제
- 날짜별 루틴 중복 방지

### 소셜 기능
- 루틴에 댓글 작성 및 수정
- 루틴에 좋아요 표시
- 다른 사용자의 루틴 조회

### 통계 및 분석
- 주간/월간 루틴 통계(+ AI 인사이트)
- 캘린더를 통한 월별 현황
- CSV 데이터 내보내기

#### AI 인사이트
- 엔드포인트: `POST /v1/ai/insight`
- 요청(JSON): `{ avgSleep, exerciseDays, avgWater, exerciseType }`
- 응답: text/plain (한국어 인사이트)
- 키 미설정/비활성 시: 안내 문구 반환

## 🐛 문제 해결

### 포트 충돌
```powershell
# 5173 포트 사용 중인 프로세스 확인
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### 데이터베이스 연결 오류
1. MariaDB 서비스 실행 확인
2. 데이터베이스 사용자명/비밀번호 확인
3. 방화벽 설정 확인

## 📊 API 엔드포인트

### 인증
- `POST /v1/auth/register` - 회원가입
- `POST /v1/auth/login` - 로그인

### 루틴
- `GET /v1/routines` - 루틴 목록
- `POST /v1/routines` - 루틴 생성
- `GET /v1/routines/{id}` - 루틴 상세
- `PATCH /v1/routines/{id}` - 루틴 수정
- `DELETE /v1/routines/{id}` - 루틴 삭제

### 댓글/좋아요
- `GET /v1/routines/{id}/comments` - 댓글 목록
- `POST /v1/routines/{id}/comments` - 댓글 작성
- `POST /v1/routines/{id}/like` - 좋아요 토글

## 🔍 개발 도구

- **Swagger UI**: http://localhost:8081/v1/swagger-ui.html
- **Actuator**: http://localhost:8081/v1/actuator/health
- **개발자 Q&A**: http://localhost:8081/v1/#/dev/qa

## 📝 프로젝트 구조

```
health-routine-tracker/
├── backend/                 # Spring Boot 백엔드
│   ├── src/main/java/      # Java 소스 코드
│   ├── src/main/resources/ # 설정 파일
│   └── build.gradle        # Gradle 빌드 설정
├── frontend/               # React 프론트엔드
│   ├── src/               # TypeScript 소스 코드
│   ├── public/            # 정적 파일
│   └── package.json       # NPM 패키지 설정
├── Health_Routine_Tracker.sql # 데이터베이스 스키마
├── EXECUTION_GUIDE.md     # 상세 실행 가이드
└── README.md              # 프로젝트 개요
```

## 🆘 지원

문제가 발생하거나 질문이 있으시면:
1. [EXECUTION_GUIDE.md](./EXECUTION_GUIDE.md)의 문제 해결 섹션 확인
2. 개발자 Q&A 페이지 방문
3. 프로젝트 이슈 등록

---


