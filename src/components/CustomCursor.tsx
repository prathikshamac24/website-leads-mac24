"use client";

import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    let raf = 0;
    const lag = () => {
      setRingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.15,
        y: prev.y + (pos.y - prev.y) * 0.15,
      }));
      raf = requestAnimationFrame(lag);
    };
    raf = requestAnimationFrame(lag);
    return () => cancelAnimationFrame(raf);
  }, [pos, isMobile]);

  if (!mounted || isMobile) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-salmon"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="pointer-events-none fixed z-[9999] h-8 w-8 rounded-full border border-salmon/60"
        style={{
          left: ringPos.x,
          top: ringPos.y,
          transform: "translate(-50%, -50%)",
          transition: "width .25s, height .25s",
        }}
      />
    </>
  );
}
