import type { SegmentId } from "@/data/segments";
import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 2.1. Twelve accounts from DataCloud's CRM, each with the note its account manager wrote. Every name and figure is
 * a Case assumption. `truth` (the segment the note shows) is never printed outside the mentor answer key. The traps are deliberate:
 * three sectors (logistics, healthcare, energy) and both ends of the size range appear in two different segments, so the
 * industry or the headcount never decides the segment; the need and the decision behaviour do.
 */
export type AccountId = "a01" | "a02" | "a03" | "a04" | "a05" | "a06" | "a07" | "a08" | "a09" | "a10" | "a11" | "a12";

export type Account = {
  id: AccountId;
  name: string;
  sector: string;
  staff: number;
  status: "customer" | "prospect";
  /** Potential annual contract value in euros (the account manager's estimate). */
  acv: number;
  note: string;
  truth: SegmentId;
  /** The phrase that decides the note. */
  key: string;
  clue: string;
  why: string;
  rejected: Partial<Record<SegmentId, string>>;
};

export const STATUS_LABEL = bi({ customer: t("Customer", "Kunde"), prospect: t("Prospect", "Prospect") });

export const ACCOUNTS: Account[] = bi([
  {
    id: "a01" as AccountId,
    name: "Mediqon Laborverbund",
    sector: t("Healthcare (laboratories)", "Gesundheitswesen (Labore)"),
    staff: 380,
    status: "prospect" as const,
    acv: 60000,
    note: t(
      "Asked in the first call for our BSI C5 report and a list of data-centre locations. Their external auditor must see that no patient data leaves Germany. The data protection officer joins every meeting.",
      "Hat im ersten Gespräch nach unserem BSI-C5-Bericht und einer Liste der Rechenzentrumsstandorte gefragt. Ihr externer Prüfer muss sehen, dass keine Patientendaten Deutschland verlassen. Die Datenschutzbeauftragte sitzt in jedem Termin.",
    ),
    truth: "assure" as SegmentId,
    key: t("auditor must see that no patient data leaves Germany", "Prüfer muss sehen, dass keine Patientendaten Deutschland verlassen"),
    clue: t("What does the account have to prove, and to whom?", "Was muss der Account nachweisen, und wem?"),
    why: t("The account needs evidence for its auditor (C5 report, data locations). A third party must be satisfied: Compliance-first.", "Der Account braucht Nachweise für seinen Prüfer (C5-Bericht, Datenstandorte). Eine dritte Stelle muss zufrieden sein: Compliance-first."),
    rejected: { handsoff: t("Nobody asks for the service to be run for them; they ask for documents.", "Niemand bittet darum, den Service betrieben zu bekommen; man fragt nach Unterlagen.") },
  },
  {
    id: "a02" as AccountId,
    name: "Lohmann Logistik AG",
    sector: t("Logistics", "Logistik"),
    staff: 2100,
    status: "customer" as const,
    acv: 85000,
    note: t(
      "Customer for three years. Customs records must be kept for ten years with a tamper-proof log. Before talking about the renewal price, their legal team asked for audit rights in the contract.",
      "Seit drei Jahren Kunde. Zollunterlagen müssen zehn Jahre lang mit einem manipulationssicheren Protokoll aufbewahrt werden. Bevor über den Verlängerungspreis gesprochen wurde, hat die Rechtsabteilung Prüfrechte im Vertrag verlangt.",
    ),
    truth: "assure" as SegmentId,
    key: t("asked for audit rights in the contract", "Prüfrechte im Vertrag verlangt"),
    clue: t("Is the request about running the service, or about proving something?", "Geht es bei der Anfrage darum, den Service zu betreiben, oder darum, etwas nachzuweisen?"),
    why: t("A legal retention duty and audit rights come before price: evidence for customs and auditors decides. Compliance-first, although it is a logistics firm like Weber Spedition.", "Eine gesetzliche Aufbewahrungspflicht und Prüfrechte kommen vor dem Preis: Nachweise für Zoll und Prüfer entscheiden. Compliance-first, obwohl es eine Logistikfirma ist wie Weber Spedition."),
    rejected: { handsoff: t("Same sector as Weber Spedition, opposite need: Lohmann wants rights and records, not someone to run it.", "Gleiche Branche wie Weber Spedition, gegensätzlicher Bedarf: Lohmann will Rechte und Nachweise, nicht jemanden, der betreibt.") },
  },
  {
    id: "a03" as AccountId,
    name: "Stadtwerke Emsland",
    sector: t("Municipal utility", "Stadtwerke"),
    staff: 600,
    status: "prospect" as const,
    acv: 48000,
    note: t(
      "Counts as critical infrastructure (KRITIS) and has to document its NIS2 measures for the supervisory authority. The purchase runs as a formal tender (Ausschreibung) with an evaluation committee.",
      "Gilt als kritische Infrastruktur (KRITIS) und muss seine NIS2-Maßnahmen gegenüber der Aufsichtsbehörde dokumentieren. Der Einkauf läuft als formale Ausschreibung mit Bewertungskommission.",
    ),
    truth: "assure" as SegmentId,
    key: t("document its NIS2 measures for the supervisory authority", "NIS2-Maßnahmen gegenüber der Aufsichtsbehörde dokumentieren"),
    clue: t("Who outside the company has to be satisfied before this account can buy?", "Wer außerhalb des Unternehmens muss zufrieden sein, bevor dieser Account kaufen kann?"),
    why: t("A supervisory authority and a tender committee must be satisfied with documents. Compliance-first.", "Eine Aufsichtsbehörde und eine Vergabekommission müssen mit Unterlagen zufrieden sein. Compliance-first."),
    rejected: { scale: t("It is an energy business like Nordlicht, but nothing asks for technical access; everything asks for documentation.", "Es ist ein Energieunternehmen wie Nordlicht, aber nichts fragt nach technischem Zugang; alles fragt nach Dokumentation.") },
  },
  {
    id: "a04" as AccountId,
    name: "Fintara Leasing",
    sector: t("Financial services", "Finanzdienstleistungen"),
    staff: 150,
    status: "prospect" as const,
    acv: 32000,
    note: t(
      "Supervised by BaFin. Before any price, asked for our exit plan, the list of sub-processors and the right to audit us.",
      "Steht unter BaFin-Aufsicht. Hat vor jedem Preis nach unserem Exit-Plan, der Liste der Unterauftragsverarbeiter und dem Recht gefragt, uns zu prüfen.",
    ),
    truth: "assure" as SegmentId,
    key: t("the right to audit us", "dem Recht gefragt, uns zu prüfen"),
    clue: t("Does its small size tell you what it needs, or do its questions?", "Sagt die geringe Größe, was der Account braucht, oder sagen es seine Fragen?"),
    why: t("Only 150 employees, but under supervision and asking for an exit plan and audit rights. Size misleads; the need is evidence. Compliance-first.", "Nur 150 Mitarbeitende, aber unter Aufsicht und mit Fragen nach Exit-Plan und Prüfrechten. Die Größe täuscht; der Bedarf sind Nachweise. Compliance-first."),
    rejected: { handsoff: t("A small firm is often Hands-off, but this one asks for rights and documents, not for someone to run it.", "Eine kleine Firma ist oft Hands-off, aber diese fragt nach Rechten und Unterlagen, nicht nach jemandem, der betreibt.") },
  },
  {
    id: "a05" as AccountId,
    name: "Brenner Haustechnik",
    sector: t("Building services (trade)", "Haustechnik (Handwerk)"),
    staff: 45,
    status: "customer" as const,
    acv: 9000,
    note: t(
      "No IT staff. The office manager looks after IT and asked for “one number to call when something breaks”. Pays a fixed monthly fee and has never logged into our portal.",
      "Kein IT-Personal. Die Büroleiterin kümmert sich um die IT und bat um „eine Nummer, die ich anrufe, wenn etwas kaputt ist“. Zahlt einen festen Monatsbetrag und hat sich nie in unser Portal eingeloggt.",
    ),
    truth: "handsoff" as SegmentId,
    key: t("one number to call when something breaks", "eine Nummer, die ich anrufe, wenn etwas kaputt ist"),
    clue: t("Who is supposed to do the technical work here?", "Wer soll hier die technische Arbeit machen?"),
    why: t("No IT staff, one number to call, a fixed fee, no portal: the account wants the service run for it. Hands-off.", "Kein IT-Personal, eine Nummer zum Anrufen, ein fester Betrag, kein Portal: Der Account will, dass der Service für ihn betrieben wird. Hands-off."),
    rejected: { scale: t("Nobody in-house wants access or control.", "Niemand im Haus will Zugriff oder Kontrolle.") },
  },
  {
    id: "a06" as AccountId,
    name: "Kieler Möbelhaus",
    sector: t("Retail (furniture)", "Einzelhandel (Möbel)"),
    staff: 120,
    status: "prospect" as const,
    acv: 14000,
    note: t(
      "Their only administrator left in the spring. Asked whether we could “simply take care of all of it” for a fixed monthly price.",
      "Ihr einziger Administrator ist im Frühjahr gegangen. Hat gefragt, ob wir uns „einfach um alles kümmern“ könnten, zu einem festen Monatspreis.",
    ),
    truth: "handsoff" as SegmentId,
    key: t("simply take care of all of it", "einfach um alles kümmern"),
    clue: t("Does the account want evidence, control, or someone to do it?", "Will der Account Nachweise, Kontrolle, oder jemanden, der es macht?"),
    why: t("With no administrator left, the account wants everything handled for a planned price. Hands-off.", "Ohne Administrator will der Account alles zu einem planbaren Preis erledigt haben. Hands-off."),
    rejected: { assure: t("There is no auditor or authority in the note; the gap is capacity, not evidence.", "In der Notiz gibt es keinen Prüfer und keine Behörde; die Lücke ist Kapazität, nicht Nachweis.") },
  },
  {
    id: "a07" as AccountId,
    name: "Weber Spedition",
    sector: t("Logistics", "Logistik"),
    staff: 90,
    status: "prospect" as const,
    acv: 12000,
    note: t(
      "Wants a managed backup “where somebody else checks every night that it worked”. Does not want to learn a new portal.",
      "Will ein gemanagtes Backup, „bei dem jemand anderes jede Nacht prüft, dass es funktioniert hat“. Will kein neues Portal lernen.",
    ),
    truth: "handsoff" as SegmentId,
    key: t("somebody else checks every night that it worked", "jemand anderes jede Nacht prüft, dass es funktioniert hat"),
    clue: t("It is a logistics firm, like one of the Compliance-first accounts. What do its own words ask for?", "Es ist eine Logistikfirma wie einer der Compliance-first-Accounts. Wonach fragen die eigenen Worte?"),
    why: t("Somebody else should check it, and no portal: the service is to be run for the account. Hands-off, whatever the sector.", "Jemand anderes soll prüfen, und kein Portal: Der Service soll für den Account betrieben werden. Hands-off, egal welche Branche."),
    rejected: { assure: t("Same sector as Lohmann, but no auditor, no retention duty, no rights in the contract.", "Gleiche Branche wie Lohmann, aber kein Prüfer, keine Aufbewahrungspflicht, keine Rechte im Vertrag.") },
  },
  {
    id: "a08" as AccountId,
    name: "Praxisverbund Nord",
    sector: t("Healthcare (medical practices)", "Gesundheitswesen (Arztpraxen)"),
    staff: 60,
    status: "customer" as const,
    acv: 11000,
    note: t(
      "Wants the same contact person every time. Signed last year after one visit from the account manager and has not asked about certificates since.",
      "Will jedes Mal denselben Ansprechpartner. Hat letztes Jahr nach einem einzigen Besuch des Account Managers unterschrieben und seitdem nie nach Zertifikaten gefragt.",
    ),
    truth: "handsoff" as SegmentId,
    key: t("the same contact person every time", "jedes Mal denselben Ansprechpartner"),
    clue: t("It is healthcare, like Mediqon. What decided the purchase: documents, or a person?", "Es ist Gesundheitswesen wie Mediqon. Was hat den Kauf entschieden: Unterlagen oder eine Person?"),
    why: t("One visit decided it, the account wants one person and asks for no documents. Trust in a person, not evidence: Hands-off.", "Ein Besuch hat entschieden, der Account will eine Person und fragt nach keinen Unterlagen. Vertrauen in eine Person, nicht Nachweise: Hands-off."),
    rejected: { assure: t("Same sector as Mediqon, but it has never asked for evidence; it decided on a person.", "Gleiche Branche wie Mediqon, aber hat nie nach Nachweisen gefragt; hat sich für eine Person entschieden.") },
  },
  {
    id: "a09" as AccountId,
    name: "Altmann Maschinenbau",
    sector: t("Mechanical engineering", "Maschinenbau"),
    staff: 900,
    status: "prospect" as const,
    acv: 40000,
    note: t(
      "The CIO wants to shrink the internal operations team and buy the whole platform as a managed service, with a 24/7 SLA and one responsible contact.",
      "Der CIO will das interne Betriebsteam verkleinern und die gesamte Plattform als Managed Service einkaufen, mit 24/7-SLA und einem verantwortlichen Ansprechpartner.",
    ),
    truth: "handsoff" as SegmentId,
    key: t("buy the whole platform as a managed service", "die gesamte Plattform als Managed Service einkaufen"),
    clue: t("It is large. Does it want to run the platform itself, or have it run?", "Der Account ist groß. Will er die Plattform selbst betreiben oder betreiben lassen?"),
    why: t("900 employees, but the CIO wants operations taken off the company's hands. Size misleads; the need is to have it run. Hands-off.", "900 Mitarbeitende, aber der CIO will den Betrieb aus dem Haus geben. Die Größe täuscht; der Bedarf ist, betreiben zu lassen. Hands-off."),
    rejected: { scale: t("A large firm with an IT team, but it wants less control, not more.", "Eine große Firma mit IT-Team, aber sie will weniger Kontrolle, nicht mehr.") },
  },
  {
    id: "a10" as AccountId,
    name: "Pixelwerk Games",
    sector: t("Games studio", "Games-Studio"),
    staff: 70,
    status: "prospect" as const,
    acv: 38000,
    note: t(
      "Runs its own load tests before any decision. Asked for the API documentation and per-minute billing, not for a meeting.",
      "Führt vor jeder Entscheidung eigene Lasttests durch. Hat nach der API-Dokumentation und minutengenauer Abrechnung gefragt, nicht nach einem Termin.",
    ),
    truth: "scale" as SegmentId,
    key: t("Runs its own load tests", "Führt vor jeder Entscheidung eigene Lasttests"),
    clue: t("Who tests the service before the purchase, and how?", "Wer testet den Service vor dem Kauf, und wie?"),
    why: t("Own load tests, API docs and per-minute prices: the engineers want to measure and control. Scale-optimiser.", "Eigene Lasttests, API-Doku und Minutenpreise: Die Engineers wollen messen und steuern. Scale-optimiser."),
    rejected: { handsoff: t("A small studio, but it wants to do the technical work itself.", "Ein kleines Studio, aber es will die technische Arbeit selbst machen.") },
  },
  {
    id: "a11" as AccountId,
    name: "Datavia Analytics",
    sector: t("Software (SaaS)", "Software (SaaS)"),
    staff: 220,
    status: "customer" as const,
    acv: 55000,
    note: t(
      "Their platform team compares our price per vCPU with the hyperscalers every quarter and wants autoscaling for seasonal peaks.",
      "Ihr Plattformteam vergleicht jedes Quartal unseren Preis pro vCPU mit den Hyperscalern und will Autoscaling für saisonale Spitzen.",
    ),
    truth: "scale" as SegmentId,
    key: t("compares our price per vCPU with the hyperscalers every quarter", "vergleicht jedes Quartal unseren Preis pro vCPU mit den Hyperscalern"),
    clue: t("What is compared, and by whom?", "Was wird verglichen, und von wem?"),
    why: t("An in-house platform team measures price-performance and wants flexible capacity. Scale-optimiser.", "Ein internes Plattformteam misst das Preis-Leistungs-Verhältnis und will flexible Kapazität. Scale-optimiser."),
    rejected: { assure: t("Nothing is to be proven to a third party; the comparison is the team's own.", "Nichts muss einer dritten Stelle nachgewiesen werden; der Vergleich ist der eigene des Teams.") },
  },
  {
    id: "a12" as AccountId,
    name: "Nordlicht Energiehandel",
    sector: t("Energy trading", "Energiehandel"),
    staff: 300,
    status: "prospect" as const,
    acv: 47000,
    note: t(
      "An in-house DevOps team of 12 wants infrastructure as code (Terraform) and a two-week proof of concept instead of a sales presentation.",
      "Ein internes DevOps-Team mit 12 Personen will Infrastructure as Code (Terraform) und einen Proof of Concept über zwei Wochen statt einer Verkaufspräsentation.",
    ),
    truth: "scale" as SegmentId,
    key: t("a two-week proof of concept instead of a sales presentation", "einen Proof of Concept über zwei Wochen statt einer Verkaufspräsentation"),
    clue: t("Energy is often regulated. What does this account's own team ask for?", "Energie ist oft reguliert. Wonach fragt das eigene Team dieses Accounts?"),
    why: t("A DevOps team wants infrastructure as code and a technical test, not documents or a managed service. Scale-optimiser, although it is an energy business.", "Ein DevOps-Team will Infrastructure as Code und einen technischen Test, keine Unterlagen und keinen Managed Service. Scale-optimiser, obwohl es ein Energieunternehmen ist."),
    rejected: { assure: t("Same broad sector as Stadtwerke Emsland, but nobody asks for evidence; the team asks for a test.", "Grob dieselbe Branche wie Stadtwerke Emsland, aber niemand fragt nach Nachweisen; das Team fragt nach einem Test.") },
  },
]);

export const ACCOUNT_BY_ID = Object.fromEntries(ACCOUNTS.map((a) => [a.id, a])) as Record<AccountId, Account>;
export const ACCOUNT_IDS: AccountId[] = ["a01", "a02", "a03", "a04", "a05", "a06", "a07", "a08", "a09", "a10", "a11", "a12"];

const zero = () => ({ assure: 0, handsoff: 0, scale: 0 }) as Record<SegmentId, number>;
/** How many accounts carry each segment in the reference assignment, and their potential ACV. */
export const TRUTH_COUNTS: Record<SegmentId, number> = ACCOUNTS.reduce((o, a) => ({ ...o, [a.truth]: o[a.truth] + 1 }), zero());
export const TRUTH_ACV: Record<SegmentId, number> = ACCOUNTS.reduce((o, a) => ({ ...o, [a.truth]: o[a.truth] + a.acv }), zero());

/* ------------------------------------------------------------------ Block 2.2 · what the file does not tell you */

export type GapId = "margin" | "buyers" | "stable" | "market" | "postcode" | "opens" | "nace";
export const GAPS = bi([
  { id: "margin" as GapId, label: t("The gross margin of each account (the file shows contract value only)", "Die Bruttomarge jedes Accounts (die Datei zeigt nur den Vertragswert)"), useful: true, why: t("Business value is profit, not revenue. A segment with high contract values and costly delivery can be worth less than it looks.", "Geschäftswert ist Gewinn, nicht Umsatz. Ein Segment mit hohen Vertragswerten und teurer Leistung kann weniger wert sein, als es aussieht.") },
  { id: "buyers" as GapId, label: t("Who decides in each account, and how (the buying centre)", "Wer in jedem Account entscheidet, und wie (das Buying Center)"), useful: true, why: t("Segments are defined partly by decision behaviour. Twelve notes from account managers show it only through one contact's eyes.", "Segmente sind zum Teil über das Entscheidungsverhalten definiert. Zwölf Notizen von Account Managern zeigen es nur durch die Augen eines Kontakts.") },
  { id: "stable" as GapId, label: t("Whether each need is lasting or tied to one project", "Ob jeder Bedarf dauerhaft ist oder an ein Projekt gebunden"), useful: true, why: t("A need that ends with one audit or one migration does not make a segment worth building an offer for.", "Ein Bedarf, der mit einer Prüfung oder einer Migration endet, macht kein Segment, für das sich ein eigenes Angebot lohnt.") },
  { id: "market" as GapId, label: t("How many accounts of each segment exist beyond these twelve", "Wie viele Accounts jedes Segments es über diese zwölf hinaus gibt"), useful: true, why: t("Twelve accounts are a sample. Whether a segment is substantial enough to serve depends on how many more there are.", "Zwölf Accounts sind eine Stichprobe. Ob ein Segment groß genug ist, hängt davon ab, wie viele es noch gibt.") },
  { id: "postcode" as GapId, label: t("The postal code of every account", "Die Postleitzahl jedes Accounts"), useful: false, why: t("Location does not separate the three needs; it would not change the segment or the offer.", "Der Standort trennt die drei Bedarfe nicht; er würde weder Segment noch Angebot ändern.") },
  { id: "opens" as GapId, label: t("How often each contact opened our newsletter", "Wie oft jeder Kontakt unseren Newsletter geöffnet hat"), useful: false, why: t("An open rate measures our activity reaching someone, not the account's need or how it decides.", "Eine Öffnungsrate misst, ob unsere Aktivität jemanden erreicht, nicht den Bedarf des Accounts oder wie er entscheidet.") },
  { id: "nace" as GapId, label: t("The NACE industry code of every account", "Den NACE-Branchencode jedes Accounts"), useful: false, why: t("The sector is already in the file, and three sectors appear in two segments: the code does not predict the need.", "Die Branche steht schon in der Datei, und drei Branchen tauchen in zwei Segmenten auf: Der Code sagt den Bedarf nicht voraus.") },
]);
export const GAP_BY_ID = Object.fromEntries(GAPS.map((g) => [g.id, g])) as Record<GapId, (typeof GAPS)[number]>;
