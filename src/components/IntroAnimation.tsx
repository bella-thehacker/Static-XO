import { useEffect, useState, useMemo } from 'react';

interface FloatingSymbol {
  id: number;
  symbol: 'X' | 'O';
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

export default function IntroAnimation() {
  const [visible, setVisible] = useState(true);

  const symbols = useMemo<FloatingSymbol[]>(() => {
    const items: FloatingSymbol[] = [];
    for (let i = 0; i < 20; i++) {
      items.push({
        id: i,
        symbol: Math.random() > 0.5 ? 'X' : 'O',
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 60,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        rotate: (Math.random() - 0.5) * 30,
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
      {symbols.map((s) => (
        <div
          key={s.id}
          className="absolute font-pixel text-[var(--cyan)] select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            opacity: 0,
            animation: `float ${s.duration}s ease-in-out ${s.delay}s infinite`,
            transform: `rotate(${s.rotate}deg)`,
            color: s.symbol === 'X' ? 'var(--cyan)' : 'var(--magenta)',
            textShadow: s.symbol === 'X' 
              ? '0 0 20px var(--cyan), 0 0 40px var(--cyan)'
              : '0 0 20px var(--magenta), 0 0 40px var(--magenta)',
            filter: 'blur(0.5px)',
          }}
        >
          {s.symbol}
        </div>
      ))}

      {/* Glitch lines */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`glitch-${i}`}
          className="absolute h-[1px] bg-[var(--cyan)]"
          style={{
            left: 0,
            right: 0,
            top: `${10 + i * 12}%`,
            opacity: 0,
            animation: `glitchLine 4s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
