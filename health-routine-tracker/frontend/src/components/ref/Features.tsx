export default function Features() {
  const items = [
    { title: '간편 기록', desc: '수면·운동·물·메모를 한 번에.', icon: '📝' },
    { title: '통계 분석', desc: '주간/월간 그래프로 패턴 파악.', icon: '📈' },
    { title: '동기부여', desc: '좋아요·댓글로 꾸준함 유지.', icon: '🤝' },
  ];
  return (
    <section className="app-container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        {items.map((it) => (
          <div key={it.title}>
            <div className="modern-card" style={{ textAlign: 'center', minHeight: 180 }}>
              <div style={{ fontSize: 28 }} aria-hidden="true" role="presentation">{it.icon}</div>
              <h3 className="font-bold" style={{ marginTop: 8 }}>{it.title}</h3>
              <p className="muted" style={{ marginTop: 4 }}>{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .app-container > div[style*="grid"] { grid-template-columns: repeat(2, minmax(220px, 1fr)) !important; }
        }
        @media (max-width: 640px) {
          .app-container > div[style*="grid"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}


