import React from 'react';
import Button from '../ui/Button';

type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any): State {
    return { hasError: true, message: err?.message ?? 'Unexpected error' };
  }

  componentDidCatch(error: any, info: any) {
    // TODO: add logging if needed
    console.error('ErrorBoundary', error, info);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="container page">
          <div className="card" style={{ display: 'grid', gap: 12 }}>
            <h2>문제가 발생했어요</h2>
            <div className="muted">{this.state.message}</div>
            <div>
              <Button onClick={() => {
                const base = (import.meta as any).env?.BASE_URL || '/';
                window.location.replace(`${base}#/`);
              }}>홈으로</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


