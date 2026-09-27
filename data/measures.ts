import type { SegmentId } from "@/data/segments";
import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 2.3. Nine personalisation measures DataCloud could fund inside €120,000 and five months. Costs, reach and weeks
 * are Case assumptions. What each measure changes is written as a mechanism, never with a segment's name, so the learner has to
 * match them (Materi A7). The score is the plan's own evaluation: Relevance × Differentiation × Economic viability. Economic
 * viability follows from the printed cost and reach by the rule of A7 (cost per account reached), so it is checkable; relevance
 * and differentiation are the learner's judgement. `targets` and the model scores are used only by the checks, the answer key and
 * the worked answers.
 */
export type MeasureId = "compliance" | "refs" | "care" | "lane" | "bespoke" | "industry" | "discount" | "tracking" | "playbook";

export const BUDGET = 120000;
export const MONTHS = 5;

export type Bucket = 1 | 2 | 3;
export type Measure = {
  id: MeasureId;
  name: string;
  what: string;
  mechanism: string;
  needs: string;
  cost: number;
  /** Accounts the measure reaches in the five months (current customers and pipeline). */
  reach: number;
  /** Weeks until it is in use. */
  weeks: number;
  /** Segments it really serves (reference answer); empty when it answers no segment's need. */
  targets: SegmentId[];
  model: { relevance: Bucket; differentiation: Bucket; note: string };
  verdict: string;
};

export const MEASURES: Measure[] = bi([
  {
    id: "compliance" as MeasureId,
    name: t("Compliance evidence pack", "Compliance-Nachweispaket"),
    what: t(
      "A ready audit folder for each account: the BSI C5 report, a map of data locations, a data processing agreement and an audit-rights clause, sent with the first proposal.",
      "Ein fertiger Prüfordner pro Account: der BSI-C5-Bericht, eine Karte der Datenstandorte, ein Auftragsverarbeitungsvertrag und eine Prüfrechtsklausel, verschickt mit dem ersten Angebot.",
    ),
    mechanism: t("Gives the account documents it can hand to a third party, before it has to ask for them.", "Gibt dem Account Unterlagen, die er einer dritten Stelle vorlegen kann, bevor er danach fragen muss."),
    needs: t("Legal approves the audit clause once; the C5 report already exists.", "Die Rechtsabteilung gibt die Prüfklausel einmal frei; der C5-Bericht liegt bereits vor."),
    cost: 38000,
    reach: 20,
    weeks: 6,
    targets: ["assure"] as SegmentId[],
    model: { relevance: 3, differentiation: 3, note: t("Answers the first need of the segment with the highest value in the file; a generic cloud offer does not come with it.", "Beantwortet den ersten Bedarf des wertvollsten Segments in der Datei; ein generisches Cloud-Angebot bringt das nicht mit.") },
    verdict: t("A model measure: it answers the need of the High-value segment and costs €1,900 per account reached.", "Eine Modellmaßnahme: Sie beantwortet den Bedarf des Segments mit hohem Wert und kostet 1.900 € pro erreichtem Account."),
  },
  {
    id: "refs" as MeasureId,
    name: t("Regulated-sector reference programme", "Referenzprogramm für regulierte Branchen"),
    what: t("Three named customers from banking, healthcare and a utility, one page each, and a peer call on request.", "Drei namentlich genannte Kunden aus Bank, Gesundheitswesen und Stadtwerk, je eine Seite, und auf Wunsch ein Gespräch unter Fachkollegen."),
    mechanism: t("Lets a cautious buyer hear from a comparable organisation that passed the same kind of audit.", "Lässt einen vorsichtigen Käufer von einer vergleichbaren Organisation hören, die dieselbe Art Prüfung bestanden hat."),
    needs: t("Three customers agree to be named; two have said yes.", "Drei Kunden stimmen einer Nennung zu; zwei haben zugesagt."),
    cost: 30000,
    reach: 12,
    weeks: 8,
    targets: ["assure"] as SegmentId[],
    model: { relevance: 3, differentiation: 2, note: t("Answers the same segment's need for proof from peers; competitors also run reference programmes, so differentiation is 2.", "Beantwortet den Bedarf desselben Segments nach Nachweisen von Gleichen; Wettbewerber haben auch Referenzprogramme, daher Differenzierung 2.") },
    verdict: t("A model measure: relevant to the High-value segment, but it reaches only twelve accounts, so its cost per account is €2,500.", "Eine Modellmaßnahme: relevant für das Segment mit hohem Wert, erreicht aber nur zwölf Accounts, daher 2.500 € pro Account."),
  },
  {
    id: "care" as MeasureId,
    name: t("Managed standard package", "Managed-Standardpaket"),
    what: t("One fixed monthly price per user, one named contact, 24/7 monitoring, nothing to operate.", "Ein fester Monatspreis pro Nutzer, ein fester Ansprechpartner, 24/7-Monitoring, nichts selbst zu betreiben."),
    mechanism: t("Takes the running of the service off the account's hands, at a price it can plan.", "Nimmt dem Account den Betrieb ab, zu einem Preis, den er planen kann."),
    needs: t("Operations builds the package once; it is the same for everyone who takes it.", "Der Betrieb baut das Paket einmal; es ist für alle gleich, die es nehmen."),
    cost: 36000,
    reach: 60,
    weeks: 6,
    targets: ["handsoff"] as SegmentId[],
    model: { relevance: 1, differentiation: 2, note: t("It answers the need of the segment the tally rates Low, so relevance is 1 by the rule of A7. It standardises rather than personalises: the right move for small accounts, not the first use of this budget.", "Es beantwortet den Bedarf des Segments, das die Auszählung als Niedrig einstuft, also Relevanz 1 nach der Regel aus A7. Es standardisiert statt zu personalisieren: richtig für kleine Accounts, aber nicht die erste Verwendung dieses Budgets.") },
    verdict: t("Not in the model three: a sound standardisation for a Low-value segment. Route 2 takes it up.", "Nicht unter den drei Modellmaßnahmen: eine solide Standardisierung für ein Segment mit niedrigem Wert. Route 2 greift sie auf."),
  },
  {
    id: "lane" as MeasureId,
    name: t("Technical self-service lane", "Technischer Self-Service-Zugang"),
    what: t("Public API documentation, a free 14-day proof-of-concept environment and a per-minute price calculator.", "Öffentliche API-Dokumentation, eine kostenlose Proof-of-Concept-Umgebung für 14 Tage und ein Preisrechner pro Minute."),
    mechanism: t("Lets the account's own engineers test and measure the service before anyone sells to them.", "Lässt die eigenen Engineers des Accounts den Service testen und messen, bevor ihnen jemand etwas verkauft."),
    needs: t("Two platform engineers for ten weeks.", "Zwei Platform Engineers für zehn Wochen."),
    cost: 45000,
    reach: 25,
    weeks: 10,
    targets: ["scale"] as SegmentId[],
    model: { relevance: 2, differentiation: 3, note: t("Answers the first need of the Mid-value segment, and few regional providers offer it, so differentiation is 3.", "Beantwortet den ersten Bedarf des Segments mit mittlerem Wert, und wenige regionale Anbieter bieten das, daher Differenzierung 3.") },
    verdict: t("A model measure: it opens the Mid-value segment that a generic sales pitch cannot reach.", "Eine Modellmaßnahme: Sie öffnet das Segment mit mittlerem Wert, das ein generisches Verkaufsgespräch nicht erreicht."),
  },
  {
    id: "bespoke" as MeasureId,
    name: t("An individual proposal for every prospect", "Ein individuelles Angebot für jeden Prospect"),
    what: t("A senior consultant writes each proposal from scratch after a two-hour workshop with the prospect.", "Ein Senior Consultant schreibt jedes Angebot neu nach einem zweistündigen Workshop mit dem Prospect."),
    mechanism: t("Tailors every word to one account, whatever its need, at the full cost of a person's time.", "Schneidet jedes Wort auf einen Account zu, egal welcher Bedarf, zum vollen Preis der Arbeitszeit einer Person."),
    needs: t("One senior consultant for five months.", "Ein Senior Consultant für fünf Monate."),
    cost: 96000,
    reach: 20,
    weeks: 3,
    targets: ["assure", "handsoff", "scale"] as SegmentId[],
    model: { relevance: 2, differentiation: 2, note: t("It reaches every segment a little; at €4,800 per account it is one-to-one personalisation the segments do not need.", "Es erreicht jedes Segment ein wenig; mit 4.800 € pro Account ist es One-to-one-Personalisierung, die die Segmente nicht brauchen.") },
    verdict: t("Rejected: the most personal option, and the least economic. It eats 80% of the budget for twenty accounts.", "Verworfen: die persönlichste Option und die unwirtschaftlichste. Sie verbraucht 80 % des Budgets für zwanzig Accounts."),
  },
  {
    id: "industry" as MeasureId,
    name: t("Industry landing pages and newsletters", "Branchen-Landingpages und Newsletter"),
    what: t("Twelve landing pages and a monthly newsletter per industry code.", "Zwölf Landingpages und ein monatlicher Newsletter pro Branchencode."),
    mechanism: t("Changes the industry name and the pictures in the message; the offer stays the same.", "Ändert Branchennamen und Bilder in der Botschaft; das Angebot bleibt gleich."),
    needs: t("A marketing agency and content per industry.", "Eine Marketingagentur und Inhalte pro Branche."),
    cost: 24000,
    reach: 200,
    weeks: 8,
    targets: [] as SegmentId[],
    model: { relevance: 1, differentiation: 1, note: t("Personalises by industry, which the file shows does not predict the need.", "Personalisiert nach Branche, die laut Datei den Bedarf nicht vorhersagt.") },
    verdict: t("Rejected: cheap per account, but it answers no segment's need. Industry wording is not relevance.", "Verworfen: günstig pro Account, beantwortet aber keinen Segmentbedarf. Branchensprache ist keine Relevanz."),
  },
  {
    id: "discount" as MeasureId,
    name: t("10% discount on all new contracts", "10 % Rabatt auf alle neuen Verträge"),
    what: t("Every new contract signed in the five months gets 10% off the first year.", "Jeder neue Vertrag, der in den fünf Monaten unterschrieben wird, bekommt 10 % Rabatt im ersten Jahr."),
    mechanism: t("Lowers the price for everyone; it changes nothing in what the offer does for a need.", "Senkt den Preis für alle; ändert nichts daran, was das Angebot für einen Bedarf leistet."),
    needs: t("Nothing: sales can start at once. The margin falls on every deal.", "Nichts: Der Vertrieb kann sofort starten. Die Marge sinkt bei jedem Deal."),
    cost: 60000,
    reach: 40,
    weeks: 1,
    targets: [] as SegmentId[],
    model: { relevance: 1, differentiation: 1, note: t("Price is named in none of the twelve notes; any competitor can match a discount.", "Der Preis wird in keiner der zwölf Notizen genannt; jeder Wettbewerber kann einen Rabatt nachziehen.") },
    verdict: t("Rejected: the opposite of personalisation. It pays a discount on deals that would have signed anyway.", "Verworfen: das Gegenteil von Personalisierung. Es zahlt Rabatt auf Deals, die ohnehin unterschrieben worden wären."),
  },
  {
    id: "tracking" as MeasureId,
    name: t("Automated emails from website tracking", "Automatische E-Mails aus Website-Tracking"),
    what: t("Emails written by software from each visitor's clicks on the website, sent to every contact address we can find.", "E-Mails, die eine Software aus den Klicks jedes Website-Besuchers schreibt, verschickt an jede Kontaktadresse, die wir finden."),
    mechanism: t("Reacts to clicks, not to needs, and contacts people who did not ask for it.", "Reagiert auf Klicks, nicht auf Bedarfe, und kontaktiert Menschen, die nicht darum gebeten haben."),
    needs: t("Tracking without consent and unsolicited emails: a legal check under the GDPR and § 7 UWG comes first.", "Tracking ohne Einwilligung und unerbetene E-Mails: Zuerst ist eine rechtliche Prüfung nach DSGVO und § 7 UWG nötig."),
    cost: 18000,
    reach: 300,
    weeks: 4,
    targets: [] as SegmentId[],
    model: { relevance: 1, differentiation: 1, note: t("Behaviour without a need behind it, and a legal risk in Germany: tracking needs consent, and unsolicited advertising emails need prior consent.", "Verhalten ohne Bedarf dahinter und ein rechtliches Risiko in Deutschland: Tracking braucht eine Einwilligung, und unerbetene Werbe-E-Mails brauchen eine vorherige Einwilligung.") },
    verdict: t("Rejected: a click is not a need, and the method fails the legal test before the budget test.", "Verworfen: Ein Klick ist kein Bedarf, und die Methode scheitert am rechtlichen Test vor dem Budgettest."),
  },
  {
    id: "playbook" as MeasureId,
    name: t("Segment playbook for sellers", "Segment-Playbook für den Vertrieb"),
    what: t("A talk track, a benefit argument and a checklist per segment, with a half-day training.", "Ein Gesprächsleitfaden, ein Nutzenargument und eine Checkliste pro Segment, mit einem halbtägigen Training."),
    mechanism: t("Helps every seller argue the benefit that matters to the account in front of them.", "Hilft jedem Verkäufer, den Nutzen zu argumentieren, der für den Account vor ihm zählt."),
    needs: t("Sales enablement writes it in-house.", "Sales Enablement schreibt es intern."),
    cost: 28000,
    reach: 60,
    weeks: 5,
    targets: ["assure", "handsoff", "scale"] as SegmentId[],
    model: { relevance: 2, differentiation: 1, note: t("It touches every segment, but only through what a seller says; every competitor trains its sellers too, so differentiation is 1.", "Es berührt jedes Segment, aber nur über das, was ein Verkäufer sagt; jeder Wettbewerber schult seinen Vertrieb auch, daher Differenzierung 1.") },
    verdict: t("A useful support, not one of the first three: it scores 6 and the budget cannot take a fourth measure.", "Eine nützliche Unterstützung, aber nicht unter den ersten drei: Sie erzielt 6, und das Budget verträgt keine vierte Maßnahme."),
  },
]);

export const MEASURE_BY_ID = Object.fromEntries(MEASURES.map((m) => [m.id, m])) as Record<MeasureId, Measure>;
export const MEASURE_IDS = MEASURES.map((m) => m.id);
export const CHOOSE = 3;

/** Economic viability, the rule of A7: cost per account reached. €2,000 or less is 3, €2,001 to €4,000 is 2, more is 1. */
export const costPerAccount = (id: MeasureId) => MEASURE_BY_ID[id].cost / MEASURE_BY_ID[id].reach;
export const evBucket = (perAccount: number): Bucket => (perAccount <= 2000 ? 3 : perAccount <= 4000 ? 2 : 1);
export const EV_RULE = bi({
  v: t(
    "Economic viability: divide the cost by the accounts it reaches. €2,000 or less per account scores 3, €2,001 to €4,000 scores 2, more than €4,000 scores 1.",
    "Wirtschaftlichkeit: Teilen Sie die Kosten durch die erreichten Accounts. 2.000 € oder weniger pro Account ergibt 3, 2.001 bis 4.000 € ergibt 2, mehr als 4.000 € ergibt 1.",
  ),
});

export const modelScore = (id: MeasureId) => {
  const m = MEASURE_BY_ID[id];
  return m.model.relevance * m.model.differentiation * evBucket(costPerAccount(id));
};

/** The reference answer: the three measures with the highest model score. They fit the budget; adding a fourth does not. */
export const MODEL_MEASURES: MeasureId[] = ["compliance", "lane", "refs"];
export const MODEL_COST = MODEL_MEASURES.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
export const NEXT_BEST: MeasureId[] = ["care", "playbook"];
