import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Moon, Activity, Droplets, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';

interface RoutineGalleryProps {
  recent: any[];
  weekly: any;
  avgSleep: number;
  exerciseDays: number;
  waterTotal: number;
}

interface GalleryItem {
  before: React.ReactNode;
  after: React.ReactNode;
  label: string;
  type: 'sleep' | 'exercise' | 'water' | 'chart';
}

export default function RoutineGallery({ recent, weekly, avgSleep, exerciseDays, waterTotal }: RoutineGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 갤러리 아이템들 - 참조 사이트의 before/after 구조 모방
  const galleryItems: GalleryItem[] = [
    {
      before: (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <Moon className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-sm">수면 기록 없음</p>
          <p className="text-xs">아직 추적하지 않음</p>
        </div>
      ),
      after: (
        <div className="h-full w-full flex flex-col items-center justify-center" 
             style={{ background: 'linear-gradient(135deg, var(--mint-100), var(--green-700))' }}>
          <Moon className="h-16 w-16 mb-4 text-white" />
          <p className="text-white font-semibold text-lg">{avgSleep}시간</p>
          <p className="text-white/80 text-sm">주간 평균 수면</p>
        </div>
      ),
      label: "수면 추적",
      type: "sleep"
    },
    {
      before: (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <Activity className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-sm">운동 기록 없음</p>
          <p className="text-xs">아직 추적하지 않음</p>
        </div>
      ),
      after: (
        <div className="h-full w-full flex flex-col items-center justify-center" 
             style={{ background: 'linear-gradient(135deg, var(--green-500), var(--lime-300))' }}>
          <Activity className="h-16 w-16 mb-4 text-white" />
          <p className="text-white font-semibold text-lg">{exerciseDays}일</p>
          <p className="text-white/80 text-sm">이번 주 운동</p>
        </div>
      ),
      label: "운동 관리",
      type: "exercise"
    },
    {
      before: (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <Droplets className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-sm">음수량 기록 없음</p>
          <p className="text-xs">아직 추적하지 않음</p>
        </div>
      ),
      after: (
        <div className="h-full w-full flex flex-col items-center justify-center" 
             style={{ background: 'linear-gradient(135deg, var(--lime-300), var(--mint-100))' }}>
          <Droplets className="h-16 w-16 mb-4" style={{ color: 'var(--green-700)' }} />
          <p className="font-semibold text-lg" style={{ color: 'var(--green-700)' }}>{waterTotal}ml</p>
          <p className="text-sm" style={{ color: 'var(--green-700)', opacity: 0.8 }}>주간 총 음수량</p>
        </div>
      ),
      label: "음수량 추적",
      type: "water"
    },
    {
      before: (
        <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
          <TrendingUp className="h-16 w-16 mb-4 opacity-50" />
          <p className="text-sm">통계 없음</p>
          <p className="text-xs">데이터 부족</p>
        </div>
      ),
      after: (
        <div className="h-full w-full p-4" style={{ background: 'var(--color-surface)' }}>
          <div className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-primary">통계 분석</span>
            <h3 className="font-semibold text-sm" style={{ margin: 0 }}>주간 수면 추이</h3>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={weekly?.data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8FCC5" />
              <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} fontSize={10} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sleep" 
                stroke="#34CF5D" 
                name="수면(h)" 
                strokeWidth={2} 
                dot={{ r: 2, fill: '#269B61' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ),
      label: "통계 분석",
      type: "chart"
    }
  ];

  const nextSlide = () => {
    if (isFlipping) return;
    setDirection(1);
    setIsFlipping(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % galleryItems.length);
      setIsFlipping(false);
    }, 600);
  };

  const prevSlide = () => {
    if (isFlipping) return;
    setDirection(-1);
    setIsFlipping(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
      setIsFlipping(false);
    }, 600);
  };

  // 3D effect on mouse move - 참조 사이트와 동일
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || isFlipping) return;

      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      containerRef.current.style.transform = `
        perspective(1000px) 
        rotateY(${x * 5}deg) 
        rotateX(${-y * 5}deg)
      `;
    };

    const handleMouseLeave = () => {
      if (!containerRef.current) return;
      containerRef.current.style.transform = `
        perspective(1000px) 
        rotateY(0deg) 
        rotateX(0deg)
      `;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isFlipping]);

  // Autoplay
  useEffect(() => {
    if (prefersReducedMotion) return; // 모션 축소 설정 시 자동재생 비활성화
    autoplayRef.current = setInterval(() => {
      if (!isFlipping) {
        nextSlide();
      }
    }, 5000);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isFlipping, prefersReducedMotion]);

  return (
    <div className="relative mx-auto max-w-4xl py-10">
      <div
        ref={containerRef}
        className="relative w-full transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative w-full max-w-3xl mx-auto" style={{ paddingBottom: 24 }}>
          {/* Main card container */}
          <div className="relative flex w-full gallery-card rounded-xl shadow-xl overflow-hidden" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`container-${activeIndex}`}
                  className="flex w-full"
                  initial={{
                    rotateY: direction * 90,
                    opacity: 0,
                  }}
                  animate={{
                    rotateY: 0,
                    opacity: 1,
                  }}
                  exit={{
                    rotateY: direction * -90,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    opacity: { duration: 0.2 },
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Before */}
                  <div className="w-1/2 relative">
                    <div className="h-full w-full overflow-hidden">
                      {galleryItems[activeIndex].before}
                    </div>

                    {/* Overlay with arrow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.7 }}
                        className="bg-primary/20 backdrop-blur-sm rounded-full p-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="w-1/2 relative overflow-hidden">
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-full w-full"
                    >
                      {galleryItems[activeIndex].after}
                    </motion.div>

                    {/* AI Generated badge */}
                    <div className="absolute bottom-2 right-2 rounded-full px-3 py-1 text-xs text-white"
                         style={{ background: 'var(--green-700)' }}>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                        루틴 추적됨
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Label inside card (chart 타입은 중복 배지 제거) */}
              {/* 라벨은 카드 외부(아래)로 이동해 잘림 방지 */}
          </div>

          {galleryItems[activeIndex].type !== 'chart' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
              <span className="badge badge-primary">{galleryItems[activeIndex].label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons (inline positioning to avoid class purge/conflict) */}
      <button
        type="button"
        onClick={prevSlide}
        className="rounded-full bg-white/80 p-3 shadow-md hover:bg-white transition-all hover:scale-110"
        style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}
        aria-label="Previous slide"
        disabled={isFlipping}
      >
        <ChevronLeft className={`h-6 w-6 ${isFlipping ? 'opacity-50' : ''}`} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="rounded-full bg-white/80 p-3 shadow-md hover:bg-white transition-all hover:scale-110"
        style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}
        aria-label="Next slide"
        disabled={isFlipping}
      >
        <ChevronRight className={`h-6 w-6 ${isFlipping ? 'opacity-50' : ''}`} />
      </button>

      {/* Indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {galleryItems.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => {
              if (isFlipping) return;
              setDirection(index > activeIndex ? 1 : -1);
              setIsFlipping(true);
              setTimeout(() => {
                setActiveIndex(index);
                setIsFlipping(false);
              }, 600);
            }}
            className={`h-2 transition-all ${
              index === activeIndex ? "w-8" : "w-2 bg-gray-300"
            } rounded-full`}
            style={{ 
              backgroundColor: index === activeIndex ? 'var(--green-700)' : '#d1d5db' 
            }}
            aria-current={index === activeIndex ? 'true' : undefined}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isFlipping}
          />
        ))}
      </div>
    </div>
  );
}
