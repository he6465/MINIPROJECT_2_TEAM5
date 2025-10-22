import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { clearAll, create, get, list, remove, update } from './routineStore';

function resetLS() {
  localStorage.clear();
}

describe('routineStore', () => {
  beforeEach(resetLS);
  afterEach(resetLS);

  test('create/list/get works and enforces date uniqueness', () => {
    const a = create({ date: '2025-09-08', sleepHours: 7.5 });
    const b = create({ date: '2025-09-09' });
    expect(list().length).toBe(2);
    expect(get(a.id)?.date).toBe('2025-09-08');
    expect(() => create({ date: '2025-09-09' })).toThrowError('ROUTINE_DUPLICATE');
  });

  test('update respects uniqueness and validation', () => {
    const a = create({ date: '2025-09-08', waterMl: 100 });
    const b = create({ date: '2025-09-09', waterMl: 200 });
    expect(() => update(a.id, { date: '2025-09-09' })).toThrowError('ROUTINE_DUPLICATE');
    const updated = update(a.id, { date: '2025-09-10', waterMl: 300 });
    expect(updated.date).toBe('2025-09-10');
    expect(updated.waterMl).toBe(300);
  });

  test('remove clears the item', () => {
    const a = create({ date: '2025-09-08' });
    remove(a.id);
    expect(list().find(x => x.id === a.id)).toBeUndefined();
  });

  test('clearAll removes all data', () => {
    create({ date: '2025-09-08' });
    create({ date: '2025-09-09' });
    clearAll();
    expect(list().length).toBe(0);
  });
});


