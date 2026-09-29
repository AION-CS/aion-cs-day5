import { ACCOUNTS } from "@/data/accounts";
import { FIELDS } from "@/data/criteria";
import { CHOOSE, MEASURE_BY_ID } from "@/data/measures";
import { SEGMENTS, SEGMENT_IDS } from "@/data/segments";
import { SKETCH_MIN, mentionsNeed } from "@/data/sketches";
import { ARCH_BY_ID, ARCH_IDS, CAND_BY_ID, CAND_IDS, CRITERIA, ELEMENTS, ELEMENT_IDS, R2_BUDGET } from "@/data/route2";
import { archOver, citesTailorFigure, funded, hasNumber, servedIds } from "@/lib/checks";
import { MIN_LINE, MIN_SENTENCE, isOptionalBlock } from "@/lib/progress";
import { parseAmount } from "@/lib/parseAmount";
import { euro, tt } from "@/lib/lang";
import type { Persisted } from "@/store/useStore";

/** DOM ids the missing list points at. One place, so the list and the UI cannot drift. */
export const IDS = {
  participant: "participant-strip",
  field: (id: string) => `field-${id}`,
  figure: (id: string) => `fig-${id}`,
  extraCrit: "extra-crit",
  worth: "worth-field",
  tg: "tg-field",
  diff: "diff-field",
  sketch: (i: number) => `sketch-${i}`,
  reflect: (k: string) => `reflect-${k}`,
  account: (id: string) => `account-${id}`,
  profile: (s: string) => `profile-${s}`,
  gaps: "gaps-field",
  riskText: "risk-text",
  measurePick: "measure-pick",
  measure: (id: string) => `measure-${id}`,
  order: "order-field",
  why: "why-field",
  exportL1: "export-l1l2",
  // Route 2
  critPick: "crit-pick",
  crit: (id: string) => `crit-${id}`,
  rate: (id: string) => `rate-${id}`,
  sales: (id: string) => `sales-${id}`,
  grid: "grid-field",
  gridCol: (id: string) => `grid-${id}`,
  arch: (id: string) => `arch-${id}`,
  archTotal: "arch-total",
  postponed: "postponed-field",
  pickup: "pickup-field",
  decision: "decision-field",
  assumption: (i: number) => `assumption-${i}`,
  trip: "trip-field",
  challenge: "challenge-field",
  exportR2: "export-l3",
} as const;

export type MissingEntry = { id: string; label: string };

const B = (n: string) => tt(`Block ${n}`, `Block ${n}`);
const short = (s: string, n = 44) => (s.length > n ? `${s.slice(0, n)}…` : s);

export function participantMissing(p: Persisted): MissingEntry[] {
  return p.participant.name.trim() ? [] : [{ id: IDS.participant, label: tt("Your full name is needed for the file name.", "Ihr vollständiger Name wird für den Dateinamen gebraucht.") }];
}

/** Everything still missing from the Segment Analysis File (Route 1), each with the element to jump to. */
export function l1Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { l1 } = p;
  const e = (id: string, label: string) => out.push({ id, label });
  for (const f of FIELDS)
    if (l1.sort[f.id] === null) e(IDS.field(f.id), tt(`${B("1.1")}: “${short(f.text)}” is not sorted as Firmographic, Behaviour-based or Needs-based.`, `${B("1.1")}: „${short(f.text)}“ ist nicht als firmografisch, verhaltensbasiert oder bedarfsbasiert einsortiert.`));
  if (l1.extraCrit.trim().length < MIN_LINE)
    e(IDS.extraCrit, tt(`${B("1.1")}: add one criterion of your own and its kind (at least ${MIN_LINE} characters).`, `${B("1.1")}: Ergänzen Sie ein eigenes Kriterium und seine Art (mindestens ${MIN_LINE} Zeichen).`));
  for (const f of ["F1", "F2", "F3"] as const) if (parseAmount(l1.fig[f]) === null) e(IDS.figure(f), tt(`${B("1.2")}: ${f} has no figure.`, `${B("1.2")}: ${f} hat keinen Wert.`));
  const w = l1.worth.trim();
  if (!w) e(IDS.worth, tt(`${B("1.2")}: the sentence on where tailoring is worth it is empty.`, `${B("1.2")}: Der Satz dazu, wo sich der Zuschnitt lohnt, ist leer.`));
  else if (w.length < MIN_SENTENCE) e(IDS.worth, tt(`${B("1.2")}: the sentence needs at least ${MIN_SENTENCE} characters.`, `${B("1.2")}: Der Satz braucht mindestens ${MIN_SENTENCE} Zeichen.`));
  else if (!citesTailorFigure(w)) e(IDS.worth, tt(`${B("1.2")}: the sentence states no figure from your calculation.`, `${B("1.2")}: Der Satz nennt keine Zahl aus Ihrer Rechnung.`));
  if (!isOptionalBlock("b13")) {
  if (!l1.tg) e(IDS.tg, tt(`${B("1.3")}: say whether the strategy paper names a target group or a segment.`, `${B("1.3")}: Sagen Sie, ob das Strategiepapier eine Zielgruppe oder ein Segment nennt.`));
  if (!l1.diff) e(IDS.diff, tt(`${B("1.3")}: choose where the accounts differ the most.`, `${B("1.3")}: Wählen Sie, wo sich die Accounts am stärksten unterscheiden.`));
  l1.sketches.forEach((s, i) => {
    const n = i + 1;
    if (!s.basis) e(IDS.sketch(i), tt(`${B("1.3")}: segment sketch ${n} has no basis chosen.`, `${B("1.3")}: Segmentskizze ${n} hat keine Grundlage gewählt.`));
    const t = s.text.trim();
    if (!t) e(IDS.sketch(i), tt(`${B("1.3")}: segment sketch ${n} is empty.`, `${B("1.3")}: Segmentskizze ${n} ist leer.`));
    else if (t.length < SKETCH_MIN) e(IDS.sketch(i), tt(`${B("1.3")}: sketch ${n} needs at least ${SKETCH_MIN} characters.`, `${B("1.3")}: Skizze ${n} braucht mindestens ${SKETCH_MIN} Zeichen.`));
    else if (!mentionsNeed(t)) e(IDS.sketch(i), tt(`${B("1.3")}: sketch ${n} names no need. Say what these accounts need.`, `${B("1.3")}: Skizze ${n} nennt keinen Bedarf. Sagen Sie, was diese Accounts brauchen.`));
  });
  }
  const rf: [keyof typeof l1.reflect, string, string][] = [
    ["simplify", "where you oversimplified", "wo Sie vereinfacht haben"],
    ["worth", "where personalising is worth it and where not", "wo sich Personalisierung lohnt und wo nicht"],
    ["prioritise", "how a strategic decision-maker would prioritise", "wie eine strategische Entscheiderin priorisieren würde"],
  ];
  if (!isOptionalBlock("b14"))
  for (const [k, en, de] of rf)
    if (l1.reflect[k].trim().length < MIN_LINE) e(IDS.reflect(k), tt(`${B("1.4")}: say ${en} (at least ${MIN_LINE} characters).`, `${B("1.4")}: Sagen Sie, ${de} (mindestens ${MIN_LINE} Zeichen).`));
  for (const a of ACCOUNTS) if (l1.assign[a.id] === null) e(IDS.account(a.id), tt(`${B("2.1")}: ${a.name} has no segment.`, `${B("2.1")}: ${a.name} hat kein Segment.`));
  if (!isOptionalBlock("b22")) {
  for (const s of SEGMENT_IDS) {
    const pr = l1.profiles[s];
    const name = SEGMENTS[s].label;
    if (!pr.value) e(IDS.profile(s), tt(`${B("2.2")}: ${name} has no business value rating.`, `${B("2.2")}: ${name} hat keine Bewertung des Geschäftswerts.`));
    if (pr.need.trim().length < MIN_SENTENCE) e(IDS.profile(s), tt(`${B("2.2")}: say what ${name} needs and how it decides (at least ${MIN_SENTENCE} characters).`, `${B("2.2")}: Sagen Sie, was ${name} braucht und wie es entscheidet (mindestens ${MIN_SENTENCE} Zeichen).`));
    if (!pr.content) e(IDS.profile(s), tt(`${B("2.2")}: choose what to personalise for ${name}.`, `${B("2.2")}: Wählen Sie, was für ${name} personalisiert wird.`));
  }
  if (l1.gaps.length < 2) e(IDS.gaps, tt(`${B("2.2")}: choose at least two things the file does not tell you.`, `${B("2.2")}: Wählen Sie mindestens zwei Dinge, die die Datei nicht verrät.`));
  if (l1.riskText.trim().length < 20) e(IDS.riskText, tt(`${B("2.2")}: name one risk of a wrong segmentation and its sign (at least 20 characters).`, `${B("2.2")}: Nennen Sie ein Risiko einer falschen Segmentierung und sein Anzeichen (mindestens 20 Zeichen).`));
  }
  if (l1.chosen.length !== CHOOSE) e(IDS.measurePick, tt(`${B("2.3")}: choose exactly ${CHOOSE} measures (you have ${l1.chosen.length}).`, `${B("2.3")}: Wählen Sie genau ${CHOOSE} Maßnahmen (Sie haben ${l1.chosen.length}).`));
  for (const id of l1.chosen) {
    const name = MEASURE_BY_ID[id].name;
    if (l1.aims[id] === undefined) e(IDS.measure(id), tt(`${B("2.3")}: “${name}” has no segment it serves (or “none”).`, `${B("2.3")}: „${name}“ hat kein Segment, dem es dient (oder „keines“).`));
    if (!l1.rel[id] || !l1.dif[id] || !l1.eco[id]) e(IDS.measure(id), tt(`${B("2.3")}: “${name}” is not fully scored (relevance, differentiation, economic viability).`, `${B("2.3")}: „${name}“ ist nicht vollständig bewertet (Relevanz, Differenzierung, Wirtschaftlichkeit).`));
  }
  if (l1.chosen.length === CHOOSE) {
    if (l1.order.length !== CHOOSE || !l1.chosen.every((id) => l1.order.includes(id))) e(IDS.order, tt(`${B("2.3")}: put your three measures in a priority order.`, `${B("2.3")}: Bringen Sie Ihre drei Maßnahmen in eine Reihenfolge.`));
    if (l1.why.trim().length < 60) e(IDS.why, tt(`${B("2.3")}: say why your first priority goes first (at least 60 characters).`, `${B("2.3")}: Begründen Sie, warum Ihre erste Priorität zuerst kommt (mindestens 60 Zeichen).`));
  }
  return out;
}

/** Everything still missing from the Segment Strategy Memo (Route 2). */
export function r2Missing(p: Persisted): MissingEntry[] {
  const out = participantMissing(p);
  const { r2 } = p;
  const e = (id: string, label: string) => out.push({ id, label });
  if (!isOptionalBlock("b31")) {
  if (r2.crits.length !== 3) e(IDS.critPick, tt(`${B("3.1")}: choose exactly 3 prioritisation criteria (you have ${r2.crits.length}).`, `${B("3.1")}: Wählen Sie genau 3 Priorisierungskriterien (Sie haben ${r2.crits.length}).`));
  for (const c of r2.crits)
    if ((r2.critText[c] ?? "").trim().length < MIN_LINE) e(IDS.crit(c), tt(`${B("3.1")}: say what “${CRITERIA[c].name}” measures and why it matters (at least ${MIN_LINE} characters).`, `${B("3.1")}: Sagen Sie, was „${CRITERIA[c].name}“ misst und warum es zählt (mindestens ${MIN_LINE} Zeichen).`));
  }
  for (const id of CAND_IDS) {
    const n = CAND_BY_ID[id].name;
    if (!r2.attract[id] || !r2.ability[id]) e(IDS.rate(id), tt(`${B("3.2")}: rate ${n} on attractiveness and ability to win.`, `${B("3.2")}: Bewerten Sie ${n} nach Attraktivität und Gewinnfähigkeit.`));
    if (!r2.roles[id]) e(IDS.rate(id), tt(`${B("3.2")}: give ${n} a role (core, serve standard or deprioritise).`, `${B("3.2")}: Geben Sie ${n} eine Rolle (Kernsegment, standardisiert bedienen oder zurückstellen).`));
  }
  const served = servedIds(r2);
  if (!isOptionalBlock("b33") && served.length === 0) e(IDS.rate("assure"), tt(`${B("3.3")}: mark at least one segment as core or serve standard in Block 3.2 first.`, `${B("3.3")}: Markieren Sie zuerst in Block 3.2 mindestens ein Segment als Kern oder standardisiert.`));
  for (const id of served) {
    const n = CAND_BY_ID[id].name;
    if (!isOptionalBlock("b33") && !r2.sales[id]) e(IDS.sales(id), tt(`${B("3.3")}: choose a sales model for ${n}.`, `${B("3.3")}: Wählen Sie ein Vertriebsmodell für ${n}.`));
    if (!isOptionalBlock("b33") && (r2.prop[id] ?? "").trim().length < MIN_SENTENCE) e(IDS.sales(id), tt(`${B("3.3")}: write the value proposition for ${n} (at least ${MIN_SENTENCE} characters).`, `${B("3.3")}: Schreiben Sie das Nutzenversprechen für ${n} (mindestens ${MIN_SENTENCE} Zeichen).`));
    const unset = ELEMENT_IDS.filter((el) => !r2.grid[`${id}.${el}`]);
    if (!isOptionalBlock("b34") && unset.length > 0) e(IDS.gridCol(id), tt(`${B("3.4")}: ${n} has ${unset.length} element(s) not set: ${unset.map((el) => ELEMENTS[el].name).join(", ")}.`, `${B("3.4")}: Bei ${n} sind ${unset.length} Element(e) nicht gesetzt: ${unset.map((el) => ELEMENTS[el].name).join(", ")}.`));
  }
  const f = funded(r2);
  if (f.length === 0) e(IDS.archTotal, tt(`${B("3.5")}: fund at least one item.`, `${B("3.5")}: Finanzieren Sie mindestens einen Punkt.`));
  for (const id of f) {
    const name = ARCH_BY_ID[id].name;
    if (r2.start[id] == null) e(IDS.arch(id), tt(`${B("3.5")}: “${name}” has no start month.`, `${B("3.5")}: „${name}“ hat keinen Startmonat.`));
    if (!r2.owner[id]) e(IDS.arch(id), tt(`${B("3.5")}: “${name}” has no owner.`, `${B("3.5")}: „${name}“ hat keinen Owner.`));
    const t = (r2.trigger[id] ?? "").trim();
    if (t.length < 20) e(IDS.arch(id), tt(`${B("3.5")}: “${name}” needs a trigger (at least 20 characters).`, `${B("3.5")}: „${name}“ braucht einen Trigger (mindestens 20 Zeichen).`));
    else if (!hasNumber(t)) e(IDS.arch(id), tt(`${B("3.5")}: the trigger of “${name}” names no number.`, `${B("3.5")}: Der Trigger von „${name}“ nennt keine Zahl.`));
  }
  if (!ARCH_IDS.every((id) => r2.alloc[id])) {
    if (r2.postponed.trim().length < MIN_LINE) e(IDS.postponed, tt(`${B("3.5")}: say what you leave out and why.`, `${B("3.5")}: Sagen Sie, was Sie weglassen und warum.`));
    if (r2.pickup.trim().length < 15 || !hasNumber(r2.pickup)) e(IDS.pickup, tt(`${B("3.5")}: give the pickup point: the number and the date at which you look at it again.`, `${B("3.5")}: Nennen Sie den Pickup Point: die Zahl und den Zeitpunkt, zu dem Sie es wieder prüfen.`));
  }
  if (!r2.decision) e(IDS.decision, tt(`${B("3.6")}: choose your decision.`, `${B("3.6")}: Wählen Sie Ihre Entscheidung.`));
  r2.assumptions.forEach((a, i) => {
    if (a.trim().length < MIN_LINE) e(IDS.assumption(i), tt(`${B("3.6")}: assumption ${i + 1} is missing (at least ${MIN_LINE} characters).`, `${B("3.6")}: Annahme ${i + 1} fehlt (mindestens ${MIN_LINE} Zeichen).`));
  });
  if (!r2.tripKpi) e(IDS.trip, tt(`${B("3.6")}: choose the metric of your tripwire.`, `${B("3.6")}: Wählen Sie die Kennzahl Ihres Tripwires.`));
  if (parseAmount(r2.tripThreshold) === null) e(IDS.trip, tt(`${B("3.6")}: give the tripwire a threshold.`, `${B("3.6")}: Geben Sie dem Tripwire einen Schwellenwert.`));
  if (!r2.tripMonth) e(IDS.trip, tt(`${B("3.6")}: give the tripwire a month.`, `${B("3.6")}: Geben Sie dem Tripwire einen Monat.`));
  if (!r2.tripAction) e(IDS.trip, tt(`${B("3.6")}: say what you do if the tripwire is missed.`, `${B("3.6")}: Sagen Sie, was Sie tun, wenn der Tripwire verfehlt wird.`));
  if (r2.challenge.trim().length < 60) e(IDS.challenge, tt(`${B("3.6")}: answer the board's challenge (at least 60 characters).`, `${B("3.6")}: Beantworten Sie die Frage des Vorstands (mindestens 60 Zeichen).`));
  return out;
}
