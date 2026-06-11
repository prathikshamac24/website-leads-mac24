"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  { t: "You wake up tired.", cls: "" },
  { t: "You plan to start Monday.", cls: "" },
  { t: "But that Monday never comes.", cls: "" },
  { t: "The Routine Breaks.", cls: "" },
  { t: "You are mentally exhausted.", cls: "" },
  { t: "MAC24 fixes the system.", cls: "text-salmon italic" },
  { t: "Not just the symptoms.", cls: "" },
];

export function SurvivalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const total = LINES.length;

      // Set all lines to invisible initially
      gsap.set(linesRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(videoRef.current, { opacity: 0.65 });

      // Create a smooth, scroll-scrubbed timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=320%", // ample scroll distance for smooth pacing
          pin: true,
          pinSpacing: true,
          scrub: 1, // smooth scroll scrub interaction
        },
      });

      for (let i = 0; i < total; i++) {
        const lineEl = linesRef.current[i];
        if (!lineEl) continue;

        const charSpans = lineEl.querySelectorAll(".char-span");

        // 1. Fade in container and scale up to normal
        tl.to(
          lineEl,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          i === 0 ? 0 : undefined
        );

        // 2. Sequential character typewriter reveal scrubbed by scroll
        if (charSpans.length > 0) {
          gsap.set(charSpans, { opacity: 0.15 });

          tl.to(
            charSpans,
            {
              opacity: 1,
              stagger: 0.08, // scrubbed reveal speed per character
              duration: 1.2,
              ease: "power1.out",
            }
          );
        }

        // 3. Hold line visibility during scroll
        tl.to(lineEl, {
          duration: 0.6,
        });

        // 4. Fade container out with a slight shrink exit (except the last line which stays)
        if (i < total - 1) {
          if (i === 0) {
            // Simultaneously fade out the first line and the background video
            tl.to(
              lineEl,
              {
                opacity: 0,
                scale: 1.05,
                duration: 0.5,
                ease: "power2.in",
              }
            );
            tl.to(
              videoRef.current,
              {
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
              },
              "<"
            );
          } else {
            tl.to(
              lineEl,
              {
                opacity: 0,
                scale: 1.05,
                duration: 0.5,
                ease: "power2.in",
              }
            );
          }
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const splitText = (text: string, isSalmon: boolean) => {
    if (text === "—") return <span>—</span>;

    const words = text.split(" ");
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] select-none">
        {word.split("").map((char, charIndex) => (
          <span
            key={charIndex}
            className="char-span inline-block transition-opacity duration-150"
            style={{
              color: isSalmon ? "var(--salmon)" : "#FFFFFF",
            }}
          >
            {char}
          </span>
        ))}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black select-none"
    >
      {/* Background image strictly for the first sentence "You wake up tired" */}
      <div
        ref={videoRef}
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[1] opacity-65"
      >
        <Image
          src="/survival.png"
          alt="Survival"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      {LINES.map((line, i) => (
        <div
          key={i}
          ref={(el) => {
            linesRef.current[i] = el;
          }}
          className="absolute inset-0 flex items-center justify-center px-8 sm:px-12 md:px-20 text-center pointer-events-none z-10"
        >
          <p
            className={`font-display font-bold uppercase tracking-[0.08em] leading-[1.08] text-center select-none text-[8.5vw] xs:text-[8vw] sm:text-[6.5vw] md:text-[5.8vw] lg:text-[5vw] ${line.cls ? line.cls : "text-white"
              }`}
          >
            {splitText(line.t, line.cls.includes("text-salmon"))}
          </p>
        </div>
      ))}
    </section>
  );
}
