import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { weeklyStatsApi, monthlyCalendarApi } from './api';
import { useAuth } from './auth';

export async function weeklyStats(anchor: Date = new Date()) {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  const userRaw = localStorage.getItem('hrt:user');
  const userId = userRaw ? (JSON.parse(userRaw).id ?? 1) : 1;
  const res = await weeklyStatsApi(Number(userId), format(start, 'yyyy-MM-dd'));
  // Backend WeeklyStatsRes: { range, summary, byDay }
  // FE 기존 사용: { range, summary, data }
  return { ...res, data: (res as any).byDay ?? (res as any).data ?? [] };
}

export async function monthlyCalendar(anchor: Date = new Date()) {
  const start = startOfMonth(anchor);
  const userRaw = localStorage.getItem('hrt:user');
  const userId = userRaw ? (JSON.parse(userRaw).id ?? 1) : 1;
  const res = await monthlyCalendarApi(Number(userId), format(start, 'yyyy-MM'));
  return res.days ?? res; // API 구조 호환
}


