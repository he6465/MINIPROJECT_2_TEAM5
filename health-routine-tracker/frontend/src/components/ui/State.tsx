type Props = { message?: string };

export function Empty({ message = '표시할 데이터가 없습니다.' }: Props) {
  return <div className="card muted" role="status" aria-live="polite">{message}</div>;
}

export function ErrorBox({ message = '문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' }: Props) {
  return <div className="card" style={{ color: '#ef4444' }} role="alert">{message}</div>;
}

export function LoadingRows({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card" style={{ display: 'grid', gap: 8 }}>
          <div style={{ height: 20, width: '60%', background: 'linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)', backgroundSize: '200% 100%', animation: 'skeleton 1.2s ease infinite' }} />
          <div style={{ height: 14, width: '90%', background: 'linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)', backgroundSize: '200% 100%', animation: 'skeleton 1.2s ease infinite' }} />
          <div style={{ height: 14, width: '80%', background: 'linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%)', backgroundSize: '200% 100%', animation: 'skeleton 1.2s ease infinite' }} />
        </div>
      ))}
    </div>
  );
}


