import React from 'react';

type Props = {
  title: string;
  value: React.ReactNode;
  accent?: 'primary' | 'accent' | 'highlight';
};

const map: Record<NonNullable<Props['accent']>, string> = {
  primary: 'var(--green-700)',
  accent: 'var(--green-500)',
  highlight: 'var(--lime-300)',
};

export default function Kpi({ title, value, accent = 'primary' }: Props) {
  const color = map[accent];
  return (
    <div className="card kpi" style={{ borderTop: `4px solid ${color}` }}>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
    </div>
  );
}


