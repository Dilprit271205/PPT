import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChapterProps, Incident } from '../types';
import { ChapterLayout, SectionBlock, SeverityBadge, GlowCard } from '../components/shared';
import { INCIDENT_DATA, ESCALATION_POLICIES } from '../data/scenarioData';
import { usePresentationStore } from '../store/presentationStore';
import {
  ShieldAlert,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Bell,
  ArrowRight,
  User,
  Users,
  Shield,
  Send,
  History,
  FileCheck2,
  Info,
  ChevronRight,
  Flame,
  Radio
} from 'lucide-react';

const respondersList = [
  { name: 'Vikram Singh', role: 'SOC Analyst L1', team: 'Blue Team Alpha' },
  { name: 'Ananya Roy', role: 'Incident Commander L2', team: 'Threat Response' },
  { name: 'Rajesh Nair', role: 'CISO', team: 'Executive Security' },
];

export default function Chapter07Alerting({ id }: ChapterProps) {
  const { navigateToChapter } = usePresentationStore();

  const [incident, setIncident] = useState<Incident>(INCIDENT_DATA);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 min demo timer
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [verificationChecked, setVerificationChecked] = useState<boolean>(false);

  const criticalPolicy = ESCALATION_POLICIES[0]; // critical policy

  const triggerAutoEscalation = useCallback(() => {
    setCurrentLevelIndex((prevLevel) => {
      const nextLevel = Math.min(prevLevel + 1, criticalPolicy.escalationChain.length - 1);
      const escalatedTo = criticalPolicy.escalationChain[nextLevel];

      setIncident((prev) => {
        if (prev.status === 'escalated') return prev;
        return {
          ...prev,
          status: 'escalated',
          history: [
            {
              time: new Date().toLocaleTimeString(),
              action: 'AUTOMATIC ESCALATION TRIGGERED',
              actor: 'Escalation Engine',
              detail: `Acknowledgement deadline passed without response. Escalated to ${escalatedTo}.`,
            },
            ...prev.history,
          ],
        };
      });

      return nextLevel;
    });
  }, [criticalPolicy.escalationChain]);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || incident.status !== 'new') return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, incident.status]);

  // Trigger escalation when timer reaches zero
  useEffect(() => {
    if (secondsRemaining === 0 && incident.status === 'new' && isTimerRunning) {
      setIsTimerRunning(false);
      triggerAutoEscalation();
    }
  }, [secondsRemaining, incident.status, isTimerRunning, triggerAutoEscalation]);

  // Actions
  const handleAcknowledge = () => {
    setIsTimerRunning(false);
    const updated = {
      ...incident,
      status: 'acknowledged' as const,
      assignedPerson: incident.assignedPerson || 'Vikram Singh (SOC L1)',
      history: [
        {
          time: new Date().toLocaleTimeString(),
          action: 'Incident Acknowledged',
          actor: incident.assignedPerson || 'Vikram Singh',
          detail: 'Analyst took ownership. Escalation countdown halted.',
        },
        ...incident.history,
      ],
    };
    setIncident(updated);
  };

  const handleManualEscalate = () => {
    const nextLevel = Math.min(currentLevelIndex + 1, criticalPolicy.escalationChain.length - 1);
    setCurrentLevelIndex(nextLevel);
    const escalatedTo = criticalPolicy.escalationChain[nextLevel];

    setIncident((prev) => ({
      ...prev,
      status: 'escalated',
      history: [
        {
          time: new Date().toLocaleTimeString(),
          action: 'Manual Escalation',
          actor: 'Security Operations',
          detail: `Priority elevated to ${escalatedTo} for urgent review.`,
        },
        ...prev.history,
      ],
    }));
  };

  const handleAssign = (responderName: string) => {
    setIncident((prev) => ({
      ...prev,
      assignedPerson: responderName,
      history: [
        {
          time: new Date().toLocaleTimeString(),
          action: 'Responder Assigned',
          actor: 'Command Lead',
          detail: `Directly assigned to ${responderName}`,
        },
        ...prev.history,
      ],
    }));
    setShowAssignModal(false);
  };

  const handleResolve = () => {
    if (!verificationChecked) return;
    setIncident((prev) => ({
      ...prev,
      status: 'resolved',
      history: [
        {
          time: new Date().toLocaleTimeString(),
          action: 'Incident Resolved & Verified',
          actor: prev.assignedPerson || 'Vikram Singh',
          detail: 'Remediation actions confirmed; credential rotated, anomalous C2 severed.',
        },
        ...prev.history,
      ],
    }));
    setShowResolveModal(false);
  };

  const handleReset = () => {
    setIncident(INCIDENT_DATA);
    setSecondsRemaining(300);
    setIsTimerRunning(true);
    setCurrentLevelIndex(0);
    setVerificationChecked(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <ChapterLayout
      id={id}
      chapterNumber={7}
      headline="DETECTING AN ATTACK ISN'T ENOUGH."
      subtitle="The right people must respond before the incident escalates. Experience intelligent incident ownership, automated escalation timers, and defensive dispatch."
    >
      <div className="space-y-8">
        {/* Top Incident Status Banner */}
        <SectionBlock>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#3B0D16]/80 via-[#101522] to-[#101522] border border-[#E53935]/30 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#E53935]/20 text-[#FF4D5A] font-bold border border-[#E53935]/40 flex items-center gap-1.5">
                    <Radio size={12} className="animate-pulse" />
                    {incident.id}
                  </span>
                  <SeverityBadge severity={incident.severity} />
                  <span
                    className={`font-mono text-xs uppercase px-2.5 py-0.5 rounded-full font-semibold border ${
                      incident.status === 'resolved'
                        ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40'
                        : incident.status === 'escalated'
                        ? 'bg-[#E53935]/20 text-[#FF4D5A] border-[#E53935]/40 animate-pulse'
                        : incident.status === 'acknowledged'
                        ? 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/40'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40'
                    }`}
                  >
                    STATUS: {incident.status}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-['Space_Grotesk'] mt-2">
                  {incident.title}
                </h3>
                <p className="text-xs text-[#94A3B8] font-mono">
                  Affected Asset: <span className="text-[#FF4D5A] font-bold">{incident.affectedAsset}</span> • Assigned:{' '}
                  <span className="text-[#F8FAFC]">{incident.assignedPerson || incident.assignedTeam}</span>
                </p>
              </div>

              {/* Timer & SLA Widget */}
              <div className="p-4 rounded-xl bg-[#07080C]/90 border border-[#94A3B8]/20 flex items-center gap-4">
                <div className="text-center">
                  <div className="text-[10px] font-mono text-[#94A3B8]/60 uppercase">
                    {incident.status === 'acknowledged'
                      ? 'ACKNOWLEDGED'
                      : incident.status === 'escalated'
                      ? 'ESCALATED'
                      : incident.status === 'resolved'
                      ? 'RESOLVED'
                      : 'ACK DEADLINE'}
                  </div>
                  <div
                    className={`text-2xl font-mono font-bold ${
                      incident.status === 'escalated'
                        ? 'text-[#FF4D5A]'
                        : incident.status === 'acknowledged' || incident.status === 'resolved'
                        ? 'text-[#22C55E]'
                        : 'text-[#F59E0B]'
                    }`}
                  >
                    {incident.status === 'acknowledged' || incident.status === 'resolved'
                      ? '00:00'
                      : formatTimer(secondsRemaining)}
                  </div>
                </div>
                <div className="h-8 w-px bg-[#94A3B8]/20" />
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#94A3B8]/60 uppercase">SLA Target</div>
                  <div className="text-xs font-mono text-[#F8FAFC]">
                    5m Ack / 15m Esc
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Control Action Bar */}
            <div className="mt-6 pt-5 border-t border-[#94A3B8]/15 flex flex-wrap items-center gap-3">
              <button
                onClick={handleAcknowledge}
                disabled={incident.status === 'acknowledged' || incident.status === 'resolved'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] hover:bg-[#22C55E]/25 disabled:opacity-30 disabled:cursor-not-allowed font-mono text-xs font-bold transition-all"
              >
                <CheckCircle2 size={14} />
                ACKNOWLEDGE INCIDENT
              </button>

              <button
                onClick={() => setShowAssignModal(true)}
                disabled={incident.status === 'resolved'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101522] border border-[#94A3B8]/25 text-[#F8FAFC] hover:border-[#3B82F6]/60 font-mono text-xs transition-all"
              >
                <UserCheck size={14} className="text-[#3B82F6]" />
                ASSIGN RESPONDER
              </button>

              <button
                onClick={triggerAutoEscalation}
                disabled={incident.status === 'resolved'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/20 font-mono text-xs transition-all"
              >
                <Clock size={14} />
                SIMULATE DEADLINE EXPIRED
              </button>

              <button
                onClick={handleManualEscalate}
                disabled={incident.status === 'resolved'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E53935]/15 border border-[#E53935]/40 text-[#FF4D5A] hover:bg-[#E53935]/25 font-mono text-xs font-bold transition-all"
              >
                <AlertTriangle size={14} />
                ESCALATE INCIDENT
              </button>

              <button
                onClick={() => setShowResolveModal(true)}
                disabled={incident.status === 'resolved'}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20 font-mono text-xs transition-all"
              >
                <FileCheck2 size={14} />
                RESOLVE WITH VERIFICATION
              </button>

              <button
                onClick={handleReset}
                className="p-2 ml-auto rounded-xl border border-[#94A3B8]/20 text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
                title="Reset scenario state"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </SectionBlock>

        {/* Visual Escalation Ladder */}
        <SectionBlock>
          <div className="p-6 rounded-2xl bg-[#101522]/60 border border-[#94A3B8]/10 backdrop-blur-sm">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]/70 mb-4 flex items-center gap-2">
              <Users size={14} className="text-[#E53935]" />
              Escalation Policy & Responsibility Chain (Critical Severity)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {criticalPolicy.escalationChain.map((role, idx) => {
                const isActiveRole = idx === currentLevelIndex;
                const isPastRole = idx < currentLevelIndex;

                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all relative ${
                      isActiveRole
                        ? 'border-[#FF4D5A] bg-[#FF4D5A]/10 shadow-[0_0_15px_rgba(255,77,90,0.2)]'
                        : isPastRole
                        ? 'border-[#22C55E]/40 bg-[#22C55E]/5'
                        : 'border-[#94A3B8]/10 bg-[#07080C]/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-[#94A3B8]/60">Tier {idx + 1}</span>
                      {isActiveRole && (
                        <span className="w-2 h-2 rounded-full bg-[#FF4D5A] animate-ping" />
                      )}
                      {isPastRole && (
                        <CheckCircle2 size={12} className="text-[#22C55E]" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#F8FAFC] font-['Space_Grotesk'] leading-tight">
                      {role}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] font-mono mt-1">
                      {idx === 0 ? 'Target: 5 min' : idx === 1 ? 'Esc: +10 min' : 'Executive Esc'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionBlock>

        {/* Two Column: Left Evidence & Lineage | Right Incident Audit History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Correlated Evidence & Lineage */}
          <SectionBlock>
            <div className="p-6 rounded-2xl bg-[#101522]/60 border border-[#94A3B8]/10 space-y-5 h-full">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]/70 flex items-center gap-2">
                <ShieldAlert size={14} className="text-[#FF4D5A]" />
                Correlated Evidence Chain ({incident.evidence.length} Events)
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {incident.evidence.map((ev, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#07080C] border border-[#94A3B8]/10 text-xs text-[#F8FAFC] flex items-start gap-2 font-mono">
                    <span className="text-[#FF4D5A] font-bold">[{i + 1}]</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#94A3B8]/10">
                <h5 className="text-[11px] font-mono text-[#94A3B8]/70 uppercase mb-2">Graph Attack Lineage</h5>
                <div className="space-y-1">
                  {incident.attackLineage.map((lin, idx) => (
                    <div key={idx} className="text-[11px] font-mono text-[#94A3B8] bg-[#07080C]/50 px-2.5 py-1 rounded truncate">
                      {lin}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* Audit History Log */}
          <SectionBlock>
            <div className="p-6 rounded-2xl bg-[#101522]/60 border border-[#94A3B8]/10 space-y-4 h-full flex flex-col">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]/70 flex items-center gap-2">
                <History size={14} className="text-[#3B82F6]" />
                Live Incident Audit Log
              </h4>

              <div className="space-y-2.5 overflow-y-auto max-h-80 flex-1 pr-1">
                {incident.history.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#07080C] border border-[#94A3B8]/10 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#F8FAFC] font-['Space_Grotesk']">{h.action}</span>
                      <span className="text-[10px] font-mono text-[#94A3B8]/60">{h.time}</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">{h.detail}</p>
                    <span className="text-[10px] font-mono text-[#3B82F6] mt-1 inline-block">By: {h.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionBlock>
        </div>

        {/* Disclaimer / Engineering Note */}
        <SectionBlock>
          <div className="p-4 rounded-xl bg-[#101522]/30 border border-[#94A3B8]/15 flex items-start gap-3">
            <Info size={16} className="text-[#94A3B8] shrink-0 mt-0.5" />
            <p className="text-xs text-[#94A3B8]/70 leading-relaxed">
              <span className="text-[#F8FAFC] font-semibold">Engineering Architecture Note: </span>
              In production, notifications dispatch via authenticated Webhooks, PagerDuty Events API v2, Slack Bolt SDK, and Temporal cron workflows with persistent retries. This interactive chapter showcases deterministic local state machine behavior.
            </p>
          </div>
        </SectionBlock>

        {/* Question & Transition CTA to Chapter 08 */}
        <SectionBlock className="p-8 rounded-2xl bg-gradient-to-r from-[#101522] via-[#3B0D16]/30 to-[#101522] border border-[#E53935]/30 text-center">
          <p className="text-lg md:text-xl font-light text-[#94A3B8] font-['Space_Grotesk']">
            "Now that the right people know, what is the most effective way to{' '}
            <span className="text-[#FF4D5A] font-semibold">stop the attack</span>?"
          </p>
          <button
            onClick={() => navigateToChapter(7)} // Chapter 8 is index 7
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#FF4D5A] text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#E53935]/25"
          >
            PROCEED TO CHAPTER 08: REMEDIATION OPTIMIZER
            <ArrowRight size={14} />
          </button>
        </SectionBlock>
      </div>

      {/* Assign Responder Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#07080C]/80 backdrop-blur-sm"
              onClick={() => setShowAssignModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#101522] border border-[#94A3B8]/20 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk'] mb-3">
                Assign Security Incident Responder
              </h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                Select a certified analyst to take operational ownership and begin triage.
              </p>
              <div className="space-y-2">
                {respondersList.map((resp, i) => (
                  <button
                    key={i}
                    onClick={() => handleAssign(`${resp.name} (${resp.role})`)}
                    className="w-full text-left p-3 rounded-xl bg-[#07080C] border border-[#94A3B8]/15 hover:border-[#3B82F6]/50 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#F8FAFC]">{resp.name}</div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">{resp.role} • {resp.team}</div>
                    </div>
                    <ChevronRight size={14} className="text-[#94A3B8]" />
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Resolve Verification Modal */}
      <AnimatePresence>
        {showResolveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#07080C]/80 backdrop-blur-sm"
              onClick={() => setShowResolveModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#101522] border border-[#94A3B8]/20 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-[#F8FAFC] font-['Space_Grotesk']">
                Simulated Resolution Verification
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Critical incidents require explicit defensive verification before closure to confirm the adversary has not maintained persistence.
              </p>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#07080C] border border-[#94A3B8]/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verificationChecked}
                  onChange={(e) => setVerificationChecked(e.target.checked)}
                  className="mt-0.5 accent-[#22C55E]"
                />
                <span className="text-xs text-[#F8FAFC] font-mono leading-tight">
                  Verify credential revocation, IAM backdoor deletion, and C2 perimeter quarantine.
                </span>
              </label>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#94A3B8]/20 text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={!verificationChecked}
                  className="px-4 py-2 rounded-xl bg-[#22C55E] text-white text-xs font-mono font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#22C55E]/90 transition-all"
                >
                  Confirm Resolution
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ChapterLayout>
  );
}

