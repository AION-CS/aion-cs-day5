# Retention Lab · Day 5

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 3, Day 1 of 2.**
*Understanding customer segmentation and strategically developing personalisation.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30
and the German version of #32.

The case company is **DataCloud Services GmbH**, a German cloud provider for the Mittelstand: *offers appear generic, the conversion
rate is low, customers do not feel understood* (the plan's case study). Route 1 works it with twelve accounts, €120,000 and five
months; Route 2 puts the learner in the Chief Sales Officer's chair with €150,000 and six months (Case assumption).

This repo was bootstrapped from `day3` (chrome, primitives, store pattern, tokens) and its content was replaced. Nothing of SecureIT
Systems remains in the tree.

> **Before you push:** `git remote -v` still points at `aion-cs-day2`, because the folder was copied from an earlier day. Create or
> select the `aion-cs-day5` repository and set the remote first (`../CLAUDE.md` #17). Nothing was committed or pushed.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 why segment at all, A2 target group and segment, A3 firmographic / behaviour / needs criteria and the nested approach, A4 personalisation and effort against benefit, A5 three needs-based segments, A6 segment value and what the data cannot tell, A7 relevance × differentiation × economic viability). **Task 1, Segment Analysis**: *Part 1 · Understand the landscape:* 1.1 sort nine CRM fields, 1.2 is tailoring worth it (F1–F3 and a sentence), 1.3 target group or segment, where accounts differ most, three segment sketches, 1.4 coaching reflection. *Part 2 · Analyse and act:* 2.1 assign twelve accounts to three segments, 2.2 value, need and content per segment, gaps and a risk, 2.3 choose, score and order three measures. | `1-{name}-day5-l1l2-segment-analysis.html` |
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 attractiveness × ability to win, B2 a sales model per segment, B3 standardise or individualise, B4 deciding with incomplete data, B5 architecture). **Task 2, Segment Strategy Memo**, assembling beside the questions: 3.1 prioritisation criteria, 3.2 rate five candidate segments and name the core, 3.3 a sales model and value proposition per segment, 3.4 standard / modular / individual grid, 3.5 the measures architecture, 3.6 the decision, the tripwire and the board's challenge. | `2-{name}-day5-l3-strategy-memo.html` |

Minutes: Materi A 60 + Task 1 56 (6 + 10 + 7 + 5 + 8 + 8 + 12), Materi B 60 + Task 2 50 (5 + 9 + 8 + 9 + 10 + 9). All in `lib/routes.ts`.

## German version (CLAUDE.md #32)

- `lib/lang.ts`: the active language as a module value, `tt(en, de)` for inline text, `t(en, de)` + `bi(...)` for data files (every
  bilingual field becomes a getter, so nothing is frozen at import), and number formats (`1.234,5`, `12.345 €`, `12 %`).
- `lib/i18n.tsx`: `LangProvider` (sets the language before rendering and remounts on change) and `LangSwitch` (EN | DE in the top bar,
  on every page). The choice is `ui.lang` in the persisted store.
- Every page, card, diagram, task, clue, missing list, the glossary panel and both exported documents follow the switch. Pages are
  client components for this reason (a server component would stay in English).
- Common technical terms stay English in German sentences (Segment, Account, Win Rate, Proof of Concept, Profit Pool, Tripwire,
  Owner…); every explanation is German, formal "Sie". The German glossary (`data/glossary.ts`, `de` per entry) keeps the English term as
  the title and explains it in German.
- Mentor tools (mentor bar, answer keys, worked answers) stay English. "Fill all model answers" enters German free text while the site
  is in German. Stored answers are ids, so a switch mid-task keeps every answer and every check.
- File names stay English in both languages.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (CS tokens) · Zustand + `persist` (key `cs-d5-v1`, version 1, `skipHydration` +
`StoreHydrator`, deep `mergeDefaults`) · static export. No animation, drag-and-drop, PDF or chart library.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives every figure and rule, and runs the mentor fill in both languages (109 checks)
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## What is in the data

- `criteria.ts`: nine CRM fields (3 firmographic, 3 behaviour, 3 needs) with clue, reason and rejected tags.
- `tailoring.ts`: DataCloud's pilot. Extra gross profit = proposals × (tailored − standard win rate) × ACV × margin. Compliance-first
  30 × 10 pp × €56,000 × 35% = **F1 €58,800**; Hands-off 80 × 2 pp × €17,000 × 35% = **F2 €9,520**; **F3 = F2 − €30,000 = −€20,480**.
  Worked example (Weserdata): clinics €27,000 (net +€2,000), retail €6,480 (net −€18,520).
- `segments.ts`: Compliance-first, Hands-off, Scale-optimiser with need, decision behaviour, test question and pair tests; the value
  rule (≥ €150,000 High, ≥ €100,000 Mid); what to personalise per segment.
- `accounts.ts`: twelve accounts (4 / 5 / 3; potential ACV €225,000 High / €86,000 Low / €140,000 Mid). Traps: logistics, healthcare
  and energy each appear in two segments; a 150-person firm is Compliance-first, a 900-person firm Hands-off.
- `measures.ts`: nine measures; economic viability from cost ÷ reach (≤ €2,000 = 3, ≤ €4,000 = 2). Model: compliance pack 27, self-service
  lane 18, reference programme 12 = €113,000; any fourth breaks €120,000.
- `route2.ts`: six criteria, five candidate segments with profit pools (2.98m, 1.98m, 2.52m, 1.35m, 0.36m) and win rates, the role rule
  (core = High attractiveness and ≥ Mid ability; Low on either = deprioritise), five sales models with the 30% cost rule, the grid rules
  (platform standard, 20% of margin), eight architecture items, KPIs with baselines, the board's challenge.
- `mentorKey.ts`: every model answer, in the active language.

## Mentor bar

The first element on every page. `muchson123` once fills every model answer of both routes (and a participant name), so each export
downloads at once; verified in the browser and in `verify:calc`. The unlock shows answer keys next to every fixed-option exercise and
a worked answer (with arithmetic) under every other question, in rust, never exported. A reload locks it.

## Notes on deviations from the brief and the shared rules

1. **Two routes (CLAUDE.md #30).** The plan's Level 1 Task 1 (form segments for a cloud provider), Level 1 Task 2 (personalisation for
   two segments under a limited budget; effort vs benefit; risks) and the case study (DataCloud Services) are merged on DataCloud. Every
   numbered item is answered: segments formed (1.3 sketches, 2.1), characteristics and needs (2.2), where segments differ (1.3b),
   approach for two segments and effort vs benefit (1.2), what to personalise (2.2), risks of wrong segmentation (2.2), segments by
   business value (2.2), personalisation strategy (2.3). The coaching focus is Block 1.4; the Level 3 transfer project's five items are
   3.1 (criteria), 3.2 (core segments), 3.3 (sales strategies), 3.4 (standardisation vs individualisation), 3.5 (architecture), and the
   additional requirement is 3.6.
2. **The evaluation "Relevance × Differentiation × Economic Viability"** from the plan is the score of Block 2.3. Economic viability is
   derived from cost per account so it can be checked; relevance and differentiation are judged.
3. **The three segments are practitioner archetypes, labelled as such.** The plan's model solution ("segmentation by need and decision
   behaviour; focus on high-value segments; reduce complexity for smaller customers") is what the case is built to teach.
4. **Every figure beyond the brief is a Case assumption**: account names and notes, pilot results, costs, the Route 2 budget (€150,000),
   segment market data, baselines and regret-table payoffs. The brief gives €120,000 and five months only.
5. **German by the user's standing request (#32)**, which changes CURRICULUM-GUIDE §1 ("English only"); English stays the default.
6. **Day 7 note (for the course):** #29 says Friday days are named in each prompt; this request did not name one, so Days 5–7 follow #30.
7. **Sources to re-check before teaching:** citations are given by their usual details; the Gartner (2019) 17% figure, the Zoltners et al.
   (2004) title and the current wording of § 25 TDDDG and § 7 UWG should be verified; BSI C5 has a 2026 revision (C5:2026).

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 CRM fields | A3 (three tests, nested approach, worked sort) | Test questions · check (count) + clue per item · reasoning after two checks · undo/redo |
| 1.2 F1–F3, sentence | A4 (formula, five-step worked example on Weserdata) | Where the numbers are · formula + calculator with per-part clues · What to check |
| 1.3 target group, differ most, sketches | A2, A3, A5 | Clues on a/b · sketch frame · check (basis, need, ≤ 1 firmographic) |
| 1.4 reflection | A4, A6 | Worked answers for the mentor |
| 2.1 accounts | A5 (profiles, pair tests, worked example) | Test questions · check (count) + clue · reasoning · undo/redo |
| 2.2 profiles, gaps, risk | A5, A6 (value rule, content per segment, four kinds of gap) | Own tally · check against own tally · gap check |
| 2.3 measures | A7 (matching table, three score rules, budget, legal tests) | Test questions · budget bar · coverage · check (segments, viability) · order check |
| 3.1 criteria | B1 | Check (both axes) + clue |
| 3.2 ratings, roles | B1 (bands, role rule) | Printed pools · matrix of own ratings · check (count; roles vs own ratings) |
| 3.3 sales models | B2 (30% rule, behaviour rule) | Live cost share · check + clue |
| 3.4 grid | B3 (three rules, costs) | Cost vs limit per column · check (three rules per segment) |
| 3.5 architecture | B5 (owner, start, trigger tests) | Owner test · budget bar · plan reading · check (three rules) |
| 3.6 decision | B4 (value of information, regret, tripwire) | Baselines · check (wait, metric, threshold) |
