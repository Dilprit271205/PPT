import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChapterProps } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  TrendingDown,
  Building2,
  Shield,
  Users,
  Layers,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Info,
  DollarSign,
  AlertTriangle,
  Flame,
  Scale
} from 'lucide-react';

const ibmBreachCostIndiaData = [
  {
    tier: 'No Security AI',
    costCrore: 31.6,
    usdMillion: 3.8,
    color: '#E53935',
    annotation: 'Baseline unautomated organizations',
  },
  {
    tier: 'Limited Security AI',
    costCrore: 23.1,
    usdMillion: 2.77,
    color: '#F59E0B',
    annotation: 'Point rule-based alert correlation',
  },
  {
    tier: 'Extensive Security AI',
    costCrore: 21.3,
    usdMillion: 2.55,
    color: '#22C55E',
    annotation: 'Continuous proactive automation',
  },
];

const competitorMatrix = [
  {
    capability: 'Cross-Source Telemetry Correlation (IdP, Cloud, Git, Secrets)',
    attackTwin: 'Native Knowledge Graph',
    msftExposure: 'Strong across Defender/Azure',
    tenableOne: 'Strong on Asset Exposure',
    xmCyber: 'Strong on Cloud/AD Hybrid',
  },
  {
    capability: 'Dynamic Multi-Hop Attack Path Discovery',
    attackTwin: 'Yes (Bidirectional Traversal)',
    msftExposure: 'Yes (Exposure Graph)',
    tenableOne: 'Yes (Attack Path Analysis)',
    xmCyber: 'Yes (Choke-Point Mapping)',
  },
  {
    capability: 'Probabilistic / Bayesian State Progression',
    attackTwin: 'Yes (Bayesian Belief Updating)',
    msftExposure: 'Heuristic Risk Scoring',
    tenableOne: 'Deterministic CVSS / VPR',
    xmCyber: 'Deterministic Rules',
  },
  {
    capability: 'Automated Ownership Routing & Escalation Timers',
    attackTwin: 'Built-in Command Center & SLA',
    msftExposure: 'Requires Sentinel Logic Apps',
    tenableOne: 'Third-party ticketing handoff',
    xmCyber: 'Third-party integration',
  },
  {
    capability: 'Minimum-Cost Cut Remediation Optimization',
    attackTwin: 'Yes (Mathematical Min-Cut Solver)',
    msftExposure: 'Prioritized Action List',
    tenableOne: 'Vulnerability Prioritization',
    xmCyber: 'Critical Path Severing',
  },
  {
    capability: 'Transparent / Explainable Architecture',
    attackTwin: 'Full evidence lineage audit',
    msftExposure: 'Proprietary cloud analytics',
    tenableOne: 'Proprietary scoring engine',
    xmCyber: 'Proprietary path algorithms',
  },
];

const targetCustomers = [
  {
    role: 'Enterprise SOC Teams',
    challenge: 'Alert fatigue from 10,000+ daily disconnected events across disparate security products.',
    value: 'Compresses MTTD by synthesizing fragmented signals into a single explainable attack storyline with 94% confidence.',
    icon: Shield,
  },
  {
    role: 'Managed Security Service Providers (MSSPs)',
    challenge: 'Managing multi-tenant escalation SLAs and proving defensible prioritization to client CISOs.',
    value: 'SLA-enforced incident timers and mathematical minimum-cost remediation proposals that justify security budgets.',
    icon: Building2,
  },
  {
    role: 'Cloud Security & DevSecOps Teams',
    challenge: 'Invisible lateral traversal paths bridging exposed developer credentials, CI/CD repos, and production DBs.',
    value: 'Cross-domain identity twin modeling the transitive path from GitHub PATs to RDS master snapshots.',
    icon: Layers,
  },
  {
    role: 'Regulated BFSI & Healthcare Orgs',
    challenge: 'Stringent compliance audits demanding verifiable evidence trails for incident response actions.',
    value: 'Deterministic audit histories, formal resolution verification, and clear mathematical defensibility.',
    icon: Scale,
  },
];

export default function Chapter11Business({ id }: ChapterProps) {
  const [activeTab, setActiveTab] = useState<'costs' | 'competitors' | 'markets'>('costs');

  return (
    <ChapterLayout
      id={id}
      chapterNumber={11}
      headline="THE COST OF DISCONNECTED SECURITY DECISIONS."
      subtitle="Examine empirical data breach research, customer deployment personas, and verified competitor market positioning."
    >
      <div className="space-y-8">
        {/* Navigation Tabs */}
        <SectionBlock>
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#101522]/80 border border-[#94A3B8]/15 w-fit">
            <button
              onClick={() => setActiveTab('costs')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeTab === 'costs'
                  ? 'bg-[#E53935] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              IBM Cost of Breach Research
            </button>
            <button
              onClick={() => setActiveTab('competitors')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeTab === 'competitors'
                  ? 'bg-[#E53935] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Competitor Positioning Matrix
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
                activeTab === 'markets'
                  ? 'bg-[#E53935] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Target Customer Profiles
            </button>
          </div>
        </SectionBlock>

        {/* TAB 1: IBM COST OF A DATA BREACH RESEARCH */}
        {activeTab === 'costs' && (
          <div className="space-y-6">
            <SectionBlock>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-[#101522]/60 border border-[#94A3B8]/15">
                {/* Left: Summary Metrics */}
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E53935] font-bold">
                    Empirical Research Findings
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-['Space_Grotesk'] leading-tight">
                    ₹10.3 Crore Observed Difference in Enterprise Breach Impact
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    According to the IBM Cost of a Data Breach Report (India Enterprise Cohort 2025/2026), organizations with extensive security AI and automation experienced dramatically lower breach containment costs and faster identification windows.
                  </p>

                  <div className="p-4 rounded-xl bg-[#07080C] border border-[#94A3B8]/15 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#94A3B8]">Observed Cost Difference:</span>
                      <span className="font-mono text-[#22C55E] font-bold text-sm">₹10.3 Crore ($1.25M)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#94A3B8]">Average MTTD Reduction:</span>
                      <span className="font-mono text-[#F8FAFC] font-bold">78 Days Faster</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#94A3B8]">Average MTTR Reduction:</span>
                      <span className="font-mono text-[#F8FAFC] font-bold">34 Days Faster</span>
                    </div>
                  </div>
                </div>

                {/* Right: Recharts Animated Bar Chart */}
                <div className="lg:col-span-7 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ibmBreachCostIndiaData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <XAxis
                        dataKey="tier"
                        stroke="#94A3B8"
                        fontSize={11}
                        fontFamily="JetBrains Mono"
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#94A3B8"
                        fontSize={11}
                        fontFamily="JetBrains Mono"
                        tickFormatter={(v) => `₹${v} Cr`}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#101522',
                          borderColor: '#94A3B830',
                          borderRadius: '12px',
                          fontFamily: 'JetBrains Mono',
                          fontSize: '11px',
                          color: '#F8FAFC',
                        }}
                        formatter={(val: any) => [`₹${val} Crore ($${(val * 0.12).toFixed(2)}M USD)`, 'Breach Cost']}
                      />
                      <Bar dataKey="costCrore" radius={[8, 8, 0, 0]}>
                        {ibmBreachCostIndiaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </SectionBlock>

            {/* Mandatory Academic & Legal Disclaimer */}
            <SectionBlock>
              <div className="p-4 rounded-xl bg-[#07080C] border border-[#F59E0B]/20 flex items-start gap-3">
                <Info size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <div className="text-xs text-[#94A3B8] leading-relaxed">
                  <strong className="text-[#F59E0B]">Source Verification & Research Context: </strong>
                  Source: <em>IBM Cost of a Data Breach Report 2025/2026 (India regional cohort data)</em>.
                  These figures reflect an <strong>observed statistical association</strong> across researched enterprises, not guaranteed cost savings produced by AttackTwin AI. No software platform can guarantee specific monetary loss reductions.
                </div>
              </div>
            </SectionBlock>
          </div>
        )}

        {/* TAB 2: COMPETITOR POSITIONING MATRIX */}
        {activeTab === 'competitors' && (
          <SectionBlock>
            <div className="p-6 rounded-2xl bg-[#101522]/60 border border-[#94A3B8]/15 space-y-4">
              <div className="flex items-center justify-between border-b border-[#94A3B8]/10 pb-4">
                <div>
                  <h4 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                    Enterprise Exposure Management Landscape
                  </h4>
                  <p className="text-xs text-[#94A3B8]">
                    Objective analysis of leading attack path and exposure management platforms.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8]/60">Verified capabilities only</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#94A3B8]/15 font-mono text-[11px] text-[#94A3B8]">
                      <th className="py-3 px-3">Capability / Dimension</th>
                      <th className="py-3 px-3 text-[#FF4D5A] font-bold bg-[#E53935]/10 rounded-t-lg">
                        AttackTwin AI
                      </th>
                      <th className="py-3 px-3">Microsoft Exposure Mgmt</th>
                      <th className="py-3 px-3">Tenable One</th>
                      <th className="py-3 px-3">XM Cyber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#94A3B8]/10 font-mono">
                    {competitorMatrix.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#07080C]/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-[#F8FAFC] font-['Space_Grotesk']">
                          {row.capability}
                        </td>
                        <td className="py-3 px-3 text-[#22C55E] bg-[#E53935]/5 font-bold">
                          {row.attackTwin}
                        </td>
                        <td className="py-3 px-3 text-[#94A3B8]">{row.msftExposure}</td>
                        <td className="py-3 px-3 text-[#94A3B8]">{row.tenableOne}</td>
                        <td className="py-3 px-3 text-[#94A3B8]">{row.xmCyber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 text-[11px] text-[#94A3B8]/60 font-mono">
                Note: Competitors possess advanced attack-path capabilities. AttackTwin AI distinguishes itself through open multi-agent synthesis, formal Bayesian progression, and budget-constrained min-cut optimization.
              </div>
            </div>
          </SectionBlock>
        )}

        {/* TAB 3: TARGET CUSTOMER PROFILES */}
        {activeTab === 'markets' && (
          <SectionBlock>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetCustomers.map((cust, idx) => {
                const Icon = cust.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#101522]/60 border border-[#94A3B8]/15 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#E53935]/15 border border-[#E53935]/30 flex items-center justify-center text-[#FF4D5A]">
                        <Icon size={16} />
                      </div>
                      <h4 className="text-sm font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                        {cust.role}
                      </h4>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#FF4D5A] uppercase tracking-wider block mb-1">
                        Operational Friction:
                      </span>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{cust.challenge}</p>
                    </div>

                    <div className="pt-2 border-t border-[#94A3B8]/10">
                      <span className="text-[10px] font-mono text-[#22C55E] uppercase tracking-wider block mb-1">
                        AttackTwin AI Value Delivery:
                      </span>
                      <p className="text-xs text-[#F8FAFC] leading-relaxed">{cust.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionBlock>
        )}
      </div>
    </ChapterLayout>
  );
}

