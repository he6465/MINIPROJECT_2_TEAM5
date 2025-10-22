import Button from '../ui/Button';
import { useAuth } from '../../lib/auth';

export default function Hero() {
  const auth = useAuth();
  const primaryTo = auth.authenticated ? '/posts/new' : '/register';
  const secondaryTo = auth.authenticated ? '/posts' : '/posts';
  return (
    <section className="hero-modern app-container" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="badge badge-primary" style={{ marginBottom: 12 }}>꾸준함을 만드는 루틴 트래커</div>
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 56px)', lineHeight: 1.15 }}>하루의 작은 기록이<br />변화를 만듭니다</h1>
      <p className="muted" style={{ maxWidth: 680, margin: '12px auto 24px', fontSize: 'clamp(14px, 1.8vw, 18px)' }}>
        수면·운동·물·메모를 간단히 기록하고, 통계와 피드백으로 성장을 이어가세요.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button to={primaryTo}>지금 시작하기</Button>
        <Button to={secondaryTo} variant="ghost">루틴 살펴보기</Button>
      </div>
    </section>
  );
}


