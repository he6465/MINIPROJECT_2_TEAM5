import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hintId?: string };

export default function PasswordInput({ label, error, style, hintId, ...rest }: Props) {
  const [show, setShow] = useState(false);
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {label}
      <div style={{ position: 'relative' }}>
        <input {...rest} type={show ? 'text' : 'password'} aria-invalid={!!error} aria-describedby={hintId} style={{
          padding: '12px 52px 12px 14px',
          borderRadius: 12,
          border: error ? '1px solid #ef4444' : '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-fg)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
          outlineColor: 'var(--lime-300)',
          transition: 'box-shadow 150ms ease, border-color 150ms ease',
          width: '100%',
          boxSizing: 'border-box',
          ...style
        }} />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
          aria-pressed={show}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 32,
            height: 32,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-surface)',
            border: 'none',
            borderRadius: 10,
            boxShadow: 'var(--elevation-1)',
            color: 'var(--color-fg)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e)=>{ (e.currentTarget as HTMLButtonElement).style.background = 'var(--mint-100)'; }}
          onMouseLeave={(e)=>{ (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-surface)'; }}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">{show ? '숨기기' : '표시'}</span>
        </button>
      </div>
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </label>
  );
}


