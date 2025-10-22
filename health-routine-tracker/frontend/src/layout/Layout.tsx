import { Link, NavLink, Outlet } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth, logout } from '../lib/auth';
import React from 'react';
import { User, Sun, Moon } from 'lucide-react';
import Footer from '../components/Footer';

export default function Layout() {
  const auth = useAuth();
  const [theme, setTheme] = React.useState<string>(document.documentElement.getAttribute('data-theme') || 'light');
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('hrt:theme', next); } catch {}
  };
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: 'var(--color-bg)', color: 'var(--color-fg)' }}>
      <a href="#main" className="skip-link">본문으로 건너뛰기</a>
      
      {/* Header */}
      <header className="app-header" role="banner" aria-label="사이트 헤더">
        <div className="app-container" style={{ display: 'flex', height: '80px', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <Link to="/" aria-label="홈" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 900, fontSize: '24px', letterSpacing: '-0.02em', textDecoration: 'none', color: 'inherit', lineHeight: 1 }}>
            <Logo size={56} />
            <span>건강 루틴 트래커</span>
          </Link>
          
          <nav className="hidden md:flex" style={{ gap: '20px' }} aria-label="주요 메뉴">
              <NavLink 
                to="/" 
                end 
                className="text-sm font-medium hover:text-primary transition-colors"
                style={{ color: 'var(--color-fg)' }}
              >
                홈
              </NavLink>
              <NavLink 
                to="/posts" 
                className="text-sm font-medium hover:text-primary transition-colors"
                style={{ color: 'var(--color-fg)' }}
              >
                루틴 목록
              </NavLink>
              {auth.authenticated && (
                <NavLink 
                  to="/posts/new" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  style={{ color: 'var(--color-fg)' }}
                >
                  루틴 작성
                </NavLink>
              )}
              <NavLink 
                to="/stats" 
                className="text-sm font-medium hover:text-primary transition-colors"
                style={{ color: 'var(--color-fg)' }}
              >
                통계
              </NavLink>
              <NavLink 
                to="/calendar" 
                className="text-sm font-medium hover:text-primary transition-colors"
                style={{ color: 'var(--color-fg)' }}
              >
                달력
              </NavLink>
              {auth.authenticated && (
                <NavLink 
                  to="/me" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  style={{ color: 'var(--color-fg)' }}
                >
                  마이페이지
                </NavLink>
              )}
              {import.meta.env.MODE === 'development' && (
                <NavLink 
                  to="/dev/qa" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  style={{ color: 'var(--color-fg)' }}
                >
                  DEV
                </NavLink>
              )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            
            {!auth.authenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  style={{ textDecoration: 'none', color: 'var(--color-fg)' }}
                >
                  로그인
                </Link>
                <Link to="/register" className="text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'var(--color-fg)' }}>
                  회원가입
                </Link>
                <Link to="/stats" className="text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'var(--color-fg)' }}>
                  통계
                </Link>
                <Link to="/login">
                  <button 
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
                    style={{ background: 'var(--green-700)', color: 'white', border: 'none', cursor: 'pointer' }}
                    aria-label="루틴 시작하기"
                  >
                    루틴 시작하기
                  </button>
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <User className="h-4 w-4" style={{ color: 'var(--green-700)' }} />
                  {auth.user?.nickname}
                </span>
                <Link to="/stats" className="text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'var(--color-fg)' }}>
                  통계
                </Link>
                <Link to="/calendar" className="text-sm font-medium hover:text-primary transition-colors" style={{ textDecoration: 'none', color: 'var(--color-fg)' }}>
                  달력
                </Link>
                <Link to="/me">
                  <button 
                    className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    style={{ background: 'var(--mint-100)', color: 'var(--green-700)', border: '1px solid var(--mint-300)', cursor: 'pointer' }}
                    aria-label="마이페이지로 이동"
                  >
                    마이페이지
                  </button>
                </Link>
                <button 
                  onClick={() => logout()} 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-fg)' }}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main id="main" role="main" style={{ flex: 1, position: 'relative', zIndex: 0 }} className="page">
        <div className="app-container">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}


