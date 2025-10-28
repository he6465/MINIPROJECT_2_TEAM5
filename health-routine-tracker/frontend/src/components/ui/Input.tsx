import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hintId?: string };

export default function Input({ label, error, style, hintId, ...rest }: Props) {
  // 안전장치: value는 있는데 onChange가 없으면 읽기전용 경고가 나오므로
  // defaultValue로 자동 치환하여 경고를 제거하고 의도대로 동작하게 함
  const props: React.InputHTMLAttributes<HTMLInputElement> = { ...rest };
  if (Object.prototype.hasOwnProperty.call(props, 'value') && typeof props.onChange !== 'function') {
    // @ts-ignore - 런타임에서만 치환
    props.defaultValue = props.value as any;
    // @ts-ignore
    delete (props as any).value;
  }
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {label}
      <input {...props} aria-invalid={!!error} aria-describedby={hintId} style={{
        padding: '12px 14px',
        borderRadius: 12,
        border: error ? '1px solid #ef4444' : '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-fg)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        outlineColor: 'var(--lime-300)',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
        ...style
      }} />
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </label>
  );
}


