import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.2, and the worked example of Materi A4: is personalising worth it for a segment? The method (effort against
 * benefit) is
 *
 *   extra gross profit per year = proposals per year × (tailored win rate − standard win rate) × average first-year contract value × gross margin
 *   net result per year        = extra gross profit − yearly cost of the tailored approach
 *
 * Every input is a Case assumption. The two win rates are read from DataCloud's own six-month pilot, which is why they are printed
 * as percentages and have to be divided by 100.
 */
export type SegmentCalc = { proposals: number; standard: number; tailored: number; acv: number };

export const DATACLOUD = {
  margin: 35,
  /** Yearly cost of a tailored approach for one segment (content, a specialist's time, the tooling). */
  cost: 30000,
  assure: { proposals: 30, standard: 15, tailored: 25, acv: 56000 } as SegmentCalc,
  handsoff: { proposals: 80, standard: 20, tailored: 22, acv: 17000 } as SegmentCalc,
};

/** The formula, for one segment: proposals × (tailored − standard)/100 × ACV × margin/100. */
export function extraProfit(s: SegmentCalc, marginPct: number): number {
  // rounded to the cent, so a figure never reads 58,799.999…
  return Math.round(s.proposals * ((s.tailored - s.standard) / 100) * s.acv * (marginPct / 100) * 100) / 100;
}
export const extraWins = (s: SegmentCalc) => s.proposals * ((s.tailored - s.standard) / 100);

export const TAILOR = {
  f1: extraProfit(DATACLOUD.assure, DATACLOUD.margin),
  f2: extraProfit(DATACLOUD.handsoff, DATACLOUD.margin),
  f3: 0,
  netAssure: 0,
  winsAssure: extraWins(DATACLOUD.assure),
  winsHandsoff: extraWins(DATACLOUD.handsoff),
};
TAILOR.f3 = TAILOR.f2 - DATACLOUD.cost;
TAILOR.netAssure = TAILOR.f1 - DATACLOUD.cost;

/** The three figures the learner enters in Block 1.2. */
export type FigureId = "F1" | "F2" | "F3";
export const FIGURE_IDS: FigureId[] = ["F1", "F2", "F3"];

export type FigureSource = { label: string; value: string; target: string };

export const FIGURES = bi({
  F1: {
    id: "F1" as FigureId,
    label: t("F1 · Extra gross profit per year from tailoring for Compliance-first, €", "F1 · Zusätzlicher Rohertrag pro Jahr durch Zuschnitt auf Compliance-first, €"),
    question: t("How much more gross profit a year would the tailored approach bring in the Compliance-first segment?", "Wie viel mehr Rohertrag pro Jahr brächte der zugeschnittene Ansatz im Segment Compliance-first?"),
    answer: TAILOR.f1,
    formula: t(
      "Extra gross profit = proposals per year × (tailored win rate − standard win rate) × average first-year contract value × gross margin. Use the Compliance-first row; read both percentages as shares of one.",
      "Zusätzlicher Rohertrag = Angebote pro Jahr × (Win Rate zugeschnitten − Win Rate Standard) × durchschnittlicher Erstjahres-Vertragswert × Bruttomarge. Nutzen Sie die Zeile Compliance-first; lesen Sie beide Prozentwerte als Anteile von eins.",
    ),
    taughtIn: "A4" as const,
    clue: t(
      "Check that you subtract the two win rates first (the difference, in points), divide the points and the margin by 100, and use the Compliance-first contract value.",
      "Prüfen Sie, dass Sie zuerst die beiden Win Rates subtrahieren (die Differenz in Punkten), die Punkte und die Marge durch 100 teilen und den Vertragswert von Compliance-first nehmen.",
    ),
    sources: [
      { label: t("DataCloud's pilot · Compliance-first · proposals per year", "Pilot von DataCloud · Compliance-first · Angebote pro Jahr"), value: "30", target: "tailor-assure-proposals" },
      { label: t("DataCloud's pilot · Compliance-first · standard win rate", "Pilot von DataCloud · Compliance-first · Win Rate Standard"), value: t("15%", "15 %"), target: "tailor-assure-standard" },
      { label: t("DataCloud's pilot · Compliance-first · tailored win rate", "Pilot von DataCloud · Compliance-first · Win Rate zugeschnitten"), value: t("25%", "25 %"), target: "tailor-assure-tailored" },
      { label: t("DataCloud's pilot · Compliance-first · average first-year contract value", "Pilot von DataCloud · Compliance-first · durchschnittlicher Erstjahres-Vertragswert"), value: t("€56,000", "56.000 €"), target: "tailor-assure-acv" },
      { label: t("Both segments · gross margin", "Beide Segmente · Bruttomarge"), value: t("35%", "35 %"), target: "tailor-margin" },
    ],
  },
  F2: {
    id: "F2" as FigureId,
    label: t("F2 · Extra gross profit per year from tailoring for Hands-off, €", "F2 · Zusätzlicher Rohertrag pro Jahr durch Zuschnitt auf Hands-off, €"),
    question: t("How much more gross profit a year would the tailored approach bring in the Hands-off segment?", "Wie viel mehr Rohertrag pro Jahr brächte der zugeschnittene Ansatz im Segment Hands-off?"),
    answer: TAILOR.f2,
    formula: t(
      "The same formula as F1, with every value from the Hands-off row. The gross margin is the same for both segments.",
      "Dieselbe Formel wie bei F1, mit allen Werten aus der Zeile Hands-off. Die Bruttomarge ist für beide Segmente gleich.",
    ),
    taughtIn: "A4" as const,
    clue: t(
      "Same steps as F1 with the Hands-off numbers. Many proposals and a small rise in the win rate: which of the two decides the result?",
      "Dieselben Schritte wie bei F1 mit den Hands-off-Zahlen. Viele Angebote und ein kleiner Anstieg der Win Rate: Was davon entscheidet das Ergebnis?",
    ),
    sources: [
      { label: t("DataCloud's pilot · Hands-off · proposals per year", "Pilot von DataCloud · Hands-off · Angebote pro Jahr"), value: "80", target: "tailor-handsoff-proposals" },
      { label: t("DataCloud's pilot · Hands-off · standard win rate", "Pilot von DataCloud · Hands-off · Win Rate Standard"), value: t("20%", "20 %"), target: "tailor-handsoff-standard" },
      { label: t("DataCloud's pilot · Hands-off · tailored win rate", "Pilot von DataCloud · Hands-off · Win Rate zugeschnitten"), value: t("22%", "22 %"), target: "tailor-handsoff-tailored" },
      { label: t("DataCloud's pilot · Hands-off · average first-year contract value", "Pilot von DataCloud · Hands-off · durchschnittlicher Erstjahres-Vertragswert"), value: t("€17,000", "17.000 €"), target: "tailor-handsoff-acv" },
      { label: t("Both segments · gross margin", "Beide Segmente · Bruttomarge"), value: t("35%", "35 %"), target: "tailor-margin" },
    ],
  },
  F3: {
    id: "F3" as FigureId,
    label: t("F3 · Net result per year of tailoring for Hands-off, €", "F3 · Nettoergebnis pro Jahr des Zuschnitts auf Hands-off, €"),
    question: t("What is left of F2 once the yearly cost of the tailored approach is paid? A loss is a negative number.", "Was bleibt von F2 übrig, wenn die jährlichen Kosten des zugeschnittenen Ansatzes bezahlt sind? Ein Verlust ist eine negative Zahl."),
    answer: TAILOR.f3,
    formula: t(
      "Net result = the extra gross profit of the segment (your F2) − the yearly cost of the tailored approach for one segment.",
      "Nettoergebnis = zusätzlicher Rohertrag des Segments (Ihr F2) − jährliche Kosten des zugeschnittenen Ansatzes für ein Segment.",
    ),
    taughtIn: "A4" as const,
    clue: t(
      "Take your F2 and subtract the yearly cost printed under the table. If the cost is larger, the answer is negative: type the minus sign.",
      "Nehmen Sie Ihr F2 und ziehen Sie die jährlichen Kosten ab, die unter der Tabelle stehen. Sind die Kosten größer, ist das Ergebnis negativ: Tippen Sie das Minuszeichen.",
    ),
    sources: [
      { label: t("Your own F2 above", "Ihr eigenes F2 oben"), value: t("your figure", "Ihr Wert"), target: "fig-F2" },
      { label: t("Both segments · yearly cost of the tailored approach, per segment", "Beide Segmente · jährliche Kosten des zugeschnittenen Ansatzes, pro Segment"), value: t("€30,000", "30.000 €"), target: "tailor-cost" },
    ],
  },
});

/** The worked example of Materi A4: a different vendor (Weserdata), the same method on other numbers. Case assumption. */
export const WESER = {
  margin: 30,
  cost: 25000,
  clinics: { proposals: 20, standard: 10, tailored: 20, acv: 45000 } as SegmentCalc,
  retail: { proposals: 60, standard: 12, tailored: 15, acv: 12000 } as SegmentCalc,
};
export const WESER_RESULT = {
  clinics: extraProfit(WESER.clinics, WESER.margin),
  retail: extraProfit(WESER.retail, WESER.margin),
};
