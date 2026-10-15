// ─── AttackTwin AI – Core Type Definitions ──────────────────────────────────

// ---------------------------------------------------------------------------
// Chapter system
// ---------------------------------------------------------------------------

export interface ChapterConfig {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  headline: string;
}

// ---------------------------------------------------------------------------
// Security events / alerts
// ---------------------------------------------------------------------------

export interface SecurityEvent {
  id: string;
  time: string;
  source: string;
  sourceIcon: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  identity: string;
  affectedAsset: string;
  evidence: string[];
  legitimateExplanation: string;
  suspiciousIndicators: string[];
}

// ---------------------------------------------------------------------------
// Graph nodes
// ---------------------------------------------------------------------------

export interface GraphNode {
  id: string;
  label: string;
  type:
    | 'identity'
    | 'device'
    | 'application'
    | 'repository'
    | 'cloud'
    | 'iam'
    | 'credential'
    | 'vulnerability'
    | 'network'
    | 'database'
    | 'critical-asset';
  x?: number;
  y?: number;
  risk?: number;
  compromised?: boolean;
  properties?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Graph edges
// ---------------------------------------------------------------------------

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type:
    | 'access'
    | 'permission'
    | 'network'
    | 'credential'
    | 'temporal'
    | 'ownership';
  label?: string;
  isAttackPath?: boolean;
  isBlocked?: boolean;
  evidence?: string;
  relationship?: string;
}

// ---------------------------------------------------------------------------
// Attack path
// ---------------------------------------------------------------------------

export interface AttackPath {
  id: string;
  steps: AttackStep[];
  probability?: number;
  severity: 'critical' | 'high' | 'medium';
}

export interface AttackStep {
  nodeId: string;
  action: string;
  technique?: string;
  mitreTactic?: string;
  timestamp?: string;
}

// ---------------------------------------------------------------------------
// Incident
// ---------------------------------------------------------------------------

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'investigating' | 'escalated' | 'resolved';
  assignedTeam: string;
  assignedPerson?: string;
  affectedAsset: string;
  evidence: string[];
  attackLineage: string[];
  acknowledgementDeadline: number; // seconds
  escalationDeadline: number; // seconds
  recommendedActions: string[];
  history: IncidentEvent[];
  createdAt: string;
}

export interface IncidentEvent {
  time: string;
  action: string;
  actor: string;
  detail: string;
}

// ---------------------------------------------------------------------------
// Escalation policy
// ---------------------------------------------------------------------------

export interface EscalationPolicy {
  severity: string;
  acknowledgementTarget: number; // minutes
  escalationDeadline: number; // minutes
  escalationChain: string[];
}

// ---------------------------------------------------------------------------
// Remediation
// ---------------------------------------------------------------------------

export interface RemediationAction {
  id: string;
  title: string;
  description: string;
  cost: number;
  affectedEdges: string[];
  expectedEffect: string;
  dependencies: string[];
  explanation: string;
  category: 'credential' | 'access' | 'authentication' | 'network';
}

export interface OptimizationResult {
  selectedActions: string[];
  totalCost: number;
  blockedPaths: string[];
  residualExposure: number;
  feasible: boolean;
}

// ---------------------------------------------------------------------------
// Tech stack
// ---------------------------------------------------------------------------

export interface TechItem {
  name: string;
  description: string;
  purpose: string;
  layer: string;
  status: 'implemented' | 'proposed' | 'future';
  component: string;
}

// ---------------------------------------------------------------------------
// Business research
// ---------------------------------------------------------------------------

export interface BreachCostData {
  category: string;
  cost: number;
  unit: string;
  source: string;
  year: number;
}

export interface Competitor {
  name: string;
  capabilities: string[];
  differentiator: string;
}

// ---------------------------------------------------------------------------
// Architecture workflow
// ---------------------------------------------------------------------------

export interface WorkflowStage {
  id: string;
  number: number;
  title: string;
  purpose: string;
  inputs: string[];
  processing: string;
  outputs: string[];
  technologies: string[];
  status: 'implemented' | 'proposed' | 'future';
  exampleData?: string;
}

// ---------------------------------------------------------------------------
// USP Pillar
// ---------------------------------------------------------------------------

export interface USPPillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlightNodes: string[];
}

// ---------------------------------------------------------------------------
// Chapter props (passed to each chapter component)
// ---------------------------------------------------------------------------

export interface ChapterProps {
  id: string;
  isActive: boolean;
  scrollProgress: number;
}

// ---------------------------------------------------------------------------
// Threat-intel source metadata
// ---------------------------------------------------------------------------

export interface ThreatIntelSource {
  id: string;
  name: string;
  description: string;
  url: string;
  dataType: string;
}
