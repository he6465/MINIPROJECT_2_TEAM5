# Health Routine Tracker의 MSA 전환 및 CLOUD 환경 배포

## 📋 프로젝트 개요

Health Routine Tracker는 사용자의 일일 건강 루틴을 관리할 수 있는 웹 애플리케이션입니다.
해당 프로그램을 Spring Cloud를 활용한 MSA 구조 전환 및 Cloud Native한 환경에서 개발 및 구축을 진행하고
CI/CD 파이프라인 구축 및 무중단 배포를 위한 전략 수립을 목표로 프로젝트를 진행합니다

### 🛠️ 기술 스택
- **백엔드**: Spring Boot 3.x + JWT + MariaDB
- **프론트엔드**: React + TypeScript + Vite + React Query
- **서버**: AWS

## 📱 주요 기능

### 사용자 관리 / 루틴 관리 / 소셜 기능을 서로 분리하여 의존성을 분리하고 독립적으로 기능하게 하는것이 목표 

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

## 🐛 문제 해결

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

**즐거운 개발 되세요! 🚀**
