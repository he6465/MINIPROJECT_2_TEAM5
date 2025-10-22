import { useState } from 'react';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { login, useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { push } = useToast();
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [pending, setPending] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '이메일 형식이 올바르지 않습니다.';
    if (password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setPending(true);
      await login(email, password);
      push('로그인 성공', 'success');
      navigate('/');
    } catch (err: any) {
      push(err?.message ?? '로그인 실패', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <section style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div className="section-head"><h2>로그인</h2><span className="muted">계정으로 계속하기</span></div>
        {auth.authenticated && <div className="modern-card">이미 로그인되어 있습니다.</div>}
        <div className="modern-card" style={{ display: 'grid', gap: 12 }}>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }} aria-describedby="login-help">
            <Input label="이메일" type="email" value={email} onChange={e=> setEmail(e.target.value)} error={errors.email} />
            <PasswordInput label="비밀번호" value={password} onChange={e=> setPassword(e.target.value)} error={errors.password} />
            <Button type="submit" disabled={pending}>{pending ? '로그인 중...' : '로그인'}</Button>
          </form>
          <span id="login-help" className="muted" style={{ fontSize: 12 }}>이메일/비밀번호를 입력하고 Enter로 제출할 수 있습니다.</span>
        </div>
      </div>
    </section>
  );
}


