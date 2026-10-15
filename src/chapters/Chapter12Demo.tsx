import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterProps, SecurityEvent, RemediationAction } from '../types';
import { ChapterLayout, SectionBlock, SeverityBadge, GlowCard } from '../components/shared';
import {
  SECURITY_EVENTS,
  ATTACK_GRAPH_NODES,
  ATTACK_GRAPH_EDGES,
  ATTACK_PATH,
  REMEDIATION_ACTIONS,
} from '../data/scenarioData';
import { AttackGraph } from '../components/AttackGraph';
import {
  evaluateRemediation,
  generateOptimizationResults,
} from '../utils/graphUtils';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Key,
  Layers,
  Database
} from 'lucide-react';

const demoSteps = [
  {
    step: 1,
    title: 'Seven-Event Scenario Replay',
    subtitle: 'Streaming raw telemetry across GitHub, AWS CloudTrail, Vault, DNS, and IAM.',
  },
  {
    step: 2,
    title: 'Attack Path Synthesis',
    subtitle: 'Correlating fragmented events through identities, credentials, and graph traversal.',
  },
  {
    step: 3,
    title: 'Evidence & Critical Asset Risk',
    subtitle: 'Identifying high-confidence traversal reaching crown-jewel Customer Database.',
  },
  {
    step: 4,
    title: 'Intervention Space Formulation',
    subtitle: 'Evaluating 4 candidate defensive controls across authentication, IAM, and network.',
  },
  {
    step: 5,
    title: 'Exhaustive Min-Cost Cut Solver',
    subtitle: 'Evaluating all 2⁴ = 16 combinations to select the cheapest path-severing subset.',
  },
  {
    step: 6,
    title: 'Defensive Path Interruption',
    subtitle: 'Severing the adversary route and verifying protective shield around crown jewels.',
  },
];

export default function Chapter12Demo({ id }: ChapterProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [eventsRevealed, setEventsRevealed] = useState<number>(7);
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [isFinalCinematic, setIsFinalCinematic] = useState<boolean>(false);

  // Auto-play timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 6) {
            setIsPlaying(false);
            setIsFinalCinematic(true);
            return 6;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Adjust state per step
  useEffect(() => {
    if (currentStep === 1) {
      setEventsRevealed(3);
      setSelectedActionIds([]);
      setIsFinalCinematic(false);
    } else if (currentStep === 2) {
      setEventsRevealed(7);
      setSelectedActionIds([]);
      setIsFinalCinematic(false);
    } else if (currentStep === 3) {
      setEventsRevealed(7);
      setSelectedActionIds([]);
      setIsFinalCinematic(false);
    } else if (currentStep === 4) {
      setEventsRevealed(7);
      setSelectedActionIds(['rem-001']);
      setIsFinalCinematic(false);
    } else if (currentStep === 5) {
      setEventsRevealed(7);
      // Optimal 2^n result: rem-001 + rem-002
      setSelectedActionIds(['rem-001', 'rem-002']);
      setIsFinalCinematic(false);
    } else if (currentStep === 6) {
      setEventsRevealed(7);
      setSelectedActionIds(['rem-001', 'rem-002']);
      setIsFinalCinematic(true);
    }
  }, [currentStep]);

  // Calculate blocked edges and effect
  const selectedActions = REMEDIATION_ACTIONS.filter((a) =>
    selectedActionIds.includes(a.id)
  );
  const evaluation = evaluateRemediation(
    selectedActions,
    ATTACK_GRAPH_EDGES,
    [ATTACK_PATH]
  );
  const blockedEdgeIds = Array.from(evaluation.blockedEdgeIds);
  const isCutSuccessful = currentStep >= 5;

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
    setEventsRevealed(3);
    setSelectedActionIds([]);
    setIsFinalCinematic(false);
  };

  const pathNodeIds = ATTACK_PATH.steps.map((s) => s.nodeId);

  return (
    <ChapterLayout
      id={id}
      chapterNumber={12}
      headline="ONE ATTACK CHAIN. ONE DEFENSIBLE DECISION."
      subtitle="Experience the complete, reproducible end-to-end workflow: from 7-event multi-source replay to automated graph synthesis and optimal path interruption."
    >
      <div className="space-y-8">
        {/* Step Controller Bar */}
        <SectionBlock>
          <div className="p-5 rounded-2xl bg-[#101522]/90 border border-[#94A3B8]/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF4D5A] text-white font-mono text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-[#E53935]/25"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                {isPlaying ? 'PAUSE DEMO' : 'START GUIDED DEMO'}
              </button>

              <div className="flex items-center gap-1 border border-[#94A3B8]/20 rounded-xl p-1 bg-[#07080C]">
                <button
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                  disabled={currentStep === 1}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30"
                  title="Previous Step"
                >
                  <SkipBack size={14} />
                </button>
                <span className="font-mono text-xs px-2 text-[#F8FAFC] font-bold">
                  {currentStep} / {demoSteps.length}
                </span>
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 6))}
                  disabled={currentStep === 6}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30"
                  title="Next Step"
                >
                  <SkipForward size={14} />
                </button>
              </div>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl border border-[#94A3B8]/20 text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
                title="Reset Guided Demo"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="space-y-0.5 text-right">
              <div className="text-xs font-mono font-bold text-[#FF4D5A]">
                STEP {currentStep}: {demoSteps[currentStep - 1].title}
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8]/70">
                {demoSteps[currentStep - 1].subtitle}
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* Guided Demo Main Split Canvas: Left Telemetry & Actions | Right Live Digital Twin */}
        <SectionBlock>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Feed */}
            <div className="lg:col-span-5 space-y-4">
              {/* Event Feed */}
              <div className="p-5 rounded-2xl bg-[#101522]/80 border border-[#94A3B8]/15 space-y-3">
                <div className="flex items-center justify-between border-b border-[#94A3B8]/10 pb-2">
                  <span className="font-mono text-xs uppercase text-[#94A3B8] font-bold flex items-center gap-1.5">
                    <Clock size={12} className="text-[#FF4D5A]" />
                    Scenario Events Stream ({Math.min(eventsRevealed, currentStep === 1 ? 3 : 7)}/7)
                  </span>
                  <span className="text-[10px] font-mono text-[#22C55E]">Live Ingestion</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {SECURITY_EVENTS.slice(0, currentStep === 1 ? 3 : 7).map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-2.5 rounded-xl bg-[#07080C] border border-[#94A3B8]/10 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#F8FAFC] font-['Space_Grotesk'] truncate">
                          {ev.title}
                        </span>
                        <SeverityBadge severity={ev.severity} />
                      </div>
                      <div className="text-[10px] font-mono text-[#94A3B8]/60 flex justify-between">
                        <span>{ev.source}</span>
                        <span>{ev.time.slice(11, 19)} IST</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Solved Intervention Summary */}
              <div className="p-5 rounded-2xl bg-[#101522]/80 border border-[#94A3B8]/15 space-y-3">
                <div className="flex items-center justify-between border-b border-[#94A3B8]/10 pb-2">
                  <span className="font-mono text-xs uppercase text-[#94A3B8] font-bold flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#22C55E]" />
                    Optimized Interventions Applied
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    {selectedActionIds.length > 0 ? `${selectedActionIds.length} actions selected` : 'None'}
                  </span>
                </div>

                {selectedActionIds.length > 0 ? (
                  <div className="space-y-2">
                    {selectedActions.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs"
                      >
                        <div className="flex justify-between items-center text-[#F8FAFC] font-bold mb-1 font-['Space_Grotesk']">
                          <span>{act.title}</span>
                          <span className="font-mono text-[#22C55E]">${act.cost.toLocaleString()}</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8]">{act.expectedEffect}</p>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between items-center font-mono text-xs">
                      <span className="text-[#94A3B8]">Total Mitigation Cost:</span>
                      <span className="text-[#22C55E] font-bold">
                        ${selectedActions.reduce((s, a) => s + a.cost, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#07080C]/50 border border-[#94A3B8]/10 text-center text-xs text-[#94A3B8]/60 font-mono">
                    Advance to Step 4 & 5 to formulate and solve optimal graph cuts.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Live Network Topology Canvas */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-2xl border border-[#94A3B8]/20 bg-[#07080C] overflow-hidden relative shadow-2xl" style={{ height: 500 }}>
                {/* State Tag Overlay */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-[#101522]/90 border border-[#94A3B8]/20 backdrop-blur-md flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCutSuccessful ? 'bg-[#22C55E]' : 'bg-[#FF4D5A] animate-ping'
                    }`}
                  />
                  <span className="font-mono text-xs text-[#F8FAFC] font-semibold">
                    {isCutSuccessful
                      ? 'ATTACK PATH SEVERED (Asset Secured)'
                      : currentStep === 1
                      ? 'INGESTING SIGNALS...'
                      : 'ACTIVE EXPLOIT CHAIN DETECTED'}
                  </span>
                </div>

                <AttackGraph
                  nodes={ATTACK_GRAPH_NODES}
                  edges={ATTACK_GRAPH_EDGES}
                  highlightPath={currentStep >= 2 ? pathNodeIds : []}
                  blockedEdges={isCutSuccessful ? blockedEdgeIds : []}
                  protectedNodes={isCutSuccessful ? ['customer-pii', 'db-prod'] : []}
                  showControls={true}
                  showMiniMap={false}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]/70 px-2">
                <span>Deterministic Scenario Replay</span>
                <span>Seed: AT-001-PRD-2026</span>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* FINAL CINEMATIC MOMENT */}
        <AnimatePresence>
          {isFinalCinematic && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-12 p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#101522] via-[#07080C] to-[#07080C] border border-[#22C55E]/40 text-center relative overflow-hidden shadow-2xl shadow-[#22C55E]/10"
            >
              {/* Radial defensive green glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#22C55E]/5 rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E]">
                  <ShieldCheck size={32} />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Space_Grotesk'] text-[#F8FAFC] tracking-tight">
                    DON'T JUST DETECT THE ALERT.
                    <br />
                    UNDERSTAND THE CHAIN.
                    <br />
                    <span className="text-[#22C55E]">BREAK THE PATH.</span>
                  </h3>
                </div>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent mx-auto" />

                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-[#F8FAFC] tracking-tight">
                    ATTACKTWIN <span className="text-[#E53935]">AI</span>
                  </div>
                  <p className="text-base sm:text-lg font-mono text-[#94A3B8]">
                    Predict. Explain. Break the Path.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#101522] border border-[#94A3B8]/30 text-xs font-mono text-[#F8FAFC] hover:border-[#22C55E]/60 transition-all"
                  >
                    <RotateCcw size={14} />
                    REPLAY COMPLETE INVESTIGATION
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ChapterLayout>
  );
}
