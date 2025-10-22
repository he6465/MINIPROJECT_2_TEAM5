import { describe, expect, test } from 'vitest';
import { applyFilters } from './listing';
import type { ListFilters } from './listing';
import type { Routine } from '../types/routine';

const data: Routine[] = [
  { id: '1', date: '2025-09-08', createdAt: '', updatedAt: '', sleepHours: 7, exerciseType: 'RUN', exerciseMinutes: 30, meals: '샐러드', waterMl: 1500 },
  { id: '2', date: '2025-09-09', createdAt: '', updatedAt: '', sleepHours: 6, exerciseType: 'GYM', exerciseMinutes: 60, meals: '스테이크', waterMl: 1800 },
  { id: '3', date: '2025-09-10', createdAt: '', updatedAt: '', sleepHours: 8, exerciseType: 'WALK', exerciseMinutes: 0, meals: '파스타', waterMl: 1200 },
];

test('applyFilters filters by range/type/search and paginates', () => {
  const f: ListFilters = { page: 1, size: 2, sort: 'date_desc', from: '2025-09-08', to: '2025-09-10', exerciseType: '', q: '스' };
  const res = applyFilters(data, f);
  expect(res.totalElements).toBe(2);
  // date_desc에서 가장 최신은 2025-09-10 (id: '3')
  expect(res.content[0].id).toBe('3');
  expect(res.page).toBe(1);
  expect(res.totalPages).toBe(1);
});


