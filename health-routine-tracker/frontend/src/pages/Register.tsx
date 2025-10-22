import { useState } from 'react';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { setAuth } from '../lib/auth';
import { apiRegister } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { push } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState<{ email?: string; username?: string; nickname?: string; password?: string; password2?: string }>({});
  const [pending, setPending] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = '이메일 형식이 올바르지 않습니다.';
    if (!username.trim()) e.username = '아이디를 입력하세요.';
    if (!nickname.trim() || nickname.length > 50) e.nickname = '닉네임은 1~50자로 입력하세요.';
    if (password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.';
    if (password2 !== password) e.password2 = '비밀번호가 일치하지 않습니다.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setPending(true);
      const data = await apiRegister({ email, username, nickname, password });
      // 가입 후 바로 로그인 페이지로 이동 또는 자동 로그인 정책 선택
      // 여기서는 자동 로그인 없이 안내
      push('회원가입 성공', 'success');
      navigate('/login');
    } catch (err: any) {
      push(err?.message ?? '회원가입 실패', 'error');
    } finally {
      setPending(false);
    }
  };

  return (
    <section style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div className="section-head"><h2>회원가입</h2><span className="muted">1분 만에 시작하세요</span></div>
        <div className="modern-card" style={{ display: 'grid', gap: 12 }}>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }} aria-describedby="register-help">
            <Input label="이메일" type="email" value={email} onChange={e=> setEmail(e.target.value)} error={errors.email} />
            <Input label="아이디" value={username} onChange={e=> setUsername(e.target.value)} error={errors.username} />
            <Input label="닉네임" value={nickname} onChange={e=> setNickname(e.target.value)} error={errors.nickname} />
            <PasswordInput label="비밀번호" value={password} onChange={e=> setPassword(e.target.value)} error={errors.password} />
            <PasswordInput label="비밀번호 확인" value={password2} onChange={e=> setPassword2(e.target.value)} error={errors.password2} />
            <Button type="submit" disabled={pending}>{pending ? '가입 중...' : '가입하기'}</Button>
          </form>
          <span id="register-help" className="muted" style={{ fontSize: 12 }}>비밀번호는 6자 이상, 닉네임은 1~50자입니다.</span>
        </div>
      </div>
    </section>
  );
}


