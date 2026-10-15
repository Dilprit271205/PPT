import { ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ChapterLayoutProps {
  id: string;
  chapterNumber: number;
  headline: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  minHeight?: string;
}

export function ChapterLayout({
  id,
  chapterNumber,
  headline,
  subtitle,
  children,
  className = '',
  minHeight = '100vh',
}: ChapterLayoutProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current!.querySelectorAll('.chapter-animate'), {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      className={`relative w-full bg-[#07080C] ${className}`}
      style={{ minHeight }}
    >
      {/* Subtle chapter separator line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#E53935]/20 to-transparent" />

      {/* Chapter header */}
      <div ref={headerRef} className="relative pt-32 pb-12 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="chapter-animate">
          <span className="text-xs font-mono text-[#E53935]/60 tracking-[0.3em] uppercase">
            Chapter {String(chapterNumber).padStart(2, '0')}
          </span>
        </div>

        <h2 className="chapter-animate mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F8FAFC] font-['Space_Grotesk'] tracking-tight leading-tight max-w-4xl">
          {headline}
        </h2>

        {subtitle && (
          <p className="chapter-animate mt-6 text-lg md:text-xl text-[#94A3B8] font-['Inter'] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="relative px-6 md:px-12 lg:px-20 pb-24 max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}

// Shared animated section within a chapter
interface SectionBlockProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionBlock({ children, className = '', delay = 0 }: SectionBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glowing card component
interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  active?: boolean;
}

export function GlowCard({
  children,
  className = '',
  glowColor = '#E53935',
  onClick,
  active = false,
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative rounded-2xl border backdrop-blur-sm transition-all cursor-pointer ${
        active
          ? 'border-[#E53935]/40 bg-[#E53935]/5'
          : 'border-[#94A3B8]/10 bg-[#101522]/60 hover:border-[#94A3B8]/20'
      } ${className}`}
      style={
        active
          ? { boxShadow: `0 0 30px ${glowColor}15, 0 0 60px ${glowColor}08` }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

// Severity badge
interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  className?: string;
}

const severityConfig = {
  critical: { bg: 'bg-[#E53935]/15', text: 'text-[#FF4D5A]', border: 'border-[#E53935]/30', label: 'CRITICAL' },
  high: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30', label: 'HIGH' },
  medium: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]/80', border: 'border-[#F59E0B]/20', label: 'MEDIUM' },
  low: { bg: 'bg-[#94A3B8]/10', text: 'text-[#94A3B8]', border: 'border-[#94A3B8]/20', label: 'LOW' },
  info: { bg: 'bg-[#3B82F6]/10', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]/20', label: 'INFO' },
};

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider 
                  rounded-full border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
}

// Status indicator
interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'danger' | 'success' | 'neutral';
  label?: string;
  pulse?: boolean;
}

const statusColors = {
  active: '#3B82F6',
  warning: '#F59E0B',
  danger: '#E53935',
  success: '#22C55E',
  neutral: '#94A3B8',
};

export function StatusIndicator({ status, label, pulse = true }: StatusIndicatorProps) {
  const color = statusColors[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: color }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: color }}
        />
      </span>
      {label && <span className="text-xs font-mono text-[#94A3B8]">{label}</span>}
    </span>
  );
}

