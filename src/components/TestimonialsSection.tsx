"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const TRANSFORMATIONS = [
  {
    image: "/1.png",
    name: "Jyothi Ravi",
    result: "18 kgs weight lost",
    quote: "Losing 18 kgs was only the beginning. MAC24 completely rebuilt my metabolism. My energy levels are at an all-time high, and my daily routine is finally structured and sustainable."
  },
  {
    image: "/2.png",
    name: "Shilpa",
    result: "45 kgs weight lost",
    quote: "Rebuilding my health and losing 45 kgs feels like a second birth. I went from constant physical exhaustion and joint pain to waking up light, pain-free, and full of life every single day."
  },
  {
    image: "/3.png",
    name: "Azeema",
    result: "15 kgs weight lost",
    quote: "Losing 15 kgs solved my chronic fatigue and sleep issues. The personalized guidance and scientific calorie management fit into my busy lifestyle without feeling like a chore."
  },
  {
    image: "/4.png",
    name: "Venkateshu",
    result: "16 kgs weight lost",
    quote: "MAC24 helped me shed 16 kgs and build real lean muscle. It's not just a calorie-counting routine; it's a high-performance lifestyle shift that completely transformed my identity."
  },
  {
    image: "/5.png",
    name: "Nandu Kumar",
    result: "10 kgs weight lost",
    quote: "Dropping 10 kgs has given me incredible agility. Realigning my nutrition and sleep patterns corrected my gut health and concentration issues. This is a game-changer."
  },
  {
    image: "/7.png",
    name: "Juiyena",
    result: "30 kgs weight lost",
    quote: "Losing 30 kgs was a dream come true, but the real win is my metabolic stability. MAC24 rebuilt my entire daily routine, sleep hygiene, and body confidence from scratch."
  },
  {
    image: "/8.png",
    name: "Chandu",
    result: "14 kgs weight lost",
    quote: "I lost 14 kgs of stubborn fat and my energy indices shot up. The systematic training and lifestyle protocols fit seamlessly into my schedule, giving me ultimate clarity and physical power."
  },
  {
    image: "/9.png",
    name: "Rajesh",
    result: "14.5 kgs weight lost",
    quote: "Losing 14.5 kgs restored my youthful vigor. My visceral fat has decreased significantly, and my general vitals have stabilized. I feel healthier than I did in my twenties."
  },
  {
    image: "/10.png",
    name: "Padmavathi",
    result: "23 kgs weight lost",
    quote: "Shedding 23 kgs helped me regain my confidence and reverse years of sluggishness. The meal alignment and custom hydration routines literally changed my life."
  },
  {
    image: "/11.png",
    name: "Karan Ponanna",
    result: "14 kg weight lost",
    quote: "Losing 14 kgs transformed my athletic capability. I feel extremely light, fast, and mentally sharper. Rebuilding my hydration and nutrition habits was the key."
  },
];

export function TestimonialsSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  const [activeIndex, setActiveIndex] = useState(1); // Default to second card for perfect initial balance
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(375);

  // Update window width on resize for adaptive layouts
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + TRANSFORMATIONS.length) % TRANSFORMATIONS.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % TRANSFORMATIONS.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev + 1) % TRANSFORMATIONS.length);
    } else if (isRightSwipe) {
      setActiveIndex((prev) => (prev - 1 + TRANSFORMATIONS.length) % TRANSFORMATIONS.length);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Compute 3D coverflow styling dynamically based on distance from center active card
  const getCardStyles = (idx: number) => {
    const diff = idx - activeIndex;
    const absDiff = Math.abs(diff);

    // Responsive widths and translations
    const isMobile = windowWidth < 640;
    const activeWidth = isMobile ? 180 : 240;
    const sideWidth = isMobile ? 40 : 54;
    const centerOffset = isMobile ? 110 : 155;
    const sideOffset = isMobile ? 40 : 56;

    if (diff === 0) {
      return {
        transform: "translateX(0px) scale(1)",
        width: `${activeWidth}px`,
        opacity: 1,
        zIndex: 30,
      };
    }

    if (diff === -1) {
      return {
        transform: `translateX(-${centerOffset}px) scale(0.9)`,
        width: `${sideWidth}px`,
        opacity: 0.8,
        zIndex: 20,
      };
    }

    if (diff === 1) {
      return {
        transform: `translateX(${centerOffset}px) scale(0.9)`,
        width: `${sideWidth}px`,
        opacity: 0.8,
        zIndex: 20,
      };
    }

    if (diff === -2) {
      return {
        transform: `translateX(-${centerOffset + sideOffset}px) scale(0.82)`,
        width: `${sideWidth}px`,
        opacity: 0.5,
        zIndex: 10,
      };
    }

    if (diff === 2) {
      return {
        transform: `translateX(${centerOffset + sideOffset}px) scale(0.82)`,
        width: `${sideWidth}px`,
        opacity: 0.5,
        zIndex: 10,
      };
    }

    if (diff === -3) {
      return {
        transform: `translateX(-${centerOffset + sideOffset * 2}px) scale(0.75)`,
        width: `${sideWidth}px`,
        opacity: 0.25,
        zIndex: 5,
      };
    }

    if (diff === 3) {
      return {
        transform: `translateX(${centerOffset + sideOffset * 2}px) scale(0.75)`,
        width: `${sideWidth}px`,
        opacity: 0.25,
        zIndex: 5,
      };
    }

    // Completely off-screen
    return {
      transform: `translateX(${diff > 0 ? 350 : -350}px) scale(0.6)`,
      width: `${sideWidth}px`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    };
  };

  return (
    <section id="testimonials" className="relative w-full bg-neutral-950 py-20 md:py-32 overflow-hidden z-20">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-salmon/5 blur-[130px] rounded-full pointer-events-none z-0" />

      <div ref={ref} className="mx-auto max-w-md xs:max-w-lg sm:max-w-4xl px-4 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <p className="label-mono text-salmon font-bold tracking-[0.25em] text-xs uppercase drop-shadow-[0_0_8px_rgba(255,122,89,0.3)]">
            CASE STUDIES
          </p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl md:text-6xl uppercase text-white tracking-wide">
            Proven <span className="text-salmon italic font-black drop-shadow-[0_0_12px_rgba(255,122,89,0.35)]">Transformations</span>
          </h2>
          <p className="mt-3 text-xs text-neutral-400 max-w-xs sm:max-w-md mx-auto leading-relaxed">
            Real metrics. Real commit. Swipe or click to browse through 90 days of body and lifestyle reconstruction.
          </p>
        </div>

        {/* Coverflow Deck Slider Area */}
        <div 
          className="relative w-full h-[270px] sm:h-[340px] flex items-center justify-center select-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Deck Container */}
          <div className="relative w-full h-full flex items-center justify-center">
            {TRANSFORMATIONS.map((t, idx) => {
              const diff = idx - activeIndex;
              const absDiff = Math.abs(diff);
              const isCenter = diff === 0;
              const cardStyles = getCardStyles(idx);
              const firstName = t.name.split(" ")[0].toUpperCase();

              return (
                <div
                  key={t.image}
                  onClick={() => setActiveIndex(idx)}
                  style={cardStyles}
                  className={`absolute h-[220px] sm:h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out cursor-pointer border ${
                    isCenter 
                      ? "border-salmon/35 bg-neutral-900 shadow-[0_15px_35px_rgba(255,122,89,0.15)]" 
                      : "border-white/10 bg-neutral-950"
                  }`}
                >
                  {/* Photo Frame */}
                  <div className="relative w-full h-full bg-neutral-950">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="(max-width: 640px) 180px, 240px"
                      priority={idx === activeIndex || idx === 1}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isCenter ? "scale-100 filter-none" : "scale-105 filter brightness-[0.4] contrast-[0.9]"
                      }`}
                    />

                    {/* Gradient shading overlay for active center card */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-80" />
                    )}

                    {/* Vertical Letter Stacking Overlay for side (unfocused) cards - matches Kaity / Mike reference */}
                    {!isCenter && absDiff <= 3 && (
                      <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[0.5px] flex flex-col items-center justify-center gap-1 sm:gap-2 py-4">
                        {firstName.split("").map((letter, lIdx) => (
                          <span 
                            key={lIdx} 
                            className="text-[9px] sm:text-xs font-display font-black tracking-widest text-white/95 leading-none"
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Micro Navigation Buttons */}
        <div className="flex justify-center items-center gap-6 mt-2 mb-6">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + TRANSFORMATIONS.length) % TRANSFORMATIONS.length)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Navigation dots indicator */}
          <div className="flex gap-1.5">
            {TRANSFORMATIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-6 bg-salmon" : "w-1.5 bg-white/20"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % TRANSFORMATIONS.length)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic White Boxed Layout - Displays what they said based on weight lost */}
        <div className="mx-auto max-w-sm sm:max-w-md bg-white rounded-3xl p-6 xs:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-neutral-100 text-neutral-900 transition-all duration-500 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Salmon border indicator */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-salmon/80 to-salmon" />
          
          {/* Header element */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-4xl font-serif text-salmon/30 select-none leading-none">“</span>
            <span className="bg-salmon/10 text-salmon px-3.5 py-1 rounded-full font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase">
              {TRANSFORMATIONS[activeIndex].result}
            </span>
          </div>

          {/* Core Quote Content */}
          <p className="text-neutral-800 text-xs sm:text-sm md:text-base leading-relaxed italic font-medium min-h-[72px] sm:min-h-[80px] transition-all duration-300">
            "{TRANSFORMATIONS[activeIndex].quote}"
          </p>

          {/* Footer of card */}
          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
            <div>
              <h4 className="font-display text-sm sm:text-base uppercase tracking-wider text-neutral-950 font-extrabold">
                {TRANSFORMATIONS[activeIndex].name}
              </h4>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono block mt-0.5">
                Verified MAC24 Member
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-100 px-3 py-1.5 rounded-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-salmon animate-pulse" />
              <span className="text-[8px] font-bold font-mono tracking-widest text-neutral-600 uppercase">
                90 Days Rebuild
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
