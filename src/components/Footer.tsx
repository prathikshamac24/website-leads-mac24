"use client";

export function Footer() {
  return (
    <footer className="relative w-full bg-neutral-950 py-16 md:py-24 overflow-hidden border-t border-white/5">
      {/* Faint ambient highlight glow overlay */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[150px] bg-salmon/3 blur-[90px] rounded-full pointer-events-none z-0" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="relative flex flex-col items-center text-center">
          
          {/* Salmon decorative accent bar at the top */}
          <div className="w-24 h-[2px] bg-salmon mb-8" />
          
          {/* Subheading text */}
          <p className="label-mono text-salmon text-xs tracking-[0.25em] font-mono font-bold uppercase mb-4">
            MEAL TO MIND
          </p>
          
          {/* Copyright notice */}
          <p className="text-[10px] sm:text-xs text-white/40 tracking-wider font-mono">
            © 2025 MAC24. All rights reserved.
          </p>

          {/* Right Side Navigation Links - matches "DISCIPLINE" structure from reference */}
          <div className="mt-8 md:mt-0 md:absolute md:right-0 md:top-6 flex flex-col items-center md:items-end text-center md:text-right gap-1.5 z-10">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/60 font-mono font-bold uppercase">
              DISCIPLINE
            </span>
            <div className="flex gap-4 text-[10px] sm:text-xs text-white/40 font-mono">
              <a href="#" className="hover:text-salmon transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-salmon transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>

        {/* Giant Watermark MAC24 in grey shade at the bottom - matches reference screenshot */}
        <div className="mt-16 md:mt-20 flex justify-center w-full select-none pointer-events-none">
          <span 
            className="font-display font-black uppercase text-center leading-none tracking-tighter select-none"
            style={{
              fontSize: "clamp(6rem, 18vw, 24rem)",
              color: "#1a1a1a", // Soft charcoal grey matching the shade on black background perfectly
              letterSpacing: "-0.04em",
            }}
          >
            MAC24
          </span>
        </div>
      </div>
    </footer>
  );
}
