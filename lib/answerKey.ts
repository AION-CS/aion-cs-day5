import { ACCOUNTS, GAPS, TRUTH_ACV, TRUTH_COUNTS } from "@/data/accounts";
import { CRIT_LABEL, FIELDS } from "@/data/criteria";
import { BUDGET, MEASURES, MODEL_COST, MODEL_MEASURES, costPerAccount, evBucket, modelScore } from "@/data/measures";
import { CONTENTS, CONTENT_IDS, CONTENT_TRUTH, SEGMENTS, SEGMENT_IDS, VALUE_LABEL, valueOf } from "@/data/segments";
import { DIFF_QUESTION, DIFF_TRUTH, TG_QUESTION, TG_TRUTH } from "@/data/sketches";
import {
  ARCH_BY_ID,
  CAND_BY_ID,
  CAND_IDS,
  CRITERIA,
  CRIT_IDS,
  CRIT_MUST,
  DECISIONS,
  KPIS,
  MODEL_ABILITY,
  MODEL_ACCEPT,
  MODEL_ARCH,
  MODEL_ATTRACT,
  MODEL_DECISION,
  MODEL_GRID,
  MODEL_ROLE,
  MODEL_TRIPWIRE,
  OWNERS,
  OWNER_ACCEPT,
  ROLES,
  SALES_MODELS,
  costPerDeal,
  poolOf,
} from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { MODEL_ORDER } from "@/data/mentorKey";
import { euro } from "@/lib/lang";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the expected answer and a
 * reason per option, including why each rejected option is rejected, plus a teaching note wherever more than one answer defends.
 * Never exported and never shown to a learner. Mentor tools stay in English (CLAUDE.md #32); the option labels they quote follow the
 * site's language.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

const B = ["—", "Low", "Mid", "High"];

/* ------------------------------------------------------------------ Route 1 */

export function sortKey(): AnswerKeyBlock {
  return {
    title: "Block 1.1 · Firmographic, behaviour-based or needs-based",
    expected: FIELDS.map((f, i) => `${i + 1} → ${CRIT_LABEL[f.truth]}`).join(" · "),
    options: FIELDS.flatMap((f, i) => [
      { label: `Field ${i + 1} → ${CRIT_LABEL[f.truth]}`, expected: true, why: f.why },
      ...(Object.entries(f.rejected) as [keyof typeof CRIT_LABEL, string][]).map(([tag, why]) => ({ label: `Field ${i + 1} → ${CRIT_LABEL[tag]}`, expected: false, why })),
    ]),
    teachingNote:
      "Three of each. The pair learners swap is behaviour and need: “opened three restore tickets” (behaviour) against “must prove to its auditor” (need). Ask: did your system record it, or is it the reason behind what it records? The download field is the other trap: interest is behaviour until the account names what it must solve.",
  };
}

export function tgKey(): AnswerKeyBlock {
  return {
    title: "Block 1.3a · Target group or segment",
    expected: TG_QUESTION.options.find((o) => o.id === TG_TRUTH)!.label,
    options: [
      { label: TG_QUESTION.options[0].label, expected: true, why: TG_QUESTION.why },
      { label: TG_QUESTION.options[1].label, expected: false, why: "A segment gets its own offer and is separated from other groups by a need. The sentence covers every account in the file and separates no one." },
    ],
  };
}

export function diffKey(): AnswerKeyBlock {
  return {
    title: "Block 1.3b · Where the accounts differ most",
    expected: DIFF_QUESTION.options.find((o) => o.id === DIFF_TRUTH)!.label,
    options: DIFF_QUESTION.options.map((o) => ({
      label: o.label,
      expected: o.id === DIFF_TRUTH,
      why:
        o.id === DIFF_TRUTH
          ? DIFF_QUESTION.why
          : o.id === "industry"
            ? "Logistics (Lohmann, Weber), healthcare (Mediqon, Praxisverbund) and energy (Stadtwerke, Nordlicht) each appear in two segments."
            : o.id === "size"
              ? "Fintara (150 staff) is Compliance-first and Altmann (900 staff) is Hands-off: size points the wrong way twice."
              : "The file gives no region, and no note mentions one.",
    })),
  };
}

export function assignKey(): AnswerKeyBlock {
  return {
    title: "Block 2.1 · The segment of each account",
    expected: ACCOUNTS.map((a) => `${a.name} → ${SEGMENTS[a.truth].short}`).join(" · "),
    options: ACCOUNTS.flatMap((a) => [
      { label: `${a.name} → ${SEGMENTS[a.truth].label}`, expected: true, why: a.why },
      ...(Object.entries(a.rejected) as [keyof typeof SEGMENTS, string][]).map(([s, why]) => ({ label: `${a.name} → ${SEGMENTS[s].label}`, expected: false, why })),
    ]),
    teachingNote: `Expected counts: ${SEGMENT_IDS.map((s) => `${SEGMENTS[s].short} ${TRUTH_COUNTS[s]} (${euro(TRUTH_ACV[s])})`).join(", ")}. The traps are the pairs from the same sector (Lohmann/Weber, Mediqon/Praxisverbund, Stadtwerke/Nordlicht) and the two size traps (Fintara small but Compliance-first, Altmann large but Hands-off). Send learners to the phrase in the note before you say which is right.`,
  };
}

export function profileKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2 · Value and content per segment",
    expected: SEGMENT_IDS.map((s) => `${SEGMENTS[s].short}: ${euro(TRUTH_ACV[s])} → ${VALUE_LABEL[valueOf(TRUTH_ACV[s])]}, personalise ${CONTENTS[CONTENT_TRUTH[s]].label}`).join(" · "),
    options: SEGMENT_IDS.flatMap((s) =>
      CONTENT_IDS.map((c) => ({
        label: `${SEGMENTS[s].short} → ${CONTENTS[c].label}`,
        expected: c === CONTENT_TRUTH[s],
        why:
          c === CONTENT_TRUTH[s]
            ? `It answers the segment's need: ${SEGMENTS[s].need}`
            : c === "discount"
              ? "Price is named in none of the twelve notes; a discount answers no segment's need."
              : c === "industry"
                ? "Industry wording does not change what the offer does, and industry does not predict the need."
                : `That is what another segment needs (${SEGMENT_IDS.filter((x) => CONTENT_TRUTH[x] === c).map((x) => SEGMENTS[x].short).join("")}).`,
      })),
    ),
    teachingNote:
      "The value rating is checked against the learner's own tally, not against this reference: a learner who placed Altmann (€40,000) in Compliance-first gets €265,000 High and €46,000 Low, and is right by the rule. The lesson to draw out: Hands-off has the most accounts (5) and the lowest value.",
  };
}

export function gapKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2 · What the file does not tell you",
    expected: GAPS.filter((g) => g.useful).map((g) => g.label).join(" · "),
    options: GAPS.map((g) => ({ label: g.label, expected: g.useful, why: g.why })),
    teachingNote: "Any two of the four useful items complete the block. The newsletter-open item is the tempting one: it is data DataCloud already collects, which is exactly why it is about DataCloud's activity rather than the customer's need.",
  };
}

export function measureKey(): AnswerKeyBlock {
  const rows = [...MEASURES].sort((a, b) => modelScore(b.id) - modelScore(a.id));
  return {
    title: "Block 2.3 · The three measures",
    expected: `${MODEL_MEASURES.map((id) => MEASURES.find((m) => m.id === id)!.name).join(", ")} · ${euro(MODEL_COST)} of ${euro(BUDGET)}`,
    options: rows.map((m) => ({
      label: `${m.name} · ${m.model.relevance} × ${m.model.differentiation} × ${evBucket(costPerAccount(m.id))} = ${modelScore(m.id)} · ${euro(m.cost)} / ${m.reach} = ${euro(costPerAccount(m.id))} per account · serves ${m.targets.length ? m.targets.map((t) => SEGMENTS[t].short).join(", ") : "none"}`,
      expected: MODEL_MEASURES.includes(m.id),
      why: `${m.verdict} ${m.model.note}`,
    })),
    teachingNote: `The checks look only at the segments named (a subset of the real targets, or “none” for the three that serve no need) and at economic viability, which follows from cost ÷ reach. Relevance and differentiation are judged; the model values are here. Adding any fourth measure takes the plan over €${(BUDGET / 1000).toFixed(0)}k: ${euro(MODEL_COST)} + the cheapest other (${euro(18000)}) = ${euro(MODEL_COST + 18000)}. A learner who takes the managed standard package instead of the reference programme (covering all three segments) is defending coverage over score; accept it if the why says so.`,
  };
}

export function orderKey(): AnswerKeyBlock {
  return {
    title: "Block 2.3 · The order",
    expected: MODEL_ORDER.map((id) => MEASURES.find((m) => m.id === id)!.name).join(" → "),
    options: MODEL_ORDER.map((id, i) => ({ label: `${i + 1}. ${MEASURES.find((m) => m.id === id)!.name} (${modelScore(id)})`, expected: true, why: i === 0 ? "Highest score and it serves the High-value segment." : i === 1 ? "Second score; it opens the Mid-value segment." : "Lowest of the three; relevant, but reaches only twelve accounts." })),
    teachingNote: "The order follows the scores. The app only flags an inversion (a lower score above a higher one) and asks for a reason; a learner who starts with the reference programme because it takes longest to set up can defend it in the why.",
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function critKey(): AnswerKeyBlock {
  return {
    title: "Block 3.1 · Prioritisation criteria",
    expected: `${CRITERIA.pool.name} and ${CRITERIA.win.name}, plus any third`,
    options: CRIT_IDS.map((c) => ({
      label: CRITERIA[c].name,
      expected: CRIT_MUST.includes(c),
      why: CRIT_MUST.includes(c)
        ? c === "pool"
          ? "The attractiveness axis of the matrix: it is the only criterion that counts profit, not revenue or accounts."
          : "The ability-to-win axis: without it the ranking chases segments DataCloud cannot win."
        : c === "confidence"
          ? "A good third: it does not rank segments, it tells you how far to trust the ranking. Defends well in this case."
          : c === "growth"
            ? "A defensible third, with the caveat that AI start-ups grow 40% from a tiny, low-margin base."
            : c === "cost"
              ? "A defensible third: it explains why Hands-off is served standard."
              : "A defensible third, but it rewards what DataCloud already is and can hide a lack of fit.",
    })),
    teachingNote: "The check only asks for the two axes. The third is judged; confidence, growth, cost to serve and fit all defend with a reason.",
  };
}

export function rateKey(): AnswerKeyBlock {
  return {
    title: "Block 3.2 · Ratings and roles",
    expected: CAND_IDS.map((id) => `${CAND_BY_ID[id].name}: ${B[MODEL_ATTRACT[id]]}/${B[MODEL_ABILITY[id]]} → ${ROLES[MODEL_ROLE[id]].label}`).join(" · "),
    options: CAND_IDS.map((id) => {
      const c = CAND_BY_ID[id];
      return {
        label: `${c.name}: pool ${euro(poolOf(id))} → ${B[MODEL_ATTRACT[id]]}; win rate ${c.winRate}% → ${B[MODEL_ABILITY[id]]}; ${ROLES[MODEL_ROLE[id]].label}`,
        expected: true,
        why:
          id === "assure"
            ? "High on both: the obvious core segment, and the High-value segment of Route 1."
            : id === "scale"
              ? "Pool €2.52m is just over the €2.5m line, win rate Mid: core by the rule. The second core segment."
              : id === "handsoff"
                ? "Most accounts and the highest win rate, but a Mid pool: serve standard. Matches Route 1's Low value and the “reduce complexity for small customers” lesson."
                : id === "public"
                  ? "A €90,000 contract looks attractive, but the pool is Mid and DataCloud wins 5%: deprioritise."
                  : "40% growth is the trap: the pool is €0.36m and the win rate 8%. Deprioritise, and watch.",
      };
    }),
    teachingNote: "The ratings are read off the printed data (profit pool and win rate) and checked as a count. The roles are checked against the learner's own ratings, so a learner with one wrong rating is not punished twice. Data confidence does not change a rating; it belongs in 3.6.",
  };
}

export function salesKey(): AnswerKeyBlock {
  return {
    title: "Block 3.3 · Sales model per segment",
    expected: CAND_IDS.map((id) => `${CAND_BY_ID[id].name}: ${MODEL_ACCEPT[id].map((m) => SALES_MODELS[m].name).join(" or ")}`).join(" · "),
    options: CAND_IDS.flatMap((id) =>
      (Object.keys(SALES_MODELS) as (keyof typeof SALES_MODELS)[]).map((m) => {
        const share = Math.round((costPerDeal(m, CAND_BY_ID[id].acv) / CAND_BY_ID[id].acv) * 100);
        const ok = MODEL_ACCEPT[id].includes(m);
        return {
          label: `${CAND_BY_ID[id].name} → ${SALES_MODELS[m].name} (${share}%)`,
          expected: ok,
          why: ok ? `Within the 30% cost rule and it matches how the segment decides: ${CAND_BY_ID[id].decides}` : share > 30 ? `Costs ${share}% of the contract value: over the 30% limit.` : `Affordable (${share}%), but it does not match how the segment decides: ${CAND_BY_ID[id].decides}`,
        };
      }),
    ),
    teachingNote: "Only the segments the learner marked core or serve standard are checked. Inside sales is affordable for Compliance-first (5%) but a committee reading documents rarely buys from a phone call; that is the behaviour rule doing the work.",
  };
}

export function gridKey(): AnswerKeyBlock {
  return {
    title: "Block 3.4 · Standardise or individualise",
    expected: Object.entries(MODEL_GRID)
      .map(([id, g]) => `${CAND_BY_ID[id as keyof typeof CAND_BY_ID].name}: ${Object.entries(g!).map(([el, lv]) => `${el} ${lv}`).join(", ")}`)
      .join(" · "),
    options: [
      { label: "Platform standard for every segment", expected: true, why: "One platform is where the scale economies come from. The check flags any other level." },
      { label: "Compliance-first: contract and compliance terms individual", expected: true, why: "That is where its need lives. €2,500 + €300 × 2 = €3,100 against a limit of 20% × €21,280 = €4,256." },
      { label: "Scale-optimiser: pricing and onboarding modular", expected: true, why: "Its need is control and comparable prices. One individual element (€2,500) just fits under €2,520 only if everything else is standard; modular is the safer answer." },
      { label: "Hands-off: everything standard, content modular at most", expected: true, why: "Limit 20% × €2,200 = €440: one modular element fits, an individual one never. And a segment served standard has no individual element." },
      { label: "Individualise everything for the core segments", expected: false, why: "Compliance-first: 5 × €2,500 = €12,500 against €4,256. The margin cannot carry it." },
    ],
    teachingNote: "The check tests three rules per served segment and reports how many hold; it outlines the cells that break one. Anything within the rules defends; the model grid is one of several.",
  };
}

export function ownerKey(funded: ArchId[]): AnswerKeyBlock {
  const ids = funded.length ? funded : MODEL_ARCH;
  return {
    title: "Block 3.5 · Owners, sequence and funding",
    expected: `Model: ${MODEL_ARCH.map((id) => `${ARCH_BY_ID[id].name} (${OWNERS[OWNER_ACCEPT[id][0]].name})`).join(", ")} · ${euro(MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0))}`,
    options: ids.map((id) => ({
      label: `${ARCH_BY_ID[id].name} → ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}`,
      expected: true,
      why:
        id === "segdata"
          ? "Sales Operations owns the CRM and its fields. It starts first: every trigger reads it."
          : id === "tender"
            ? "Serves public administration, which the rule deprioritises. Funding it contradicts the segment decision; the check flags it."
            : `The owner who can change it without asking anyone: ${OWNERS[OWNER_ACCEPT[id][0]].profile}`,
    })),
    teachingNote: "The check tests three rules: segment fields start no later than the first other item, total within €150,000, nothing funded for a deprioritised segment. Owners are not checked by the app; use this key. Funding the standard package or the partner channel instead of the key account team defends if the learner argues cost to serve.",
  };
}

export function decisionKey(): AnswerKeyBlock {
  return {
    title: "Block 3.6 · The decision",
    expected: DECISIONS.find((d) => d.id === MODEL_DECISION)!.label,
    options: DECISIONS.map((d) => ({ label: d.label, expected: d.id !== "wait", why: d.id === MODEL_DECISION ? d.why : d.id === "commit" ? `${d.why} ${d.rejected}` : d.rejected })),
    teachingNote: "“Commit now” and “Stage it” both defend with different reasoning; the check outlines only “Wait”, because the brief asks for a decision despite incomplete data.",
  };
}

export function tripKey(): AnswerKeyBlock {
  const k = KPIS.find((x) => x.id === MODEL_TRIPWIRE.kpi)!;
  return {
    title: "Block 3.6 · The tripwire",
    expected: `${k.label} ≥ ${MODEL_TRIPWIRE.threshold}% by month ${MODEL_TRIPWIRE.month}, else adjust one measure`,
    options: KPIS.map((x) => ({ label: `${x.label} (baseline ${x.baseline}${x.unit === "%" ? "%" : ` ${x.unit}`})`, expected: x.behaviour, why: x.behaviour ? "A customer response the plan is meant to move." : "Measures DataCloud's own activity, not how customers responded." })),
    teachingNote: "Any customer-response metric with a threshold better than its baseline defends. Filled CRM fields is the tempting one: it is the right trigger for the data item in 3.5, and the wrong tripwire for the segment decision.",
  };
}
