import { MATERIALS, materialAnchorId } from "@/data/materialIndex";
import type { RouteNo } from "@/lib/routes";
import type { TaskBlockId } from "@/lib/progress";
import { tt } from "@/lib/lang";

/**
 * The page map on the right of every route: one entry per material card and per task block, in page
 * order, so a learner can see how much the route holds and jump straight to any part of it. Anchor ids
 * are the ones the page already renders (mat-A1, block-2-1, export-l1l2, ...). Built on call, so it follows the language.
 */
export type NavItem = {
  /** The element id to scroll to. */
  id: string;
  /** The pill text: "A1", "2.3", "Case", "Export". */
  short: string;
  /** The full name, shown on hover/focus and in the mobile list. */
  title: string;
  /** Completion source: a card marked read, or a task block filled in. Absent = no done state. */
  done?: { card: string } | { block: TaskBlockId };
};
export type NavGroup = { label: string; items: NavItem[] };

const cards = (block: "A" | "B"): NavItem[] =>
  MATERIALS.filter((m) => m.block === block).map((m) => ({ id: materialAnchorId(m.id), short: m.id, title: m.title, done: { card: m.id } }));

const blk = (n: string, title: string, block: TaskBlockId): NavItem => ({ id: `block-${n.replace(".", "-")}`, short: n, title, done: { block } });

export function pageNav(route: RouteNo): NavGroup[] {
  if (route === 1)
    return [
      { label: "Materi A", items: cards("A") },
      {
        label: "Task 1",
        items: [
          { id: "case-brief", short: tt("Case", "Fall"), title: tt("The case: DataCloud Services", "Der Fall: DataCloud Services") },
          blk("1.1", tt("Sort the CRM fields", "Die CRM-Felder sortieren"), "b11"),
          blk("1.2", tt("Is tailoring worth it? Three figures", "Lohnt sich der Zuschnitt? Drei Werte"), "b12"),
          blk("1.3", tt("Target group, differences, three sketches", "Zielgruppe, Unterschiede, drei Skizzen"), "b13"),
          blk("1.4", tt("Coaching reflection", "Coaching-Reflexion"), "b14"),
          blk("2.1", tt("Assign the twelve accounts", "Die zwölf Accounts zuordnen"), "b21"),
          blk("2.2", tt("Segment profiles, value, gaps", "Segmentprofile, Wert, Lücken"), "b22"),
          blk("2.3", tt("Three measures, scored and ordered", "Drei Maßnahmen, bewertet und geordnet"), "b23"),
          { id: "export-l1l2", short: "Export", title: tt("Export the Segment Analysis File", "Segment Analysis File exportieren") },
        ],
      },
    ];
  return [
    { label: "Materi B", items: cards("B") },
    {
      label: "Task 2",
      items: [
        { id: "task-2", short: tt("Case", "Fall"), title: tt("The situation and the budget", "Die Lage und das Budget") },
        blk("3.1", tt("Prioritisation criteria", "Priorisierungskriterien"), "b31"),
        blk("3.2", tt("Rate five segments, name the core", "Fünf Segmente bewerten, den Kern benennen"), "b32"),
        blk("3.3", tt("A sales model per segment", "Ein Vertriebsmodell pro Segment"), "b33"),
        blk("3.4", tt("Standardise or individualise", "Standardisieren oder individualisieren"), "b34"),
        blk("3.5", tt("The measures architecture", "Die Maßnahmenarchitektur"), "b35"),
        blk("3.6", tt("The decision", "Die Entscheidung"), "b36"),
        { id: "export-l3", short: "Export", title: tt("Export the Segment Strategy Memo", "Segment Strategy Memo exportieren") },
      ],
    },
  ];
}
