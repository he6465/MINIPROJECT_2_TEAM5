import { useEffect, useState } from 'react';
import { useCreateRoutine } from '../lib/queries';
import type { ExerciseType, RoutineCreateInput } from '../types/routine';
import { useNavigate } from 'react-router-dom';
import { clearDraft, loadDraft, saveDraft } from '../lib/draft';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useToast } from '../components/ui/Toast';

export default function PostCreate() {
  const navigate = useNavigate();
  const DRAFT_KEY = 'draft:routine:new';
  const [form, setForm] = useState<RoutineCreateInput>(loadDraft<RoutineCreateInput>(DRAFT_KEY) ?? { date: new Date().toISOString().slice(0,10) });
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  useEffect(() => { saveDraft(DRAFT_KEY, form); }, [form]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'sleepHours' || name === 'exerciseMinutes' || name === 'waterMl'
        ? (value === '' ? undefined : Number(value))
        : value,
    }));
  };

  const createMutation = useCreateRoutine();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item = await createMutation.mutateAsync(form);
      // 달력에 즉시 반영되도록 이벤트 브로드캐스트
      try {
        const iso = (form.date ?? new Date().toISOString().slice(0,10));
        window.dispatchEvent(new CustomEvent('hrt:routine-created', { detail: iso }));
      } catch {}
      clearDraft(DRAFT_KEY);
      push('루틴이 등록되었습니다.', 'success');
      navigate(`/posts/${item.id}`);
    } catch (err: any) {
      const msg = err?.message ?? 'ERROR';
      setError(msg);
      push(msg, 'error');
    }
  };

  return (
    <section>
      <h2>루틴 작성</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 640, margin: '0 auto' }}>
        <Input label="날짜" name="date" type="date" value={form.date} onChange={onChange} required />
        <Input label="수면 시간(시간)" name="sleepHours" type="number" min={0} max={16} step={0.1} value={form.sleepHours ?? ''} onChange={onChange} />
        <Select label="운동 종류" name="exerciseType" value={form.exerciseType ?? ''} onChange={onChange}>
          <option value="">선택</option>
          <option value="WALK">WALK</option>
          <option value="RUN">RUN</option>
          <option value="GYM">GYM</option>
          <option value="ETC">ETC</option>
        </Select>
        <Input label="운동 시간(분)" name="exerciseMinutes" type="number" min={0} max={600} step={1} value={form.exerciseMinutes ?? ''} onChange={onChange} />
        <Textarea label="식사 메모(0~1000자)" name="meals" rows={4} maxLength={1000} value={form.meals ?? ''} onChange={onChange} />
        <Input label="물 섭취량(ml)" name="waterMl" type="number" min={0} max={10000} step={50} value={form.waterMl ?? ''} onChange={onChange} />
        <Textarea label="노트(0~1000자)" name="note" rows={4} maxLength={1000} value={form.note ?? ''} onChange={onChange} />
        {error && <div className="card" style={{ color: '#ef4444' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? '등록 중...' : '등록'}</Button>
          <Button variant="ghost" type="button" onClick={() => setForm({ date: new Date().toISOString().slice(0,10) })}>초기화</Button>
        </div>
      </form>
    </section>
  );
}


