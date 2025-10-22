import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tailwind.css'
import App from './App.tsx'
import { ToastProvider } from './components/ui/Toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from './components/common/ErrorBoundary'
import { worker } from './mocks/browser'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, refetchOnWindowFocus: false },
  },
})

const rootEl = document.getElementById('root')!

async function start() {
  // 개발 중에도 실제 백엔드와 연동할 때는 MSW를 비활성화합니다.
  // VITE_USE_MSW=true 로 실행한 경우에만 MSW를 켭니다.
  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MSW === 'true') {
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
  )
}

start()
