import { DATACLOUD, FIGURE_IDS, TAILOR, extraProfit } from "@/data/tailoring";
import type { FigureId, SegmentCalc } from "@/data/tailoring";
import { tt } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The "automatic calculator" under a calculation question: the formula split into small labelled parts. The learner types each
 * part (a value read from a printed row); the result is computed live and can be copied into the answer field. On "Check", every
 * part is compared with the value it should hold, and a wrong part names the exact row and part of the row to read, never the
 * value itself. Expected values come from the same constants as the tables and the model answers (data/tailoring.ts).
 */
export type CalcPart = {
  id: string;
  /** Short label shown above the input. */
  label: string;
  expected: number;
  /** Absolute tolerance; 0 for a value read straight off a table. */
  tolerance?: number;
  /** Where to read it, shown when the part is flagged: the row and which part of it, never the value. */
  clue: string;
};

export type CalcBuilder = {
  parts: CalcPart[];
  compute: (v: Record<string, number>) => number;
  /** The formula with the learner's values in place, for display. */
  show: (v: Record<string, string>) => string;
};

/** F1 and F2: one segment's extra gross profit. The labels and clues are read at render time, so they follow the language. */
function segmentBuilder(seg: SegmentCalc, row: () => string): CalcBuilder {
  return {
    get parts() {
      const r = row();
      return [
        { id: "proposals", label: tt("Proposals per year", "Angebote pro Jahr"), expected: seg.proposals, clue: tt(`DataCloud's pilot: proposals per year, in the ${r} row.`, `Pilot von DataCloud: Angebote pro Jahr, in der Zeile ${r}.`) },
        { id: "tailored", label: tt("Tailored win rate (%)", "Win Rate zugeschnitten (%)"), expected: seg.tailored, clue: tt(`DataCloud's pilot: the tailored win rate in the ${r} row, typed as printed (a percentage). Not the standard one.`, `Pilot von DataCloud: die zugeschnittene Win Rate in der Zeile ${r}, so eingetippt wie gedruckt (in Prozent). Nicht die Standard-Win-Rate.`) },
        { id: "standard", label: tt("Standard win rate (%)", "Win Rate Standard (%)"), expected: seg.standard, clue: tt(`DataCloud's pilot: the standard win rate in the ${r} row. It is subtracted from the tailored one.`, `Pilot von DataCloud: die Standard-Win-Rate in der Zeile ${r}. Sie wird von der zugeschnittenen abgezogen.`) },
        { id: "acv", label: tt("Average first-year contract value (€)", "Durchschnittlicher Erstjahres-Vertragswert (€)"), expected: seg.acv, clue: tt(`DataCloud's pilot: the average first-year contract value in the ${r} row. The two segments differ a lot here.`, `Pilot von DataCloud: der durchschnittliche Erstjahres-Vertragswert in der Zeile ${r}. Hier unterscheiden sich die Segmente stark.`) },
        { id: "margin", label: tt("Gross margin (%)", "Bruttomarge (%)"), expected: DATACLOUD.margin, clue: tt("The gross margin printed under the table. It is the same for both segments.", "Die Bruttomarge unter der Tabelle. Sie ist für beide Segmente gleich.") },
      ];
    },
    compute: (v) => extraProfit({ proposals: v.proposals, standard: v.standard, tailored: v.tailored, acv: v.acv }, v.margin),
    show: (v) => `${v.proposals} × (${v.tailored}% − ${v.standard}%) × ${v.acv} × ${v.margin}%`,
  };
}

/** F3: the net result of Hands-off. */
const netBuilder: CalcBuilder = {
  get parts() {
    return [
      { id: "extra", label: tt("Extra gross profit, Hands-off (your F2)", "Zusätzlicher Rohertrag, Hands-off (Ihr F2)"), expected: TAILOR.f2, tolerance: 0.5, clue: tt("Your answer to F2 above. If it does not match what the check expects, correct F2 first.", "Ihre Antwort zu F2 oben. Wenn sie nicht zu dem passt, was die Prüfung erwartet, korrigieren Sie zuerst F2.") },
      { id: "cost", label: tt("Yearly cost of the tailored approach (€)", "Jährliche Kosten des zugeschnittenen Ansatzes (€)"), expected: DATACLOUD.cost, clue: tt("The yearly cost printed under the table, per segment. Not the budget of the whole task.", "Die jährlichen Kosten unter der Tabelle, pro Segment. Nicht das Budget der ganzen Aufgabe.") },
    ];
  },
  compute: (v) => v.extra - v.cost,
  show: (v) => `${v.extra} − ${v.cost}`,
};

export const FIGURE_BUILDERS: Record<FigureId, CalcBuilder> = {
  F1: segmentBuilder(DATACLOUD.assure, () => "Compliance-first"),
  F2: segmentBuilder(DATACLOUD.handsoff, () => "Hands-off"),
  F3: netBuilder,
};
export const figAnswer = (id: FigureId) => ({ F1: TAILOR.f1, F2: TAILOR.f2, F3: TAILOR.f3 })[id];
export { FIGURE_IDS };

/* ------------------------------------------------------------------ shared helpers */

export const partKey = (figure: string, part: string) => `${figure}.${part}`;

/** Parses every part of a builder; null for a part that is empty or unreadable. */
export function partValues(b: CalcBuilder, figure: string, parts: Record<string, string>): Record<string, number | null> {
  return Object.fromEntries(
    b.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw ? parseAmount(raw) : null];
    }),
  );
}

/** The live result, or null while a part is missing. */
export function builderResult(b: CalcBuilder, figure: string, parts: Record<string, string>): number | null {
  const v = partValues(b, figure, parts);
  if (Object.values(v).some((x) => x === null)) return null;
  const r = b.compute(v as Record<string, number>);
  return Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : null;
}

/** Part keys ("F1.acv") whose entered value differs from what the row holds. Empty parts are not flagged. */
export function wrongParts(b: CalcBuilder, figure: string, parts: Record<string, string>): string[] {
  const v = partValues(b, figure, parts);
  return b.parts
    .filter((p) => {
      const x = v[p.id];
      return x !== null && Math.abs(x - p.expected) > (p.tolerance ?? 1e-9);
    })
    .map((p) => partKey(figure, p.id));
}

/** True when every part is filled and none is wrong. */
export function allPartsRight(b: CalcBuilder, figure: string, parts: Record<string, string>): boolean {
  const v = partValues(b, figure, parts);
  return Object.values(v).every((x) => x !== null) && wrongParts(b, figure, parts).length === 0;
}

/** The model part values, as strings, for the mentor fill. */
export function modelParts(builders: Partial<Record<string, CalcBuilder>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, b] of Object.entries(builders)) if (b) for (const p of b.parts) out[partKey(fid, p.id)] = String(p.expected);
  return out;
}

/** Part flags for every figure, from the learner's parts. */
export function figurePartFlags(parts: Record<string, string>): string[] {
  return FIGURE_IDS.flatMap((f) => wrongParts(FIGURE_BUILDERS[f], f, parts));
}
