import { MATERIALS } from "@/data/materialIndex";
import { ACCOUNT_IDS } from "@/data/accounts";
import { FIELD_IDS } from "@/data/criteria";
import { CHOOSE } from "@/data/measures";
import { SEGMENT_IDS } from "@/data/segments";
import { SKETCH_MIN, mentionsNeed } from "@/data/sketches";
import { CAND_IDS, ELEMENT_IDS } from "@/data/route2";
import { archOver, citesTailorFigure, funded, hasNumber, servedIds } from "@/lib/checks";
import { ARCH_IDS } from "@/data/route2";
import type { RouteNo } from "@/lib/routes";
import { parseAmount } from "@/lib/parseAmount";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b13" | "b14" | "b21" | "b22" | "b23" | "b31" | "b32" | "b33" | "b34" | "b35" | "b36";

/**
 * Blocks that deepen or repeat a skill a Core block already teaches, rather than sit on the shortest path to their route's own
 * objective. Collapsed by default via OptionalSection, never removed (CLAUDE.md #6), never required by the missing list or the
 * dossier ring (#35).
 * Route 1 ("understand the segments and decide where personalising pays"): Core 1.1 (read the criteria), 1.2 (does tailoring pay),
 * 2.1 (place twelve accounts in segments), 2.3 (choose and order measures). Optional 1.3, 1.4, 2.2.
 * Route 2 ("choose the segments to serve and decide although the data is incomplete"): Core 3.2 (rate and name the core), 3.5 (fund,
 * sequence and own the measures), 3.6 (the decision). Optional 3.1, 3.3, 3.4.
 */
export const OPTIONAL_BLOCKS: TaskBlockId[] = ["b13", "b14", "b22", "b31", "b33", "b34"];
export const isOptionalBlock = (b: TaskBlockId) => (OPTIONAL_BLOCKS as string[]).includes(b);

const len = (t: string) => t.trim().length;
export const MIN_SENTENCE = 40;
export const MIN_LINE = 30;

/** Which task blocks are complete. Complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  const { l1, r2 } = p;
  const sketchesOk = l1.sketches.every((s) => !!s.basis && len(s.text) >= SKETCH_MIN && mentionsNeed(s.text));
  const profilesOk =
    SEGMENT_IDS.every((s) => !!l1.profiles[s].value && !!l1.profiles[s].content && len(l1.profiles[s].need) >= MIN_SENTENCE) && l1.gaps.length >= 2 && len(l1.riskText) >= 20;
  const measuresOk =
    l1.chosen.length === CHOOSE &&
    l1.chosen.every((id) => l1.aims[id] !== undefined && !!l1.rel[id] && !!l1.dif[id] && !!l1.eco[id]) &&
    l1.order.length === CHOOSE &&
    l1.chosen.every((id) => l1.order.includes(id)) &&
    len(l1.why) >= 60;
  const served = servedIds(r2);
  const f = funded(r2);
  const archOk =
    f.length > 0 &&
    archOver(r2) === 0 &&
    f.every((id) => r2.start[id] != null && !!r2.owner[id] && len(r2.trigger[id] ?? "") >= 20 && hasNumber(r2.trigger[id] ?? "")) &&
    (ARCH_IDS.every((id) => r2.alloc[id]) || (len(r2.postponed) >= MIN_LINE && len(r2.pickup) >= 15 && hasNumber(r2.pickup)));
  return {
    b11: FIELD_IDS.every((id) => l1.sort[id] !== null) && len(l1.extraCrit) >= MIN_LINE,
    b12: (["F1", "F2", "F3"] as const).every((k) => parseAmount(l1.fig[k]) !== null) && len(l1.worth) >= MIN_SENTENCE && citesTailorFigure(l1.worth),
    b13: !!l1.tg && !!l1.diff && sketchesOk,
    b14: len(l1.reflect.simplify) >= MIN_LINE && len(l1.reflect.worth) >= MIN_LINE && len(l1.reflect.prioritise) >= MIN_LINE,
    b21: ACCOUNT_IDS.every((id) => l1.assign[id] !== null),
    b22: profilesOk,
    b23: measuresOk,
    b31: r2.crits.length === 3 && r2.crits.every((k) => len(r2.critText[k] ?? "") >= MIN_LINE),
    b32: CAND_IDS.every((id) => !!r2.attract[id] && !!r2.ability[id] && !!r2.roles[id]),
    b33: served.length > 0 && served.every((id) => !!r2.sales[id] && len(r2.prop[id] ?? "") >= MIN_SENTENCE),
    b34: served.length > 0 && served.every((id) => ELEMENT_IDS.every((el) => !!r2.grid[`${id}.${el}`])),
    b35: archOk,
    b36:
      !!r2.decision &&
      r2.assumptions.every((a) => len(a) >= MIN_LINE) &&
      !!r2.tripKpi &&
      parseAmount(r2.tripThreshold) !== null &&
      !!r2.tripMonth &&
      !!r2.tripAction &&
      len(r2.challenge) >= 60,
  };
}

const BLOCKS_OF: Record<RouteNo, TaskBlockId[]> = {
  1: ["b11", "b12", "b13", "b14", "b21", "b22", "b23"],
  2: ["b31", "b32", "b33", "b34", "b35", "b36"],
};

/** Dossier progress for one route: its Core cards marked read + its Core task blocks completed (Optional ones sit outside the ring, #35). */
export function dossierProgress(p: Persisted, route: RouteNo): { done: number; total: number } {
  const block = route === 1 ? "A" : "B";
  const cards = MATERIALS.filter((m) => m.block === block && !m.optional);
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const coreBlocks = BLOCKS_OF[route].filter((b) => !isOptionalBlock(b));
  const done = coreBlocks.filter((b) => tb[b]).length;
  return { done: read + done, total: cards.length + coreBlocks.length };
}
