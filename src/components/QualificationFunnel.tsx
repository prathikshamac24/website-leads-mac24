"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { saveLead } from "@/lib/savedLeads";

function Typewriter({ text, className = "", speed = 40, startDelay = 0 }: { text: string; className?: string; speed?: number; startDelay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const tick = () => {
        setN((v) => {
          if (v >= text.length) return v;
          id = setTimeout(tick, speed);
          return v + 1;
        });
      };
      tick();
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(id);
    };
  }, [text, speed, startDelay]);
  return (
    <h3 className={className}>
      {text.slice(0, n)}
      <span className="inline-block w-[2px] h-[0.9em] align-[-0.1em] bg-salmon ml-1 animate-pulse" style={{ opacity: n < text.length ? 1 : 0 }} />
    </h3>
  );
}

function TypewriterButton({ text, className = "", onClick, delay = 0, speed = 30 }: { text: string; className?: string; onClick: () => void; delay?: number; speed?: number }) {
  const [n, setN] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  useEffect(() => {
    if (!visible) return;
    let id: ReturnType<typeof setTimeout>;
    const tick = () => {
      setN((v) => {
        if (v >= text.length) return v;
        id = setTimeout(tick, speed);
        return v + 1;
      });
    };
    tick();
    return () => clearTimeout(id);
  }, [visible, text, speed]);
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ opacity: visible ? 1 : 0, transition: "opacity .4s ease" }}
    >
      {text.slice(0, n)}
      {visible && n < text.length && (
        <span className="inline-block w-[2px] h-[1em] align-middle bg-current ml-0.5" />
      )}
    </button>
  );
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 99; // 99 = soft exit

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export function QualificationFunnel() {
  const [step, setStep] = useState<Step>(1);
  const [subStep, setSubStep] = useState(1); // 1 to 2 stages (Goals/Occupation/Logistics are removed)
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    struggle: "",
    timing: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const exit = () => setStep(99);

  const handleNameChange = (val: string) => {
    // Only allow letters and spaces
    const sanitized = val.replace(/[^a-zA-Z\s]/g, "");
    setForm((prev) => ({ ...prev, name: sanitized }));
    
    if (sanitized.trim().length === 0) {
      setErrors((prev) => ({ ...prev, name: "Name is required." }));
    } else if (sanitized.trim().length < 2) {
      setErrors((prev) => ({ ...prev, name: `Name must be at least 2 characters (currently ${sanitized.trim().length}/2).` }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleAgeChange = (val: string) => {
    // Only allow digits
    const sanitized = val.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, age: sanitized }));
    
    if (sanitized.trim().length === 0) {
      setErrors((prev) => ({ ...prev, age: "Age is required." }));
      return;
    }
    
    const ageNum = Number(sanitized);
    if (isNaN(ageNum) || ageNum < 6) {
      setErrors((prev) => ({ ...prev, age: "Age must be 6 or above." }));
    } else if (ageNum > 100) {
      setErrors((prev) => ({ ...prev, age: "Please enter a realistic age (100 or below)." }));
    } else {
      setErrors((prev) => ({ ...prev, age: "" }));
    }
  };

  const handlePhoneChange = (val: string) => {
    // Only allow digits
    const sanitized = val.replace(/[^0-9]/g, "");
    // Limit strictly to 10 digits
    const limited = sanitized.slice(0, 10);
    setForm((prev) => ({ ...prev, phone: limited }));
    
    if (limited.length === 0) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required." }));
    } else if (limited.length < 10) {
      setErrors((prev) => ({ ...prev, phone: `Phone number must be exactly 10 digits (currently ${limited.length}/10).` }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleEmailChange = (val: string) => {
    setForm((prev) => ({ ...prev, email: val }));
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.trim().length === 0) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (!emailRegex.test(val)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateSubStep1 = () => {
    const tempErrors = { name: "", age: "" };
    let isValid = true;
    
    if (form.name.trim().length === 0) {
      tempErrors.name = "Name is required.";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      tempErrors.name = "Name must be at least 2 characters.";
      isValid = false;
    }
    
    const ageNum = Number(form.age);
    if (!form.age) {
      tempErrors.age = "Age is required.";
      isValid = false;
    } else if (isNaN(ageNum) || ageNum < 6) {
      tempErrors.age = "Age must be 6 or above.";
      isValid = false;
    } else if (ageNum > 100) {
      tempErrors.age = "Please enter a realistic age (100 or below).";
      isValid = false;
    }
    
    setErrors(prev => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const validateSubStep2 = () => {
    const tempErrors = { phone: "", email: "" };
    let isValid = true;
    
    if (form.phone.trim().length === 0) {
      tempErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (form.phone.length < 10) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.trim().length === 0) {
      tempErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      tempErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
    
    setErrors(prev => ({ ...prev, ...tempErrors }));
    return isValid;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateSubStep2()) {
      return;
    }
    
    setIsSubmitting(true);
    const isSuccess = await saveLead({
      name: form.name,
      email: form.email,
      phone: `+91 ${form.phone}`,
    });
    setIsSubmitting(false);
    
    if (isSuccess) {
      setSubmitted(true);
    } else {
      setSubmitError("Failed to submit assessment. Please check your network connection and try again.");
    }
  };

  // Compute precise continuous progress percentages
  const getProgressPercentage = () => {
    if (submitted) return 100;
    if (step === 99) return 0;
    if (step === 1) return 15;
    if (step === 2) return 30;
    if (step === 3) return 48;
    if (step === 4) return 66;
    if (step === 5) {
      return 66 + subStep * 16; // Stretches from 82% to 98%
    }
    return 0;
  };

  return (
    <section id="funnel" className="relative min-h-screen w-full overflow-hidden bg-neutral-950 py-24 md:py-36 z-20">
      {/* Background neon ambient highlight overlays */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-salmon/5 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-salmon/5 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Modern, glow-in-the-dark progress bar */}
      {!submitted && step !== 99 && (
        <div className="absolute top-10 left-0 right-0 max-w-xl mx-auto px-6 z-20 flex flex-col gap-2">
          <div className="flex justify-between text-[9px] font-mono tracking-widest text-white/40 uppercase">
            <span>METABOLIC PROFILE DECK</span>
            <span className="text-salmon font-bold">{Math.round(getProgressPercentage())}% COMPLETE</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
            <div
              style={{ width: `${getProgressPercentage()}%` }}
              className="h-full bg-salmon shadow-[0_0_12px_rgba(255,122,89,0.6)] rounded-full transition-all duration-700 ease-out"
            />
          </div>
        </div>
      )}

      <div className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              {...fade}
              className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
            >
              {/* Card top border flare */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />
              
              <Typewriter
                text="Are you genuinely ready to change your lifestyle?"
                className="font-display text-2xl leading-snug xs:text-3xl sm:text-4xl uppercase text-white tracking-wide font-extrabold"
                speed={32}
              />
              <div className="mt-12 flex flex-col items-center gap-4">
                <TypewriterButton
                  text="Yes, I'm ready to rebuild"
                  className="w-full max-w-md py-4 rounded-2xl bg-salmon text-white hover:bg-salmon/90 shadow-[0_0_20px_rgba(255,122,89,0.2)] hover:shadow-[0_0_30px_rgba(255,122,89,0.35)] transition-all duration-300 transform active:scale-[0.98] font-bold text-xs uppercase tracking-wider cursor-pointer"
                  onClick={() => setStep(2)}
                  delay={1400}
                />
                <TypewriterButton
                  text="I'm still unsure"
                  className="text-xs text-white/40 font-mono tracking-widest hover:text-salmon transition-colors duration-200"
                  onClick={exit}
                  delay={2600}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              {...fade}
              className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />
              <h3 className="font-display text-2xl leading-snug xs:text-3xl sm:text-4xl uppercase text-white tracking-wide font-extrabold">
                Can you commit the next 90 days to rebuilding yourself?
              </h3>
              <p className="mt-5 text-xs text-white/50 font-mono tracking-wider">
                Results only happen when consistency exists.
              </p>
              <div className="mt-12 flex flex-col items-center gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="w-full max-w-md py-4 rounded-2xl bg-salmon text-white hover:bg-salmon/90 shadow-[0_0_20px_rgba(255,122,89,0.2)] hover:shadow-[0_0_30px_rgba(255,122,89,0.35)] transition-all duration-300 transform active:scale-[0.98] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Yes, I Commit
                </button>
                <button
                  onClick={exit}
                  className="text-xs text-white/40 font-mono tracking-widest hover:text-salmon transition-colors duration-200 cursor-pointer"
                >
                  No, I cannot commit
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              {...fade}
              className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />
              <p className="label-mono text-salmon text-[10px] tracking-[0.25em] font-bold uppercase drop-shadow-[0_0_8px_rgba(255,122,89,0.3)]">
                BEFORE YOU CONTINUE
              </p>
              <h3 className="mt-6 font-display text-xl leading-snug xs:text-2xl sm:text-3xl uppercase text-white tracking-wide font-extrabold">
                MAC24 is a premium transformation system designed only for serious individuals.
              </h3>
              <p className="mx-auto mt-5 max-w-md text-xs text-white/60 sm:text-sm leading-relaxed">
                This journey requires personal investment, discipline, and absolute commitment. We only work with people who are truly ready to invest in their health identity.
              </p>
              <div className="mt-12 flex flex-col items-center gap-4">
                <button
                  onClick={() => setStep(4)}
                  className="w-full max-w-md py-4 rounded-2xl bg-salmon text-white hover:bg-salmon/90 shadow-[0_0_20px_rgba(255,122,89,0.2)] hover:shadow-[0_0_30px_rgba(255,122,89,0.35)] transition-all duration-300 transform active:scale-[0.98] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  I Understand & Accept
                </button>
                <button
                  onClick={exit}
                  className="text-xs text-white/40 font-mono tracking-widest hover:text-salmon transition-colors duration-200 cursor-pointer"
                >
                  I'm not ready yet
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && <Screen4 onContinue={() => setStep(5)} onExit={exit} />}

          {step === 5 && !submitted && (
            <motion.div
              key="s5"
              {...fade}
              className="w-full max-w-xl mx-auto relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-12"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />

              {/* Progress Indicator for Sub-Steps */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-mono tracking-widest text-salmon font-bold">
                  ASSESSMENT STAGE {subStep} OF 2
                </span>
                <span className="text-[10px] font-mono text-white/30">
                  {subStep === 1 && "Identity Details"}
                  {subStep === 2 && "Contact Channels"}
                </span>
              </div>

              <form onSubmit={submit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Stage 1: Basic Identity (Name & Age) */}
                  {subStep === 1 && (
                    <motion.div
                      key="sub1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <h4 className="font-display text-xl uppercase text-white tracking-wider font-extrabold mb-4">
                        Let's start with your identity.
                      </h4>
                      <Field
                        label="Full Name"
                        value={form.name}
                        onChange={handleNameChange}
                        required
                        placeholder="e.g. Rahul Sharma"
                        error={errors.name}
                      />
                      <Field
                        label="Age"
                        type="number"
                        value={form.age}
                        onChange={handleAgeChange}
                        required
                        placeholder="e.g. 32"
                        error={errors.age}
                      />
                    </motion.div>
                  )}

                  {/* Stage 2: Contact Channels (Phone & Email) */}
                  {subStep === 2 && (
                    <motion.div
                      key="sub2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <h4 className="font-display text-xl uppercase text-white tracking-wider font-extrabold mb-4">
                        How can we secure your report?
                      </h4>
                      <Field
                        label="Phone Number"
                        type="tel"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        required
                        placeholder="98765 43210"
                        error={errors.phone}
                        prefix="+91"
                        maxLength={10}
                      />
                      <Field
                        label="Email ID"
                        type="email"
                        value={form.email}
                        onChange={handleEmailChange}
                        required
                        placeholder="e.g. rahul@outlook.com"
                        error={errors.email}
                      />
                    </motion.div>
                  )}


                </AnimatePresence>

                {submitError && (
                  <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono text-center">
                    {submitError}
                  </div>
                )}

                {/* Multistage Form Navigation Bar */}
                <div className="flex gap-4 pt-4 border-t border-white/5">
                  {subStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setSubStep((prev) => prev - 1)}
                      className="flex items-center gap-1.5 px-6 py-4 rounded-2xl border border-white/15 text-white/70 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-200 cursor-pointer text-xs font-bold uppercase tracking-wider"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                  )}

                  {subStep < 2 ? (
                    <button
                      type="button"
                      disabled={!form.name.trim() || !form.age.trim()}
                      onClick={() => {
                        if (validateSubStep1()) {
                          setSubStep(2);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-4 rounded-2xl bg-salmon text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-salmon/90 shadow-[0_0_20px_rgba(255,122,89,0.2)] active:scale-95 transition-all duration-200 cursor-pointer text-xs font-bold uppercase tracking-wider"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || !form.phone.trim() || !form.email.trim()}
                      className="flex-1 py-4 rounded-2xl bg-salmon text-white disabled:opacity-40 disabled:pointer-events-none hover:bg-salmon/90 shadow-[0_0_20px_rgba(255,122,89,0.3)] active:scale-[0.98] transition-all duration-200 cursor-pointer text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Applying...
                        </>
                      ) : (
                        "Apply For Assessment →"
                      )}
                    </button>
                  )}
                </div>

                <p className="text-center text-[10px] text-white/30 tracking-wider">
                  No spam. Strictly confidential. We review and respond within 2 hours.
                </p>
              </form>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              key="done"
              {...fade}
              className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 18 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-salmon shadow-[0_0_15px_rgba(255,122,89,0.2)] bg-salmon/5"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-salmon">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="mt-10 font-display text-2xl uppercase text-white tracking-wide font-extrabold">
                Your Assessment Request Has Been Secured
              </h3>
              <p className="mt-4 text-xs text-white/50 font-mono tracking-wider max-w-md mx-auto leading-relaxed">
                We have initialized your metabolic index profile. Our lifestyle architects will review your inputs and contact you within 2 hours via the provided coordinates.
              </p>
            </motion.div>
          )}

          {step === 99 && (
            <motion.div
              key="exit"
              {...fade}
              className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />
              <p className="font-display text-xl uppercase tracking-wider text-white/70 font-bold leading-relaxed">
                Come back when you are ready
                <br />
                to prioritize yourself.
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  setSubStep(1);
                  setSubmitted(false);
                }}
                className="mt-8 text-xs text-salmon font-mono tracking-widest underline underline-offset-4 hover:text-salmon/80 transition-colors duration-200 cursor-pointer"
              >
                Restart Assessment
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Screen4({ onContinue, onExit }: { onContinue: () => void; onExit: () => void }) {
  const [showTriggerMessage, setShowTriggerMessage] = useState(false);

  if (showTriggerMessage) {
    return (
      <motion.div
        key="s4-trigger"
        {...fade}
        className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-red-950/20 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
      >
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600" />
        <h3 className="font-display text-2xl uppercase text-red-500 tracking-wider font-extrabold mb-6">
          Access Terminated
        </h3>
        <p className="mt-6 font-display text-lg uppercase tracking-wider text-white font-bold leading-relaxed">
          You are not ready to be here on this page.
        </p>
        <p className="mt-4 text-xs text-white/50 font-mono tracking-wider max-w-md mx-auto leading-relaxed">
          Metabolic transformation requires absolute conviction. Half-hearted attempts yield zero results. Come back when you value your health identity.
        </p>
        <button
          onClick={onExit}
          className="mt-12 w-full max-w-md py-4 rounded-2xl bg-neutral-900 border border-white/10 text-white/60 hover:text-white hover:bg-neutral-800 transition-all duration-300 font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          Exit Assessment
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="s4"
      {...fade}
      className="w-full text-center relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-16 max-w-xl mx-auto"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-salmon/40 via-salmon to-salmon/40" />
      <div className="mx-auto flex h-24 w-24 items-center justify-center">
        <div className="h-10 w-10 rounded-full bg-salmon/30 breathe sm:h-12 sm:w-12 shadow-[0_0_20px_rgba(255,122,89,0.3)] animate-pulse" />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 font-display text-xl uppercase tracking-wider text-white font-bold leading-snug"
      >
        One day you'll wish you had started earlier.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="mt-6 font-display text-xl uppercase tracking-wider text-salmon font-extrabold leading-snug"
      >
        That day is already getting closer.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 0.6 }}
        className="mt-12 flex flex-col items-center gap-4 w-full"
      >
        <button
          onClick={onContinue}
          className="w-full max-w-md py-4 rounded-2xl bg-salmon text-white hover:bg-salmon/90 shadow-[0_0_20px_rgba(255,122,89,0.2)] hover:shadow-[0_0_30px_rgba(255,122,89,0.35)] transition-all duration-300 transform active:scale-[0.98] font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          YES, I'M READY
        </button>
        <button
          type="button"
          onClick={() => setShowTriggerMessage(true)}
          className="text-xs text-white/30 font-mono tracking-widest hover:text-red-400 hover:underline transition-all duration-200 cursor-pointer mt-2"
        >
          I am not ready yet
        </button>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  error,
  prefix,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  prefix?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="label-mono text-salmon text-[10px] tracking-widest block font-bold mb-2">
        {label}
      </label>
      <div className={`relative flex rounded-2xl border bg-neutral-950/40 transition-all duration-300 ${
        error 
          ? "border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-shake" 
          : "border-white/10 focus-within:border-salmon/40 focus-within:shadow-[0_0_20px_rgba(255,122,89,0.15)]"
      }`}>
        {prefix && (
          <span className="flex items-center pl-5 pr-1 text-white/50 text-sm font-mono select-none font-bold">
            {prefix}
          </span>
        )}
        <input
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-transparent py-4 text-white text-sm outline-none transition placeholder-white/20 ${
            prefix ? "pl-1 pr-5" : "px-5"
          }`}
        />
      </div>
      {error && (
        <span className="text-[10px] font-mono text-red-400 mt-1 block pl-2 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
}
