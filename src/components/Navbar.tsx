"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[9999] flex items-center justify-between py-2.5 px-5 rounded-full transition-all duration-300 border bg-white/[0.04] backdrop-blur-[24px] saturate-[180%] border-white/[0.12] shadow-2xl shadow-black/40 ${
        scrolled 
          ? "scale-[1.02] border-white/[0.22] bg-white/[0.09] shadow-black/60" 
          : "shadow-black/20"
      }`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="font-display font-bold text-lg tracking-wide text-white cursor-pointer hover:opacity-80 transition"
      >
        MAC<span className="text-salmon">24</span>
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={() => scrollTo("problem")}
          className="label-mono text-[10px] sm:text-xs font-mono font-medium text-white/80 hover:text-salmon transition cursor-pointer"
        >
          Why
        </button>
        <button
          onClick={() => scrollTo("journey")}
          className="label-mono text-[10px] sm:text-xs font-mono font-medium text-white/80 hover:text-salmon transition cursor-pointer"
        >
          Phases
        </button>
        <button
          onClick={() => scrollTo("funnel")}
          className="bg-salmon hover:bg-salmon-light text-white rounded-full px-3.5 py-1.5 text-[10px] sm:text-xs font-mono font-semibold tracking-wider transition cursor-pointer shadow-md"
        >
          Apply
        </button>
      </div>
    </nav>
  );
}
