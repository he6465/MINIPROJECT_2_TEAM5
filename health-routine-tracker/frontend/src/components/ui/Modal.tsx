import React from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function Modal({ open, onClose, title, children, actions }: Props) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100
    }}>
      <div onClick={e => e.stopPropagation()} className="card" style={{ width: 420 }}>
        {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
        <div style={{ marginTop: 8 }}>{children}</div>
        {actions && <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>{actions}</div>}
      </div>
    </div>
  );
}


