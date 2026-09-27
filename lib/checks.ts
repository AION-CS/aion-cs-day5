import { ACCOUNTS, ACCOUNT_BY_ID, ACCOUNT_IDS, GAP_BY_ID } from "@/data/accounts";
import type { AccountId, GapId } from "@/data/accounts";
import { FIELDS } from "@/data/criteria";
import { CONTENT_TRUTH, SEGMENT_IDS, valueOf } from "@/data/segments";
import type { SegmentId, Value } from "@/data/segments";
import { DIFF_TRUTH, TG_TRUTH, mentionsNeed, SKETCH_MIN } from "@/data/sketches";
import { DATACLOUD, TAILOR } from "@/data/tailoring";
import { MEASURE_BY_ID, costPerAccount, evBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import {
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  CAND_BY_ID,
  CAND_IDS,
  COST_SHARE_MAX,
  CRIT_MUST,
  ELEMENT_IDS,
  KPI_BY_ID,
  LEVEL_COST,
  MODEL_ABILITY,
  MODEL_ACCEPT,
  MODEL_ATTRACT,
  R2_BUDGET,
  costPerDeal,
  roleOf,
  tailorLimit,
} from "@/data/route2";
import type { ArchId, Bucket, CandId, ElementId, Level, Role } from "@/data/route2";
import { extractAmounts, parseAmount } from "@/lib/parseAmount";
import type { L1State, R2State, SortMap, AssignMap } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

/** How many placed fields hold. Never says which: with three tags, naming the wrong ones would name the answer. */
export function sortHolds(sort: SortMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const f of FIELDS) {
    const t = sort[f.id];
    if (t === null || t === undefined) continue;
    placed++;
    if (t === f.truth) holds++;
  }
  return { holds, placed };
}

/* ------------------------------------------------------------------ Block 1.2 */

/** Every value the effort-and-benefit calculation derives: what a sentence on "is it worth it" may rest on. */
export const TAILOR_DERIVED = [TAILOR.f1, TAILOR.f2, TAILOR.f3, TAILOR.netAssure, DATACLOUD.cost, Math.abs(TAILOR.f3)];

export function citesTailorFigure(text: string): boolean {
  return extractAmounts(text).some((n) => TAILOR_DERIVED.some((d) => Math.abs(Math.abs(n) - Math.abs(d)) < 0.5));
}

/** The figure checked against the learner's entry: 0.5 euro of rounding at most. */
export function figMatches(entered: string, answer: number): boolean {
  const v = parseAmount(entered);
  return v !== null && Math.abs(v - answer) < 0.5;
}

/* ------------------------------------------------------------------ Block 1.3 */

export function choiceFlags(l1: L1State): string[] {
  const out: string[] = [];
  if (l1.tg && l1.tg !== TG_TRUTH) out.push("tg");
  if (l1.diff && l1.diff !== DIFF_TRUTH) out.push("diff");
  return out;
}

/** Rows of the segment sketches that do not yet meet the floor: a basis, a need, enough words; and no second firmographic-only row. */
export function sketchFlags(l1: L1State): number[] {
  let firmo = 0;
  const out: number[] = [];
  l1.sketches.forEach((s, i) => {
    const t = s.text.trim();
    let bad = !s.basis || t.length < SKETCH_MIN || !mentionsNeed(t);
    if (s.basis === "firmo") {
      firmo++;
      if (firmo > 1) bad = true;
    }
    if (bad) out.push(i);
  });
  return out;
}

/* ------------------------------------------------------------------ Block 2.1 and 2.2 */

export function assignHolds(assign: AssignMap): { holds: number; placed: number } {
  let holds = 0;
  let placed = 0;
  for (const id of ACCOUNT_IDS) {
    const t = assign[id];
    if (t === null || t === undefined) continue;
    placed++;
    if (t === ACCOUNT_BY_ID[id].truth) holds++;
  }
  return { holds, placed };
}

export type Tally = { count: Record<SegmentId, number>; acv: Record<SegmentId, number>; placed: number };

/** The learner's own tally: how many accounts they placed in each segment, and the sum of those accounts' potential ACV. */
export function tallyOf(assign: AssignMap): Tally {
  const count = { assure: 0, handsoff: 0, scale: 0 } as Record<SegmentId, number>;
  const acv = { ...count };
  let placed = 0;
  for (const a of ACCOUNTS) {
    const s = assign[a.id];
    if (!s) continue;
    placed++;
    count[s]++;
    acv[s] += a.acv;
  }
  return { count, acv, placed };
}
export const allAssigned = (assign: AssignMap) => ACCOUNT_IDS.every((id) => !!assign[id]);
export const ownValue = (s: SegmentId, t: Tally): Value => valueOf(t.acv[s]);

export type ProfileCheck = { value: number; content: number; filled: number; rowsValue: Record<SegmentId, boolean>; rowsContent: Record<SegmentId, boolean> };
export function profileCheck(l1: L1State): ProfileCheck {
  const t = tallyOf(l1.assign);
  const rowsValue = {} as Record<SegmentId, boolean>;
  const rowsContent = {} as Record<SegmentId, boolean>;
  let filled = 0;
  for (const s of SEGMENT_IDS) {
    const p = l1.profiles[s];
    rowsValue[s] = !!p.value && p.value === ownValue(s, t);
    rowsContent[s] = !!p.content && p.content === CONTENT_TRUTH[s];
    if (p.value && p.content) filled++;
  }
  return {
    value: SEGMENT_IDS.filter((s) => rowsValue[s]).length,
    content: SEGMENT_IDS.filter((s) => rowsContent[s]).length,
    filled,
    rowsValue,
    rowsContent,
  };
}

export function gapHolds(gaps: GapId[]): { holds: number; chosen: number } {
  return { holds: gaps.filter((g) => GAP_BY_ID[g].useful).length, chosen: gaps.length };
}

/* ------------------------------------------------------------------ Block 2.3 */

/**
 * The segments a learner names for a measure hold when they are all among the measure's real targets and at least one is named.
 * A measure with no real target (industry pages, a discount, tracking emails) holds only when nothing is named.
 */
export function aimsHold(id: MeasureId, aims: SegmentId[]): boolean {
  const truth = MEASURE_BY_ID[id].targets;
  if (truth.length === 0) return aims.length === 0;
  return aims.length > 0 && aims.every((a) => truth.includes(a));
}
export const ecoHolds = (id: MeasureId, eco: number) => eco === evBucket(costPerAccount(id));

export const measureScore = (l1: L1State, id: MeasureId) => (l1.rel[id] || 0) * (l1.dif[id] || 0) * (l1.eco[id] || 0);
export const measureScored = (l1: L1State, id: MeasureId) => !!l1.rel[id] && !!l1.dif[id] && !!l1.eco[id];
export const totalCost = (ids: MeasureId[]) => ids.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);

/** Every segment and whether the chosen measures reach it (by what each measure really serves). */
export function coverage(l1: L1State): { segment: SegmentId; covered: boolean }[] {
  return SEGMENT_IDS.map((s) => ({ segment: s, covered: l1.chosen.some((id) => MEASURE_BY_ID[id].targets.includes(s)) }));
}

/** Pairs where a lower score sits above a higher one in the learner's order. */
export function orderInversions(l1: L1State): { high: MeasureId; low: MeasureId }[] {
  const out: { high: MeasureId; low: MeasureId }[] = [];
  const ord = l1.order.filter((id) => l1.chosen.includes(id));
  for (let i = 0; i < ord.length; i++)
    for (let j = i + 1; j < ord.length; j++) if (measureScored(l1, ord[i]) && measureScored(l1, ord[j]) && measureScore(l1, ord[i]) < measureScore(l1, ord[j])) out.push({ high: ord[j], low: ord[i] });
  return out;
}

/* ------------------------------------------------------------------ Route 2 */

export const hasNumber = (t: string) => /\d/.test(t);

/** 3.1: the three criteria must include one for each axis: the profit pool and the ability to win. */
export function critsHold(r2: R2State): { pool: boolean; win: boolean } {
  return { pool: r2.crits.includes(CRIT_MUST[0]), win: r2.crits.includes(CRIT_MUST[1]) };
}

/** 3.2: how many of the ten bucket ratings follow the printed data by the rule of B1. Never says which. */
export function rateHolds(r2: R2State): { holds: number; total: number } {
  let holds = 0;
  for (const id of CAND_IDS) {
    if (r2.attract[id] === MODEL_ATTRACT[id]) holds++;
    if (r2.ability[id] === MODEL_ABILITY[id]) holds++;
  }
  return { holds, total: CAND_IDS.length * 2 };
}
/** 3.2: roles that contradict the learner's own ratings under the role rule, and a core count other than two. */
export function roleFlagsOf(r2: R2State): string[] {
  const out: string[] = [];
  for (const id of CAND_IDS) {
    const a = r2.attract[id];
    const b = r2.ability[id];
    const r = r2.roles[id];
    if (!r || !a || !b) continue;
    if (r !== roleOf(a as Bucket, b as Bucket)) out.push(id);
  }
  return out;
}
export const coreIds = (r2: R2State): CandId[] => CAND_IDS.filter((id) => r2.roles[id] === "core");
export const servedIds = (r2: R2State): CandId[] => CAND_IDS.filter((id) => r2.roles[id] === "core" || r2.roles[id] === "standard");
export const roleOfCand = (r2: R2State, id: CandId): Role | null => r2.roles[id] ?? null;

/** 3.3: the segments whose sales model does not defend (cost rule and decision behaviour). */
export function salesFlagsOf(r2: R2State): string[] {
  return servedIds(r2).filter((id) => r2.sales[id] && !MODEL_ACCEPT[id].includes(r2.sales[id]!));
}
export const costShare = (id: CandId, r2: R2State) => {
  const m = r2.sales[id];
  return m ? (costPerDeal(m, CAND_BY_ID[id].acv) / CAND_BY_ID[id].acv) * 100 : null;
};
export { COST_SHARE_MAX };

/** 3.4: the tailoring cost per account of one segment's column. */
export const levelAt = (r2: R2State, id: CandId, el: ElementId): Level => r2.grid[`${id}.${el}`] ?? "std";
export const tailorCost = (r2: R2State, id: CandId) => ELEMENT_IDS.reduce((s, el) => s + LEVEL_COST[levelAt(r2, id, el)], 0);
/**
 * The three rules of B3 the grid is checked against, per served segment: the platform stays standard; a segment served as standard has
 * no individual element; the tailoring cost stays within the limit. Returns the flagged cells ("id.platform", "id.ind", "id.cost").
 */
export function gridFlagsOf(r2: R2State): string[] {
  const out: string[] = [];
  for (const id of servedIds(r2)) {
    if (levelAt(r2, id, "platform") !== "std") out.push(`${id}.platform`);
    if (r2.roles[id] === "standard" && ELEMENT_IDS.some((el) => levelAt(r2, id, el) === "ind")) out.push(`${id}.ind`);
    if (tailorCost(r2, id) > tailorLimit(id)) out.push(`${id}.cost`);
  }
  return out;
}

/** 3.5 */
export const funded = (r2: R2State): ArchId[] => ARCH_IDS.filter((id) => r2.alloc[id]);
export const archCost = (r2: R2State) => funded(r2).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
export const archOver = (r2: R2State) => Math.max(0, archCost(r2) - R2_BUDGET);
export const archLeft = (r2: R2State) => R2_BUDGET - archCost(r2);
/** Items funded for a segment the learner deprioritised in 3.2. */
export const deprioFunded = (r2: R2State): ArchId[] =>
  funded(r2).filter((id) => {
    const s = ARCH_BY_ID[id].serves;
    return s !== "all" && s.every((c) => r2.roles[c] === "deprio");
  });

/**
 * The three rules of Materi B5 that the learner's sequence is checked against: the segment data is funded and starts no later than the
 * first other item (baseline first); the total is inside the budget; nothing is funded for a deprioritised segment.
 */
export function seqRules(r2: R2State): { baseline: boolean; budget: boolean; focus: boolean; hasBaseline: boolean } {
  const f = funded(r2);
  const hasBaseline = f.includes(BASELINE_ITEM);
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const base = r2.start[BASELINE_ITEM];
  const first = Math.min(...others.map((id) => r2.start[id] ?? 99));
  const baseline = hasBaseline && base != null && (others.length === 0 || base <= first);
  return { baseline, budget: archOver(r2) === 0 && f.length > 0, focus: deprioFunded(r2).length === 0, hasBaseline };
}

/** 3.6: a tripwire whose metric is a customer response and whose threshold is better than the baseline. */
export function tripFlagsOf(r2: R2State): string[] {
  const out: string[] = [];
  if (r2.tripKpi && !KPI_BY_ID[r2.tripKpi].behaviour) out.push("kpi");
  if (r2.tripKpi && r2.tripThreshold.trim()) {
    const v = parseAmount(r2.tripThreshold);
    const k = KPI_BY_ID[r2.tripKpi];
    if (v !== null && (k.better === "up" ? v <= k.baseline : v >= k.baseline)) out.push("threshold");
  }
  return out;
}

export type { AccountId };
