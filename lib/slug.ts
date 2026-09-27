/** Lowercase ASCII, spaces to "-", diacritics stripped (ü → u, ß → ss). */
export function slug(input: string): string {
  return input
    .trim()
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TaskSlug = "l1l2-segment-analysis" | "l3-strategy-memo";

/** The number that leads every file name is the route it comes from: Route 1 = 1, Route 2 = 2. */
export const TASK_NUMBER: Record<TaskSlug, 1 | 2> = {
  "l1l2-segment-analysis": 1,
  "l3-strategy-memo": 2,
};

/** `{route}-{name}-day5-{task}`, e.g. `1-muchson-day5-l1l2-segment-analysis`, `2-muchson-day5-l3-strategy-memo`. The file name stays English in both languages. */
export function exportName(name: string, task: TaskSlug): string {
  return `${TASK_NUMBER[task]}-${slug(name) || "participant"}-day5-${task}`;
}
