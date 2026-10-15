import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterProps } from '../types';
import { ChapterLayout, SectionBlock, GlowCard, SeverityBadge } from '../components/shared';
import { SECURITY_EVENTS } from '../data/scenarioData';
import { Clock, Shield, User, Server, AlertTriangle, Eye, X, FileText, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Chapter02Problem({ id }: ChapterProps) {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!alertsRef.current) return;

    const ctx = gsap.context(() => {
      // Stagger alert cards appearing
      gsap.from('.alert-card', {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: alertsRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Reveal text
      ScrollTrigger.create({
        trigger: revealRef.current,
        start: 'top 80%',
        onEnter: () => setShowReveal(true),
        onLeaveBack: () => setShowReveal(false),
      });
    });

    return () => ctx.revert();
  }, []);

  const selectedEventData = SECURITY_EVENTS.find((e) => e.id === selectedEvent);

  const sourceIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
    'Identity System': User,
    'GitHub Audit': FileText,
    'Secret Scanner': Eye,
    'Cloud Audit': Server,
    'Database Monitoring': Shield,
    'Network Monitor': Server,
    'Endpoint Detection': AlertTriangle,
  };

  return (
    <ChapterLayout
      id={id}
      chapterNumber={2}
      headline="MULTIPLE ALERTS. ONE HIDDEN ATTACK."
      subtitle="Organizations generate security logs from many different systems. Individually, these observations may not provide enough context to understand an attack."
    >
      {/* Alert cards grid */}
      <div ref={alertsRef} className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {SECURITY_EVENTS.slice(0, 5).map((event, index) => {
          const SourceIcon = sourceIcons[event.source] || AlertTriangle;
          return (
            <div key={event.id} className="alert-card">
              <GlowCard
                onClick={() => setSelectedEvent(event.id)}
                active={selectedEvent === event.id}
                className="p-4 h-full"
              >
                {/* Time */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock size={12} className="text-[#94A3B8]/60" />
                  <span className="text-[11px] font-mono text-[#94A3B8]">{event.time}</span>
                </div>

                {/* Source */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#E53935]/10 border border-[#E53935]/20 flex items-center justify-center">
                    <SourceIcon size={14} className="text-[#E53935]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#94A3B8]/80 uppercase tracking-wider">
                    {event.source}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#F8FAFC] font-['Space_Grotesk'] mb-2 leading-tight">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-[#94A3B8]/80 leading-relaxed mb-3">
                  {event.description}
                </p>

                {/* Severity */}
                <SeverityBadge severity={event.severity} />

                {/* Click hint */}
                <div className="mt-3 flex items-center gap-1 text-[10px] text-[#94A3B8]/40">
                  <ExternalLink size={10} />
                  <span>Click to inspect</span>
                </div>
              </GlowCard>
            </div>
          );
        })}
      </div>

      {/* Event detail modal */}
      <AnimatePresence>
        {selectedEventData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-[#07080C]/80 backdrop-blur-sm"
              onClick={() => setSelectedEvent(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed z-[56] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[#101522] border border-[#94A3B8]/10 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <SeverityBadge severity={selectedEventData.severity} />
                  <h3 className="mt-2 text-lg font-semibold text-[#F8FAFC] font-['Space_Grotesk']">
                    {selectedEventData.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 rounded-lg border border-[#94A3B8]/20 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <DetailRow label="Source System" value={selectedEventData.source} />
                <DetailRow label="Timestamp" value={selectedEventData.time} />
                <DetailRow label="Identity" value={selectedEventData.identity} />
                <DetailRow label="Affected Asset" value={selectedEventData.affectedAsset} />

                <div>
                  <h4 className="text-xs font-mono text-[#94A3B8]/60 uppercase tracking-wider mb-2">Evidence</h4>
                  <ul className="space-y-1">
                    {selectedEventData.evidence.map((e, i) => (
                      <li key={i} className="text-xs text-[#F8FAFC]/80 flex items-start gap-2">
                        <span className="text-[#E53935] mt-0.5">•</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/10">
                  <h4 className="text-xs font-mono text-[#22C55E] uppercase tracking-wider mb-1">Possible Legitimate Explanation</h4>
                  <p className="text-xs text-[#94A3B8]">{selectedEventData.legitimateExplanation}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#E53935]/5 border border-[#E53935]/10">
                  <h4 className="text-xs font-mono text-[#E53935] uppercase tracking-wider mb-2">Suspicious Indicators</h4>
                  <ul className="space-y-1">
                    {selectedEventData.suspiciousIndicators.map((s, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-2">
                        <AlertTriangle size={10} className="text-[#E53935] mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cinematic reveal */}
      <div ref={revealRef} className="mt-24 text-center">
        <AnimatePresence>
          {showReveal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl md:text-3xl text-[#94A3B8] font-['Space_Grotesk'] font-light"
              >
                Five separate observations.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mx-auto my-8 w-16 h-px bg-[#E53935]/30"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="text-2xl md:text-4xl text-[#F8FAFC] font-['Space_Grotesk'] font-semibold"
              >
                Or one developing{' '}
                <span className="text-[#E53935]">cyberattack</span>?
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChapterLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-mono text-[#94A3B8]/60 uppercase tracking-wider shrink-0">{label}</span>
      <span className="text-xs text-[#F8FAFC] font-mono text-right">{value}</span>
    </div>
  );
}

