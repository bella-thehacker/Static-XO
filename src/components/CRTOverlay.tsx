import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function CRTOverlay() {
  const { crtEffect, scanlines, grainIntensity, flickerIntensity } = useGameStore(
    (state) => state.settings
  );
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const [jitterOffset, setJitterOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!crtEffect) return;

    let animationId: number;
    const flickerLoop = () => {
      if (flickerIntensity > 0) {
        const baseOpacity = 1 - flickerIntensity;
        const random = Math.random() * flickerIntensity;
        setFlickerOpacity(baseOpacity + random);
      }
      animationId = requestAnimationFrame(flickerLoop);
    };
    animationId = requestAnimationFrame(flickerLoop);

    return () => cancelAnimationFrame(animationId);
  }, [crtEffect, flickerIntensity]);

  useEffect(() => {
    if (!crtEffect) return;

    const jitterInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setJitterOffset({
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 2,
        });
        setTimeout(() => setJitterOffset({ x: 0, y: 0 }), 50);
      }
    }, 1000);

    return () => clearInterval(jitterInterval);
  }, [crtEffect]);

  if (!crtEffect) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 9997,
        opacity: flickerOpacity,
        transform: `translate(${jitterOffset.x}px, ${jitterOffset.y}px)`,
        transition: 'transform 0.05s ease',
      }}
    >
      {/* Scanlines */}
      {scanlines && (
        <div className="scanlines" />
      )}

      {/* Static noise */}
      {grainIntensity > 0 && (
        <div
          className="static-noise"
          style={{ opacity: grainIntensity }}
        />
      )}

      {/* Vignette effect */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Subtle color bleed on edges */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 240, 255, 0.03), inset 0 0 100px rgba(255, 0, 60, 0.03)',
        }}
      />
    </div>
  );
}
