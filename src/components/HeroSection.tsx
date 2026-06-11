"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const ignoreRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const redOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Intro animations — text fades in on load
      gsap.from(introRef.current!.querySelectorAll(".intro-line"), {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.25,
        ease: "power3.out",
        delay: 1.2,
      });

      // IGNORE fades in on load
      gsap.from(ignoreRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.4,
        ease: "power3.out",
        delay: 1.6,
      });

      const mm = gsap.matchMedia();

      // Desktop Timeline
      mm.add("(min-width: 768px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        })
        // 1. Fade out intro text
        .to(introRef.current, { opacity: 0, duration: 0.3 }, 0)
        // 2. Fade out scroll hint
        .to(scrollHintRef.current, { opacity: 0, duration: 0.2 }, 0)
        // 3. IGNORE zooms to 75x (fullest) and turns red, while red background fades in
        .to(
          ignoreRef.current,
          {
            scale: 75,
            color: "#FF0000",
            duration: 1.0,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          redOverlayRef.current,
          {
            opacity: 1,
            duration: 0.7,
            ease: "power1.inOut",
          },
          0.2
        );
      });

      // Mobile Timeline
      mm.add("(max-width: 767px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        })
        // 1. Fade out intro text
        .to(introRef.current, { opacity: 0, duration: 0.3 }, 0)
        // 2. Fade out scroll hint
        .to(scrollHintRef.current, { opacity: 0, duration: 0.2 }, 0)
        // 3. IGNORE zooms to 90x (fullest) and turns red, while red background fades in
        .to(
          ignoreRef.current,
          {
            scale: 90,
            color: "#FF0000",
            duration: 1.0,
            ease: "power2.inOut",
          },
          0
        )
        .to(
          redOverlayRef.current,
          {
            opacity: 1,
            duration: 0.7,
            ease: "power1.inOut",
          },
          0.2
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Premium background video: monk.mp4 */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[1]"
      >
        <video
          src="/monk.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[0.65] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Red transition overlay for solid red fade transition */}
      <div
        ref={redOverlayRef}
        className="absolute inset-0 bg-red-600 z-[5] pointer-events-none opacity-0"
      />

      {/* Hero text content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <div
          ref={stackRef}
          className="flex flex-col items-center justify-center w-full -translate-y-[9vh] md:-translate-y-[12vh]"
        >
          <div ref={introRef} className="flex flex-col items-center justify-center">
            <p className="intro-line label-mono mb-4 text-salmon text-xs tracking-[0.22em] sm:mb-6 sm:text-sm">
              MAC24 · BANGALORE
            </p>
            <h1 className="intro-line font-display text-[2.5rem] leading-[1.1] text-white xs:text-5xl sm:text-6xl md:text-7xl">
              Your body doesn't lie.
            </h1>
            <p className="intro-line mt-3 font-display text-xl italic text-white/70 xs:text-2xl sm:text-3xl md:text-4xl">
              It shows what you
            </p>
          </div>

          {/* IGNORE - snugged snug underneath the last line */}
          <div
            ref={ignoreRef}
            className="mt-1 sm:mt-2 will-change-transform z-20 flex justify-center select-none font-display font-black leading-none tracking-tight text-[4.5rem] xs:text-[5.5rem] sm:text-[8rem] md:text-[11rem]"
            style={{ color: "#FFFFFF" }}
          >
            IGNORE
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="pointer-events-none absolute bottom-8 left-1/2 z-40 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="label-mono text-white/40">SCROLL</span>
        <div className="relative h-12 w-px bg-white/20">
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-salmon scroll-dot" />
        </div>
      </div>
    </section>
  );
}
