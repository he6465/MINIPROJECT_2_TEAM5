import { useEffect, useState } from 'react';
import type { RoutineCreateInput } from '../types/routine';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoutine, useUpdateRoutine } from '../lib/queries';
import { useToast } from '../components/ui/Toast';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

export default function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<RoutineCreateInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  const { data } = useRoutine(id ?? '');
  useEffect(() => {
    if (!data) return;
    setForm({
      date: data.date,
      sleepHours: data.sleepHours,
      exerciseType: data.exerciseType,
      exerciseMinutes: data.exerciseMinutes,
      meals: data.meals,
      waterMl: data.waterMl,
      note: data.note,
    });
  }, [data]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...(prev ?? { date: '' }),
      [name]: name === 'sleepHours' || name === 'exerciseMinutes' || name === 'waterMl'
        ? (value === '' ? undefined : Number(value))
        : value,
    }));
  };

  const updateMutation = useUpdateRoutine(id ?? '');
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;
    try {
      const item = await updateMutation.mutateAsync(form);
      push('수정이 저장되었습니다.', 'success');
      navigate(`/posts/${item.id}`);
    } catch (err: any) {
      const msg = err?.message ?? 'ERROR';
      setError(msg);
      push(msg, 'error');
    }
  };

  if (!form) return <section className="page"><div className="card">불러오는 중...</div></section>;

  return (
    <section>
      <h2>루틴 수정</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 640 }} aria-describedby="edit-help">
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
          <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? '저장 중...' : '저장'}</Button>
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>취소</Button>
        </div>
        <span id="edit-help" className="muted" style={{ fontSize: 12 }}>필드 변경 후 Enter로 제출할 수 있습니다.</span>
      </form>
    </section>
  );
}


