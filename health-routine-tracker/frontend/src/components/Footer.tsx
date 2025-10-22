// React 17+ JSX Transform 사용으로 명시 import 불필요

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '24px 0' }}>
      <div className="app-container" style={{ textAlign: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: 14 }}>
          © {new Date().getFullYear()} Health Routine Tracker. 건강한 습관을 만들어가는 여정에 함께합니다.
        </div>
      </div>
    </footer>
  );
}


