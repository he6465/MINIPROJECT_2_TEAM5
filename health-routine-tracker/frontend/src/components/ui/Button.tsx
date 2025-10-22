import React from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'ghost' | 'danger' | 'outline';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  to?: string; // 제공 시 링크로 렌더링
};

export default function Button({ variant = 'primary', style, to, children, disabled, className, ...rest }: Props) {
  const base: React.CSSProperties = {
    borderRadius: 12,
    border: '1px solid transparent',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'transform 150ms ease, box-shadow 150ms ease, filter 150ms ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    lineHeight: 1.1,
  };
  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: 'var(--green-700)',
      color: '#ffffff',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--green-700)',
      border: '1px solid var(--green-700)'
    },
    danger: { background: '#ef4444', color: '#ffffff' },
    outline: { background: 'transparent', color: 'var(--color-fg)', border: '1px solid var(--color-border)' },
  };
  const hover: React.CSSProperties = variant === 'primary'
    ? { filter: 'brightness(1.03)', boxShadow: '0 8px 24px rgba(38,155,97,0.25)' }
    : { filter: 'none', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' };

  const merged = { ...base, ...variants[variant], ...style } as React.CSSProperties;

  if (to) {
    return (
      <Link to={to} role="button" className={className ? `btn ${className}` : 'btn'} style={{ textDecoration: 'none', ...merged }}
        onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, hover)}
        onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, merged)}>
        {children}
      </Link>
    );
  }
  return <button {...rest} className={className ? `btn ${className}` : 'btn'} disabled={disabled} style={merged}
    onMouseEnter={(e) => Object.assign((e.currentTarget as HTMLElement).style, hover)}
    onMouseLeave={(e) => Object.assign((e.currentTarget as HTMLElement).style, merged)}>{children}</button>;
}


