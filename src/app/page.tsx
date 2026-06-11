"use client";

import { useLenis } from "@/hooks/use-lenis";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import { HeroSection } from "@/components/HeroSection";
import { SurvivalSection } from "@/components/SurvivalSection";
import dynamic from "next/dynamic";

const ProblemSection = dynamic(
  () => import("@/components/ProblemSection").then((m) => m.ProblemSection),
  { loading: () => <div className="min-h-screen bg-black" /> }
);
const SystemSection = dynamic(
  () => import("@/components/SystemSection").then((m) => m.SystemSection),
  { loading: () => <div className="min-h-[50vh] bg-black" /> }
);
const JourneySection = dynamic(
  () => import("@/components/JourneySection").then((m) => m.JourneySection),
  { loading: () => <div className="min-h-screen bg-black" /> }
);
const TestimonialsSection = dynamic(
  () => import("@/components/TestimonialsSection").then((m) => m.TestimonialsSection),
  { loading: () => <div className="min-h-[60vh] bg-black" /> }
);
const QualificationFunnel = dynamic(
  () => import("@/components/QualificationFunnel").then((m) => m.QualificationFunnel),
  { loading: () => <div className="min-h-screen bg-black" /> }
);
import { Footer } from "@/components/Footer";

export default function Home() {
  useLenis();

  return (
    <main className="relative w-full bg-brand text-brand overflow-hidden">
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none -z-20 bg-cover bg-center bg-no-repeat opacity-65"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />

      {/* Background Floating Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] xs:w-[500px] xs:h-[500px] rounded-full bg-salmon/14 blur-[100px] sm:blur-[150px] animate-float-1" />
        <div className="absolute top-[35%] right-[-12%] w-[400px] h-[400px] xs:w-[600px] xs:h-[600px] rounded-full bg-teal-deep/8 blur-[120px] sm:blur-[180px] animate-float-2" />
        <div className="absolute top-[60%] left-[-5%] w-[350px] h-[350px] xs:w-[550px] xs:h-[550px] rounded-full bg-salmon/12 blur-[110px] sm:blur-[160px] animate-float-3" />
        <div className="absolute top-[78%] right-[-5%] w-[380px] h-[380px] xs:w-[580px] xs:h-[580px] rounded-full bg-teal-deep/9 blur-[130px] sm:blur-[190px] animate-float-1" />
        <div className="absolute top-[90%] left-[8%] w-[320px] h-[320px] xs:w-[480px] xs:h-[480px] rounded-full bg-salmon/10 blur-[100px] sm:blur-[140px] animate-float-2" />
      </div>

      <Loader />
      <Navbar />
      <CustomCursor />
      <div className="grain animate-pulse" style={{ animationDuration: '4s' }} />
      
      <div className="relative bg-neutral-950 z-10 overflow-hidden">
        <div className="relative z-10">
          <HeroSection />
        </div>
      </div>

      <SurvivalSection />

      <ProblemSection />
      <SystemSection />
      <JourneySection />
      <TestimonialsSection />
      <QualificationFunnel />
      <Footer />
    </main>
  );
}
