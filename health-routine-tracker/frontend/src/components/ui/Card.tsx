import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType };

export default function Card({ as: Tag = 'div', className, style, ...rest }: Props) {
  return (
    <Tag
      {...rest}
      className={className ? `card ${className}` : 'card'}
      style={{ padding: '24px', borderRadius: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--elevation-1)', ...style }}
    />
  );
}


