# Health Routine Tracker - 실행 가이드

## 📋 프로젝트 개요

Health Routine Tracker는 사용자의 일일 건강 루틴을 관리할 수 있는 웹 애플리케이션입니다.
- **백엔드**: Spring Boot 3.x + JWT + MariaDB
- **프론트엔드**: React + TypeScript + Vite + React Query
- **주요 기능**: 루틴 CRUD, 댓글/좋아요, 통계, 캘린더

## 🛠️ 사전 준비사항

### 필수 소프트웨어
- **Java 17** 이상
- **Node.js 18** 이상
- **MariaDB 10.6** 이상
- **Git**

### 개발 도구 (선택사항)
- **IntelliJ IDEA** 또는 **VS Code**
- **HeidiSQL** 또는 **DBeaver** (데이터베이스 관리)

## 🗄️ 데이터베이스 설정

### 1. MariaDB 설치 및 실행
```bash
# Windows (Chocolatey 사용 시)
choco install mariadb

# 또는 공식 설치 파일 다운로드
# https://mariadb.org/download/
```

### 2. 데이터베이스 생성 및 스키마 적용
```sql
-- HeidiSQL 또는 DBeaver에서 실행
-- 프로젝트 루트의 Health_Routine_Tracker.sql 파일을 전체 실행
```

### 3. 데이터베이스 연결 확인
- **호스트**: localhost
- **포트**: 3306
- **데이터베이스**: health_routine
- **사용자명**: root
- **비밀번호**: 123456789 (기본값)

## 🚀 애플리케이션 실행

### 방법 1: 자동화 스크립트 사용 (권장)

#### Windows
```bash
# 프로젝트 루트에서 실행
build-and-run.bat
```

#### Linux/Mac
```bash
# 프로젝트 루트에서 실행
./build-and-run.sh
```

### 방법 2: 수동 실행

#### 1. 프론트엔드 빌드 및 배포
```bash
cd health-routine-tracker/frontend
# (처음 1회만) npm ci --silent
npm run build --silent

# Windows (PowerShell 사용)
powershell -NoProfile -Command "Copy-Item -Recurse -Force 'dist\*' '..\backend\src\main\resources\static\'"

# Linux/Mac
cp -r dist/* ../backend/src/main/resources/static/
```

#### 2. 백엔드 빌드 및 실행
```bash
cd health-routine-tracker/backend

# Windows
./gradlew.bat clean build -x test
java -jar .\build\libs\health-routine-tracker-0.0.1-SNAPSHOT.jar

# Linux/Mac
./gradlew clean build -x test
java -jar ./build/libs/health-routine-tracker-0.0.1-SNAPSHOT.jar
```

### 3. 애플리케이션 접속
- **메인 애플리케이션**: http://localhost:8081/v1/#/
- **Swagger UI**: http://localhost:8081/v1/swagger-ui.html
- **헬스 체크**: http://localhost:8081/v1/actuator/health

## 🎨 프론트엔드 빌드 및 배포

### 1. 프로젝트 디렉터리로 이동
```bash
cd health-routine-tracker/frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 프로덕션 빌드
```bash
npm run build --silent
```

### 4. 빌드 결과물을 백엔드로 복사
```bash
# Windows (PowerShell 사용)
powershell -NoProfile -Command "Copy-Item -Recurse -Force 'dist\*' '..\backend\src\main\resources\static\'"

# Linux/Mac
cp -r dist/* ../backend/src/main/resources/static/
```

### 5. 프론트엔드 접속
- **메인 페이지**: http://localhost:8081/v1/#/
- **루틴 목록**: http://localhost:8081/v1/#/posts
- **로그인**: http://localhost:8081/v1/#/login
- **회원가입**: http://localhost:8081/v1/#/register

## 🔧 환경 변수 설정

### 백엔드 환경 변수
```bash
# JWT 비밀키 설정 (선택사항)
export HRT_JWT_SECRET="your-secret-key-here"

# 데이터베이스 설정 (선택사항)
export DB_URL="jdbc:mariadb://localhost:3306/health_routine"
export DB_USERNAME="root"
export DB_PASSWORD="123456789"

# AI 설정 (선택사항)
export AI_ENABLED=true
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-3.5-turbo"
export OPENAI_TIMEOUT_MS=10000
```

### 프론트엔드 환경 변수
```bash
# .env 파일 생성 (선택사항)
VITE_API_BASE_URL=/v1
VITE_USE_MSW=false
```

## 📱 애플리케이션 사용법

### 1. 애플리케이션 접속
- **메인 페이지**: http://localhost:8081/v1/#/
- **해시 라우팅**: URL에 `#/` 경로를 추가하여 직접 접근 가능

### 2. 회원가입 및 로그인
- **회원가입**: http://localhost:8081/v1/#/register
- **로그인**: http://localhost:8081/v1/#/login
- 이메일, 사용자명, 닉네임, 비밀번호 입력
- 로그인 후 메인 페이지로 이동

### 3. 루틴 관리
- **루틴 목록**: http://localhost:8081/v1/#/posts
- **루틴 생성**: http://localhost:8081/v1/#/posts/new
- **루틴 상세**: http://localhost:8081/v1/#/posts/{id}
- **루틴 수정**: http://localhost:8081/v1/#/posts/{id}/edit

### 4. 소셜 기능
- **댓글**: 다른 사용자의 루틴에 댓글 작성
- **좋아요**: 루틴에 좋아요 표시
- **통계 (AI 인사이트 포함)**: http://localhost:8081/v1/#/stats

### 5. 추가 기능
- **캘린더**: http://localhost:8081/v1/#/calendar
- **마이페이지**: http://localhost:8081/v1/#/me
- **CSV 다운로드**: 통계 페이지에서 데이터 내보내기

## 🐛 문제 해결

### 포트 충돌 문제
```bash
# 5173 포트 사용 중인 프로세스 확인
netstat -ano | findstr :5173

# 프로세스 종료
taskkill /PID <PID> /F
```

### 데이터베이스 연결 오류
1. MariaDB 서비스가 실행 중인지 확인
2. 데이터베이스 사용자명/비밀번호 확인
3. 방화벽 설정 확인

### 빌드 오류
```bash
# Gradle 캐시 정리
./gradlew clean

# Node.js 캐시 정리
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📊 API 엔드포인트

### 인증 관련
- `POST /v1/auth/register` - 회원가입
- `POST /v1/auth/login` - 로그인

### 루틴 관련
- `GET /v1/routines` - 루틴 목록 조회
- `POST /v1/routines` - 루틴 생성
- `GET /v1/routines/{id}` - 루틴 상세 조회
- `PATCH /v1/routines/{id}` - 루틴 수정
- `DELETE /v1/routines/{id}` - 루틴 삭제

### 댓글 관련
- `GET /v1/routines/{id}/comments` - 댓글 목록
- `POST /v1/routines/{id}/comments` - 댓글 작성

### 좋아요 관련
- `POST /v1/routines/{id}/like` - 좋아요 토글
- `GET /v1/routines/{id}/likes` - 좋아요 목록

## 🔍 개발 도구

### Swagger UI
- **URL**: http://localhost:8081/v1/swagger-ui.html
- **기능**: API 문서 확인 및 테스트

### Actuator
- **헬스 체크**: http://localhost:8081/v1/actuator/health
- **메트릭**: http://localhost:8081/v1/actuator/metrics
- **정보**: http://localhost:8081/v1/actuator/info

### 개발자 도구
- **개발자 Q&A**: http://localhost:8081/v1/#/dev/qa
- **브라우저 개발자 도구**: F12 키

## 📝 추가 정보

### 프로젝트 구조
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
└── Health_Routine_Tracker.sql # 데이터베이스 스키마
```

### 기술 스택
- **백엔드**: Spring Boot 3.x, Spring Security, JPA/Hibernate, JWT
- **프론트엔드**: React 19, TypeScript, Vite, React Query, Tailwind CSS
- **데이터베이스**: MariaDB
- **빌드 도구**: Gradle, Vite
- **테스트**: JUnit, Vitest, React Testing Library

### 성능 최적화
- **코드 스플리팅**: React.lazy()를 통한 지연 로딩
- **이미지 최적화**: Vite의 자동 이미지 최적화
- **캐싱**: React Query를 통한 API 응답 캐싱
- **번들 최적화**: Vite의 자동 트리 셰이킹

---

## 🆘 지원

문제가 발생하거나 질문이 있으시면:
1. 이 가이드의 문제 해결 섹션을 확인하세요
2. 프로젝트의 README.md 파일을 참조하세요

**즐거운 개발 되세요! 🚀**
