import { bi, t } from "@/lib/lang";
import { TASK1_MINUTES, TASK2_MINUTES } from "@/lib/routes";

/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "B1" | "B2" | "B3" | "B4" | "B5";
export type Block = "A" | "B";

export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number; optional?: boolean };

/**
 * Day 5 has two routes (CLAUDE.md #30). Materi A is the material of Route 1 (Levels 1 and 2 on one case): seven cards,
 * 60 minutes. Materi B is the material of Route 2 (Level 3): five cards, 60 minutes.
 *
 * `optional: true` marks a card that no Core task block (lib/progress.ts OPTIONAL_BLOCKS) draws on: collapsed by default via
 * OptionalSection, one click to open, never removed. A card a Core block needs stays required even if an Optional block also cites it.
 */
export const MATERIALS: MaterialMeta[] = bi([
  { id: "A1" as MaterialId, block: "A" as Block, title: t("No one-size-fits-all customer: why segment at all", "Es gibt keinen Einheitskunden: warum überhaupt segmentieren"), minutes: 9, optional: true },
  { id: "A2" as MaterialId, block: "A" as Block, title: t("Target group and segment: from segment to need to offer", "Zielgruppe und Segment: vom Segment zum Bedarf zum Angebot"), minutes: 8, optional: true },
  { id: "A3" as MaterialId, block: "A" as Block, title: t("Segmentation criteria: firmographic, behaviour, need", "Segmentierungskriterien: firmografisch, Verhalten, Bedarf"), minutes: 9 },
  { id: "A4" as MaterialId, block: "A" as Block, title: t("Personalisation: what to tailor, and when it pays", "Personalisierung: was man zuschneidet, und wann es sich lohnt"), minutes: 9 },
  { id: "A5" as MaterialId, block: "A" as Block, title: t("Three needs-based segments in B2B cloud", "Drei bedarfsbasierte Segmente im B2B-Cloud-Markt"), minutes: 9 },
  { id: "A6" as MaterialId, block: "A" as Block, title: t("What a segment is worth, and what the data cannot tell you", "Was ein Segment wert ist, und was die Daten nicht verraten"), minutes: 8, optional: true },
  { id: "A7" as MaterialId, block: "A" as Block, title: t("From segment to measure: relevance, differentiation, economic viability", "Vom Segment zur Maßnahme: Relevanz, Differenzierung, Wirtschaftlichkeit"), minutes: 8 },
  { id: "B1" as MaterialId, block: "B" as Block, title: t("Choosing target segments: attractiveness and ability to win", "Zielsegmente wählen: Attraktivität und Gewinnfähigkeit"), minutes: 12 },
  { id: "B2" as MaterialId, block: "B" as Block, title: t("One sales model per segment: the cost to serve", "Ein Vertriebsmodell pro Segment: die Cost to Serve"), minutes: 12, optional: true },
  { id: "B3" as MaterialId, block: "B" as Block, title: t("Standardise or individualise: the modular offer", "Standardisieren oder individualisieren: das modulare Angebot"), minutes: 12, optional: true },
  { id: "B4" as MaterialId, block: "B" as Block, title: t("Deciding on segments with incomplete data", "Über Segmente entscheiden, wenn die Daten unvollständig sind"), minutes: 12 },
  { id: "B5" as MaterialId, block: "B" as Block, title: t("From strategy to architecture: sequence, owner, trigger", "Von der Strategie zur Architektur: Reihenfolge, Owner, Trigger"), minutes: 12 },
]);

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

/** Section anchors per route page, in reading order. */
export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2, RailSection[]> = bi({
  1: [
    { id: "materi-a", label: t("Materi A", "Materi A"), sub: t("Levels 1 + 2 · segments and personalisation", "Level 1 + 2 · Segmente und Personalisierung"), minutes: 60 },
    { id: "task-1", label: t("Task 1", "Task 1"), sub: t("Segment Analysis · one case", "Segment Analysis · ein Fall"), minutes: TASK1_MINUTES },
  ],
  2: [
    { id: "materi-b", label: t("Materi B", "Materi B"), sub: t("Level 3 · segment strategy", "Level 3 · Segmentstrategie"), minutes: 60 },
    { id: "task-2", label: t("Task 2", "Task 2"), sub: t("Segment Strategy Memo · CSO", "Segment Strategy Memo · CSO"), minutes: TASK2_MINUTES },
  ],
});
