import { http } from './http';

type WeeklySummary = {
  avgSleep: number;
  exerciseDays: number;
  avgWater: number;
  exerciseType?: string;
};

export async function getAIInsight(summary: WeeklySummary): Promise<string> {
  const { data } = await http.post<string>('/ai/insight', {
    avgSleep: summary.avgSleep,
    exerciseDays: summary.exerciseDays,
    avgWater: summary.avgWater,
    exerciseType: summary.exerciseType ?? 'other'
  }, { responseType: 'text' as any });
  // axios는 responseType 'text' 지정 시 data가 문자열로 옴
  return data as unknown as string;
}


