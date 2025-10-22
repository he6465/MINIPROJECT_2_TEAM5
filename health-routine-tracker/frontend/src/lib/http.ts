import axios from 'axios';

export const http = axios.create({
  // Dev 기본은 상대 경로로 설정해 MSW가 안정적으로 가로채도록 함
  baseURL: import.meta.env.VITE_API_BASE_URL || '/v1',
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrt:token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // 공개 리드 요청 중 발생한 401에 대해서는 리다이렉트하지 않음
      const method = err?.config?.method?.toUpperCase();
      if (method === 'GET') return Promise.reject(err);
      try {
        localStorage.removeItem('hrt:token');
        localStorage.removeItem('hrt:user');
      } catch {}
      if (typeof window !== 'undefined') {
        const isAlreadyLogin = window.location.hash?.startsWith('#/login');
        if (!isAlreadyLogin) {
          const base = (import.meta as any).env?.BASE_URL || '/';
          const target = `${base}#/login`;
          window.location.replace(target);
        }
      }
    }
    return Promise.reject(err);
  }
);


