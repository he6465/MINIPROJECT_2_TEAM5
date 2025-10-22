import React from 'react';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string };

export default function Select({ label, error, style, children, ...rest }: Props) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      {label}
      <select {...rest} style={{
        padding: '10px 12px',
        borderRadius: 10,
        border: error ? '1px solid #ef4444' : '1px solid #e5e7eb',
        background: '#ffffff',
        color: 'var(--color-fg)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        outlineColor: 'var(--lime-300)',
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        ...style
      }}>
        {children}
      </select>
      {error && <span style={{ color: '#ef4444', fontSize: 12 }}>{error}</span>}
    </label>
  );
}


