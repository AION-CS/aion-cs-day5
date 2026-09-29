"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import {
  ARCH,
  ARCH_BY_ID,
  ARCH_IDS,
  BASELINE_ITEM,
  BOARD_CHALLENGE,
  CANDIDATES,
  CAND_BY_ID,
  CAND_IDS,
  CONF_LABEL,
  CORE_COUNT,
  COST_SHARE_MAX,
  CRITERIA,
  CRIT_IDS,
  DECISIONS,
  ELEMENTS,
  ELEMENT_IDS,
  KPIS,
  LEVELS,
  LEVEL_COST,
  MODEL_IDS,
  OWNERS,
  OWNER_IDS,
  POOL_HIGH,
  POOL_MID,
  R2_BASELINE_NOTE,
  R2_BUDGET,
  R2_MONTHS,
  ROLES,
  ROLE_IDS,
  SALES_MODELS,
  TAILOR_SHARE_MAX,
  costPerDeal,
  marginPerAccount,
  poolOf,
  tailorLimit,
} from "@/data/route2";
import type { ArchId, CandId, CritId, DecisionId, ElementId, KpiId, Level, OwnerId, Role, SalesModel } from "@/data/route2";
import { archCost, archLeft, archOver, costShare, coreIds, critsHold, deprioFunded, funded, gridFlagsOf, rateHolds, roleFlagsOf, salesFlagsOf, seqRules, servedIds, tailorCost, tripFlagsOf } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, pct, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { assumptionGuide, challengeGuide, critTextGuide, postponedGuide, propGuide, triggerGuide } from "@/lib/mentorGuide";
import { critKey, decisionKey, gridKey, ownerKey, rateKey, salesKey, tripKey } from "@/lib/answerKey";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

const MONTHS_LIST = Array.from({ length: R2_MONTHS }, (_, i) => i + 1);
const BUCKET = () => ["", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")];

/* ------------------------------------------------------------------ Block 3.1 */

export function Block31() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (c: CritId) => patch((s) => ({ crits: s.crits.includes(c) ? s.crits.filter((x) => x !== c) : [...s.crits, c], critFlagged: false }));
  const check = () => patch((s) => ({ checks: s.checks + 1, critFlagged: !(critsHold(s).pool && critsHold(s).win), critClue: false }));
  const h = critsHold(r2);
  return (
    <AnswerBlock
      id="block-3-1"
      title={tt("Block 3.1 · Criteria for segment prioritisation", "Block 3.1 · Kriterien für die Segmentpriorisierung")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.1"]}
      core={false}
      findIt={tt("Route 2 → Task 2 → the six criteria below. Answer by choosing three and saying what each measures.", "Route 2 → Task 2 → die sechs Kriterien unten. Antworten Sie, indem Sie drei wählen und sagen, was jedes misst.")}
    >
      <MaterialRefs refs={["B1"]} />
      <div id={IDS.critPick} className={clsx("space-y-2 rounded-lg p-1", r2.critFlagged && "is-flagged")}>
        <p className="text-body text-ink">
          <Gloss>{tt("Choose the three criteria you will rank DataCloud's candidate segments by. The ranking in Block 3.2 uses two axes; your three criteria must cover both.", "Wählen Sie die drei Kriterien, nach denen Sie die Kandidatensegmente von DataCloud ordnen. Die Rangfolge in Block 3.2 nutzt zwei Achsen; Ihre drei Kriterien müssen beide abdecken.")}</Gloss>
        </p>
        <OptionList<CritId>
          multi
          cols={2}
          label={tt("Prioritisation criteria", "Priorisierungskriterien")}
          value={r2.crits}
          onChange={toggle}
          disabledIds={r2.crits.length >= 3 ? CRIT_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.critPick, "warn")}
          options={CRIT_IDS.map((c) => ({ id: c, label: CRITERIA[c].name, sub: CRITERIA[c].means }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.crits.length} of 3 chosen.`, `${r2.crits.length} von 3 gewählt.`)}
          {r2.crits.length >= 3 ? tt(" To choose another, first remove one.", " Um ein anderes zu wählen, entfernen Sie zuerst eines.") : ""}
        </p>
        {r2.critFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
            {tt(`${[h.pool, h.win].filter(Boolean).length} of the 2 axes of the matrix are covered by your three. `, `${[h.pool, h.win].filter(Boolean).length} der 2 Achsen der Matrix sind durch Ihre drei abgedeckt. `)}
            {r2.critClue ? (
              tt("Which criterion tells you how much profit a segment holds, and which tells you whether DataCloud can win it?", "Welches Kriterium sagt, wie viel Gewinn ein Segment enthält, und welches, ob DataCloud es gewinnen kann?")
            ) : (
              <button type="button" onClick={() => patch({ critClue: true })} className="btn-ghost btn-sm border-gold">
                {tt("Show clue", "Hinweis zeigen")}
              </button>
            )}
          </p>
        )}
      </div>
      {r2.crits.map((c) => (
        <div key={c} className="space-y-1.5">
          <TextBox
            id={IDS.crit(c)}
            label={tt(`${CRITERIA[c].name} for DataCloud`, `${CRITERIA[c].name} für DataCloud`)}
            help={tt("One or two sentences: what this criterion measures for a DataCloud segment, and why it belongs in the ranking.", "Ein oder zwei Sätze: was dieses Kriterium für ein Segment von DataCloud misst, und warum es in die Rangfolge gehört.")}
            value={r2.critText[c] ?? ""}
            onChange={(v) => patch((s) => ({ critText: { ...s.critText, [c]: v } }))}
            min={MIN_LINE}
            rows={2}
          />
          <ExampleAnswer id={`crit-${c}-example`} guide={critTextGuide(c)} />
          {mentor && <MentorGuide guide={critTextGuide(c)} />}
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my criteria", "Meine Kriterien prüfen")} checks={r2.checks} />
      <AnswerKey block={critKey()} />
      <BlockMissing block="3.1" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.2 */

function RoleMatrix() {
  const r2 = useStore((s) => s.r2);
  const cellX = (b: number) => 70 + (b - 1) * 150;
  const cellY = (a: number) => 10 + (3 - a) * 62;
  const count: Record<string, number> = {};
  const rated = CAND_IDS.filter((id) => r2.attract[id] && r2.ability[id]);
  return (
    <svg viewBox="0 0 540 230" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-labelledby="rm-t rm-d">
      <title id="rm-t">{tt("Your ratings of the five candidate segments", "Ihre Bewertungen der fünf Kandidatensegmente")}</title>
      <desc id="rm-d">{rated.map((id) => `${CAND_BY_ID[id].name}: ${BUCKET()[r2.attract[id]]} / ${BUCKET()[r2.ability[id]]}`).join(". ") || tt("Nothing rated yet.", "Noch nichts bewertet.")}</desc>
      {[3, 2, 1].map((a) => [1, 2, 3].map((b) => <rect key={`${a}${b}`} x={cellX(b)} y={cellY(a)} width="150" height="62" fill="#FFFEFA" stroke="#D8D1BF" />))}
      <text x="295" y="222" textAnchor="middle" fontSize="11.5" fill="#59606A">{tt("ability to win → Low · Mid · High", "Gewinnfähigkeit → Niedrig · Mittel · Hoch")}</text>
      <text x="22" y="100" textAnchor="middle" fontSize="11.5" fill="#59606A" transform="rotate(-90 22 100)">{tt("attractiveness →", "Attraktivität →")}</text>
      {rated.map((id) => {
        const a = r2.attract[id];
        const b = r2.ability[id];
        const k = `${a}${b}`;
        const n = (count[k] = (count[k] ?? 0) + 1);
        const x = cellX(b) + 22 + (n - 1) * 36;
        const y = cellY(a) + 34;
        const role = r2.roles[id];
        return (
          <g key={id}>
            <circle cx={x} cy={y} r="15" fill={role === "core" ? "#DFEEEB" : role === "deprio" ? "#FFFEFA" : "#ECE6D6"} stroke="#1F2328" strokeWidth="1.6" strokeDasharray={role === "deprio" ? "4 3" : undefined} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1F2328">{CAND_BY_ID[id].name.slice(0, 3)}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Block32() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const setRate = (k: "attract" | "ability", id: CandId, v: Score) => patch((s) => ({ [k]: { ...s[k], [id]: v }, rateResult: null, roleFlags: [] }) as Partial<typeof s>);
  const setRole = (id: CandId, v: Role) => patch((s) => ({ roles: { ...s.roles, [id]: v }, roleFlags: s.roleFlags.filter((x) => x !== id) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, rateResult: rateHolds(s), roleFlags: roleFlagsOf(s), rateClue: false }));
  const cores = coreIds(r2);
  return (
    <AnswerBlock
      id="block-3-2"
      title={tt("Block 3.2 · Rate five candidate segments and name your core segments", "Block 3.2 · Fünf Kandidatensegmente bewerten und Ihre Kernsegmente benennen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.2"]}
      core={true}
      findIt={tt("Route 2 → Task 2 → the table “Five candidate segments” below. Answer in the five rating rows under it.", "Route 2 → Task 2 → die Tabelle „Fünf Kandidatensegmente“ unten. Antworten Sie in den fünf Bewertungszeilen darunter.")}
    >
      <MaterialRefs refs={["B1"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Rate each segment on attractiveness (from its profit pool) and on the ability to win (from DataCloud's win rate there), using the bands in Materi B1. Then give each segment a role. Two segments at most can be core.",
            "Bewerten Sie jedes Segment nach Attraktivität (aus seinem Profit Pool) und nach Gewinnfähigkeit (aus der Win Rate von DataCloud dort), mit den Bändern aus Materi B1. Geben Sie dann jedem Segment eine Rolle. Höchstens zwei Segmente können Kernsegmente sein.",
          )}
        </Gloss>
      </p>
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[44rem] border-collapse text-caption">
          <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Five candidate segments · DataCloud's market data (Case assumption)", "Fünf Kandidatensegmente · Marktdaten von DataCloud (Fallannahme)")}</caption>
          <thead>
            <tr className="text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Segment", "Segment")}</th>
              <th className="px-3 py-2 text-right">{tt("Accounts", "Accounts")}</th>
              <th className="px-3 py-2 text-right">{tt("Avg. contract", "Ø Vertrag")}</th>
              <th className="px-3 py-2 text-right">{tt("Margin", "Marge")}</th>
              <th className="px-3 py-2 text-right">{tt("Profit pool", "Profit Pool")}</th>
              <th className="px-3 py-2 text-right">{tt("Win rate", "Win Rate")}</th>
              <th className="px-3 py-2 text-right">{tt("Growth", "Wachstum")}</th>
              <th className="px-3 py-2">{tt("Data confidence", "Datenvertrauen")}</th>
            </tr>
          </thead>
          <tbody>
            {CANDIDATES.map((c) => (
              <tr key={c.id} id={`cand-${c.id}`} className="border-t border-line align-top">
                <td className="px-3 py-2">
                  <span className="font-semibold">{c.name}</span>
                  <br />
                  <span className="text-ash">{c.who}</span>
                </td>
                <td className="tnum px-3 py-2 text-right">{num(c.accounts)}</td>
                <td className="tnum px-3 py-2 text-right">{euro(c.acv)}</td>
                <td className="tnum px-3 py-2 text-right">{pct(c.margin)}</td>
                <td className="tnum px-3 py-2 text-right font-semibold">{euro(poolOf(c.id))}</td>
                <td className="tnum px-3 py-2 text-right font-semibold">{pct(c.winRate)}</td>
                <td className="tnum px-3 py-2 text-right">{pct(c.growth)}</td>
                <td className="px-3 py-2">
                  {CONF_LABEL[c.confidence]}
                  <br />
                  <span className="text-ash">{c.confidenceWhy}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-caption text-ash">
        {tt(
          `Profit pool = accounts × average contract value × margin, already worked out in the table. Bands (Materi B1): profit pool ${euro(POOL_HIGH)} or more High, ${euro(POOL_MID)} or more Mid; win rate 20% or more High, 10% or more Mid.`,
          `Profit Pool = Accounts × durchschnittlicher Vertrag × Marge, in der Tabelle schon ausgerechnet. Bänder (Materi B1): Profit Pool ${euro(POOL_HIGH)} oder mehr Hoch, ${euro(POOL_MID)} oder mehr Mittel; Win Rate 20 % oder mehr Hoch, 10 % oder mehr Mittel.`,
        )}
      </p>
      <div className="space-y-3">
        {CAND_IDS.map((id) => {
          const c = CAND_BY_ID[id];
          const flagged = r2.roleFlags.includes(id);
          return (
            <div key={id} id={IDS.rate(id)} className={clsx("space-y-2 rounded-lg border border-line bg-paper p-3", flagged && "is-flagged")}>
              <p className="font-semibold text-ink">{c.name}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="smallcaps">{tt("Attractiveness", "Attraktivität")}</p>
                  <ScorePick label={tt(`Attractiveness of ${c.name}`, `Attraktivität von ${c.name}`)} value={r2.attract[id] || 0} onChange={(v) => setRate("attract", id, v)} />
                </div>
                <div>
                  <p className="smallcaps">{tt("Ability to win", "Gewinnfähigkeit")}</p>
                  <ScorePick label={tt(`Ability to win in ${c.name}`, `Gewinnfähigkeit in ${c.name}`)} value={r2.ability[id] || 0} onChange={(v) => setRate("ability", id, v)} />
                </div>
              </div>
              <div>
                <p className="smallcaps">{tt("Role", "Rolle")}</p>
                <OptionList<Role> label={tt(`Role of ${c.name}`, `Rolle von ${c.name}`)} value={r2.roles[id] ?? null} onChange={(v) => setRole(id, v)} options={ROLE_IDS.map((r) => ({ id: r, label: ROLES[r].label, sub: ROLES[r].sub }))} />
              </div>
              {flagged && (
                <p className="text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt("Read your own two ratings for this segment against the role rule in Materi B1: which one decides first, a Low on either axis, or a High attractiveness?", "Lesen Sie Ihre beiden Bewertungen für dieses Segment gegen die Rollenregel in Materi B1: Was entscheidet zuerst, ein Niedrig auf einer Achse oder eine hohe Attraktivität?")}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="space-y-1">
        <p className="smallcaps">{tt("Your segments on the matrix (from your own ratings)", "Ihre Segmente in der Matrix (aus Ihren eigenen Bewertungen)")}</p>
        <RoleMatrix />
        <p className="text-caption text-ash" aria-live="polite">
          {tt(`Core segments you named: ${cores.map((id) => CAND_BY_ID[id].name).join(", ") || "none yet"}.`, `Von Ihnen benannte Kernsegmente: ${cores.map((id) => CAND_BY_ID[id].name).join(", ") || "noch keine"}.`)}
          {cores.length > CORE_COUNT ? tt(` That is ${cores.length}: focus means at most ${CORE_COUNT}.`, ` Das sind ${cores.length}: Fokus heißt höchstens ${CORE_COUNT}.`) : ""}
          {tt(" Teal circle = core, grey = serve standard, dashed = deprioritise.", " Türkiser Kreis = Kern, grau = standardisiert, gestrichelt = zurückgestellt.")}
        </p>
      </div>
      <CheckBar onCheck={check} checkLabel={tt("Check my ratings and roles", "Meine Bewertungen und Rollen prüfen")} checks={r2.checks} clueShown={r2.rateClue} onClue={() => patch({ rateClue: true })} />
      {r2.rateResult && (
        <Reading>
          {tt(`${r2.rateResult.holds} of ${r2.rateResult.total} ratings follow the printed data by the bands of Materi B1. A check never says which. `, `${r2.rateResult.holds} von ${r2.rateResult.total} Bewertungen folgen den gedruckten Daten nach den Bändern aus Materi B1. Eine Prüfung sagt nie, welche. `)}
          {r2.roleFlags.length > 0 ? tt(`${r2.roleFlags.length} role${r2.roleFlags.length === 1 ? " does" : "s do"} not follow your own ratings and ${r2.roleFlags.length === 1 ? "is" : "are"} outlined.`, `${r2.roleFlags.length} ${r2.roleFlags.length === 1 ? "Rolle folgt" : "Rollen folgen"} nicht Ihren eigenen Bewertungen und ${r2.roleFlags.length === 1 ? "ist" : "sind"} markiert.`) : tt("Every role you gave follows your own ratings.", "Jede vergebene Rolle folgt Ihren eigenen Bewertungen.")}
          {r2.rateClue ? tt(" Clue: compare each profit pool with the two band limits, then each win rate with 20% and 10%.", " Hinweis: Vergleichen Sie jeden Profit Pool mit den zwei Bandgrenzen, dann jede Win Rate mit 20 % und 10 %.") : ""}
        </Reading>
      )}
      <AnswerKey block={rateKey()} />
      <BlockMissing block="3.2" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.3 */

export function Block33() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const served = servedIds(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, salesFlags: salesFlagsOf(s), salesClue: false }));
  return (
    <AnswerBlock
      id="block-3-3"
      title={tt("Block 3.3 · A sales strategy for each segment you serve", "Block 3.3 · Eine Vertriebsstrategie für jedes Segment, das Sie bedienen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.3"]}
      core={false}
      findIt={tt("Route 2 → Task 2 → the segments you marked core or serve standard in Block 3.2, and the five sales models in Materi B2. Answer in one card per segment.", "Route 2 → Task 2 → die Segmente, die Sie in Block 3.2 als Kern oder standardisiert markiert haben, und die fünf Vertriebsmodelle in Materi B2. Antworten Sie in einer Karte pro Segment.")}
    >
      <MaterialRefs refs={["B2"]} />
      {served.length === 0 && (
        <p className="rounded-md border border-line bg-mist/60 px-3 py-2 text-caption text-ink">
          {tt("No segment is marked core or serve standard in Block 3.2 yet, so there is nothing to plan here. Nothing is blocked. ", "In Block 3.2 ist noch kein Segment als Kern oder standardisiert markiert, daher gibt es hier nichts zu planen. Nichts ist gesperrt. ")}
          <button type="button" onClick={() => scrollToAndFlash("block-3-2", "ref", "start")} className="font-semibold underline decoration-dotted underline-offset-2">
            {tt("Go to Block 3.2", "Zu Block 3.2")}
          </button>
        </p>
      )}
      {served.map((id) => {
        const c = CAND_BY_ID[id];
        const m = r2.sales[id];
        const share = costShare(id, r2);
        const flagged = r2.salesFlags.includes(id);
        return (
          <div key={id} id={IDS.sales(id)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", flagged && "is-flagged")}>
            <p className="font-semibold text-ink">
              {c.name} <span className="font-normal text-ash">· {ROLES[r2.roles[id]!].label} · {tt("average contract", "Ø Vertrag")} {euro(c.acv)} · {c.decides}</span>
            </p>
            <div>
              <p className="smallcaps">{tt("Sales model", "Vertriebsmodell")}</p>
              <OptionList<SalesModel>
                cols={2}
                label={tt(`Sales model for ${c.name}`, `Vertriebsmodell für ${c.name}`)}
                value={m ?? null}
                onChange={(v) => patch((s) => ({ sales: { ...s.sales, [id]: v }, salesFlags: s.salesFlags.filter((x) => x !== id) }))}
                options={MODEL_IDS.map((x) => ({ id: x, label: `${SALES_MODELS[x].name} · ${x === "partner" ? tt(`${SALES_MODELS.partner.share}% of the contract`, `${SALES_MODELS.partner.share} % des Vertrags`) : euro(SALES_MODELS[x].cost)}`, sub: SALES_MODELS[x].fits }))}
              />
              <p className="mt-1 text-caption text-ash" aria-live="polite">
                {m && share !== null
                  ? tt(`Cost per won deal ${euro(costPerDeal(m, c.acv))} = ${num(Math.round(share))}% of the contract value (limit ${COST_SHARE_MAX}%).`, `Kosten pro gewonnenem Deal ${euro(costPerDeal(m, c.acv))} = ${num(Math.round(share))} % des Vertragswerts (Grenze ${COST_SHARE_MAX} %).`)
                  : tt("Choose a model to see what it costs against this segment's contracts.", "Wählen Sie ein Modell, um zu sehen, was es gegen die Verträge dieses Segments kostet.")}
              </p>
              {flagged && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt("Check both rules of Materi B2: can this segment's contract carry the cost, and does the model match how the segment decides (its decision is printed after the contract value)?", "Prüfen Sie beide Regeln aus Materi B2: Kann der Vertrag dieses Segments die Kosten tragen, und passt das Modell dazu, wie das Segment entscheidet (die Entscheidung steht hinter dem Vertragswert)?")}
                </p>
              )}
            </div>
            <TextBox
              id={`${IDS.sales(id)}-prop`}
              label={tt("Value proposition", "Nutzenversprechen")}
              help={tt(`One or two sentences to a buyer in this segment: their need and what DataCloud does about it, in their words. At least ${MIN_SENTENCE} characters.`, `Ein oder zwei Sätze an einen Käufer in diesem Segment: sein Bedarf und was DataCloud dagegen tut, in seinen Worten. Mindestens ${MIN_SENTENCE} Zeichen.`)}
              value={r2.prop[id] ?? ""}
              onChange={(v) => patch((s) => ({ prop: { ...s.prop, [id]: v } }))}
              min={MIN_SENTENCE}
              rows={2}
            />
            <ExampleAnswer id={`prop-${id}-example`} guide={propGuide(id)} />
            {mentor && <MentorGuide guide={propGuide(id)} />}
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my sales models", "Meine Vertriebsmodelle prüfen")} checks={r2.checks} />
      {r2.checks > 0 && served.length > 0 && (
        <Reading>
          {r2.salesFlags.length === 0
            ? tt("Every sales model you chose passes both rules of Materi B2. The value propositions are your judgement.", "Jedes gewählte Vertriebsmodell besteht beide Regeln aus Materi B2. Die Nutzenversprechen sind Ihr Urteil.")
            : tt(`${r2.salesFlags.length} sales model${r2.salesFlags.length === 1 ? " does" : "s do"} not pass both rules and ${r2.salesFlags.length === 1 ? "is" : "are"} outlined.`, `${r2.salesFlags.length} ${r2.salesFlags.length === 1 ? "Vertriebsmodell besteht" : "Vertriebsmodelle bestehen"} nicht beide Regeln und ${r2.salesFlags.length === 1 ? "ist" : "sind"} markiert.`)}
        </Reading>
      )}
      <AnswerKey block={salesKey()} />
      <BlockMissing block="3.3" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.4 */

const NEXT: Record<string, Level> = { "": "std", std: "mod", mod: "ind", ind: "std" };

export function Block34() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const served = servedIds(r2);
  const flags = r2.gridFlags;
  const cycle = (id: CandId, el: ElementId) => patch((s) => ({ grid: { ...s.grid, [`${id}.${el}`]: NEXT[s.grid[`${id}.${el}`] ?? ""] }, gridFlags: [], gridResult: null }));
  const check = () =>
    patch((s) => {
      const f = gridFlagsOf(s);
      const total = servedIds(s).length * 3;
      return { checks: s.checks + 1, gridFlags: f, gridResult: { holds: total - f.length, total }, gridClue: false };
    });
  return (
    <AnswerBlock
      id="block-3-4"
      title={tt("Block 3.4 · Standardise or individualise, element by element", "Block 3.4 · Standardisieren oder individualisieren, Element für Element")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.4"]}
      core={false}
      findIt={tt("Route 2 → Task 2 → the grid below: one column per segment you serve, one row per offer element. Answer by setting every cell.", "Route 2 → Task 2 → das Raster unten: eine Spalte pro bedientem Segment, eine Zeile pro Angebotselement. Antworten Sie, indem Sie jede Zelle setzen.")}
    >
      <MaterialRefs refs={["B3"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            `Click a cell to cycle through standard (○), modular (◐) and individual (●). Modular costs ${euro(LEVEL_COST.mod)} per account and year, individual ${euro(LEVEL_COST.ind)}. The last row shows each column's tailoring cost against what the segment's margin can carry (${TAILOR_SHARE_MAX}% of the gross margin per account).`,
            `Klicken Sie auf eine Zelle, um zwischen Standard (○), modular (◐) und individuell (●) zu wechseln. Modular kostet ${euro(LEVEL_COST.mod)} pro Account und Jahr, individuell ${euro(LEVEL_COST.ind)}. Die letzte Zeile zeigt die Zuschnittkosten jeder Spalte gegen das, was die Marge des Segments tragen kann (${TAILOR_SHARE_MAX} % der Bruttomarge pro Account).`,
          )}
        </Gloss>
      </p>
      {served.length === 0 ? (
        <p className="rounded-md border border-line bg-mist/60 px-3 py-2 text-caption text-ink">
          {tt("No segment is marked core or serve standard in Block 3.2 yet. Nothing is blocked. ", "In Block 3.2 ist noch kein Segment als Kern oder standardisiert markiert. Nichts ist gesperrt. ")}
          <button type="button" onClick={() => scrollToAndFlash("block-3-2", "ref", "start")} className="font-semibold underline decoration-dotted underline-offset-2">
            {tt("Go to Block 3.2", "Zu Block 3.2")}
          </button>
        </p>
      ) : (
        <div id={IDS.grid} className="relative overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[34rem] border-collapse text-caption">
            <caption className="sr-only">{tt("Offer elements by segment", "Angebotselemente nach Segment")}</caption>
            <thead>
              <tr className="bg-mist text-left text-micro uppercase text-ash">
                <th className="px-3 py-2">{tt("Element", "Element")}</th>
                {served.map((id) => (
                  <th key={id} id={IDS.gridCol(id)} className="px-3 py-2">
                    {CAND_BY_ID[id].name}
                    <span className="block font-normal normal-case">{ROLES[r2.roles[id]!].label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ELEMENT_IDS.map((el) => (
                <tr key={el} className="border-t border-line">
                  <td className="px-3 py-2">
                    <span className="font-semibold">{ELEMENTS[el].name}</span>
                    <br />
                    <span className="text-ash">{ELEMENTS[el].sub}</span>
                  </td>
                  {served.map((id) => {
                    const v = r2.grid[`${id}.${el}`];
                    const bad = (el === "platform" && flags.includes(`${id}.platform`)) || (v === "ind" && flags.includes(`${id}.ind`));
                    return (
                      <td key={id} className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => cycle(id, el)}
                          className={clsx("btn-ghost btn-sm min-h-[40px] min-w-[7.5rem]", !v && "border-dashed text-ash", bad && "is-flagged")}
                          aria-label={tt(`${ELEMENTS[el].name} for ${CAND_BY_ID[id].name}: ${v ? LEVELS[v].label : "not set"}. Click to change.`, `${ELEMENTS[el].name} für ${CAND_BY_ID[id].name}: ${v ? LEVELS[v].label : "nicht gesetzt"}. Klicken zum Ändern.`)}
                        >
                          {v ? (
                            <>
                              <span aria-hidden>{LEVELS[v].glyph}</span> {LEVELS[v].label}
                            </>
                          ) : (
                            tt("? not set", "? nicht gesetzt")
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t-2 border-ink">
                <td className="px-3 py-2 font-semibold">{tt("Tailoring cost per account · limit", "Zuschnittkosten pro Account · Grenze")}</td>
                {served.map((id) => {
                  const cost = tailorCost(r2, id);
                  const lim = tailorLimit(id);
                  const over = cost > lim;
                  return (
                    <td key={id} className={clsx("tnum px-3 py-2", flags.includes(`${id}.cost`) && "is-flagged")}>
                      <span className={clsx("font-semibold", over && "text-accent")}>{euro(cost)}</span> · {euro(lim)}
                      <span className="block text-ash">{over ? tt(`${euro(cost - lim)} over`, `${euro(cost - lim)} darüber`) : tt(`${euro(lim - cost)} left`, `${euro(lim - cost)} frei`)}</span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {served.length > 0 && (
        <p className="text-caption text-ash">
          {tt("Margin per account: ", "Marge pro Account: ")}
          {served.map((id) => `${CAND_BY_ID[id].name} ${euro(marginPerAccount(id))}`).join(" · ")}.
        </p>
      )}
      <CheckBar onCheck={check} checkLabel={tt("Check my grid", "Mein Raster prüfen")} checks={r2.checks} clueShown={r2.gridClue} onClue={() => patch({ gridClue: true })} />
      {r2.gridResult && (
        <Reading>
          {tt(`${r2.gridResult.holds} of ${r2.gridResult.total} rule checks hold (per segment: the platform stays standard, no individual element for a segment served standard, the cost stays within the limit). Cells that break a rule are outlined.`, `${r2.gridResult.holds} von ${r2.gridResult.total} Regelprüfungen stimmen (pro Segment: Plattform bleibt Standard, kein individuelles Element für ein standardisiert bedientes Segment, Kosten innerhalb der Grenze). Zellen, die eine Regel brechen, sind markiert.`)}
          {r2.gridClue ? tt(" Clue: which element must every segment share, and where does each core segment's need really differ?", " Hinweis: Welches Element müssen alle Segmente teilen, und wo weicht der Bedarf jedes Kernsegments wirklich ab?") : ""}
        </Reading>
      )}
      <AnswerKey block={gridKey()} />
      <BlockMissing block="3.4" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.5 */

export function Block35() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const f = funded(r2);
  const over = archOver(r2);
  const rules = seqRules(r2);
  const dep = deprioFunded(r2);
  const setItem = (id: ArchId, p: Partial<{ alloc: boolean; start: number | null; owner: OwnerId | null; trigger: string }>) =>
    patch((s) => ({
      alloc: p.alloc !== undefined ? { ...s.alloc, [id]: p.alloc } : s.alloc,
      start: p.start !== undefined ? { ...s.start, [id]: p.start } : p.alloc === false ? { ...s.start, [id]: null } : s.start,
      owner: p.owner !== undefined ? { ...s.owner, [id]: p.owner } : s.owner,
      trigger: p.trigger !== undefined ? { ...s.trigger, [id]: p.trigger } : s.trigger,
      seqResult: null,
    }));
  const check = () =>
    patch((s) => {
      const r = seqRules(s);
      return { checks: s.checks + 1, seqResult: { holds: Number(r.baseline) + Number(r.budget) + Number(r.focus), total: 3 }, seqClue: false };
    });
  const base = r2.start[BASELINE_ITEM];
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const firstOther = others.length ? Math.min(...others.map((id) => r2.start[id] ?? 99)) : null;
  const notAllFunded = !ARCH_IDS.every((id) => r2.alloc[id]);
  const servesLabel = (id: ArchId) => {
    const s = ARCH_BY_ID[id].serves;
    return s === "all" ? tt("all segments", "alle Segmente") : s.map((c) => CAND_BY_ID[c].name).join(", ");
  };
  return (
    <AnswerBlock
      id="block-3-5"
      title={tt("Block 3.5 · The measures architecture: fund, sequence, own", "Block 3.5 · Die Maßnahmenarchitektur: finanzieren, ordnen, verantworten")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.5"]}
      core={true}
      findIt={tt(`Route 2 → Task 2 → the eight items below. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer in the item cards.`, `Route 2 → Task 2 → die acht Punkte unten. Das Budget beträgt ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate. Antworten Sie in den Karten der Punkte.`)}
    >
      <MaterialRefs refs={["B5"]} />
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="owner-help" label={tt("Show the owner test", "Owner-Test zeigen")} title={tt("The tests · taught in Materi B5", "Die Tests · aus Materi B5")}>
          <div className="space-y-2 text-caption text-ink">
            <ul className="list-disc space-y-1 pl-5">
              <li>{tt("Owner: who can change it without asking anyone else?", "Owner: Wer kann es ändern, ohne jemanden zu fragen?")}</li>
              <li>{tt("Start: does something have to exist before it, such as the segment data?", "Start: Muss vorher etwas existieren, etwa die Segmentdaten?")}</li>
              <li>{tt("Trigger: does it have a metric, a number, a date and an action?", "Trigger: Hat er eine Kennzahl, eine Zahl, ein Datum und eine Aktion?")}</li>
            </ul>
            <p className="smallcaps text-ash">{tt("What each role can change", "Was jede Rolle ändern kann")}</p>
            <ul className="space-y-1">
              {OWNER_IDS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{OWNERS[o].name}. </span>
                  {OWNERS[o].profile}
                </li>
              ))}
            </ul>
            <MaterialRefs refs={["B5"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Fund the items you will carry out inside the budget. For each funded item choose the month it starts, one owner who can change it without asking anyone else, and a trigger: a number, a date and an action. Leave out what does not fit, on purpose, and fund nothing for a segment you deprioritised in Block 3.2.",
            "Finanzieren Sie die Punkte, die Sie innerhalb des Budgets umsetzen. Wählen Sie für jeden finanzierten Punkt den Startmonat, einen Owner, der ihn ändern kann, ohne jemanden zu fragen, und einen Trigger: eine Zahl, ein Datum und eine Aktion. Lassen Sie weg, was nicht passt, bewusst, und finanzieren Sie nichts für ein Segment, das Sie in Block 3.2 zurückgestellt haben.",
          )}
        </Gloss>
      </p>
      <div id={IDS.archTotal} className="space-y-2">
        <BudgetBar items={f.map((id) => ({ id, short: ARCH_BY_ID[id].name.split(" ")[0], cost: ARCH_BY_ID[id].cost }))} budget={R2_BUDGET} title={tt(`Funded items against the ${euro(R2_BUDGET)} budget`, `Finanzierte Punkte gegen das Budget von ${euro(R2_BUDGET)}`)} />
        <p className="text-caption text-ash" aria-live="polite">
          {tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)}. `, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)}. `)}
          {over > 0 ? tt(`${euro(over)} over: leave out the item with the weakest case, do not trim every item a little.`, `${euro(over)} darüber: Lassen Sie den Punkt mit der schwächsten Begründung weg, kürzen Sie nicht jeden ein bisschen.`) : tt(`${euro(archLeft(r2))} left.`, `${euro(archLeft(r2))} übrig.`)}
        </p>
      </div>
      {ARCH.map((a) => {
        const on = !!r2.alloc[a.id];
        return (
          <div key={a.id} id={IDS.arch(a.id)} className={clsx("space-y-3 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">
                {a.name} <span className="font-normal text-ash">· {euro(a.cost)} · {tt(`${a.weeks} weeks to be in use`, `${a.weeks} Wochen bis zum Einsatz`)} · {tt("serves", "dient")} {servesLabel(a.id)}</span>
              </p>
              <button type="button" aria-pressed={on} onClick={() => setItem(a.id, { alloc: !on })} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                {on ? tt("☑ Funded", "☑ Finanziert") : tt("☐ Not funded", "☐ Nicht finanziert")}
              </button>
            </div>
            <p className="text-caption text-ash">{a.what}</p>
            {on && (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`start-${a.id}`} className="smallcaps block">
                      {tt("Starts in month", "Startet in Monat")}
                    </label>
                    <select id={`start-${a.id}`} className="field mt-1 max-w-[10rem]" value={r2.start[a.id] ?? ""} onChange={(e) => setItem(a.id, { start: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">{tt("Choose…", "Wählen…")}</option>
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>
                          {tt(`Month ${m}`, `Monat ${m}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`owner-${a.id}`} className="smallcaps block">
                      {tt("Owner (who can change it without asking anyone else)", "Owner (wer es ändern kann, ohne jemanden zu fragen)")}
                    </label>
                    <select id={`owner-${a.id}`} className="field mt-1" value={r2.owner[a.id] ?? ""} onChange={(e) => setItem(a.id, { owner: (e.target.value || null) as OwnerId | null })}>
                      <option value="">{tt("Choose an owner…", "Owner wählen…")}</option>
                      {OWNER_IDS.map((o) => (
                        <option key={o} value={o}>
                          {OWNERS[o].name}
                        </option>
                      ))}
                    </select>
                    {r2.owner[a.id] && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{OWNERS[r2.owner[a.id]!].profile}</p>}
                  </div>
                </div>
                <TextBox
                  id={`${IDS.arch(a.id)}-trigger`}
                  label={tt("Trigger", "Trigger")}
                  help={tt("If [metric] is [worse than a number] by [month], then [action]. At least 20 characters, with a number.", "Wenn [Kennzahl] bis [Monat] [schlechter als eine Zahl] ist, dann [Aktion]. Mindestens 20 Zeichen, mit einer Zahl.")}
                  value={r2.trigger[a.id] ?? ""}
                  onChange={(v) => setItem(a.id, { trigger: v })}
                  min={20}
                  rows={2}
                />
                <ExampleAnswer id={`arch-${a.id}-trigger-example`} guide={triggerGuide(a.id)} />
                {mentor && <MentorGuide guide={triggerGuide(a.id)} />}
              </>
            )}
          </div>
        );
      })}

      <div className="space-y-1 rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink" aria-live="polite">
        <p className="smallcaps">{tt("What your plan means", "Was Ihr Plan bedeutet")}</p>
        {f.length === 0 && <p>{tt("Nothing is funded yet.", "Noch nichts ist finanziert.")}</p>}
        {f.length > 0 && !rules.hasBaseline && <p>{tt("The segment fields are not funded, so no trigger in the plan can be read: nothing records which segment an account is in.", "Die Segmentfelder sind nicht finanziert, also lässt sich kein Trigger im Plan ablesen: Nichts erfasst, in welchem Segment ein Account ist.")}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base > firstOther && <p>{tt(`The first item starts in month ${firstOther}, before the segment fields in month ${base}: its first weeks have no baseline to compare with.`, `Der erste Punkt startet in Monat ${firstOther}, vor den Segmentfeldern in Monat ${base}: Seine ersten Wochen haben keine Baseline zum Vergleich.`)}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base <= firstOther && <p>{tt(`The segment fields start in month ${base}, no later than the first other item (month ${firstOther}), so the baseline exists before anything changes.`, `Die Segmentfelder starten in Monat ${base}, nicht später als der erste andere Punkt (Monat ${firstOther}), also existiert die Baseline, bevor sich etwas ändert.`)}</p>}
        {dep.length > 0 && <p>{tt(`Funded for a segment you deprioritised: ${dep.map((id) => ARCH_BY_ID[id].name).join(", ")}. That money works against your own segment decision.`, `Finanziert für ein Segment, das Sie zurückgestellt haben: ${dep.map((id) => ARCH_BY_ID[id].name).join(", ")}. Dieses Geld arbeitet gegen Ihre eigene Segmententscheidung.`)}</p>}
        {over > 0 && <p>{tt(`The funded items are ${euro(over)} over the budget.`, `Die finanzierten Punkte liegen ${euro(over)} über dem Budget.`)}</p>}
      </div>

      {notAllFunded && (
        <div className="space-y-3 border-t border-line pt-3">
          <TextBox
            id={IDS.postponed}
            label={tt("What you leave out, and why", "Was Sie weglassen, und warum")}
            help={tt("Name the item and say why it is the one that goes: the budget, the segment's role, or the weakest case. At least 30 characters.", "Nennen Sie den Punkt und sagen Sie, warum gerade er wegfällt: das Budget, die Rolle des Segments oder die schwächste Begründung. Mindestens 30 Zeichen.")}
            value={r2.postponed}
            onChange={(v) => patch({ postponed: v })}
            min={MIN_LINE}
            rows={3}
          >
            <WritingHelp
              id="postponed-help"
              steps={[
                tt("Name the item you leave out.", "Nennen Sie den Punkt, den Sie weglassen."),
                tt("Say what it would have cost and what that would have pushed the total to.", "Sagen Sie, was er gekostet hätte und auf welche Summe das den Plan gebracht hätte."),
                tt("Say why this one: which segment it serves and what role you gave that segment.", "Sagen Sie, warum gerade dieser: welchem Segment er dient und welche Rolle Sie diesem Segment gegeben haben."),
              ]}
              refs={[{ label: tt("Budget", "Budget"), value: euro(R2_BUDGET), target: IDS.archTotal }]}
            />
          </TextBox>
          <TextBox
            id={IDS.pickup}
            label={tt("The pickup point", "Der Pickup Point")}
            help={tt("The number and the date at which you look at it again: if [metric] is [number] by [month], we revisit it. At least 15 characters, with a number.", "Die Zahl und das Datum, zu dem Sie es wieder ansehen: Wenn [Kennzahl] bis [Monat] [Zahl] ist, prüfen wir es neu. Mindestens 15 Zeichen, mit einer Zahl.")}
            value={r2.pickup}
            onChange={(v) => patch({ pickup: v })}
            min={15}
            rows={2}
          />
          <ExampleAnswer id="postponed-example" guide={postponedGuide()} />
          {mentor && <MentorGuide guide={postponedGuide()} />}
        </div>
      )}

      <CheckBar onCheck={check} checkLabel={tt("Check my architecture", "Meine Architektur prüfen")} checks={r2.checks} clueShown={r2.seqClue} onClue={() => patch({ seqClue: true })} />
      {r2.seqResult && (
        <Reading>
          {tt(`${r2.seqResult.holds} of ${r2.seqResult.total} rules hold (the segment fields start no later than the first other item, the funded items fit the budget, nothing is funded for a deprioritised segment).`, `${r2.seqResult.holds} von ${r2.seqResult.total} Regeln stimmen (die Segmentfelder starten nicht später als der erste andere Punkt, die finanzierten Punkte passen ins Budget, nichts ist für ein zurückgestelltes Segment finanziert).`)}
          {r2.seqClue ? tt(" Clue: which item produces the evidence for all the others? And which items serve a segment you decided not to invest in?", " Hinweis: Welcher Punkt liefert die Evidenz für alle anderen? Und welche Punkte dienen einem Segment, in das Sie nicht investieren wollten?") : ""}
        </Reading>
      )}
      <AnswerKey block={ownerKey(f)} />
      <BlockMissing block="3.5" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.6 */

export function Block36() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const k = r2.tripKpi ? KPIS.find((x) => x.id === r2.tripKpi)! : null;
  const flags = tripFlagsOf(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, decisionFlagged: s.decision === "wait", tripFlags: tripFlagsOf(s) }));
  const unit = (x: (typeof KPIS)[number]) => (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`);
  return (
    <AnswerBlock
      id="block-3-6"
      title={tt("Block 3.6 · Make the segment decision despite incomplete data", "Block 3.6 · Die Segmententscheidung trotz unvollständiger Daten treffen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["3.6"]}
      core={true}
      findIt={tt("Route 2 → Task 2 → your own answers in Blocks 3.1 to 3.5, the baselines below, and the regret table in Materi B4. Answer in the fields below.", "Route 2 → Task 2 → Ihre eigenen Antworten in den Blöcken 3.1 bis 3.5, die Ausgangswerte unten und die Regret-Tabelle in Materi B4. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["B4"]} />
      <div id={IDS.decision} className={clsx("space-y-2 rounded-lg p-1", r2.decisionFlagged && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("Your decision", "Ihre Entscheidung")}</p>
        <p className="text-caption text-ash">{tt("The brief asks you to decide on your segments although the customer data is incomplete. Choose one.", "Der Auftrag verlangt, dass Sie über Ihre Segmente entscheiden, obwohl die Kundendaten unvollständig sind. Wählen Sie eine.")}</p>
        <OptionList<DecisionId> label={tt("Decision", "Entscheidung")} value={r2.decision} onChange={(v) => patch({ decision: v, decisionFlagged: false })} options={DECISIONS.map((d) => ({ id: d.id, label: d.label, sub: d.detail }))} />
        {r2.decisionFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {tt("Does waiting give the board the segment decision it asked for, and what do the six months of generic offers cost? Look at the last row of the regret table in Materi B4.", "Gibt Warten dem Vorstand die Segmententscheidung, um die er gebeten hat, und was kosten sechs Monate generischer Angebote? Schauen Sie auf die letzte Zeile der Regret-Tabelle in Materi B4.")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-ink">{tt("Three assumptions your decision rests on", "Drei Annahmen, auf denen Ihre Entscheidung beruht")}</p>
        {r2.assumptions.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.assumption(i)}
              label={tt(`Assumption ${i + 1}`, `Annahme ${i + 1}`)}
              help={tt("What you assume about a segment or its customers, and the sign that would show you are wrong (a number or something you could see, and when). At least 30 characters.", "Was Sie über ein Segment oder seine Kunden annehmen, und das Anzeichen, das zeigen würde, dass Sie falsch liegen (eine Zahl oder etwas Sichtbares, und wann). Mindestens 30 Zeichen.")}
              value={a}
              onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))}
              min={MIN_LINE}
              rows={2}
            />
            <ExampleAnswer id={`assumption-${i}-example`} guide={assumptionGuide(i)} />
            {mentor && <MentorGuide guide={assumptionGuide(i)} />}
          </div>
        ))}
      </div>

      <div id={IDS.trip} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
        <p className="font-semibold text-ink">{tt("The tripwire", "Der Tripwire")}</p>
        <p className="text-caption text-ash">
          {tt("A metric of customer response, a threshold better than today's baseline, a month and an action agreed now. ", "Eine Kennzahl der Kundenreaktion, ein Schwellenwert besser als die heutige Baseline, ein Monat und eine jetzt vereinbarte Aktion. ")}
          {R2_BASELINE_NOTE.v}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className={clsx(flags.includes("kpi") && r2.tripFlags.includes("kpi") && "is-flagged p-1")}>
            <label htmlFor="trip-kpi" className="smallcaps block">
              {tt("Metric", "Kennzahl")}
            </label>
            <select id="trip-kpi" className="field mt-1" value={r2.tripKpi ?? ""} onChange={(e) => patch({ tripKpi: (e.target.value || null) as KpiId | null, tripFlags: [] })}>
              <option value="">{tt("Choose a metric…", "Kennzahl wählen…")}</option>
              {KPIS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label} ({tt("today", "heute")}: {num(x.baseline)}
                  {unit(x)})
                </option>
              ))}
            </select>
            {flags.includes("kpi") && r2.tripFlags.includes("kpi") && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt("Does this metric measure how customers responded, or how much DataCloud itself did?", "Misst diese Kennzahl, wie Kunden reagiert haben, oder wie viel DataCloud selbst getan hat?")}
              </p>
            )}
          </div>
          <div className={clsx(flags.includes("threshold") && r2.tripFlags.includes("threshold") && "is-flagged p-1")}>
            <label htmlFor="trip-threshold" className="smallcaps block">
              {tt("Threshold", "Schwellenwert")}
              {k ? tt(` (${k.unit}; better is ${k.better === "up" ? "higher" : "lower"})`, ` (${k.unit}; besser ist ${k.better === "up" ? "höher" : "niedriger"})`) : ""}
            </label>
            <input id="trip-threshold" className="field tnum mt-1" inputMode="decimal" value={r2.tripThreshold} onChange={(e) => patch({ tripThreshold: e.target.value, tripFlags: [] })} />
            {flags.includes("threshold") && r2.tripFlags.includes("threshold") && k && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt(`Compare it with today's figure, ${num(k.baseline)}${unit(k)}. Would reaching it show a real change?`, `Vergleichen Sie ihn mit dem heutigen Wert, ${num(k.baseline)}${unit(k)}. Würde das Erreichen eine echte Veränderung zeigen?`)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="trip-month" className="smallcaps block">
              {tt("By month", "Bis Monat")}
            </label>
            <select id="trip-month" className="field mt-1 max-w-[10rem]" value={r2.tripMonth ?? ""} onChange={(e) => patch({ tripMonth: e.target.value ? Number(e.target.value) : null })}>
              <option value="">{tt("Choose…", "Wählen…")}</option>
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>
                  {tt(`Month ${m}`, `Monat ${m}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="trip-action" className="smallcaps block">
              {tt("If it is missed", "Wenn er verfehlt wird")}
            </label>
            <select id="trip-action" className="field mt-1" value={r2.tripAction} onChange={(e) => patch({ tripAction: e.target.value as "" | "scale" | "adjust" | "stop" })}>
              <option value="">{tt("Choose an action…", "Aktion wählen…")}</option>
              <option value="adjust">{tt("Adjust one measure and continue", "Eine Maßnahme anpassen und weitermachen")}</option>
              <option value="stop">{tt("Stop and reconsider the segment focus", "Stoppen und den Segmentfokus überdenken")}</option>
              <option value="scale">{tt("Scale up anyway", "Trotzdem ausweiten")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="rounded-lg border border-gold bg-accentSoft p-3.5 text-caption text-ink">
          <p className="smallcaps text-accent">{tt("The board's challenge", "Die Frage des Vorstands")}</p>
          <p className="mt-1">
            <Gloss>{BOARD_CHALLENGE.v}</Gloss>
          </p>
        </div>
        <TextBox
          id={IDS.challenge}
          label={tt("What do you do?", "Was tun Sie?")}
          help={tt("Say what you check first, what you keep, and the one thing you change. At least 60 characters.", "Sagen Sie, was Sie zuerst prüfen, was Sie behalten und was Sie als Einziges ändern. Mindestens 60 Zeichen.")}
          value={r2.challenge}
          onChange={(v) => patch({ challenge: v })}
          min={60}
          rows={4}
        >
          <WritingHelp
            id="challenge-help"
            steps={[
              tt("Re-rate the segment with the new number of accounts before you drop it (Materi B4).", "Bewerten Sie das Segment mit der neuen Zahl von Accounts neu, bevor Sie es fallen lassen (Materi B4)."),
              tt("Say what the numbers still support, and keep it.", "Sagen Sie, was die Zahlen noch stützen, und behalten Sie es."),
              tt("Change one item, not the whole plan, and say how the tripwire will tell you whether you were right.", "Ändern Sie einen Punkt, nicht den ganzen Plan, und sagen Sie, wie der Tripwire Ihnen zeigt, ob Sie recht hatten."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="challenge-example" guide={challengeGuide()} />
        {mentor && <MentorGuide guide={challengeGuide()} />}
      </div>

      <CheckBar onCheck={check} checkLabel={tt("Check my decision", "Meine Entscheidung prüfen")} checks={r2.checks} />
      {r2.checks > 0 && (r2.decisionFlagged || r2.tripFlags.length > 0) && (
        <Reading>
          {r2.decisionFlagged ? tt("Your decision is outlined.", "Ihre Entscheidung ist markiert.") : ""}
          {r2.tripFlags.length > 0 ? tt(` ${r2.tripFlags.length} part${r2.tripFlags.length === 1 ? "" : "s"} of the tripwire ${r2.tripFlags.length === 1 ? "is" : "are"} outlined.`, ` ${r2.tripFlags.length} ${r2.tripFlags.length === 1 ? "Teil" : "Teile"} des Tripwires ${r2.tripFlags.length === 1 ? "ist" : "sind"} markiert.`) : ""}
        </Reading>
      )}
      <AnswerKey block={decisionKey()} />
      <AnswerKey block={tripKey()} />
      <BlockMissing block="3.6" route={2} />
    </AnswerBlock>
  );
}
