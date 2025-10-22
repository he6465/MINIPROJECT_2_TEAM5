@echo off
echo ========================================
echo Health Routine Tracker 빌드 및 실행
echo ========================================

echo.
echo [1/4] 프론트엔드 빌드 중...
cd frontend
call npm install
call npm run build --silent
echo 프론트엔드 빌드 완료!

echo.
echo [2/4] 빌드 결과물을 백엔드로 복사 중...
powershell -NoProfile -Command "Copy-Item -Recurse -Force 'dist\*' '..\backend\src\main\resources\static\'"
echo 복사 완료!

echo.
echo [3/4] 백엔드 빌드 중...
cd ..\backend
call gradlew.bat clean build -x test
echo 백엔드 빌드 완료!

echo.
echo [4/4] 애플리케이션 실행 중...
echo.
echo ========================================
echo 애플리케이션이 실행되었습니다!
echo ========================================
echo 메인 애플리케이션: http://localhost:8081/v1/#/
echo 루틴 목록: http://localhost:8081/v1/#/posts
echo 로그인: http://localhost:8081/v1/#/login
echo Swagger UI: http://localhost:8081/v1/swagger-ui.html
echo ========================================
echo.
echo 종료하려면 Ctrl+C를 누르세요.
echo.

java -jar .\build\libs\health-routine-tracker-0.0.1-SNAPSHOT.jar
