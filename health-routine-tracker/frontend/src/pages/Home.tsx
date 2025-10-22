/**
 * 홈 페이지 컴포넌트
 * 
 * Health Routine Tracker 애플리케이션의 메인 랜딩 페이지입니다.
 * 사용자에게 애플리케이션의 주요 기능과 특징을 소개하는 페이지로 구성되어 있습니다.
 * 
 * 주요 구성 요소:
 * - Hero: 메인 헤더 섹션 (제목, 설명, CTA 버튼)
 * - Features: 애플리케이션의 주요 기능 소개
 * - CTA: 사용자 행동 유도 섹션 (회원가입, 로그인 등)
 * 
 * @author Health Routine Tracker Team
 * @version 1.0
 * @since 2024
 */

// 랜딩 페이지의 주요 섹션 컴포넌트들
import Hero from '../components/ref/Hero';      // 메인 헤더 섹션
import Features from '../components/ref/Features'; // 기능 소개 섹션
import CTA from '../components/ref/CTA';        // 행동 유도 섹션

/**
 * 홈 페이지 컴포넌트
 * 
 * 랜딩 페이지의 전체 레이아웃을 구성하고 각 섹션을 순서대로 배치합니다.
 * 
 * @returns JSX.Element - 홈 페이지의 전체 구조
 */
export default function Home() {
  return (
    <section className="page">
      {/* 메인 헤더 섹션 - 애플리케이션 소개 및 주요 CTA */}
      <Hero />
      
      {/* 기능 소개 섹션 - 애플리케이션의 주요 기능들을 시각적으로 설명 */}
      <Features />
      
      {/* 행동 유도 섹션 - 사용자의 회원가입이나 로그인을 유도 */}
      <CTA />
    </section>
  );
}




