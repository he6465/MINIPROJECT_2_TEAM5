import { http, HttpResponse } from 'msw';

export const handlers = [
  // health
  http.get('/v1/health', () => HttpResponse.json({ status: 'ok' })),
  // auth (데모) - 백엔드 ApiResponse 래핑과 동일한 구조로 반환
  http.post('/v1/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    if (!body.email) return new HttpResponse('Bad Request', { status: 400 });
    return HttpResponse.json({ success: true, data: { token: 'mock-token', user: { id: 'u1', email: body.email, nickname: 'guest' } } });
  }),
  http.post('/v1/auth/register', async ({ request }) => {
    const body = await request.json() as any;
    if (!body.email || !body.username || !body.nickname) return new HttpResponse('Bad Request', { status: 400 });
    return HttpResponse.json({ success: true, data: { id: 'u2', email: body.email, username: body.username, nickname: body.nickname, createdAt: new Date().toISOString() } }, { status: 201 });
  }),
  // stats proxy-like mock to avoid CORS during dev if backend not running
  http.get('/v1/stats/weekly', ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get('startDate') ?? '2025-09-08';
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().slice(0,10);
      return { date: ds, sleep: 0, exercise: 0, water: 0 };
    });
    return HttpResponse.json({ success: true, data: { range: [start, start], data: days, summary: { sleepAvg: 0, exerciseCount: 0, waterTotal: 0 } } });
  }),
];


