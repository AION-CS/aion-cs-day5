"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ACCOUNT_IDS } from "@/data/accounts";
import type { AccountId, GapId } from "@/data/accounts";
import { FIELD_IDS } from "@/data/criteria";
import type { CritTag, FieldId } from "@/data/criteria";
import type { MeasureId } from "@/data/measures";
import type { ContentId, SegmentId, Value } from "@/data/segments";
import { SKETCH_COUNT } from "@/data/sketches";
import type { Basis, DiffId, TgId } from "@/data/sketches";
import type { FigureId } from "@/data/tailoring";
import type { ArchId, CritId, DecisionId, KpiId, Level, OwnerId, Role, SalesModel } from "@/data/route2";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { FIGURE_BUILDERS, modelParts } from "@/lib/calcBuilder";
import type { RouteNo } from "@/lib/routes";

export const STORAGE_KEY = "cs-d5-v1";
const HISTORY_CAP = 100;

/** 0 means not chosen yet. */
export type Score = 0 | 1 | 2 | 3;

export type SortMap = Record<FieldId, CritTag | null>;
export type AssignMap = Record<AccountId, SegmentId | null>;
export type SketchRow = { basis: Basis | null; text: string };
export type Profile = { value: Value | null; need: string; content: ContentId | null };

/** Route 1 · Levels 1 and 2 — the Segment Analysis File. */
export type L1State = {
  /** Block 1.1 */
  sort: SortMap;
  sortHistory: SortMap[];
  sortFuture: SortMap[];
  sortChecks: number;
  sortResult: { holds: number; placed: number } | null;
  sortClue: boolean;
  sortReasoning: boolean;
  /** A criterion of the learner's own, with its kind (Block 1.1). */
  extraCrit: string;
  /** Block 1.2 */
  fig: Record<FigureId, string>;
  figFlagged: FigureId[];
  figClue: Record<string, boolean>;
  /** The formula calculators' parts, keyed "F1.proposals". */
  parts: Record<string, string>;
  partFlags: string[];
  worth: string;
  worthFlagged: boolean;
  worthClue: boolean;
  /** Block 1.3 */
  tg: TgId | null;
  diff: DiffId | null;
  choiceFlags: string[];
  choiceChecked: boolean;
  choiceClue: boolean;
  sketches: SketchRow[];
  sketchFlagged: number[];
  sketchChecked: boolean;
  sketchClue: boolean;
  /** Block 1.4 */
  reflect: { simplify: string; worth: string; prioritise: string };
  /** Block 2.1 */
  assign: AssignMap;
  assignHistory: AssignMap[];
  assignFuture: AssignMap[];
  assignChecks: number;
  assignResult: { holds: number; placed: number } | null;
  assignClue: boolean;
  assignReasoning: boolean;
  /** Block 2.2 */
  profiles: Record<SegmentId, Profile>;
  profResult: { value: number; content: number; filled: number } | null;
  profClue: boolean;
  gaps: GapId[];
  gapResult: { holds: number; chosen: number } | null;
  riskText: string;
  /** Block 2.3 */
  chosen: MeasureId[];
  aims: Record<string, SegmentId[]>;
  rel: Record<string, Score>;
  dif: Record<string, Score>;
  eco: Record<string, Score>;
  /** Flags from the last check: "compliance.aims", "lane.eco". */
  measureFlags: string[];
  order: MeasureId[];
  why: string;
  /** Every check requested in Route 1, printed in the export footer. */
  checks: number;
};

/** Route 2 · Level 3 — the Segment Strategy Memo. */
export type R2State = {
  /** Block 3.1 */
  crits: CritId[];
  critText: Record<string, string>;
  critFlagged: boolean;
  critClue: boolean;
  /** Block 3.2 — keyed by candidate segment */
  attract: Record<string, Score>;
  ability: Record<string, Score>;
  roles: Record<string, Role | null>;
  rateResult: { holds: number; total: number } | null;
  rateClue: boolean;
  roleFlags: string[];
  /** Block 3.3 — keyed by candidate segment */
  sales: Record<string, SalesModel | null>;
  prop: Record<string, string>;
  salesFlags: string[];
  salesClue: boolean;
  /** Block 3.4 — keyed "segment.element" */
  grid: Record<string, Level>;
  gridFlags: string[];
  gridResult: { holds: number; total: number } | null;
  gridClue: boolean;
  /** Block 3.5 — keyed by item id */
  alloc: Record<string, boolean>;
  start: Record<string, number | null>;
  owner: Record<string, OwnerId | null>;
  trigger: Record<string, string>;
  postponed: string;
  pickup: string;
  seqResult: { holds: number; total: number } | null;
  seqClue: boolean;
  /** Block 3.6 */
  decision: DecisionId | null;
  decisionFlagged: boolean;
  assumptions: string[];
  tripKpi: KpiId | null;
  tripThreshold: string;
  tripMonth: number | null;
  tripAction: "" | "scale" | "adjust" | "stop";
  tripFlags: string[];
  challenge: string;
  checks: number;
};

export type Persisted = {
  participant: { name: string };
  ui: { bannerDismissed: Record<string, boolean>; sectionsRead: Record<string, boolean>; lang: "en" | "de" };
  l1: L1State;
  r2: R2State;
};

type Session = {
  mentorUnlocked: boolean;
  /** Bumped by a reset or a mentor fill so components holding local state remount clean. */
  resetCount: number;
};

type Patch<T> = Partial<T> | ((s: T) => Partial<T>);

type Actions = {
  setParticipant: (patch: Partial<Persisted["participant"]>) => void;
  dismissBanner: (routeKey: string) => void;
  toggleRead: (cardId: string, value?: boolean) => void;
  setLang: (l: "en" | "de") => void;

  patchL1: (p: Patch<L1State>) => void;
  patchR2: (p: Patch<R2State>) => void;

  // placement exercises with undo and redo
  placeField: (id: FieldId, tag: CritTag | null) => void;
  undoSort: () => void;
  redoSort: () => void;
  placeAccount: (id: AccountId, seg: SegmentId | null) => void;
  undoAssign: () => void;
  redoAssign: () => void;

  setMentorUnlocked: (v: boolean) => void;
  mentorFill: () => void;
  resetRoute: (route: RouteNo | null) => void;
};

const emptySort = (): SortMap => Object.fromEntries(FIELD_IDS.map((id) => [id, null])) as SortMap;
const emptyAssign = (): AssignMap => Object.fromEntries(ACCOUNT_IDS.map((id) => [id, null])) as AssignMap;
const emptyProfile = (): Profile => ({ value: null, need: "", content: null });

export const emptyL1 = (): L1State => ({
  sort: emptySort(),
  sortHistory: [],
  sortFuture: [],
  sortChecks: 0,
  sortResult: null,
  sortClue: false,
  sortReasoning: false,
  extraCrit: "",
  fig: { F1: "", F2: "", F3: "" },
  figFlagged: [],
  figClue: {},
  parts: {},
  partFlags: [],
  worth: "",
  worthFlagged: false,
  worthClue: false,
  tg: null,
  diff: null,
  choiceFlags: [],
  choiceChecked: false,
  choiceClue: false,
  sketches: Array.from({ length: SKETCH_COUNT }, () => ({ basis: null, text: "" })),
  sketchFlagged: [],
  sketchChecked: false,
  sketchClue: false,
  reflect: { simplify: "", worth: "", prioritise: "" },
  assign: emptyAssign(),
  assignHistory: [],
  assignFuture: [],
  assignChecks: 0,
  assignResult: null,
  assignClue: false,
  assignReasoning: false,
  profiles: { assure: emptyProfile(), handsoff: emptyProfile(), scale: emptyProfile() },
  profResult: null,
  profClue: false,
  gaps: [],
  gapResult: null,
  riskText: "",
  chosen: [],
  aims: {},
  rel: {},
  dif: {},
  eco: {},
  measureFlags: [],
  order: [],
  why: "",
  checks: 0,
});

export const emptyR2 = (): R2State => ({
  crits: [],
  critText: {},
  critFlagged: false,
  critClue: false,
  attract: {},
  ability: {},
  roles: {},
  rateResult: null,
  rateClue: false,
  roleFlags: [],
  sales: {},
  prop: {},
  salesFlags: [],
  salesClue: false,
  grid: {},
  gridFlags: [],
  gridResult: null,
  gridClue: false,
  alloc: {},
  start: {},
  owner: {},
  trigger: {},
  postponed: "",
  pickup: "",
  seqResult: null,
  seqClue: false,
  decision: null,
  decisionFlagged: false,
  assumptions: ["", "", ""],
  tripKpi: null,
  tripThreshold: "",
  tripMonth: null,
  tripAction: "",
  tripFlags: [],
  challenge: "",
  checks: 0,
});

const emptyPersisted = (): Persisted => ({
  participant: { name: "" },
  ui: { bannerDismissed: {}, sectionsRead: {}, lang: "en" },
  l1: emptyL1(),
  r2: emptyR2(),
});

const pushCapped = <T,>(list: T[], item: T) => [...list, item].slice(-HISTORY_CAP);
const resolve = <T,>(p: Patch<T>, s: T): Partial<T> => (typeof p === "function" ? (p as (x: T) => Partial<T>)(s) : p);

const isPlain = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * A deep merge of a saved value onto the defaults: every field an older or partial blob lacks comes from the defaults, a value of the
 * wrong type is dropped, and an empty default array or object takes what was saved (a history, a list of chosen ids).
 */
export function mergeDefaults<T>(base: T, saved: unknown): T {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    if (base.length === 0) return saved as T;
    return base.map((b, i) => mergeDefaults(b, saved[i])) as T;
  }
  if (isPlain(base)) {
    if (!isPlain(saved)) return base;
    const keys = Object.keys(base);
    // an empty default object is a free-form map (parts, ratings): keep every saved key
    if (keys.length === 0) return { ...saved } as T;
    const out: Record<string, unknown> = { ...(saved as Record<string, unknown>) };
    for (const k of keys) out[k] = mergeDefaults((base as Record<string, unknown>)[k], (saved as Record<string, unknown>)[k]);
    return out as T;
  }
  return typeof saved === typeof base || base === null ? (saved as T) : base;
}

export const useStore = create<Persisted & Session & Actions>()(
  persist(
    (set) => ({
      ...emptyPersisted(),
      mentorUnlocked: false,
      resetCount: 0,

      setParticipant: (patch) => set((s) => ({ participant: { ...s.participant, ...patch } })),
      dismissBanner: (routeKey) => set((s) => ({ ui: { ...s.ui, bannerDismissed: { ...s.ui.bannerDismissed, [routeKey]: true } } })),
      toggleRead: (cardId, value) =>
        set((s) => ({ ui: { ...s.ui, sectionsRead: { ...s.ui.sectionsRead, [cardId]: value ?? !s.ui.sectionsRead[cardId] } } })),
      setLang: (l) => set((s) => ({ ui: { ...s.ui, lang: l } })),

      patchL1: (p) => set((s) => ({ l1: { ...s.l1, ...resolve(p, s.l1) } })),
      patchR2: (p) => set((s) => ({ r2: { ...s.r2, ...resolve(p, s.r2) } })),

      // --- Block 1.1: sort the CRM fields -----------------------------------------
      placeField: (id, tag) =>
        set((s) => {
          const before = s.l1.sort;
          if (before[id] === tag) return {};
          return { l1: { ...s.l1, sort: { ...before, [id]: tag }, sortHistory: pushCapped(s.l1.sortHistory, before), sortFuture: [], sortResult: null } };
        }),
      undoSort: () =>
        set((s) => {
          const prev = s.l1.sortHistory[s.l1.sortHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, sort: prev, sortHistory: s.l1.sortHistory.slice(0, -1), sortFuture: pushCapped(s.l1.sortFuture, s.l1.sort), sortResult: null } };
        }),
      redoSort: () =>
        set((s) => {
          const next = s.l1.sortFuture[s.l1.sortFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, sort: next, sortHistory: pushCapped(s.l1.sortHistory, s.l1.sort), sortFuture: s.l1.sortFuture.slice(0, -1), sortResult: null } };
        }),

      // --- Block 2.1: assign the accounts ------------------------------------------
      placeAccount: (id, seg) =>
        set((s) => {
          const before = s.l1.assign;
          if (before[id] === seg) return {};
          return {
            l1: {
              ...s.l1,
              assign: { ...before, [id]: seg },
              assignHistory: pushCapped(s.l1.assignHistory, before),
              assignFuture: [],
              assignResult: null,
              // the segment values are read off this assignment, so a change clears their last check
              profResult: null,
            },
          };
        }),
      undoAssign: () =>
        set((s) => {
          const prev = s.l1.assignHistory[s.l1.assignHistory.length - 1];
          if (!prev) return {};
          return { l1: { ...s.l1, assign: prev, assignHistory: s.l1.assignHistory.slice(0, -1), assignFuture: pushCapped(s.l1.assignFuture, s.l1.assign), assignResult: null, profResult: null } };
        }),
      redoAssign: () =>
        set((s) => {
          const next = s.l1.assignFuture[s.l1.assignFuture.length - 1];
          if (!next) return {};
          return { l1: { ...s.l1, assign: next, assignHistory: pushCapped(s.l1.assignHistory, s.l1.assign), assignFuture: s.l1.assignFuture.slice(0, -1), assignResult: null, profResult: null } };
        }),

      setMentorUnlocked: (v) => set({ mentorUnlocked: v }),

      // Mentor autofill: every model answer in Routes 1 and 2, plus the participant name if it is empty, so each document can be exported straight away.
      mentorFill: () =>
        set((s) => {
          const l1: L1State = { ...emptyL1(), ...KEY_L1(), parts: modelParts(FIGURE_BUILDERS) };
          const r2: R2State = { ...emptyR2(), ...KEY_R2() };
          const participant = { name: s.participant.name.trim() ? s.participant.name : "Mentor Check" };
          return { participant, l1, r2, resetCount: s.resetCount + 1 };
        }),

      // One route's state (the participant strip, the language and the other route stay).
      resetRoute: (route) =>
        set((s) => {
          const prefix = route === 1 ? "A" : route === 2 ? "B" : "";
          const keep = (k: string) => (route === null ? false : !k.startsWith(prefix));
          const sectionsRead = Object.fromEntries(Object.entries(s.ui.sectionsRead).filter(([k]) => keep(k)));
          const bannerDismissed = { ...s.ui.bannerDismissed };
          if (route === null) for (const k of Object.keys(bannerDismissed)) delete bannerDismissed[k];
          else delete bannerDismissed[`r${route}`];
          return {
            l1: route === null || route === 1 ? emptyL1() : s.l1,
            r2: route === null || route === 2 ? emptyR2() : s.r2,
            ui: { bannerDismissed, sectionsRead, lang: s.ui.lang },
            resetCount: s.resetCount + 1,
          };
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Session-only flags (mentor unlock, reset counter) never persist.
      partialize: (s) => ({ participant: s.participant, ui: s.ui, l1: s.l1, r2: s.r2 }),
      // Any change to the persisted shape bumps `version` and adds a step here; `merge` below then fills every field an older
      // blob lacks from the defaults. Version 1 is the first shape of Day 5 (its own storage key, so nothing older to migrate).
      migrate: (persisted) => (persisted ?? {}) as Persisted,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const merged = mergeDefaults(emptyPersisted(), p);
        merged.ui.lang = merged.ui.lang === "de" ? "de" : "en";
        return { ...current, ...merged };
      },
    },
  ),
);

/**
 * The store is created with `skipHydration`, so the server render and the first client paint both see the
 * defaults (no hydration mismatch). <StoreHydrator/> reads localStorage once after mount. This hook reports
 * when it has finished, for UI that must not flash a default (a dismissed banner, a read mark).
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => setHydrated(true));
    if (useStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

export function rehydrateStore() {
  return useStore.persist.rehydrate();
}
