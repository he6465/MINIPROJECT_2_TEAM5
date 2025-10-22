import React, { createContext, useContext, useState } from 'react';

type ToastType = 'info' | 'success' | 'error';
type ToastMsg = { id: string; text: string; type: ToastType };

const ToastCtx = createContext<{ push: (text: string, type?: ToastType) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('ToastProvider required');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<ToastMsg[]>([]);
  const push = (text: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setList(prev => [...prev, { id, text, type }]);
    setTimeout(() => setList(prev => prev.filter(x => x.id !== id)), 2500);
  };
  const bg = (t: ToastType) => t === 'success' ? 'rgba(52,207,93,0.25)' : t === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(38,155,97,0.2)';
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div role="status" aria-live="polite" style={{ position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8, zIndex: 200 }}>
        {list.map(t => (
          <div
            key={t.id}
            className="card"
            style={{ background: bg(t.type), boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}


