/**
 * Health Routine Tracker 메인 애플리케이션 컴포넌트
 * 
 * React Router를 사용하여 애플리케이션의 라우팅을 설정하고 관리합니다.
 * 인증 상태에 따라 페이지 접근 권한을 제어하며, 지연 로딩을 통해 성능을 최적화합니다.
 * 
 * 주요 기능:
 * - React Router를 통한 SPA 라우팅 관리
 * - 인증 상태 기반 페이지 접근 제어
 * - 지연 로딩(Lazy Loading)을 통한 코드 스플리팅
 * - 전역 레이아웃 적용
 * - 404 페이지 처리
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */

import './App.css'
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import { lazy, Suspense } from 'react'

// 지연 로딩을 위한 페이지 컴포넌트들 - 초기 번들 크기를 줄이기 위해 사용
const Home = lazy(() => import('./pages/Home'))
const PostList = lazy(() => import('./pages/PostList'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const PostCreate = lazy(() => import('./pages/PostCreate'))
const PostEdit = lazy(() => import('./pages/PostEdit'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Me = lazy(() => import('./pages/Me'))
const Stats = lazy(() => import('./pages/Stats'))
const CalendarPage = lazy(() => import('./pages/Calendar'))
const NotFound = lazy(() => import('./pages/NotFound'))
const DevQA = lazy(() => import('./pages/DevQA'))

// 인증 상태를 관리하는 커스텀 훅
import { useAuth } from './lib/auth'

/**
 * 메인 애플리케이션 컴포넌트
 * 
 * React Router를 설정하고 인증 상태에 따른 라우팅을 관리합니다.
 * 
 * @returns JSX.Element - 라우터가 적용된 애플리케이션
 */
function App() {
  // 현재 사용자의 인증 상태를 가져옴
  const auth = useAuth();

  /**
   * React Router 설정
   * 
   * Hash Router를 사용하여 SPA 라우팅을 구현합니다.
   * 각 경로에 대해 인증 상태에 따른 접근 제어를 적용합니다.
   */
  const router = createHashRouter([
    {
      path: '/',
      element: <Layout />, // 공통 레이아웃 적용
      children: [
        // 홈 페이지 (인덱스 라우트)
        { index: true, element: <Home /> },
        
        // 루틴 관련 페이지들
        { path: 'posts', element: <PostList /> }, // 루틴 목록
        { 
          path: 'posts/new', 
          element: auth.authenticated ? <PostCreate /> : <Navigate to="login" replace /> 
        }, // 루틴 생성 (인증 필요)
        { 
          path: 'posts/:id/edit', 
          element: auth.authenticated ? <PostEdit /> : <Navigate to="login" replace /> 
        }, // 루틴 수정 (인증 필요)
        { path: 'posts/:id', element: <PostDetail /> }, // 루틴 상세
        
        // 인증 관련 페이지들
        { 
          path: 'login', 
          element: auth.authenticated ? <Navigate to="/" replace /> : <Login /> 
        }, // 로그인 (이미 인증된 경우 홈으로 리다이렉트)
        { 
          path: 'register', 
          element: auth.authenticated ? <Navigate to="/" replace /> : <Register /> 
        }, // 회원가입 (이미 인증된 경우 홈으로 리다이렉트)
        
        // 사용자 관련 페이지들
        { 
          path: 'me', 
          element: auth.authenticated ? <Me /> : <Navigate to="login" replace /> 
        }, // 마이페이지 (인증 필요)
        
        // 통계 및 캘린더 페이지들
        { path: 'stats', element: <Stats /> }, // 통계 페이지
        { path: 'calendar', element: <CalendarPage /> }, // 캘린더 페이지
        
        // 개발자 도구
        { path: 'dev/qa', element: <DevQA /> }, // 개발자 Q&A 페이지
        
        // 404 페이지 (모든 경로와 매치되지 않는 경우)
        { path: '*', element: <NotFound /> },
      ],
    },
  ])

  return (
    <Suspense fallback={
      <div className="app-container" style={{ padding: 24 }}>
        <div className="card">로딩 중...</div>
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
