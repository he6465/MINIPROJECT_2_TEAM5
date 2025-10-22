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
  // 빌드 시 기본 경로 설정 (백엔드 컨텍스트 경로와 일치)
  base: '/v1/',
  
  // 사용할 Vite 플러그인들
  plugins: [
    // React 지원을 위한 플러그인
    react()
  ],
  
  // 개발 서버 설정
  server: {
    // 개발 서버 포트 번호
    port: 5173,
    // 포트가 사용 중일 때 다른 포트로 자동 변경하지 않음
    strictPort: true,
    // 모든 네트워크 인터페이스에서 접근 가능하도록 설정
    host: true,
    // API 프록시 설정 (개발 시 CORS 문제 해결)
    proxy: {
      // /v1 경로로 시작하는 모든 요청을 백엔드로 프록시
      '/v1': {
        // 백엔드 서버 주소
        target: 'http://localhost:8080',
        // Origin 헤더를 타겟 서버의 Origin으로 변경
        changeOrigin: true,
      },
    },
  },
  
  // 테스트 환경 설정 (Vitest)
  test: {
    // 테스트 환경을 jsdom으로 설정 (브라우저 환경 시뮬레이션)
    environment: 'jsdom',
    // 전역 테스트 함수들 사용 가능하도록 설정 (describe, it, expect 등)
    globals: true,
    // 테스트 실행 전에 실행할 설정 파일
    setupFiles: './src/setupTests.ts',
    // CSS 파일을 테스트에서 처리하도록 설정
    css: true,
  }
})
