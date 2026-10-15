import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChapterProps, GraphNode } from '../types';
import { ChapterLayout, SectionBlock, GlowCard } from '../components/shared';
import { ATTACK_GRAPH_NODES, ATTACK_GRAPH_EDGES, ATTACK_PATH } from '../data/scenarioData';
import { AttackGraph, GraphLegend, NodeDetailPanel } from '../components/AttackGraph';
import { Layers, Zap, Info } from 'lucide-react';

const assetCategories = [
  { type: 'identity', label: 'Employees & Identities', count: 0 },
  { type: 'device', label: 'Devices & Endpoints', count: 0 },
  { type: 'application', label: 'Applications', count: 0 },
  { type: 'repository', label: 'GitHub Repositories', count: 0 },
  { type: 'cloud', label: 'Cloud Resources', count: 0 },
  { type: 'iam', label: 'IAM Roles & Permissions', count: 0 },
  { type: 'credential', label: 'Credentials & Secrets', count: 0 },
  { type: 'vulnerability', label: 'Vulnerabilities', count: 0 },
  { type: 'network', label: 'Network Relationships', count: 0 },
  { type: 'database', label: 'Critical Business Assets', count: 0 },
];

export default function Chapter04Solution({ id, isActive }: ChapterProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const pathNodeIds = ATTACK_PATH.steps.map((s) => s.nodeId);
  const selectedNode = ATTACK_GRAPH_NODES.find((n) => n.id === selectedNodeId) || null;

  // Count nodes by type
  const categoryCounts = assetCategories.map((cat) => ({
    ...cat,
    count: ATTACK_GRAPH_NODES.filter((n) => n.type === cat.type).length,
  }));

  return (
    <ChapterLayout
      id={id}
      chapterNumber={4}
      headline="WHAT IF WE COULD MODEL THE ENTIRE ORGANIZATION?"
      subtitle="AttackTwin AI proposes a security digital twin representing the organization's security-relevant environment as a connected graph."
    >
      {/* Asset categories */}
      <SectionBlock className="mt-8">
        <div className="flex flex-wrap gap-2">
          {categoryCounts.filter(c => c.count > 0).map((cat) => (
            <div
              key={cat.type}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101522]/60 border border-[#94A3B8]/10"
            >
              <span className="text-xs text-[#94A3B8]">{cat.label}</span>
              <span className="text-xs font-mono text-[#E53935] font-semibold">{cat.count}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Full network graph */}
      <SectionBlock className="mt-8">
        <div className="relative rounded-2xl border border-[#94A3B8]/10 bg-[#101522]/20 overflow-hidden" style={{ height: 550 }}>
          <AttackGraph
            nodes={ATTACK_GRAPH_NODES}
            edges={ATTACK_GRAPH_EDGES}
            highlightPath={pathNodeIds}
            onNodeClick={setSelectedNodeId}
            showControls={true}
            showMiniMap={true}
            interactive={true}
          />

          {/* Node detail panel */}
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
          />
        </div>

        {/* Legend */}
        <div className="mt-4">
          <GraphLegend />
        </div>
      </SectionBlock>

      {/* Key message */}
      <SectionBlock className="mt-12 text-center" delay={0.3}>
        <p className="text-lg md:text-xl text-[#94A3B8] font-['Space_Grotesk'] font-light max-w-2xl mx-auto">
          "Instead of isolated alerts, we create a{' '}
          <span className="text-[#F8FAFC] font-medium">connected representation</span> of the security environment."
        </p>
      </SectionBlock>

      {/* Prototype disclaimer */}
      <SectionBlock className="mt-8" delay={0.4}>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#F59E0B]/10 bg-[#F59E0B]/5 max-w-2xl mx-auto">
          <Info size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-[#94A3B8]">
              <span className="text-[#F59E0B] font-semibold">Current Status: </span>
              The graph above represents a predefined scenario-based prototype. The proposed full-scale system 
              would continuously synchronize with enterprise identity providers, cloud platforms, code repositories, 
              and security tools to maintain an up-to-date digital twin.
            </p>
          </div>
        </div>
      </SectionBlock>
    </ChapterLayout>
  );
}

