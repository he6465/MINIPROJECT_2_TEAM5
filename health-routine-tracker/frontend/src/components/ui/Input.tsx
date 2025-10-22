import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string; hintId?: string };

export default function Input({ label, error, style, hintId, ...rest }: Props) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {label}
      <input {...rest} aria-invalid={!!error} aria-describedby={hintId} style={{
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


