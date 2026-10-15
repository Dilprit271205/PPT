import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterProps, WorkflowStage } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import { WORKFLOW_STAGES } from '../data/scenarioData';
import {
  Database,
  Sliders,
  Users,
  Share2,
  ShieldAlert,
  GitPullRequest,
  BrainCircuit,
  TrendingUp,
  AlertOctagon,
  BellRing,
  Wrench,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  X,
  Code2,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stageIcons: Record<number, any> = {
  1: Database,
  2: Sliders,
  3: Users,
  4: Share2,
  5: ShieldAlert,
  6: GitPullRequest,
  7: BrainCircuit,
  8: TrendingUp,
  9: AlertOctagon,
  10: BellRing,
  11: Wrench,
  12: LayoutDashboard,
};

const statusBadgeColors = {
  implemented: {
    bg: 'bg-[#22C55E]/10',
    border: 'border-[#22C55E]/30',
    text: 'text-[#22C55E]',
    label: 'Implemented Prototype',
  },
  proposed: {
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/30',
    text: 'text-[#F59E0B]',
    label: 'Proposed Architecture',
  },
  future: {
    bg: 'bg-[#3B82F6]/10',
    border: 'border-[#3B82F6]/30',
    text: 'text-[#3B82F6]',
    label: 'Future Integration',
  },
};

export default function Chapter06Workflow({ id }: ChapterProps) {
  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advance through stages when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStageIndex((prev) => (prev + 1) % WORKFLOW_STAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStage = WORKFLOW_STAGES[activeStageIndex];

  return (
    <ChapterLayout
      id={id}
      chapterNumber={6}
      headline="HOW ATTACKTWIN AI WORKS."
      subtitle="From continuous telemetry ingestion to automated response and explainable oversight — explore the end-to-end security architecture."
    >
      <div ref={containerRef} className="space-y-10">
        {/* Playback & Stage Selector Bar */}
        <SectionBlock className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#101522]/80 border border-[#94A3B8]/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E53935]/15 border border-[#E53935]/40 text-[#FF4D5A] hover:bg-[#E53935]/25 transition-all font-mono text-xs font-semibold"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'PAUSE PIPELINE' : 'SIMULATE PIPELINE'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setActiveStageIndex(0);
              }}
              className="p-2 rounded-xl border border-[#94A3B8]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#F8FAFC]/40 transition-all"
              title="Reset"
            >
              <RotateCcw size={14} />
            </button>
            <div className="h-4 w-px bg-[#94A3B8]/20 mx-1 hidden sm:block" />
            <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">
              Stage <span className="text-[#F8FAFC] font-semibold">{activeStageIndex + 1}</span> of {WORKFLOW_STAGES.length}:{' '}
              <span className="text-[#FF4D5A]">{currentStage.title}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#94A3B8]/70">Status:</span>
            {(() => {
              const statusCfg = statusBadgeColors[currentStage.status];
              return (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                  {statusCfg.label}
                </span>
              );
            })()}
          </div>
        </SectionBlock>

        {/* Visual Architecture Map: Linear stages 1-9 -> Split Branches 10 & 11 -> Reconverge to 12 */}
        <SectionBlock className="relative">
          <div className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]/60 mb-4 flex items-center gap-2">
            <span>Interactive Architecture Map</span>
            <span className="text-[#E53935]">•</span>
            <span className="text-[#94A3B8]/40">Click any stage to inspect deep telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Stages 1 to 9 */}
            {WORKFLOW_STAGES.slice(0, 9).map((stage, idx) => {
              const Icon = stageIcons[stage.number] || Database;
              const isCurrent = activeStageIndex === idx;
              const statusCfg = statusBadgeColors[stage.status];

              return (
                <GlowCard
                  key={stage.id}
                  onClick={() => {
                    setActiveStageIndex(idx);
                    setSelectedStage(stage);
                  }}
                  active={isCurrent}
                  className="p-4 relative transition-all group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="w-6 h-6 rounded-lg bg-[#07080C] border border-[#94A3B8]/20 flex items-center justify-center font-mono text-[10px] text-[#94A3B8] font-bold">
                      {String(stage.number).padStart(2, '0')}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                      {stage.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={16} className={isCurrent ? 'text-[#FF4D5A]' : 'text-[#94A3B8] group-hover:text-[#F8FAFC]'} />
                    <h4 className="text-xs font-bold text-[#F8FAFC] font-['Space_Grotesk'] truncate">
                      {stage.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]/80 line-clamp-2 leading-relaxed">
                    {stage.purpose}
                  </p>
                </GlowCard>
              );
            })}
          </div>

          {/* PARALLEL DUAL BRANCH CONNECTOR */}
          <div className="my-8 p-6 rounded-2xl bg-gradient-to-b from-[#101522]/90 to-[#07080C] border border-[#94A3B8]/15 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-[#94A3B8]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#E53935]/20 text-[#FF4D5A] font-mono text-[10px] font-bold">
                  STAGE 09 OUTPUT
                </span>
                <span className="text-xs font-mono text-[#94A3B8]">Prioritized Risk Assessment</span>
                <ArrowRight size={14} className="text-[#E53935]" />
                <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-['Space_Grotesk']">
                  Dual Parallel Execution
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#94A3B8]/50">Zero-latency dispatch</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              {/* Branch A: Stage 10 Alerting & Escalation */}
              {(() => {
                const stage10 = WORKFLOW_STAGES[9];
                const Icon10 = stageIcons[10];
                const isCurrent = activeStageIndex === 9;
                return (
                  <div
                    onClick={() => {
                      setActiveStageIndex(9);
                      setSelectedStage(stage10);
                    }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-[#E53935] bg-[#E53935]/10 shadow-[0_0_25px_rgba(229,57,53,0.2)]'
                        : 'border-[#94A3B8]/20 bg-[#101522]/60 hover:border-[#E53935]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#E53935]/20 text-[#FF4D5A] font-mono text-[10px] font-bold">
                          BRANCH A
                        </span>
                        <h4 className="text-sm font-bold text-[#F8FAFC] font-['Space_Grotesk'] flex items-center gap-2">
                          <Icon10 size={16} className="text-[#E53935]" />
                          {stage10.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/30">
                        {stage10.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
                      {stage10.purpose}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {stage10.technologies.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] font-mono text-[#94A3B8]/70 bg-[#07080C] px-2 py-0.5 rounded border border-[#94A3B8]/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Branch B: Stage 11 Remediation Optimization */}
              {(() => {
                const stage11 = WORKFLOW_STAGES[10];
                const Icon11 = stageIcons[11];
                const isCurrent = activeStageIndex === 10;
                return (
                  <div
                    onClick={() => {
                      setActiveStageIndex(10);
                      setSelectedStage(stage11);
                    }}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-[#22C55E] bg-[#22C55E]/10 shadow-[0_0_25px_rgba(34,197,94,0.2)]'
                        : 'border-[#94A3B8]/20 bg-[#101522]/60 hover:border-[#22C55E]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] font-mono text-[10px] font-bold">
                          BRANCH B
                        </span>
                        <h4 className="text-sm font-bold text-[#F8FAFC] font-['Space_Grotesk'] flex items-center gap-2">
                          <Icon11 size={16} className="text-[#22C55E]" />
                          {stage11.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full border border-[#F59E0B]/30">
                        {stage11.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">
                      {stage11.purpose}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {stage11.technologies.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] font-mono text-[#94A3B8]/70 bg-[#07080C] px-2 py-0.5 rounded border border-[#94A3B8]/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Reconvergence Arrow */}
            <div className="mt-6 pt-4 border-t border-[#94A3B8]/10 flex flex-col items-center">
              <span className="text-[10px] font-mono text-[#94A3B8]/60 mb-2">Branches synchronize and feed live telemetry back into:</span>
              <div
                onClick={() => {
                  setActiveStageIndex(11);
                  setSelectedStage(WORKFLOW_STAGES[11]);
                }}
                className={`w-full max-w-md p-3 rounded-xl border text-center cursor-pointer transition-all ${
                  activeStageIndex === 11
                    ? 'border-[#3B82F6] bg-[#3B82F6]/15 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'border-[#94A3B8]/20 bg-[#101522] hover:border-[#3B82F6]/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <LayoutDashboard size={16} className="text-[#3B82F6]" />
                  <span className="text-xs font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                    STAGE 12: {WORKFLOW_STAGES[11].title}
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] mt-1">
                  Unified incident command center, human-in-the-loop review, and continuous posture score.
                </p>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* Selected Stage Detail Panel */}
        <AnimatePresence>
          {selectedStage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#07080C]/80 backdrop-blur-sm"
                onClick={() => setSelectedStage(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#101522] border border-[#94A3B8]/20 rounded-2xl shadow-2xl p-6 sm:p-8"
              >
                <div className="flex items-start justify-between border-b border-[#94A3B8]/15 pb-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-[#FF4D5A] font-bold">
                        STAGE {String(selectedStage.number).padStart(2, '0')}
                      </span>
                      {(() => {
                        const statusCfg = statusBadgeColors[selectedStage.status];
                        return (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                            {statusCfg.label}
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-xl font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                      {selectedStage.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedStage(null)}
                    className="p-2 rounded-lg border border-[#94A3B8]/20 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#94A3B8]/60 tracking-wider mb-1.5">Purpose</h4>
                    <p className="text-sm text-[#F8FAFC] leading-relaxed">
                      {selectedStage.purpose}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#94A3B8]/60 tracking-wider mb-2">Processing Logic</h4>
                    <div className="p-3.5 rounded-xl bg-[#07080C] border border-[#94A3B8]/10 text-xs text-[#94A3B8] leading-relaxed font-mono">
                      {selectedStage.processing}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#101522] border border-[#94A3B8]/10">
                      <h4 className="text-xs font-mono uppercase text-[#3B82F6] tracking-wider mb-2 flex items-center gap-1.5">
                        <ChevronRight size={12} />
                        Inputs
                      </h4>
                      <ul className="space-y-1">
                        {selectedStage.inputs.map((inp, i) => (
                          <li key={i} className="text-xs text-[#F8FAFC]/90 flex items-start gap-1.5">
                            <span className="text-[#3B82F6]">•</span>
                            {inp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#101522] border border-[#94A3B8]/10">
                      <h4 className="text-xs font-mono uppercase text-[#22C55E] tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 size={12} />
                        Outputs
                      </h4>
                      <ul className="space-y-1">
                        {selectedStage.outputs.map((out, i) => (
                          <li key={i} className="text-xs text-[#F8FAFC]/90 flex items-start gap-1.5">
                            <span className="text-[#22C55E]">•</span>
                            {out}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#94A3B8]/60 tracking-wider mb-2 flex items-center gap-1.5">
                      <Code2 size={12} />
                      Core Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStage.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-[#07080C] border border-[#94A3B8]/20 font-mono text-xs text-[#F8FAFC]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ChapterLayout>
  );
}

