import type { Routine, RoutineCreateInput } from '../types/routine';

const key = 'hrt:routines';

function read(): Routine[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Routine[];
  } catch {
    return [];
  }
}

function write(data: Routine[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function list(): Routine[] {
  return read().sort((a, b) => b.date.localeCompare(a.date));
}

export function get(id: string): Routine | undefined {
  return read().find(r => r.id === id);
}

export function create(input: RoutineCreateInput): Routine {
  validate(input);
  const now = new Date().toISOString();
  const all = read();
  // unique by date (simulate per user)
  if (all.some(r => r.date === input.date)) {
    throw new Error('ROUTINE_DUPLICATE');
  }
  const item: Routine = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  all.push(item);
  write(all);
  return item;
}

export function update(id: string, input: RoutineCreateInput): Routine {
  validate(input);
  const all = read();
  const idx = all.findIndex(r => r.id === id);
  if (idx < 0) throw new Error('NOT_FOUND');
  // keep id/createdAt; enforce date uniqueness for others
  if (input.date && all.some(r => r.id !== id && r.date === input.date)) {
    throw new Error('ROUTINE_DUPLICATE');
  }
  const updated: Routine = { ...all[idx], ...input, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  write(all);
  return updated;
}

export function remove(id: string) {
  const all = read();
  const next = all.filter(r => r.id !== id);
  write(next);
}

export function clearAll() {
  localStorage.removeItem(key);
}

export function validate(input: RoutineCreateInput) {
  // date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    throw new Error('VALIDATION_FAILED: date');
  }
  const inRange = (v: number, lo: number, hi: number) => v >= lo && v <= hi;
  if (input.sleepHours !== undefined && !inRange(input.sleepHours, 0, 16)) {
    throw new Error('VALIDATION_FAILED: sleepHours');
  }
  if (input.exerciseMinutes !== undefined && !inRange(input.exerciseMinutes, 0, 600)) {
    throw new Error('VALIDATION_FAILED: exerciseMinutes');
  }
  if (input.waterMl !== undefined && !inRange(input.waterMl, 0, 10000)) {
    throw new Error('VALIDATION_FAILED: waterMl');
  }
  if (input.meals && input.meals.length > 1000) {
    throw new Error('VALIDATION_FAILED: meals');
  }
  if (input.note && input.note.length > 1000) {
    throw new Error('VALIDATION_FAILED: note');
  }
}


