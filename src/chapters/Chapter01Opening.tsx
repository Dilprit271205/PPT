import { useRef, useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Shield } from 'lucide-react';
import { ChapterProps } from '../types';
import { ParticleNetwork } from '../components/ParticleNetwork';

gsap.registerPlugin(ScrollTrigger);

export default function Chapter01Opening({ id, isActive }: ChapterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax on scroll
      gsap.to('.hero-content', {
        y: -100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#07080C]"
    >
      {/* 3D Particle Network Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-[#07080C]" />}>
        <ParticleNetwork className="opacity-60" />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080C] via-transparent to-[#07080C] pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080C]/50 via-transparent to-[#07080C]/50 pointer-events-none z-[1]" />

      {/* Radial glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E53935]/5 rounded-full blur-[120px] pointer-events-none z-[1]" />

      {/* Content */}
      <div className="hero-content relative z-[2] text-center px-6 max-w-4xl mx-auto">
        <AnimatePresence>
          {showContent && (
            <>
              {/* Shield icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'backOut' }}
                className="mx-auto mb-8"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#E53935]/20 to-[#3B0D16]/20 border border-[#E53935]/30 flex items-center justify-center">
                  <Shield className="text-[#E53935]" size={28} />
                </div>
              </motion.div>

              {/* Main title */}
              <motion.h1
                ref={titleRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#F8FAFC] font-['Space_Grotesk'] tracking-tight leading-none"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC] to-[#E53935]">
                  ATTACKTWIN
                </span>
                <br />
                <span className="text-[#E53935]">AI</span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-6 text-lg sm:text-xl md:text-2xl text-[#94A3B8] font-['Inter'] tracking-wide"
              >
                <span className="text-[#F8FAFC] font-medium">Predict.</span>{' '}
                <span className="text-[#F8FAFC] font-medium">Explain.</span>{' '}
                <span className="text-[#E53935] font-semibold">Break the Path.</span>
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-8 text-sm sm:text-base text-[#94A3B8]/80 max-w-2xl mx-auto leading-relaxed font-['Inter']"
              >
                A security digital twin for connected threat analysis, explainable attack-path reasoning, and minimum-cost defensive intervention.
              </motion.p>

              {/* Separator line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.3 }}
                className="mt-10 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#E53935]/50 to-transparent"
              />

              {/* Quote */}
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="mt-8 text-xs sm:text-sm text-[#94A3B8]/60 italic max-w-lg mx-auto font-['Inter']"
              >
                "One suspicious event may appear harmless. Connect the evidence, and an entire attack chain may emerge."
              </motion.blockquote>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="mt-16"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center gap-2 text-[#94A3B8]/40"
                >
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase">
                    Scroll to investigate
                  </span>
                  <ChevronDown size={16} />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

