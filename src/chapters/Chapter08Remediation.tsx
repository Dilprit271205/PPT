import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterProps, RemediationAction, OptimizationResult } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import {
  REMEDIATION_ACTIONS,
  ATTACK_GRAPH_NODES,
  ATTACK_GRAPH_EDGES,
  ATTACK_PATH,
} from '../data/scenarioData';
import { AttackGraph } from '../components/AttackGraph';
import {
  evaluateRemediation,
  generateOptimizationResults,
} from '../utils/graphUtils';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  DollarSign,
  Layers,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
  Check,
  Scissors
} from 'lucide-react';

export default function Chapter08Remediation({ id }: ChapterProps) {
  // Budget slider state
  const [budget, setBudget] = useState<number>(200000); // $200k default
  // Selected action IDs
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([
    'rem-001',
    'rem-002',
  ]);
  // View mode for graph: before, after, or comparison
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');
  const [showMatrixModal, setShowMatrixModal] = useState<boolean>(false);

  // Compute selected action objects
  const selectedActions = useMemo(
    () => REMEDIATION_ACTIONS.filter((a) => selectedActionIds.includes(a.id)),
    [selectedActionIds]
  );

  // Total cost
  const totalCost = useMemo(
    () => selectedActions.reduce((sum, a) => sum + a.cost, 0),
    [selectedActions]
  );

  // Evaluate graph effect
  const evaluation = useMemo(
    () => evaluateRemediation(selectedActions, ATTACK_GRAPH_EDGES, [ATTACK_PATH]),
    [selectedActions]
  );

  const blockedEdgeIdsArray = useMemo(
    () => Array.from(evaluation.blockedEdgeIds),
    [evaluation.blockedEdgeIds]
  );

  const isCriticalPathBlocked = evaluation.severedPathIds.length > 0;

  // Run the exhaustive optimizer
  const handleRunOptimizer = () => {
    const result: OptimizationResult = generateOptimizationResults(
      [],
      REMEDIATION_ACTIONS,
      ATTACK_GRAPH_EDGES,
      [ATTACK_PATH],
      budget
    );
    setSelectedActionIds(result.selectedActions);
    setViewMode('after');
  };

  const toggleAction = (actionId: string) => {
    setSelectedActionIds((prev) =>
      prev.includes(actionId) ? prev.filter((id) => id !== actionId) : [...prev, actionId]
    );
  };

  const handleReset = () => {
    setSelectedActionIds(['rem-001']);
    setBudget(200000);
    setViewMode('after');
  };

  // Generate 16 combinations for the truth table
  const allCombinations = useMemo(() => {
    const list = [];
    const n = REMEDIATION_ACTIONS.length;
    for (let mask = 0; mask < (1 << n); mask++) {
      const subset: RemediationAction[] = [];
      let cost = 0;
      for (let bit = 0; bit < n; bit++) {
        if (mask & (1 << bit)) {
          subset.push(REMEDIATION_ACTIONS[bit]);
          cost += REMEDIATION_ACTIONS[bit].cost;
        }
      }
      const evalRes = evaluateRemediation(subset, ATTACK_GRAPH_EDGES, [ATTACK_PATH]);
      list.push({
        mask,
        names: subset.map((s) => s.id),
        cost,
        blocksAll: evalRes.survivingPathIds.length === 0,
        withinBudget: cost <= budget,
      });
    }
    return list.sort((a, b) => a.cost - b.cost);
  }, [budget]);

  const pathNodeIds = ATTACK_PATH.steps.map((s) => s.nodeId);

  return (
    <ChapterLayout
      id={id}
      chapterNumber={8}
      headline="DON'T FIX EVERYTHING. BREAK THE RIGHT PATH."
      subtitle="Security budgets are finite. AttackTwin AI models graph-theoretic vertex and edge cuts to determine the minimum-cost intervention that severs attacker paths to critical assets."
    >
      <div className="space-y-8">
        {/* Controls & Metrics Bar */}
        <SectionBlock>
          <div className="p-6 rounded-2xl bg-[#101522]/90 border border-[#94A3B8]/15 backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Budget slider */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#94A3B8] flex items-center gap-1.5">
                    <DollarSign size={14} className="text-[#22C55E]" />
                    Remediation Budget Cap:
                  </span>
                  <span className="text-[#F8FAFC] font-bold text-sm">
                    ${budget.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="350000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#22C55E] h-1.5 bg-[#07080C] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#94A3B8]/50">
                  <span>$20k</span>
                  <span>$150k</span>
                  <span>$350k</span>
                </div>
              </div>

              {/* Optimizer CTA Button */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                <button
                  onClick={handleRunOptimizer}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-mono text-xs font-bold tracking-wider hover:opacity-95 transition-all shadow-lg shadow-[#22C55E]/20"
                >
                  <Sparkles size={14} />
                  SOLVE MIN-COST CUT
                </button>
                <button
                  onClick={() => setShowMatrixModal(true)}
                  className="text-[11px] font-mono text-[#94A3B8] hover:text-[#F8FAFC] text-center underline decoration-[#94A3B8]/30"
                >
                  View all 16 combinations (2⁴)
                </button>
              </div>

              {/* Outcome Badges */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-3 border-l border-[#94A3B8]/10 pl-0 lg:pl-6">
                <div className="p-3 rounded-xl bg-[#07080C] border border-[#94A3B8]/10">
                  <div className="text-[10px] font-mono text-[#94A3B8]/60 uppercase">Total Selected Cost</div>
                  <div className={`text-lg font-mono font-bold ${totalCost > budget ? 'text-[#FF4D5A]' : 'text-[#22C55E]'}`}>
                    ${totalCost.toLocaleString()}
                  </div>
                  <div className="text-[9px] font-mono text-[#94A3B8]/60">
                    {totalCost <= budget ? 'Within Budget' : 'OVER BUDGET'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#07080C] border border-[#94A3B8]/10">
                  <div className="text-[10px] font-mono text-[#94A3B8]/60 uppercase">Attack Path Status</div>
                  <div className={`text-lg font-mono font-bold ${isCriticalPathBlocked ? 'text-[#22C55E]' : 'text-[#FF4D5A]'}`}>
                    {isCriticalPathBlocked ? 'SEVERED' : 'EXPOSED'}
                  </div>
                  <div className="text-[9px] font-mono text-[#94A3B8]/60">
                    {isCriticalPathBlocked ? 'Asset Protected' : 'Path Intact'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* 4 Candidate Remediation Actions Cards */}
        <SectionBlock>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]/70 flex items-center gap-2">
              <Scissors size={14} className="text-[#22C55E]" />
              Candidate Defensive Interventions (Click to toggle)
            </h4>
            <button
              onClick={handleReset}
              className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC] flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              Reset Actions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REMEDIATION_ACTIONS.map((action) => {
              const isSelected = selectedActionIds.includes(action.id);
              return (
                <div
                  key={action.id}
                  onClick={() => toggleAction(action.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#22C55E] bg-[#22C55E]/10 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                      : 'border-[#94A3B8]/15 bg-[#101522]/60 hover:border-[#94A3B8]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#07080C] text-[#94A3B8] border border-[#94A3B8]/20">
                        {action.category}
                      </span>
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#22C55E] text-white' : 'border border-[#94A3B8]/30'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </div>
                    </div>

                    <h5 className="text-sm font-bold text-[#F8FAFC] font-['Space_Grotesk'] mb-1 leading-snug">
                      {action.title}
                    </h5>
                    <p className="text-xs text-[#94A3B8]/80 leading-relaxed mb-3 line-clamp-3">
                      {action.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#94A3B8]/10 flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-[#94A3B8]/60">Cost</span>
                    <span className="font-mono text-xs font-bold text-[#22C55E]">
                      ${action.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionBlock>

        {/* Visual Graph Before & After Interactive View */}
        <SectionBlock>
          <div className="p-6 rounded-2xl bg-[#101522]/40 border border-[#94A3B8]/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase text-[#94A3B8] font-semibold">Graph View:</span>
                <div className="inline-flex p-1 rounded-xl bg-[#07080C] border border-[#94A3B8]/20">
                  <button
                    onClick={() => setViewMode('after')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      viewMode === 'after'
                        ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 font-bold'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    AFTER (Defensive Cut Applied)
                  </button>
                  <button
                    onClick={() => setViewMode('before')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      viewMode === 'before'
                        ? 'bg-[#E53935]/20 text-[#FF4D5A] border border-[#E53935]/40 font-bold'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    BEFORE (Unmitigated Attack)
                  </button>
                </div>
              </div>

              <div className="text-xs font-mono text-[#94A3B8]/70 flex items-center gap-2">
                <span>Blocked edges: <span className="text-[#22C55E] font-bold">{viewMode === 'after' ? blockedEdgeIdsArray.length : 0}</span></span>
                <span>•</span>
                <span>Critical asset: <span className={viewMode === 'after' && isCriticalPathBlocked ? 'text-[#22C55E] font-bold' : 'text-[#FF4D5A] font-bold'}>
                  {viewMode === 'after' && isCriticalPathBlocked ? 'PROTECTED (Shield Active)' : 'COMPROMISED'}
                </span></span>
              </div>
            </div>

            {/* Canvas */}
            <div className="rounded-xl border border-[#94A3B8]/10 bg-[#07080C] overflow-hidden" style={{ height: 460 }}>
              <AttackGraph
                nodes={ATTACK_GRAPH_NODES}
                edges={ATTACK_GRAPH_EDGES}
                highlightPath={pathNodeIds}
                blockedEdges={viewMode === 'after' ? blockedEdgeIdsArray : []}
                protectedNodes={viewMode === 'after' && isCriticalPathBlocked ? ['customer-pii', 'db-prod'] : []}
                showControls={true}
                showMiniMap={false}
              />
            </div>
          </div>
        </SectionBlock>

        {/* Technical Accuracy Note */}
        <SectionBlock>
          <div className="p-4 rounded-xl bg-[#101522]/30 border border-[#F59E0B]/20 flex items-start gap-3">
            <Info size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              <span className="text-[#F59E0B] font-semibold">Mathematical Optimization Note: </span>
              In graph theory, finding the cheapest set of edges/vertices whose removal disconnects the source from target is the{' '}
              <strong className="text-[#F8FAFC]">Minimum Weight Vertex/Edge Cut problem</strong>. This is distinct from knapsack-style residual risk minimization under a fixed budget cap. AttackTwin AI models both objectives deterministically without arbitrary percentage metrics.
            </p>
          </div>
        </SectionBlock>
      </div>

      {/* 16 Combinations Matrix Modal */}
      <AnimatePresence>
        {showMatrixModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#07080C]/80 backdrop-blur-sm"
              onClick={() => setShowMatrixModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-[#101522] border border-[#94A3B8]/20 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#94A3B8]/15">
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                    Exhaustive 2⁴ = 16 Combinations Space
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Full evaluation of all subset combinations against current budget cap of ${budget.toLocaleString()}.
                  </p>
                </div>
                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="px-3 py-1 rounded-lg border border-[#94A3B8]/20 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2">
                {allCombinations.map((comb, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedActionIds(comb.names);
                      setShowMatrixModal(false);
                    }}
                    className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                      comb.blocksAll && comb.withinBudget
                        ? 'border-[#22C55E]/40 bg-[#22C55E]/5 hover:bg-[#22C55E]/10'
                        : 'border-[#94A3B8]/10 bg-[#07080C]/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#94A3B8]/50">#{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[#F8FAFC] font-medium">
                        {comb.names.length === 0 ? 'No actions (baseline)' : comb.names.join(' + ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#22C55E] font-bold">${comb.cost.toLocaleString()}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          comb.blocksAll ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#E53935]/20 text-[#FF4D5A]'
                        }`}
                      >
                        {comb.blocksAll ? 'SEVERS PATH' : 'EXPOSED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ChapterLayout>
  );
}

