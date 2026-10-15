# AttackTwin AI — Cinematic Interactive Cybersecurity Presentation

> **Predict. Explain. Break the Path.**  
> *"One suspicious event may appear harmless. Connect the evidence, and an entire attack chain may emerge."*

---

## 🛡️ Project Overview

**AttackTwin AI** is a scroll-driven, full-screen technical cybersecurity storytelling experience and security digital twin presentation. Designed to bridge the gap between disconnected telemetry logs and defensible incident response, it guides technical judges, CISOs, and security teams through a developing cyberattack scenario.

### Core Value Proposition
1. **Connect Disconnected Signals:** Correlates disparate low-signal alerts (GitHub PATs, AWS STS sessions, Vault secret reads, DNS queries) into a unified attack graph.
2. **Predict Adversary Progression:** Leverages graph topological scoring, Bayesian confidence updates, and Markov transition models to anticipate attacker objectives before critical data exfiltration occurs.
3. **Automate Ownership & Escalation:** Eliminates incident queue paralysis with SLA-driven ownership timers and verified resolution workflows.
4. **Defensible Minimum-Cost Cuts:** Formulates remediation as a mathematical minimum-cut optimization problem, finding the cheapest combination of defensive interventions that severs all attack paths within budget.

---

## 🎬 12-Chapter Presentation Architecture

| Chapter | Title | Focus & Core Interaction |
|---|---|---|
| **01** | **Opening** | 3D WebGL dark-red particle network simulation with mouse parallax, brand reveal, and scroll indicator. |
| **02** | **The Problem** | 5 isolated security alert cards (Identity, GitHub, Secrets, Cloud, DB). Click to inspect evidence vs legitimate explanations. |
| **03** | **Connect the Dots** | Animated convergence from scattered cards into a connected attack chain with particle pulse animations along edges. |
| **04** | **The Digital Twin** | Full interactive enterprise knowledge graph (identities, cloud roles, databases, repos). Node inspection and legend. |
| **05** | **Intelligence Engine** | Interactive modules for Graph Neural Networks (GNN), Bayesian Inference & MCMC distributions, and Markov transitions. |
| **06** | **Technical Workflow** | 12-stage sequential architecture pipeline with dual parallel branching (Alerting vs Remediation) and deep telemetry drawer. |
| **07** | **Intelligent Alerting** | Incident Command Center (AT-001) with live SLA countdown timers, escalation ladder, responder assignment, and verification modal. |
| **08** | **Remediation Optimizer** | Interactive budget slider ($20k–$350k), 4 candidate actions, exhaustive $2^4 = 16$ combination matrix, before/after graph view. |
| **09** | **USP & Innovation** | 5 surrounding innovation pillars with dynamic central graph node highlighting and objective industry differentiation. |
| **10** | **Technology Stack** | Layered technology architecture with strict audit between live prototype libraries and proposed enterprise backends. |
| **11** | **Business Research** | Recharts bar charts comparing IBM India 2026 data breach costs across AI adoption tiers, competitor matrix, and customer personas. |
| **12** | **Live Guided Demo & Conclusion** | Reproducible 6-step guided walkthrough, 7-event replay, min-cut solver execution, and grand cinematic typography climax. |

---

## 🔬 Implemented vs Proposed Capabilities

To maintain technical honesty and academic rigor, capabilities are strictly partitioned:

### ✅ Implemented in Active Prototype (Compiled in Browser)
- **Deterministic Scenario Simulation:** 7-event multi-source incident scenario (`evt-001` to `evt-007`) based on real enterprise telemetry.
- **In-Browser Graph Visualization:** Hardware-accelerated ReactFlow network canvas with custom node types, status indicators, and attack path animations.
- **WebGL 3D Environment:** React Three Fiber + Three.js dynamic particle network with additive blending and mouse raycaster attraction.
- **Mathematical Combinatorial Solver:** Exhaustive $2^n$ evaluation engine evaluating all 16 remediation subsets to find the minimum-cost edge/vertex cut under budget.
- **SLA Escalation State Machine:** Deterministic countdown timer, automatic escalation chain bump, and verified closure modal.
- **Full Navigation System:** Keyboard navigation (`←` `→` `Home` `End` `F` `Esc`), slide-out drawer menu, and top progress bar.

### 📋 Proposed Full-Scale Enterprise Backend
- **Distributed Ingestion:** Apache Kafka (3-broker cluster) and Apache Flink for real-time sliding-window baseline anomaly detection.
- **Graph Database:** Neo4j Aura Enterprise with Graph Data Science (GDS) for PageRank and Cypher path traversal at enterprise scale.
- **Deep GNN Inference:** PyTorch Geometric (PyG) for relational graph convolutional network (R-GCN) node embedding.
- **Bayesian Posterior Sampling:** PyMC / Stan probabilistic programming engines for MCMC sampling on high-dimensional hypothesis spaces.
- **Large-Scale Solver:** Google OR-Tools Integer Linear Programming (ILP) and Rust WASM solver for action catalogs exceeding 30 items.
- **Durable Orchestration:** Temporal workflows for fault-tolerant cron timers and authenticated enterprise Webhooks (Slack Bolt, PagerDuty Events v2).

---

## 🧮 Mathematical Optimization Model

The remediation solver models security intervention as a **Minimum-Weight Cut Problem**:

Given an attack graph $G = (V, E)$, a set of entry nodes $S \subset V$, a set of critical assets $T \subset V$, and candidate defensive actions $A = \{a_1, a_2, \dots, a_n\}$ where each action $a_i$ has cost $c(a_i) > 0$ and severs a subset of edges $E(a_i) \subset E$:

$$\min \sum_{a_i \in A^*} c(a_i) \quad \text{subject to} \quad \text{Path}(S, T, G \setminus E(A^*)) = \emptyset \quad \text{and} \quad \sum_{a_i \in A^*} c(a_i) \le B$$

For the 4 predefined interventions in the scenario ($n = 4$), the system evaluates all $2^4 = 16$ possible subsets in under 1 millisecond, guaranteeing optimal global cut selection without heuristic approximations.

---

## 💻 Tech Stack & Dependencies

- **Framework:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), CSS Custom Variables
- **Animations:** GSAP 3.12, ScrollTrigger, Framer Motion
- **3D Graphics:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Graph Engine:** ReactFlow
- **Charts:** Recharts
- **Icons:** Lucide React

---

## 🚀 Getting Started & Deployment

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Development Mode
```bash
# Clone or navigate to the directory
cd PPTT

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

### 3. Production Build
```bash
# Typecheck and compile optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The production output is generated in `/dist` with full code-splitting and asset minification, ready for deployment to Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront.

---

## ⌨️ Presentation Keyboard Shortcuts

- `→` / `↓` : Next Chapter
- `←` / `↑` : Previous Chapter
- `Home` : Jump to Opening (Chapter 01)
- `End` : Jump to Live Demo & Conclusion (Chapter 12)
- `F` : Toggle Fullscreen presentation mode
- `Esc` : Close chapter selector drawer or modals

---

## 📄 License & Attribution

Research citations:
- *IBM Cost of a Data Breach Report (2025/2026 India Enterprise Cohort)*
- *MITRE ATT&CK Framework v15*
- *Microsoft STRIDE Threat Classification*
- *NIST National Vulnerability Database (NVD) & FIRST CVSS v3.1*
