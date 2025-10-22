import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <section className="container page">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>페이지를 찾을 수 없습니다</h2>
        <p className="muted">요청하신 주소가 잘못되었거나 이동되었을 수 있어요.</p>
        <Button onClick={() => {
          const base = (import.meta as any).env?.BASE_URL || '/';
          window.location.replace(`${base}#/`);
        }}>홈으로</Button>
      </div>
    </section>
  );
}


