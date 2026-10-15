import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Incident, OptimizationResult } from '../types';
import { INCIDENT_DATA } from '../data/scenarioData';

// ─── State Shape ──────────────────────────────────────────────────────────────

export interface PresentationState {
  /** Currently active chapter (1-based index) */
  currentChapter: number;
  /** Scroll progress within current chapter (0–1) */
  scrollProgress: number;
  /** Fullscreen presentation mode */
  isFullscreen: boolean;
  /** Auto-advance chapters on a timer */
  isAutoplay: boolean;
  /** Currently selected graph node id */
  selectedNode: string | null;
  /** Currently selected security event id */
  selectedEvent: string | null;
  /** Live incident state */
  incident: Incident;
  /** Remediation state */
  remediation: RemediationState;
  /** Chapter nav menu open */
  isChapterMenuOpen: boolean;
  /** User prefers reduced motion */
  isReducedMotion: boolean;
}

export interface RemediationState {
  selectedActions: string[];
  budget: number;
  optimizationResult: OptimizationResult | null;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_CHAPTER'; chapter: number }
  | { type: 'SET_SCROLL_PROGRESS'; progress: number }
  | { type: 'SET_FULLSCREEN'; value: boolean }
  | { type: 'SET_AUTOPLAY'; value: boolean }
  | { type: 'SET_SELECTED_NODE'; nodeId: string | null }
  | { type: 'SET_SELECTED_EVENT'; eventId: string | null }
  | { type: 'SET_INCIDENT'; incident: Incident }
  | { type: 'UPDATE_INCIDENT_STATUS'; status: Incident['status'] }
  | { type: 'TOGGLE_REMEDIATION_ACTION'; actionId: string }
  | { type: 'SET_BUDGET'; budget: number }
  | { type: 'SET_OPTIMIZATION_RESULT'; result: OptimizationResult | null }
  | { type: 'SET_CHAPTER_MENU_OPEN'; value: boolean }
  | { type: 'SET_REDUCED_MOTION'; value: boolean }
  | { type: 'RESET_REMEDIATION' };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'SET_CHAPTER':
      if (state.currentChapter === action.chapter) return state;
      return { ...state, currentChapter: action.chapter, scrollProgress: 0 };

    case 'SET_SCROLL_PROGRESS':
      if (Math.abs(state.scrollProgress - action.progress) < 0.05) return state;
      return { ...state, scrollProgress: action.progress };

    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.value };

    case 'SET_AUTOPLAY':
      return { ...state, isAutoplay: action.value };

    case 'SET_SELECTED_NODE':
      return { ...state, selectedNode: action.nodeId };

    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.eventId };

    case 'SET_INCIDENT':
      return { ...state, incident: action.incident };

    case 'UPDATE_INCIDENT_STATUS':
      return {
        ...state,
        incident: { ...state.incident, status: action.status },
      };

    case 'TOGGLE_REMEDIATION_ACTION': {
      const current = state.remediation.selectedActions;
      const next = current.includes(action.actionId)
        ? current.filter((id) => id !== action.actionId)
        : [...current, action.actionId];
      return {
        ...state,
        remediation: {
          ...state.remediation,
          selectedActions: next,
          optimizationResult: null, // invalidate stale result
        },
      };
    }

    case 'SET_BUDGET':
      return {
        ...state,
        remediation: {
          ...state.remediation,
          budget: action.budget,
          optimizationResult: null,
        },
      };

    case 'SET_OPTIMIZATION_RESULT':
      return {
        ...state,
        remediation: { ...state.remediation, optimizationResult: action.result },
      };

    case 'SET_CHAPTER_MENU_OPEN':
      return { ...state, isChapterMenuOpen: action.value };

    case 'SET_REDUCED_MOTION':
      return { ...state, isReducedMotion: action.value };

    case 'RESET_REMEDIATION':
      return {
        ...state,
        remediation: {
          selectedActions: [],
          budget: 340000,
          optimizationResult: null,
        },
      };

    default:
      return state;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: PresentationState = {
  currentChapter: 0,
  scrollProgress: 0,
  isFullscreen: false,
  isAutoplay: false,
  selectedNode: null,
  selectedEvent: null,
  incident: { ...INCIDENT_DATA },
  remediation: {
    selectedActions: [],
    budget: 340000,
    optimizationResult: null,
  },
  isChapterMenuOpen: false,
  isReducedMotion: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────

export interface PresentationContextValue {
  state: PresentationState;

  // Flattened state properties for convenience
  currentChapter: number;
  scrollProgress: number;
  isFullscreen: boolean;
  isAutoplay: boolean;
  selectedNode: string | null;
  selectedEvent: string | null;
  incident: Incident;
  remediation: RemediationState;
  isChapterMenuOpen: boolean;
  isReducedMotion: boolean;

  // Navigation
  navigateToChapter: (n: number) => void;
  setCurrentChapter: (n: number) => void;
  setScrollProgress: (p: number) => void;

  // UI toggles
  setFullscreen: (v: boolean) => void;
  setIsFullscreen: (v: boolean) => void;
  setAutoplay: (v: boolean) => void;
  setIsAutoplay: (v: boolean) => void;
  setChapterMenuOpen: (v: boolean) => void;
  setIsChapterMenuOpen: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setIsReducedMotion: (v: boolean) => void;

  // Selections
  setSelectedNode: (id: string | null) => void;
  setSelectedEvent: (id: string | null) => void;

  // Incident
  setIncident: (incident: Incident) => void;
  updateIncidentStatus: (status: Incident['status']) => void;

  // Remediation
  toggleRemediationAction: (actionId: string) => void;
  setBudget: (budget: number) => void;
  setOptimizationResult: (result: OptimizationResult | null) => void;
  resetRemediation: () => void;
}

const PresentationContext = createContext<PresentationContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigateToChapter = useCallback(
    (n: number) => dispatch({ type: 'SET_CHAPTER', chapter: n }),
    [],
  );
  const setScrollProgress = useCallback(
    (p: number) => dispatch({ type: 'SET_SCROLL_PROGRESS', progress: p }),
    [],
  );
  const setFullscreen = useCallback(
    (v: boolean) => dispatch({ type: 'SET_FULLSCREEN', value: v }),
    [],
  );
  const setAutoplay = useCallback(
    (v: boolean) => dispatch({ type: 'SET_AUTOPLAY', value: v }),
    [],
  );
  const setChapterMenuOpen = useCallback(
    (v: boolean) => dispatch({ type: 'SET_CHAPTER_MENU_OPEN', value: v }),
    [],
  );
  const setReducedMotion = useCallback(
    (v: boolean) => dispatch({ type: 'SET_REDUCED_MOTION', value: v }),
    [],
  );
  const setSelectedNode = useCallback(
    (id: string | null) => dispatch({ type: 'SET_SELECTED_NODE', nodeId: id }),
    [],
  );
  const setSelectedEvent = useCallback(
    (id: string | null) =>
      dispatch({ type: 'SET_SELECTED_EVENT', eventId: id }),
    [],
  );
  const setIncident = useCallback(
    (incident: Incident) => dispatch({ type: 'SET_INCIDENT', incident }),
    [],
  );
  const updateIncidentStatus = useCallback(
    (status: Incident['status']) =>
      dispatch({ type: 'UPDATE_INCIDENT_STATUS', status }),
    [],
  );
  const toggleRemediationAction = useCallback(
    (actionId: string) =>
      dispatch({ type: 'TOGGLE_REMEDIATION_ACTION', actionId }),
    [],
  );
  const setBudget = useCallback(
    (budget: number) => dispatch({ type: 'SET_BUDGET', budget }),
    [],
  );
  const setOptimizationResult = useCallback(
    (result: OptimizationResult | null) =>
      dispatch({ type: 'SET_OPTIMIZATION_RESULT', result }),
    [],
  );
  const resetRemediation = useCallback(
    () => dispatch({ type: 'RESET_REMEDIATION' }),
    [],
  );

  const value = useMemo<PresentationContextValue>(
    () => ({
      state,
      currentChapter: state.currentChapter,
      scrollProgress: state.scrollProgress,
      isFullscreen: state.isFullscreen,
      isAutoplay: state.isAutoplay,
      selectedNode: state.selectedNode,
      selectedEvent: state.selectedEvent,
      incident: state.incident,
      remediation: state.remediation,
      isChapterMenuOpen: state.isChapterMenuOpen,
      isReducedMotion: state.isReducedMotion,
      navigateToChapter,
      setCurrentChapter: navigateToChapter,
      setScrollProgress,
      setFullscreen,
      setIsFullscreen: setFullscreen,
      setAutoplay,
      setIsAutoplay: setAutoplay,
      setChapterMenuOpen,
      setIsChapterMenuOpen: setChapterMenuOpen,
      setReducedMotion,
      setIsReducedMotion: setReducedMotion,
      setSelectedNode,
      setSelectedEvent,
      setIncident,
      updateIncidentStatus,
      toggleRemediationAction,
      setBudget,
      setOptimizationResult,
      resetRemediation,
    }),
    [
      state,
      navigateToChapter,
      setScrollProgress,
      setFullscreen,
      setAutoplay,
      setChapterMenuOpen,
      setReducedMotion,
      setSelectedNode,
      setSelectedEvent,
      setIncident,
      updateIncidentStatus,
      toggleRemediationAction,
      setBudget,
      setOptimizationResult,
      resetRemediation,
    ],
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePresentationStore(): PresentationContextValue {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error(
      'usePresentationStore must be used within a <PresentationProvider>',
    );
  }
  return ctx;
}
