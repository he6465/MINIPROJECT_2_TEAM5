/**
 * 루틴 관련 타입 정의
 * 
 * Health Routine Tracker 애플리케이션에서 사용하는 루틴 관련 TypeScript 타입들을 정의합니다.
 * 백엔드 API와의 데이터 교환 및 프론트엔드 컴포넌트에서 사용됩니다.
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */

/**
 * 운동 종류 타입
 * 
 * 사용자가 선택할 수 있는 운동 종류를 정의합니다.
 * 백엔드의 enum 값과 일치해야 합니다.
 */
export type ExerciseType = 'WALK' | 'RUN' | 'GYM' | 'ETC';

/**
 * 루틴 인터페이스
 * 
 * 사용자의 일일 건강 루틴 정보를 나타내는 인터페이스입니다.
 * 백엔드 API에서 반환되는 루틴 데이터의 구조를 정의합니다.
 */
export interface Routine {
  /** 루틴 고유 식별자 */
  id: string;
  /** 루틴 날짜 (YYYY-MM-DD 형식) */
  date: string;
  /** 수면 시간 (0 ~ 16시간, 소수점 첫째 자리까지) */
  sleepHours?: number;
  /** 운동 종류 */
  exerciseType?: ExerciseType;
  /** 운동 시간 (0 ~ 600분) */
  exerciseMinutes?: number;
  /** 식사 내용 (최대 1000자) */
  meals?: string;
  /** 물 섭취량 (0 ~ 10000ml) */
  waterMl?: number;
  /** 루틴 메모 (최대 1000자) */
  note?: string;
  /** 루틴 생성 시간 (ISO 8601 형식) */
  createdAt: string;
  /** 루틴 수정 시간 (ISO 8601 형식) */
  updatedAt: string;
}

/**
 * 루틴 생성 입력 인터페이스
 * 
 * 새로운 루틴을 생성할 때 사용하는 입력 데이터의 구조를 정의합니다.
 * Routine 인터페이스에서 시스템이 자동으로 생성하는 필드들(id, createdAt, updatedAt)을 제외한 필드들만 포함합니다.
 */
export interface RoutineCreateInput {
  /** 루틴 날짜 (YYYY-MM-DD 형식) */
  date: string;
  /** 수면 시간 (0 ~ 16시간, 소수점 첫째 자리까지) */
  sleepHours?: number;
  /** 운동 종류 */
  exerciseType?: ExerciseType;
  /** 운동 시간 (0 ~ 600분) */
  exerciseMinutes?: number;
  /** 식사 내용 (최대 1000자) */
  meals?: string;
  /** 물 섭취량 (0 ~ 10000ml) */
  waterMl?: number;
  /** 루틴 메모 (최대 1000자) */
  note?: string;
}


