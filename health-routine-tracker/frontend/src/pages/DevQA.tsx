import Button from '../components/ui/Button';
import { create, list, clearAll } from '../lib/routineStore';
import { Link } from 'react-router-dom';
import { addDays, format } from 'date-fns';

export default function DevQA() {
  const items = list();
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h2>개발용 QA</h2>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <strong>빠른 이동</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button to="posts/new">루틴 작성</Button>
          <Button variant="ghost" to="posts">목록</Button>
          <Button variant="ghost" to="stats">통계</Button>
          <Button variant="ghost" to="me">마이페이지</Button>
        </div>
      </div>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <strong>최근 루틴</strong>
        {items.slice(0,5).map(r => (
          <Link key={r.id} to={`/posts/${r.id}`}>{r.date}</Link>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" onClick={() => { clearAll(); location.reload(); }}>초기화</Button>
          <Button onClick={() => {
            clearAll();
            const today = new Date();
            for (let i = 0; i < 7; i++) {
              const d = addDays(today, -i);
              create({
                date: format(d, 'yyyy-MM-dd'),
                sleepHours: 6 + Math.round(Math.random()*30)/10,
                exerciseType: ['WALK','RUN','GYM','ETC'][Math.floor(Math.random()*4)] as any,
                exerciseMinutes: Math.round(Math.random()*60),
                meals: '샘플 식사 기록',
                waterMl: 1200 + Math.round(Math.random()*1200),
                note: '샘플 노트'
              });
            }
            location.reload();
          }}>샘플 데이터 주입</Button>
        </div>
      </div>
    </section>
  );
}


