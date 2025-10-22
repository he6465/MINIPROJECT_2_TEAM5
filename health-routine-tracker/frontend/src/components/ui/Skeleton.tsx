export default function Skeleton({ width = '100%', height = 16 }: { width?: number | string; height?: number | string }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: 8,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.18), rgba(255,255,255,0.08))',
      backgroundSize: '200% 100%',
      animation: 'skeleton 1.2s ease-in-out infinite'
    }} />
  );
}


