"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  className?: string;
  asNumber?: boolean;
  delay?: number;
};

/**
 * Renders text composed of scattered dots that converge into the letters.
 * Mobile-friendly: just animates dot opacity/translation from random to 0.
 */
export function DotsAssembleText({ text, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setActive(true), delay * 1000);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      {/* Scattered dots */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        {Array.from({ length: 36 }).map((_, i) => {
          const seed = (i * 9301 + 49297) % 233280;
          const r1 = (seed % 1000) / 1000;
          const r2 = ((seed * 7) % 1000) / 1000;
          const r3 = ((seed * 13) % 1000) / 1000;
          const tx = (r1 - 0.5) * 400;
          const ty = (r2 - 0.5) * 200;
          const targetX = r1 * 100;
          const targetY = r3 * 100;
          return (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-salmon"
              style={{
                left: `${targetX}%`,
                top: `${targetY}%`,
                transform: active
                  ? `translate(0,0) scale(1)`
                  : `translate(${tx}px, ${ty}px) scale(0.4)`,
                opacity: active ? 0 : 0.9,
                transition: `transform 1.4s cubic-bezier(.2,.8,.2,1) ${i * 20}ms, opacity 1.6s ease ${i * 20 + 600}ms`,
              }}
            />
          );
        })}
      </div>

      {/* The text */}
      <span
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
          filter: active ? "blur(0)" : "blur(6px)",
          transition: "opacity 1.2s ease 700ms, transform 1.2s ease 700ms, filter 1.2s ease 700ms",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </div>
  );
}
