import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChapterProps } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import { ATTACK_GRAPH_NODES, ATTACK_GRAPH_EDGES, ATTACK_PATH, SECURITY_EVENTS } from '../data/scenarioData';
import { AttackGraph } from '../components/AttackGraph';
import { Link2, ArrowRight, Fingerprint, Key, Clock, Network, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const connectionReasons = [
  { from: 'Developer Identity', to: 'Source Repository', reason: 'Same developer identity used for authentication', type: 'identity', icon: Fingerprint },
  { from: 'Source Repository', to: 'Exposed Credential', reason: 'Credential found committed in repository history', type: 'credential', icon: Key },
  { from: 'Exposed Credential', to: 'Cloud Access', reason: 'AWS access key provides cloud service access', type: 'credential', icon: Key },
  { from: 'Cloud Access', to: 'Customer Database', reason: 'Cloud role has database read permissions', type: 'permission', icon: Network },
];

export default function Chapter03Connect({ id, isActive }: ChapterProps) {
  const [phase, setPhase] = useState<'scattered' | 'connecting' | 'connected'>('scattered');
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let t1: ReturnType<typeof setTimeout> | undefined;
    let t2: ReturnType<typeof setTimeout> | undefined;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 60%',
        onEnter: () => {
          t1 = setTimeout(() => setPhase('connecting'), 500);
          t2 = setTimeout(() => setPhase('connected'), 2000);
        },
        onLeaveBack: () => setPhase('scattered'),
      });
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ctx.revert();
    };
  }, []);

  // Get attack path nodes only
  const pathNodeIds = ATTACK_PATH.steps.map((s) => s.nodeId);
  const pathNodes = ATTACK_GRAPH_NODES.filter((n) => pathNodeIds.includes(n.id));
  const pathEdges = ATTACK_GRAPH_EDGES.filter(
    (e) => pathNodeIds.includes(e.source) && pathNodeIds.includes(e.target) && e.isAttackPath
  );

  return (
    <ChapterLayout
      id={id}
      chapterNumber={3}
      headline="THE ATTACK WAS HIDDEN IN THE CONNECTIONS."
      subtitle="When related identities, credentials, and assets are connected, the individual alerts reveal a possible attack sequence."
    >
      <div ref={containerRef}>
        {/* Attack chain visualization */}
        <SectionBlock className="mt-12">
          <div className="relative">
            {/* Phase: Scattered alerts */}
            <AnimatePresence mode="wait">
              {phase === 'scattered' && (
                <motion.div
                  key="scattered"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-5 gap-6 py-12"
                >
                  {SECURITY_EVENTS.slice(0, 5).map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="p-4 rounded-xl bg-[#101522]/60 border border-[#94A3B8]/10"
                    >
                      <div className="text-[10px] font-mono text-[#94A3B8]/60 mb-1">{event.time}</div>
                      <div className="text-xs font-semibold text-[#F8FAFC] font-['Space_Grotesk']">{event.title}</div>
                      <div className="text-[10px] text-[#94A3B8] mt-1">{event.source}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {phase === 'connecting' && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-16"
                >
                  <div className="flex items-center gap-2 text-[#E53935]">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Link2 size={24} />
                    </motion.div>
                    <span className="text-sm font-mono">Connecting evidence...</span>
                  </div>
                </motion.div>
              )}

              {phase === 'connected' && (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Attack chain as horizontal flow */}
                  <div className="py-8">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-0">
                      {ATTACK_PATH.steps.map((step, i) => {
                        const node = ATTACK_GRAPH_NODES.find((n) => n.id === step.nodeId);
                        return (
                          <div key={step.nodeId} className="flex items-center">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.3 }}
                              className="relative p-4 rounded-xl bg-[#3B0D16]/30 border border-[#E53935]/30 min-w-[140px]"
                            >
                              {/* Pulse on the active node */}
                              <motion.div
                                className="absolute inset-0 rounded-xl border border-[#E53935]/20"
                                animate={{
                                  boxShadow: ['0 0 0px #E5393500', '0 0 15px #E5393530', '0 0 0px #E5393500'],
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                              />
                              <div className="text-xs font-mono text-[#E53935]/60 mb-1">
                                {step.timestamp || ''}
                              </div>
                              <div className="text-sm font-semibold text-[#F8FAFC] font-['Space_Grotesk']">
                                {node?.label || step.nodeId}
                              </div>
                              <div className="text-[10px] text-[#94A3B8] mt-1">{step.action}</div>
                              {step.mitreTactic && (
                                <div className="mt-2 text-[9px] font-mono text-[#E53935]/50 uppercase">
                                  {step.mitreTactic}
                                </div>
                              )}
                            </motion.div>

                            {/* Arrow between nodes */}
                            {i < ATTACK_PATH.steps.length - 1 && (
                              <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ delay: i * 0.3 + 0.2 }}
                                className="hidden lg:flex items-center mx-1"
                              >
                                <div className="w-8 h-px bg-gradient-to-r from-[#E53935] to-[#E53935]/50 relative">
                                  {/* Animated particle */}
                                  <motion.div
                                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF4D5A]"
                                    animate={{ left: ['0%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                                  />
                                </div>
                                <ArrowRight size={12} className="text-[#E53935] -ml-1" />
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive graph view */}
                  <div className="mt-8 rounded-2xl border border-[#94A3B8]/10 bg-[#101522]/30 overflow-hidden" style={{ height: 400 }}>
                    <AttackGraph
                      nodes={pathNodes}
                      edges={pathEdges}
                      highlightPath={pathNodeIds}
                      showControls={true}
                      showMiniMap={false}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionBlock>

        {/* Connection reasons */}
        {phase === 'connected' && (
          <SectionBlock className="mt-12" delay={0.3}>
            <h3 className="text-lg font-semibold text-[#F8FAFC] font-['Space_Grotesk'] mb-6">
              Why These Events Are Connected
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectionReasons.map((conn, i) => {
                const ConnIcon = conn.icon;
                return (
                  <GlowCard
                    key={i}
                    onClick={() => setSelectedConnection(selectedConnection === i ? null : i)}
                    active={selectedConnection === i}
                    className="p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E53935]/10 border border-[#E53935]/20 flex items-center justify-center shrink-0">
                        <ConnIcon size={14} className="text-[#E53935]" />
                      </div>
                      <div>
                        <div className="text-xs text-[#94A3B8] mb-1">
                          <span className="text-[#F8FAFC]">{conn.from}</span>
                          <ArrowRight size={10} className="inline mx-1 text-[#E53935]" />
                          <span className="text-[#F8FAFC]">{conn.to}</span>
                        </div>
                        <p className="text-xs text-[#94A3B8]/80">{conn.reason}</p>
                        <span className="inline-block mt-2 text-[9px] font-mono text-[#E53935]/60 uppercase bg-[#E53935]/5 px-2 py-0.5 rounded">
                          {conn.type} relationship
                        </span>
                      </div>
                    </div>
                  </GlowCard>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl border border-[#F59E0B]/10 bg-[#F59E0B]/5">
              <p className="text-xs text-[#94A3B8]">
                <span className="text-[#F59E0B] font-mono font-semibold">Note: </span>
                Some relationships are directly observed (e.g., same identity). Others are inferred from configuration or permissions. 
                Correlation does not confirm malicious activity — further analysis and context are required.
              </p>
            </div>
          </SectionBlock>
        )}

        {/* Key message */}
        <SectionBlock className="mt-16 text-center" delay={0.5}>
          <p className="text-xl md:text-2xl text-[#94A3B8] font-['Space_Grotesk'] font-light max-w-2xl mx-auto">
            "Security events become more meaningful when their{' '}
            <span className="text-[#F8FAFC] font-medium">relationships</span> are understood."
          </p>
        </SectionBlock>
      </div>
    </ChapterLayout>
  );
}

