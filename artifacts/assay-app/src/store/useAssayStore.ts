import { create } from 'zustand';
import type { InterviewSession, AssayReport, InterviewSetup, TranscriptEntry, Observation, GateName } from '../types';
import type { ProsodyData, EmotionDataPoint } from '../lib/emotionEngine';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = import.meta.env.BASE_URL || '/';
const apiUrl = (path: string) => `${BASE_URL}api/${path}`;

async function dbPost(path: string, body: unknown): Promise<void> {
  try {
    await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.warn(`[store] dbPost ${path} failed:`, err);
  }
}

async function dbPatch(path: string, body: unknown): Promise<void> {
  try {
    await fetch(apiUrl(path), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.warn(`[store] dbPatch ${path} failed:`, err);
  }
}

const DEFAULT_CORE_GATES: GateName[] = ['integrity', 'accountability', 'harm_pattern', 'context_misalignment'];

interface AssayStore {
  currentView: 'home' | 'setup' | 'interview' | 'processing' | 'report';
  session: InterviewSession | null;
  report: AssayReport | null;
  reports: AssayReport[];
  isLoading: boolean;
  error: string | null;
  reportsLoaded: boolean;
  emotionTimeline: EmotionDataPoint[];

  setView: (view: AssayStore['currentView']) => void;
  createSession: (setup: InterviewSetup) => Promise<void>;
  updateSessionStatus: (status: InterviewSession['status']) => void;
  addTranscriptEntry: (entry: Omit<TranscriptEntry, 'id'>) => void;
  addObservation: (obs: Omit<Observation, 'id'>) => void;
  addEmotionDataPoint: (point: EmotionDataPoint) => void;
  setProsodyData: (data: ProsodyData) => void;
  setSession: (session: InterviewSession) => void;
  setReport: (report: AssayReport) => void;
  loadReports: () => Promise<void>;
  loadReportsFresh: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAssayStore = create<AssayStore>((set, get) => ({
  currentView: 'home',
  session: null,
  report: null,
  reports: [],
  isLoading: false,
  error: null,
  reportsLoaded: false,
  emotionTimeline: [],

  setView: (view) => set({ currentView: view }),

  createSession: async (setup) => {
    const id = uuidv4();
    const session: InterviewSession = {
      id,
      setup: {
        ...setup,
        activeGates: [...DEFAULT_CORE_GATES, ...setup.activeGates.filter(g => !DEFAULT_CORE_GATES.includes(g))],
      },
      status: 'preparing',
      transcript: [],
      observations: [],
      voiceProvider: 'gemini',
    };
    set({ session, currentView: 'interview' });

    await dbPost('sessions', {
      id,
      setup: session.setup,
      status: 'preparing',
      voiceProvider: 'gemini',
    });
  },

  updateSessionStatus: (status) => {
    const session = get().session;
    if (!session) return;
    const now = new Date().toISOString();
    const startedAt = status === 'active' ? now : session.startedAt;
    const endedAt = status === 'completed' ? now : session.endedAt;
    set({
      session: { ...session, status, startedAt, endedAt },
    });

    dbPatch(`sessions/${session.id}`, { status, startedAt, endedAt });
  },

  addTranscriptEntry: (entry) => {
    const session = get().session;
    if (!session) return;
    const id = uuidv4();
    set({
      session: {
        ...session,
        transcript: [...session.transcript, { ...entry, id }],
      },
    });

    dbPost(`sessions/${session.id}/transcript`, { ...entry, id });
  },

  addObservation: (obs) => {
    const session = get().session;
    if (!session) return;
    const id = uuidv4();
    set({
      session: {
        ...session,
        observations: [...session.observations, { ...obs, id }],
      },
    });

    dbPost(`sessions/${session.id}/observations`, { ...obs, id });
  },

  addEmotionDataPoint: (point) => {
    set((state) => ({ emotionTimeline: [...state.emotionTimeline, point] }));
  },

  setProsodyData: (data) => {
    const session = get().session;
    if (!session) return;
    set({ session: { ...session, prosodyData: data } });
  },

  // Directly hydrate a session from an external source (e.g. candidate invite flow
  // where the server already created the DB record).
  setSession: (session) => {
    set({ session, currentView: 'interview' });
  },

  setReport: (report) => {
    set((state) => ({
      report,
      reports: state.reports.some(r => r.id === report.id)
        ? state.reports.map(r => r.id === report.id ? report : r)
        : [...state.reports, report],
      currentView: 'report',
    }));

    dbPost('reports', report);
  },

  loadReports: async () => {
    if (get().reportsLoaded) return;
    try {
      set({ isLoading: true });
      const res = await fetch(apiUrl('reports'), { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to load reports: ${res.status}`);
      const reports: AssayReport[] = await res.json();
      set({ reports, reportsLoaded: true, isLoading: false });
    } catch (err) {
      console.warn('Could not load reports from DB:', err);
      set({ isLoading: false, reportsLoaded: false });
    }
  },

  loadReportsFresh: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch(apiUrl('reports'), { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to load reports: ${res.status}`);
      const reports: AssayReport[] = await res.json();
      set({ reports, reportsLoaded: true, isLoading: false });
    } catch (err) {
      console.warn('Could not load reports from DB:', err);
      set({ isLoading: false });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set({ currentView: 'home', session: null, report: null, reports: [], isLoading: false, error: null, emotionTimeline: [], reportsLoaded: false }),
}));
