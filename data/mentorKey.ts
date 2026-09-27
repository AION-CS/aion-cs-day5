import { ACCOUNTS, TRUTH_ACV } from "@/data/accounts";
import type { AccountId, GapId } from "@/data/accounts";
import { FIELDS } from "@/data/criteria";
import type { CritTag, FieldId } from "@/data/criteria";
import { MEASURE_BY_ID, MODEL_MEASURES, costPerAccount, evBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { CONTENT_TRUTH, SEGMENT_IDS, valueOf } from "@/data/segments";
import type { SegmentId } from "@/data/segments";
import { DIFF_TRUTH, TG_TRUTH } from "@/data/sketches";
import type { Basis } from "@/data/sketches";
import { TAILOR } from "@/data/tailoring";
import { CAND_IDS, MODEL_ABILITY, MODEL_ARCH, MODEL_ATTRACT, MODEL_GRID, MODEL_ROLE, MODEL_START, MODEL_TRIGGER, MODEL_TRIPWIRE, OWNER_ACCEPT } from "@/data/route2";
import type { ArchId, CandId, Level, OwnerId, SalesModel } from "@/data/route2";
import { euro, tt } from "@/lib/lang";
import type { L1State, R2State, Score } from "@/store/useStore";

/**
 * Every model answer of the day, in one file. "Fill all model answers" in the mentor bar enters these, so that after one fill every
 * route's missing list is empty and every export downloads at once. The answer keys (lib/answerKey.ts) and the worked answers
 * (lib/mentorGuide.ts) read the same constants, so the three cannot drift apart. Free text follows the site's language, so a fill
 * in German enters German answers. A convenience for facilitators, not security.
 */
export const MENTOR_PASSCODE = "muchson123";

/* ------------------------------------------------------------------ Route 1 */

export const MODEL_ORDER: MeasureId[] = ["compliance", "lane", "refs"];

export function KEY_L1(): Partial<L1State> {
  const profileText: Record<SegmentId, string> = {
    assure: tt(
      "They must prove to an auditor, a supervisor or a tender committee where the data is and how they could leave; they decide slowly, in a group, from documents.",
      "Sie müssen einem Prüfer, einer Aufsicht oder einer Vergabekommission nachweisen, wo die Daten liegen und wie sie wieder aussteigen könnten; sie entscheiden langsam, im Gremium, anhand von Unterlagen.",
    ),
    handsoff: tt(
      "They have no one to run IT and want it done for them at a planned monthly price; they decide quickly once they trust one person.",
      "Sie haben niemanden, der die IT betreibt, und wollen, dass es für sie erledigt wird, zu einem planbaren Monatspreis; sie entscheiden schnell, sobald sie einer Person vertrauen.",
    ),
    scale: tt(
      "Their own engineers want access, flexible capacity and prices they can compare; they decide through a technical test, not a sales meeting.",
      "Ihre eigenen Engineers wollen Zugriff, flexible Kapazität und vergleichbare Preise; sie entscheiden über einen technischen Test, nicht über ein Verkaufsgespräch.",
    ),
  };
  const sketches: { basis: Basis; text: string }[] = [
    {
      basis: "need",
      text: tt(
        "Proof buyers: accounts that must show an auditor or authority where their data is, who need documents and audit rights, and who decide slowly in a committee.",
        "Nachweis-Käufer: Accounts, die einem Prüfer oder einer Behörde zeigen müssen, wo ihre Daten liegen, die Unterlagen und Prüfrechte brauchen und langsam im Gremium entscheiden.",
      ),
    },
    {
      basis: "need",
      text: tt(
        "Do-it-for-me buyers: accounts without IT staff, who need the service run for them at a fixed price, and who decide quickly once they trust one person.",
        "Mach-es-für-mich-Käufer: Accounts ohne IT-Personal, die den Service für sich betrieben brauchen, zu einem festen Preis, und die schnell entscheiden, sobald sie einer Person vertrauen.",
      ),
    },
    {
      basis: "behaviour",
      text: tt(
        "Testers: accounts whose engineers run their own load tests and ask for API docs, who need access and comparable prices, and who decide by a proof of concept.",
        "Tester: Accounts, deren Engineers eigene Lasttests fahren und nach API-Doku fragen, die Zugriff und vergleichbare Preise brauchen und über einen Proof of Concept entscheiden.",
      ),
    },
  ];
  return {
    sort: Object.fromEntries(FIELDS.map((f) => [f.id, f.truth])) as Record<FieldId, CritTag>,
    extraCrit: tt(
      "Needs-based: whether the account has to meet a recovery time written into its own customer contracts. It is a duty the account must meet, whatever it did so far.",
      "Bedarfsbasiert: ob der Account eine Wiederherstellungszeit erfüllen muss, die in seinen eigenen Kundenverträgen steht. Es ist eine Pflicht, die er erfüllen muss, egal was er bisher getan hat.",
    ),
    fig: { F1: String(TAILOR.f1), F2: String(TAILOR.f2), F3: String(TAILOR.f3) },
    worth: tt(
      `Tailoring pays for Compliance-first: ${euro(TAILOR.f1)} more gross profit a year against a cost of ${euro(30000)}, a net ${euro(TAILOR.netAssure)}. For Hands-off it does not: the win rate barely moves, so the extra ${euro(TAILOR.f2)} leaves a net ${euro(TAILOR.f3)}. There, a standard offer is the better choice.`,
      `Der Zuschnitt lohnt sich für Compliance-first: ${euro(TAILOR.f1)} mehr Rohertrag pro Jahr bei Kosten von ${euro(30000)}, netto ${euro(TAILOR.netAssure)}. Für Hands-off nicht: Die Win Rate bewegt sich kaum, die zusätzlichen ${euro(TAILOR.f2)} ergeben netto ${euro(TAILOR.f3)}. Dort ist ein Standardangebot die bessere Wahl.`,
    ),
    tg: TG_TRUTH,
    diff: DIFF_TRUTH,
    sketches,
    reflect: {
      simplify: tt(
        "I first grouped the accounts by industry, because the file lists it. Lohmann and Weber are both logistics firms and want opposite things; the industry was the easy criterion, not the useful one.",
        "Ich habe die Accounts zuerst nach Branche gruppiert, weil die Datei sie nennt. Lohmann und Weber sind beide Logistikfirmen und wollen Gegensätzliches; die Branche war das bequeme Kriterium, nicht das nützliche.",
      ),
      worth: tt(
        "Personalising is worth it where the win rate moves and the contracts are large, as in Compliance-first. For small Hands-off accounts a well-made standard package does more than tailoring.",
        "Personalisierung lohnt sich, wo sich die Win Rate bewegt und die Verträge groß sind, wie bei Compliance-first. Für kleine Hands-off-Accounts bringt ein gut gemachtes Standardpaket mehr als Zuschnitt.",
      ),
      prioritise: tt(
        "A strategic decision-maker would rank the segments by the value they hold and by how well DataCloud can win them, put most of the budget on one or two, and serve the rest with a standard offer.",
        "Eine strategische Entscheiderin würde die Segmente nach ihrem Wert und danach ordnen, wie gut DataCloud sie gewinnen kann, den Großteil des Budgets auf ein oder zwei setzen und den Rest mit einem Standardangebot bedienen.",
      ),
    },
    assign: Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.truth])) as Record<AccountId, SegmentId>,
    profiles: Object.fromEntries(
      SEGMENT_IDS.map((s) => [s, { value: valueOf(TRUTH_ACV[s]), need: profileText[s], content: CONTENT_TRUTH[s] }]),
    ) as L1State["profiles"],
    gaps: ["margin", "buyers", "stable"] as GapId[],
    riskText: tt(
      "If we segment by industry, we send compliance documents to firms that want someone to run their IT. We would see it when proposals to “regulated” prospects stall although nobody asks about the documents.",
      "Wenn wir nach Branche segmentieren, schicken wir Compliance-Unterlagen an Firmen, die jemanden für den Betrieb wollen. Wir würden es sehen, wenn Angebote an „regulierte“ Prospects stocken, obwohl niemand nach den Unterlagen fragt.",
    ),
    chosen: [...MODEL_MEASURES],
    aims: Object.fromEntries(MODEL_MEASURES.map((id) => [id, [...MEASURE_BY_ID[id].targets]])) as Record<string, SegmentId[]>,
    rel: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.relevance])) as Record<string, Score>,
    dif: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.differentiation])) as Record<string, Score>,
    eco: Object.fromEntries(MODEL_MEASURES.map((id) => [id, evBucket(costPerAccount(id))])) as Record<string, Score>,
    order: [...MODEL_ORDER],
    why: tt(
      "The compliance evidence pack goes first: it scores 27 and answers the need of the segment with the highest value (€225,000 of potential contract value in the file). The self-service lane is second with 18, because it opens the Scale-optimiser segment. The reference programme comes third with 12. Together they cost €113,000 of the €120,000. Hands-off is not reached on purpose: its value is Low, and a standard package, not personalisation, is the answer there.",
      "Das Compliance-Nachweispaket kommt zuerst: Es erzielt 27 und beantwortet den Bedarf des Segments mit dem höchsten Wert (225.000 € potenzieller Vertragswert in der Datei). Der Self-Service-Zugang ist Zweiter mit 18, weil er das Segment Scale-optimiser öffnet. Das Referenzprogramm kommt als Drittes mit 12. Zusammen kosten sie 113.000 € von 120.000 €. Hands-off wird bewusst nicht erreicht: Sein Wert ist Niedrig, und dort ist ein Standardpaket die Antwort, nicht Personalisierung.",
    ),
  };
}

/* ------------------------------------------------------------------ Route 2 */

export const MODEL_SALES: Partial<Record<CandId, SalesModel>> = { assure: "key", scale: "self", handsoff: "partner" };

export function KEY_R2(): Partial<R2State> {
  const served = CAND_IDS.filter((id) => MODEL_ROLE[id] !== "deprio");
  const grid: Record<string, Level> = {};
  for (const id of served) {
    const g = MODEL_GRID[id];
    if (g) for (const [el, lv] of Object.entries(g)) grid[`${id}.${el}`] = lv;
  }
  return {
    crits: ["pool", "win", "confidence"],
    critText: {
      pool: tt(
        "Accounts times average contract value times gross margin: it shows where the profit is, not only where the revenue is.",
        "Accounts mal durchschnittlicher Vertragswert mal Bruttomarge: Es zeigt, wo der Gewinn liegt, nicht nur der Umsatz.",
      ),
      win: tt(
        "Our win rate in the segment today: it shows whether our offer fits the segment's need, or whether we would be buying our way in.",
        "Unsere heutige Win Rate im Segment: Sie zeigt, ob unser Angebot zum Bedarf passt, oder ob wir uns hineinkaufen müssten.",
      ),
      confidence: tt(
        "How far the segment's figures can be trusted: a segment with low data confidence gets a test, not the focus.",
        "Wie weit man den Zahlen eines Segments trauen kann: Ein Segment mit niedrigem Datenvertrauen bekommt einen Test, nicht den Fokus.",
      ),
    },
    attract: { ...MODEL_ATTRACT } as Record<string, Score>,
    ability: { ...MODEL_ABILITY } as Record<string, Score>,
    roles: { ...MODEL_ROLE },
    sales: { ...MODEL_SALES },
    prop: {
      assure: tt(
        "Your auditor gets every document before asking: German data centres, the C5 report, audit rights and a tested exit plan, with one key account manager who knows your rules.",
        "Ihr Prüfer bekommt jedes Dokument, bevor er fragt: deutsche Rechenzentren, der C5-Bericht, Prüfrechte und ein getesteter Exit-Plan, mit einem Key Account Manager, der Ihre Regeln kennt.",
      ),
      scale: tt(
        "Test us before anyone sells to you: full API access, a free test environment and a price per minute you can compare with any hyperscaler.",
        "Testen Sie uns, bevor Ihnen jemand etwas verkauft: voller API-Zugang, eine kostenlose Testumgebung und ein Minutenpreis, den Sie mit jedem Hyperscaler vergleichen können.",
      ),
      handsoff: tt(
        "We run it for you: one fixed monthly price, one local partner you can call, and nothing you have to operate yourself.",
        "Wir betreiben es für Sie: ein fester Monatspreis, ein lokaler Partner, den Sie anrufen können, und nichts, das Sie selbst betreiben müssen.",
      ),
    },
    grid,
    alloc: Object.fromEntries(MODEL_ARCH.map((id) => [id, true])),
    start: { ...MODEL_START } as Record<string, number>,
    owner: Object.fromEntries(MODEL_ARCH.map((id) => [id, OWNER_ACCEPT[id][0]])) as Record<string, OwnerId>,
    trigger: Object.fromEntries(MODEL_ARCH.map((id) => [id, MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER]])) as Record<string, string>,
    postponed: tt(
      "The managed standard package for Hands-off (€36,000) is left out. The four funded items already cost €146,000 of the €150,000, and Hands-off is served with the existing offer until the core segments work.",
      "Das Managed-Standardpaket für Hands-off (36.000 €) bleibt draußen. Die vier finanzierten Punkte kosten bereits 146.000 € von 150.000 €, und Hands-off wird mit dem bestehenden Angebot bedient, bis die Kernsegmente funktionieren.",
    ),
    pickup: tt(
      "If the Compliance-first win rate has reached 26% by month 4, we fund the standard package from the next budget round in month 5.",
      "Wenn die Win Rate bei Compliance-first bis Monat 4 26 % erreicht hat, finanzieren wir das Standardpaket aus der nächsten Budgetrunde in Monat 5.",
    ),
    decision: "stage",
    assumptions: [
      tt(
        "Most Compliance-first accounts really need evidence and not only a regulated industry code. This is wrong if fewer than 70 of the 140 accounts show the need in the new CRM fields by month 2.",
        "Die meisten Compliance-first-Accounts brauchen wirklich Nachweise und nicht nur einen regulierten Branchencode. Das ist falsch, wenn bis Monat 2 weniger als 70 der 140 Accounts den Bedarf in den neuen CRM-Feldern zeigen.",
      ),
      tt(
        "Scale-optimisers will test before they buy and convert when the test works. This is wrong if fewer than 20% of test environments become contracts by month 5.",
        "Scale-optimiser testen, bevor sie kaufen, und schließen ab, wenn der Test funktioniert. Das ist falsch, wenn bis Monat 5 weniger als 20 % der Testumgebungen zu Verträgen werden.",
      ),
      tt(
        "Hands-off customers stay with the existing standard offer while we focus elsewhere. This is wrong if more than 3% of them cancel in the six months.",
        "Hands-off-Kunden bleiben beim bestehenden Standardangebot, während wir uns auf andere Segmente konzentrieren. Das ist falsch, wenn in den sechs Monaten mehr als 3 % kündigen.",
      ),
    ],
    tripKpi: MODEL_TRIPWIRE.kpi,
    tripThreshold: String(MODEL_TRIPWIRE.threshold),
    tripMonth: MODEL_TRIPWIRE.month,
    tripAction: "adjust",
    challenge: tt(
      "I keep the focus but check it before spending more. Without the 40 accounts the segment is about 100 accounts, still the highest profit per account in the file, so it stays a core segment. I hold back the second key account manager until month 4, move €10,000 to finishing the segment fields, and re-rate the segment with the cleaned data. If the win rate misses 26% at month 4, I shift the key account money to the self-service lane.",
      "Ich halte den Fokus, prüfe ihn aber, bevor ich mehr ausgebe. Ohne die 40 Accounts hat das Segment etwa 100 Accounts und immer noch den höchsten Gewinn pro Account in der Datei, also bleibt es ein Kernsegment. Den zweiten Key Account Manager halte ich bis Monat 4 zurück, verschiebe 10.000 € in die Fertigstellung der Segmentfelder und bewerte das Segment mit den bereinigten Daten neu. Verfehlt die Win Rate in Monat 4 die 26 %, verschiebe ich das Key-Account-Geld in den Self-Service-Zugang.",
    ),
  };
}

export type { ArchId };
