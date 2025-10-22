import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { RoutineCreateInput } from '../types/routine';
import { createRoutine, deleteRoutine, getRoutine, listRoutines, updateRoutine } from './api';
import { useAuth } from './auth';

export const qk = {
  routines: ['routines'] as const,
  routine: (id: string) => ['routine', id] as const,
};

export function useRoutines(userIdOverride?: number) {
  const auth = useAuth();
  const rawId = userIdOverride ?? (auth.user?.id as any);
  const userId = rawId == null
    ? undefined
    : (typeof rawId === 'string' ? parseInt(rawId, 10) : Number(rawId));
  return useQuery({
    queryKey: [...qk.routines, userId ?? 'public'],
    queryFn: async () => (await listRoutines({ userId, size: 50 })).content,
    // 공개 목록은 로그인 불필요
    enabled: true,
  });
}

export function useRoutine(id: string) {
  return useQuery({ queryKey: qk.routine(id), queryFn: async () => getRoutine(Number(id)), enabled: !!id });
}

export function useCreateRoutine() {
  const qc = useQueryClient();
  const auth = useAuth();
  const rawId2 = auth.user?.id;
  const userId = typeof rawId2 === 'string' ? parseInt(rawId2, 10) : Number(rawId2 ?? 1);
  return useMutation({
    mutationFn: async (input: RoutineCreateInput) => createRoutine(userId, input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: qk.routines }); },
  });
}

export function useUpdateRoutine(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RoutineCreateInput) => updateRoutine(Number(id), input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.routines });
      qc.invalidateQueries({ queryKey: qk.routine(id) });
    },
  });
}

export function useDeleteRoutine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteRoutine(Number(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.routines }),
  });
}


