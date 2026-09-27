import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.3. Two short forced choices (target group or segment; where do the accounts differ most) and three segment
 * sketches of the learner's own, each resting on one kind of criterion (Materi A2, A3). The check is a floor, never a judge of
 * quality: every sketch names its basis and a need, and at most one of the three rests on firmographics alone.
 */
export type Basis = "firmo" | "behaviour" | "need";
export const BASES = bi([
  { id: "firmo" as Basis, label: t("Firmographic (industry, size, region)", "Firmografisch (Branche, Größe, Region)"), from: "A3" },
  { id: "behaviour" as Basis, label: t("Behaviour-based (what the accounts did)", "Verhaltensbasiert (was die Accounts getan haben)"), from: "A3" },
  { id: "need" as Basis, label: t("Needs-based (what the accounts must solve)", "Bedarfsbasiert (was die Accounts lösen müssen)"), from: "A3" },
]);
export const BASIS_LABEL = bi({
  firmo: t("Firmographic", "Firmografisch"),
  behaviour: t("Behaviour-based", "Verhaltensbasiert"),
  need: t("Needs-based", "Bedarfsbasiert"),
});
export const SKETCH_COUNT = 3;
export const SKETCH_MIN = 45;
export const SKETCH_FRAME = bi({ v: t("[Name]: accounts that [criterion], who need [need], and who decide [how].", "[Name]: Accounts, die [Kriterium], die [Bedarf] brauchen und die [wie] entscheiden.") });

/** True when the sketch names a need. A floor, not a judge of quality; English and German forms. */
export const mentionsNeed = (s: string) =>
  /\b(need|needs|must|want|wants|require|requires|has to|have to|braucht|brauchen|muss|müssen|will|wollen|benötig\w*|verlang\w*|Bedarf|Anforderung\w*)\b/i.test(s);

/* ------------------------------------------------------------------ the two forced choices */

export type TgId = "tg" | "seg";
export const TG_QUESTION = bi({
  statement: t(
    "DataCloud's strategy paper says: “We address Mittelstand companies in Germany with 50 to 2,500 employees.”",
    "Im Strategiepapier von DataCloud steht: „Wir sprechen Mittelstandsunternehmen in Deutschland mit 50 bis 2.500 Mitarbeitenden an.“",
  ),
  options: [
    { id: "tg" as TgId, label: t("A target group: the strategic choice of whom DataCloud addresses", "Eine Zielgruppe: die strategische Wahl, wen DataCloud anspricht") },
    { id: "seg" as TgId, label: t("A segment: an operational group that gets its own offer", "Ein Segment: eine operative Gruppe, die ein eigenes Angebot bekommt") },
  ],
  why: t(
    "It says whom DataCloud addresses at all, and every account in the file falls inside it. It does not say how any group is served differently, so it is a target group, not a segment.",
    "Es sagt, wen DataCloud überhaupt anspricht, und jeder Account in der Datei liegt darin. Es sagt nicht, wie eine Gruppe anders bedient wird, also ist es eine Zielgruppe, kein Segment.",
  ),
  clue: t(
    "Does the sentence say whom to address, or how to serve one group differently from another?",
    "Sagt der Satz, wen man anspricht, oder wie man eine Gruppe anders bedient als eine andere?",
  ),
});
export const TG_TRUTH: TgId = "tg";

export type DiffId = "industry" | "size" | "need" | "region";
export const DIFF_QUESTION = bi({
  statement: t("Where do DataCloud's twelve accounts differ the most, in a way that changes what they should be offered?", "Wo unterscheiden sich die zwölf Accounts von DataCloud am stärksten, und zwar so, dass sich ändert, was man ihnen anbieten sollte?"),
  options: [
    { id: "industry" as DiffId, label: t("Their industry", "In ihrer Branche") },
    { id: "size" as DiffId, label: t("Their size", "In ihrer Größe") },
    { id: "need" as DiffId, label: t("Their problem situation and how they decide", "In ihrer Problemlage und darin, wie sie entscheiden") },
    { id: "region" as DiffId, label: t("Their region", "In ihrer Region") },
  ],
  why: t(
    "Three sectors and both ends of the size range appear in two different segments, so industry and size do not predict the offer. The problem each account must solve and the way it decides do.",
    "Drei Branchen und beide Enden der Größenskala tauchen in zwei verschiedenen Segmenten auf, also sagen Branche und Größe das passende Angebot nicht voraus. Das Problem, das jeder Account lösen muss, und die Art, wie er entscheidet, tun es.",
  ),
  clue: t(
    "Find two accounts from the same sector in Block 2.1. Do they want the same thing?",
    "Suchen Sie in Block 2.1 zwei Accounts aus derselben Branche. Wollen sie dasselbe?",
  ),
});
export const DIFF_TRUTH: DiffId = "need";
