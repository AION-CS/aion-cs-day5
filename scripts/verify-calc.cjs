/**
 * Re-derives every figure and every rule the day rests on, from the same data files the site uses, and compares them with the
 * results briefed in the README. Run: npm run verify:calc. A failed line prints FAIL and the process exits with code 1.
 *
 * The data files are TypeScript with "@/" imports, so a tiny loader transpiles them on the fly (no test framework, no extra dependency).
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const ts = require(path.join(process.cwd(), "node_modules", "typescript"));

const root = process.cwd();
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    const base = path.join(root, request.slice(2));
    for (const ext of [".ts", ".tsx", "/index.ts"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  return origResolve.call(this, request, ...rest);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = function (module, filename) {
    const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    });
    module._compile(out.outputText, filename);
  };

let failed = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!cond) failed++;
};
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);

const lang = require("@/lib/lang");
const tail = require("@/data/tailoring");
const acc = require("@/data/accounts");
const seg = require("@/data/segments");
const meas = require("@/data/measures");
const r2 = require("@/data/route2");
const crit = require("@/data/criteria");
const key = require("@/data/mentorKey");
const checks = require("@/lib/checks");
const calc = require("@/lib/calcBuilder");
const missing = require("@/lib/missing");
const progress = require("@/lib/progress");
const store = require("@/store/useStore");

// --- Block 1.2 --------------------------------------------------------------------
eq("F1 extra gross profit Compliance-first", tail.TAILOR.f1, 58800);
eq("F2 extra gross profit Hands-off", tail.TAILOR.f2, 9520);
eq("F3 net Hands-off", tail.TAILOR.f3, -20480);
eq("net Compliance-first", tail.TAILOR.netAssure, 28800);
for (const f of ["F1", "F2", "F3"]) {
  const b = calc.FIGURE_BUILDERS[f];
  const parts = calc.modelParts({ [f]: b });
  eq(`builder ${f} reproduces the answer`, calc.builderResult(b, f, parts), calc.figAnswer(f));
  eq(`builder ${f} flags nothing on model parts`, calc.wrongParts(b, f, parts), []);
}
const wrong = { ...calc.modelParts({ F1: calc.FIGURE_BUILDERS.F1 }), "F1.acv": "17000" };
eq("builder F1 flags exactly the wrong part", calc.wrongParts(calc.FIGURE_BUILDERS.F1, "F1", wrong), ["F1.acv"]);
eq("Weserdata clinics worked example", tail.WESER_RESULT.clinics, 27000);
eq("Weserdata retail worked example", Math.round(tail.WESER_RESULT.retail), 6480);

// --- Block 1.1 --------------------------------------------------------------------
const tagCount = crit.FIELDS.reduce((o, f) => ({ ...o, [f.truth]: (o[f.truth] || 0) + 1 }), {});
eq("CRM fields: three of each kind", tagCount, { firmo: 3, behaviour: 3, need: 3 });

// --- Block 2.1 / 2.2 ----------------------------------------------------------------
eq("accounts per segment", acc.TRUTH_COUNTS, { assure: 4, handsoff: 5, scale: 3 });
eq("ACV per segment", acc.TRUTH_ACV, { assure: 225000, handsoff: 86000, scale: 140000 });
eq("value bands", ["assure", "handsoff", "scale"].map((s) => seg.valueOf(acc.TRUTH_ACV[s])), ["high", "low", "mid"]);
ok("the largest segment by count is the lowest by value", acc.TRUTH_COUNTS.handsoff > acc.TRUTH_COUNTS.assure && acc.TRUTH_ACV.handsoff < acc.TRUTH_ACV.scale);
const segOf = (id) => acc.ACCOUNT_BY_ID[id].truth;
for (const [x, y, what] of [["a02", "a07", "logistics"], ["a01", "a08", "healthcare"], ["a03", "a12", "energy"], ["a04", "a09", "size"]]) ok(`${what} pair sits in two different segments`, segOf(x) !== segOf(y));
for (const a of acc.ACCOUNTS) ok(`key phrase is in the note (${a.id}, en)`, a.note.includes(a.key));

// --- Block 2.3 --------------------------------------------------------------------
const scores = Object.fromEntries(meas.MEASURES.map((m) => [m.id, meas.modelScore(m.id)]));
eq("model scores", scores, { compliance: 27, refs: 12, care: 6, lane: 18, bespoke: 4, industry: 3, discount: 3, tracking: 3, playbook: 6 });
eq("model three cost", meas.MODEL_COST, 113000);
ok("model three fit the budget", meas.MODEL_COST <= meas.BUDGET);
const others = meas.MEASURES.filter((m) => !meas.MODEL_MEASURES.includes(m.id));
ok("any fourth measure breaks the budget", others.every((m) => meas.MODEL_COST + m.cost > meas.BUDGET));
const top3 = [...meas.MEASURES].sort((a, b) => meas.modelScore(b.id) - meas.modelScore(a.id)).slice(0, 3).map((m) => m.id);
eq("model three are the top three scores", [...top3].sort(), [...meas.MODEL_MEASURES].sort());

// --- Route 2 --------------------------------------------------------------------
eq("profit pools", r2.CAND_IDS.map((id) => Math.round(r2.poolOf(id))), [2979200, 1980000, 2520000, 1350000, 360000]);
eq("model roles", r2.MODEL_ROLE, { assure: "core", handsoff: "standard", scale: "core", public: "deprio", ai: "deprio" });
eq("core count", Object.values(r2.MODEL_ROLE).filter((x) => x === "core").length, r2.CORE_COUNT);
for (const [id, ms] of Object.entries(r2.MODEL_ACCEPT))
  for (const m of ms) ok(`accepted model ${m} for ${id} is inside the 30% rule`, (r2.costPerDeal(m, r2.CAND_BY_ID[id].acv) / r2.CAND_BY_ID[id].acv) * 100 <= r2.COST_SHARE_MAX);

// --- the mentor fill, in both languages --------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const l1 = { ...store.emptyL1(), ...key.KEY_L1(), parts: calc.modelParts(calc.FIGURE_BUILDERS) };
  const rr = { ...store.emptyR2(), ...key.KEY_R2() };
  const p = { participant: { name: "Mentor Check" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1, r2: rr };
  eq(`[${l}] mentor fill leaves Route 1 missing list empty`, missing.l1Missing(p).map((m) => m.label), []);
  eq(`[${l}] mentor fill leaves Route 2 missing list empty`, missing.r2Missing(p).map((m) => m.label), []);
  const tb = progress.taskBlocks(p);
  eq(`[${l}] every task block complete after the fill`, Object.values(tb).every(Boolean), true);
  eq(`[${l}] model grid breaks no rule`, checks.gridFlagsOf(rr), []);
  eq(`[${l}] model architecture holds all rules`, checks.seqRules(rr), { baseline: true, budget: true, focus: true, hasBaseline: true });
  eq(`[${l}] model sales models pass`, checks.salesFlagsOf(rr), []);
  eq(`[${l}] model ratings all hold`, checks.rateHolds(rr), { holds: 10, total: 10 });
  eq(`[${l}] model roles follow the ratings`, checks.roleFlagsOf(rr), []);
  eq(`[${l}] model tripwire flags nothing`, checks.tripFlagsOf(rr), []);
  eq(`[${l}] model sort all hold`, checks.sortHolds(l1.sort), { holds: 9, placed: 9 });
  eq(`[${l}] model assignment all hold`, checks.assignHolds(l1.assign), { holds: 12, placed: 12 });
  const pc = checks.profileCheck(l1);
  eq(`[${l}] model profiles hold`, [pc.value, pc.content], [3, 3]);
  eq(`[${l}] model sketches pass the floor`, checks.sketchFlags(l1), []);
  ok(`[${l}] model sentence cites a figure`, checks.citesTailorFigure(l1.worth));
  for (const id of l1.chosen) ok(`[${l}] model aims and viability hold (${id})`, checks.aimsHold(id, l1.aims[id]) && checks.ecoHolds(id, l1.eco[id]));
  for (const a of acc.ACCOUNTS) ok(`[${l}] key phrase is in the note (${a.id})`, a.note.includes(a.key));
}
lang.setCurrentLang("en");

// --- Core / Optional (CLAUDE.md #35), key phrases, example answers ---------------------------------------
const critData = require("@/data/criteria");
const guides = require("@/lib/mentorGuide");
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  for (const f of critData.FIELDS) ok(`[${l}] key phrase is in the field (${f.id})`, f.text.includes(f.key));
  // Core blocks only: the Optional blocks stay empty, and both exports must still be complete.
  const E1 = store.emptyL1();
  const E2 = store.emptyR2();
  const core1 = { ...E1, ...key.KEY_L1(), parts: calc.modelParts(calc.FIGURE_BUILDERS), tg: E1.tg, diff: E1.diff, sketches: E1.sketches, reflect: E1.reflect, profiles: E1.profiles, gaps: E1.gaps, riskText: E1.riskText };
  const core2 = { ...E2, ...key.KEY_R2(), crits: E2.crits, critText: E2.critText, sales: E2.sales, prop: E2.prop, grid: E2.grid };
  const pc = { participant: { name: "Core Only" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1: core1, r2: core2 };
  eq(`[${l}] Core-only fill leaves Route 1 missing list empty`, missing.l1Missing(pc).map((m) => m.label), []);
  eq(`[${l}] Core-only fill leaves Route 2 missing list empty`, missing.r2Missing(pc).map((m) => m.label), []);
  const tb = progress.taskBlocks(pc);
  eq(`[${l}] every Core block complete on a Core-only fill`, Object.entries(tb).filter(([b]) => !progress.isOptionalBlock(b)).every(([, v]) => v), true);
  const cnt = progress.dossierProgress(pc, 1);
  ok(`[${l}] Route 1 ring counts Core only (total ${cnt.total})`, cnt.total === 4 + 4);
  const cnt2 = progress.dossierProgress(pc, 2);
  ok(`[${l}] Route 2 ring counts Core only (total ${cnt2.total})`, cnt2.total === 3 + 3);
  // Every fixed-fill guide that shows an example differs from the model answer.
  const exs = [guides.worthGuide(), guides.sketchGuide(0), guides.sketchGuide(1), guides.sketchGuide(2), guides.profileGuide("assure"), guides.whyGuide(), guides.propGuide("assure"), guides.triggerGuide("kam"), guides.postponedGuide(), guides.challengeGuide()];
  for (const g of exs) ok(`[${l}] example differs from the model answer (${g.title})`, !!g.example && g.example !== g.answer && g.example.length > 80);
}
lang.setCurrentLang("en");

// --- decisions are free (CLAUDE.md #38): an over-budget plan and a second firmographic sketch stay hints, never gaps ---------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const over2 = { ...store.emptyR2(), ...key.KEY_R2(), alloc: Object.fromEntries(r2.ARCH_IDS.map((id) => [id, true])) };
  ok(`[${l}] funding every item goes over the budget`, checks.archOver(over2) > 0);
  eq(`[${l}] an over-budget plan adds no missing entry about the budget`, missing.r2Missing({ participant: { name: "X" }, ui: {}, l1: store.emptyL1(), r2: over2 }).filter((m) => /budget|Budget/.test(m.label)), []);
}
lang.setCurrentLang("en");
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
