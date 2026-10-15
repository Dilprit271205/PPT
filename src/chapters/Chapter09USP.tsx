import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterProps } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import { ATTACK_GRAPH_NODES, ATTACK_GRAPH_EDGES, USP_PILLARS } from '../data/scenarioData';
import { AttackGraph } from '../components/AttackGraph';
import {
  Link2,
  Share2,
  TrendingUp,
  UserCheck,
  Scissors,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

const pillarsData = [
  {
    id: 'p1',
    number: '01',
    title: 'Cross-Source Event Correlation',
    icon: Link2,
    color: '#3B82F6',
    summary: 'Correlates fragmented alerts across IdP, CloudTrail, Vault, GitHub, and DNS into unified attack narratives without rigid rule explosion.',
    highlightNodes: ['priya-sharma', 'pat-github', 'personal-laptop', 'svc-backup'],
    contrast: 'Traditional SIEMs generate isolated tickets for each log source, forcing human analysts to mentally bridge the gaps.',
  },
  {
    id: 'p2',
    number: '02',
    title: 'Graph-Native Digital Twin',
    icon: Share2,
    color: '#A855F7',
    summary: 'Models identities, credentials, permissions, and workloads as a living topology that reveals lateral traversal paths and true blast radius.',
    highlightNodes: ['priya-sharma', 'github-org', 'vault-prod', 'rds-prod', 'customer-pii'],
    contrast: 'Flat log storage completely misses hidden transitive permissions and IAM credential pivoting.',
  },
  {
    id: 'p3',
    number: '03',
    title: 'Uncertainty-Aware Progression',
    icon: TrendingUp,
    color: '#E53935',
    summary: 'Combines Bayesian belief updating with Markov progression models to estimate probable next-step adversary transitions and attacker intent.',
    highlightNodes: ['aws-session', 'vault-prod', 'db-master-cred', 'rds-prod'],
    contrast: 'Deterministic rules assume static attacks; probabilistic modeling accounts for missing evidence and adversarial adaptation.',
  },
  {
    id: 'p4',
    number: '04',
    title: 'Intelligent Incident Escalation',
    icon: UserCheck,
    color: '#F59E0B',
    summary: 'Enforces SLA-driven automated ownership routing with fail-safe escalation ladders, preventing critical alerts from idling in unassigned queues.',
    highlightNodes: ['customer-pii', 'rds-prod'],
    contrast: 'Standard alerts get lost in noisy Slack channels without deterministic acknowledgement timers or verified closure checks.',
  },
  {
    id: 'p5',
    number: '05',
    title: 'Cost-Constrained Remediation',
    icon: Scissors,
    color: '#22C55E',
    summary: 'Formulates defense as a mathematical graph cut, computing the minimum-cost intervention set that severs all attack paths under a budget.',
    highlightNodes: ['iam-devops-role', 'pat-github', 'vault-prod', 'dns-resolver'],
    contrast: 'Vulnerability scanners dump 10,000 CVEs with zero guidance on which 2 fixes will actually break the adversary route.',
  },
];

export default function Chapter09USP({ id }: ChapterProps) {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);

  const activePillar = pillarsData[activePillarIndex];

  return (
    <ChapterLayout
      id={id}
      chapterNumber={9}
      headline="FROM DETECTION TO DEFENSIBLE ACTION."
      subtitle="AttackTwin AI does not claim to reinvent graphs or SIEMs. Its fundamental differentiation is a unified, explainable workflow that connects scattered evidence to mathematically defensible remediation."
    >
      <div className="space-y-8">
        {/* Main interactive surrounding canvas */}
        <SectionBlock>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Pillar Cards (2 pillars) */}
            <div className="lg:col-span-3 space-y-4">
              {pillarsData.slice(0, 3).map((pillar, idx) => {
                const Icon = pillar.icon;
                const isActive = activePillarIndex === idx;
                return (
                  <div
                    key={pillar.id}
                    onClick={() => setActivePillarIndex(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#E53935] bg-[#E53935]/10 shadow-[0_0_20px_rgba(229,57,53,0.15)]'
                        : 'border-[#94A3B8]/15 bg-[#101522]/60 hover:border-[#94A3B8]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold" style={{ color: pillar.color }}>
                        PILLAR {pillar.number}
                      </span>
                      <Icon size={16} style={{ color: pillar.color }} />
                    </div>
                    <h4 className="text-sm font-bold text-[#F8FAFC] font-['Space_Grotesk'] mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8]/80 leading-relaxed line-clamp-3">
                      {pillar.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Central Graph Visualization (with dynamic node highlighting based on active pillar) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl border border-[#94A3B8]/20 bg-[#07080C] overflow-hidden relative shadow-2xl" style={{ height: 480 }}>
                {/* Active Pillar Pill Header */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-[#101522]/90 border border-[#94A3B8]/20 backdrop-blur-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activePillar.color }} />
                  <span className="font-mono text-xs text-[#F8FAFC] font-semibold">
                    {activePillar.title}
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    ({activePillar.highlightNodes.length} nodes highlighted)
                  </span>
                </div>

                <AttackGraph
                  nodes={ATTACK_GRAPH_NODES}
                  edges={ATTACK_GRAPH_EDGES}
                  highlightPath={activePillar.highlightNodes}
                  showControls={false}
                  showMiniMap={false}
                />
              </div>

              {/* Contrast / Value Proposition Callout */}
              <div className="p-4 rounded-xl bg-[#101522]/80 border border-[#94A3B8]/15 text-xs text-[#94A3B8] leading-relaxed">
                <span className="text-[#F8FAFC] font-semibold font-mono uppercase text-[10px] tracking-wider block mb-1">
                  Why Point Solutions Fall Short:
                </span>
                {activePillar.contrast}
              </div>
            </div>

            {/* Right Pillar Cards (remaining 2 pillars) */}
            <div className="lg:col-span-3 space-y-4">
              {pillarsData.slice(3, 5).map((pillar, sliceIdx) => {
                const idx = sliceIdx + 3;
                const Icon = pillar.icon;
                const isActive = activePillarIndex === idx;
                return (
                  <div
                    key={pillar.id}
                    onClick={() => setActivePillarIndex(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isActive
                        ? 'border-[#E53935] bg-[#E53935]/10 shadow-[0_0_20px_rgba(229,57,53,0.15)]'
                        : 'border-[#94A3B8]/15 bg-[#101522]/60 hover:border-[#94A3B8]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold" style={{ color: pillar.color }}>
                        PILLAR {pillar.number}
                      </span>
                      <Icon size={16} style={{ color: pillar.color }} />
                    </div>
                    <h4 className="text-sm font-bold text-[#F8FAFC] font-['Space_Grotesk'] mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8]/80 leading-relaxed line-clamp-3">
                      {pillar.summary}
                    </p>
                  </div>
                );
              })}

              {/* Comprehensive Summary Badge */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#3B0D16]/40 to-[#101522] border border-[#E53935]/25 text-xs">
                <div className="flex items-center gap-2 text-[#FF4D5A] font-bold font-['Space_Grotesk'] mb-1">
                  <Sparkles size={14} />
                  The Integrated Multiplier
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Individual point tools do detection OR logging OR paging. AttackTwin unites them into a mathematically closed defensive feedback loop.
                </p>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* Industry Positioning Statement */}
        <SectionBlock>
          <div className="p-5 rounded-2xl bg-[#101522]/30 border border-[#94A3B8]/15 flex items-start gap-3">
            <Info size={16} className="text-[#3B82F6] shrink-0 mt-0.5" />
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              <span className="text-[#3B82F6] font-semibold">Credibility & Positioning: </span>
              Graph databases and automated playbooks exist in isolation across modern enterprise stacks. AttackTwin AI does not claim exclusivity over graph representation. Its distinct innovation lies in combining{' '}
              <strong className="text-[#F8FAFC]">GNN topological scoring + Bayesian hypothesis tracking + SLA-enforced responder escalation + budget-constrained min-cut optimization</strong>{' '}
              in a single explainable, deterministic platform.
            </p>
          </div>
        </SectionBlock>
      </div>
    </ChapterLayout>
  );
}
