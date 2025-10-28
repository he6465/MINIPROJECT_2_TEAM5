import axios from 'axios';

export const http = axios.create({
  // Dev: Vite proxy (/api -> Gateway), Prod: env base
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrt:token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  // MSA compatibility: many services require X-User-Id header
  try {
    const raw = localStorage.getItem('hrt:user');
    if (raw) {
      const user = JSON.parse(raw);
      const id = typeof user?.id === 'string' ? parseInt(user.id, 10) : Number(user?.id);
      if (id && Number.isFinite(id) && id > 0) {
        config.headers['X-User-Id'] = String(id);
      }
    }
  } catch {}
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Do not redirect on public GETs
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

