import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphNode, GraphEdge } from '../types';
import { Shield, Server, User, Database, Cloud, Key, GitBranch, Lock, AlertTriangle, Monitor, Globe } from 'lucide-react';

// Node type icons
const nodeIcons: Record<string, any> = {
  identity: User,
  device: Monitor,
  application: Globe,
  repository: GitBranch,
  cloud: Cloud,
  iam: Lock,
  credential: Key,
  vulnerability: AlertTriangle,
  network: Server,
  database: Database,
  'critical-asset': Shield,
};

const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  identity: { bg: '#1E3A5F', border: '#3B82F6', text: '#93C5FD' },
  device: { bg: '#1E3A5F', border: '#3B82F6', text: '#93C5FD' },
  application: { bg: '#1E3550', border: '#0EA5E9', text: '#7DD3FC' },
  repository: { bg: '#1A2E1A', border: '#22C55E', text: '#86EFAC' },
  cloud: { bg: '#2D1B4E', border: '#A855F7', text: '#D8B4FE' },
  iam: { bg: '#2D1B4E', border: '#A855F7', text: '#D8B4FE' },
  credential: { bg: '#3B1A1A', border: '#E53935', text: '#FCA5A5' },
  vulnerability: { bg: '#3B2A0A', border: '#F59E0B', text: '#FDE68A' },
  network: { bg: '#1E3A5F', border: '#3B82F6', text: '#93C5FD' },
  database: { bg: '#3B1A1A', border: '#E53935', text: '#FCA5A5' },
  'critical-asset': { bg: '#3B1A1A', border: '#E53935', text: '#FF4D5A' },
};

// Custom node component
function AttackGraphNode({ data, selected }: NodeProps) {
  const Icon = nodeIcons[data.nodeType] || Server;
  const colors = nodeColors[data.nodeType] || nodeColors.network;
  const isCompromised = data.compromised;
  const isProtected = data.protected;

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" />
      <motion.div
        animate={isCompromised ? {
          boxShadow: ['0 0 10px #E5393520', '0 0 25px #E5393540', '0 0 10px #E5393520'],
        } : undefined}
        transition={isCompromised ? { duration: 2, repeat: Infinity } : undefined}
        className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all min-w-[100px] ${
          selected ? 'scale-110' : ''
        }`}
        style={{
          backgroundColor: isProtected ? '#0A2E0A' : colors.bg,
          borderColor: isProtected ? '#22C55E' : isCompromised ? '#E53935' : colors.border,
        }}
      >
        {/* Risk indicator */}
        {data.risk !== undefined && data.risk > 0.5 && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: data.risk > 0.8 ? '#E53935' : '#F59E0B' }}
          />
        )}

        {/* Protected indicator */}
        {isProtected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center">
            <Shield size={10} className="text-white" />
          </div>
        )}

        <Icon
          size={18}
          style={{ color: isProtected ? '#22C55E' : colors.text }}
        />
        <span
          className="text-[10px] font-mono font-medium leading-tight text-center max-w-[90px] truncate"
          style={{ color: isProtected ? '#86EFAC' : colors.text }}
        >
          {data.label}
        </span>
      </motion.div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" />
    </>
  );
}

const nodeTypes = { attackNode: AttackGraphNode };

interface AttackGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightPath?: string[];
  blockedEdges?: string[];
  protectedNodes?: string[];
  onNodeClick?: (nodeId: string) => void;
  className?: string;
  showControls?: boolean;
  showMiniMap?: boolean;
  interactive?: boolean;
}

const EMPTY_ARRAY: string[] = [];

export function AttackGraph({
  nodes: graphNodes,
  edges: graphEdges,
  highlightPath = EMPTY_ARRAY,
  blockedEdges = EMPTY_ARRAY,
  protectedNodes = EMPTY_ARRAY,
  onNodeClick,
  className = '',
  showControls = true,
  showMiniMap = false,
  interactive = true,
}: AttackGraphProps) {
  // Memoize stable keys for array props to avoid unnecessary recalculations
  const highlightKey = highlightPath.join(',');
  const blockedKey = blockedEdges.join(',');
  const protectedKey = protectedNodes.join(',');

  // Convert to ReactFlow format
  const rfNodes: Node[] = useMemo(() =>
    graphNodes.map((node) => ({
      id: node.id,
      type: 'attackNode',
      position: { x: node.x || 0, y: node.y || 0 },
      data: {
        label: node.label,
        nodeType: node.type,
        risk: node.risk,
        compromised: node.compromised || highlightPath.includes(node.id),
        protected: protectedNodes.includes(node.id),
        properties: node.properties,
      },
      draggable: interactive,
      selectable: interactive,
    })),
    [graphNodes, highlightKey, protectedKey, interactive]
  );

  const rfEdges: Edge[] = useMemo(() =>
    graphEdges.map((edge) => {
      const isAttack = edge.isAttackPath || (
        highlightPath.includes(edge.source) && highlightPath.includes(edge.target)
      );
      const isBlocked = blockedEdges.includes(edge.id) || edge.isBlocked;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: isAttack && !isBlocked,
        type: 'smoothstep',
        style: {
          stroke: isBlocked ? '#94A3B8' : isAttack ? '#E53935' : '#94A3B830',
          strokeWidth: isAttack ? 2.5 : 1,
          strokeDasharray: isBlocked ? '5 5' : undefined,
          opacity: isBlocked ? 0.3 : 1,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isBlocked ? '#94A3B8' : isAttack ? '#E53935' : '#94A3B830',
          width: 12,
          height: 12,
        },
        labelStyle: {
          fill: '#94A3B8',
          fontSize: 9,
          fontFamily: 'JetBrains Mono',
        },
        labelBgStyle: {
          fill: '#07080C',
          fillOpacity: 0.8,
        },
      };
    }),
    [graphEdges, highlightKey, blockedKey]
  );

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick?.(node.id);
  }, [onNodeClick]);

  return (
    <div className={`w-full h-full ${className}`} style={{ minHeight: 400 }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className="!bg-transparent"
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable={interactive}
        nodesConnectable={false}
        elementsSelectable={interactive}
      >
        <Background color="#94A3B810" gap={20} size={1} />
        {showControls && (
          <Controls
            className="!bg-[#101522] !border-[#94A3B8]/20 !rounded-xl !shadow-xl [&>button]:!bg-[#101522] [&>button]:!border-[#94A3B8]/10 [&>button]:!text-[#94A3B8] [&>button:hover]:!bg-[#1E293B]"
          />
        )}
        {showMiniMap && (
          <MiniMap
            nodeColor={(node) => {
              if (node.data?.protected) return '#22C55E';
              if (node.data?.compromised) return '#E53935';
              return '#3B82F6';
            }}
            className="!bg-[#101522] !border-[#94A3B8]/10 !rounded-xl"
            maskColor="#07080C80"
          />
        )}
      </ReactFlow>
    </div>
  );
}

// Node detail panel
interface NodeDetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null;

  const colors = nodeColors[node.type] || nodeColors.network;
  const Icon = nodeIcons[node.type] || Server;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute right-4 top-4 w-72 bg-[#101522]/95 backdrop-blur-xl border border-[#94A3B8]/10 rounded-2xl p-5 shadow-2xl z-10"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <Icon size={16} style={{ color: colors.text }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC] font-['Space_Grotesk']">{node.label}</h3>
              <p className="text-[10px] text-[#94A3B8] font-mono uppercase">{node.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {node.risk !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#94A3B8] font-mono">Risk Score</span>
              <span className={`font-mono font-semibold ${node.risk > 0.7 ? 'text-[#E53935]' : node.risk > 0.4 ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
                {(node.risk * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#07080C] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${node.risk * 100}%`,
                  backgroundColor: node.risk > 0.7 ? '#E53935' : node.risk > 0.4 ? '#F59E0B' : '#22C55E',
                }}
              />
            </div>
          </div>
        )}

        {node.properties && Object.entries(node.properties).length > 0 && (
          <div className="space-y-2">
            {Object.entries(node.properties).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start gap-2">
                <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">{key}</span>
                <span className="text-[10px] text-[#F8FAFC] font-mono text-right">{value}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Legend component
export function GraphLegend() {
  const items = [
    { type: 'identity', label: 'Identity / User' },
    { type: 'repository', label: 'Repository' },
    { type: 'cloud', label: 'Cloud Resource' },
    { type: 'credential', label: 'Credential' },
    { type: 'database', label: 'Database' },
    { type: 'critical-asset', label: 'Critical Asset' },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-3 bg-[#101522]/60 backdrop-blur-sm border border-[#94A3B8]/10 rounded-xl">
      {items.map((item) => {
        const colors = nodeColors[item.type];
        const Icon = nodeIcons[item.type] || Server;
        return (
          <div key={item.type} className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded flex items-center justify-center border"
              style={{ backgroundColor: colors.bg, borderColor: colors.border + '60' }}
            >
              <Icon size={10} style={{ color: colors.text }} />
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono">{item.label}</span>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-0.5 bg-[#E53935]" />
        <span className="text-[10px] text-[#94A3B8] font-mono">Attack Path</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-0.5 bg-[#94A3B8] opacity-30" style={{ borderTop: '1px dashed #94A3B8' }} />
        <span className="text-[10px] text-[#94A3B8] font-mono">Blocked</span>
      </div>
    </div>
  );
}

