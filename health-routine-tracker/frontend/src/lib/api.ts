import { http } from './http';
import type { Routine, RoutineCreateInput } from '../types/routine';

type PageResponse<T> = { content: T[]; totalElements: number; totalPages: number; page: number; size: number };
type ApiResponse<T> = { success: boolean; data: T; message?: string };

function mapRoutine(res: any): Routine {
  const dateValue = res?.date ?? res?.routineDate;
  return {
    id: res.id,
    userId: res.userId,
    date: dateValue, // supports monolith (date) and MSA (routineDate)
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
  return (data?.data ?? data);
}

// Account
export async function changePasswordApi(currentPassword: string, newPassword: string) {
  await http.patch<ApiResponse<void>>('/members/me/password', { currentPassword, newPassword });
}
export async function deleteAccountApi() {
  await http.delete('/members/me');
}

export async function listRoutines(params: { userId?: number; from?: string; to?: string; page?: number; size?: number; sort?: string; }) {
  const queryParams: any = { page: params.page ?? 1, size: params.size ?? 20, sort: params.sort ?? 'date,desc' };
  if (params.userId != null) queryParams.userId = params.userId;
  if (params.from && params.from.trim() !== '') queryParams.from = params.from;
  if (params.to && params.to.trim() !== '') queryParams.to = params.to;
  // 공개 목록???�요?�면 /routines/public ?�선 ?�도 (Plan_v2)
  if (params.userId == null) {
    try {
      const pub = await http.get<any>('/routines/public', { params: queryParams });
      if (Array.isArray(pub?.data?.data)) {
        const content = pub.data.data.map((r: any) => mapRoutine(r));
        const size = params.size ?? content.length;
        return { content, totalElements: content.length, totalPages: 1, page: 1, size } as PageResponse<Routine>;
      }
      if (pub?.data?.data?.content) {
        return { ...pub.data.data, content: pub.data.data.content.map((r: any) => mapRoutine(r)) } as PageResponse<Routine>;
      }
    } catch (e: any) {
      // 404/501 ?�엔 기존 /routines�??�백
    }
  }
  const { data } = await http.get<any>('/routines', { params: queryParams });
  if (Array.isArray(data?.data)) {
    const content = data.data.map((r: any) => mapRoutine(r));
    const size = params.size ?? content.length;
    return { content, totalElements: content.length, totalPages: 1, page: 1, size } as PageResponse<Routine>;
  }
  return { ...data.data, content: data.data.content.map((r: any) => mapRoutine(r)) } as PageResponse<Routine>;
}

export async function getRoutine(id: number) {
  const { data} = await http.get<ApiResponse<any>>(`/routines/${id}`);
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
      // 같�? ?�짜 존재 ??id 조회 ??PATCH 갱신
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
    routineDate: input.date,
    sleepHours: input.sleepHours ?? null,
    exerciseType: input.exerciseType ?? null,
    exerciseMinutes: input.exerciseMinutes ?? null,
    meals: input.meals ?? null,
    waterMl: input.waterMl ?? null,
    note: input.note ?? null,
  };
  const { data } = await http.put<any>(`/routines/${id}`, payload);
  return mapRoutine((data?.data ?? data));
}

export async function deleteRoutine(id: number) {
  await http.delete<ApiResponse<any>>(`/routines/${id}`);
}

export async function weeklyStatsApi(userId: number, startDate: string) {
  const { data } = await http.get<ApiResponse<any>>('/stats/weekly', { params: { userId, startDate } });
  return (data?.data ?? data);
}

export async function monthlyCalendarApi(userId: number, month: string) {
  const { data } = await http.get<ApiResponse<any>>('/stats/monthly', { params: { userId, month } });
  return (data?.data ?? data);
}

// Comments - MSA Comment Service 경로
export async function createComment(routineId: number, userId: number, content: string) {
  const { data } = await http.post<any>(`/comments`, { routineId, content });
  return (data?.data ?? data);
}
export async function listCommentsApi(routineId: number, page = 0, size = 10) {
  const { data } = await http.get<any>(`/comments/routine/${routineId}`);
  return (data?.data ?? data); // Comment Service??배열 직접 반환
}
export async function updateCommentApi(id: number, userId: number, content: string) {
  const { data } = await http.put<any>(`/comments/${id}`, { content });
  return (data?.data ?? data);
}
export async function deleteCommentApi(id: number, userId: number) {
  await http.delete(`/comments/${id}`);
}

// Likes - MSA Like Service 경로
export async function toggleLikeApi(routineId: number, userId: number) {
  const { data } = await http.post<ApiResponse<any>>(`/likes/routine/${routineId}`);
  return (data?.data ?? data);
}
export async function likeCountApi(routineId: number) {
  const { data } = await http.get<any>(`/likes/routine/${routineId}/count`);
  return data.count; // 백엔?��? { count: 5 } 직접 반환
}
export async function isLikedByMeApi(routineId: number, userId: number) {
  const { data } = await http.get<any>(`/likes/routine/${routineId}/check`);
  return data.liked; // 백엔?��? { liked: true } 직접 반환
}


