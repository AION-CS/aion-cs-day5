import { TRUTH_ACV, TRUTH_COUNTS } from "@/data/accounts";
import { BUDGET, MEASURE_BY_ID, MODEL_COST, costPerAccount, evBucket, modelScore } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { SEGMENTS, VALUE_LABEL, valueOf } from "@/data/segments";
import type { SegmentId } from "@/data/segments";
import { DATACLOUD, TAILOR } from "@/data/tailoring";
import type { FigureId } from "@/data/tailoring";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, CAND_BY_ID, CRITERIA, MODEL_TRIGGER, OWNERS, OWNER_ACCEPT, R2_BUDGET, SALES_MODELS, costPerDeal } from "@/data/route2";
import type { ArchId, CandId, CritId } from "@/data/route2";
import { euro, tt } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = {
  title: string;
  /** The model answer, as a learner would enter it. */
  answer: string;
  /**
   * A learner-facing worked example, shown by <ExampleAnswer> instead of `answer` when the field's own answer is the case's calculated
   * result or one of a small fixed set of correct picks. Same method as `answer`, but generic names and different numbers, so it
   * teaches the method without handing over this case's result. Leave unset when `answer` is safe to show as-is (an open reflection).
   */
  example?: string;
  steps?: WorkedStep[];
  why?: string;
  lookFor?: string[];
  pitfalls?: string[];
};

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");
const L1 = () => KEY_L1();
const R2 = () => KEY_R2();

/* ------------------------------------------------------------------ Route 1 */

export function extraCritGuide(): MentorGuide {
  return {
    title: "1.1 · A criterion of your own",
    answer: L1().extraCrit ?? "",
    why: "Any field that separates needs or decision behaviour is a good answer; the kind must be named correctly.",
    lookFor: ["A field DataCloud could record (not already one of the nine).", "Its kind named, and named correctly by the three tests of A3.", "Ideally needs-based or behaviour-based, since those separate the segments."],
    pitfalls: ["Another firmographic field (turnover, legal form): correct kind, but it adds little.", "A field that mixes two kinds (“large clients who complain”): ask which half is the criterion."],
  };
}

export function figureGuide(id: FigureId): MentorGuide {
  const seg = id === "F1" ? DATACLOUD.assure : DATACLOUD.handsoff;
  const name = id === "F1" ? "Compliance-first" : "Hands-off";
  if (id !== "F3") {
    const up = seg.tailored - seg.standard;
    const wins = seg.proposals * (up / 100);
    const rev = wins * seg.acv;
    const gp = rev * (DATACLOUD.margin / 100);
    return {
      title: `1.2 · ${id} Extra gross profit, ${name}`,
      answer: n(gp),
      steps: [
        { label: "Rise in win rate, in points", calc: `${seg.tailored}% − ${seg.standard}%`, result: `${up} points` },
        { label: "Extra contracts a year", calc: `${seg.proposals} × ${up / 100}`, result: n(wins) },
        { label: "Extra revenue", calc: `${n(wins)} × ${n(seg.acv)}`, result: euro(rev) },
        { label: "Extra gross profit = revenue × margin", calc: `${n(rev)} × ${DATACLOUD.margin}%`, result: euro(gp) },
      ],
      why:
        id === "F1"
          ? "Few proposals, but a 10-point rise on €56,000 contracts: three more contracts a year, each with a lot of margin."
          : "Many proposals, but the win rate rises only 2 points on €17,000 contracts: 1.6 more contracts a year.",
      pitfalls: [
        `Using the tailored win rate instead of the difference: ${n(seg.proposals * (seg.tailored / 100) * seg.acv * 0.35)}.`,
        `Leaving out the margin (revenue, not profit): ${n(rev)}.`,
        `Not dividing the points by 100: ${n(seg.proposals * up * seg.acv * 0.35)}.`,
        id === "F1" ? `Using the Hands-off contract value (€17,000): ${n(seg.proposals * (up / 100) * 17000 * 0.35)}.` : `Using the Compliance-first contract value (€56,000): ${n(seg.proposals * (up / 100) * 56000 * 0.35)}.`,
      ],
    };
  }
  return {
    title: "1.2 · F3 Net result, Hands-off",
    answer: n(TAILOR.f3),
    steps: [
      { label: "Extra gross profit, Hands-off (F2)", calc: "from F2", result: euro(TAILOR.f2) },
      { label: "Yearly cost of the tailored approach", calc: "printed", result: euro(DATACLOUD.cost) },
      { label: "Net result = F2 − cost", calc: `${n(TAILOR.f2)} − ${n(DATACLOUD.cost)}`, result: euro(TAILOR.f3) },
    ],
    why: `Tailoring for Hands-off loses ${euro(-TAILOR.f3)} a year. For Compliance-first the same cost leaves ${euro(TAILOR.netAssure)}. That is the whole point of the block: personalise where contracts are large and the win rate moves; standardise for small accounts.`,
    pitfalls: [`A positive number (${n(-TAILOR.f3)}): the sign was dropped. A loss is negative.`, `Subtracting from F1 instead of F2: ${n(TAILOR.netAssure)}.`],
  };
}

export function worthGuide(): MentorGuide {
  return {
    title: "1.2 · Where tailoring is worth it",
    answer: L1().worth ?? "",
    example: tt(
      "Say a provider, Company A, tests a tailored approach. In its segment X: 20 proposals a year, a win rate that rises 5 points, contracts of €40,000 and a 30% margin, so 20 × 0.05 × 40,000 × 30% = €12,000 extra gross profit. In its segment Y: 100 proposals, a rise of 1 point, contracts of €9,000, so 100 × 0.01 × 9,000 × 30% = €2,700. The tailored approach costs €8,000 a year per segment, which leaves +€4,000 for X and −€5,300 for Y. Tailoring pays for X; Y is better served with the standard offer. Run the same steps on your own F1, F2 and F3 and say which of your segments pays and which does not.",
      "Nehmen wir an, ein Anbieter, Unternehmen A, testet einen zugeschnittenen Ansatz. In seinem Segment X: 20 Angebote im Jahr, eine Win Rate, die um 5 Punkte steigt, Verträge von 40.000 € und 30 % Marge, also 20 × 0,05 × 40.000 × 30 % = 12.000 € zusätzlicher Rohertrag. In seinem Segment Y: 100 Angebote, ein Anstieg um 1 Punkt, Verträge von 9.000 €, also 100 × 0,01 × 9.000 × 30 % = 2.700 €. Der zugeschnittene Ansatz kostet 8.000 € im Jahr pro Segment, das ergibt +4.000 € für X und −5.300 € für Y. Der Zuschnitt lohnt sich für X; Y bedient man besser mit dem Standardangebot. Führen Sie dieselben Schritte mit Ihren eigenen F1, F2 und F3 durch und sagen Sie, welches Ihrer Segmente sich lohnt und welches nicht.",
    ),
    lookFor: ["At least one of the calculated figures (the check reads for one).", "Compliance-first pays (net positive), Hands-off does not (net negative).", "A standard offer named as the answer for Hands-off."],
    pitfalls: ["“Tailoring pays for Hands-off because it has more proposals”: the number of proposals is not the result; the net is."],
  };
}

export function sketchGuide(i: number): MentorGuide {
  const s = (L1().sketches ?? [])[i];
  return {
    title: `1.3 · Segment sketch ${i + 1}`,
    answer: s ? s.text : "",
    example: [
      tt(
        "An example for a different provider: “Renewal-watchers: accounts that compare prices at every renewal, who need a clear reason to stay, and who decide in the purchasing department.” It follows the frame: a name, a criterion, a need and how they decide. Write your own sketch from the accounts of this case, in the same frame, and base it on a need or a behaviour you can point to in them.",
        "Ein Beispiel für einen anderen Anbieter: „Renewal-Beobachter: Accounts, die bei jeder Verlängerung die Preise vergleichen, die einen klaren Grund zum Bleiben brauchen und die im Einkauf entscheiden.“ Es folgt dem Rahmen: ein Name, ein Kriterium, ein Bedarf und wie sie entscheiden. Schreiben Sie Ihre eigene Skizze aus den Accounts dieses Falls im selben Rahmen und stützen Sie sie auf einen Bedarf oder ein Verhalten, auf das Sie bei ihnen zeigen können.",
      ),
      tt(
        "An example for a different provider: “Reporting-first: accounts that ask for a monthly usage report, who need to show their finance department what the service costs, and who decide together with a controller.” It rests on a behaviour and names a need. Write your own sketch for this case in the same frame; it should differ from your other two.",
        "Ein Beispiel für einen anderen Anbieter: „Reporting-first: Accounts, die jeden Monat einen Nutzungsbericht anfordern, die ihrer Finanzabteilung zeigen müssen, was der Service kostet, und die gemeinsam mit einem Controller entscheiden.“ Es stützt sich auf ein Verhalten und nennt einen Bedarf. Schreiben Sie Ihre eigene Skizze für diesen Fall im selben Rahmen; sie sollte sich von Ihren anderen beiden unterscheiden.",
      ),
      tt(
        "An example for a different provider: “Migration-minded: accounts that downloaded a migration guide last quarter, who need to move an old system without stopping their shop, and who decide after a test move.” Again a name, a criterion, a need and a way of deciding. Write your own third sketch from this case in that frame.",
        "Ein Beispiel für einen anderen Anbieter: „Umzugs-Orientierte: Accounts, die im letzten Quartal einen Migrationsleitfaden heruntergeladen haben, die ein altes System umziehen müssen, ohne ihren Shop anzuhalten, und die nach einem Probeumzug entscheiden.“ Wieder ein Name, ein Kriterium, ein Bedarf und eine Art zu entscheiden. Schreiben Sie Ihre eigene dritte Skizze aus diesem Fall in diesem Rahmen.",
      ),
    ][i % 3],
    why: "The three model sketches anticipate the segments of Part 2 without naming them, which is fine: a learner who finds the needs-based split here has understood A3.",
    lookFor: ["A basis chosen, at most one firmographic-only.", "A need named (the check looks for need / must / want / braucht / muss …).", "How they decide, ideally.", "Distinct from the other two sketches."],
    pitfalls: ["Three sketches by industry: the check flags the second and third.", "“Large companies”: a firmographic label with no need."],
  };
}

export function reflectGuide(k: "simplify" | "worth" | "prioritise"): MentorGuide {
  const r = L1().reflect!;
  const map = {
    simplify: { title: "1.4 · Where I oversimplified", look: ["Refers to something the learner actually did in 1.1–1.3.", "Names the easy criterion (industry, size) or an assumption."] },
    worth: { title: "1.4 · When personalising makes sense", look: ["One case where it pays and one where it does not.", "A reason, ideally the figures from 1.2."] },
    prioritise: { title: "1.4 · How a strategic decision-maker would prioritise", look: ["Value and ability to win, not number of accounts.", "What happens to the segments that are not first (standard offer)."] },
  } as const;
  return { title: map[k].title, answer: r[k], lookFor: [...map[k].look], why: "Judged, not checked. Ask the learner to point to the block where they noticed it." };
}

export function profileGuide(s: SegmentId): MentorGuide {
  const p = L1().profiles![s];
  return {
    title: `2.2 · ${SEGMENTS[s].label}`,
    answer: `${VALUE_LABEL[p.value!]} · ${p.need}`,
    example: tt(
      "An example for a different provider’s segment, “Reporting-first”: “They need to show their finance department each month what the service costs, and they decide together with a controller after seeing a sample report.” That is two parts: what the accounts need, and how they decide. With a tally of 3 accounts worth €120,000 in all, its value would sit in the Mid band. Write your own profile from the accounts you placed in this segment, with your own tally and the same two parts.",
      "Ein Beispiel für das Segment „Reporting-first“ eines anderen Anbieters: „Sie müssen ihrer Finanzabteilung jeden Monat zeigen, was der Service kostet, und entscheiden gemeinsam mit einem Controller, nachdem sie einen Musterbericht gesehen haben.“ Das sind zwei Teile: was die Accounts brauchen und wie sie entscheiden. Bei einer Auszählung von 3 Accounts mit zusammen 120.000 € läge sein Wert im mittleren Band. Schreiben Sie Ihr eigenes Profil aus den Accounts, die Sie diesem Segment zugeordnet haben, mit Ihrer eigenen Auszählung und denselben zwei Teilen.",
    ),
    steps: [
      { label: "Accounts in the reference assignment", calc: "count", result: String(TRUTH_COUNTS[s]) },
      { label: "Sum of potential contract value", calc: "add the ACVs", result: euro(TRUTH_ACV[s]) },
      { label: "Band (A6)", calc: "≥150k High · 100–149k Mid · <100k Low", result: VALUE_LABEL[valueOf(TRUTH_ACV[s])] },
    ],
    lookFor: ["The rating follows the learner's own tally (it may differ from this reference).", "The need and the decision behaviour, in the learner's words.", "Content that answers the need (not a discount, not industry wording)."],
  };
}

export function riskTextGuide(): MentorGuide {
  return {
    title: "2.2 · Risk of a wrong segmentation",
    answer: L1().riskText ?? "",
    lookFor: ["A concrete consequence (the right offer to the wrong accounts, wasted effort).", "A sign in the deals that would show it."],
  };
}

export function scoreGuide(id: MeasureId): MentorGuide {
  const m = MEASURE_BY_ID[id];
  const per = costPerAccount(id);
  return {
    title: `2.3 · ${m.name}`,
    answer: `${m.model.relevance} × ${m.model.differentiation} × ${evBucket(per)} = ${modelScore(id)}`,
    steps: [
      { label: "Cost per account reached", calc: `${n(m.cost)} ÷ ${m.reach}`, result: euro(per) },
      { label: "Economic viability (A7)", calc: "≤2,000 → 3 · ≤4,000 → 2 · more → 1", result: String(evBucket(per)) },
      { label: "Score", calc: `${m.model.relevance} × ${m.model.differentiation} × ${evBucket(per)}`, result: String(modelScore(id)) },
    ],
    why: m.model.note,
    pitfalls: id === "care" ? ["Relevance 3 because it “fits Hands-off perfectly”: it does, but Hands-off is the Low-value segment in the tally, and A7's rule gives 1."] : id === "bespoke" ? ["Economic viability 3 because the total is within budget: the rule is per account (€4,800 → 1)."] : undefined,
  };
}

export function whyGuide(): MentorGuide {
  return {
    title: "2.3 · Why the first priority goes first",
    answer: L1().why ?? "",
    example: tt(
      "Say Company A’s plan of three measures costs €96,000 of a €110,000 budget. Measure 1 goes first: its score is 3 × 3 × 2 = 18, the highest of the three, and it serves the segment worth most, about €210,000 a year. The smallest segment is left to a standard offer with one call a year. Use your own scores, your own order and your own costs to say why your first priority goes first, what the plan costs against the budget, and which segment you leave to a standard offer.",
      "Nehmen wir an, der Plan aus drei Maßnahmen von Unternehmen A kostet 96.000 € von einem Budget von 110.000 €. Maßnahme 1 kommt zuerst: Ihr Wert ist 3 × 3 × 2 = 18, der höchste der drei, und sie dient dem Segment mit dem größten Wert, etwa 210.000 € im Jahr. Das kleinste Segment bleibt einem Standardangebot mit einem Anruf im Jahr überlassen. Nutzen Sie Ihre eigenen Werte, Ihre eigene Reihenfolge und Ihre eigenen Kosten, um zu sagen, warum Ihre erste Priorität zuerst kommt, was der Plan gegen das Budget kostet und welches Segment Sie einem Standardangebot überlassen.",
    ),
    steps: [
      { label: "Model plan cost", calc: "38,000 + 45,000 + 30,000", result: euro(MODEL_COST) },
      { label: "Left of the budget", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: euro(BUDGET - MODEL_COST) },
    ],
    lookFor: ["The order and what decides it (score or segment value).", "The cost against €120,000.", "Which segment is left to a standard offer, said as a decision."],
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function critTextGuide(c: CritId): MentorGuide {
  return {
    title: `3.1 · ${CRITERIA[c].name}`,
    answer: R2().critText?.[c] ?? CRITERIA[c].means,
    lookFor: ["What the criterion measures for a DataCloud segment.", "Why it belongs in the ranking (which axis, or how far to trust the others)."],
  };
}

export function propGuide(id: CandId): MentorGuide {
  const c = CAND_BY_ID[id];
  const m = (R2().sales ?? {})[id];
  const model = m ? SALES_MODELS[m] : null;
  return {
    title: `3.3 · ${c.name}`,
    answer: `${model ? `${model.name} · ` : ""}${(R2().prop ?? {})[id] ?? ""}`,
    example: tt(
      "An example for a different segment: “To a finance director at a growing firm: you told us the monthly bill is hard to plan, so we quote one fixed price per month, with no surprises in the first year.” It names the buyer’s need in the buyer’s words and says what the provider does about it. Write yours for your own segment in the same shape, using its need and how it decides.",
      "Ein Beispiel für ein anderes Segment: „An eine Finanzchefin in einem wachsenden Unternehmen: Sie sagten uns, die monatliche Rechnung sei schwer zu planen, deshalb nennen wir einen festen Preis pro Monat, ohne Überraschungen im ersten Jahr.“ Es nennt den Bedarf des Käufers in seinen Worten und sagt, was der Anbieter dagegen tut. Schreiben Sie Ihres für Ihr eigenes Segment in derselben Form, mit seinem Bedarf und seiner Art zu entscheiden.",
    ),
    steps: model && m ? [{ label: "Cost per won deal ÷ contract value", calc: `${n(costPerDeal(m, c.acv))} ÷ ${n(c.acv)}`, result: `${n((costPerDeal(m, c.acv) / c.acv) * 100)}%` }] : undefined,
    lookFor: ["The segment's need in the buyer's words.", "What DataCloud does about it, concretely.", "No generic claim (“best-in-class”, “leading”)."],
  };
}

export function triggerGuide(id: ArchId): MentorGuide {
  const model = MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER];
  return {
    title: `3.5 · ${ARCH_BY_ID[id].name}`,
    answer: model ?? "A metric, a number, a date and an action for this item.",
    example: tt(
      "An example for a different item, a customer referral programme: “If fewer than 15% of invited customers have joined by month 3, the account managers stop inviting and review the offer.” It has a metric, a number, a month and an action the owner can take alone. Write yours for your own item in the same four parts.",
      "Ein Beispiel für einen anderen Punkt, ein Empfehlungsprogramm für Kunden: „Wenn bis Monat 3 weniger als 15 % der eingeladenen Kunden beigetreten sind, hören die Account Manager auf einzuladen und überprüfen das Angebot.“ Es hat eine Kennzahl, eine Zahl, einen Monat und eine Aktion, die der Owner allein ausführen kann. Schreiben Sie Ihren für Ihren eigenen Punkt in denselben vier Teilen.",
    ),
    why: `Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}.`,
    lookFor: ["A metric about the item's effect.", "A number and a month.", "An action the owner can take alone."],
  };
}

export function postponedGuide(): MentorGuide {
  return {
    title: "3.5 · What is left out, and the pickup point",
    answer: `${R2().postponed} · ${R2().pickup}`,
    example: tt(
      "An example for a different plan: “We leave out the regional events series (€25,000): it serves the smallest segment and the budget is used up by the first three items. We pick it up again in month 6 if the pipeline of the two funded segments is above €500,000.” It names the item and its cost, says why this one, and gives a pickup point with a number and a date. Write yours for your own plan the same way.",
      "Ein Beispiel für einen anderen Plan: „Wir lassen die regionale Veranstaltungsreihe weg (25.000 €): Sie dient dem kleinsten Segment, und das Budget ist von den ersten drei Punkten aufgebraucht. Wir nehmen sie in Monat 6 wieder auf, wenn die Pipeline der beiden finanzierten Segmente über 500.000 € liegt.“ Es nennt den Punkt und seine Kosten, sagt, warum gerade dieser, und gibt einen Pickup Point mit Zahl und Datum. Schreiben Sie Ihren für Ihren eigenen Plan genauso.",
    ),
    steps: [
      { label: "Model funded items", calc: "15,000 + 38,000 + 48,000 + 45,000", result: euro(146000) },
      { label: "Left", calc: `${n(R2_BUDGET)} − 146,000`, result: euro(R2_BUDGET - 146000) },
    ],
    lookFor: ["The item named, with its cost.", "Why this one (budget, the segment's role).", "A pickup point with a number and a date."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: (R2().assumptions ?? [])[i] ?? "",
    lookFor: ["What is assumed about a segment or its customers.", "The sign that would show it is wrong, with a number or a date."],
  };
}

export function challengeGuide(): MentorGuide {
  const accounts = 100;
  const pool = accounts * 56000 * 0.38;
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    example: tt(
      "An example for a different case: the board says a segment was overstated by 30%, so 240 accounts become 168. Re-rate first with the new numbers: 168 × €30,000 × 40% = €2,016,000 instead of €2,880,000, which moves the segment from High to Mid attractiveness. By the role rule it is no longer a core segment. A strong answer says so openly, keeps what the numbers still support, changes one item instead of the whole plan, and names the tripwire that will show whether the change was right. Run the same steps on your own segment and your own figures.",
      "Ein Beispiel für einen anderen Fall: Der Vorstand sagt, ein Segment sei um 30 % überschätzt worden, aus 240 Accounts werden also 168. Bewerten Sie zuerst mit den neuen Zahlen neu: 168 × 30.000 € × 40 % = 2.016.000 € statt 2.880.000 €, das Segment rutscht von hoher auf mittlere Attraktivität. Nach der Rollenregel ist es kein Kernsegment mehr. Eine starke Antwort sagt das offen, behält, was die Zahlen weiter tragen, ändert einen Punkt statt des ganzen Plans und nennt den Tripwire, der zeigen wird, ob die Änderung richtig war. Führen Sie dieselben Schritte mit Ihrem eigenen Segment und Ihren eigenen Zahlen durch.",
    ),
    steps: [
      { label: "Accounts after the correction", calc: "140 − 40", result: String(accounts) },
      { label: "New profit pool", calc: `${accounts} × 56,000 × 38%`, result: euro(pool) },
      { label: "New attractiveness band (B1)", calc: "≥2.5m High · ≥1.0m Mid", result: "Mid" },
    ],
    why: "By the rule the segment now becomes “serve standard”. A strong answer re-rates it openly, notes that the profit per account is still the highest, and changes one item instead of the whole plan.",
    lookFor: ["Re-rates with the new numbers before deciding.", "Keeps what the numbers support.", "Changes one thing, and names the tripwire that will tell."],
  };
}

export { CAND_BY_ID };
