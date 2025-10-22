import { Link } from 'react-router-dom';
import { useRoutines } from '../lib/queries';
import { useAuth } from '../lib/auth';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { applyFilters } from '../lib/listing';
import type { ListFilters } from '../lib/listing';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import RoutineCard from '../components/RoutineCard';
import Skeleton from '../components/ui/Skeleton';
import { Empty } from '../components/ui/State';
import Button from '../components/ui/Button';
import Section from '../components/Section';

export default function PostList() {
  const [sp, setSp] = useSearchParams();
  const userIdParam = sp.get('userId');
  const userIdOverride = userIdParam ? Number(userIdParam) : undefined;
  const { data = [], isLoading } = useRoutines(userIdOverride);
  const auth = useAuth();
  const myIdRaw = auth.user?.id as any;
  const myId = typeof myIdRaw === 'string' ? parseInt(myIdRaw, 10) : Number(myIdRaw ?? 0);
  const parse = (): ListFilters => ({
    page: Number(sp.get('page') ?? 1),
    size: Number(sp.get('size') ?? 20),
    sort: (sp.get('sort') as any) ?? 'date_desc',
    exerciseType: (sp.get('type') as any) ?? '',
    from: sp.get('from') ?? undefined,
    to: sp.get('to') ?? undefined,
    q: sp.get('q') ?? undefined,
  });
  const [f, setF] = useState<ListFilters>(parse());
  useEffect(() => { setF(parse()); }, [sp.toString()]);
  const paged = useMemo(() => applyFilters(data, f), [data, f]);
  const set = (patch: Partial<ListFilters>) => setF(prev => {
    const next = { ...prev, ...patch, page: patch.page ?? prev.page } as ListFilters;
    const params: Record<string,string> = {};
    if (next.page !== 1) params.page = String(next.page);
    if (next.size !== 10) params.size = String(next.size);
    if (next.sort) params.sort = String(next.sort);
    if (next.exerciseType) params.type = String(next.exerciseType);
    if (next.from) params.from = next.from;
    if (next.to) params.to = next.to;
    if (next.q) params.q = next.q;
    setSp(params, { replace: true });
    return next;
  });
  return (
    <Section title="루틴 목록" subtitle="필터를 조합해 원하는 기록만 보세요">
      <div className="modern-card" style={{ display: 'grid', gap: 12 }}>
        {/* 사용자 선택 영역 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap' }}>
          <Input label="사용자 ID" type="number" value={userIdParam ?? ''}
                 onChange={e => setSp(prev => { const p = new URLSearchParams(prev); const v = e.target.value; if (v) p.set('userId', v); else p.delete('userId'); return p; }, { replace: true })} />
          <Input label="닉네임으로 찾기" placeholder="예: hoo" onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const nickname = (e.target as HTMLInputElement).value.trim();
              if (!nickname) { setSp(prev => { const p = new URLSearchParams(prev); p.delete('userId'); return p; }, { replace: true }); return; }
              try {
                const res = await fetch(`/v1/members/lookup?nickname=${encodeURIComponent(nickname)}`);
                if (res.ok) {
                  const data = await res.json();
                  const id = data?.data?.id ?? data?.id;
                  if (id) setSp(prev => { const p = new URLSearchParams(prev); p.set('userId', String(id)); return p; }, { replace: true });
                }
              } catch {}
            }
          }} />
          <Button variant="outline" onClick={() => setSp(new URLSearchParams(), { replace: true })}>전체 보기</Button>
          <Button variant="ghost" onClick={() => setSp(prev => { const p = new URLSearchParams(prev); if (myId) p.set('userId', String(myId)); return p; }, { replace: true })}>내 루틴</Button>
          <Button onClick={() => set({ page: 1 })}>적용</Button>
        </div>

        <div className="filters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px, 1fr))', gap: 12 }}>
          <Input label="시작일" type="date" value={f.from ?? ''} onChange={e => set({ from: e.target.value, page: 1 })} />
          <Input label="종료일" type="date" value={f.to ?? ''} onChange={e => set({ to: e.target.value, page: 1 })} />
          <Select label="운동 종류" value={f.exerciseType ?? ''} onChange={e => set({ exerciseType: e.target.value as any, page: 1 })}>
            <option value="">전체</option>
            <option value="WALK">WALK</option>
            <option value="RUN">RUN</option>
            <option value="GYM">GYM</option>
            <option value="ETC">ETC</option>
          </Select>
          <Select label="정렬" value={f.sort} onChange={e => set({ sort: e.target.value as any })}>
            <option value="date_desc">날짜 내림차순</option>
            <option value="date_asc">날짜 오름차순</option>
          </Select>
          <Input label="검색" placeholder="식사/메모 키워드" value={f.q ?? ''} onChange={e => set({ q: e.target.value, page: 1 })} />
        </div>
      </div>
      {isLoading && (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ display: 'grid', gap: 8 }}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="90%" height={14} />
              <Skeleton width="80%" height={14} />
            </div>
          ))}
        </div>
      )}
      {!isLoading && paged.content.length === 0 && <Empty message="조건에 맞는 루틴이 없습니다." />}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {paged.content.map(r => (
          <RoutineCard key={r.id} item={r} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12, alignItems: 'center' }}>
        <Button variant="outline" onClick={() => set({ page: Math.max(1, f.page - 1) })} disabled={paged.page === 1}>이전</Button>
        <span className="muted">{paged.page} / {paged.totalPages}</span>
        <Button onClick={() => set({ page: Math.min(paged.totalPages, f.page + 1) })} disabled={paged.page === paged.totalPages}>다음</Button>
      </div>
    </Section>
  );
}


