/**
 * Vite 빌드 도구 설정 파일
 * 
 * Health Routine Tracker 프론트엔드 애플리케이션의 빌드 및 개발 서버 설정을 정의합니다.
 * Vite는 빠른 개발 서버와 최적화된 프로덕션 빌드를 제공하는 모던 프론트엔드 빌드 도구입니다.
 * 
 * 주요 설정 항목:
 * - React 플러그인 설정
 * - 개발 서버 설정 (포트, 프록시, 호스트)
 * - 빌드 기본 경로 설정
 * - 테스트 환경 설정 (Vitest)
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Vite 설정 객체
 * 
 * 개발 서버, 빌드, 테스트 환경에 대한 설정을 정의합니다.
 * 
 * @see https://vite.dev/config/
 */
export default defineConfig({
  base: '/', // ✅ 여기!
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {                 // ✅ 개발 환경에 맞춰 /api로 바꿔두면 좋습니다.
        target: 'http://localhost:9080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});

