import React from 'react';

type Variant = 'default' | 'primary' | 'outline';

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  as?: React.ElementType;
};

export default function Badge({ variant = 'default', as: Tag = 'span', className, style, children, ...rest }: Props) {
  const base = 'badge';
  const v = variant === 'primary' ? 'badge-primary' : variant === 'outline' ? 'badge-outline' : '';
  const cls = [base, v, className].filter(Boolean).join(' ');
  return (
    <Tag {...rest} className={cls} style={style}>
      {children}
    </Tag>
  );
}


