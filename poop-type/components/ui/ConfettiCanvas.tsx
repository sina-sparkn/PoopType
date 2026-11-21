"use client";

import { useEffect, useRef } from "react";

interface ConfettiCanvasProps {
  active: boolean;
}

const COLORS = [
  "#FF7AC6",
  "#FFD93D",
  "#6BE3B5",
  "#5CC8FF",
  "#9B6BFF",
  "#FF9F43",
];

/**
 * Hand-rolled lightweight canvas confetti burst (~65 lines).
 * Automatically disabled when prefers-reduced-motion is enabled.
 */
export function ConfettiCanvas({ active }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: 78 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 78 + (Math.random() - 0.5) * 0.4;
      const speed = 4 + Math.random() * 9;
      return {
        x: w * 0.5 + (Math.random() - 0.5) * 80,
        y: h * 0.36 + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5.5,
        size: 7 + Math.random() * 7,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.25,
        color: COLORS[i % COLORS.length],
        life: 1,
      };
    });

    let frame = 0;
    let rafId = 0;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24;
        p.vx *= 0.99;
        p.rot += p.vrot;
        p.life = Math.max(0, 1 - frame / 105);

        if (p.life > 0 && p.y < h + 40) {
          alive++;
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.strokeStyle = "#1B1B1F";
          ctx.lineWidth = 2;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
          ctx.strokeRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
          ctx.restore();
        }
      }

      if (alive > 0 && frame < 120) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
