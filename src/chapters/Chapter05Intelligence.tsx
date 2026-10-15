import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterProps } from '../types';
import { ChapterLayout, SectionBlock } from '../components/shared';
import { THREAT_INTEL_SOURCES } from '../data/scenarioData';
import { BarChart3, ChevronRight, Zap, Network, TrendingUp, Info, Shield, Bug, AlertTriangle } from 'lucide-react';

const modules = [
  {
    id: 'gnn',
    title: 'Graph Neural Network',
    shortTitle: 'GNN',
    icon: Network,
    color: '#3B82F6',
    purpose: 'Analyze graph structure and security features to estimate suspiciousness or attack-related scores across the digital twin.',
    inputs: ['Login anomalies', 'User privileges', 'Asset criticality', 'Event relationships', 'Credential exposure', 'Network connectivity'],
    visual: 'Information propagates between neighboring nodes. Nodes gradually change intensity according to a simulated suspiciousness score.',
    note: 'A trained GNN requires appropriate labeled data and rigorous validation. The current prototype uses simplified scoring.',
  },
  {
    id: 'bayesian',
    title: 'Bayesian Inference & MCMC',
    shortTitle: 'Bayesian',
    icon: BarChart3,
    color: '#A855F7',
    purpose: 'Update confidence in possible attack hypotheses as new evidence arrives using probabilistic reasoning.',
    inputs: ['Prior beliefs about attack likelihood', 'Observed evidence', 'Conditional relationships', 'Historical patterns'],
    visual: 'A probability distribution changes shape as additional evidence becomes available, reflecting updated beliefs.',
    note: 'Bayesian inference updates beliefs using evidence. MCMC is a sampling method for approximating complex posterior distributions — it is not a next-step prediction model.',
  },
  {
    id: 'markov',
    title: 'Markov-Based Progression',
    shortTitle: 'Markov',
    icon: TrendingUp,
    color: '#E53935',
    purpose: 'Estimate possible next states in an attack sequence based on transition probabilities between attack stages.',
    inputs: ['Current attacker state', 'Transition probability model', 'Available attack surface', 'Security controls in place'],
    visual: 'The current attacker state is highlighted. Several possible next transitions are displayed with probability labels.',
    note: 'Probability labels are only meaningful when backed by an explicitly defined model or clearly marked illustrative assumptions. A transition model estimates possible progression, not guaranteed attacker behavior.',
  },
];

const threatIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'MITRE ATT&CK': Shield,
  'STRIDE': AlertTriangle,
  'CVE': Bug,
  'CVSS': BarChart3,
  'CISA KEV': Zap,
};

export default function Chapter05Intelligence({ id }: ChapterProps) {
  const [activeModule, setActiveModule] = useState<string>('gnn');
  const [showThreatIntel, setShowThreatIntel] = useState(false);

  const currentModule = modules.find((m) => m.id === activeModule)!;

  return (
    <ChapterLayout
      id={id}
      chapterNumber={5}
      headline="FROM CONNECTED EVIDENCE TO POSSIBLE ATTACK PROGRESSION."
      subtitle="Three intelligence modules analyze the security graph to estimate risk, update beliefs, and model possible attacker movement."
    >
      {/* Module selector */}
      <SectionBlock className="mt-12">
        <div className="flex flex-wrap gap-3 mb-8">
          {modules.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  activeModule === mod.id
                    ? 'border-opacity-40 bg-opacity-10'
                    : 'border-[#94A3B8]/10 bg-[#101522]/40 hover:border-[#94A3B8]/20'
                }`}
                style={
                  activeModule === mod.id
                    ? {
                        borderColor: mod.color + '60',
                        backgroundColor: mod.color + '10',
                      }
                    : undefined
                }
              >
                <ModIcon size={16} style={{ color: activeModule === mod.id ? mod.color : '#94A3B8' }} />
                <span
                  className={`text-sm font-['Space_Grotesk'] font-medium ${
                    activeModule === mod.id ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'
                  }`}
                >
                  {mod.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Module detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <currentModule.icon size={20} style={{ color: currentModule.color }} />
                    <h3 className="text-xl font-semibold text-[#F8FAFC] font-['Space_Grotesk']">
                      {currentModule.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {currentModule.purpose}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono text-[#94A3B8]/60 uppercase tracking-wider mb-3">Potential Inputs</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentModule.inputs.map((input, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] font-mono rounded-lg border"
                        style={{
                          borderColor: currentModule.color + '20',
                          backgroundColor: currentModule.color + '08',
                          color: '#94A3B8',
                        }}
                      >
                        {input}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="p-4 rounded-xl border border-[#F59E0B]/10 bg-[#F59E0B]/5">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#94A3B8]">{currentModule.note}</p>
                  </div>
                </div>
              </div>

              {/* Right: Visual simulation */}
              <div className="relative rounded-2xl border border-[#94A3B8]/10 bg-[#101522]/40 p-6 min-h-[300px] flex items-center justify-center overflow-hidden">
                {activeModule === 'gnn' && <GNNVisualization color={currentModule.color} />}
                {activeModule === 'bayesian' && <BayesianVisualization color={currentModule.color} />}
                {activeModule === 'markov' && <MarkovVisualization color={currentModule.color} />}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </SectionBlock>

      {/* Threat Intelligence Sources */}
      <SectionBlock className="mt-16" delay={0.3}>
        <button
          onClick={() => setShowThreatIntel(!showThreatIntel)}
          className="flex items-center gap-2 text-lg font-semibold text-[#F8FAFC] font-['Space_Grotesk'] mb-6 group"
        >
          <ChevronRight
            size={18}
            className={`text-[#E53935] transition-transform ${showThreatIntel ? 'rotate-90' : ''}`}
          />
          Supporting Threat Intelligence Sources
        </button>

        <AnimatePresence>
          {showThreatIntel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden"
            >
              {THREAT_INTEL_SOURCES.map((source, i) => {
                const SourceIcon = threatIcons[source.name] || Shield;
                return (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-[#101522]/40 border border-[#94A3B8]/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SourceIcon size={14} className="text-[#E53935]" />
                      <h4 className="text-sm font-semibold text-[#F8FAFC] font-['Space_Grotesk']">{source.name}</h4>
                    </div>
                    <p className="text-xs text-[#94A3B8]">{source.description}</p>
                    <p className="mt-2 text-[10px] text-[#94A3B8]/50 font-mono">{source.dataType}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 p-3 rounded-xl border border-[#94A3B8]/5 bg-[#101522]/20">
          <p className="text-[10px] text-[#94A3B8]/50">
            These frameworks provide context and classification. They do not directly produce attack probabilities.
          </p>
        </div>
      </SectionBlock>
    </ChapterLayout>
  );
}

// GNN Visualization
function GNNVisualization({ color }: { color: string }) {
  const nodes = [
    { x: 50, y: 50, score: 0.3 }, { x: 150, y: 30, score: 0.7 },
    { x: 250, y: 60, score: 0.9 }, { x: 100, y: 130, score: 0.5 },
    { x: 200, y: 150, score: 0.8 }, { x: 300, y: 120, score: 0.4 },
    { x: 50, y: 200, score: 0.2 }, { x: 180, y: 230, score: 0.6 },
  ];
  const edges = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [3, 6], [4, 7], [6, 7]];

  return (
    <svg viewBox="0 0 350 270" className="w-full max-w-sm">
      {/* Edges */}
      {edges.map(([from, to], i) => (
        <motion.line
          key={`edge-${i}`}
          x1={nodes[from].x} y1={nodes[from].y}
          x2={nodes[to].x} y2={nodes[to].y}
          stroke={color} strokeWidth="1" strokeOpacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        />
      ))}
      {/* Info propagation particles */}
      {edges.map(([from, to], i) => (
        <motion.circle
          key={`particle-${i}`}
          r="2" fill={color} opacity="0.6"
          animate={{
            cx: [nodes[from].x, nodes[to].x],
            cy: [nodes[from].y, nodes[to].y],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g key={`node-${i}`}>
          <motion.circle
            cx={node.x} cy={node.y} r="12"
            fill={color} fillOpacity={node.score * 0.3}
            stroke={color} strokeWidth="1.5" strokeOpacity={node.score}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
          />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="8" fill="#F8FAFC" fontFamily="JetBrains Mono">
            {(node.score * 100).toFixed(0)}
          </text>
        </motion.g>
      ))}
      <text x="175" y="265" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono">
        Node suspiciousness scores (simulated)
      </text>
    </svg>
  );
}

// Bayesian Visualization
function BayesianVisualization({ color }: { color: string }) {
  const [evidenceCount, setEvidenceCount] = useState(0);

  // Simulated distributions shifting with evidence
  const distributions = [
    { mean: 0.3, spread: 0.4, label: 'Prior (no evidence)' },
    { mean: 0.45, spread: 0.3, label: '+1 suspicious login' },
    { mean: 0.6, spread: 0.22, label: '+2 credential exposure' },
    { mean: 0.78, spread: 0.15, label: '+3 lateral movement' },
    { mean: 0.88, spread: 0.1, label: '+4 data exfiltration' },
  ];

  const dist = distributions[evidenceCount];

  // Generate bell curve points
  const points: string[] = [];
  for (let x = 0; x <= 300; x += 2) {
    const xNorm = x / 300;
    const y = Math.exp(-Math.pow(xNorm - dist.mean, 2) / (2 * dist.spread * dist.spread));
    points.push(`${x},${200 - y * 150}`);
  }

  return (
    <div className="w-full max-w-sm">
      <svg viewBox="0 0 300 220" className="w-full">
        <text x="150" y="15" textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="JetBrains Mono">
          P(attack | evidence)
        </text>
        {/* Axis */}
        <line x1="20" y1="200" x2="280" y2="200" stroke="#94A3B8" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="20" y1="200" x2="20" y2="30" stroke="#94A3B8" strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Distribution */}
        <motion.polyline
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          key={evidenceCount}
        />
        {/* Fill under curve */}
        <motion.polygon
          points={`20,200 ${points.join(' ')} 280,200`}
          fill={color}
          fillOpacity="0.1"
          key={`fill-${evidenceCount}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        {/* Labels */}
        <text x="20" y="215" fontSize="7" fill="#94A3B8" fontFamily="JetBrains Mono">0%</text>
        <text x="270" y="215" fontSize="7" fill="#94A3B8" fontFamily="JetBrains Mono">100%</text>
        <text x="150" y="215" textAnchor="middle" fontSize="7" fill="#94A3B8" fontFamily="JetBrains Mono">
          Attack Probability
        </text>
      </svg>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] font-mono text-[#94A3B8]">{dist.label}</span>
        <div className="flex gap-1">
          {distributions.map((_, i) => (
            <button
              key={i}
              onClick={() => setEvidenceCount(i)}
              className={`w-6 h-6 rounded text-[9px] font-mono transition-all ${
                i === evidenceCount
                  ? 'bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/30'
                  : 'bg-[#101522] text-[#94A3B8] border border-[#94A3B8]/10 hover:border-[#94A3B8]/20'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Markov Visualization
function MarkovVisualization({ color }: { color: string }) {
  const states = [
    { id: 'initial', label: 'Initial Access', x: 50, y: 100, current: true },
    { id: 'exec', label: 'Code Execution', x: 180, y: 40 },
    { id: 'persist', label: 'Persistence', x: 180, y: 100 },
    { id: 'lateral', label: 'Lateral Movement', x: 180, y: 160 },
    { id: 'exfil', label: 'Data Exfiltration', x: 310, y: 70 },
    { id: 'impact', label: 'Impact', x: 310, y: 140 },
  ];

  const transitions = [
    { from: 'initial', to: 'exec', prob: 0.35 },
    { from: 'initial', to: 'persist', prob: 0.40 },
    { from: 'initial', to: 'lateral', prob: 0.25 },
    { from: 'exec', to: 'exfil', prob: 0.55 },
    { from: 'persist', to: 'lateral', prob: 0.60 },
    { from: 'lateral', to: 'exfil', prob: 0.45 },
    { from: 'lateral', to: 'impact', prob: 0.30 },
    { from: 'exec', to: 'impact', prob: 0.20 },
  ];

  return (
    <svg viewBox="0 0 380 220" className="w-full max-w-md">
      {/* Transitions */}
      {transitions.map((t, i) => {
        const from = states.find((s) => s.id === t.from)!;
        const to = states.find((s) => s.id === t.to)!;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2 - 10;
        return (
          <g key={`trans-${i}`}>
            <motion.line
              x1={from.x + 30} y1={from.y}
              x2={to.x - 30} y2={to.y}
              stroke={color} strokeWidth="1" strokeOpacity="0.3"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            />
            <text x={midX} y={midY} textAnchor="middle" fontSize="8" fill={color} fontFamily="JetBrains Mono" opacity="0.7">
              {(t.prob * 100).toFixed(0)}%
            </text>
            {/* Animated particle */}
            <motion.circle
              r="2" fill={color}
              animate={{
                cx: [from.x + 30, to.x - 30],
                cy: [from.y, to.y],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          </g>
        );
      })}
      {/* States */}
      {states.map((state, i) => (
        <motion.g
          key={state.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, type: 'spring' }}
        >
          <rect
            x={state.x - 30} y={state.y - 15} width="60" height="30" rx="6"
            fill={state.current ? color + '30' : '#10152280'}
            stroke={state.current ? color : '#94A3B830'}
            strokeWidth={state.current ? 2 : 1}
          />
          <text x={state.x} y={state.y + 4} textAnchor="middle" fontSize="7" fill="#F8FAFC" fontFamily="JetBrains Mono">
            {state.label}
          </text>
          {state.current && (
            <motion.circle
              cx={state.x} cy={state.y - 20} r="3" fill={color}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.g>
      ))}
      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={color} opacity="0.5" />
        </marker>
      </defs>
      <text x="190" y="210" textAnchor="middle" fontSize="8" fill="#94A3B8" fontFamily="JetBrains Mono">
        Illustrative transition probabilities
      </text>
    </svg>
  );
}

