"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "@/hooks/use-in-view";
import { DotsAssembleText } from "@/components/DotsAssembleText";
import { Apple, Droplet, Moon, Dumbbell, Brain, Flame } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    n: "01",
    t: "Nutrition",
    d: "Fuel your body with nutrient-dense whole foods.",
    icon: Apple,
  },
  {
    n: "02",
    t: "Water intake",
    d: "Hydrate systematically to boost energy and digestion.",
    icon: Droplet,
  },
  {
    n: "03",
    t: "Rest and sleep",
    d: "Fix the foundation everything else rests on.",
    icon: Moon,
  },
  {
    n: "04",
    t: "Exercise",
    d: "Build strength, mobility, and functional movement daily.",
    icon: Dumbbell,
  },
  {
    n: "05",
    t: "Positive mindset",
    d: "Declutter your mind. Rebuild your focus and identity.",
    icon: Brain,
  },
  {
    n: "06",
    t: "Calorie management",
    d: "Balance your daily energy input and output scientifically.",
    icon: Flame,
  },
];

interface PillarProps {
  index: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  active: boolean;
}

const Pillar = ({ index, title, subtitle, icon: Icon, active }: PillarProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-end h-[74vh] w-[75vw] xs:w-[50vw] sm:w-[40vw] md:w-[30vw] lg:w-[22vw] xl:w-[15vw] min-w-[140px] max-w-[240px] px-2 shrink-0 transition-all duration-700 ease-out origin-bottom ${
        active 
          ? "scale-110 md:scale-115 z-20" 
          : "scale-90 opacity-30 z-10"
      }`}
    >
      {/* Icon and Text Panel above the Column */}
      <div className="flex flex-col items-center text-center mb-8 min-h-[170px] justify-end relative z-10 w-full px-1">
        {/* Glowing circular icon badge */}
        <div 
          className={`h-12 w-12 rounded-full border flex items-center justify-center mb-4 transition-all duration-700 ${
            active 
              ? "bg-salmon/15 border-salmon text-salmon shadow-[0_0_18px_rgba(255,122,89,0.55)]" 
              : "bg-white/[0.03] border-white/10 text-neutral-400"
          }`}
        >
          <Icon size={22} />
        </div>
        
        {/* Title & Subtitle */}
        <h3 
          className={`font-display text-lg sm:text-xl md:text-2xl uppercase tracking-[0.06em] leading-tight transition-all duration-700 ${
            active ? "text-salmon font-bold drop-shadow-[0_0_8px_rgba(255,122,89,0.45)]" : "text-white"
          }`}
        >
          {title}
        </h3>
        <p className="mt-2 text-[10px] sm:text-xs text-neutral-400 leading-relaxed font-sans min-h-[32px]">
          {subtitle}
        </p>
      </div>

      {/* Classical Roman/Greek Column (3D Shaded & Towering) */}
      <div 
        className={`relative flex flex-col items-center w-full transition-all duration-1000 ${
          active 
            ? "drop-shadow-[0_-5px_30px_rgba(255,122,89,0.25)] brightness-110" 
            : "drop-shadow-[0_-5px_15px_rgba(0,0,0,0.5)]"
        }`}
        style={{ height: "46vh" }}
      >
        {/* Column Capital (Top Part) */}
        <div className="w-full h-3.5 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 rounded-t-sm shadow-md border-b border-black/10" />
        <div className="w-[90%] h-3.5 bg-gradient-to-r from-neutral-300 via-neutral-50 to-neutral-350 shadow-sm" />
        <div className="w-[82%] h-1 bg-gradient-to-r from-neutral-200 via-white to-neutral-300 shadow-sm" />

        {/* Column Shaft (Towering body with vertical grooves) */}
        <div className="relative w-[70%] flex-1 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-450 flex justify-around px-1 shadow-[inset_0_0_18px_rgba(0,0,0,0.22)] border-x border-black/10 overflow-hidden">
          {/* Vertical flutes (grooves) for 3D depth */}
          <div className="w-1.5 h-full bg-black/15 shadow-[inset_1px_0_2px_rgba(0,0,0,0.25)] rounded-full" />
          <div className="w-1.5 h-full bg-black/15 shadow-[inset_1px_0_2px_rgba(0,0,0,0.25)] rounded-full" />
          <div className="w-1.5 h-full bg-black/15 shadow-[inset_1px_0_2px_rgba(0,0,0,0.25)] rounded-full" />
          <div className="w-1.5 h-full bg-black/15 shadow-[inset_1px_0_2px_rgba(0,0,0,0.25)] rounded-full" />
        </div>

        {/* Column Base (Bottom Part) */}
        <div className="w-[78%] h-2.5 bg-gradient-to-r from-neutral-300 via-neutral-50 to-neutral-350 shadow-sm" />
        <div className="w-[90%] h-3.5 bg-gradient-to-r from-neutral-300 via-white to-neutral-350" />
        <div className="w-full h-4 bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 rounded-b-sm shadow-lg" />
      </div>
    </div>
  );
};

export function SystemSection() {
  const { ref: headInView, inView } = useInView<HTMLDivElement>(0.1);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!pinRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const pinSection = pinRef.current!;

      const getScrollDistance = () => {
        return track.scrollWidth - window.innerWidth + 96;
      };

      // Majestic Horizontal Scroll Shift
      gsap.to(
        track,
        {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinSection,
            start: "top top",
            end: () => `+=${getScrollDistance() + window.innerHeight * 1.5}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Calculate focus index based on horizontal progression
              const progress = self.progress;
              const index = Math.min(
                5,
                Math.floor(progress * 6)
              );
              if (activeIndexRef.current !== index) {
                activeIndexRef.current = index;
                setActiveIndex(index);
              }
            }
          },
        }
      );
    }, pinRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" className="relative w-full bg-neutral-950 z-20 overflow-hidden">
      {/* Pinned main viewport container */}
      <div 
        ref={pinRef} 
        className="relative w-full min-h-screen bg-transparent flex flex-col justify-between py-8 md:py-12 overflow-hidden"
      >
        {/* Soft Background Wellness Backlights */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-salmon/5 blur-[100px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-neutral-800/10 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Section Header */}
        <div className="mx-auto w-full max-w-6xl px-6 relative z-10 mt-2">
          <div ref={headInView} className="text-center max-w-4xl mx-auto">
            <p
              className={`label-mono text-salmon font-bold transition-all duration-700 text-xs sm:text-sm tracking-[0.25em] ${
                inView ? "opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              THE SOLUTION
            </p>
            <h2
              className={`mt-3 font-display text-4xl leading-[1.05] xs:text-5xl sm:text-6xl md:text-7xl uppercase text-white transition-all duration-700 delay-100 ${
                inView ? "opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              6 Pillars of <span className="text-salmon italic font-black drop-shadow-[0_0_12px_rgba(255,122,89,0.35)]">Transformation</span>
            </h2>
          </div>
        </div>

        {/* Architectural Pillars Horizontal Scroll Track */}
        <div className="relative w-full overflow-hidden flex-1 flex items-end min-h-[82vh] z-10 pb-6 sm:pb-8">
          <div
            ref={trackRef}
            className="flex gap-8 md:gap-14 absolute left-0 bottom-0 px-12 md:px-24 will-change-transform pb-2"
          >
            {PILLARS.map((p, idx) => (
              <div
                key={p.n}
                className="pillar-wrapper shrink-0"
              >
                <Pillar
                  index={idx}
                  title={p.t}
                  subtitle={p.d}
                  icon={p.icon}
                  active={activeIndex === idx}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Salmon colored ground line where columns stand */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-salmon z-20 shadow-[0_-5px_15px_rgba(255,122,89,0.35)] pointer-events-none" />

        {/* Majestic bottom brand footer info */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-8 sm:px-12 z-30 pointer-events-none text-white/20 label-mono text-[8px] sm:text-[10px] tracking-[0.2em] font-mono">
          <div>BANGALORE · IND</div>
          <div className="hidden sm:block">MAC24 wellness system · EST. 2026</div>
          <div>SCROLL TO UNLOCK →</div>
        </div>
      </div>

      {/* 90 Days finale: Retains all original content */}
      <div className="mx-auto max-w-5xl px-6 py-32 md:py-56 text-center relative z-10">
        <DotsAssembleText
          text="Most people are surviving. Not living."
          className="mx-auto max-w-3xl font-display text-xl italic leading-tight text-white/80 xs:text-2xl sm:text-3xl md:text-4xl"
        />

        <div className="mt-20 sm:mt-28">
          <DotsAssembleText
            text="90"
            asNumber
            className="font-display leading-none text-salmon text-[6.5rem] xs:text-[8rem] sm:text-[12rem] md:text-[16rem] drop-shadow-[0_0_30px_rgba(255,122,89,0.25)]"
          />
          <DotsAssembleText
            text="Days to become a different person."
            className="label-mono mt-6 text-white/40 text-xs tracking-[0.22em] block"
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
}
