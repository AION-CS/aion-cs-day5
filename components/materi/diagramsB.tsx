"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Insight, Toggles } from "@/components/materi/kit";
import { COST_SHARE_MAX, LEVELS, LEVEL_COST, LEVEL_IDS, POOL_HIGH, POOL_MID, ROLES, SALES_MODELS, TAILOR_SHARE_MAX, abilityBucket, attractBucket, roleOf } from "@/data/route2";
import type { Bucket, Level, Role, SalesModel } from "@/data/route2";
import { bi, euro, num, pct, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Nordhafen IT (a Hamburg managed-services
 * firm, Case assumption), never DataCloud, so the answer to a task block is never printed. Every control is followed by an
 * always-visible "What this shows" (CLAUDE.md #20).
 */

const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", rustSoft: "#F6E3DB", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };
const BUCKET = () => ["", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")];

/* ------------------------------------------------------------------ B1 · the nine-box */

const N_SEGS = bi([
  { id: "hosp", name: t("Hospitals", "Krankenhäuser"), accounts: 90, acv: 75000, margin: 40, win: 18 },
  { id: "law", name: t("Law firms", "Kanzleien"), accounts: 300, acv: 12000, margin: 45, win: 30 },
  { id: "logi", name: t("Logistics platforms", "Logistikplattformen"), accounts: 150, acv: 50000, margin: 35, win: 8 },
  { id: "school", name: t("Schools", "Schulen"), accounts: 400, acv: 5000, margin: 20, win: 25 },
  { id: "eng", name: t("Engineering firms", "Ingenieurbüros"), accounts: 200, acv: 40000, margin: 32, win: 21 },
]);

export function NineBox() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("hosp");
  const [zones, setZones] = useState<"on" | "off">("on");
  const rows = N_SEGS.map((s) => {
    const pool = s.accounts * s.acv * (s.margin / 100);
    const a = attractBucket(pool);
    const b = abilityBucket(s.win);
    return { ...s, pool, a, b, role: roleOf(a, b) };
  });
  const cur = rows.find((r) => r.id === sel)!;
  const cell = (b: Bucket) => 90 + (b - 1) * 150;
  const cellY = (a: Bucket) => 20 + (3 - a) * 80;
  const zoneRole = (a: Bucket, b: Bucket): Role => roleOf(a, b);
  const zoneFill: Record<Role, string> = { core: C.tealSoft, standard: C.mist, deprio: C.paper };
  const count: Record<string, number> = {};
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 300" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Nordhafen's five segments on attractiveness and ability to win", "Die fünf Segmente von Nordhafen nach Attraktivität und Gewinnfähigkeit")}</title>
        <desc id={`${uid}-d`}>{rows.map((r) => `${r.name}: ${BUCKET()[r.a]} / ${BUCKET()[r.b]} → ${ROLES[r.role].label}`).join(". ")}</desc>
        {([3, 2, 1] as Bucket[]).map((a) =>
          ([1, 2, 3] as Bucket[]).map((b) => {
            const role = zoneRole(a, b);
            return (
              <g key={`${a}${b}`}>
                <rect x={cell(b)} y={cellY(a)} width="150" height="80" fill={zones === "on" ? zoneFill[role] : C.paper} stroke={C.line} strokeDasharray={zones === "on" && role === "deprio" ? "5 4" : undefined} />
                {zones === "on" && (
                  <text x={cell(b) + 146} y={cellY(a) + 14} textAnchor="end" fontSize="10.5" fill={C.ash}>
                    {ROLES[role].label}
                  </text>
                )}
              </g>
            );
          }),
        )}
        <text x="315" y="290" textAnchor="middle" fontSize="12" fill={C.ash}>{tt("ability to win (win rate) → Low · Mid · High", "Gewinnfähigkeit (Win Rate) → Niedrig · Mittel · Hoch")}</text>
        <text x="30" y="140" textAnchor="middle" fontSize="12" fill={C.ash} transform="rotate(-90 30 140)">{tt("attractiveness (profit pool) →", "Attraktivität (Profit Pool) →")}</text>
        {rows.map((r) => {
          const k = `${r.a}${r.b}`;
          const n = (count[k] = (count[k] ?? 0) + 1);
          const x = cell(r.b) + 30 + (n - 1) * 44;
          const y = cellY(r.a) + 48;
          const on = r.id === sel;
          return (
            <g key={r.id} className="hit" role="button" tabIndex={0} aria-label={r.name} onClick={() => setSel(r.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(r.id)}>
              <circle className="hit-shape" cx={x} cy={y} r={on ? 17 : 14} fill={on ? C.soft : C.paper} stroke={on ? C.amber : C.ink} strokeWidth={on ? 3 : 1.6} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>{r.name.slice(0, 3)}</text>
            </g>
          );
        })}
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Read one segment", "Ein Segment lesen")}</p>
          <Toggles<string> label={tt("Segment", "Segment")} value={sel} onChange={setSel} options={rows.map((r) => ({ id: r.id, label: r.name }))} />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Role zones", "Rollenzonen")}</p>
          <Toggles<"on" | "off"> label={tt("Zones", "Zonen")} value={zones} onChange={setZones} options={[{ id: "on", label: tt("Show the role rule", "Rollenregel zeigen") }, { id: "off", label: tt("Hide", "Ausblenden") }]} />
        </div>
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{cur.name}</p>
        <p className="mt-1 tnum text-ink">
          {tt(
            `Profit pool = ${num(cur.accounts)} accounts × ${euro(cur.acv)} × ${cur.margin}% = ${euro(cur.pool)} → ${BUCKET()[cur.a]}. Win rate ${pct(cur.win)} → ${BUCKET()[cur.b]}.`,
            `Profit Pool = ${num(cur.accounts)} Accounts × ${euro(cur.acv)} × ${cur.margin} % = ${euro(cur.pool)} → ${BUCKET()[cur.a]}. Win Rate ${pct(cur.win)} → ${BUCKET()[cur.b]}.`,
          )}
        </p>
        <p className="mt-1 text-ink">
          <span className="font-semibold">{tt("Role: ", "Rolle: ")}</span>
          {ROLES[cur.role].label} · {ROLES[cur.role].sub}
        </p>
      </div>
      <Insight>
        {cur.role === "core"
          ? tt(`${cur.name} holds a lot of profit and Nordhafen already wins there often enough: a core segment. Money spent here buys fit where it pays.`, `${cur.name} enthält viel Gewinn, und Nordhafen gewinnt dort schon oft genug: ein Kernsegment. Geld hier kauft Passung, wo es sich lohnt.`)
          : cur.role === "standard"
            ? tt(`${cur.name} is worth keeping but not worth tailoring for: ${cur.a < 3 ? "its profit pool is not large enough" : "the ability to win is only moderate"}. Serve it well with a standard offer and keep the cost to serve low.`, `${cur.name} lohnt sich zu halten, aber nicht zuzuschneiden: ${cur.a < 3 ? "sein Profit Pool ist nicht groß genug" : "die Gewinnfähigkeit ist nur mittel"}. Bedienen Sie es gut mit einem Standardangebot und halten Sie die Betreuungskosten niedrig.`)
            : cur.a === 3
              ? tt(`${cur.name} is tempting: a ${euro(cur.pool)} profit pool. But Nordhafen wins only ${pct(cur.win)} of its proposals there. Attractive for someone, not yet for Nordhafen: park it, or test cheaply, before spending the focus budget.`, `${cur.name} ist verlockend: ein Profit Pool von ${euro(cur.pool)}. Aber Nordhafen gewinnt dort nur ${pct(cur.win)} seiner Angebote. Attraktiv für jemanden, noch nicht für Nordhafen: zurückstellen oder günstig testen, bevor das Fokusbudget fließt.`)
              : tt(`${cur.name} is easy to win (${pct(cur.win)}) but holds little profit (${euro(cur.pool)}). Winning a small market is still a small result.`, `${cur.name} ist leicht zu gewinnen (${pct(cur.win)}), enthält aber wenig Gewinn (${euro(cur.pool)}). Einen kleinen Markt zu gewinnen bleibt ein kleines Ergebnis.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B2 · sales model against deal size */

const MODELS: SalesModel[] = ["key", "field", "inside", "self", "partner"];

export function SalesModelCost() {
  const uid = useId().replace(/:/g, "");
  const [acv, setAcv] = useState(30000);
  const rows = MODELS.map((m) => {
    const cost = m === "partner" ? acv * (SALES_MODELS.partner.share / 100) : SALES_MODELS[m].cost;
    return { m, cost, share: (cost / acv) * 100 };
  });
  const X = (s: number) => 150 + (Math.min(s, 120) / 120) * 380;
  const pass = rows.filter((r) => r.share <= COST_SHARE_MAX);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 250" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Cost of winning one deal, as a share of its first-year contract value", "Kosten für einen gewonnenen Deal, als Anteil am Erstjahres-Vertragswert")}</title>
        <desc id={`${uid}-d`}>{rows.map((r) => `${SALES_MODELS[r.m].name}: ${num(Math.round(r.share))}%`).join(". ")}</desc>
        <defs>
          <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill={C.soft} />
            <line x1="0" y1="0" x2="0" y2="7" stroke={C.amber} strokeWidth="2.8" />
          </pattern>
        </defs>
        {rows.map((r, i) => {
          const y = 12 + i * 42;
          const over = r.share > COST_SHARE_MAX;
          return (
            <g key={r.m}>
              <text x="4" y={y + 20} fontSize="12.5" fontWeight="700" fill={C.ink}>{SALES_MODELS[r.m].name}</text>
              <rect x="150" y={y + 4} width={Math.max(X(r.share) - 150, 1)} height="24" fill={over ? `url(#${uid}-h)` : C.data} stroke={over ? C.amber : C.ink} strokeWidth="1.4" />
              <text x={X(r.share) + 6} y={y + 21} fontSize="12" fontWeight="700" fill={C.ink}>{`${euro(r.cost)} · ${num(Math.round(r.share))}%`}</text>
            </g>
          );
        })}
        <line x1={X(COST_SHARE_MAX)} x2={X(COST_SHARE_MAX)} y1="6" y2="222" stroke={C.ink} strokeWidth="2" strokeDasharray="5 4" />
        <text x={X(COST_SHARE_MAX)} y="238" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>{tt(`limit ${COST_SHARE_MAX}% of contract value`, `Grenze ${COST_SHARE_MAX} % des Vertragswerts`)}</text>
      </svg>
      <div className="space-y-1.5">
        <label htmlFor={`${uid}-acv`} className="smallcaps block">
          {tt(`First-year contract value of one deal: ${euro(acv)}`, `Erstjahres-Vertragswert eines Deals: ${euro(acv)}`)}
        </label>
        <input id={`${uid}-acv`} type="range" min={5000} max={100000} step={5000} value={acv} onChange={(e) => setAcv(Number(e.target.value))} className="range-accent" />
        <Toggles<string> label={tt("Presets", "Voreinstellungen")} value={String(acv)} onChange={(v) => setAcv(Number(v))} options={[10000, 30000, 75000].map((v) => ({ id: String(v), label: euro(v) }))} />
      </div>
      <Insight>
        {tt(
          `At ${euro(acv)} per contract, ${pass.length} of 5 models stay under the ${COST_SHARE_MAX}% line: ${pass.map((r) => SALES_MODELS[r.m].name).join(", ") || "none"}. ${acv >= 55000 ? "Large contracts can carry a key account team; the cheaper models would be affordable too, but a committee buying from documents rarely signs through a web shop." : acv <= 10000 ? "Small contracts cannot carry a person on the road: only the digital and the partner channel pay, which is why small accounts need a standard offer." : "In the middle band the choice is decided less by cost than by how the buyer decides: engineers test online, owner-managers want a person nearby."}`,
          `Bei ${euro(acv)} pro Vertrag bleiben ${pass.length} von 5 Modellen unter der ${COST_SHARE_MAX}-%-Linie: ${pass.map((r) => SALES_MODELS[r.m].name).join(", ") || "keines"}. ${acv >= 55000 ? "Große Verträge können ein Key-Account-Team tragen; die günstigeren Modelle wären auch bezahlbar, aber ein Gremium, das nach Unterlagen kauft, unterschreibt selten über einen Webshop." : acv <= 10000 ? "Kleine Verträge tragen keinen Außendienst: Nur der digitale und der Partnerkanal lohnen sich, deshalb brauchen kleine Accounts ein Standardangebot." : "Im mittleren Band entscheidet weniger der Preis als die Art, wie der Käufer entscheidet: Engineers testen online, Inhaber wollen eine Person in der Nähe."}`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B3 · standardise or individualise */

const T_ELEMENTS = bi([
  { id: "platform", name: t("Platform and product", "Plattform und Produkt") },
  { id: "contract", name: t("Contract and compliance terms", "Vertrag und Compliance-Klauseln") },
  { id: "onboarding", name: t("Onboarding", "Onboarding") },
  { id: "pricing", name: t("Pricing model", "Preismodell") },
  { id: "content", name: t("Communication and content", "Kommunikation und Inhalte") },
]);
const T_SEGS = bi({
  hosp: { name: t("Hospitals", "Krankenhäuser"), acv: 75000, margin: 40 },
  law: { name: t("Law firms", "Kanzleien"), acv: 12000, margin: 45 },
});

export function TailorGridExample() {
  const uid = useId().replace(/:/g, "");
  const [seg, setSeg] = useState<"hosp" | "law">("hosp");
  const [grid, setGrid] = useState<Record<string, Level>>({ platform: "std", contract: "ind", onboarding: "mod", pricing: "std", content: "mod" });
  const cycle = (id: string) => setGrid((g) => ({ ...g, [id]: LEVEL_IDS[(LEVEL_IDS.indexOf(g[id]) + 1) % 3] }));
  const s = T_SEGS[seg];
  const margin = s.acv * (s.margin / 100);
  const limit = margin * (TAILOR_SHARE_MAX / 100);
  const cost = T_ELEMENTS.reduce((sum, e) => sum + LEVEL_COST[grid[e.id]], 0);
  const X = (v: number) => 20 + (Math.min(v, 14000) / 14000) * 520;
  const platformBad = grid.platform !== "std";
  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[30rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Five offer elements, each standard, modular or individual", "Fünf Angebotselemente, je Standard, modular oder individuell")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Element", "Element")}</th>
              <th className="px-3 py-2">{tt("Level (click to change)", "Stufe (klicken zum Ändern)")}</th>
              <th className="px-3 py-2 text-right">{tt("Cost per account and year", "Kosten pro Account und Jahr")}</th>
            </tr>
          </thead>
          <tbody>
            {T_ELEMENTS.map((e) => {
              const lv = LEVELS[grid[e.id]];
              return (
                <tr key={e.id} className="border-t border-line">
                  <td className="px-3 py-2 font-semibold">{e.name}</td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => cycle(e.id)} className={clsx("btn-ghost btn-sm min-w-[8rem]", e.id === "platform" && platformBad && "is-flagged")} aria-label={tt(`${e.name}: ${lv.label}. Click to change.`, `${e.name}: ${lv.label}. Klicken zum Ändern.`)}>
                      <span aria-hidden>{lv.glyph}</span> {lv.label}
                    </button>
                  </td>
                  <td className="tnum px-3 py-2 text-right">{euro(LEVEL_COST[grid[e.id]])}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <svg viewBox="0 0 560 80" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Tailoring cost per account against the limit", "Zuschnittkosten pro Account gegen die Grenze")}</title>
        <desc id={`${uid}-d`}>{tt(`Tailoring ${euro(cost)} per account, limit ${euro(limit)}.`, `Zuschnitt ${euro(cost)} pro Account, Grenze ${euro(limit)}.`)}</desc>
        <defs>
          <pattern id={`${uid}-h`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill={C.soft} />
            <line x1="0" y1="0" x2="0" y2="7" stroke={C.amber} strokeWidth="2.8" />
          </pattern>
        </defs>
        <rect x="20" y="20" width={Math.max(X(Math.min(cost, limit)) - 20, 1)} height="26" fill={C.data} stroke={C.ink} />
        {cost > limit && <rect x={X(limit)} y="20" width={X(cost) - X(limit)} height="26" fill={`url(#${uid}-h)`} stroke={C.amber} strokeWidth="1.5" />}
        <line x1={X(limit)} x2={X(limit)} y1="10" y2="56" stroke={C.ink} strokeWidth="2" />
        <text x={X(limit)} y="8" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ink}>{tt(`limit ${euro(limit)}`, `Grenze ${euro(limit)}`)}</text>
        <text x="20" y="72" fontSize="12" fill={C.ash}>{tt(`tailoring ${euro(cost)} per account · hatched = over the limit`, `Zuschnitt ${euro(cost)} pro Account · schraffiert = über der Grenze`)}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Nordhafen segment", "Segment von Nordhafen")}</p>
        <Toggles<"hosp" | "law"> label={tt("Segment", "Segment")} value={seg} onChange={setSeg} options={[{ id: "hosp", label: `${T_SEGS.hosp.name} · ${euro(T_SEGS.hosp.acv)}` }, { id: "law", label: `${T_SEGS.law.name} · ${euro(T_SEGS.law.acv)}` }]} />
      </div>
      <Insight>
        {tt(
          `${s.name}: each account brings ${euro(s.acv)} × ${s.margin}% = ${euro(margin)} of gross margin a year, so tailoring may cost up to ${TAILOR_SHARE_MAX}% of it, ${euro(limit)}. This grid costs ${euro(cost)}: ${cost <= limit ? "inside the limit." : `${euro(cost - limit)} over, and every extra account makes it worse.`} ${platformBad ? "The platform is not standard: every account on its own platform version ends scale economies, whatever the budget says." : seg === "law" ? "With small contracts one individual element already breaks the limit; modular building blocks are the most a small account can carry." : "One individual element where the need really differs (for hospitals, the compliance terms) and modular blocks elsewhere is what the margin can carry."}`,
          `${s.name}: Jeder Account bringt ${euro(s.acv)} × ${s.margin} % = ${euro(margin)} Bruttomarge pro Jahr, also darf der Zuschnitt bis zu ${TAILOR_SHARE_MAX} % davon kosten, ${euro(limit)}. Dieses Raster kostet ${euro(cost)}: ${cost <= limit ? "innerhalb der Grenze." : `${euro(cost - limit)} darüber, und jeder weitere Account macht es schlimmer.`} ${platformBad ? "Die Plattform ist nicht Standard: Jeder Account auf einer eigenen Plattformversion beendet die Skaleneffekte, egal was das Budget sagt." : seg === "law" ? "Bei kleinen Verträgen sprengt schon ein individuelles Element die Grenze; modulare Bausteine sind das Höchste, was ein kleiner Account tragen kann." : "Ein individuelles Element dort, wo der Bedarf wirklich abweicht (bei Kliniken die Compliance-Klauseln), und modulare Bausteine sonst: Das trägt die Marge."}`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · deciding with incomplete data */

type Strat = "focus" | "stage" | "wait";
const PAY: Record<Strat, [number, number, number]> = { focus: [900, 450, 100], stage: [750, 500, 300], wait: [400, 400, 350] };
const STRAT_NAME = bi({ focus: t("Focus now, full budget", "Jetzt fokussieren, volles Budget"), stage: t("Stage it, with a tripwire", "Stufenweise, mit Tripwire"), wait: t("Wait six months for data", "Sechs Monate auf Daten warten") });

export function RegretTable() {
  const uid = useId().replace(/:/g, "");
  const [view, setView] = useState<"net" | "regret">("net");
  const [q, setQ] = useState(40);
  const probs = [1 - q / 100, (q / 100) * 0.6, (q / 100) * 0.4];
  const best = [0, 1, 2].map((i) => Math.max(...(Object.values(PAY) as number[][]).map((r) => r[i])));
  const strats: Strat[] = ["focus", "stage", "wait"];
  const ev = (s: Strat) => PAY[s].reduce((sum, v, i) => sum + v * probs[i], 0);
  const maxReg = (s: Strat) => Math.max(...PAY[s].map((v, i) => best[i] - v));
  const bestEv = strats.reduce((a, b) => (ev(b) > ev(a) ? b : a));
  const minReg = strats.reduce((a, b) => (maxReg(b) < maxReg(a) ? b : a));
  const cols = [tt("as big as assumed", "so groß wie angenommen"), tt("a third smaller", "ein Drittel kleiner"), tt("half as big", "halb so groß")];
  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[34rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Gross profit over two years in thousands of euros for three strategies and three segment sizes", "Rohertrag über zwei Jahre in Tausend Euro für drei Strategien und drei Segmentgrößen")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Strategy", "Strategie")}</th>
              {cols.map((c) => (
                <th key={c} className="px-3 py-2 text-right">
                  {tt("Segment ", "Segment ")}
                  {c}
                </th>
              ))}
              <th className="px-3 py-2 text-right">{view === "net" ? tt("Expected", "Erwartet") : tt("Largest regret", "Größtes Bedauern")}</th>
            </tr>
          </thead>
          <tbody>
            {strats.map((s) => (
              <tr key={s} className={clsx("border-t border-line", (view === "net" ? bestEv : minReg) === s && "bg-accentSoft")}>
                <td className="px-3 py-2 font-semibold">{STRAT_NAME[s]}</td>
                {PAY[s].map((v, i) => (
                  <td key={i} className="tnum px-3 py-2 text-right">
                    {view === "net" ? num(v) : num(best[i] - v)}
                  </td>
                ))}
                <td className="tnum px-3 py-2 text-right font-bold">{view === "net" ? num(Math.round(ev(s))) : num(maxReg(s))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Show", "Zeigen")}</p>
          <Toggles<"net" | "regret"> label={tt("View", "Ansicht")} value={view} onChange={setView} options={[{ id: "net", label: tt("Result (€k)", "Ergebnis (T€)") }, { id: "regret", label: tt("Regret (€k)", "Bedauern (T€)") }]} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-q`} className="smallcaps block">
            {tt(`Your estimate: chance the segment is smaller than assumed · ${q}%`, `Ihre Schätzung: Wahrscheinlichkeit, dass das Segment kleiner ist als angenommen · ${q} %`)}
          </label>
          <input id={`${uid}-q`} type="range" min={0} max={100} step={10} value={q} onChange={(e) => setQ(Number(e.target.value))} className="range-accent" />
        </div>
      </div>
      <Insight>
        {tt(
          `At a ${q}% chance that the segment is smaller, “${STRAT_NAME[bestEv]}” has the highest expected result (${num(Math.round(ev(bestEv)))}k). On regret, “${STRAT_NAME[minReg]}” keeps the worst case smallest (${num(maxReg(minReg))}k). ${bestEv === minReg ? "Both readings agree." : "The readings disagree: the more uncertain you are about your estimate, the more the regret reading counts."} Waiting has the smallest spread and the lowest result whenever the segment is real: it is a decision too, paid for with six months of generic offers.`,
          `Bei ${q} % Wahrscheinlichkeit, dass das Segment kleiner ist, hat „${STRAT_NAME[bestEv]}“ das höchste erwartete Ergebnis (${num(Math.round(ev(bestEv)))} T€). Beim Bedauern hält „${STRAT_NAME[minReg]}“ den schlechtesten Fall am kleinsten (${num(maxReg(minReg))} T€). ${bestEv === minReg ? "Beide Lesarten stimmen überein." : "Die Lesarten widersprechen sich: Je unsicherer Sie bei Ihrer Schätzung sind, desto mehr zählt das Bedauern."} Warten hat die kleinste Streuung und das niedrigste Ergebnis, wann immer das Segment echt ist: Es ist auch eine Entscheidung, bezahlt mit sechs Monaten generischer Angebote.`,
        )}
      </Insight>
      <p className="text-caption text-ash">{tt("Illustration with Case assumption figures for Nordhafen IT, not a forecast.", "Illustration mit Fallannahmen für Nordhafen IT, keine Prognose.")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ B5 · from strategy to architecture */

const N_ARCH = bi([
  { id: "data", name: t("Segment fields in the CRM", "Segmentfelder im CRM"), start: 1, weeks: 4, owner: t("Head of Sales Operations", "Leitung Sales Operations"), trigger: t("If fewer than 80% of accounts carry the fields by month 2, the segment report waits.", "Tragen bis Monat 2 weniger als 80 % der Accounts die Felder, wartet der Segmentbericht."), why: t("It starts first because it produces the baseline for every other item. Sales Operations owns the CRM and can change the fields alone.", "Es startet zuerst, weil es die Baseline für alle anderen Punkte liefert. Sales Operations verantwortet das CRM und kann die Felder allein ändern.") },
  { id: "pack", name: t("Hospital evidence pack", "Nachweispaket für Kliniken"), start: 1, weeks: 6, owner: t("Legal counsel", "Rechtsabteilung"), trigger: t("If fewer than 70% of hospital proposals carry the pack by month 3, legal reviews the process.", "Tragen bis Monat 3 weniger als 70 % der Klinikangebote das Paket, prüft die Rechtsabteilung den Ablauf."), why: t("It can start at once because it uses documents that exist. Legal owns what may be promised in a contract.", "Es kann sofort starten, weil es vorhandene Unterlagen nutzt. Die Rechtsabteilung verantwortet, was im Vertrag zugesagt werden darf.") },
  { id: "trial", name: t("Self-service trial for engineering firms", "Self-Service-Test für Ingenieurbüros"), start: 2, weeks: 10, owner: t("Head of Product", "Leitung Produkt"), trigger: t("If fewer than 20% of trials become contracts by month 5, the trial is shortened.", "Werden bis Monat 5 weniger als 20 % der Tests zu Verträgen, wird der Test verkürzt."), why: t("It starts in month 2 so the first trials can be compared with the new segment fields. Product owns the platform and the test environments.", "Es startet in Monat 2, damit die ersten Tests mit den neuen Segmentfeldern verglichen werden können. Produkt verantwortet Plattform und Testumgebungen.") },
  { id: "kam", name: t("Key account manager for hospitals", "Key Account Manager für Kliniken"), start: 3, weeks: 8, owner: t("Chief Sales Officer", "Chief Sales Officer"), trigger: t("If the hospital win rate is below 22% at month 5, the account plans are reviewed.", "Liegt die Win Rate bei Kliniken in Monat 5 unter 22 %, werden die Account-Pläne überprüft."), why: t("It starts once the evidence pack exists, so the new manager sells with it from day one. Only the CSO can hire and direct sellers.", "Es startet, sobald das Nachweispaket existiert, damit die neue Managerin vom ersten Tag an damit verkauft. Nur der CSO kann Verkäufer einstellen und führen.") },
]);

export function ArchExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("data");
  const r = N_ARCH.find((x) => x.id === sel)!;
  const X = (m: number) => 190 + (m - 1) * 60;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 210" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Nordhafen's four funded items by start month", "Die vier finanzierten Punkte von Nordhafen nach Startmonat")}</title>
        <desc id={`${uid}-d`}>{N_ARCH.map((a) => tt(`${a.name}: month ${a.start}, owner ${a.owner}`, `${a.name}: Monat ${a.start}, Owner ${a.owner}`)).join(". ")}</desc>
        {[1, 2, 3, 4, 5, 6].map((m) => (
          <text key={m} x={X(m) + 30} y="14" textAnchor="middle" fontSize="11.5" fill={C.ash}>{tt(`M${m}`, `M${m}`)}</text>
        ))}
        {N_ARCH.map((a, i) => {
          const y = 24 + i * 42;
          const on = a.id === sel;
          return (
            <g key={a.id} className="hit" role="button" tabIndex={0} aria-label={a.name} onClick={() => setSel(a.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(a.id)}>
              <text x="4" y={y + 22} fontSize="12" fontWeight={on ? 800 : 600} fill={C.ink}>{a.name.length > 28 ? `${a.name.slice(0, 27)}…` : a.name}</text>
              {[1, 2, 3, 4, 5, 6].map((m) => (
                <rect key={m} className={m === a.start ? "hit-shape" : undefined} x={X(m) + 2} y={y + 6} width="56" height="24" rx="3" fill={m === a.start ? C.data : m > a.start ? C.tealSoft : C.paper} stroke={on && m === a.start ? C.amber : C.line} strokeWidth={on && m === a.start ? 2.5 : 1} />
              ))}
            </g>
          );
        })}
        <text x="4" y="204" fontSize="11.5" fill={C.ash}>{tt("dark = start month · pale = running", "dunkel = Startmonat · hell = läuft")}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one item", "Einen Punkt lesen")}</p>
        <Toggles<string> label={tt("Item", "Punkt")} value={sel} onChange={setSel} options={N_ARCH.map((a) => ({ id: a.id, label: a.name }))} />
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{r.name}</p>
        <p className="mt-1">
          <span className="font-semibold text-ink">{tt("Owner. ", "Owner. ")}</span>
          {r.owner}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">{tt("Trigger. ", "Trigger. ")}</span>
          <Gloss>{r.trigger}</Gloss>
        </p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">{tt("Why this start and this owner. ", "Warum dieser Start und dieser Owner. ")}</span>
          {r.why}
        </p>
      </div>
      <Insight>
        {tt(
          "The segment fields start in month 1, before or with everything else, because they are the baseline: without them no trigger below can be read. Each item has one owner who can change it alone, and a trigger with a number, a date and an action. What did not fit, a tender team for logistics platforms (€50,000), was left out on purpose with a pickup point: “if the win rate on logistics proposals reaches 15% in the next budget round, we revisit it”.",
          "Die Segmentfelder starten in Monat 1, vor oder mit allem anderen, weil sie die Baseline sind: Ohne sie lässt sich kein Trigger unten ablesen. Jeder Punkt hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Datum und Aktion. Was nicht passte, ein Ausschreibungsteam für Logistikplattformen (50.000 €), wurde bewusst weggelassen, mit einem Pickup Point: „Erreicht die Win Rate bei Logistikangeboten in der nächsten Budgetrunde 15 %, prüfen wir es neu.“",
        )}
      </Insight>
    </div>
  );
}

export { POOL_HIGH, POOL_MID };
