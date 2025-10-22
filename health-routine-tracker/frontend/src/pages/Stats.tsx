import { weeklyStats, monthlyCalendar } from '../lib/stats';
import { listRoutines } from '../lib/api';
import { getAIInsight } from '../lib/ai';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import Section from '../components/Section';
import { useEffect, useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import { downloadCsv } from '../lib/csv';
import { Empty, ErrorBox } from '../components/ui/State';

export default function Stats() {
  const [tab, setTab] = useState<'weekly' | 'monthly'>('weekly');
  const [weekly, setWeekly] = useState<any | null>(null);
  const [monthly, setMonthly] = useState<any[] | null>(null);
  const [monthlySeries, setMonthlySeries] = useState<any[] | null>(null);
  const [monthlyMinMax, setMonthlyMinMax] = useState<{ min?: any; max?: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiText, setAiText] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // 색상 팔레트(운동 타입)
  const COLORS: Record<string, string> = {
    WALK: '#34CF5D', RUN: '#269B61', GYM: '#E8FC58', ETC: '#93C5FD', other: '#A1A1AA'
  };

  // 주간 KPI/차트 데이터 가공
  const kpi = useMemo(() => {
    if (!weekly) return null;
    const list = weekly.data as Array<any>;
    const sleepAvg = weekly.summary?.sleepAvg ?? 0;
    const waterTotal = weekly.summary?.waterTotal ?? 0;
    const exerciseCount = weekly.summary?.exerciseCount ?? 0;
    // 운동 타입 분포(간단 가중치: 운동했으면 1)
    const dist: Record<string, number> = {};
    list.forEach((d: any) => {
      const t = d.exerciseType ?? 'other';
      dist[t] = (dist[t] ?? 0) + (d.exercise ? 1 : (d.exerciseMinutes ? 1 : 0));
    });
    const distArr = Object.entries(dist).map(([name, value]) => ({ name, value }));
    // 최고/최저 수면
    const maxSleep = list.reduce((m: any, x: any) => (x.sleep ?? 0) > (m.sleep ?? 0) ? x : m, list[0] ?? {});
    const minSleep = list.reduce((m: any, x: any) => (x.sleep ?? 0) < (m.sleep ?? 0) ? x : m, list[0] ?? {});
    return { sleepAvg, waterTotal, exerciseCount, distArr, maxSleep, minSleep };
  }, [weekly]);
  // 주간 데이터가 준비되면 AI 인사이트 요청
  useEffect(() => {
    (async () => {
      if (!weekly) return;
      try {
        setAiLoading(true);
        const list: Array<any> = weekly.data ?? [];
        const avgSleep: number = weekly.summary?.sleepAvg ?? 0;
        const exerciseDays: number = weekly.summary?.exerciseCount ?? 0;
        const waterAvg: number = list.length > 0
          ? Math.round((list.reduce((s, d) => s + (d.water ?? 0), 0) / list.length))
          : 0;
        // 가장 많이 등장한 운동 타입(없으면 other)
        const typeCount: Record<string, number> = {};
        list.forEach(d => {
          const t = d.exerciseType ?? 'other';
          typeCount[t] = (typeCount[t] ?? 0) + 1;
        });
        const exerciseType = Object.entries(typeCount).sort((a,b)=> b[1]-a[1])[0]?.[0] ?? 'other';
        const text = await getAIInsight({
          avgSleep: Number(avgSleep) || 0,
          exerciseDays: Number(exerciseDays) || 0,
          avgWater: Number(waterAvg) || 0,
          exerciseType
        });
        setAiText(text);
      } catch (e:any) {
        setAiText('AI가 현재 비활성화되어 있습니다. 키 설정 후 사용해 주세요.');
      } finally {
        setAiLoading(false);
      }
    })();
  }, [weekly]);

  const refreshAI = async () => {
    if (!weekly) return;
    try {
      setAiLoading(true);
      const list: Array<any> = weekly.data ?? [];
      const avgSleep: number = weekly.summary?.sleepAvg ?? 0;
      const exerciseDays: number = weekly.summary?.exerciseCount ?? 0;
      const waterAvg: number = list.length > 0
        ? Math.round((list.reduce((s, d) => s + (d.water ?? 0), 0) / list.length))
        : 0;
      const typeCount: Record<string, number> = {};
      list.forEach(d => {
        const t = d.exerciseType ?? 'other';
        typeCount[t] = (typeCount[t] ?? 0) + 1;
      });
      const exerciseType = Object.entries(typeCount).sort((a,b)=> b[1]-a[1])[0]?.[0] ?? 'other';
      const text = await getAIInsight({
        avgSleep: Number(avgSleep) || 0,
        exerciseDays: Number(exerciseDays) || 0,
        avgWater: Number(waterAvg) || 0,
        exerciseType
      });
      setAiText(text);
    } catch (e:any) {
      setAiText('AI가 현재 비활성화되어 있습니다. 키 설정 후 사용해 주세요.');
    } finally {
      setAiLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        setWeekly(await weeklyStats());
        setMonthly(await monthlyCalendar());
      } catch (e: any) {
        setError(e?.message ?? '데이터를 불러오지 못했습니다.');
      }
    })();
  }, []);

  // 월간 라인차트/최고/최저 수면 계산을 위해 월간 루틴 상세 불러오기
  useEffect(() => {
    (async () => {
      if (tab !== 'monthly' || !monthly || monthly.length === 0) return;
      try {
        const dates = monthly.map(d => d.date).sort();
        const from = dates[0];
        const to = dates[dates.length - 1];
        const userRaw = localStorage.getItem('hrt:user');
        const userId = userRaw ? (JSON.parse(userRaw).id ?? 1) : 1;
        const page = await listRoutines({ userId, from, to, page: 1, size: 100 });
        const series = (page.content ?? [])
          .map((r: any) => ({ date: r.date, sleep: r.sleepHours ?? 0, water: r.waterMl ?? 0 }))
          .sort((a: any, b: any) => a.date.localeCompare(b.date));
        const maxSleep = series.reduce((m: any, x: any) => (x.sleep ?? 0) > (m.sleep ?? 0) ? x : m, series[0] ?? {});
        const minSleep = series.reduce((m: any, x: any) => (x.sleep ?? 0) < (m.sleep ?? 0) ? x : m, series[0] ?? {});
        setMonthlySeries(series);
        setMonthlyMinMax({ min: minSleep, max: maxSleep });
      } catch (e) {
        // 월간 상세 불러오기 실패 시 조용히 무시(라인차트 비표시)
        setMonthlySeries(null);
        setMonthlyMinMax(null);
      }
    })();
  }, [tab, monthly]);
  return (
    <Section title="통계" subtitle="패턴을 발견하고 개선하세요">
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant={tab === 'weekly' ? 'primary' : 'ghost'} onClick={() => setTab('weekly')}>주간</Button>
        <Button variant={tab === 'monthly' ? 'primary' : 'ghost'} onClick={() => setTab('monthly')}>월간</Button>
        {tab === 'weekly' && weekly && (
          <Button variant="ghost" onClick={() => downloadCsv('weekly.csv', weekly.data)}>CSV 내보내기</Button>
        )}
        {tab === 'monthly' && monthly && (
          <Button variant="ghost" onClick={() => downloadCsv('monthly.csv', monthly)}>CSV 내보내기</Button>
        )}
      </div>
      {error && <ErrorBox message={error} />}

      {/* 주간 탭에서만 AI 인사이트 카드 표시 */}
      {tab === 'weekly' && (
        <div className="modern-card" style={{ borderLeft: '4px solid #667eea', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, justifyContent: 'space-between' }}>
            <strong>AI 인사이트</strong>
            {weekly && (
              <Button variant="ghost" onClick={refreshAI} disabled={aiLoading}>
                {aiLoading ? '분석 중...' : '다시 분석'}
              </Button>
            )}
          </div>
          <div style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {weekly
              ? (aiLoading ? 'AI가 분석 중입니다...' : (aiText || 'AI가 현재 비활성화되어 있습니다.'))
              : '주간 데이터를 불러오는 중이거나 데이터가 없습니다.'}
          </div>
        </div>
      )}
      {tab === 'weekly' && weekly && (
        <>
          {/* KPI + 원그래프(운동 타입) - 월간과 동일한 카드 레이아웃 */}
          <div className="modern-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr 1fr', gap: 12, alignItems: 'center' }}>
            <div>
              <ResponsiveContainer width={300} height={220}>
                <PieChart>
                  <Pie data={kpi?.distArr ?? []} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    {(kpi?.distArr ?? []).map((entry: any, index: number) => (
                      <Cell key={`wcell-${index}`} fill={COLORS[entry.name] ?? COLORS.other} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="kpi" style={{ borderTop: '4px solid var(--green-700)', textAlign: 'center' }}>
              <div className="kpi-title">평균 수면</div>
              <div className="kpi-value">{kpi?.sleepAvg ?? 0} h</div>
            </div>
            <div className="kpi" style={{ borderTop: '4px solid var(--green-500)', textAlign: 'center' }}>
              <div className="kpi-title">운동한 날</div>
              <div className="kpi-value">{kpi?.exerciseCount ?? 0} 일</div>
            </div>
            <div className="kpi" style={{ borderTop: '4px solid var(--lime-300)', textAlign: 'center' }}>
              <div className="kpi-title">총 물 섭취</div>
              <div className="kpi-value">{(kpi?.waterTotal ?? 0).toLocaleString()} ml</div>
            </div>
          </div>

          {/* 라인 차트 */}
          <div className="modern-card" style={{ height: 360 }}>
            <div style={{ marginBottom: 8 }}>주간 수면/물 추이 ({weekly.range[0]} ~ {weekly.range[1]})</div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weekly.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8FCC5" />
                <XAxis dataKey="date" tickFormatter={(v)=> v.slice(5)} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="sleep" stroke="#34CF5D" name="수면(h)" />
                <Line yAxisId="right" type="monotone" dataKey="water" stroke="#269B61" name="물(ml)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 최고/최저 수면 안내 */}
          <div className="modern-card" style={{ display: 'grid', gap: 6 }}>
            <div className="muted">
              <div>최고 수면: <strong>{kpi?.maxSleep?.date}</strong> ({kpi?.maxSleep?.sleep ?? 0}h)</div>
              <div>최저 수면: <strong>{kpi?.minSleep?.date}</strong> ({kpi?.minSleep?.sleep ?? 0}h)</div>
            </div>
          </div>
        </>
      )}
      {tab === 'monthly' && monthly && (
        <>
          <div className="modern-card">
            <div style={{ marginBottom: 8 }}>월간 달력(등록 여부)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {monthly.map(d => (
                <div key={d.date} style={{ padding: 8, textAlign: 'center', borderRadius: 8, background: d.hasRoutine ? 'rgba(38,155,97,0.3)' : 'rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 12 }}>
                    {d.date.slice(8)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* KPI+원그래프를 라인차트보다 먼저 배치(주간과 순서 일치) */}
          <div className="modern-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', gap: 12, alignItems: 'center' }}>
            <div>
              <ResponsiveContainer width={300} height={220}>
                <PieChart>
                  <Pie data={[{name:'기록', value: monthly.filter(d=>d.hasRoutine).length}, {name:'미기록', value: monthly.filter(d=>!d.hasRoutine).length}]}
                       dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                    <Cell fill="#269B61" />
                    <Cell fill="#A1A1AA" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="kpi" style={{ borderTop: '4px solid var(--green-700)', textAlign: 'center' }}>
              <div className="kpi-title">기록한 날</div>
              <div className="kpi-value">{monthly.filter(d => d.hasRoutine).length} 일</div>
            </div>
            <div className="kpi" style={{ borderTop: '4px solid var(--green-500)', textAlign: 'center' }}>
              <div className="kpi-title">미기록</div>
              <div className="kpi-value">{monthly.filter(d => !d.hasRoutine).length} 일</div>
            </div>
          </div>
          {monthlySeries && monthlySeries.length > 0 && (
            <div className="modern-card" style={{ height: 360 }}>
              <div style={{ marginBottom: 8 }}>월간 수면/물 추이</div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8FCC5" />
                  <XAxis dataKey="date" tickFormatter={(v)=> v.slice(5)} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="sleep" stroke="#34CF5D" name="수면(h)" />
                  <Line yAxisId="right" type="monotone" dataKey="water" stroke="#269B61" name="물(ml)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {monthlyMinMax && (
            <div className="modern-card" style={{ display: 'grid', gap: 6 }}>
              <div className="muted">
                <div>최고 수면: <strong>{monthlyMinMax.max?.date}</strong> ({monthlyMinMax.max?.sleep ?? 0}h)</div>
                <div>최저 수면: <strong>{monthlyMinMax.min?.date}</strong> ({monthlyMinMax.min?.sleep ?? 0}h)</div>
              </div>
            </div>
          )}
          
        </>
      )}
      {tab === 'weekly' && !weekly && !error && <Empty message="주간 데이터를 불러오는 중입니다..." />}
      {tab === 'monthly' && !monthly && !error && <Empty message="월간 데이터를 불러오는 중입니다..." />}
    </Section>
  );
}


