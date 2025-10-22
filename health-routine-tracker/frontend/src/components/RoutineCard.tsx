import { Link } from 'react-router-dom';
import type { Routine } from '../types/routine';

export default function RoutineCard({ item }: { item: Routine }) {
  return (
    <Link to={`/posts/${item.id}`} className="link-card" style={{ textDecoration: 'none' }}>
      <div className="modern-card" style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{item.date}</strong>
          <span className="chip">{item.exerciseType ?? '-'}</span>
        </div>
        <div className="muted" style={{ fontSize: 14 }}>
          수면 {item.sleepHours ?? '-'}h · 운동 {item.exerciseMinutes ?? 0}분 · 물 {item.waterMl ?? 0}ml
        </div>
        {item.meals && <div style={{ color: '#111827' }}>{item.meals.slice(0, 120)}</div>}
      </div>
    </Link>
  );
}


