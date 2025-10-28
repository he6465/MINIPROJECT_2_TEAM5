# 1) React 빌드 단계 (Debian slim 사용)
FROM node:20-bullseye-slim AS build
WORKDIR /app

# npm 설치 (optional deps 이슈 회피)
COPY package*.json ./
RUN npm install --no-audit --no-fund

# 소스 빌드
COPY . .
# shebang/권한 이슈를 피하려고 node로 직접 실행
RUN node ./node_modules/typescript/bin/tsc -b \
 && node ./node_modules/vite/bin/vite.js build

# 2) Nginx로 정적 파일 서빙
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
