import { bi, t } from "@/lib/lang";

/**
 * Route 2 (Level 3) data: the Transfer Project. DataCloud's Chief Sales Officer decides which segments to focus on, how to sell to
 * each, what to standardise and what to individualise, and how to implement it, with incomplete customer data. Every figure below
 * is a Case assumption (the plan gives the role, the situation and the constraints, not numbers). Model values are used only by the
 * checks, the answer keys and the worked answers; they are never printed to a learner as an answer.
 */
export const R2_BUDGET = 150000;
export const R2_MONTHS = 6;
export type Bucket = 1 | 2 | 3;

/* ------------------------------------------------------------------ 3.1 · prioritisation criteria */

export type CritId = "pool" | "win" | "growth" | "fit" | "cost" | "confidence";
export const CRIT_IDS: CritId[] = ["pool", "win", "growth", "fit", "cost", "confidence"];
export const CRITERIA = bi({
  pool: { id: "pool" as CritId, name: t("Profit pool", "Profit Pool"), kind: "attract" as const, means: t("Accounts × average contract value × gross margin: how much profit the segment holds for anyone who serves it.", "Accounts × durchschnittlicher Vertragswert × Bruttomarge: wie viel Gewinn das Segment für jeden bereithält, der es bedient.") },
  win: { id: "win" as CritId, name: t("Ability to win", "Ability to win (Gewinnfähigkeit)"), kind: "ability" as const, means: t("How often DataCloud wins there today (win rate), because its offer fits what the segment needs.", "Wie oft DataCloud dort heute gewinnt (Win Rate), weil das Angebot zu dem passt, was das Segment braucht.") },
  growth: { id: "growth" as CritId, name: t("Growth", "Wachstum"), kind: "attract" as const, means: t("How fast the segment's spending on cloud services grows per year.", "Wie schnell die Ausgaben des Segments für Cloud-Services pro Jahr wachsen.") },
  fit: { id: "fit" as CritId, name: t("Strategic fit", "Strategischer Fit"), kind: "ability" as const, means: t("Whether serving the segment builds on what DataCloud already is: German data centres, certified operations, a regional team.", "Ob die Bedienung des Segments auf dem aufbaut, was DataCloud schon ist: deutsche Rechenzentren, zertifizierter Betrieb, ein regionales Team.") },
  cost: { id: "cost" as CritId, name: t("Cost to serve", "Cost to Serve (Betreuungskosten)"), kind: "ability" as const, means: t("What it costs to sell to and look after one account, compared with what the account brings.", "Was es kostet, einem Account zu verkaufen und ihn zu betreuen, verglichen mit dem, was er bringt.") },
  confidence: { id: "confidence" as CritId, name: t("Data confidence", "Datenvertrauen"), kind: "other" as const, means: t("How far the figures for the segment can be trusted: how many accounts they rest on and how they were collected.", "Wie weit man den Zahlen zum Segment trauen kann: auf wie vielen Accounts sie beruhen und wie sie erhoben wurden.") },
});
/** The two axes of the matrix: one attractiveness criterion and one ability-to-win criterion must be among the three. */
export const CRIT_MUST: CritId[] = ["pool", "win"];

/* ------------------------------------------------------------------ 3.2 · five candidate segments */

export type CandId = "assure" | "handsoff" | "scale" | "public" | "ai";
export const CAND_IDS: CandId[] = ["assure", "handsoff", "scale", "public", "ai"];
export type Confidence = "high" | "mid" | "low";

export type Candidate = {
  id: CandId;
  name: string;
  who: string;
  accounts: number;
  acv: number;
  margin: number;
  winRate: number;
  growth: number;
  confidence: Confidence;
  confidenceWhy: string;
  decides: string;
};

export const CANDIDATES: Candidate[] = bi([
  {
    id: "assure" as CandId,
    name: t("Compliance-first", "Compliance-first"),
    who: t("Regulated Mittelstand firms that must prove where their data is (health, finance, utilities).", "Regulierte Mittelständler, die nachweisen müssen, wo ihre Daten liegen (Gesundheit, Finanzen, Versorger)."),
    accounts: 140,
    acv: 56000,
    margin: 38,
    winRate: 22,
    growth: 12,
    confidence: "mid" as Confidence,
    confidenceWhy: t("Counted from the CRM; about a third were tagged by industry code, not by a stated need.", "Aus dem CRM gezählt; etwa ein Drittel wurde nach Branchencode markiert, nicht nach einem genannten Bedarf."),
    decides: t("A committee with IT, legal and the data protection officer.", "Ein Gremium aus IT, Rechtsabteilung und Datenschutz."),
  },
  {
    id: "handsoff" as CandId,
    name: t("Hands-off", "Hands-off"),
    who: t("Small and mid-sized firms without IT staff that want the service run for them.", "Kleine und mittlere Firmen ohne IT-Personal, die den Service betrieben haben wollen."),
    accounts: 900,
    acv: 10000,
    margin: 22,
    winRate: 25,
    growth: 4,
    confidence: "high" as Confidence,
    confidenceWhy: t("Many existing customers; contract data is complete.", "Viele Bestandskunden; die Vertragsdaten sind vollständig."),
    decides: t("One owner-manager or office manager, after meeting a person.", "Ein Inhaber oder eine Büroleitung, nach dem Treffen mit einer Person."),
  },
  {
    id: "scale" as CandId,
    name: t("Scale-optimiser", "Scale-optimiser"),
    who: t("Firms with their own platform engineers that want access, flexible capacity and comparable prices.", "Firmen mit eigenen Platform Engineers, die Zugriff, flexible Kapazität und vergleichbare Preise wollen."),
    accounts: 200,
    acv: 45000,
    margin: 28,
    winRate: 12,
    growth: 18,
    confidence: "mid" as Confidence,
    confidenceWhy: t("Few customers so far; the win rate rests on 25 proposals.", "Bisher wenige Kunden; die Win Rate beruht auf 25 Angeboten."),
    decides: t("The engineering team, through a technical test.", "Das Engineering-Team, über einen technischen Test."),
  },
  {
    id: "public" as CandId,
    name: t("Public administration", "Öffentliche Verwaltung"),
    who: t("Municipal and regional authorities buying cloud services through formal tenders.", "Kommunale und regionale Behörden, die Cloud-Services über förmliche Ausschreibungen kaufen."),
    accounts: 60,
    acv: 90000,
    margin: 25,
    winRate: 5,
    growth: 8,
    confidence: "low" as Confidence,
    confidenceWhy: t("Two tenders so far, one lost; the other figures are market estimates.", "Bisher zwei Ausschreibungen, eine verloren; die übrigen Zahlen sind Markt­schätzungen."),
    decides: t("A tender procedure with fixed criteria and long deadlines.", "Ein Vergabeverfahren mit festen Kriterien und langen Fristen."),
  },
  {
    id: "ai" as CandId,
    name: t("AI start-ups", "KI-Start-ups"),
    who: t("Young firms training models on rented GPU capacity.", "Junge Firmen, die Modelle auf gemieteter GPU-Kapazität trainieren."),
    accounts: 80,
    acv: 30000,
    margin: 15,
    winRate: 8,
    growth: 40,
    confidence: "low" as Confidence,
    confidenceWhy: t("Three trials, no signed contract yet; the growth figure is from a market report.", "Drei Tests, noch kein unterschriebener Vertrag; die Wachstumszahl stammt aus einem Marktbericht."),
    decides: t("The founders, on price per GPU hour.", "Die Gründer, nach dem Preis pro GPU-Stunde."),
  },
]);
export const CAND_BY_ID = Object.fromEntries(CANDIDATES.map((c) => [c.id, c])) as Record<CandId, Candidate>;
export const CONF_LABEL = bi({ high: t("High", "Hoch"), mid: t("Mid", "Mittel"), low: t("Low", "Niedrig") });

/** Profit pool = accounts × ACV × margin. */
export const poolOf = (id: CandId) => {
  const c = CAND_BY_ID[id];
  return c.accounts * c.acv * (c.margin / 100);
};
/** The bucket rules of Materi B1. Attractiveness from the profit pool, ability to win from the win rate. */
export const POOL_HIGH = 2500000;
export const POOL_MID = 1000000;
export const attractBucket = (pool: number): Bucket => (pool >= POOL_HIGH ? 3 : pool >= POOL_MID ? 2 : 1);
export const abilityBucket = (winRate: number): Bucket => (winRate >= 20 ? 3 : winRate >= 10 ? 2 : 1);
export const MODEL_ATTRACT = Object.fromEntries(CAND_IDS.map((id) => [id, attractBucket(poolOf(id))])) as Record<CandId, Bucket>;
export const MODEL_ABILITY = Object.fromEntries(CAND_IDS.map((id) => [id, abilityBucket(CAND_BY_ID[id].winRate)])) as Record<CandId, Bucket>;

export type Role = "core" | "standard" | "deprio";
export const ROLE_IDS: Role[] = ["core", "standard", "deprio"];
export const ROLES = bi({
  core: { id: "core" as Role, label: t("Core", "Kernsegment"), sub: t("Focus: own offer, own sales model, most of the budget.", "Fokus: eigenes Angebot, eigenes Vertriebsmodell, der Großteil des Budgets.") },
  standard: { id: "standard" as Role, label: t("Serve standard", "Standardisiert bedienen"), sub: t("Keep and serve efficiently with a standard offer.", "Halten und effizient mit einem Standardangebot bedienen.") },
  deprio: { id: "deprio" as Role, label: t("Deprioritise", "Zurückstellen"), sub: t("No active investment now; revisit when the data improves.", "Jetzt keine aktive Investition; wieder prüfen, wenn die Daten besser sind.") },
});
/** The role rule of B1, applied to a pair of buckets. */
export const roleOf = (attract: Bucket, ability: Bucket): Role => (attract === 1 || ability === 1 ? "deprio" : attract === 3 && ability >= 2 ? "core" : "standard");
export const CORE_COUNT = 2;
export const MODEL_ROLE = Object.fromEntries(CAND_IDS.map((id) => [id, roleOf(MODEL_ATTRACT[id], MODEL_ABILITY[id])])) as Record<CandId, Role>;

/* ------------------------------------------------------------------ 3.3 · sales model per segment */

export type SalesModel = "key" | "field" | "inside" | "self" | "partner";
export const MODEL_IDS: SalesModel[] = ["key", "field", "inside", "self", "partner"];
export const SALES_MODELS = bi({
  key: { id: "key" as SalesModel, name: t("Key account team", "Key-Account-Team"), cost: 16000, share: 0, how: t("A named account manager and a solution architect per account, many meetings, a written account plan.", "Ein fester Account Manager und ein Solution Architect pro Account, viele Termine, ein schriftlicher Account-Plan."), fits: t("Group decisions with documents and many people involved.", "Gremienentscheidungen mit Unterlagen und vielen Beteiligten.") },
  field: { id: "field" as SalesModel, name: t("Field sales", "Außendienst"), cost: 10000, share: 0, how: t("A seller visits the account, runs a workshop and writes the proposal.", "Ein Verkäufer besucht den Account, macht einen Workshop und schreibt das Angebot."), fits: t("Decisions that need a personal meeting and some tailoring.", "Entscheidungen, die ein persönliches Treffen und etwas Zuschnitt brauchen.") },
  inside: { id: "inside" as SalesModel, name: t("Inside sales", "Inside Sales"), cost: 3000, share: 0, how: t("Calls and video meetings from the office, standard proposals.", "Anrufe und Videotermine aus dem Büro, Standardangebote."), fits: t("Clear needs, one or two decision makers, a standard offer.", "Klare Bedarfe, ein oder zwei Entscheider, ein Standardangebot.") },
  self: { id: "self" as SalesModel, name: t("Digital self-service", "Digitaler Self-Service"), cost: 600, share: 0, how: t("The account tests, buys and scales online; technical staff answer questions when asked.", "Der Account testet, kauft und skaliert online; technisches Personal beantwortet Fragen auf Anfrage."), fits: t("Buyers who want to test and decide themselves.", "Käufer, die selbst testen und entscheiden wollen.") },
  partner: { id: "partner" as SalesModel, name: t("Partner channel", "Partnervertrieb"), cost: 0, share: 20, how: t("Local IT service firms sell and support the offer and keep 20% of the first-year contract value.", "Lokale IT-Dienstleister verkaufen und betreuen das Angebot und behalten 20 % des Erstjahres-Vertragswerts."), fits: t("Many small accounts that want a person nearby.", "Viele kleine Accounts, die eine Person in der Nähe wollen.") },
});
/** Cost of one won deal under a model, for a segment's contract value. */
export const costPerDeal = (m: SalesModel, acv: number) => (m === "partner" ? acv * (SALES_MODELS.partner.share / 100) : SALES_MODELS[m].cost);
/** The rule of B2: the cost of winning a deal stays at or below 30% of the first-year contract value. */
export const COST_SHARE_MAX = 30;
/** The models that defend for each segment: inside the cost rule and matching how the segment decides (reference answer). */
export const MODEL_ACCEPT: Record<CandId, SalesModel[]> = {
  assure: ["key", "field"],
  handsoff: ["partner", "inside"],
  scale: ["self", "inside"],
  public: ["key"],
  ai: ["self", "inside"],
};

/* ------------------------------------------------------------------ 3.4 · standardise or individualise */

export type ElementId = "platform" | "contract" | "onboarding" | "pricing" | "content";
export const ELEMENT_IDS: ElementId[] = ["platform", "contract", "onboarding", "pricing", "content"];
export const ELEMENTS = bi({
  platform: { id: "platform" as ElementId, name: t("Platform and product", "Plattform und Produkt"), sub: t("The cloud platform itself and its service levels.", "Die Cloud-Plattform selbst und ihre Service Levels.") },
  contract: { id: "contract" as ElementId, name: t("Contract and compliance terms", "Vertrag und Compliance-Klauseln"), sub: t("Audit rights, exit plan, data processing agreement.", "Prüfrechte, Exit-Plan, Auftragsverarbeitungsvertrag.") },
  onboarding: { id: "onboarding" as ElementId, name: t("Onboarding", "Onboarding"), sub: t("Migration, set-up and the first weeks.", "Migration, Einrichtung und die ersten Wochen.") },
  pricing: { id: "pricing" as ElementId, name: t("Pricing model", "Preismodell"), sub: t("Fixed monthly, per user, per unit of use.", "Fester Monatspreis, pro Nutzer, pro Nutzungseinheit.") },
  content: { id: "content" as ElementId, name: t("Communication and content", "Kommunikation und Inhalte"), sub: t("Proposals, arguments, references, newsletters.", "Angebote, Argumente, Referenzen, Newsletter.") },
});
export type Level = "std" | "mod" | "ind";
export const LEVEL_IDS: Level[] = ["std", "mod", "ind"];
export const LEVELS = bi({
  std: { id: "std" as Level, label: t("Standard", "Standard"), glyph: "○", sub: t("The same for every account.", "Für jeden Account gleich.") },
  mod: { id: "mod" as Level, label: t("Modular", "Modular"), glyph: "◐", sub: t("Choose from prepared building blocks.", "Auswahl aus vorbereiteten Bausteinen.") },
  ind: { id: "ind" as Level, label: t("Individual", "Individuell"), glyph: "●", sub: t("Made for the account.", "Für den Account gemacht.") },
});
/** Cost per account and year of one element at each level (Materi B3). */
export const LEVEL_COST: Record<Level, number> = { std: 0, mod: 300, ind: 2500 };
/** The limit of B3: the tailoring cost per account stays at or below 20% of the gross margin the account brings. */
export const TAILOR_SHARE_MAX = 20;
export const marginPerAccount = (id: CandId) => CAND_BY_ID[id].acv * (CAND_BY_ID[id].margin / 100);
export const tailorLimit = (id: CandId) => marginPerAccount(id) * (TAILOR_SHARE_MAX / 100);
export const MODEL_GRID: Partial<Record<CandId, Record<ElementId, Level>>> = {
  assure: { platform: "std", contract: "ind", onboarding: "mod", pricing: "std", content: "mod" },
  scale: { platform: "std", contract: "std", onboarding: "mod", pricing: "mod", content: "mod" },
  handsoff: { platform: "std", contract: "std", onboarding: "std", pricing: "std", content: "mod" },
};

/* ------------------------------------------------------------------ 3.5 · measures architecture */

export type ArchId = "segdata" | "pack" | "kam" | "lane" | "care" | "partner" | "playbook" | "tender";
export const ARCH_IDS: ArchId[] = ["segdata", "pack", "kam", "lane", "care", "partner", "playbook", "tender"];
export type ArchItem = { id: ArchId; name: string; what: string; cost: number; weeks: number; serves: CandId[] | "all" };
export const ARCH: ArchItem[] = bi([
  { id: "segdata" as ArchId, name: t("Segment fields in the CRM", "Segmentfelder im CRM"), what: t("Need and decision behaviour recorded for every account, and a monthly segment report.", "Bedarf und Entscheidungsverhalten für jeden Account erfasst, und ein monatlicher Segmentbericht."), cost: 15000, weeks: 4, serves: "all" as const },
  { id: "pack" as ArchId, name: t("Compliance evidence pack", "Compliance-Nachweispaket"), what: t("A ready audit folder (C5 report, data-location map, audit clause) sent with every regulated proposal.", "Ein fertiger Prüfordner (C5-Bericht, Übersicht der Datenstandorte, Prüfklausel), der mit jedem regulierten Angebot verschickt wird."), cost: 38000, weeks: 6, serves: ["assure"] as CandId[] },
  { id: "kam" as ArchId, name: t("Key account team for Compliance-first", "Key-Account-Team für Compliance-first"), what: t("Two key account managers for the largest regulated accounts, for six months.", "Zwei Key Account Manager für die größten regulierten Accounts, für sechs Monate."), cost: 48000, weeks: 8, serves: ["assure"] as CandId[] },
  { id: "lane" as ArchId, name: t("Technical self-service lane", "Technischer Self-Service-Zugang"), what: t("API documentation, a free test environment and a usage-based price calculator.", "API-Dokumentation, eine kostenlose Testumgebung und ein nutzungsbasierter Preisrechner."), cost: 45000, weeks: 10, serves: ["scale"] as CandId[] },
  { id: "care" as ArchId, name: t("Managed standard package", "Managed-Standardpaket"), what: t("One fixed monthly price, one named contact, nothing to operate.", "Ein fester Monatspreis, ein fester Ansprechpartner, nichts selbst zu betreiben."), cost: 36000, weeks: 6, serves: ["handsoff"] as CandId[] },
  { id: "partner" as ArchId, name: t("Partner channel for small accounts", "Partnervertrieb für kleine Accounts"), what: t("Five local IT service partners trained to sell and support the standard package.", "Fünf lokale IT-Dienstleister, geschult im Verkauf und in der Betreuung des Standardpakets."), cost: 25000, weeks: 8, serves: ["handsoff"] as CandId[] },
  { id: "playbook" as ArchId, name: t("Segment playbook and training", "Segment-Playbook und Training"), what: t("A talk track and a benefit argument per segment for every seller.", "Ein Gesprächsleitfaden und ein Nutzenargument pro Segment für jeden Verkäufer."), cost: 28000, weeks: 5, serves: "all" as const },
  { id: "tender" as ArchId, name: t("Tender team for public administration", "Ausschreibungsteam für die öffentliche Verwaltung"), what: t("A bid manager and templates for public tenders.", "Ein Bid Manager und Vorlagen für öffentliche Ausschreibungen."), cost: 50000, weeks: 12, serves: ["public"] as CandId[] },
]);
export const ARCH_BY_ID = Object.fromEntries(ARCH.map((a) => [a.id, a])) as Record<ArchId, ArchItem>;
/** The baseline item: it produces the evidence for all the others, so it starts first (Materi B5). */
export const BASELINE_ITEM: ArchId = "segdata";

export type OwnerId = "cso" | "salesops" | "legal" | "product" | "ops" | "channel" | "enablement" | "marketing";
export const OWNER_IDS: OwnerId[] = ["cso", "salesops", "legal", "product", "ops", "channel", "enablement", "marketing"];
export const OWNERS = bi({
  cso: { id: "cso" as OwnerId, name: t("Chief Sales Officer (you)", "Chief Sales Officer (Sie)"), profile: t("Decides across sales and answers to the board; hires and directs the sellers. Should hold few items, or decisions queue at one desk.", "Entscheidet über den gesamten Vertrieb und berichtet an den Vorstand; stellt Verkäufer ein und führt sie. Sollte wenige Punkte halten, sonst stauen sich Entscheidungen an einem Schreibtisch.") },
  salesops: { id: "salesops" as OwnerId, name: t("Head of Sales Operations", "Leitung Sales Operations"), profile: t("Owns the CRM, its fields, the reports and the sales process.", "Verantwortet das CRM, seine Felder, die Berichte und den Vertriebsprozess.") },
  legal: { id: "legal" as OwnerId, name: t("Legal counsel", "Rechtsabteilung"), profile: t("Owns contract terms, audit clauses and what may be promised.", "Verantwortet Vertragsklauseln, Prüfklauseln und was zugesagt werden darf.") },
  product: { id: "product" as OwnerId, name: t("Head of Product and Platform", "Leitung Produkt und Plattform"), profile: t("Owns the platform, the API, the documentation and the test environments.", "Verantwortet die Plattform, die API, die Dokumentation und die Testumgebungen.") },
  ops: { id: "ops" as OwnerId, name: t("Head of Operations", "Leitung Betrieb"), profile: t("Owns the managed services, monitoring and the service desk.", "Verantwortet die Managed Services, das Monitoring und den Service Desk.") },
  channel: { id: "channel" as OwnerId, name: t("Channel manager", "Channel Manager"), profile: t("Recruits, trains and manages the partner firms.", "Gewinnt, schult und steuert die Partnerfirmen.") },
  enablement: { id: "enablement" as OwnerId, name: t("Sales enablement lead", "Leitung Sales Enablement"), profile: t("Writes the playbooks and trains the sellers. Cannot change contracts or the platform.", "Schreibt die Playbooks und schult den Vertrieb. Kann weder Verträge noch Plattform ändern.") },
  marketing: { id: "marketing" as OwnerId, name: t("Marketing lead", "Marketingleitung"), profile: t("Owns the written material, the website and the campaigns.", "Verantwortet die schriftlichen Unterlagen, die Website und die Kampagnen.") },
});
export const OWNER_ACCEPT: Record<ArchId, OwnerId[]> = {
  segdata: ["salesops"],
  pack: ["legal", "marketing"],
  kam: ["cso"],
  lane: ["product"],
  care: ["ops"],
  partner: ["channel"],
  playbook: ["enablement"],
  tender: ["cso"],
};
export const MODEL_ARCH: ArchId[] = ["segdata", "pack", "kam", "lane"];
export const MODEL_START: Partial<Record<ArchId, number>> = { segdata: 1, pack: 1, lane: 2, kam: 2 };
export const MODEL_TRIGGER = bi({
  segdata: t("If fewer than 80% of open accounts have need and decision fields filled by month 2, the segment report stops and the fields are fixed first.", "Wenn bis Monat 2 weniger als 80 % der offenen Accounts ausgefüllte Bedarfs- und Entscheidungsfelder haben, wird der Segmentbericht gestoppt und zuerst die Felder repariert."),
  pack: t("If fewer than 70% of regulated proposals go out with the pack by month 3, legal and marketing review the process together.", "Wenn bis Monat 3 weniger als 70 % der regulierten Angebote mit dem Paket rausgehen, prüfen Rechtsabteilung und Marketing gemeinsam den Ablauf."),
  kam: t("If the Compliance-first win rate is below 26% at month 4, one key account manager moves to the new accounts and the account plans are reviewed.", "Wenn die Win Rate bei Compliance-first in Monat 4 unter 26 % liegt, wechselt ein Key Account Manager zu den Neukunden und die Account-Pläne werden überprüft."),
  lane: t("If fewer than 20% of test environments turn into a contract by month 5, the free test is cut to 7 days and the price calculator is reviewed.", "Wenn bis Monat 5 weniger als 20 % der Testumgebungen zu einem Vertrag werden, wird der kostenlose Test auf 7 Tage verkürzt und der Preisrechner überprüft."),
});

/* ------------------------------------------------------------------ 3.6 · the decision */

export type DecisionId = "commit" | "stage" | "wait";
export const DECISIONS = bi([
  {
    id: "commit" as DecisionId,
    label: t("Commit now to both core segments", "Jetzt voll auf beide Kernsegmente setzen"),
    detail: t("Fund everything for both core segments at once and move all sellers from month 1.", "Alles für beide Kernsegmente sofort finanzieren und ab Monat 1 alle Verkäufer umsetzen."),
    why: t("Fast and clear, and it defends only if the segment data is solid. With a third of one segment tagged by industry code, it is a bet on unchecked data.", "Schnell und klar, und nur vertretbar, wenn die Segmentdaten solide sind. Wenn ein Drittel eines Segments nach Branchencode markiert wurde, ist es eine Wette auf ungeprüfte Daten."),
    rejected: t("Most of the money is committed before the new CRM fields can show whether the segments are as large as assumed.", "Der Großteil des Geldes ist gebunden, bevor die neuen CRM-Felder zeigen können, ob die Segmente so groß sind wie angenommen."),
  },
  {
    id: "stage" as DecisionId,
    label: t("Decide now, stage it, with a tripwire", "Jetzt entscheiden, stufenweise umsetzen, mit Tripwire"),
    detail: t("Name the two core segments now, start with the data fields and the cheapest proven measures, and scale at month 4 only if the tripwire is met.", "Die zwei Kernsegmente jetzt benennen, mit den Datenfeldern und den günstigsten erprobten Maßnahmen starten und in Monat 4 nur skalieren, wenn der Tripwire erreicht ist."),
    why: t("It makes the segment decision the brief asks for, while the first months produce the data that was missing.", "Es trifft die Segmententscheidung, die der Auftrag verlangt, während die ersten Monate die fehlenden Daten liefern."),
    rejected: t("", ""),
  },
  {
    id: "wait" as DecisionId,
    label: t("Wait for complete segment data", "Auf vollständige Segmentdaten warten"),
    detail: t("Hold the budget, fill the CRM fields for six months, then decide.", "Das Budget halten, sechs Monate lang die CRM-Felder füllen, dann entscheiden."),
    why: t("", ""),
    rejected: t("The brief asks for a segment decision despite incomplete data. Waiting keeps every generic offer in the market for six more months.", "Der Auftrag verlangt eine Segmententscheidung trotz unvollständiger Daten. Warten lässt jedes generische Angebot sechs weitere Monate im Markt."),
  },
]);
export const MODEL_DECISION: DecisionId = "stage";

export type KpiId = "winassure" | "cycle" | "poc" | "fields" | "mails";
export const KPIS = bi([
  { id: "winassure" as KpiId, label: t("Win rate in Compliance-first", "Win Rate in Compliance-first"), unit: "%", baseline: 22, better: "up" as const, behaviour: true },
  { id: "cycle" as KpiId, label: t("Median days from first call to signature, Compliance-first", "Median Tage vom Erstgespräch bis zur Unterschrift, Compliance-first"), unit: t("days", "Tage"), baseline: 95, better: "down" as const, behaviour: true },
  { id: "poc" as KpiId, label: t("Test environments that become a contract, Scale-optimiser", "Testumgebungen, die zu einem Vertrag werden, Scale-optimiser"), unit: "%", baseline: 18, better: "up" as const, behaviour: true },
  { id: "fields" as KpiId, label: t("Accounts with segment fields filled in the CRM", "Accounts mit ausgefüllten Segmentfeldern im CRM"), unit: "%", baseline: 10, better: "up" as const, behaviour: false },
  { id: "mails" as KpiId, label: t("Personalised emails sent per month", "Versendete personalisierte E-Mails pro Monat"), unit: t("emails", "E-Mails"), baseline: 400, better: "up" as const, behaviour: false },
]);
export const KPI_BY_ID = Object.fromEntries(KPIS.map((k) => [k.id, k])) as Record<KpiId, (typeof KPIS)[number]>;
export const MODEL_TRIPWIRE = { kpi: "winassure" as KpiId, threshold: 28, month: 4 };

export const R2_BASELINE_NOTE = bi({ v: t("Baselines are Case assumptions from DataCloud's last twelve months.", "Die Ausgangswerte sind Fallannahmen aus den letzten zwölf Monaten von DataCloud.") });

/** The board's challenge in Block 3.6. */
export const BOARD_CHALLENGE = bi({
  v: t(
    "It is month 2. The new CRM fields show that 40 of the 140 accounts counted as Compliance-first were placed there by their industry code, not by a stated need. The segment may be almost a third smaller than you assumed. The board asks whether you keep your focus and what you do with the rest of the budget.",
    "Es ist Monat 2. Die neuen CRM-Felder zeigen, dass 40 der 140 Accounts, die als Compliance-first gezählt wurden, nach ihrem Branchencode dort gelandet sind, nicht nach einem genannten Bedarf. Das Segment könnte fast ein Drittel kleiner sein als angenommen. Der Vorstand fragt, ob Sie Ihren Fokus halten und was Sie mit dem restlichen Budget machen.",
  ),
});
