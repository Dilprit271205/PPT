import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterProps, TechItem } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import { TECH_STACK } from '../data/scenarioData';
import {
  Layers,
  Code2,
  Server,
  Database,
  BrainCircuit,
  Cpu,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface TechItemDetail {
  name: string;
  category: 'prototype' | 'proposed';
  layer: string;
  component: string;
  description: string;
  purpose: string;
  whyNeeded: string;
  status: 'implemented' | 'proposed';
}

const detailedTechItems: TechItemDetail[] = [
  // Live Prototype Stack
  {
    name: 'React 19 & TypeScript',
    category: 'prototype',
    layer: 'Presentation & State Layer',
    component: 'Single Source of Truth Store',
    description: 'Component-driven reactive UI architecture with strict compile-time type verification.',
    purpose: 'Renders the scroll-driven presentation, manages interactive scenario state, and coordinates SVG/Canvas renders.',
    whyNeeded: 'Ensures zero runtime type mismatches and high performance rendering during rapid scroll triggers.',
    status: 'implemented',
  },
  {
    name: 'ReactFlow',
    category: 'prototype',
    layer: 'Graph Visualization Layer',
    component: 'Network Topology Renderer',
    description: 'Hardware-accelerated node-and-edge visual canvas with custom render nodes.',
    purpose: 'Renders enterprise digital twin nodes, dynamic attack lineage edges, and real-time blocked path animations.',
    whyNeeded: 'Provides smooth drag, zoom, pan, and custom edge styling without rebuilding low-level WebGL scene graphs.',
    status: 'implemented',
  },
  {
    name: 'Three.js & React Three Fiber',
    category: 'prototype',
    layer: '3D Simulation Layer',
    component: 'Cinematic Particle Environment',
    description: 'Declarative WebGL scene graph rendering thousands of dynamic network nodes.',
    purpose: 'Powers the opening 3D dark-red particle network with subtle mouse parallax and connection lines.',
    whyNeeded: 'Establishes a cinematic, immersive aesthetic that sets the stage for an extraordinary cybersecurity journey.',
    status: 'implemented',
  },
  {
    name: 'GSAP & ScrollTrigger',
    category: 'prototype',
    layer: 'Animation Choreography',
    component: 'Timeline Controller',
    description: 'Industry-standard high-performance animation engine with scroll-position synchronization.',
    purpose: 'Coordinates multi-stage card appearances, pinned reveals, and smooth camera focus shifts across chapters.',
    whyNeeded: 'Ensures silky 60 FPS transitions without stutter or layout thrashing.',
    status: 'implemented',
  },
  {
    name: 'Tailwind CSS v4 & Framer Motion',
    category: 'prototype',
    layer: 'Styling & Micro-Interactions',
    component: 'Design System & Transitions',
    description: 'Utility styling engine and spring-physics micro-interaction system.',
    purpose: 'Handles dark-red cybersecurity styling, modal transitions, and responsive layout constraints.',
    whyNeeded: 'Enables rapid, beautiful visual design that conforms to strict contrast and typography requirements.',
    status: 'implemented',
  },
  {
    name: 'Combinatorial Min-Cut Solver',
    category: 'prototype',
    layer: 'Decision & Optimization',
    component: 'In-Browser 2ⁿ Optimizer',
    description: 'Deterministic subset evaluator running exhaustive 16-combination vertex cut analysis in browser memory.',
    purpose: 'Computes the minimum-cost set of actions that severs all attack paths under a budget.',
    whyNeeded: 'Guarantees immediate zero-latency feedback without relying on an external backend solver during presentations.',
    status: 'implemented',
  },

  // Proposed Full-Scale Enterprise Backend
  {
    name: 'PyTorch Geometric (PyG)',
    category: 'proposed',
    layer: 'Intelligence Layer',
    component: 'GNN Risk Inference Engine',
    description: 'Deep learning library for graph neural networks on relational graphs.',
    purpose: 'Analyzes topology and node features to learn suspiciousness scores and latent credential pivoting vectors.',
    whyNeeded: 'Traditional anomaly detection misses multi-hop relationships; GNNs propagate embeddings across graph edges.',
    status: 'proposed',
  },
  {
    name: 'PyMC / Stan (Bayesian MCMC)',
    category: 'proposed',
    layer: 'Intelligence Layer',
    component: 'Hypothesis Confidence Updater',
    description: 'Probabilistic programming language for Bayesian statistical modeling and Markov Chain Monte Carlo.',
    purpose: 'Updates probability distributions over competing attack hypotheses as new evidence arrives.',
    whyNeeded: 'Cyberattacks have massive uncertainty; Bayesian inference produces calibrated confidence bounds rather than binary guesses.',
    status: 'proposed',
  },
  {
    name: 'Neo4j & Graph Data Science',
    category: 'proposed',
    layer: 'Graph Persistence Layer',
    component: 'Enterprise Knowledge Graph',
    description: 'Native graph database supporting Cypher queries and distributed pathfinding algorithms.',
    purpose: 'Stores millions of enterprise identities, cloud roles, containers, and secrets with sub-millisecond traversal.',
    whyNeeded: 'Relational databases degrade exponentially on 5-hop permission traversals; graph engines traverse in linear time.',
    status: 'proposed',
  },
  {
    name: 'Google OR-Tools / Rust Solver',
    category: 'proposed',
    layer: 'Decision Engine',
    component: 'Large-Scale Integer Programming',
    description: 'Combinatorial optimization suite for large integer programming and min-cut problems.',
    purpose: 'Solves minimum-cost cut problems across thousands of remediation actions in enterprise networks.',
    whyNeeded: 'When action sets exceed 30 items (2³⁰ combinations), exact exhaustive search becomes intractable; ILP solvers find the global optimum in seconds.',
    status: 'proposed',
  },
  {
    name: 'Apache Kafka & Flink',
    category: 'proposed',
    layer: 'Data Ingestion Layer',
    component: 'Distributed Stream Pipeline',
    description: 'Distributed event log and stateful stream processing framework.',
    purpose: 'Ingests hundreds of thousands of EPS from CloudTrail, Okta, Sentinel, and CrowdStrike with zero message loss.',
    whyNeeded: 'Provides decoupled real-time log normalization and sliding-window event correlation at scale.',
    status: 'proposed',
  },
  {
    name: 'FastAPI & Temporal Workflows',
    category: 'proposed',
    layer: 'Orchestration & API',
    component: 'Microservices & Durable Playbooks',
    description: 'Asynchronous Python API server coupled with Temporal durable stateful workflow engine.',
    purpose: 'Manages incident lifecycle, durable responder escalation timers, and authenticated webhook dispatches.',
    whyNeeded: 'Guarantees that an escalation deadline timer survives server restarts and network partitions.',
    status: 'proposed',
  },
];

export default function Chapter10TechStack({ id }: ChapterProps) {
  const [selectedTech, setSelectedTech] = useState<TechItemDetail | null>(null);
  const [filter, setFilter] = useState<'all' | 'prototype' | 'proposed'>('all');

  const filteredItems = detailedTechItems.filter(
    (item) => filter === 'all' || item.category === filter
  );

  return (
    <ChapterLayout
      id={id}
      chapterNumber={10}
      headline="ENGINEERED FOR CONNECTED SECURITY INTELLIGENCE."
      subtitle="Architectural integrity requires rigorous distinction between implemented prototype capabilities and proposed enterprise infrastructure."
    >
      <div className="space-y-8">
        {/* Layer Filter / Tab Bar */}
        <SectionBlock>
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#101522]/80 border border-[#94A3B8]/15 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94A3B8] mr-2">Filter Stack:</span>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#F8FAFC] text-[#07080C] font-bold'
                    : 'bg-[#07080C] text-[#94A3B8] border border-[#94A3B8]/20 hover:text-[#F8FAFC]'
                }`}
              >
                All Technologies ({detailedTechItems.length})
              </button>
              <button
                onClick={() => setFilter('prototype')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filter === 'prototype'
                    ? 'bg-[#22C55E] text-white font-bold'
                    : 'bg-[#07080C] text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/10'
                }`}
              >
                <CheckCircle2 size={12} />
                Live Prototype ({detailedTechItems.filter((t) => t.category === 'prototype').length})
              </button>
              <button
                onClick={() => setFilter('proposed')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filter === 'proposed'
                    ? 'bg-[#F59E0B] text-[#07080C] font-bold'
                    : 'bg-[#07080C] text-[#F59E0B] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/10'
                }`}
              >
                <Clock size={12} />
                Proposed Enterprise ({detailedTechItems.filter((t) => t.category === 'proposed').length})
              </button>
            </div>

            <span className="text-[11px] font-mono text-[#94A3B8]/60">
              Click any card to inspect architectural rationale
            </span>
          </div>
        </SectionBlock>

        {/* Tech Grid */}
        <SectionBlock>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((tech, idx) => {
              const isProto = tech.category === 'prototype';
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isProto
                      ? 'border-[#22C55E]/20 bg-[#101522]/80 hover:border-[#22C55E]/50 shadow-[0_0_15px_rgba(34,197,94,0.05)]'
                      : 'border-[#F59E0B]/20 bg-[#101522]/60 hover:border-[#F59E0B]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] text-[#94A3B8]/70 uppercase tracking-wider">
                        {tech.layer}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                          isProto
                            ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
                            : 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]'
                        }`}
                      >
                        {isProto ? 'ACTIVE PROTOTYPE' : 'PROPOSED ENTERPRISE'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk'] mb-1">
                      {tech.name}
                    </h4>
                    <p className="text-xs text-[#94A3B8]/70 font-mono mb-2">
                      {tech.component}
                    </p>
                    <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                      {tech.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#94A3B8]/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                    <span>Inspect details</span>
                    <ChevronRight size={14} className="text-[#94A3B8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionBlock>

        {/* Engineering Integrity Statement */}
        <SectionBlock>
          <div className="p-5 rounded-2xl bg-[#101522]/30 border border-[#94A3B8]/15 flex items-start gap-3">
            <Info size={16} className="text-[#22C55E] shrink-0 mt-0.5" />
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              <span className="text-[#22C55E] font-semibold">Strict Technical Honesty: </span>
              In accordance with project standards, technologies are strictly audited. Components labeled{' '}
              <strong className="text-[#22C55E]">Active Prototype</strong> are compiled and running inside this browser application. Heavy distributed backends (PyTorch Geometric, Neo4j, PyMC, Kafka) are documented exclusively under{' '}
              <strong className="text-[#F59E0B]">Proposed Enterprise Architecture</strong> to prevent misleading technical claims.
            </p>
          </div>
        </SectionBlock>
      </div>

      {/* Tech Item Modal Drawer */}
      <AnimatePresence>
        {selectedTech && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#07080C]/80 backdrop-blur-sm"
              onClick={() => setSelectedTech(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-[#101522] border border-[#94A3B8]/20 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-start justify-between border-b border-[#94A3B8]/15 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono uppercase text-[#94A3B8]/70">
                      {selectedTech.layer}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                        selectedTech.category === 'prototype'
                          ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]'
                          : 'bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]'
                      }`}
                    >
                      {selectedTech.category === 'prototype' ? 'ACTIVE PROTOTYPE' : 'PROPOSED ENTERPRISE'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                    {selectedTech.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTech(null)}
                  className="p-2 rounded-lg border border-[#94A3B8]/20 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h5 className="font-mono text-[10px] text-[#94A3B8]/60 uppercase tracking-wider mb-1">
                    Architectural Component
                  </h5>
                  <p className="font-mono text-[#F8FAFC]">{selectedTech.component}</p>
                </div>

                <div>
                  <h5 className="font-mono text-[10px] text-[#94A3B8]/60 uppercase tracking-wider mb-1">
                    What It Does
                  </h5>
                  <p className="text-[#94A3B8] leading-relaxed">{selectedTech.description}</p>
                </div>

                <div>
                  <h5 className="font-mono text-[10px] text-[#94A3B8]/60 uppercase tracking-wider mb-1">
                    Operational Purpose
                  </h5>
                  <p className="text-[#94A3B8] leading-relaxed">{selectedTech.purpose}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#07080C] border border-[#94A3B8]/10">
                  <h5 className="font-mono text-[10px] text-[#3B82F6] uppercase tracking-wider mb-1">
                    Why It Is Needed
                  </h5>
                  <p className="text-[#F8FAFC] leading-relaxed">{selectedTech.whyNeeded}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ChapterLayout>
  );
}
