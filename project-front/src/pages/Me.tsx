import { useRoutines } from '../lib/queries';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Section from '../components/Section';
import RoutineGallery from '../components/RoutineGallery';
import { weeklyStats } from '../lib/stats';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/ui/PasswordInput';
import { useToast } from '../components/ui/Toast';
import { changePasswordApi, deleteAccountApi } from '../lib/api';

function summarize(items: any[]) {
  const total = items.length;
  const waterTotal = items.reduce((s, r) => s + (r.waterMl ?? 0), 0);
  const sleepAvg = items.length ? (items.reduce((s, r) => s + (r.sleepHours ?? 0), 0) / items.length) : 0;
  const exerciseCount = items.filter(r => (r.exerciseMinutes ?? 0) > 0).length;
  return { total, waterTotal, sleepAvg: Number(sleepAvg.toFixed(1)), exerciseCount };
}

export default function Me() {
  const navigate = useNavigate();
  const { data: items = [] } = useRoutines();
  const s = summarize(items as any[]);
  const [weekly, setWeekly] = useState<any>({ summary: { sleepAvg: 0, exerciseCount: 0, waterTotal: 0 }, data: [], range: ['', ''] });
  useEffect(() => { (async () => { try { setWeekly(await weeklyStats()); } catch {} })(); }, []);
  const [pwOpen, setPwOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const { push } = useToast();

  const changePw = async () => {
    if (pw1.length < 6) return push('비밀번호는 6자 이상이어야 합니다.', 'error');
    if (pw1 !== pw2) return push('비밀번호가 일치하지 않습니다.', 'error');
    try {
      await changePasswordApi(currentPw, pw1);
      setPwOpen(false); setCurrentPw(''); setPw1(''); setPw2('');
      push('비밀번호가 변경되었습니다.', 'success');
    } catch (e: any) {
      push(e?.response?.data?.message || '비밀번호 변경 실패', 'error');
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteAccountApi();
      setDelOpen(false);
      push('계정이 삭제되었습니다.', 'success');
      // 토큰/유저 제거 후 홈으로 이동은 별도 화면에서 처리되지만 여기서는 새로고침 유도
      try { localStorage.removeItem('hrt:token'); localStorage.removeItem('hrt:user'); } catch {}
      navigate('/');
    } catch (e: any) {
      push(e?.response?.data?.message || '탈퇴 실패', 'error');
    }
  };

  return (
    <Section title="마이페이지" subtitle="내 기록 요약">
      <div className="modern-card container-narrow" style={{ display: 'grid', gap: 8 }}>
        <div>총 루틴 수: <strong>{s.total}</strong></div>
        <div>평균 수면: <strong>{s.sleepAvg}h</strong></div>
        <div>운동한 날: <strong>{s.exerciseCount}</strong></div>
        <div>총 물 섭취: <strong>{s.waterTotal}ml</strong></div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button variant="ghost" onClick={() => setPwOpen(true)}>비밀번호 변경</Button>
          <Button variant="danger" onClick={() => setDelOpen(true)}>회원 탈퇴</Button>
        </div>
      </div>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="비밀번호 변경" actions={
        <>
          <Button variant="ghost" onClick={() => setPwOpen(false)}>취소</Button>
          <Button onClick={changePw}>변경</Button>
        </>
      }>
        <div style={{ display: 'grid', gap: 8 }}>
          <PasswordInput label="현재 비밀번호" value={currentPw} onChange={e=> setCurrentPw(e.target.value)} />
          <PasswordInput label="새 비밀번호" value={pw1} onChange={e=> setPw1(e.target.value)} />
          <PasswordInput label="새 비밀번호 확인" value={pw2} onChange={e=> setPw2(e.target.value)} />
        </div>
      </Modal>

      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="회원 탈퇴" actions={
        <>
          <Button variant="ghost" onClick={() => setDelOpen(false)}>취소</Button>
          <Button variant="danger" onClick={deleteAccount}>탈퇴</Button>
        </>
      }>
        정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </Modal>

      <div className="container-narrow" style={{ marginTop: 16 }}>
        <h3 className="font-bold" style={{ marginBottom: 8 }}>나의 루틴 변화</h3>
        <RoutineGallery recent={(items as any[]).slice(0,5)} weekly={weekly} avgSleep={weekly?.summary?.sleepAvg ?? 0} exerciseDays={weekly?.summary?.exerciseCount ?? 0} waterTotal={weekly?.summary?.waterTotal ?? 0} />
      </div>
    </Section>
  );
}


