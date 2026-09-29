"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
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
  const row = (id: string) => rows.find((r) => r.id === id)!;
  const [h, lg, sc] = [row("hosp"), row("logi"), row("school")];
  const story = useStory([
    {
      title: tt("A lot to win, and we win there", "Viel zu holen, und wir gewinnen dort"),
      say: tt(
        `Nordhafen IT, an example company, rates five customer groups on two questions: how much profit is in the group (up), and how often do we win there (right). Hospitals: ${euro(h.pool)} of profit and Nordhafen wins ${pct(h.win)}. Both are good, so this is a core group: put the money here.`,
        `Nordhafen IT, ein Beispielunternehmen, bewertet fünf Kundengruppen nach zwei Fragen: Wie viel Gewinn steckt in der Gruppe (nach oben), und wie oft gewinnen wir dort (nach rechts)? Krankenhäuser: ${euro(h.pool)} Gewinn, und Nordhafen gewinnt ${pct(h.win)}. Beides ist gut, also ist das eine Kerngruppe: Das Geld gehört hierher.`,
      ),
      look: tt("the highlighted circle “Hos”, top middle.", "den markierten Kreis „Kra“ oben in der Mitte."),
      apply: () => {
        setZones("on");
        setSel("hosp");
      },
    },
    {
      title: tt("A lot to win, but we lose there", "Viel zu holen, aber wir verlieren dort"),
      say: tt(
        `Logistics platforms also hold a lot of profit (${euro(lg.pool)}). But Nordhafen wins only ${pct(lg.win)} of its offers there. Tempting, but not now.`,
        `Logistikplattformen enthalten auch viel Gewinn (${euro(lg.pool)}). Aber Nordhafen gewinnt dort nur ${pct(lg.win)} seiner Angebote. Verlockend, aber nicht jetzt.`,
      ),
      look: tt("the highlighted circle top left: much profit, low win rate.", "den markierten Kreis oben links: viel Gewinn, niedrige Win Rate."),
      apply: () => {
        setZones("on");
        setSel("logi");
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(
        `Schools are the opposite: easy to win (${pct(sc.win)}) but little profit (${euro(sc.pool)}). The point: focus only where both are true, a lot to win and a real chance to win it.`,
        `Schulen sind das Gegenteil: leicht zu gewinnen (${pct(sc.win)}), aber wenig Gewinn (${euro(sc.pool)}). Das Wichtigste: Fokussieren Sie nur dort, wo beides stimmt, viel zu holen und eine echte Chance, es zu holen.`,
      ),
      look: tt("the highlighted circle bottom right.", "den markierten Kreis unten rechts."),
      apply: () => {
        setZones("on");
        setSel("school");
      },
    },
  ]);
  const pick = (id: string) => {
    story.leave();
    setSel(id);
  };
  return (
    <div className="space-y-3">
      <ThePoint>
        {tt(
          "Put your money into a customer group only when there is a lot to win there and you actually win there. One of the two is not enough.",
          "Stecken Sie Geld nur dann in eine Kundengruppe, wenn es dort viel zu holen gibt und Sie dort tatsächlich gewinnen. Eines von beiden reicht nicht.",
        )}
      </ThePoint>
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
            <g key={r.id} className="hit" role="button" tabIndex={0} aria-label={r.name} onClick={() => pick(r.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(r.id)}>
              <circle className="hit-shape" cx={x} cy={y} r={on ? 17 : 14} fill={on ? C.soft : C.paper} stroke={on ? C.amber : C.ink} strokeWidth={on ? 3 : 1.6} />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>{r.name.slice(0, 3)}</text>
            </g>
          );
        })}
      </svg>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Read one segment", "Ein Segment lesen")}</p>
          <Toggles<string> label={tt("Segment", "Segment")} value={sel} onChange={pick} options={rows.map((r) => ({ id: r.id, label: r.name }))} />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Role zones", "Rollenzonen")}</p>
          <Toggles<"on" | "off">
            label={tt("Zones", "Zonen")}
            value={zones}
            onChange={(v) => {
              story.leave();
              setZones(v);
            }} options={[{ id: "on", label: tt("Show the role rule", "Rollenregel zeigen") }, { id: "off", label: tt("Hide", "Ausblenden") }]} />
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
  const costAt = (m: SalesModel, v: number) => (m === "partner" ? v * (SALES_MODELS.partner.share / 100) : SALES_MODELS[m].cost);
  const passAt = (v: number) => MODELS.filter((m) => (costAt(m, v) / v) * 100 <= COST_SHARE_MAX).map((m) => SALES_MODELS[m].name).join(", ");
  const story = useStory([
    {
      title: tt("A big contract can pay for a person", "Ein großer Vertrag kann eine Person bezahlen"),
      say: tt(
        `Nordhafen IT, an example company, uses a simple rule: winning a contract may cost at most ${COST_SHARE_MAX}% of what the contract brings in its first year. A big contract of ${euro(75000)} can easily pay for a personal key account team (${euro(costAt("key", 75000))}).`,
        `Nordhafen IT, ein Beispielunternehmen, nutzt eine einfache Regel: Einen Vertrag zu gewinnen darf höchstens ${COST_SHARE_MAX} % dessen kosten, was der Vertrag im ersten Jahr bringt. Ein großer Vertrag über ${euro(75000)} kann locker ein persönliches Key-Account-Team bezahlen (${euro(costAt("key", 75000))}).`,
      ),
      look: tt("all bars end left of the dashed line.", "alle Balken enden links der gestrichelten Linie."),
      apply: () => setAcv(75000),
    },
    {
      title: tt("A small contract cannot", "Ein kleiner Vertrag kann das nicht"),
      say: tt(
        `A small contract of ${euro(10000)} cannot: one visit by a seller (${euro(costAt("field", 10000))}) would eat the whole contract. Only these stay under the line: ${passAt(10000)}.`,
        `Ein kleiner Vertrag über ${euro(10000)} kann das nicht: Ein Besuch des Außendienstes (${euro(costAt("field", 10000))}) würde den ganzen Vertrag auffressen. Nur diese bleiben unter der Linie: ${passAt(10000)}.`,
      ),
      look: tt("the striped bars cross the dashed line.", "die schraffierten Balken überschreiten die gestrichelte Linie."),
      apply: () => setAcv(10000),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(
        "The size of the contract decides how you can afford to sell. Big contracts: a person who visits. Small contracts: by phone, online or through partners, with a standard offer.",
        "Die Größe des Vertrags entscheidet, wie Sie sich den Verkauf leisten können. Große Verträge: eine Person, die besucht. Kleine Verträge: per Telefon, online oder über Partner, mit einem Standardangebot.",
      ),
      look: tt("move the slider below and watch the bars cross the line.", "bewegen Sie den Regler unten und sehen Sie, wie die Balken die Linie kreuzen."),
      apply: () => setAcv(10000),
    },
  ]);
  const pickAcv = (v: number) => {
    story.leave();
    setAcv(v);
  };
  return (
    <div className="space-y-3">
      <ThePoint>
        {tt(
          "How you sell must fit what a contract is worth. A big contract can pay for a personal visit; a small one can only pay for selling by phone, online or through partners.",
          "Wie Sie verkaufen, muss zu dem passen, was ein Vertrag wert ist. Ein großer Vertrag kann einen persönlichen Besuch bezahlen; ein kleiner nur den Verkauf per Telefon, online oder über Partner.",
        )}
      </ThePoint>
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
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="space-y-1.5">
        <label htmlFor={`${uid}-acv`} className="smallcaps block">
          {tt(`First-year contract value of one deal: ${euro(acv)}`, `Erstjahres-Vertragswert eines Deals: ${euro(acv)}`)}
        </label>
        <input id={`${uid}-acv`} type="range" min={5000} max={100000} step={5000} value={acv} onChange={(e) => pickAcv(Number(e.target.value))} className="range-accent" />
        <Toggles<string> label={tt("Presets", "Voreinstellungen")} value={String(acv)} onChange={(v) => pickAcv(Number(v))} options={[10000, 30000, 75000].map((v) => ({ id: String(v), label: euro(v) }))} />
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
  const cycle = (id: string) => {
    story.leave();
    setGrid((g) => ({ ...g, [id]: LEVEL_IDS[(LEVEL_IDS.indexOf(g[id]) + 1) % 3] }));
  };
  const s = T_SEGS[seg];
  const margin = s.acv * (s.margin / 100);
  const limit = margin * (TAILOR_SHARE_MAX / 100);
  const cost = T_ELEMENTS.reduce((sum, e) => sum + LEVEL_COST[grid[e.id]], 0);
  const X = (v: number) => 20 + (Math.min(v, 14000) / 14000) * 520;
  const platformBad = grid.platform !== "std";
  const G0: Record<string, Level> = { platform: "std", contract: "ind", onboarding: "mod", pricing: "std", content: "mod" };
  const G1: Record<string, Level> = { ...G0, contract: "mod" };
  const costOf = (g: Record<string, Level>) => T_ELEMENTS.reduce((sum, e) => sum + LEVEL_COST[g[e.id]], 0);
  const limitOf = (k: "hosp" | "law") => T_SEGS[k].acv * (T_SEGS[k].margin / 100) * (TAILOR_SHARE_MAX / 100);
  const story = useStory([
    {
      title: tt("A big customer can carry extras", "Ein großer Kunde trägt Extras"),
      say: tt(
        `Nordhafen IT, an example company, decides for each part of its offer: the same for all, pick from ready blocks, or made just for this customer (the most expensive). A hospital brings a lot of profit, so extras may cost up to ${euro(limitOf("hosp"))} a year. This mix costs ${euro(costOf(G0))}: it fits.`,
        `Nordhafen IT, ein Beispielunternehmen, entscheidet für jeden Teil seines Angebots: für alle gleich, aus fertigen Bausteinen wählen oder nur für diesen Kunden gemacht (am teuersten). Ein Krankenhaus bringt viel Gewinn, also dürfen Extras bis zu ${euro(limitOf("hosp"))} im Jahr kosten. Diese Mischung kostet ${euro(costOf(G0))}: Sie passt.`,
      ),
      look: tt("the bar ends before the limit line.", "der Balken endet vor der Grenzlinie."),
      apply: () => {
        setSeg("hosp");
        setGrid(G0);
      },
    },
    {
      title: tt("A small customer cannot", "Ein kleiner Kunde kann das nicht"),
      say: tt(
        `A law firm brings far less, so extras may cost only ${euro(limitOf("law"))}. The same mix costs ${euro(costOf(G0))}: far too much. The one part made just for them (the contract) breaks it.`,
        `Eine Kanzlei bringt viel weniger, also dürfen Extras nur ${euro(limitOf("law"))} kosten. Dieselbe Mischung kostet ${euro(costOf(G0))}: viel zu viel. Der eine Teil, der nur für sie gemacht ist (der Vertrag), sprengt es.`,
      ),
      look: tt("the striped part is over the limit.", "der schraffierte Teil liegt über der Grenze."),
      apply: () => {
        setSeg("law");
        setGrid(G0);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(
        `Make the contract a ready block instead: now it costs ${euro(costOf(G1))} and fits. The point: the smaller the customer, the more of the offer must be the same for everyone. Make things just for one customer only where the customer is big.`,
        `Machen Sie den Vertrag stattdessen zu einem fertigen Baustein: Jetzt kostet es ${euro(costOf(G1))} und passt. Das Wichtigste: Je kleiner der Kunde, desto mehr vom Angebot muss für alle gleich sein. Machen Sie nur bei großen Kunden etwas eigens für einen Kunden.`,
      ),
      look: tt("the contract row now says Modular, and the bar fits.", "die Vertragszeile zeigt jetzt Modular, und der Balken passt."),
      apply: () => {
        setSeg("law");
        setGrid(G1);
      },
    },
  ]);
  return (
    <div className="space-y-3">
      <ThePoint>
        {tt(
          "Making a part of the offer just for one customer costs money every year. Big customers can carry that; small customers need an offer that is mostly the same for everyone.",
          "Einen Teil des Angebots nur für einen Kunden zu machen, kostet jedes Jahr Geld. Große Kunden können das tragen; kleine Kunden brauchen ein Angebot, das größtenteils für alle gleich ist.",
        )}
      </ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
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
        <Toggles<"hosp" | "law">
          label={tt("Segment", "Segment")}
          value={seg}
          onChange={(v) => {
            story.leave();
            setSeg(v);
          }} options={[{ id: "hosp", label: `${T_SEGS.hosp.name} · ${euro(T_SEGS.hosp.acv)}` }, { id: "law", label: `${T_SEGS.law.name} · ${euro(T_SEGS.law.acv)}` }]} />
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
  const k = (v: number) => euro(v * 1000);
  const story = useStory([
    {
      title: tt("Go all in: best if you are right", "Alles setzen: am besten, wenn Sie recht haben"),
      say: tt(
        `Nordhafen IT, an example company, must decide before it knows how big a new customer group really is. Going all in earns the most if the group is as big as hoped: ${k(PAY.focus[0])}. But if it is only half as big, it earns just ${k(PAY.focus[2])}.`,
        `Nordhafen IT, ein Beispielunternehmen, muss entscheiden, bevor es weiß, wie groß eine neue Kundengruppe wirklich ist. Alles zu setzen bringt am meisten, wenn die Gruppe so groß ist wie erhofft: ${k(PAY.focus[0])}. Ist sie aber nur halb so groß, bringt es nur ${k(PAY.focus[2])}.`,
      ),
      look: tt("the first row of the table.", "die erste Zeile der Tabelle."),
      apply: () => {
        setView("net");
        setQ(40);
      },
    },
    {
      title: tt("Step by step: never far off", "Schritt für Schritt: nie weit daneben"),
      say: tt(
        `Going step by step earns a bit less in the best case (${k(PAY.stage[0])}) but never falls far: at worst ${k(PAY.stage[2])}. Waiting looks safe, but it earns the least whenever the group is real (${k(PAY.wait[0])}).`,
        `Schritt für Schritt bringt im besten Fall etwas weniger (${k(PAY.stage[0])}), fällt aber nie tief: im schlechtesten Fall ${k(PAY.stage[2])}. Warten wirkt sicher, bringt aber am wenigsten, wann immer die Gruppe echt ist (${k(PAY.wait[0])}).`,
      ),
      look: tt("compare the middle row with the other two.", "vergleichen Sie die mittlere Zeile mit den anderen beiden."),
      apply: () => {
        setView("net");
        setQ(40);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(
        "When you are not sure, do not wait and do not bet everything. Decide now, start small, and agree in advance on a number and a date at which you check whether to go further.",
        "Wenn Sie unsicher sind, warten Sie nicht und setzen Sie nicht alles. Entscheiden Sie jetzt, starten Sie klein und vereinbaren Sie vorher eine Zahl und ein Datum, an dem Sie prüfen, ob Sie weitergehen.",
      ),
      look: tt("“Regret” shows how much each choice could miss; step by step misses least.", "„Bedauern“ zeigt, wie viel jede Wahl verpassen könnte; Schritt für Schritt verpasst am wenigsten."),
      apply: () => {
        setView("regret");
        setQ(40);
      },
    },
  ]);
  return (
    <div className="space-y-3">
      <ThePoint>
        {tt(
          "When the data is incomplete, waiting is also a decision, and usually a costly one. Decide now, go step by step, and set a clear point at which you check.",
          "Wenn die Daten unvollständig sind, ist Warten auch eine Entscheidung, meist eine teure. Entscheiden Sie jetzt, gehen Sie Schritt für Schritt und legen Sie einen klaren Prüfpunkt fest.",
        )}
      </ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
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
          <Toggles<"net" | "regret">
            label={tt("View", "Ansicht")}
            value={view}
            onChange={(v) => {
              story.leave();
              setView(v);
            }} options={[{ id: "net", label: tt("Result (€k)", "Ergebnis (T€)") }, { id: "regret", label: tt("Regret (€k)", "Bedauern (T€)") }]} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={`${uid}-q`} className="smallcaps block">
            {tt(`Your estimate: chance the segment is smaller than assumed · ${q}%`, `Ihre Schätzung: Wahrscheinlichkeit, dass das Segment kleiner ist als angenommen · ${q} %`)}
          </label>
          <input id={`${uid}-q`} type="range" min={0} max={100} step={10} value={q} onChange={(e) => { story.leave(); setQ(Number(e.target.value)); }} className="range-accent" />
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
  const story = useStory([
    {
      title: tt("First: measure where you start", "Zuerst: messen, wo Sie starten"),
      say: tt(
        "Nordhafen IT, an example company, puts four projects on a six-month plan. The first one, in month 1, simply records which customer is in which group. Without it, nobody could later see whether anything worked.",
        "Nordhafen IT, ein Beispielunternehmen, legt vier Projekte auf einen Sechsmonatsplan. Das erste, in Monat 1, hält einfach fest, welcher Kunde in welcher Gruppe ist. Ohne das könnte später niemand sehen, ob etwas gewirkt hat.",
      ),
      look: tt("the top row starts in M1.", "die oberste Zeile startet in M1."),
      apply: () => setSel("data"),
    },
    {
      title: tt("Then: in the order they need each other", "Dann: in der Reihenfolge, in der sie einander brauchen"),
      say: tt(
        "The new key account manager for hospitals starts in month 3, after the evidence pack for hospitals is ready, so she can sell with it from her first day.",
        "Die neue Key Account Managerin für Kliniken startet in Monat 3, nachdem das Nachweispaket für Kliniken fertig ist, damit sie vom ersten Tag an damit verkaufen kann.",
      ),
      look: tt("the bottom row starts later than the pack above it.", "die unterste Zeile startet später als das Paket darüber."),
      apply: () => setSel("kam"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt(
        "A plan is more than a list: start with what the others need, give each project one person in charge, and set a check with a number and a date (“if the hospital win rate is below 22% in month 5, review”).",
        "Ein Plan ist mehr als eine Liste: Beginnen Sie mit dem, was die anderen brauchen, geben Sie jedem Projekt eine verantwortliche Person und legen Sie eine Prüfung mit Zahl und Datum fest („liegt die Win Rate bei Kliniken in Monat 5 unter 22 %, überprüfen“).",
      ),
      look: tt("the box below: owner and trigger of the selected project.", "das Feld unten: Owner und Trigger des gewählten Projekts."),
      apply: () => setSel("kam"),
    },
  ]);
  const pick = (id: string) => {
    story.leave();
    setSel(id);
  };
  return (
    <div className="space-y-3">
      <ThePoint>
        {tt(
          "A good plan says what starts first, who is in charge of each part, and when you check whether it works. Start with the part the others depend on.",
          "Ein guter Plan sagt, was zuerst startet, wer für jeden Teil verantwortlich ist und wann Sie prüfen, ob es wirkt. Beginnen Sie mit dem Teil, von dem die anderen abhängen.",
        )}
      </ThePoint>
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
            <g key={a.id} className="hit" role="button" tabIndex={0} aria-label={a.name} onClick={() => pick(a.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(a.id)}>
              <text x="4" y={y + 22} fontSize="12" fontWeight={on ? 800 : 600} fill={C.ink}>{a.name.length > 28 ? `${a.name.slice(0, 27)}…` : a.name}</text>
              {[1, 2, 3, 4, 5, 6].map((m) => (
                <rect key={m} className={m === a.start ? "hit-shape" : undefined} x={X(m) + 2} y={y + 6} width="56" height="24" rx="3" fill={m === a.start ? C.data : m > a.start ? C.tealSoft : C.paper} stroke={on && m === a.start ? C.amber : C.line} strokeWidth={on && m === a.start ? 2.5 : 1} />
              ))}
            </g>
          );
        })}
        <text x="4" y="204" fontSize="11.5" fill={C.ash}>{tt("dark = start month · pale = running", "dunkel = Startmonat · hell = läuft")}</text>
      </svg>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one item", "Einen Punkt lesen")}</p>
        <Toggles<string> label={tt("Item", "Punkt")} value={sel} onChange={pick} options={N_ARCH.map((a) => ({ id: a.id, label: a.name }))} />
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
