import { http } from './http';
import type { Routine, RoutineCreateInput } from '../types/routine';

type PageResponse<T> = { content: T[]; totalElements: number; totalPages: number; page: number; size: number };
type ApiResponse<T> = { success: boolean; data: T; message?: string };

function mapRoutine(res: any): Routine {
  return {
    id: res.id,
    userId: res.userId,
    date: res.date, // backend uses @JsonProperty("date")
    sleepHours: res.sleepHours ?? undefined,
    exerciseType: res.exerciseType ?? undefined,
    exerciseMinutes: res.exerciseMinutes ?? undefined,
    meals: res.meals ?? undefined,
    waterMl: res.waterMl ?? undefined,
    note: res.note ?? undefined,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
  } as Routine & { userId: number };
}

export async function apiLogin(email: string, password: string) {
  const { data } = await http.post<ApiResponse<{ token: string; user: any }>>('/auth/login', { email, password });
  return data.data;
}

export async function apiRegister(payload: { email: string; username: string; nickname: string; password: string }) {
  const { data } = await http.post<ApiResponse<any>>('/auth/register', payload);
  return data.data;
}

// Account
export async function changePasswordApi(currentPassword: string, newPassword: string) {
  await http.patch<ApiResponse<void>>('/members/me/password', { currentPassword, newPassword });
}
export async function deleteAccountApi() {
  await http.delete('/members/me');
}

export async function listRoutines(params: { userId?: number; from?: string; to?: string; page?: number; size?: number; sort?: string; }) {
  const queryParams: any = { from: params.from, to: params.to, page: params.page ?? 1, size: params.size ?? 20, sort: params.sort ?? 'date,desc' };
  if (params.userId != null) queryParams.userId = params.userId;
  const { data } = await http.get<ApiResponse<PageResponse<any>>>('/routines', { params: queryParams });
  return { ...data.data, content: data.data.content.map(mapRoutine) } as PageResponse<Routine>;
}

export async function getRoutine(id: number) {
  const { data } = await http.get<ApiResponse<any>>(`/routines/${id}`);
  return mapRoutine(data.data);
}

export async function createRoutine(userId: number, input: RoutineCreateInput) {
  const payload = {
    userId,
    routineDate: input.date,
    sleepHours: input.sleepHours ?? null,
    exerciseType: input.exerciseType ?? null,
    exerciseMinutes: input.exerciseMinutes ?? null,
    meals: input.meals ?? null,
    waterMl: input.waterMl ?? null,
    note: input.note ?? null,
  };
  try {
    const { data } = await http.post<ApiResponse<any>>('/routines', payload);
    return mapRoutine(data.data);
  } catch (err: any) {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;
    if (status === 409 || code === 'ROUTINE_DUPLICATE') {
      // 같은 날짜 존재 → id 조회 후 PATCH 갱신
      const { data: found } = await http.get<ApiResponse<any>>('/routines/by-date', { params: { userId, date: input.date } });
      const rid = found.data.id;
      const { data: updated } = await http.patch<ApiResponse<any>>(`/routines/${rid}`, {
        sleepHours: input.sleepHours ?? null,
        exerciseType: input.exerciseType ?? null,
        exerciseMinutes: input.exerciseMinutes ?? null,
        meals: input.meals ?? null,
        waterMl: input.waterMl ?? null,
        note: input.note ?? null,
      });
      return mapRoutine(updated.data);
    }
    throw err;
  }
}

export async function updateRoutine(id: number, input: RoutineCreateInput) {
  const payload = {
    sleepHours: input.sleepHours ?? null,
    exerciseType: input.exerciseType ?? null,
    exerciseMinutes: input.exerciseMinutes ?? null,
    meals: input.meals ?? null,
    waterMl: input.waterMl ?? null,
    note: input.note ?? null,
  };
  const { data } = await http.patch<ApiResponse<any>>(`/routines/${id}`, payload);
  return mapRoutine(data.data);
}

export async function deleteRoutine(id: number) {
  await http.delete<ApiResponse<any>>(`/routines/${id}`);
}

export async function weeklyStatsApi(userId: number, startDate: string) {
  const { data } = await http.get<ApiResponse<any>>('/stats/weekly', { params: { userId, startDate } });
  return data.data;
}

export async function monthlyCalendarApi(userId: number, month: string) {
  const { data } = await http.get<ApiResponse<any>>('/stats/monthly', { params: { userId, month } });
  return data.data;
}

// Comments
export async function createComment(routineId: number, userId: number, content: string) {
  const { data } = await http.post<ApiResponse<any>>(`/routines/${routineId}/comments`, { userId, content });
  return data.data;
}
export async function listCommentsApi(routineId: number, page = 0, size = 10) {
  const { data } = await http.get<ApiResponse<PageResponse<any>>>(`/routines/${routineId}/comments`, { params: { page, size } });
  return data.data;
}
export async function updateCommentApi(id: number, userId: number, content: string) {
  const { data } = await http.patch<ApiResponse<any>>(`/api/comments/${id}`, { userId, content });
  return data.data;
}
export async function deleteCommentApi(id: number, userId: number) {
  await http.delete(`/api/comments/${id}`, { params: { userId } });
}

// Likes
export async function toggleLikeApi(routineId: number, userId: number) {
  const { data } = await http.post<ApiResponse<any>>(`/routines/${routineId}/like`, null, { params: { userId } });
  return data.data;
}
export async function likeCountApi(routineId: number) {
  const { data } = await http.get<ApiResponse<number>>(`/routines/${routineId}/likes`);
  return data.data;
}
export async function isLikedByMeApi(routineId: number, userId: number) {
  const { data } = await http.get<ApiResponse<boolean>>(`/routines/${routineId}/like/me`, { params: { userId } });
  return data.data;
}


