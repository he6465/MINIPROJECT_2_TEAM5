import { useEffect, useMemo, useState } from 'react';
import { addMonths, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from 'date-fns';
import Section from '../components/Section';
import Button from '../components/ui/Button';
import { monthlyCalendarApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { http } from '../lib/http';

type DayInfo = { date: string; hasRoutine: boolean };

export default function CalendarPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState<Date>(new Date());
  const [days, setDays] = useState<DayInfo[]>([]);
  const userId = Number(auth.user?.id ?? 1);

  useEffect(() => {
    (async () => {
      const month = format(current, 'yyyy-MM');
      try {
        const res: any = await monthlyCalendarApi(userId, month);
        const list: any[] = Array.isArray(res) ? res : (res?.days ?? []);
        setDays(list as DayInfo[]);
      } catch {
        setDays([]);
      }
    })();
  }, [current, userId]);

  // 루틴 생성 이벤트(동일 탭) 및 복귀 시 갱신
  useEffect(() => {
    const onCreated = (e: any) => {
      const iso: string | undefined = e?.detail ?? undefined;
      if (!iso) return;
      setDays(prev => {
        const exists = prev.some(d => d.date === iso);
        return exists ? prev.map(d => d.date === iso ? { ...d, hasRoutine: true } : d)
                      : [...prev, { date: iso, hasRoutine: true }];
      });
    };
    const onFocus = () => {
      // 페이지로 돌아오면 해당 달 재조회
      const month = format(current, 'yyyy-MM');
      monthlyCalendarApi(userId, month).then((res: any) => {
        const list: any[] = Array.isArray(res) ? res : (res?.days ?? []);
        setDays(list as DayInfo[]);
      }).catch(() => {});
    };
    window.addEventListener('hrt:routine-created', onCreated as any);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('hrt:routine-created', onCreated as any);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [current, userId]);

  const calendar = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 0 });
    const cells: { d: Date; info?: DayInfo }[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      const iso = format(d, 'yyyy-MM-dd');
      const info = (Array.isArray(days) ? days : []).find(x => x.date === iso);
      cells.push({ d, info });
    }
    return cells;
  }, [current, days]);

  const go = (delta: number) => setCurrent(prev => addMonths(prev, delta));

  const onDayClick = async (d: Date) => {
    const iso = format(d, 'yyyy-MM-dd');
    try {
      // 404를 피하기 위해 목록 API로 존재 여부 확인
      const { data } = await http.get<{ success: boolean; data: { content: any[] } }>(
        `/routines`, { params: { userId, from: iso, to: iso, page: 1, size: 1 } }
      );
      const id = data?.data?.content?.[0]?.id;
      if (id) navigate(`/posts/${id}`); else navigate('/posts/new');
    } catch {
      navigate('/posts/new');
    }
  };

  return (
    <Section title="달력" subtitle="월간 루틴 한눈에 보기">
      <div className="modern-card" style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button variant="ghost" onClick={() => go(-1)}>{'<'}</Button>
          <strong>{format(current, 'yyyy년 MM월')}</strong>
          <Button variant="ghost" onClick={() => go(1)}>{'>'}</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: 8, textAlign: 'center', color: '#6b7280' }}>
          {['일','월','화','수','목','금','토'].map(w => <div key={w}>{w}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))', gap: 8 }}>
          {calendar.map(({ d, info }) => {
            const inMonth = isSameMonth(d, current);
            const today = isToday(d);
            const has = info?.hasRoutine;
            return (
              <button
                key={d.toISOString()}
                onClick={() => onDayClick(d)}
                className="card"
                style={{
                  padding: 12,
                  textAlign: 'center',
                  aspectRatio: '1 / 1',
                  position: 'relative',
                  opacity: inMonth ? 1 : 0.5,
                  borderColor: today ? 'var(--green-700)' : 'var(--color-border)',
                  background: has ? 'rgba(38,155,97,0.15)' : 'var(--color-surface)'
                }}
                aria-label={format(d, 'yyyy-MM-dd')}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>{format(d, 'd')}</div>
                {has && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 10,
                      height: 10,
                      borderRadius: '999px',
                      background: 'var(--green-700)'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}


