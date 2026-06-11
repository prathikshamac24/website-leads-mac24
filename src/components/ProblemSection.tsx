"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "@/hooks/use-in-view";
import { Activity, Heart, Brain, BatteryLow, Flame, ShieldAlert, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DISEASES = [
  {
    t: "Diabetes",
    d: "Excess sugar spikes insulin daily until your body can't keep up.",
    icon: Activity,
    num: "01",
  },
  {
    t: "Heart Disease",
    d: "Trans fats and chronic inflammation quietly damage your heart for years.",
    icon: Heart,
    num: "02",
  },
  {
    t: "Anxiety",
    d: "90% of serotonin comes from your gut. When the gut is toxic, the mind follows.",
    icon: Brain,
    num: "03",
  },
  {
    t: "Fatigue",
    d: "Nutrient deficiencies and blood sugar crashes leave you empty by noon.",
    icon: BatteryLow,
    num: "04",
  },
  {
    t: "PCOS / Thyroid",
    d: "Hormonal imbalance traces directly to food, sleep, and stress patterns.",
    icon: Flame,
    num: "05",
  },
  {
    t: "Hypertension",
    d: "Salt, stress, and sedentary life compound in silence — no symptoms until serious.",
    icon: ShieldAlert,
    num: "06",
  },
];

// Mathematical initial styles for the straight card stack (perfectly vertical, layered on Y and Z for overlap)
const getInitialStyles = (i: number) => {
  return {
    zIndex: 10 + (DISEASES.length - i),
    // Completely straight card deck, stacked vertically with scale and depth
    transform: `translateY(${i * -14}px) translateZ(${i * -30}px) scale(${1 - i * 0.025})`,
    opacity: i === 0 ? 1 : 1 - i * 0.12,
    filter: i === 0 ? "none" : `blur(${i * 0.35}px)`,
    transformOrigin: "bottom center",
  };
};

export function ProblemSection() {
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>(0.02);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const switchRef = useRef<HTMLDivElement>(null);

  const [isSwitched, setIsSwitched] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const isSwitchedRef = useRef(false);
  const isLockedRef = useRef(false);

  const lockScroll = () => {
    (window as any).lenis?.stop();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    (window as any).lenis?.start();
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  const handleToggleClick = () => {
    if (isSwitched) {
      // Toggle back to RED
      setIsSwitched(false);
      isSwitchedRef.current = false;
      isLockedRef.current = true;
      lockScroll();
    } else {
      // Toggle to GREEN
      setIsSwitched(true);
      isSwitchedRef.current = true;
      setShowRipple(true);

      setTimeout(() => {
        setShowRipple(false);
      }, 1000);

      // Smooth scroll down to the solution (SystemSection) and unlock scroll
      setTimeout(() => {
        if (isSwitchedRef.current) {
          unlockScroll();
          isLockedRef.current = false;
          (window as any).lenis?.scrollTo("#solution", { duration: 1.2 });
        }
      }, 600);
    }
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = cardRefs.current;
      const total = DISEASES.length;

      // 1. Pin the whole viewport while the user peels through the card deck
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${total * 95}%`,
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            // Lock scrolling as they peel all cards until switch is green
            if (self.progress > 0.96 && !isSwitchedRef.current && !isLockedRef.current) {
              isLockedRef.current = true;
              lockScroll();
            }
          }
        },
      });

      // 2. Card deck peeling animation (All cards slide straight aside)
      for (let i = 0; i < total; i++) {
        const card = cards[i];
        if (!card) continue;

        const flyDirection = i % 2 === 0 ? -1 : 1; // Alternating left and right slide-aside offsets

        // Active card slides straight aside horizontally (no rotations, aligned perfectly flat)
        tl.to(
          card,
          {
            x: flyDirection * (window.innerWidth * 0.85),
            y: -80,
            z: 100, // moves slightly forward on slide out
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            opacity: 0,
            duration: 1.4,
            ease: "power2.inOut",
          },
          i * 1.5
        );

        // Slide/Clarify cards underneath up by one index straight
        for (let j = i + 1; j < total; j++) {
          const underCard = cards[j];
          if (!underCard) continue;

          const targetIndex = j - i - 1;

          tl.to(
            underCard,
            {
              y: targetIndex * -14,
              z: targetIndex * -30,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              opacity: targetIndex === 0 ? 1 : 1 - targetIndex * 0.12,
              filter: targetIndex === 0 ? "none" : `blur(${targetIndex * 0.35}px)`,
              duration: 1.4,
              ease: "power2.inOut",
            },
            i * 1.5
          );
        }
      }

      // 3. Fade out the original header block as we reach the end of the cards
      tl.to(
        headerRef.current,
        {
          opacity: 0,
          y: -40,
          scale: 0.95,
          duration: 1.2,
          ease: "power2.inOut",
        },
        (total - 1.8) * 1.5
      );

      // 4. Fade in the psychological switch section in the center
      tl.fromTo(
        switchRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 40,
          pointerEvents: "none",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 1.5,
          ease: "power2.out",
        },
        total * 1.5
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, []);

  const line1 = "You're not sick.".split(" ");
  const line2 = ["You're", "just"];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative z-20 w-full min-h-screen overflow-hidden flex flex-col justify-center mt-0 py-12 md:py-24 shadow-[0_-30px_60px_rgba(0,0,0,1)] transition-all duration-1000"
      style={{
        backgroundColor: isSwitched ? "#000000" : "#0d0000",
      }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.025); opacity: 1; }
        }
        @keyframes shockwave {
          0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(3.5); }
        }
      `}</style>

      {/* Ambient Aggressive Mesh Glows (morph from Red to Green) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xs:w-[400px] sm:w-[500px] h-[300px] xs:h-[400px] sm:h-[500px] blur-[100px] rounded-full pointer-events-none z-0 transition-all duration-1000"
        style={{
          backgroundColor: isSwitched ? "rgba(34,197,94,0.15)" : "rgba(220,38,38,0.25)",
        }}
      />
      <div
        className="absolute top-10 left-10 w-[200px] h-[200px] blur-[80px] rounded-full pointer-events-none z-0 transition-all duration-1000"
        style={{
          backgroundColor: isSwitched ? "rgba(34,197,94,0.08)" : "rgba(185,28,28,0.15)",
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[250px] h-[250px] blur-[90px] rounded-full pointer-events-none z-0 transition-all duration-1000"
        style={{
          backgroundColor: isSwitched ? "rgba(34,197,94,0.08)" : "rgba(153,27,27,0.15)",
        }}
      />

      <div
        ref={inViewRef}
        className="mx-auto w-full max-w-5xl px-6 flex flex-col items-center justify-center relative z-10 min-h-[580px] sm:min-h-[640px]"
      >
        {/* Original Header Block (Fades out via GSAP) */}
        <div ref={headerRef} className="text-center max-w-2xl">
          <p
            className="label-mono text-red-500 font-bold tracking-[0.25em] text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          >
            THE CRISIS
          </p>
          <h2
            className="mt-4 font-display text-[2rem] leading-[1.1] xs:text-[2.5rem] sm:text-5xl md:text-6xl text-white uppercase"
          >
            <span className="block">
              {line1.map((w, i) => (
                <span key={i} className="word mr-2 inline-block sm:mr-3">
                  {w}
                </span>
              ))}
            </span>
            <span className="block">
              {line2.map((w, i) => (
                <span key={i} className="word mr-2 inline-block sm:mr-3">
                  {w}
                </span>
              ))}
              <span className="word mr-2 inline-block italic text-red-600 sm:mr-3 font-black drop-shadow-[0_0_12px_rgba(220,38,38,0.7)]">
                ignoring
              </span>
              <span className="word inline-block text-red-600">.</span>
            </span>
          </h2>
          <p
            className="mt-6 text-xs leading-relaxed text-neutral-400 sm:text-sm max-w-lg mx-auto"
          >
            Every day, preventable lifestyle conditions compound in silence.
          </p>
        </div>

        {/* Overlapping Stacked Card Deck (One behind the other) */}
        <div
          className="relative mt-12 w-full max-w-[300px] xs:max-w-[330px] sm:max-w-[360px] h-[450px] sm:h-[500px]"
          style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        >
          {/* Intense ambient glow spot directly centered behind the card stack */}
          <div
            className="absolute inset-0 blur-[80px] rounded-full pointer-events-none -z-10 transition-all duration-1000"
            style={{
              backgroundColor: isSwitched ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.65)",
            }}
          />

          {DISEASES.map((c, i) => {
            const Icon = c.icon;
            const initialStyle = getInitialStyles(i);
            return (
              <div
                key={c.t}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0 w-full h-full bg-neutral-950/[0.4] bg-gradient-to-br from-white/[0.06] via-transparent to-red-950/[0.25] backdrop-blur-2xl border border-white/[0.15] p-6 sm:p-8 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.25)] flex flex-col justify-between select-none will-change-transform overflow-hidden"
                style={{
                  ...initialStyle,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Reference Glass Specular surface highlight reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none z-20" />
                <div className="absolute top-0 left-0 right-0 h-[150px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-t-3xl pointer-events-none z-20" />

                {/* Card Header Row */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                      <Icon size={20} />
                    </div>
                    <span className="label-mono text-white/60 text-[10px] tracking-widest font-mono font-bold">
                      {c.num}
                    </span>
                  </div>
                  <button className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white/70 hover:scale-105 hover:bg-red-600 hover:border-red-600 hover:text-white transition cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                    <ArrowUpRight size={16} />
                  </button>
                </div>

                {/* Card Title */}
                <div className="text-center mt-2 relative z-10">
                  <h3 className="font-display text-2xl xs:text-3xl sm:text-4xl text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {c.t}
                  </h3>
                </div>

                {/* Interactive Diagnostic Showcase Panel */}
                <div className="relative bg-white/[0.03] rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center p-4 min-h-[140px] xs:min-h-[160px] overflow-hidden my-4 shadow-inner z-10">
                  {/* Glowing warning aura */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-transparent to-transparent opacity-60" />

                  {/* Pulsing visual core emblem */}
                  <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-full border border-red-500/35 bg-red-950/30 breathe shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    <Icon size={32} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.75)]" />
                  </div>

                  <span className="relative z-10 label-mono text-[9px] text-red-500 font-bold mt-4 tracking-[0.25em] drop-shadow-[0_0_4px_rgba(239,68,68,0.4)] animate-pulse">
                    WARNING · CRITICAL THREAT
                  </span>
                </div>

                {/* Card Diagnosis Description */}
                <div className="text-center mb-2 relative z-10">
                  <p className="text-neutral-200 text-xs sm:text-sm font-medium leading-relaxed px-2">
                    {c.d}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Psychological Switch Section (Fades in dynamically via GSAP) */}
        <div
          ref={switchRef}
          className="absolute inset-x-6 flex flex-col items-center justify-center opacity-0 pointer-events-none z-30 select-none text-center"
        >
          {/* Question / Psychological Trigger */}
          <div className="max-w-xl px-4 transition-all duration-1000 mb-6">
            <h3
              className="font-display text-[1.8rem] xs:text-[2.2rem] sm:text-4xl md:text-5xl uppercase tracking-wide leading-none transition-all duration-1000"
              style={{
                color: isSwitched ? "#22c55e" : "#ffffff",
                fontWeight: isSwitched ? 900 : 700,
                textShadow: isSwitched ? "0 0 20px rgba(34,197,94,0.6)" : "none",
              }}
            >
              {isSwitched ? "TRANSFORMATION ACTIVE" : "Are you ready to change?"}
            </h3>
            <p className="mt-4 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed transition-all duration-1000">
              {isSwitched
                ? "You have broken the cycle. Welcome to MAC24. Rebuilding your sleep, mind, and energy starts now."
                : "Your body is compounding silent damage every second. Will you continue ignoring the symptoms, or will you flip the switch?"}
            </p>
          </div>

          {/* Glowing Switch Stick-Figure */}
          <div className="relative flex flex-col items-center mt-2">
            {/* Energy Ripple Shockwave */}
            {showRipple && (
              <div
                className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-green-400/40 to-emerald-500/30 border border-green-400/50 pointer-events-none z-20 blur-[1px]"
                style={{
                  left: "50%",
                  top: "40px", // matches the vertical center of the toggle button!
                  animation: "shockwave 1s cubic-bezier(0.15, 0.85, 0.3, 1) forwards",
                }}
              />
            )}

            {/* Active Stick Figure Container */}
            <div
              className="relative z-10 flex flex-col items-center transition-transform duration-500 hover:scale-[1.02]"
              style={{ animation: "breathe 4s ease-in-out infinite" }}
            >
              {/* Label above Head */}
              {isSwitched ? (
                <span
                  className="label-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold transition-all duration-1000 mb-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                  style={{
                    color: "#22c55e",
                  }}
                >
                  Switch ON strength
                </span>
              ) : (
                <div className="mb-6 px-4 py-1.5 rounded-full border border-red-500/35 bg-red-950/20 text-red-500 animate-pulse text-[9px] sm:text-[10px] tracking-[0.18em] font-mono font-bold uppercase drop-shadow-[0_0_6px_rgba(239,68,68,0.3)]">
                  ⚠️ Switch OFF stress ⚠️
                </div>
              )}

              {/* Toggle Switch (Head) */}
              <button
                onClick={handleToggleClick}
                className="relative w-[84px] h-[42px] rounded-full border border-white/15 p-1 transition-all duration-700 shadow-2xl cursor-pointer z-30 group"
                style={{
                  backgroundColor: isSwitched ? "#22c55e" : "#ef4444",
                  boxShadow: isSwitched
                    ? "0 0 25px rgba(34,197,94,0.55), inset 0 2px 4px rgba(255,255,255,0.2)"
                    : "0 0 25px rgba(239,68,68,0.55), inset 0 2px 4px rgba(255,255,255,0.2)",
                }}
              >
                {/* Specular glass reflection overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />

                {/* Toggle Knob */}
                <div
                  className="w-8 h-8 rounded-full bg-white transition-all duration-500 ease-out transform flex items-center justify-center"
                  style={{
                    transform: isSwitched ? "translateX(42px)" : "translateX(0px)",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.1)",
                  }}
                />
              </button>

              {/* Body SVG */}
              <div className="relative mt-[-2px]">
                <svg
                  viewBox="0 0 200 230"
                  className="w-[180px] h-[200px] transition-all duration-1000 filter drop-shadow-[0_0_18px_var(--glow-color)]"
                  style={{
                    "--glow-color": isSwitched ? "rgba(34,197,94,0.45)" : "rgba(239,68,68,0.45)",
                  } as React.CSSProperties}
                >
                  <defs>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FFFFFF" />
                      <stop offset="60%" stopColor={isSwitched ? "#22c55e" : "#ef4444"} />
                      <stop offset="100%" stopColor={isSwitched ? "#14532d" : "#7f1d1d"} />
                    </linearGradient>
                  </defs>

                  {/* Detached Left Arm Capsule */}
                  <rect x="61" y="48" width="14" height="76" rx="7" fill="url(#bodyGradient)" className="transition-all duration-1000" />
                  
                  {/* Central Body (Neck, Torso & Legs) */}
                  <path
                    d="M94,18 L94,35 C86.5,35 81,40.5 81,48 L81,212 C81,216.4 84.6,220 89,220 C93.4,220 97,216.4 97,212 L97,145 L103,145 L103,212 C103,216.4 106.6,220 111,220 C115.4,220 119,216.4 119,212 L119,48 C119,40.5 113.5,35 106,35 L106,18 Z"
                    fill="url(#bodyGradient)"
                    className="transition-all duration-1000"
                  />

                  {/* Detached Right Arm Capsule */}
                  <rect x="125" y="48" width="14" height="76" rx="7" fill="url(#bodyGradient)" className="transition-all duration-1000" />
                </svg>
              </div>
            </div>

            {/* Flipped Reflection */}
            <div className="absolute top-[238px] left-1/2 -translate-x-1/2 opacity-25 scale-y-[-0.6] blur-[2px] pointer-events-none select-none">
              <svg viewBox="0 0 200 230" className="w-[180px] h-[200px] transition-all duration-1000">
                <defs>
                  <linearGradient id="reflectGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isSwitched ? "#22c55e" : "#ef4444"} stopOpacity="0.8" />
                    <stop offset="55%" stopColor={isSwitched ? "#16a34a" : "#dc2626"} stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Detached Left Arm Capsule Reflection */}
                <rect x="61" y="48" width="14" height="76" rx="7" fill="url(#reflectGradient)" />
                
                {/* Torso & Legs Reflection */}
                <path
                  d="M94,18 L94,35 C86.5,35 81,40.5 81,48 L81,212 C81,216.4 84.6,220 89,220 C93.4,220 97,216.4 97,212 L97,145 L103,145 L103,212 C103,216.4 106.6,220 111,220 C115.4,220 119,216.4 119,212 L119,48 C119,40.5 113.5,35 106,35 L106,18 Z"
                  fill="url(#reflectGradient)"
                />
                
                {/* Detached Right Arm Capsule Reflection */}
                <rect x="125" y="48" width="14" height="76" rx="7" fill="url(#reflectGradient)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
