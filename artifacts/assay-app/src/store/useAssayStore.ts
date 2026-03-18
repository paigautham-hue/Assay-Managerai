import { create } from 'zustand';
import type { InterviewSession, AssayReport, InterviewSetup, TranscriptEntry, Observation, GateName } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AssayStore {
  currentView: 'home' | 'setup' | 'interview' | 'processing' | 'report';
  session: InterviewSession | null;
  report: AssayReport | null;
  reports: AssayReport[];
  isLoading: boolean;
  error: string | null;

  setView: (view: AssayStore['currentView']) => void;
  createSession: (setup: InterviewSetup) => void;
  updateSessionStatus: (status: InterviewSession['status']) => void;
  addTranscriptEntry: (entry: Omit<TranscriptEntry, 'id'>) => void;
  addObservation: (obs: Omit<Observation, 'id'>) => void;
  setReport: (report: AssayReport) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const DEFAULT_CORE_GATES: GateName[] = ['integrity', 'accountability', 'harm_pattern', 'context_misalignment'];

export const useAssayStore = create<AssayStore>((set, get) => ({
  currentView: 'home',
  session: null,
  report: null,
  reports: [],
  isLoading: false,
  error: null,

  setView: (view) => set({ currentView: view }),

  createSession: (setup) => {
    const session: InterviewSession = {
      id: uuidv4(),
      setup: {
        ...setup,
        activeGates: [...DEFAULT_CORE_GATES, ...setup.activeGates.filter(g => !DEFAULT_CORE_GATES.includes(g))],
      },
      status: 'preparing',
      transcript: [],
      observations: [],
      voiceProvider: 'openai',
    };
    set({ session, currentView: 'interview' });
  },

  updateSessionStatus: (status) => {
    const session = get().session;
    if (!session) return;
    set({
      session: {
        ...session,
        status,
        startedAt: status === 'active' ? new Date().toISOString() : session.startedAt,
        endedAt: status === 'completed' ? new Date().toISOString() : session.endedAt,
      },
    });
  },

  addTranscriptEntry: (entry) => {
    const session = get().session;
    if (!session) return;
    set({
      session: {
        ...session,
        transcript: [...session.transcript, { ...entry, id: uuidv4() }],
      },
    });
  },

  addObservation: (obs) => {
    const session = get().session;
    if (!session) return;
    set({
      session: {
        ...session,
        observations: [...session.observations, { ...obs, id: uuidv4() }],
      },
    });
  },

  setReport: (report) => {
    set((state) => ({
      report,
      reports: [...state.reports, report],
      currentView: 'report',
    }));
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ currentView: 'home', session: null, report: null, isLoading: false, error: null }),
}));
