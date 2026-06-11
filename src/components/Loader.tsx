"use client";

import { useEffect, useState } from "react";

export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed inset-0 w-screen h-[100dvh] z-[99999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="font-display text-4xl tracking-wide text-white">
          MAC<span className="text-salmon">24</span>
        </div>
        <div className="h-px w-48 overflow-hidden bg-white/10">
          <div
            className="h-full bg-salmon"
            style={{
              animation: "loader-expand 1.4s ease-out forwards",
              transformOrigin: "left",
            }}
          />
        </div>
      </div>
    </div>
  );
}
