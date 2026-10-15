import type {
  GraphNode,
  GraphEdge,
  AttackPath,
  RemediationAction,
  OptimizationResult,
} from '../types';

// ─── Force-Directed Layout ───────────────────────────────────────────────────

interface LayoutConfig {
  width?: number;
  height?: number;
  iterations?: number;
  repulsion?: number;
  attraction?: number;
  damping?: number;
}

/**
 * Compute x/y positions for graph nodes using a simple force-directed layout
 * (Fruchterman-Reingold style).  Returns a new array of nodes with x/y set.
 */
export function calculateNodePositions(
  nodes: GraphNode[],
  edges: GraphEdge[],
  config: LayoutConfig = {},
): GraphNode[] {
  const {
    width = 1200,
    height = 800,
    iterations = 200,
    repulsion = 8000,
    attraction = 0.005,
    damping = 0.92,
  } = config;

  // Initialise positions randomly (seeded by node index for determinism)
  const positions: { x: number; y: number; vx: number; vy: number }[] =
    nodes.map((_, i) => ({
      x: width / 2 + (Math.sin(i * 2.39996) * width) / 3,
      y: height / 2 + (Math.cos(i * 2.39996) * height) / 3,
      vx: 0,
      vy: 0,
    }));

  const idToIndex = new Map<string, number>();
  nodes.forEach((n, i) => idToIndex.set(n.id, i));

  for (let iter = 0; iter < iterations; iter++) {
    const temperature = 1 - iter / iterations; // cool down linearly

    // Repulsive forces (all pairs)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const distSq = dx * dx + dy * dy + 1; // +1 to avoid div-by-zero
        const dist = Math.sqrt(distSq);
        const force = (repulsion * temperature) / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        positions[i].vx += fx;
        positions[i].vy += fy;
        positions[j].vx -= fx;
        positions[j].vy -= fy;
      }
    }

    // Attractive forces (connected pairs)
    for (const edge of edges) {
      const si = idToIndex.get(edge.source);
      const ti = idToIndex.get(edge.target);
      if (si === undefined || ti === undefined) continue;

      const dx = positions[si].x - positions[ti].x;
      const dy = positions[si].y - positions[ti].y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = dist * attraction * temperature;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      positions[si].vx -= fx;
      positions[si].vy -= fy;
      positions[ti].vx += fx;
      positions[ti].vy += fy;
    }

    // Apply velocities with damping and boundary clamping
    const margin = 60;
    for (let i = 0; i < nodes.length; i++) {
      positions[i].vx *= damping;
      positions[i].vy *= damping;
      positions[i].x += positions[i].vx;
      positions[i].y += positions[i].vy;
      positions[i].x = Math.max(margin, Math.min(width - margin, positions[i].x));
      positions[i].y = Math.max(margin, Math.min(height - margin, positions[i].y));
    }
  }

  return nodes.map((node, i) => ({
    ...node,
    x: Math.round(positions[i].x * 10) / 10,
    y: Math.round(positions[i].y * 10) / 10,
  }));
}

// ─── Attack Path Finding ─────────────────────────────────────────────────────

/**
 * Find all simple paths from `source` to `target` in the graph (BFS-based
 * exhaustive search with depth limit).
 */
export function findAttackPaths(
  nodes: GraphNode[],
  edges: GraphEdge[],
  sourceId: string,
  targetId: string,
  maxDepth = 10,
): string[][] {
  const adjacency = buildAdjacency(nodes, edges);
  const result: string[][] = [];

  function dfs(current: string, visited: Set<string>, path: string[]) {
    if (path.length > maxDepth) return;
    if (current === targetId) {
      result.push([...path]);
      return;
    }
    const neighbours = adjacency.get(current);
    if (!neighbours) return;
    for (const neighbour of neighbours) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        path.push(neighbour);
        dfs(neighbour, visited, path);
        path.pop();
        visited.delete(neighbour);
      }
    }
  }

  const visited = new Set<string>([sourceId]);
  dfs(sourceId, visited, [sourceId]);
  return result;
}

/**
 * Build an adjacency list from nodes and edges (directed).
 */
function buildAdjacency(
  nodes: GraphNode[],
  edges: GraphEdge[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const node of nodes) {
    map.set(node.id, []);
  }
  for (const edge of edges) {
    const list = map.get(edge.source);
    if (list) list.push(edge.target);
  }
  return map;
}

// ─── Remediation Evaluation ──────────────────────────────────────────────────

/**
 * Given a set of selected remediation actions, determine which attack-path
 * edges are blocked and which paths are severed.
 */
export function evaluateRemediation(
  actions: RemediationAction[],
  edges: GraphEdge[],
  attackPaths: AttackPath[],
): {
  blockedEdgeIds: Set<string>;
  severedPathIds: string[];
  survivingPathIds: string[];
} {
  // Collect all edge IDs affected by selected actions
  const blockedEdgeIds = new Set<string>();
  for (const action of actions) {
    for (const edgeId of action.affectedEdges) {
      blockedEdgeIds.add(edgeId);
    }
  }

  const severedPathIds: string[] = [];
  const survivingPathIds: string[] = [];

  for (const path of attackPaths) {
    // Collect edges along the path
    const pathEdges = getPathEdges(path, edges);
    const isSevered = pathEdges.some((e) => blockedEdgeIds.has(e.id));
    if (isSevered) {
      severedPathIds.push(path.id);
    } else {
      survivingPathIds.push(path.id);
    }
  }

  return { blockedEdgeIds, severedPathIds, survivingPathIds };
}

/**
 * Determine which edges are traversed by an attack path's steps.
 */
function getPathEdges(path: AttackPath, allEdges: GraphEdge[]): GraphEdge[] {
  const edgeMap = new Map<string, GraphEdge>();
  for (const e of allEdges) {
    edgeMap.set(`${e.source}->${e.target}`, e);
    // Also check reverse for undirected-ish matching
    edgeMap.set(`${e.target}->${e.source}`, e);
  }

  const result: GraphEdge[] = [];
  for (let i = 0; i < path.steps.length - 1; i++) {
    const from = path.steps[i].nodeId;
    const to = path.steps[i + 1].nodeId;
    const edge = edgeMap.get(`${from}->${to}`);
    if (edge) result.push(edge);
  }

  // Also include edges that are explicitly on the attack path
  for (const e of allEdges) {
    if (e.isAttackPath && !result.find((r) => r.id === e.id)) {
      result.push(e);
    }
  }

  return result;
}

// ─── Optimization (Exhaustive 2^n) ──────────────────────────────────────────

/**
 * Exhaustively evaluate all 2^n subsets of remediation actions to find the
 * minimum-cost subset that blocks ALL attack paths within the given budget.
 *
 * For large n, falls back to a greedy approximation.
 */
export function generateOptimizationResults(
  selectedActions: string[],
  allActions: RemediationAction[],
  edges: GraphEdge[],
  attackPaths: AttackPath[],
  budget: number,
): OptimizationResult {
  // If no attack paths, nothing to block
  if (attackPaths.length === 0) {
    return {
      selectedActions: [],
      totalCost: 0,
      blockedPaths: [],
      residualExposure: 0,
      feasible: true,
    };
  }

  const n = allActions.length;

  // For n <= 20, exhaustive search is feasible (2^20 ≈ 1M)
  if (n <= 20) {
    return exhaustiveOptimize(allActions, edges, attackPaths, budget);
  }

  // Greedy fallback
  return greedyOptimize(allActions, edges, attackPaths, budget);
}

function exhaustiveOptimize(
  allActions: RemediationAction[],
  edges: GraphEdge[],
  attackPaths: AttackPath[],
  budget: number,
): OptimizationResult {
  const n = allActions.length;
  const totalSubsets = 1 << n; // 2^n

  let bestCost = Infinity;
  let bestMask = 0;
  let bestSevered: string[] = [];
  let bestSurviving: string[] = [];

  for (let mask = 0; mask < totalSubsets; mask++) {
    const subset: RemediationAction[] = [];
    let cost = 0;

    for (let bit = 0; bit < n; bit++) {
      if (mask & (1 << bit)) {
        subset.push(allActions[bit]);
        cost += allActions[bit].cost;
      }
    }

    if (cost > budget) continue;

    const { severedPathIds, survivingPathIds } = evaluateRemediation(
      subset,
      edges,
      attackPaths,
    );

    // Prefer subsets that block all paths, then minimize cost
    const allBlocked = survivingPathIds.length === 0;

    if (allBlocked && cost < bestCost) {
      bestCost = cost;
      bestMask = mask;
      bestSevered = severedPathIds;
      bestSurviving = survivingPathIds;
    }
  }

  // If no subset blocks all paths within budget, find the one that blocks the
  // most paths at minimum cost
  if (bestCost === Infinity) {
    let maxSevered = 0;

    for (let mask = 0; mask < (1 << n); mask++) {
      const subset: RemediationAction[] = [];
      let cost = 0;

      for (let bit = 0; bit < n; bit++) {
        if (mask & (1 << bit)) {
          subset.push(allActions[bit]);
          cost += allActions[bit].cost;
        }
      }

      if (cost > budget) continue;

      const { severedPathIds, survivingPathIds } = evaluateRemediation(
        subset,
        edges,
        attackPaths,
      );

      if (
        severedPathIds.length > maxSevered ||
        (severedPathIds.length === maxSevered && cost < bestCost)
      ) {
        maxSevered = severedPathIds.length;
        bestCost = cost;
        bestMask = mask;
        bestSevered = severedPathIds;
        bestSurviving = survivingPathIds;
      }
    }
  }

  const selectedIds: string[] = [];
  for (let bit = 0; bit < n; bit++) {
    if (bestMask & (1 << bit)) {
      selectedIds.push(allActions[bit].id);
    }
  }

  const residual =
    attackPaths.length > 0
      ? bestSurviving.length / attackPaths.length
      : 0;

  return {
    selectedActions: selectedIds,
    totalCost: bestCost === Infinity ? 0 : bestCost,
    blockedPaths: bestSevered,
    residualExposure: Math.round(residual * 100) / 100,
    feasible: bestSurviving.length === 0,
  };
}

function greedyOptimize(
  allActions: RemediationAction[],
  edges: GraphEdge[],
  attackPaths: AttackPath[],
  budget: number,
): OptimizationResult {
  // Sort by cost-effectiveness: paths-blocked-per-dollar descending
  const scored = allActions.map((action) => {
    const { severedPathIds } = evaluateRemediation([action], edges, attackPaths);
    return {
      action,
      pathsBlocked: severedPathIds.length,
      costEffectiveness:
        action.cost > 0 ? severedPathIds.length / action.cost : 0,
    };
  });

  scored.sort((a, b) => b.costEffectiveness - a.costEffectiveness);

  const selected: RemediationAction[] = [];
  let totalCost = 0;

  for (const { action } of scored) {
    if (totalCost + action.cost <= budget) {
      selected.push(action);
      totalCost += action.cost;
    }
  }

  const { severedPathIds, survivingPathIds } = evaluateRemediation(
    selected,
    edges,
    attackPaths,
  );

  const residual =
    attackPaths.length > 0
      ? survivingPathIds.length / attackPaths.length
      : 0;

  return {
    selectedActions: selected.map((a) => a.id),
    totalCost,
    blockedPaths: severedPathIds,
    residualExposure: Math.round(residual * 100) / 100,
    feasible: survivingPathIds.length === 0,
  };
}

// ─── Utility: Severity Color ─────────────────────────────────────────────────

export function severityColor(
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info',
): string {
  const map: Record<string, string> = {
    critical: '#E53935',
    high: '#FF4D5A',
    medium: '#F59E0B',
    low: '#22C55E',
    info: '#94A3B8',
  };
  return map[severity] ?? '#94A3B8';
}

// ─── Utility: Node Type Color ────────────────────────────────────────────────

export function nodeTypeColor(type: GraphNode['type']): string {
  const map: Record<GraphNode['type'], string> = {
    identity: '#818CF8',       // indigo
    device: '#38BDF8',         // sky
    application: '#34D399',    // emerald
    repository: '#A78BFA',     // violet
    cloud: '#F472B6',          // pink
    iam: '#FB923C',            // orange
    credential: '#FACC15',     // yellow
    vulnerability: '#E53935',  // red
    network: '#2DD4BF',        // teal
    database: '#60A5FA',       // blue
    'critical-asset': '#FF4D5A', // attack-red
  };
  return map[type] ?? '#94A3B8';
}

// ─── Utility: Format currency ────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}
