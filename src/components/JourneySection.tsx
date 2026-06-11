"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "@/hooks/use-in-view";

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
  {
    n: "01",
    days: "Days 1–30",
    name: "Awareness",
    items: [
      "Wellness parameter check",
      "Personalised nutrition timing plan",
      "Daily follow-ups for first 5 days",
      "Sleep and water baseline established",
      "First energy improvements noticed",
      "Week 4 milestone review",
    ],
  },
  {
    n: "02",
    days: "Days 31–60",
    name: "Discipline",
    items: [
      "Nutrition timing becomes habit",
      "Sleep pattern stabilising",
      "Physical changes visible",
      "Stress management practices active",
      "Community engagement deepening",
      "Week 8 milestone celebration",
    ],
  },
  {
    n: "03",
    days: "Days 61–90",
    name: "Identity Shift",
    items: [
      "Habits fully autonomous",
      "Transformation documented",
      "Emotional stability measurable",
      "Day 90 complete review",
      "Certificate issued",
      '"I am different" — not "I feel different"',
    ],
  },
];

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { ref: headRef, inView } = useInView<HTMLDivElement>(0.2);

  useEffect(() => {
    if (!containerRef.current || !progressBarRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Trace the vertical beam downwards alongside the content on scroll
      gsap.fromTo(
        progressBarRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 45%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        }
      );

      // 2. Individual row activations (Dots expand/glow, cards fade/slide, details stagger)
      PHASES.forEach((_, i) => {
        const row = rowRefs.current[i];
        const dot = dotRefs.current[i];
        const card = cardRefs.current[i];

        if (!row || !dot || !card) return;

        // Animate timeline dot from dim to fully active glowing Salmon
        gsap.fromTo(
          dot,
          {
            borderColor: "rgba(26, 26, 26, 0.15)",
            backgroundColor: "var(--brand-bg)",
            scale: 1,
            boxShadow: "none",
          },
          {
            borderColor: "var(--salmon)",
            backgroundColor: "var(--salmon)",
            scale: 1.35,
            boxShadow: "0 0 14px rgba(255, 122, 89, 0.8)",
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: row,
              start: "top 45%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        // Animate content card (fade-in, slide-up, blur reduction)
        gsap.fromTo(
          card,
          {
            opacity: 0.3,
            y: 35,
            scale: 0.98,
            filter: "blur(1px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: row,
              start: "top 55%",
              toggleActions: "play reverse play reverse",
            },
          }
        );

        // Stagger list items inside the active card
        const items = card.querySelectorAll(".journey-item");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 20 },
            {
              opacity: 1,
              x: 0,
              stagger: 0.08,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 50%",
                toggleActions: "play reverse play reverse",
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="relative w-full bg-transparent py-24 md:py-48">
      <div className="mx-auto max-w-5xl px-6">
        <div ref={headRef}>
          <p
            className={`label-mono text-salmon transition-all duration-700 text-xs sm:text-sm ${
              inView ? "opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            THE JOURNEY
          </p>
          <h2
            className={`mt-6 font-display font-bold text-[2rem] leading-[1.1] xs:text-[2.5rem] sm:text-6xl md:text-7xl tracking-tight transition-all duration-700 delay-100 ${
              inView ? "opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Three phases.
            <br />
            <span className="italic text-brand/70 font-medium">One complete reset.</span>
          </h2>
        </div>

        {/* Scroll-driven timeline wrapper with Tracing Beam */}
        <div ref={containerRef} className="relative mt-20 max-w-4xl mx-auto">
          {/* Vertical backbone line */}
          <div className="absolute left-4 sm:left-12 top-4 bottom-4 w-[2px] bg-brand/10" />

          {/* Active progress line (Tracing Beam) */}
          <div
            ref={progressBarRef}
            className="absolute left-4 sm:left-12 top-4 w-[2px] bg-gradient-to-b from-salmon to-salmon-light origin-top will-change-[height]"
            style={{ height: "0%" }}
          >
            {/* Glowing laser tip at the front of the beam */}
            <div className="absolute bottom-0 -left-[5px] w-3 h-3 rounded-full bg-salmon shadow-[0_0_12px_rgba(255,122,89,0.9)] animate-pulse" />
          </div>

          {/* Timeline Phase Rows */}
          {PHASES.map((p, i) => (
            <div
              key={p.n}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="relative pl-12 sm:pl-24 pb-20 last:pb-4 group"
            >
              {/* Timeline dot */}
              <div
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="absolute left-[6px] sm:left-[38px] top-2.5 w-[20px] h-[20px] rounded-full border-2 border-brand/20 bg-brand-bg z-10 flex items-center justify-center transition-all duration-300"
              >
                {/* Core dot center indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-brand/35 transition-colors group-hover:bg-salmon" />
              </div>

              {/* Glassmorphic Phase card */}
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="glass glass-glow relative p-6 sm:p-10 transition-all duration-300 hover:border-salmon/30"
              >
                {/* Premium left accent indicator */}
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-gradient-to-b from-salmon to-salmon-light opacity-80" />
                
                <div className="flex items-baseline gap-3 sm:gap-4">
                  <span className="label-mono text-salmon font-mono font-medium tracking-[0.22em] text-[10px] sm:text-xs">
                    PHASE {p.n}
                  </span>
                  <span className="label-mono text-brand/45 font-mono tracking-wider text-[10px] sm:text-xs">
                    {p.days}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl italic xs:text-3xl sm:text-4xl md:text-5xl">{p.name}</h3>
                
                <ul className="mt-8 space-y-4">
                  {p.items.map((it) => (
                    <li
                      key={it}
                      className="journey-item flex items-start gap-3 text-xs text-brand/70 sm:text-base"
                    >
                      <span className="mt-2.5 h-[1px] w-3 shrink-0 bg-salmon opacity-80 sm:w-4" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <StructureLine />
      </div>
    </section>
  );
}

function StructureLine() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  const text1 = "You don't need another motivational video.";
  const text2 = "You need ";
  const text3 = "structure";

  const chars1 = text1.split("");
  const chars2 = text2.split("");
  const chars3 = text3.split("");

  return (
    <div ref={ref} className="mx-auto mt-28 max-w-3xl text-center select-none">
      <p className="font-display text-2xl italic leading-relaxed text-brand/85 xs:text-3xl sm:text-4xl md:text-5xl">
        {/* Line 1 */}
        <span className="block mb-2 sm:mb-3">
          {chars1.map((char, i) => {
            const idx = i;
            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  whiteSpace: char === " " ? "pre" : "normal",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(8px)",
                  filter: inView ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.25s ease ${idx * 20}ms, transform 0.35s cubic-bezier(.22,1,.36,1) ${idx * 20}ms, filter 0.35s ease ${idx * 20}ms`,
                }}
              >
                {char}
              </span>
            );
          })}
        </span>

        {/* Line 2 */}
        <span className="block">
          {chars2.map((char, i) => {
            const idx = chars1.length + i;
            return (
              <span
                key={i}
                className="inline-block"
                style={{
                  whiteSpace: char === " " ? "pre" : "normal",
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(8px)",
                  filter: inView ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.25s ease ${idx * 20}ms, transform 0.35s cubic-bezier(.22,1,.36,1) ${idx * 20}ms, filter 0.35s ease ${idx * 20}ms`,
                }}
              >
                {char}
              </span>
            );
          })}

          {/* Structure - colored salmon */}
          <span className="relative inline-block not-italic text-salmon">
            {chars3.map((char, i) => {
              const idx = chars1.length + chars2.length + i;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
                    filter: inView ? "blur(0px)" : "blur(4px)",
                    transition: `opacity 0.25s ease ${idx * 20}ms, transform 0.35s cubic-bezier(.22,1,.36,1) ${idx * 20}ms, filter 0.35s ease ${idx * 20}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}

            {/* Elegant bottom underline */}
            <span
              className="absolute -bottom-1 left-0 h-[2px] bg-salmon"
              style={{
                width: inView ? "100%" : "0%",
                transition: `width 0.9s ease ${(chars1.length + chars2.length + chars3.length) * 20 + 200}ms`,
              }}
            />
          </span>

          {/* Period */}
          <span
            className="inline-block"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.25s ease ${(chars1.length + chars2.length + chars3.length) * 20}ms`,
            }}
          >
            .
          </span>
        </span>
      </p>
    </div>
  );
}
