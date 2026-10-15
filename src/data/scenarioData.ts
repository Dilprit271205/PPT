import type {
  ChapterConfig,
  SecurityEvent,
  GraphNode,
  GraphEdge,
  AttackPath,
  Incident,
  EscalationPolicy,
  RemediationAction,
  WorkflowStage,
  TechItem,
  USPPillar,
  BreachCostData,
  Competitor,
  ThreatIntelSource,
} from '../types';

// ─── Chapters ─────────────────────────────────────────────────────────────────

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 'opening',
    number: 1,
    title: 'The Invisible Threat',
    subtitle: 'Why Traditional Security Fails',
    headline:
      'Every 11 seconds a new cyberattack begins—and your SIEM still thinks everything is fine.',
  },
  {
    id: 'market-context',
    number: 2,
    title: 'The $2.18 M Wake-Up Call',
    subtitle: "India\'s Breach Landscape in 2026",
    headline:
      'Indian enterprises lost ₹19.5 Cr per breach in 2025. AttackTwin exists to shrink that number.',
  },
  {
    id: 'attack-begins',
    number: 3,
    title: 'Attack Begins',
    subtitle: 'An Insider Goes Rogue',
    headline:
      'Meet Priya Sharma—Senior DevOps Engineer, trusted insider, and your next breach vector.',
  },
  {
    id: 'identity-graph',
    number: 4,
    title: 'The Identity Graph',
    subtitle: 'Mapping the Blast Radius',
    headline:
      'One credential. Forty-two connections. A live graph reveals what flat logs never can.',
  },
  {
    id: 'attack-path',
    number: 5,
    title: 'Attack Path Analysis',
    subtitle: 'From Credential to Crown Jewel',
    headline:
      'AttackTwin traces the five-hop path from a leaked PAT to your production database.',
  },
  {
    id: 'ai-correlation',
    number: 6,
    title: 'AI Correlation Engine',
    subtitle: 'Seven Signals, One Story',
    headline:
      'Seven alerts across four tools—individually benign, collectively devastating.',
  },
  {
    id: 'incident-response',
    number: 7,
    title: 'Incident Response',
    subtitle: 'Automated Triage & Escalation',
    headline:
      'From detection to Slack alert in 12 seconds. From Slack alert to JIRA ticket in 3.',
  },
  {
    id: 'remediation',
    number: 8,
    title: 'Optimal Remediation',
    subtitle: 'Graph-Theoretic Defense',
    headline:
      'Four actions, $340 K budget, one minimum-cost vertex cut that severs every attack path.',
  },
  {
    id: 'architecture',
    number: 9,
    title: 'Under the Hood',
    subtitle: 'Architecture & Data Pipeline',
    headline:
      'Twelve stages from raw log ingestion to executive dashboard—every byte accounted for.',
  },
  {
    id: 'competitive',
    number: 10,
    title: 'Why AttackTwin',
    subtitle: 'Competitive Differentiation',
    headline:
      'Where others detect, we predict. Where others alert, we prescribe.',
  },
  {
    id: 'tech-stack',
    number: 11,
    title: 'Technology Deep Dive',
    subtitle: 'The Stack That Powers It All',
    headline:
      'Neo4j graphs, LangGraph agents, Kafka streams, and a Rust-accelerated correlation engine.',
  },
  {
    id: 'closing',
    number: 12,
    title: 'The Future of Defense',
    subtitle: 'From Reactive to Predictive',
    headline:
      'Stop chasing alerts. Start predicting breaches. AttackTwin — your AI-powered digital twin for cybersecurity.',
  },
];

// ─── Security Events ──────────────────────────────────────────────────────────

export const SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'evt-001',
    time: '2026-03-15T02:14:33Z',
    source: 'GitHub Audit Log',
    sourceIcon: '🔑',
    title: 'Personal Access Token Created',
    description:
      'A new fine-grained PAT with repo, admin:org, and write:packages scopes was created for identity priya.sharma@acmecorp.in from IP 49.36.128.77 (Mumbai residential ISP).',
    severity: 'medium',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'github.com/acmecorp',
    evidence: [
      'PAT scopes include admin:org — unusual for DevOps role',
      'Created at 02:14 IST — outside normal working hours (09:00–19:00)',
      'Source IP 49.36.128.77 resolves to Jio residential broadband, not corporate VPN',
    ],
    legitimateExplanation:
      'DevOps engineers occasionally create PATs for CI/CD pipeline maintenance during off-hours deployment windows.',
    suspiciousIndicators: [
      'admin:org scope not required for any known CI/CD pipeline',
      'No change-request ticket in ServiceNow for this token creation',
      'IP geo-location mismatch: user\'s registered home address is Pune, IP geolocates to Mumbai',
    ],
  },
  {
    id: 'evt-002',
    time: '2026-03-15T02:31:07Z',
    source: 'AWS CloudTrail',
    sourceIcon: '☁️',
    title: 'Unusual S3 Enumeration',
    description:
      'Role arn:aws:iam::112233445566:role/DevOps-Deploy executed ListBuckets followed by GetBucketPolicy on 14 buckets within 90 seconds, including restricted data-lake and backup buckets.',
    severity: 'high',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'AWS S3 (14 buckets)',
    evidence: [
      'ListBuckets + GetBucketPolicy on 14 buckets in 90 seconds',
      'Includes acmecorp-data-lake-prod and acmecorp-db-backups — neither in DevOps scope',
      'API calls originate from IP 49.36.128.77 — same residential IP as evt-001',
    ],
    legitimateExplanation:
      'Quarterly infrastructure audit scripts sometimes enumerate buckets, but these run from Jenkins (IP 10.0.4.50), not personal IPs.',
    suspiciousIndicators: [
      'Accessed 6 buckets outside DevOps team boundary',
      'Sequential enumeration pattern consistent with recon tooling (e.g., Pacu, ScoutSuite)',
      'No corresponding Jenkins job execution in the time window',
    ],
  },
  {
    id: 'evt-003',
    time: '2026-03-15T02:47:22Z',
    source: 'Vault Audit Log',
    sourceIcon: '🔐',
    title: 'Secrets Engine Lateral Access',
    description:
      'Identity priya.sharma accessed Vault secret paths secret/prod/database/master and secret/prod/api-keys/stripe-live, reading 3 production secrets in a single session.',
    severity: 'critical',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'HashiCorp Vault – prod secrets engine',
    evidence: [
      'Read secret/prod/database/master — PostgreSQL root credentials',
      'Read secret/prod/api-keys/stripe-live — Stripe live API key',
      'Read secret/prod/api-keys/sendgrid — SendGrid production key',
      'All three reads within 47 seconds — automated retrieval pattern',
    ],
    legitimateExplanation:
      'Priya has a valid Vault policy (devops-prod-read) granting read access to these paths for deployment rotation.',
    suspiciousIndicators: [
      'Secrets were read but no deployment or rotation job was triggered',
      'Three unrelated secret paths accessed together — no single service requires all three',
      'Access at 02:47 IST with no on-call incident in PagerDuty',
    ],
  },
  {
    id: 'evt-004',
    time: '2026-03-15T03:05:18Z',
    source: 'GitHub Audit Log',
    sourceIcon: '📦',
    title: 'Private Repository Clone',
    description:
      'Repository acmecorp/payment-service (private, PCI-DSS scope) cloned via HTTPS using the PAT created in evt-001. Clone size 247 MB.',
    severity: 'critical',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'acmecorp/payment-service',
    evidence: [
      'Repository is in PCI-DSS compliance scope — clone triggers audit requirement',
      'Clone performed from IP 49.36.128.77 — same residential IP',
      'PAT used matches token created in evt-001 (token fingerprint: gh_pat_a1b2c3)',
      'Full clone (247 MB) — not a shallow fetch for CI/CD',
    ],
    legitimateExplanation:
      'Priya contributes to payment-service but typically pushes via SSH from her corporate laptop (IP 10.0.1.34).',
    suspiciousIndicators: [
      'Full clone rather than shallow fetch — indicates intent to retain complete history',
      'HTTPS + PAT instead of SSH key — avoids corporate device attestation',
      'No pull request, branch, or commit followed the clone within 24 hours',
    ],
  },
  {
    id: 'evt-005',
    time: '2026-03-15T03:22:41Z',
    source: 'AWS CloudTrail',
    sourceIcon: '🗄️',
    title: 'Production Database Snapshot Export',
    description:
      'RDS snapshot rds:acmecorp-prod-pg-2026-03-15 was created and an export task to S3 bucket acmecorp-db-backups was initiated using credentials retrieved in evt-003.',
    severity: 'critical',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'RDS acmecorp-prod-pg (PostgreSQL 15)',
    evidence: [
      'CreateDBSnapshot API call from assumed role DevOps-Deploy',
      'StartExportTask targeting s3://acmecorp-db-backups/exports/manual/',
      'Snapshot contains 12.4 GB of customer PII and payment data',
      'Export KMS key is the default aws/rds key, not the compliance team\'s CMK',
    ],
    legitimateExplanation:
      'Monthly backup verification involves snapshot creation, but is performed by the DBA team using the shared DBA role, not DevOps-Deploy.',
    suspiciousIndicators: [
      'DevOps-Deploy role should not create production snapshots — separation of duties violation',
      'Export path "manual/" does not match automated backup paths',
      'No corresponding change request or DBA ticket',
      'Used default KMS key instead of compliance-mandated CMK',
    ],
  },
  {
    id: 'evt-006',
    time: '2026-03-15T03:38:55Z',
    source: 'DNS / Network Logs',
    sourceIcon: '🌐',
    title: 'Anomalous DNS TXT Queries',
    description:
      'Burst of 142 DNS TXT queries to subdomains of c2-relay.darkops[.]xyz originating from IP 49.36.128.77 over 8 minutes. Encoded payload fragments detected.',
    severity: 'high',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'Corporate DNS resolver / Network egress',
    evidence: [
      '142 TXT queries in 8 minutes — consistent with DNS tunneling exfiltration',
      'Domain c2-relay.darkops[.]xyz registered 4 days prior via Njalla (privacy registrar)',
      'TXT record values are Base64-encoded, average 220 chars per record',
      'Total estimated exfiltrated data: ~31 KB (likely credentials or key material)',
    ],
    legitimateExplanation:
      'No legitimate business use for TXT queries to unregistered external domains at this frequency.',
    suspiciousIndicators: [
      'Domain age < 7 days — high indicator of malicious infrastructure',
      'Njalla registrar commonly used by threat actors for anonymity',
      'Query pattern matches known DNS exfil tools (dnscat2, iodine)',
      'Payload size consistent with exfiltrating the credentials and API keys from evt-003',
    ],
  },
  {
    id: 'evt-007',
    time: '2026-03-15T03:51:09Z',
    source: 'AWS CloudTrail',
    sourceIcon: '🚪',
    title: 'IAM Persistence Backdoor Attempted',
    description:
      'CreateAccessKey API call for IAM user svc-backup-readonly, and AttachUserPolicy call adding AdministratorAccess. Both API calls from the same session as prior events.',
    severity: 'critical',
    identity: 'priya.sharma@acmecorp.in',
    affectedAsset: 'AWS IAM – svc-backup-readonly',
    evidence: [
      'CreateAccessKey on svc-backup-readonly — service account with no prior access keys',
      'AttachUserPolicy adding arn:aws:iam::aws:policy/AdministratorAccess',
      'Session traces back to same AssumedRole session as evt-002 and evt-005',
      'svc-backup-readonly now has full admin access — complete privilege escalation',
    ],
    legitimateExplanation:
      'No legitimate reason for a DevOps engineer to modify service account policies outside a change window.',
    suspiciousIndicators: [
      'Privilege escalation: read-only service account → AdministratorAccess',
      'Persistence technique: new access key provides long-lived credential independent of SSO',
      'MITRE ATT&CK T1098.001 — Account Manipulation: Additional Cloud Credentials',
      'If undetected, attacker retains access even after Priya\'s SSO credentials are revoked',
    ],
  },
];

// ─── Attack Graph: Nodes ──────────────────────────────────────────────────────

export const ATTACK_GRAPH_NODES: GraphNode[] = [
  // Identities
  {
    id: 'priya-sharma',
    label: 'Priya Sharma',
    type: 'identity',
    risk: 95,
    compromised: true,
    properties: {
      role: 'Senior DevOps Engineer',
      department: 'Platform Engineering',
      clearance: 'Level 3',
      email: 'priya.sharma@acmecorp.in',
    },
  },
  {
    id: 'rahul-verma',
    label: 'Rahul Verma',
    type: 'identity',
    risk: 15,
    properties: {
      role: 'Engineering Manager',
      department: 'Platform Engineering',
      clearance: 'Level 4',
    },
  },
  {
    id: 'anita-desai',
    label: 'Anita Desai',
    type: 'identity',
    risk: 10,
    properties: {
      role: 'DBA Lead',
      department: 'Data Engineering',
      clearance: 'Level 4',
    },
  },
  {
    id: 'svc-jenkins',
    label: 'svc-jenkins',
    type: 'identity',
    risk: 55,
    properties: { type: 'Service Account', system: 'Jenkins CI' },
  },
  {
    id: 'svc-backup',
    label: 'svc-backup-readonly',
    type: 'identity',
    risk: 90,
    compromised: true,
    properties: { type: 'Service Account', system: 'AWS Backup' },
  },

  // Credentials
  {
    id: 'pat-github',
    label: 'GitHub PAT (gh_pat_a1b2c3)',
    type: 'credential',
    risk: 95,
    compromised: true,
    properties: {
      scopes: 'repo, admin:org, write:packages',
      created: '2026-03-15T02:14:33Z',
    },
  },
  {
    id: 'vault-token',
    label: 'Vault Token (hvs.xxxx)',
    type: 'credential',
    risk: 90,
    compromised: true,
    properties: { policy: 'devops-prod-read', ttl: '768h' },
  },
  {
    id: 'aws-session',
    label: 'AWS Session (DevOps-Deploy)',
    type: 'credential',
    risk: 85,
    compromised: true,
    properties: {
      role: 'DevOps-Deploy',
      arn: 'arn:aws:iam::112233445566:role/DevOps-Deploy',
    },
  },
  {
    id: 'db-master-cred',
    label: 'DB Master Credential',
    type: 'credential',
    risk: 100,
    compromised: true,
    properties: { engine: 'PostgreSQL 15', scope: 'production' },
  },
  {
    id: 'stripe-key',
    label: 'Stripe Live API Key',
    type: 'credential',
    risk: 90,
    compromised: true,
    properties: { scope: 'live', permissions: 'full' },
  },
  {
    id: 'backdoor-key',
    label: 'Backdoor Access Key',
    type: 'credential',
    risk: 100,
    compromised: true,
    properties: { user: 'svc-backup-readonly', policy: 'AdministratorAccess' },
  },

  // Devices
  {
    id: 'personal-laptop',
    label: 'Personal Laptop (49.36.128.77)',
    type: 'device',
    risk: 90,
    compromised: true,
    properties: { ip: '49.36.128.77', isp: 'Jio Residential', location: 'Mumbai' },
  },
  {
    id: 'corp-laptop',
    label: 'Corporate Laptop (10.0.1.34)',
    type: 'device',
    risk: 20,
    properties: { ip: '10.0.1.34', managed: 'true', mdm: 'Intune' },
  },
  {
    id: 'jenkins-server',
    label: 'Jenkins CI Server',
    type: 'device',
    risk: 40,
    properties: { ip: '10.0.4.50', os: 'Ubuntu 22.04', version: 'Jenkins 2.426' },
  },

  // Applications
  {
    id: 'github-org',
    label: 'GitHub Org (acmecorp)',
    type: 'application',
    risk: 70,
    compromised: true,
    properties: { plan: 'Enterprise', repos: '347', members: '89' },
  },
  {
    id: 'vault-prod',
    label: 'HashiCorp Vault (prod)',
    type: 'application',
    risk: 80,
    compromised: true,
    properties: { version: '1.15.4', engine: 'KV v2' },
  },
  {
    id: 'jira-instance',
    label: 'Jira Cloud',
    type: 'application',
    risk: 10,
    properties: { instance: 'acmecorp.atlassian.net' },
  },
  {
    id: 'slack-workspace',
    label: 'Slack Workspace',
    type: 'application',
    risk: 10,
    properties: { workspace: 'acmecorp.slack.com' },
  },
  {
    id: 'pagerduty',
    label: 'PagerDuty',
    type: 'application',
    risk: 10,
    properties: { service: 'Platform Engineering' },
  },

  // Repositories
  {
    id: 'repo-payment',
    label: 'acmecorp/payment-service',
    type: 'repository',
    risk: 85,
    compromised: true,
    properties: {
      visibility: 'private',
      compliance: 'PCI-DSS',
      language: 'Go',
      size: '247 MB',
    },
  },
  {
    id: 'repo-infra',
    label: 'acmecorp/infra-terraform',
    type: 'repository',
    risk: 60,
    properties: { visibility: 'private', language: 'HCL' },
  },
  {
    id: 'repo-api',
    label: 'acmecorp/api-gateway',
    type: 'repository',
    risk: 50,
    properties: { visibility: 'private', language: 'TypeScript' },
  },

  // Cloud Resources
  {
    id: 'aws-account',
    label: 'AWS Account (112233445566)',
    type: 'cloud',
    risk: 60,
    properties: { alias: 'acmecorp-prod', region: 'ap-south-1' },
  },
  {
    id: 's3-data-lake',
    label: 'S3: acmecorp-data-lake-prod',
    type: 'cloud',
    risk: 75,
    compromised: true,
    properties: { encryption: 'SSE-S3', versioning: 'enabled', size: '2.3 TB' },
  },
  {
    id: 's3-backups',
    label: 'S3: acmecorp-db-backups',
    type: 'cloud',
    risk: 80,
    compromised: true,
    properties: { encryption: 'SSE-KMS', size: '890 GB' },
  },

  // IAM
  {
    id: 'iam-devops-role',
    label: 'IAM Role: DevOps-Deploy',
    type: 'iam',
    risk: 75,
    compromised: true,
    properties: {
      policies: 'S3FullAccess, EC2FullAccess, RDSFullAccess',
      trustPolicy: 'SSO + AssumeRole',
    },
  },
  {
    id: 'iam-admin-policy',
    label: 'Policy: AdministratorAccess',
    type: 'iam',
    risk: 100,
    compromised: true,
    properties: { effect: 'Allow', action: '*', resource: '*' },
  },

  // Database
  {
    id: 'rds-prod',
    label: 'RDS: acmecorp-prod-pg',
    type: 'database',
    risk: 95,
    compromised: true,
    properties: {
      engine: 'PostgreSQL 15.4',
      storage: '500 GB',
      data: 'Customer PII + Payment Records',
      records: '4.2M customers',
    },
  },

  // Network
  {
    id: 'c2-domain',
    label: 'c2-relay.darkops[.]xyz',
    type: 'network',
    risk: 100,
    compromised: true,
    properties: {
      registrar: 'Njalla',
      age: '4 days',
      protocol: 'DNS TXT tunneling',
    },
  },
  {
    id: 'corp-vpn',
    label: 'Corporate VPN Gateway',
    type: 'network',
    risk: 15,
    properties: { provider: 'Zscaler ZPA', ip: '203.0.113.10' },
  },
  {
    id: 'dns-resolver',
    label: 'Corporate DNS Resolver',
    type: 'network',
    risk: 45,
    properties: { provider: 'Infoblox', ip: '10.0.0.53' },
  },

  // Critical Assets
  {
    id: 'customer-pii',
    label: 'Customer PII Dataset',
    type: 'critical-asset',
    risk: 100,
    compromised: true,
    properties: { records: '4.2M', types: 'Name, Email, Phone, Aadhaar, PAN' },
  },
  {
    id: 'payment-data',
    label: 'Payment Processing Data',
    type: 'critical-asset',
    risk: 100,
    compromised: true,
    properties: { records: '12.8M transactions', compliance: 'PCI-DSS Level 1' },
  },

  // Vulnerability
  {
    id: 'vuln-overperm',
    label: 'Over-Permissioned IAM Role',
    type: 'vulnerability',
    risk: 85,
    properties: { cwe: 'CWE-250', description: 'DevOps-Deploy has RDSFullAccess' },
  },
  {
    id: 'vuln-no-mfa',
    label: 'No MFA on PAT Creation',
    type: 'vulnerability',
    risk: 70,
    properties: { cwe: 'CWE-308', description: 'GitHub PAT creation lacks MFA step-up' },
  },
];

// ─── Attack Graph: Edges ──────────────────────────────────────────────────────

export const ATTACK_GRAPH_EDGES: GraphEdge[] = [
  // Identity → Credential
  {
    id: 'e-priya-pat',
    source: 'priya-sharma',
    target: 'pat-github',
    type: 'credential',
    label: 'Created PAT',
    isAttackPath: true,
    evidence: 'evt-001',
  },
  {
    id: 'e-priya-vault',
    source: 'priya-sharma',
    target: 'vault-token',
    type: 'credential',
    label: 'Authenticated',
    isAttackPath: true,
    evidence: 'evt-003',
  },
  {
    id: 'e-priya-aws',
    source: 'priya-sharma',
    target: 'aws-session',
    type: 'credential',
    label: 'Assumed Role',
    isAttackPath: true,
    evidence: 'evt-002',
  },

  // Identity → Device
  {
    id: 'e-priya-personal',
    source: 'priya-sharma',
    target: 'personal-laptop',
    type: 'ownership',
    label: 'Used personal device',
    isAttackPath: true,
  },
  {
    id: 'e-priya-corp',
    source: 'priya-sharma',
    target: 'corp-laptop',
    type: 'ownership',
    label: 'Assigned device',
  },
  {
    id: 'e-rahul-corp',
    source: 'rahul-verma',
    target: 'corp-laptop',
    type: 'ownership',
    label: 'Manager oversight',
  },

  // Credential → Application
  {
    id: 'e-pat-github',
    source: 'pat-github',
    target: 'github-org',
    type: 'access',
    label: 'repo + admin:org',
    isAttackPath: true,
    evidence: 'evt-001',
  },
  {
    id: 'e-vault-token-vault',
    source: 'vault-token',
    target: 'vault-prod',
    type: 'access',
    label: 'devops-prod-read',
    isAttackPath: true,
    evidence: 'evt-003',
  },
  {
    id: 'e-aws-session-account',
    source: 'aws-session',
    target: 'aws-account',
    type: 'access',
    label: 'DevOps-Deploy role',
    isAttackPath: true,
    evidence: 'evt-002',
  },

  // Application → Repository
  {
    id: 'e-github-payment',
    source: 'github-org',
    target: 'repo-payment',
    type: 'access',
    label: 'Clone access',
    isAttackPath: true,
    evidence: 'evt-004',
  },
  {
    id: 'e-github-infra',
    source: 'github-org',
    target: 'repo-infra',
    type: 'access',
    label: 'Clone access',
  },
  {
    id: 'e-github-api',
    source: 'github-org',
    target: 'repo-api',
    type: 'access',
    label: 'Clone access',
  },

  // Application → Credential (vault secrets)
  {
    id: 'e-vault-dbcred',
    source: 'vault-prod',
    target: 'db-master-cred',
    type: 'credential',
    label: 'secret/prod/database/master',
    isAttackPath: true,
    evidence: 'evt-003',
  },
  {
    id: 'e-vault-stripe',
    source: 'vault-prod',
    target: 'stripe-key',
    type: 'credential',
    label: 'secret/prod/api-keys/stripe-live',
    isAttackPath: true,
    evidence: 'evt-003',
  },

  // Cloud → Cloud Resources
  {
    id: 'e-aws-s3lake',
    source: 'aws-account',
    target: 's3-data-lake',
    type: 'access',
    label: 'S3 access',
    isAttackPath: true,
    evidence: 'evt-002',
  },
  {
    id: 'e-aws-s3backups',
    source: 'aws-account',
    target: 's3-backups',
    type: 'access',
    label: 'S3 access',
    isAttackPath: true,
    evidence: 'evt-005',
  },
  {
    id: 'e-aws-iam-role',
    source: 'aws-account',
    target: 'iam-devops-role',
    type: 'permission',
    label: 'Role binding',
    isAttackPath: true,
  },

  // IAM → Database
  {
    id: 'e-iam-rds',
    source: 'iam-devops-role',
    target: 'rds-prod',
    type: 'permission',
    label: 'RDSFullAccess',
    isAttackPath: true,
    evidence: 'evt-005',
  },

  // Credential → Database
  {
    id: 'e-dbcred-rds',
    source: 'db-master-cred',
    target: 'rds-prod',
    type: 'credential',
    label: 'Master login',
    isAttackPath: true,
  },

  // Database → Critical Assets
  {
    id: 'e-rds-pii',
    source: 'rds-prod',
    target: 'customer-pii',
    type: 'access',
    label: 'Contains',
    isAttackPath: true,
  },
  {
    id: 'e-rds-payments',
    source: 'rds-prod',
    target: 'payment-data',
    type: 'access',
    label: 'Contains',
    isAttackPath: true,
  },

  // Network (C2 exfiltration)
  {
    id: 'e-personal-dns',
    source: 'personal-laptop',
    target: 'dns-resolver',
    type: 'network',
    label: 'DNS queries',
    isAttackPath: true,
    evidence: 'evt-006',
  },
  {
    id: 'e-dns-c2',
    source: 'dns-resolver',
    target: 'c2-domain',
    type: 'network',
    label: 'DNS TXT tunneling',
    isAttackPath: true,
    evidence: 'evt-006',
  },

  // Backdoor persistence
  {
    id: 'e-svcbackup-backdoor',
    source: 'svc-backup',
    target: 'backdoor-key',
    type: 'credential',
    label: 'CreateAccessKey',
    isAttackPath: true,
    evidence: 'evt-007',
  },
  {
    id: 'e-backdoor-admin',
    source: 'backdoor-key',
    target: 'iam-admin-policy',
    type: 'permission',
    label: 'AdministratorAccess',
    isAttackPath: true,
    evidence: 'evt-007',
  },
  {
    id: 'e-admin-aws',
    source: 'iam-admin-policy',
    target: 'aws-account',
    type: 'permission',
    label: 'Full account access',
    isAttackPath: true,
  },

  // Vulnerability links
  {
    id: 'e-vuln-iam',
    source: 'vuln-overperm',
    target: 'iam-devops-role',
    type: 'access',
    label: 'Exploitable weakness',
  },
  {
    id: 'e-vuln-nomfa',
    source: 'vuln-no-mfa',
    target: 'pat-github',
    type: 'access',
    label: 'Exploitable weakness',
  },

  // Jenkins service account
  {
    id: 'e-jenkins-github',
    source: 'svc-jenkins',
    target: 'github-org',
    type: 'access',
    label: 'CI/CD integration',
  },
  {
    id: 'e-jenkins-server',
    source: 'svc-jenkins',
    target: 'jenkins-server',
    type: 'ownership',
    label: 'Runs on',
  },
  {
    id: 'e-jenkins-aws',
    source: 'svc-jenkins',
    target: 'aws-account',
    type: 'access',
    label: 'Deploy access',
  },

  // S3 → RDS export
  {
    id: 'e-rds-s3export',
    source: 'rds-prod',
    target: 's3-backups',
    type: 'access',
    label: 'Snapshot export',
    isAttackPath: true,
    evidence: 'evt-005',
  },

  // Corporate VPN
  {
    id: 'e-corp-vpn',
    source: 'corp-laptop',
    target: 'corp-vpn',
    type: 'network',
    label: 'VPN tunnel',
  },

  // Anita → DBA access
  {
    id: 'e-anita-rds',
    source: 'anita-desai',
    target: 'rds-prod',
    type: 'access',
    label: 'DBA access',
  },
  {
    id: 'e-anita-vault',
    source: 'anita-desai',
    target: 'vault-prod',
    type: 'access',
    label: 'DBA Vault policy',
  },

  // Manager → reporting chain
  {
    id: 'e-rahul-priya',
    source: 'rahul-verma',
    target: 'priya-sharma',
    type: 'ownership',
    label: 'Direct report',
  },
];

// ─── Primary Attack Path ──────────────────────────────────────────────────────

export const ATTACK_PATH: AttackPath = {
  id: 'ap-insider-data-exfil',
  probability: 0.94,
  severity: 'critical',
  steps: [
    {
      nodeId: 'priya-sharma',
      action: 'Insider initiates attack from personal device',
      technique: 'T1078 — Valid Accounts',
      mitreTactic: 'Initial Access',
      timestamp: '2026-03-15T02:14:33Z',
    },
    {
      nodeId: 'pat-github',
      action: 'Creates over-scoped GitHub PAT with admin:org',
      technique: 'T1098.001 — Additional Cloud Credentials',
      mitreTactic: 'Persistence',
      timestamp: '2026-03-15T02:14:33Z',
    },
    {
      nodeId: 'aws-session',
      action: 'Assumes DevOps-Deploy role, enumerates S3 buckets',
      technique: 'T1580 — Cloud Infrastructure Discovery',
      mitreTactic: 'Discovery',
      timestamp: '2026-03-15T02:31:07Z',
    },
    {
      nodeId: 'vault-prod',
      action: 'Reads production secrets from Vault (DB creds, API keys)',
      technique: 'T1555 — Credentials from Password Stores',
      mitreTactic: 'Credential Access',
      timestamp: '2026-03-15T02:47:22Z',
    },
    {
      nodeId: 'repo-payment',
      action: 'Clones PCI-DSS scoped payment-service repository',
      technique: 'T1213.003 — Code Repositories',
      mitreTactic: 'Collection',
      timestamp: '2026-03-15T03:05:18Z',
    },
    {
      nodeId: 'rds-prod',
      action: 'Creates production DB snapshot and exports to S3',
      technique: 'T1530 — Data from Cloud Storage',
      mitreTactic: 'Collection',
      timestamp: '2026-03-15T03:22:41Z',
    },
    {
      nodeId: 'c2-domain',
      action: 'Exfiltrates credentials via DNS TXT tunneling to C2 domain',
      technique: 'T1048.003 — Exfiltration Over Alternative Protocol',
      mitreTactic: 'Exfiltration',
      timestamp: '2026-03-15T03:38:55Z',
    },
    {
      nodeId: 'svc-backup',
      action: 'Plants IAM backdoor with AdministratorAccess on service account',
      technique: 'T1098 — Account Manipulation',
      mitreTactic: 'Persistence',
      timestamp: '2026-03-15T03:51:09Z',
    },
  ],
};

// ─── Incident ─────────────────────────────────────────────────────────────────

export const INCIDENT_DATA: Incident = {
  id: 'AT-001',
  title: 'Insider Threat — Credential Theft & Data Exfiltration',
  description:
    'AttackTwin correlated 7 events across GitHub, AWS CloudTrail, HashiCorp Vault, and network DNS logs to identify a coordinated insider attack by Priya Sharma (Senior DevOps Engineer). The attack involved credential creation, secrets harvesting, source code theft, production database exfiltration, DNS-based data exfiltration, and IAM persistence backdoor creation — all within a 97-minute window.',
  severity: 'critical',
  status: 'new',
  assignedTeam: 'Security Operations Center',
  assignedPerson: 'Vikram Singh (SOC Lead)',
  affectedAsset: 'RDS: acmecorp-prod-pg, acmecorp/payment-service, HashiCorp Vault',
  evidence: [
    'evt-001: GitHub PAT with admin:org scope created at 02:14 IST from residential IP',
    'evt-002: S3 enumeration of 14 buckets including restricted ones at 02:31 IST',
    'evt-003: Production secrets (DB creds, Stripe key, SendGrid key) read at 02:47 IST',
    'evt-004: PCI-DSS payment-service repo cloned (247 MB) at 03:05 IST',
    'evt-005: Production RDS snapshot exported to S3 at 03:22 IST',
    'evt-006: DNS TXT tunneling exfiltration (142 queries to C2 domain) at 03:38 IST',
    'evt-007: IAM backdoor — AdministratorAccess attached to service account at 03:51 IST',
  ],
  attackLineage: [
    'priya-sharma → pat-github → github-org → repo-payment',
    'priya-sharma → aws-session → aws-account → s3-data-lake',
    'priya-sharma → vault-token → vault-prod → db-master-cred → rds-prod → customer-pii',
    'personal-laptop → dns-resolver → c2-domain',
    'svc-backup → backdoor-key → iam-admin-policy → aws-account',
  ],
  acknowledgementDeadline: 300,
  escalationDeadline: 900,
  recommendedActions: [
    'Immediately revoke GitHub PAT gh_pat_a1b2c3',
    'Disable svc-backup-readonly IAM user and delete new access key',
    'Rotate all Vault secrets in secret/prod/**',
    "Revoke Priya Sharma\'s SSO session and all AWS assumed-role sessions",
    'Block DNS queries to c2-relay.darkops[.]xyz at network perimeter',
    'Initiate forensic image of personal laptop (49.36.128.77) if legally feasible',
    'Notify PCI-DSS QSA of potential cardholder data exposure',
    'Engage legal team for insider threat investigation',
  ],
  history: [
    {
      time: '2026-03-15T03:51:15Z',
      action: 'Incident Created',
      actor: 'AttackTwin AI Engine',
      detail:
        'Correlated 7 events across 4 sources. Severity: Critical. Attack chain confidence: 94%.',
    },
    {
      time: '2026-03-15T03:51:18Z',
      action: 'Slack Alert Sent',
      actor: 'AttackTwin Notification Service',
      detail:
        'Posted to #security-incidents with full attack timeline and graph visualization link.',
    },
    {
      time: '2026-03-15T03:51:21Z',
      action: 'JIRA Ticket Created',
      actor: 'AttackTwin Jira Integration',
      detail: 'SEC-4217 created in Security Operations project with Critical priority.',
    },
    {
      time: '2026-03-15T03:51:24Z',
      action: 'PagerDuty Alert Triggered',
      actor: 'AttackTwin PagerDuty Integration',
      detail: 'P1 incident routed to SOC Lead Vikram Singh. Acknowledgement deadline: 5 minutes.',
    },
  ],
  createdAt: '2026-03-15T03:51:15Z',
};

// ─── Escalation Policies ──────────────────────────────────────────────────────

export const ESCALATION_POLICIES: EscalationPolicy[] = [
  {
    severity: 'critical',
    acknowledgementTarget: 5,
    escalationDeadline: 15,
    escalationChain: [
      'SOC Analyst (L1)',
      'SOC Lead (L2)',
      'CISO',
      'CTO',
      'CEO (Board notification)',
    ],
  },
  {
    severity: 'high',
    acknowledgementTarget: 15,
    escalationDeadline: 60,
    escalationChain: [
      'SOC Analyst (L1)',
      'SOC Lead (L2)',
      'Security Engineering Manager',
      'CISO',
    ],
  },
  {
    severity: 'medium',
    acknowledgementTarget: 60,
    escalationDeadline: 240,
    escalationChain: [
      'SOC Analyst (L1)',
      'SOC Lead (L2)',
      'Security Engineering Manager',
    ],
  },
];

// ─── Remediation Actions ──────────────────────────────────────────────────────

export const REMEDIATION_ACTIONS: RemediationAction[] = [
  {
    id: 'rem-001',
    title: 'Revoke & Rotate Compromised Credentials',
    description:
      'Immediately revoke the GitHub PAT (gh_pat_a1b2c3), delete the backdoor IAM access key on svc-backup-readonly, rotate all 3 Vault production secrets, and invalidate active AWS STS sessions for the DevOps-Deploy role.',
    cost: 15000,
    affectedEdges: [
      'e-priya-pat',
      'e-pat-github',
      'e-svcbackup-backdoor',
      'e-backdoor-admin',
      'e-vault-dbcred',
      'e-vault-stripe',
      'e-priya-aws',
    ],
    expectedEffect:
      'Severs initial access credential, persistence backdoor, and compromised secrets. Blocks 3 of 5 attack lineage chains immediately.',
    dependencies: [],
    explanation:
      'This is the highest-priority action. It eliminates the attacker\'s current access tokens and prevents the IAM backdoor from being used for re-entry. Cost is operational time for credential rotation and potential brief service disruption during secret rotation.',
    category: 'credential',
  },
  {
    id: 'rem-002',
    title: 'Enforce Least-Privilege IAM Policies',
    description:
      'Replace DevOps-Deploy role\'s broad policies (S3FullAccess, RDSFullAccess) with scoped policies limiting S3 access to deployment buckets only and removing RDS snapshot/export permissions entirely. Implement SCP guardrails to prevent AttachUserPolicy on service accounts.',
    cost: 85000,
    affectedEdges: ['e-iam-rds', 'e-aws-s3lake', 'e-aws-s3backups', 'e-aws-iam-role'],
    expectedEffect:
      'Blocks lateral movement from DevOps role to production database and restricts S3 enumeration to authorized buckets. Prevents future privilege escalation on service accounts.',
    dependencies: ['rem-001'],
    explanation:
      'The over-permissioned DevOps-Deploy role is the structural vulnerability that enabled this attack. Scoping it down is a one-time investment that eliminates an entire class of attack paths. Requires collaboration with the Platform Engineering team for policy testing.',
    category: 'access',
  },
  {
    id: 'rem-003',
    title: 'Enforce MFA Step-Up for Sensitive Operations',
    description:
      'Require MFA re-authentication for: GitHub PAT creation, Vault production secret reads, AWS IAM write operations (CreateAccessKey, AttachUserPolicy), and RDS snapshot creation. Implement via GitHub Advanced Security policies, Vault Sentinel policies, and AWS IAM condition keys.',
    cost: 120000,
    affectedEdges: [
      'e-priya-pat',
      'e-priya-vault',
      'e-svcbackup-backdoor',
      'e-iam-rds',
    ],
    expectedEffect:
      'Adds a strong authentication barrier at every critical juncture in the attack chain. Even with valid credentials, the attacker cannot execute sensitive operations without a second factor.',
    dependencies: [],
    explanation:
      'MFA step-up is the single most effective control against insider threats with valid credentials. It transforms a 1-factor attack into a 2-factor challenge at each step. Cost includes license upgrades, policy development, and user training.',
    category: 'authentication',
  },
  {
    id: 'rem-004',
    title: 'Deploy DNS Exfiltration Detection & Blocking',
    description:
      'Implement DNS inspection at the network perimeter using Infoblox Threat Intelligence with custom rules for: high-frequency TXT queries, newly registered domains (< 30 days), known privacy registrars, and Base64-encoded payloads in DNS responses. Block and alert on matches.',
    cost: 95000,
    affectedEdges: ['e-personal-dns', 'e-dns-c2'],
    expectedEffect:
      'Blocks the data exfiltration channel used in this attack (DNS TXT tunneling). Detects and prevents future attempts using DNS as a covert channel.',
    dependencies: [],
    explanation:
      'DNS exfiltration is a commonly overlooked channel that bypasses most DLP solutions. This investment closes the gap by inspecting DNS traffic for anomalous patterns. The Infoblox integration also provides threat intelligence on known malicious domains.',
    category: 'network',
  },
];

// ─── Architecture Workflow Stages ─────────────────────────────────────────────

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'stage-01',
    number: 1,
    title: 'Log Ingestion',
    purpose: 'Collect security-relevant logs and events from all enterprise sources in real-time.',
    inputs: [
      'AWS CloudTrail events',
      'GitHub Audit logs',
      'HashiCorp Vault audit logs',
      'Azure AD / Entra ID sign-in logs',
      'DNS query logs',
      'Network flow data',
    ],
    processing:
      'Apache Kafka brokers receive events via native connectors, Fluent Bit agents, and webhook receivers. Each source gets a dedicated topic with schema validation via Confluent Schema Registry (Avro).',
    outputs: [
      'Partitioned Kafka topics per source',
      'Schema-validated event stream',
      'Dead-letter queue for malformed events',
    ],
    technologies: ['Apache Kafka', 'Confluent Schema Registry', 'Fluent Bit', 'AWS EventBridge'],
    status: 'implemented',
    exampleData: '{"eventSource": "cloudtrail.amazonaws.com", "eventName": "ListBuckets", ...}',
  },
  {
    id: 'stage-02',
    number: 2,
    title: 'Schema Normalization',
    purpose: 'Transform heterogeneous log formats into a unified security event schema (OCSF).',
    inputs: ['Raw Kafka events from Stage 1'],
    processing:
      'Kafka Streams application applies source-specific transformers that map vendor schemas to the Open Cybersecurity Schema Framework (OCSF v1.1). Enriches events with geo-IP, ASN, and threat-intel context.',
    outputs: ['Normalized OCSF events on unified Kafka topic', 'Enrichment cache updates'],
    technologies: ['Kafka Streams', 'OCSF v1.1', 'MaxMind GeoIP2', 'Redis (enrichment cache)'],
    status: 'implemented',
  },
  {
    id: 'stage-03',
    number: 3,
    title: 'Identity Resolution',
    purpose: 'Resolve disparate identity references across sources to a canonical identity entity.',
    inputs: ['Normalized OCSF events', 'HR directory (BambooHR API)', 'IdP data (Okta / Entra)'],
    processing:
      'Identity resolution engine matches email addresses, usernames, employee IDs, and service principal names across sources. Maintains a persistent identity graph in Neo4j with merge-on-match semantics.',
    outputs: ['Canonical identity nodes in Neo4j', 'Identity-event linkage edges'],
    technologies: ['Neo4j', 'Python (identity resolver)', 'Okta API', 'BambooHR API'],
    status: 'implemented',
  },
  {
    id: 'stage-04',
    number: 4,
    title: 'Graph Construction',
    purpose: 'Build and maintain a live enterprise security knowledge graph.',
    inputs: ['Resolved identity events', 'Asset inventory (AWS Config)', 'IAM policy snapshots'],
    processing:
      'Graph builder service creates and updates nodes (identities, devices, applications, credentials, cloud resources) and edges (access, permission, ownership, network, temporal) in Neo4j. Computes risk scores via weighted PageRank.',
    outputs: [
      'Live security knowledge graph',
      'Risk-scored nodes',
      'Temporal edge history',
    ],
    technologies: ['Neo4j', 'Neo4j Graph Data Science', 'AWS Config', 'Cypher queries'],
    status: 'implemented',
  },
  {
    id: 'stage-05',
    number: 5,
    title: 'Behavioral Baseline',
    purpose: 'Establish normal behavior patterns for each identity and entity.',
    inputs: ['Historical OCSF events (90-day window)', 'Graph node properties'],
    processing:
      'Statistical models compute per-identity baselines for: access patterns, time-of-day distributions, source IP entropy, API call frequency, and data volume. Uses Isolation Forest for anomaly detection and HDBSCAN for behavioral clustering.',
    outputs: [
      'Baseline profiles per identity',
      'Anomaly scores for incoming events',
      'Behavioral clusters',
    ],
    technologies: ['Python (scikit-learn)', 'Apache Flink', 'ClickHouse (time-series)', 'HDBSCAN'],
    status: 'implemented',
  },
  {
    id: 'stage-06',
    number: 6,
    title: 'Threat Intelligence Enrichment',
    purpose: 'Enrich events and graph nodes with external threat intelligence.',
    inputs: [
      'MITRE ATT&CK framework (v14)',
      'CISA KEV catalog',
      'NIST NVD (CVE/CVSS)',
      'STRIDE threat model',
      'VirusTotal, AbuseIPDB',
    ],
    processing:
      'Threat intel aggregator fetches and caches IOCs, TTPs, and vulnerability data. Maps observed techniques to MITRE ATT&CK and computes CVSS scores for discovered vulnerabilities. Tags graph nodes with applicable threat context.',
    outputs: [
      'MITRE ATT&CK technique annotations on edges',
      'CVSS-scored vulnerability nodes',
      'IOC match alerts',
    ],
    technologies: ['MITRE ATT&CK STIX/TAXII', 'NIST NVD API', 'Python (stix2)', 'Redis cache'],
    status: 'implemented',
  },
  {
    id: 'stage-07',
    number: 7,
    title: 'AI Correlation Engine',
    purpose: 'Correlate individually benign events into coherent attack narratives.',
    inputs: [
      'Anomaly-scored events from Stage 5',
      'Threat-intel-enriched graph from Stage 6',
      'Attack path patterns from Stage 8',
    ],
    processing:
      'LangGraph-orchestrated multi-agent system with specialized agents: (1) Temporal Correlation Agent groups events by identity within sliding time windows, (2) Graph Pattern Agent matches subgraph patterns to known attack techniques, (3) Narrative Agent synthesizes a human-readable attack story with evidence citations. Uses GPT-4o for reasoning and structured output.',
    outputs: [
      'Correlated incident candidates',
      'Attack narratives with evidence chains',
      'Confidence scores',
    ],
    technologies: ['LangGraph', 'LangChain', 'GPT-4o', 'Neo4j GDS (graph patterns)'],
    status: 'implemented',
  },
  {
    id: 'stage-08',
    number: 8,
    title: 'Attack Path Discovery',
    purpose: 'Discover all viable attack paths from compromised nodes to critical assets.',
    inputs: ['Live security graph', 'Compromised node indicators', 'Critical asset registry'],
    processing:
      'BFS/DFS pathfinding over the security graph identifies all simple paths from compromised entry points to critical assets. Paths are scored by cumulative edge risk and probability. A Rust-compiled WASM module handles the combinatorial pathfinding for performance.',
    outputs: [
      'Ranked attack paths with risk scores',
      'Attack tree visualization data',
      'Path probability estimates',
    ],
    technologies: ['Rust (WASM)', 'Neo4j shortest-path algorithms', 'D3.js (visualization)'],
    status: 'implemented',
  },
  {
    id: 'stage-09',
    number: 9,
    title: 'Incident Synthesis',
    purpose: 'Package correlated events into structured incidents with full context.',
    inputs: ['Correlated attack narratives', 'Attack paths', 'Escalation policies'],
    processing:
      'Incident builder creates structured incident objects with: severity classification (based on highest-severity event and asset criticality), evidence chain, attack lineage (graph paths), recommended actions (from remediation catalog), and escalation routing (based on severity-specific policies).',
    outputs: [
      'Structured Incident objects',
      'SLA timers (acknowledgement, escalation)',
      'Recommended action list',
    ],
    technologies: ['Python (FastAPI)', 'PostgreSQL (incident store)', 'Redis (SLA timers)'],
    status: 'implemented',
  },
  {
    id: 'stage-10',
    number: 10,
    title: 'Automated Response',
    purpose: 'Execute approved remediation actions and notify stakeholders.',
    inputs: ['Incident objects', 'Remediation action catalog', 'Notification routing rules'],
    processing:
      'Response orchestrator dispatches notifications (Slack, PagerDuty, JIRA, email) and optionally executes automated remediation (credential revocation, IAM policy changes, network blocks) via pre-approved runbooks. Supports human-in-the-loop approval for high-impact actions.',
    outputs: [
      'Slack alerts with attack visualizations',
      'JIRA tickets with full context',
      'PagerDuty P1 incidents',
      'Automated remediation execution logs',
    ],
    technologies: [
      'Slack API',
      'PagerDuty API',
      'Jira Cloud API',
      'AWS SDK (remediation)',
      'Temporal (workflow orchestration)',
    ],
    status: 'implemented',
  },
  {
    id: 'stage-11',
    number: 11,
    title: 'Remediation Optimization',
    purpose: 'Compute the minimum-cost set of actions that severs all attack paths.',
    inputs: [
      'Active attack paths',
      'Remediation action catalog with costs',
      'Budget constraints',
    ],
    processing:
      'Formulates the remediation problem as a minimum-cost vertex cut / edge cut problem on the attack graph. Evaluates all 2^n subsets of remediation actions (for small n) to find the cheapest combination that blocks every attack path. Falls back to greedy approximation for large action sets.',
    outputs: [
      'Optimal remediation plan',
      'Total cost and residual exposure',
      'Before/after attack path comparison',
    ],
    technologies: ['Rust (WASM combinatorial optimizer)', 'Python (fallback solver)', 'D3.js'],
    status: 'proposed',
  },
  {
    id: 'stage-12',
    number: 12,
    title: 'Executive Dashboard',
    purpose: 'Present security posture, active incidents, and trends to leadership.',
    inputs: [
      'Incident history',
      'Graph risk scores',
      'Remediation status',
      'Compliance metrics',
    ],
    processing:
      'Real-time dashboard rendering security posture score, active incident count, mean time to detect/respond, attack path coverage, and risk trend charts. Supports drill-down from executive summary to individual incident detail to raw event evidence.',
    outputs: [
      'Executive security posture dashboard',
      'Risk trend visualizations',
      'Compliance status reports',
    ],
    technologies: ['React', 'D3.js', 'Recharts', 'TanStack Query', 'WebSocket (live updates)'],
    status: 'proposed',
  },
];

// ─── Tech Stack ───────────────────────────────────────────────────────────────

export const TECH_STACK: TechItem[] = [
  // Data Layer
  {
    name: 'Apache Kafka',
    description: 'Distributed event streaming platform for real-time log ingestion and processing.',
    purpose: 'Ingests security events from all enterprise sources with guaranteed delivery and ordering.',
    layer: 'Data Ingestion',
    status: 'implemented',
    component: 'Kafka Cluster (3 brokers, ap-south-1)',
  },
  {
    name: 'Confluent Schema Registry',
    description: 'Schema management for Kafka topics using Avro serialization.',
    purpose: 'Ensures schema compatibility across event producers and consumers.',
    layer: 'Data Ingestion',
    status: 'implemented',
    component: 'Schema Registry',
  },
  {
    name: 'Apache Flink',
    description: 'Stateful stream processing engine for complex event processing.',
    purpose: 'Real-time behavioral baseline computation and sliding-window anomaly detection.',
    layer: 'Stream Processing',
    status: 'implemented',
    component: 'Flink Cluster',
  },
  {
    name: 'ClickHouse',
    description: 'Columnar OLAP database for high-performance time-series analytics.',
    purpose: 'Stores historical event data for baseline computation and trend analysis.',
    layer: 'Analytics',
    status: 'implemented',
    component: 'ClickHouse Cluster',
  },

  // Graph Layer
  {
    name: 'Neo4j',
    description: 'Native graph database for storing and querying the security knowledge graph.',
    purpose: 'Stores identity-asset-credential-vulnerability relationships and enables path queries.',
    layer: 'Graph Engine',
    status: 'implemented',
    component: 'Neo4j Aura Enterprise',
  },
  {
    name: 'Neo4j Graph Data Science',
    description: 'Graph algorithms library for PageRank, community detection, and pathfinding.',
    purpose: 'Computes risk scores via weighted PageRank and discovers attack paths.',
    layer: 'Graph Engine',
    status: 'implemented',
    component: 'GDS Plugin',
  },

  // AI Layer
  {
    name: 'LangGraph',
    description: 'Framework for building multi-agent AI workflows with cycles and state management.',
    purpose: 'Orchestrates the multi-agent correlation engine (temporal, pattern, narrative agents).',
    layer: 'AI / ML',
    status: 'implemented',
    component: 'Correlation Agent System',
  },
  {
    name: 'LangChain',
    description: 'Framework for building LLM-powered applications with structured outputs.',
    purpose: 'Provides tool-calling, structured output parsing, and chain composition for AI agents.',
    layer: 'AI / ML',
    status: 'implemented',
    component: 'Agent Tooling',
  },
  {
    name: 'GPT-4o',
    description: "OpenAI\'s multimodal large language model for reasoning and text generation.",
    purpose: 'Powers the narrative synthesis agent and natural-language attack explanations.',
    layer: 'AI / ML',
    status: 'implemented',
    component: 'LLM Backend',
  },
  {
    name: 'scikit-learn',
    description: 'Machine learning library for classical ML algorithms.',
    purpose: 'Isolation Forest anomaly detection and HDBSCAN behavioral clustering.',
    layer: 'AI / ML',
    status: 'implemented',
    component: 'Behavioral Analysis',
  },

  // Performance Layer
  {
    name: 'Rust (WASM)',
    description: 'Systems programming language compiled to WebAssembly for browser-side computation.',
    purpose: 'Accelerates combinatorial pathfinding and remediation optimization in the browser.',
    layer: 'Performance',
    status: 'implemented',
    component: 'WASM Modules',
  },

  // Backend Layer
  {
    name: 'Python (FastAPI)',
    description: 'High-performance async Python web framework.',
    purpose: 'Serves the REST API and WebSocket connections for the dashboard.',
    layer: 'Backend',
    status: 'implemented',
    component: 'API Server',
  },
  {
    name: 'Temporal',
    description: 'Durable execution platform for long-running workflows.',
    purpose: 'Orchestrates multi-step incident response and remediation workflows.',
    layer: 'Backend',
    status: 'proposed',
    component: 'Workflow Engine',
  },
  {
    name: 'PostgreSQL',
    description: 'Relational database for structured incident and configuration data.',
    purpose: 'Stores incidents, escalation policies, remediation catalog, and audit history.',
    layer: 'Backend',
    status: 'implemented',
    component: 'Incident Store',
  },
  {
    name: 'Redis',
    description: 'In-memory data store for caching, pub/sub, and SLA timers.',
    purpose: 'Caches enrichment data, manages real-time SLA countdown timers, and pub/sub notifications.',
    layer: 'Backend',
    status: 'implemented',
    component: 'Cache & Timers',
  },

  // Frontend Layer
  {
    name: 'React',
    description: 'Declarative UI library for building component-based interfaces.',
    purpose: 'Renders the interactive presentation and executive dashboard.',
    layer: 'Frontend',
    status: 'implemented',
    component: 'Presentation UI',
  },
  {
    name: 'D3.js',
    description: 'Data visualization library for SVG-based graphics.',
    purpose: 'Renders the interactive attack graph, force-directed layouts, and attack path animations.',
    layer: 'Frontend',
    status: 'implemented',
    component: 'Graph Visualization',
  },
  {
    name: 'GSAP',
    description: 'Professional-grade animation library with ScrollTrigger plugin.',
    purpose: 'Powers cinematic scroll-driven animations and chapter transitions.',
    layer: 'Frontend',
    status: 'implemented',
    component: 'Animation Engine',
  },
  {
    name: 'Framer Motion',
    description: 'Production-ready React animation library.',
    purpose: 'Component-level enter/exit animations, layout animations, and gesture support.',
    layer: 'Frontend',
    status: 'implemented',
    component: 'Component Animations',
  },
  {
    name: 'Tailwind CSS v4',
    description: 'Utility-first CSS framework with design token system.',
    purpose: 'Provides the design system and responsive styling for all UI components.',
    layer: 'Frontend',
    status: 'implemented',
    component: 'Styling',
  },

  // Integration Layer
  {
    name: 'Slack API',
    description: 'Messaging platform API for security alerts and notifications.',
    purpose: 'Delivers real-time incident alerts with rich formatting to security channels.',
    layer: 'Integrations',
    status: 'implemented',
    component: 'Notification Service',
  },
  {
    name: 'PagerDuty API',
    description: 'Incident management platform API for on-call alerting.',
    purpose: 'Triggers P1/P2 alerts with SLA-based escalation to on-call responders.',
    layer: 'Integrations',
    status: 'implemented',
    component: 'Escalation Service',
  },
  {
    name: 'Jira Cloud API',
    description: 'Project management platform API for ticket creation.',
    purpose: 'Auto-creates security tickets with full incident context and evidence links.',
    layer: 'Integrations',
    status: 'implemented',
    component: 'Ticketing Service',
  },

  // Infrastructure
  {
    name: 'Docker',
    description: 'Container runtime for service packaging and deployment.',
    purpose: 'Packages all services into reproducible containers for consistent deployment.',
    layer: 'Infrastructure',
    status: 'implemented',
    component: 'Container Runtime',
  },
  {
    name: 'Kubernetes (EKS)',
    description: 'Container orchestration platform on AWS Elastic Kubernetes Service.',
    purpose: 'Orchestrates all service containers with auto-scaling and health management.',
    layer: 'Infrastructure',
    status: 'proposed',
    component: 'Orchestration',
  },
  {
    name: 'Terraform',
    description: 'Infrastructure-as-code tool for cloud resource provisioning.',
    purpose: 'Defines and provisions all AWS infrastructure declaratively.',
    layer: 'Infrastructure',
    status: 'proposed',
    component: 'IaC',
  },
];

// ─── USP Pillars ──────────────────────────────────────────────────────────────

export const USP_PILLARS: USPPillar[] = [
  {
    id: 'usp-graph-context',
    title: 'Graph-Native Context',
    description:
      'Unlike flat-log SIEMs, AttackTwin builds a live identity-asset-credential knowledge graph that reveals hidden relationships and blast radius instantly. Every alert comes with full graph context — not just what happened, but who is connected to what, and what else is at risk.',
    icon: '🕸️',
    highlightNodes: [
      'priya-sharma',
      'pat-github',
      'github-org',
      'vault-prod',
      'rds-prod',
    ],
  },
  {
    id: 'usp-ai-correlation',
    title: 'AI-Powered Multi-Source Correlation',
    description:
      'Seven alerts across four different tools — individually each looks benign. AttackTwin\'s LangGraph multi-agent system correlates temporal patterns, graph topology, and threat intelligence to weave these signals into a single coherent attack narrative with 94% confidence.',
    icon: '🧠',
    highlightNodes: [
      'priya-sharma',
      'personal-laptop',
      'c2-domain',
      'svc-backup',
    ],
  },
  {
    id: 'usp-attack-prediction',
    title: 'Predictive Attack Paths',
    description:
      'Traditional tools detect attacks after they succeed. AttackTwin discovers all viable attack paths before they are exploited — mapping every route from compromised entry point to crown-jewel asset, scored by probability and severity.',
    icon: '🎯',
    highlightNodes: [
      'priya-sharma',
      'aws-session',
      'db-master-cred',
      'rds-prod',
      'customer-pii',
    ],
  },
  {
    id: 'usp-optimal-remediation',
    title: 'Optimal Remediation',
    description:
      'Instead of a laundry list of recommendations, AttackTwin computes the mathematically minimum-cost set of actions that severs every attack path — a graph-theoretic minimum vertex cut that maximizes security ROI within your budget constraints.',
    icon: '🛡️',
    highlightNodes: [
      'iam-devops-role',
      'pat-github',
      'vault-prod',
      'dns-resolver',
    ],
  },
  {
    id: 'usp-sub-minute-response',
    title: 'Sub-Minute Incident Response',
    description:
      'From first anomalous event to correlated incident creation in under 60 seconds. From incident creation to Slack alert in 3 seconds. From Slack alert to JIRA ticket in 3 more. AttackTwin compresses the MTTD-to-MTTR gap from hours to seconds.',
    icon: '⚡',
    highlightNodes: [
      'slack-workspace',
      'jira-instance',
      'pagerduty',
    ],
  },
];

// ─── Breach Cost Data (IBM / India 2025-2026) ─────────────────────────────────

export const BREACH_COST_DATA: BreachCostData[] = [
  {
    category: 'Average Total Cost per Breach (India)',
    cost: 2180000,
    unit: 'USD',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
  {
    category: 'Average Cost per Compromised Record',
    cost: 175,
    unit: 'USD',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
  {
    category: 'Average Time to Identify Breach',
    cost: 221,
    unit: 'days',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
  {
    category: 'Average Time to Contain Breach',
    cost: 77,
    unit: 'days',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
  {
    category: 'Cost Savings with AI-Driven Security',
    cost: 1760000,
    unit: 'USD',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
  {
    category: 'Insider Threat Average Cost',
    cost: 4990000,
    unit: 'USD',
    source: 'Ponemon Institute 2024',
    year: 2024,
  },
  {
    category: 'Healthcare Breach Average Cost (Global)',
    cost: 10930000,
    unit: 'USD',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
  {
    category: 'BFSI Breach Average Cost (India)',
    cost: 2950000,
    unit: 'USD',
    source: 'IBM Cost of a Data Breach Report 2025',
    year: 2025,
  },
];

// ─── Competitors ──────────────────────────────────────────────────────────────

export const COMPETITORS: Competitor[] = [
  {
    name: 'Microsoft Sentinel',
    capabilities: [
      'Cloud-native SIEM with KQL query language',
      'Integration with Microsoft Defender ecosystem',
      'SOAR playbooks via Logic Apps',
      'Threat intelligence from Microsoft Threat Intelligence Center',
      'UEBA via Azure AD Identity Protection',
    ],
    differentiator:
      'AttackTwin goes beyond log correlation with a live identity-asset knowledge graph that Sentinel\'s flat-log architecture cannot replicate. Sentinel detects; AttackTwin predicts and prescribes optimal remediation using graph theory.',
  },
  {
    name: 'CrowdStrike Falcon',
    capabilities: [
      'Endpoint detection and response (EDR)',
      'Cloud workload protection (CWPP)',
      'Identity threat detection (ITDR)',
      'Managed threat hunting (Falcon OverWatch)',
      'AI-powered threat scoring (Charlotte AI)',
    ],
    differentiator:
      'Falcon excels at endpoint-centric detection but lacks cross-domain graph correlation. AttackTwin unifies identity, cloud, code repository, secrets management, and network signals into a single attack graph — revealing lateral movement paths that endpoint-only solutions miss.',
  },
  {
    name: 'Splunk Enterprise Security',
    capabilities: [
      'Log aggregation and search at scale',
      'Risk-based alerting (RBA)',
      'MITRE ATT&CK framework mapping',
      'Adaptive response actions',
      'Executive dashboards and compliance reporting',
    ],
    differentiator:
      'Splunk\'s strength is log search, but its correlation relies on manual rules and SPL queries. AttackTwin\'s AI correlation engine automatically discovers attack narratives across heterogeneous sources without predefined rules — and its graph-theoretic remediation optimizer provides mathematically optimal defense strategies that Splunk\'s rule-based approach cannot match.',
  },
];

// ─── Threat Intelligence Sources ──────────────────────────────────────────────

export const THREAT_INTEL_SOURCES: ThreatIntelSource[] = [
  {
    id: 'mitre-attack',
    name: 'MITRE ATT&CK',
    description:
      'Globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. Provides a common taxonomy for classifying adversary behavior.',
    url: 'https://attack.mitre.org',
    dataType: 'Tactics, Techniques, and Procedures (TTPs)',
  },
  {
    id: 'stride',
    name: 'STRIDE Threat Model',
    description:
      'Microsoft\'s threat classification model categorizing threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.',
    url: 'https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats',
    dataType: 'Threat Classification Categories',
  },
  {
    id: 'nist-nvd',
    name: 'NIST National Vulnerability Database',
    description:
      'U.S. government repository of standards-based vulnerability data using CVE identifiers. Provides CVSS severity scoring for all published vulnerabilities.',
    url: 'https://nvd.nist.gov',
    dataType: 'CVE Identifiers & CVSS Scores',
  },
  {
    id: 'cvss',
    name: 'Common Vulnerability Scoring System (CVSS)',
    description:
      'Industry standard for assessing the severity of computer system security vulnerabilities. Provides a numerical score (0–10) reflecting severity and qualitative ratings.',
    url: 'https://www.first.org/cvss/',
    dataType: 'Vulnerability Severity Scores (0–10)',
  },
  {
    id: 'cisa-kev',
    name: 'CISA Known Exploited Vulnerabilities',
    description:
      'Authoritative catalog of vulnerabilities that are being actively exploited in the wild, maintained by the U.S. Cybersecurity and Infrastructure Security Agency.',
    url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    dataType: 'Actively Exploited CVEs with Remediation Deadlines',
  },
];
