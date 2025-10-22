import Button from '../ui/Button';
import { useAuth } from '../../lib/auth';

export default function CTA() {
  const auth = useAuth();
  const to = auth.authenticated ? '/posts/new' : '/register';
  return (
    <section className="app-container" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <div className="modern-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h3 className="font-bold" style={{ margin: 0 }}>오늘부터 루틴을 시작해 보세요</h3>
          <p className="muted" style={{ margin: 0, marginTop: 4 }}>작은 기록이 큰 변화를 만듭니다.</p>
        </div>
        <Button to={to}>무료로 시작</Button>
      </div>
    </section>
  );
}


