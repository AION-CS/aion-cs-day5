# Retention Lab · Day 5

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 3, Day 1 of 2.**
*Understanding customer segmentation and strategically developing personalisation.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28 and #34 to #35, the two-route form of #30
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
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 attractiveness × ability to win, B2 a sales model per segment, B3 standardise or individualise, B4 deciding with incomplete data, B5 architecture). **Task 2, Segment Strategy Memo**, assembling below the questions: 3.1 prioritisation criteria, 3.2 rate five candidate segments and name the core, 3.3 a sales model and value proposition per segment, 3.4 standard / modular / individual grid, 3.5 the measures architecture, 3.6 the decision, the tripwire and the board's challenge. | `2-{name}-day5-l3-strategy-memo.html` |

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
8. **Core / Optional on both routes (CLAUDE.md #35, added 2026-09-29 to match Day 4).** No question, card or figure was changed or removed;
   the shortest thread to each route's own objective stays open and the rest is folded to one line ("Show this", "Hide" to fold it
   again). Route 1 objective: *understand the segments and decide where personalising pays*. **Core 1.1** (read the criteria),
   **1.2** (does tailoring pay: F1 to F3), **2.1** (place twelve accounts in segments), **2.3** (choose, score and order three
   measures). **Optional 1.3, 1.4, 2.2** (sketches, coaching reflection, profiles), each deepening what a Core block already teaches.
   Materi **A3, A4, A5, A7** stay Core (cited by a Core block); **A1, A2, A6** are collapsed. Route 2 objective: *choose the
   segments to serve and decide although the data is incomplete*. **Core 3.2** (rate the five segments, name the core), **3.5** (fund,
   sequence and own the measures), **3.6** (the decision). **Optional 3.1, 3.3, 3.4**. Materi **B1, B4, B5** stay Core; **B2, B3** are
   collapsed. The ring, the page map's done/total and both missing lists count Core only (`lib/progress.ts` `OPTIONAL_BLOCKS`,
   `materialIndex.ts` `optional`). The tag shows on the page map (always visible, beside the pill on wide screens) and on every card and
   block (`CorePill`). A jump to a collapsed item (page map, a material chip, a missing-list entry, Route 2's pointer to Block 2.2 in
   Route 1) opens it first (`lib/flash.ts`, `store/useOptionalOpen.ts`). "Fill all model answers" still fills Core and Optional alike;
   `npm run verify:calc` also proves a Core-only fill empties both missing lists in EN and DE.
9. **Two always-live rust "still missing" notices (CLAUDE.md #34).** Under every answer block (`components/ui/BlockMissing.tsx`) and above
   the Export button, with no Check and no click first; each disappears when its gap closes. They report completeness only, never
   correctness, so #4 is untouched.
10. **"Show clue and example answer" on every free-text field (CLAUDE.md #23 update).** `components/ui/ExampleAnswer.tsx`, open to every
    learner. For open fields it shows the mentor's model text; where the model text is the case's own calculated result or a pick the
    block also grades (1.2 sentence, 1.3 sketches, 2.2 profile need, 2.3 first priority, 3.3 value proposition, 3.5 trigger and
    pickup, 3.6 board's challenge) it shows a separately written `example` in `lib/mentorGuide.ts`: the same method, another company,
    other numbers, ending by sending the learner back to their own figures. The mentor's own panel still shows the real answer.
11. **"Highlight the key words" on both sort boards (1.1 and 2.1)** underlines the decisive phrase of every item at once, never which bin
    it belongs in (`keyPhrases`; a script check proves every phrase is an exact substring of its text in both languages).
12. **Calculation help.** Block 1.2 already had "Show where the numbers are", "Show the formula" and the calculator with per-part clues;
    Block 2.3 gained a hidden "Show the formula" per measure for economic viability (cost per account, from Materi A7).
13. **Guided story and videos (CLAUDE.md #36, 2026-09-29).** "Effort against benefit" (A4) is the first diagram with a "Walk me through it"
    story (`Story` in `components/materi/kit.tsx`, four steps (an everyday picture of the idea first) that drive the real controls and move a spotlight ring; numbers computed from
    the same constants). The other eleven interactive diagrams of Day 5 do not have a story yet. Two videos are embedded through
    `data/videos.ts` and `Watch`: A4 (McKinsey & Company, 2 min, counted in the card) and A3 (Tony Seba, Stanford lecture, 39 min, optional).
    Both were checked for uploader, length, embeddability and captions on 2026-09-29 but **not watched through**: preview before teaching.
    No video met the bar for Materi B.
14. **Less text by default (CLAUDE.md #37, 2026-09-29).** Each card shows the scan line, "In plain words", the picture and the body a task reads.
    The decision rules, "why it matters / how to read the picture", the video and side notes (A1 what buyers expect, A4 German law and
    the worked calculation, A6 small numbers, B3 coaching question) sit behind "＋ Show …" rows (`ShowMore`, `useCardMore`). "Draws on"
    chips in the tasks open the rules and worked calculation of the card first; one button per Materi block shows everything. Only these
    cards were curated so far; the other side notes and tables of Day 5 remain visible and need a per-card decision.
15. **Decisions are free (CLAUDE.md #38, 2026-09-29).** Going over the Route 2 budget (Block 3.5) or making a second firmographic-only sketch
    (Block 1.3) is no longer a missing item and no longer blocks the block's done-state; both stay hints, the memo prints "€X over" as a
    fact, and every `CheckBar` says a check is a hint. `verify:calc` proves an over-budget plan leaves no budget entry in the missing list.

16. **Live memo at the bottom (CLAUDE.md #39, 2026-09-29).** The memo of Route 2 no longer sits in a right-hand column (or a phone strip);
    it is a full-width panel below Block 3.6 and above Export, with a "Hide the memo" button. The questions now use the full width.
17. **Core never depends on Optional (CLAUDE.md #40, 2026-09-29).** The audit found three places where a Core part leaned on an
    Optional one; all three are fixed (see the checklist below).

## Dependency checklist (CLAUDE.md #40)

✓ = reads only Core blocks, Core cards and the case brief. For Optional items the column says what they read; they may read Core,
and nothing reads them back.

| Item | Status | Reads from | Core-safe |
|---|---|---|---|
| **Route 1** | | | |
| 1.1 Sort CRM fields | Core | brief, A3 | ✓ |
| 1.2 Is tailoring worth it (F1–F3) | Core | printed pilot table, A4 | ✓ |
| 1.3 Target group, sketches | Optional | printed accounts of 2.1, A2, A3, A5 | self-contained |
| 1.4 Coaching reflection | Optional | own answers 1.1–1.3, A4, A6 | self-contained |
| 2.1 Assign twelve accounts | Core | printed notes, A5 | ✓ |
| 2.2 Profiles, value, gaps | Optional | own placement in 2.1 (Core), A5, A6 | self-contained |
| 2.3 Choose, score, order measures | Core | own placement in 2.1 (Core), A7 | ✓ **fixed**: the Relevance score needed each segment's value, which lived only in 2.2 (Optional) with its rule in A6 (Optional). 2.3 now prints the values from 2.1 with the rule, and A7's rules state the value rule. |
| **Route 2** | | | |
| 3.1 Prioritisation criteria | Optional | B1 | self-contained |
| 3.2 Rate five segments, name core | Core | printed market table, B1 | ✓ |
| 3.3 Sales model per segment | Optional | own roles in 3.2 (Core), B2 | self-contained |
| 3.4 Standardise or individualise | Optional | own roles in 3.2 (Core), B3 | self-contained |
| 3.5 Architecture: fund, sequence, own | Core | own roles in 3.2 (Core), B5 | ✓ **fixed**: item "Compliance evidence pack" was described as "the audit folder from Route 1"; now described on its own. |
| 3.6 Decision, tripwire, board | Core | own core segments 3.2 and plan 3.5 (Core), B4, printed baselines | ✓ **fixed**: its FIND IT line said "your answers in Blocks 3.1 to 3.5" (3.1, 3.3, 3.4 are Optional); it now names 3.2 and 3.5. |
| Route 2 brief · "Where Route 1 left off" | — | Route 1 Core 2.1 and 2.3 | ✓ **fixed**: it quoted Route 1's Optional Block 2.2 and jumped there; it now reads values from 2.1 and jumps to 2.3 (the memo quotes the same). |
| **Cards** | | | |
| A3, A4, A5, A7 · B1, B4, B5 | Core | each other and the case | ✓ (A7 now carries the value rule itself) |
| A1, A2, A6 · B2, B3 | Optional | — | no Core block needs them |

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 CRM fields · **Core** | A3 (three tests, nested approach, worked sort) | Test questions · check (count) + clue per item · reasoning after two checks · undo/redo |
| 1.2 F1–F3, sentence · **Core** | A4 (formula, five-step worked example on Weserdata) | Where the numbers are · formula + calculator with per-part clues · What to check |
| 1.3 target group, differ most, sketches · Optional | A2, A3, A5 | Clues on a/b · sketch frame · check (basis, need, ≤ 1 firmographic) |
| 1.4 reflection · Optional | A4, A6 | Worked answers for the mentor |
| 2.1 accounts · **Core** | A5 (profiles, pair tests, worked example) | Test questions · check (count) + clue · reasoning · undo/redo |
| 2.2 profiles, gaps, risk · Optional | A5, A6 (value rule, content per segment, four kinds of gap) | Own tally · check against own tally · gap check |
| 2.3 measures · **Core** | A7 (matching table, three score rules, budget, legal tests) | Test questions · budget bar · coverage · check (segments, viability) · order check |
| 3.1 criteria · Optional | B1 | Check (both axes) + clue |
| 3.2 ratings, roles · **Core** | B1 (bands, role rule) | Printed pools · matrix of own ratings · check (count; roles vs own ratings) |
| 3.3 sales models · Optional | B2 (30% rule, behaviour rule) | Live cost share · check + clue |
| 3.4 grid · Optional | B3 (three rules, costs) | Cost vs limit per column · check (three rules per segment) |
| 3.5 architecture · **Core** | B5 (owner, start, trigger tests) | Owner test · budget bar · plan reading · check (three rules) |
| 3.6 decision · **Core** | B4 (value of information, regret, tripwire) | Baselines · check (wait, metric, threshold) |
