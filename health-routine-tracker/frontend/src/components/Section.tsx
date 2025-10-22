import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
};

export default function Section({ title, subtitle, children, id }: Props) {
  return (
    <section id={id} className="page">
      <div className="app-container">
        {(title || subtitle) && (
          <div className="section-head" style={{ marginBottom: 8 }}>
            {title && <h2>{title}</h2>}
            {subtitle && <span className="muted">{subtitle}</span>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}


