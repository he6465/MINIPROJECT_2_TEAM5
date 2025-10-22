/**
 * 인증 상태 관리 모듈
 * 
 * Health Routine Tracker 애플리케이션의 사용자 인증 상태를 관리하는 모듈입니다.
 * React의 useSyncExternalStore를 사용하여 localStorage와 동기화된 인증 상태를 제공합니다.
 * 
 * 주요 기능:
 * - JWT 토큰 기반 인증 상태 관리
 * - localStorage를 통한 인증 정보 영속화
 * - React 컴포넌트와 인증 상태 동기화
 * - 로그인/로그아웃 기능
 * - 인증 상태 변경 시 자동 리렌더링
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */

import { useSyncExternalStore } from 'react';
import { apiLogin, apiRegister } from './api';

/**
 * 인증된 사용자 정보 인터페이스
 */
export interface AuthUser {
  /** 사용자 고유 식별자 */
  id: string;
  /** 사용자 이메일 주소 */
  email: string;
  /** 사용자 닉네임 */
  nickname: string;
}

/**
 * 인증 상태 인터페이스
 */
export interface AuthState {
  /** JWT 토큰 (null이면 미인증 상태) */
  token: string | null;
  /** 인증된 사용자 정보 (null이면 미인증 상태) */
  user: AuthUser | null;
  /** 인증 여부 (토큰과 사용자 정보가 모두 존재할 때 true) */
  authenticated: boolean;
}

// localStorage에 저장할 키 값들
const TOKEN_KEY = 'hrt:token';
const USER_KEY = 'hrt:user';

/**
 * localStorage에서 인증 정보를 읽어와 현재 상태를 계산합니다.
 * 
 * @returns AuthState - 현재 인증 상태
 */
function computeSnapshot(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  let user: AuthUser | null = null;
  
  // 사용자 정보 JSON 파싱 (오류 발생 시 null로 처리)
  try { 
    user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null; 
  } catch { 
    user = null; 
  }
  
  return { 
    token, 
    user, 
    authenticated: !!token && !!user 
  };
}

// 현재 인증 상태 스냅샷 (메모리 캐시)
let currentSnapshot: AuthState = computeSnapshot();

/**
 * 현재 인증 상태 스냅샷을 반환합니다.
 * 동일한 값일 때 동일한 참조를 반환하여 useSyncExternalStore의 불필요한 재렌더링을 방지합니다.
 * 
 * @returns AuthState - 현재 인증 상태
 */
function getSnapshot(): AuthState {
  return currentSnapshot;
}

// 인증 상태 변경을 구독하는 리스너들
const listeners = new Set<() => void>();

/**
 * 모든 구독자에게 인증 상태 변경을 알립니다.
 */
function emit() { 
  listeners.forEach((l) => l()); 
}

/**
 * 인증 정보를 설정하고 상태를 업데이트합니다.
 * 
 * @param token JWT 토큰
 * @param user 사용자 정보
 */
export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  currentSnapshot = computeSnapshot();
  emit();
}

/**
 * 인증 정보를 제거하고 상태를 초기화합니다.
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  currentSnapshot = computeSnapshot();
  emit();
}

/**
 * 인증 상태를 구독하는 React 훅입니다.
 * useSyncExternalStore를 사용하여 localStorage 변경사항을 React 컴포넌트와 동기화합니다.
 * 
 * @returns AuthState - 현재 인증 상태
 */
export function useAuth(): AuthState {
  return useSyncExternalStore(
    // 구독 함수: 리스너를 등록하고 정리 함수를 반환
    (cb) => { 
      listeners.add(cb); 
      return () => { listeners.delete(cb); }; 
    },
    // 클라이언트 스냅샷 함수
    getSnapshot,
    // 서버 스냅샷 함수 (SSR 지원)
    getSnapshot,
  );
}

/**
 * 사용자 로그인 함수
 * 
 * 이메일과 비밀번호로 로그인을 시도하고, 성공 시 인증 상태를 업데이트합니다.
 * 
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 * @returns Promise<{token: string, user: AuthUser}> - 로그인 성공 시 토큰과 사용자 정보
 */
export async function login(email: string, password: string) {
  const { token, user } = await apiLogin(email, password);
  setAuth(token, user);
  return { token, user };
}

/**
 * 사용자 로그아웃 함수
 * 
 * 현재 인증 정보를 제거하고 상태를 초기화합니다.
 */
export function logout() {
  clearAuth();
}


