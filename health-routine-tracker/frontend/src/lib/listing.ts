import type { Routine, ExerciseType } from '../types/routine';

export type SortKey = 'date_desc' | 'date_asc';
export interface ListFilters {
  from?: string;
  to?: string;
  exerciseType?: ExerciseType | '';
  q?: string; // search in meals/note
  sort?: SortKey;
  page: number;
  size: number;
}

export interface Paged<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export function applyFilters(all: Routine[], f: ListFilters): Paged<Routine> {
  let list = [...all];
  if (f.from) list = list.filter(r => r.date >= f.from!);
  if (f.to) list = list.filter(r => r.date <= f.to!);
  if (f.exerciseType) list = list.filter(r => r.exerciseType === f.exerciseType);
  if (f.q && f.q.trim()) {
    const q = f.q.trim().toLowerCase();
    list = list.filter(r => (r.meals ?? '').toLowerCase().includes(q) || (r.note ?? '').toLowerCase().includes(q));
  }
  const sort = f.sort ?? 'date_desc';
  list.sort((a, b) => sort === 'date_desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

  const totalElements = list.length;
  const size = f.size;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const page = Math.min(Math.max(1, f.page), totalPages);
  const start = (page - 1) * size;
  const content = list.slice(start, start + size);
  return { content, page, size, totalElements, totalPages };
}


