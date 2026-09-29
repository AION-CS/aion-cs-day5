"use client";

import clsx from "clsx";
import { Toggles } from "@/components/materi/kit";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { Field } from "@/components/ui/Field";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { ACCOUNTS, GAPS, STATUS_LABEL } from "@/data/accounts";
import type { AccountId, GapId } from "@/data/accounts";
import { CONTENTS, CONTENT_IDS, SEGMENTS, SEGMENT_IDS, SEGMENT_PAIR_TESTS, VALUE_GLYPH, VALUE_HIGH, VALUE_LABEL, VALUE_MID, VALUE_ORDER } from "@/data/segments";
import type { ContentId, SegmentId, Value } from "@/data/segments";
import { BUDGET, CHOOSE, EV_RULE, MEASURES, MEASURE_BY_ID, MONTHS } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { aimsHold, allAssigned, assignHolds, coverage, ecoHolds, gapHolds, measureScore, measureScored, orderInversions, ownValue, profileCheck, tallyOf, totalCost } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { assignKey, gapKey, measureKey, orderKey, profileKey } from "@/lib/answerKey";
import { profileGuide, riskTextGuide, scoreGuide, whyGuide } from "@/lib/mentorGuide";
import { MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 2.1 */

export function Block21() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeAccount);
  const undo = useStore((s) => s.undoAssign);
  const redo = useStore((s) => s.redoAssign);
  const patch = useStore((s) => s.patchL1);
  return (
    <AnswerBlock
      id="block-2-1"
      title={tt("Block 2.1 · Assign the twelve accounts to a segment", "Block 2.1 · Die zwölf Accounts einem Segment zuordnen")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["2.1"]}
      core={true}
      findIt={tt(
        "Route 1 → Task 1 → the twelve accounts on the board below, each with its account manager's note. Find the phrase that decides each note and answer on the board.",
        "Route 1 → Task 1 → die zwölf Accounts auf der Tafel unten, jeder mit der Notiz seines Account Managers. Finden Sie die Wendung, die jede Notiz entscheidet, und antworten Sie auf der Tafel.",
      )}
    >
      <MaterialRefs refs={["A5"]} />
      <PlacementBoard<SegmentId>
        items={ACCOUNTS.map((a) => ({ id: a.id, meta: `${a.name} · ${a.sector} · ${num(a.staff)} ${tt("staff", "Beschäftigte")} · ${STATUS_LABEL[a.status]} · ${euro(a.acv)}`, text: a.note }))}
        bins={SEGMENT_IDS.map((s) => ({ id: s, label: SEGMENTS[s].label, hint: SEGMENTS[s].need }))}
        value={l1.assign}
        onPlace={(id, s) => place(id as AccountId, s)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.assignHistory.length}
        redoCount={l1.assignFuture.length}
        domId={IDS.account}
        keyPhrases={Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.key]))}
        clues={Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.clue]))}
        reasons={Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.why]))}
        result={l1.assignResult}
        checks={l1.assignChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, assignChecks: s.assignChecks + 1, assignResult: assignHolds(s.assign) }))}
        onClue={() => patch({ assignClue: true })}
        clueShown={l1.assignClue}
        reasoningOpened={l1.assignReasoning}
        onOpenReasoning={() => patch({ assignReasoning: true })}
        noun={tt("account", "Account")}
        checkLabel={tt("Check my assignment", "Meine Zuordnung prüfen")}
        intro={tt("Drag an account into a segment, or select it and then select a segment. Select a placed one to move it again. One segment per account.", "Ziehen Sie einen Account in ein Segment, oder wählen Sie ihn aus und dann ein Segment. Wählen Sie einen platzierten Account, um ihn zu verschieben. Ein Segment pro Account.")}
        tests={
          <RevealHint id="assign-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A5", "Testfragen · aus Materi A5")}>
            <div className="space-y-2 text-caption text-ink">
              <p>{tt("Ask the test of the segment you suspect. They repeat the tests from Materi A5; they never say which account goes where.", "Stellen Sie die Testfrage des Segments, das Sie vermuten. Sie wiederholen die Tests aus Materi A5; sie sagen nie, welcher Account wohin gehört.")}</p>
              <ul className="space-y-1.5">
                {SEGMENT_IDS.map((s) => (
                  <li key={s}>
                    <span className="font-semibold">{SEGMENTS[s].label}. </span>
                    <Gloss>{SEGMENTS[s].test}</Gloss>
                  </li>
                ))}
              </ul>
              <p className="smallcaps text-ash">{tt("When two segments both seem to fit", "Wenn zwei Segmente zu passen scheinen")}</p>
              <ul className="space-y-1.5">
                {SEGMENT_PAIR_TESTS.map((x) => (
                  <li key={x.pair}>
                    <span className="font-semibold">{x.pair} </span>
                    <Gloss>{x.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A5"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <p className="text-caption text-ash">
        {tt("Words in the notes, explained in plain language: ", "Begriffe in den Notizen, einfach erklärt: ")}
        <Gloss>{tt("C5, KRITIS, NIS2, BaFin, audit rights, sub-processor, SLA, managed service, API, Terraform, proof of concept, hyperscaler, vCPU, autoscaling, DevOps, Ausschreibung.", "C5, KRITIS, NIS2, BaFin, Prüfrechte, Unterauftragsverarbeiter, SLA, Managed Service, API, Terraform, Proof of Concept, Hyperscaler, vCPU, Autoscaling, DevOps, Ausschreibung.")}</Gloss>
      </p>
      <AnswerKey block={assignKey()} />
      <BlockMissing block="2.1" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.2 */

export function Block22() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const tally = tallyOf(l1.assign);
  const complete = allAssigned(l1.assign);
  const pc = profileCheck(l1);
  const valueOpts = VALUE_ORDER.map((v) => ({ id: v, label: `${VALUE_LABEL[v]} ${VALUE_GLYPH[v]}` }));
  const setProf = (s: SegmentId, p: Partial<{ value: Value | null; need: string; content: ContentId | null }>) =>
    patch((st) => ({ profiles: { ...st.profiles, [s]: { ...st.profiles[s], ...p } }, profResult: null }));
  const check = () =>
    patch((s) => {
      const c = profileCheck(s);
      return { checks: s.checks + 1, profResult: { value: c.value, content: c.content, filled: c.filled }, profClue: false };
    });
  const toggleGap = (id: GapId) => patch((s) => ({ gaps: s.gaps.includes(id) ? s.gaps.filter((x) => x !== id) : [...s.gaps, id], gapResult: null }));

  return (
    <AnswerBlock
      id="block-2-2"
      title={tt("Block 2.2 · Profile each segment, rate its value, name the gaps", "Block 2.2 · Jedes Segment beschreiben, seinen Wert bewerten, die Lücken benennen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.2"]}
      core={false}
      findIt={tt(
        "Route 1 → Task 1 → “Your tally” directly below: it adds up your own assignment from Block 2.1. Answer in the three segment rows and the two fields under them.",
        "Route 1 → Task 1 → „Ihre Auszählung“ direkt darunter: Sie summiert Ihre eigene Zuordnung aus Block 2.1. Antworten Sie in den drei Segmentzeilen und den zwei Feldern darunter.",
      )}
    >
      <MaterialRefs refs={["A5", "A6"]} />
      <div id="tally-panel" className="space-y-2 rounded-lg border border-line bg-mist/50 p-3">
        <p className="smallcaps">{tt("Your tally · from your assignment in Block 2.1", "Ihre Auszählung · aus Ihrer Zuordnung in Block 2.1")}</p>
        {!complete && (
          <p className="text-caption text-ash">
            {tt(`${tally.placed} of 12 accounts are assigned, so the tally below is not complete yet. `, `${tally.placed} von 12 Accounts sind zugeordnet, die Auszählung ist also noch nicht vollständig. `)}
            <button type="button" onClick={() => scrollToAndFlash("block-2-1", "ref", "start")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
              {tt("Go to Block 2.1", "Zu Block 2.1")}
            </button>
            {tt(". Nothing is blocked; the check simply reads what is there.", ". Nichts ist gesperrt; die Prüfung liest einfach, was da ist.")}
          </p>
        )}
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-caption">
            <caption className="sr-only">{tt("Accounts and potential contract value per segment, from your own assignment", "Accounts und potenzieller Vertragswert pro Segment, aus Ihrer eigenen Zuordnung")}</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="py-1 pr-2">{tt("Segment", "Segment")}</th>
                <th className="py-1 pr-2 text-right">{tt("Accounts", "Accounts")}</th>
                <th className="py-1 pr-2 text-right">{tt("Potential contract value", "Potenzieller Vertragswert")}</th>
              </tr>
            </thead>
            <tbody>
              {SEGMENT_IDS.map((s) => (
                <tr key={s} className="border-t border-line">
                  <td className="py-1 pr-2 font-semibold">{SEGMENTS[s].label}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.count[s]}</td>
                  <td className="tnum py-1 pr-2 text-right">{euro(tally.acv[s])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-micro normal-case tracking-normal text-ash">
          {tt(
            "The value rule (€150,000 or more High, €100,000 to €149,999 Mid, less Low) is in Materi A6. The tally shows sums; it does not rate them.",
            "Die Wertregel (150.000 € oder mehr Hoch, 100.000 bis 149.999 € Mittel, weniger Niedrig) steht in Materi A6. Die Auszählung zeigt Summen; sie bewertet sie nicht.",
          )}
        </p>
      </div>

      <div className="space-y-4">
        {SEGMENT_IDS.map((s) => {
          const pr = l1.profiles[s];
          const flagged = !!l1.profResult && (!!pr.value && !pc.rowsValue[s] || !!pr.content && !pc.rowsContent[s]);
          return (
            <div key={s} className="space-y-2">
              <Field
                id={IDS.profile(s)}
                htmlFor={`profile-${s}-need`}
                label={SEGMENTS[s].label}
                help={tt(
                  `Rate its business value from your tally, say what these accounts need and how they decide (at least ${MIN_SENTENCE} characters), and choose what DataCloud should personalise for them.`,
                  `Bewerten Sie den Geschäftswert aus Ihrer Auszählung, sagen Sie, was diese Accounts brauchen und wie sie entscheiden (mindestens ${MIN_SENTENCE} Zeichen), und wählen Sie, was DataCloud für sie personalisieren sollte.`,
                )}
                flagged={flagged}
                clue={
                  pr.value && !pc.rowsValue[s]
                    ? tt("Add up the potential contract value of the accounts you placed here, from your tally, and compare the sum with the three bands in Materi A6.", "Summieren Sie den potenziellen Vertragswert der Accounts, die Sie hier platziert haben, aus Ihrer Auszählung, und vergleichen Sie die Summe mit den drei Bändern in Materi A6.")
                    : tt("Read the segment's need again. Which content answers that need, rather than changing the price or the wording?", "Lesen Sie den Bedarf des Segments noch einmal. Welche Inhalte beantworten diesen Bedarf, statt Preis oder Wortwahl zu ändern?")
                }
                clueShown={l1.profClue}
                onShowClue={() => patch({ profClue: true })}
                meta={<span className={clsx("tnum text-micro normal-case tracking-normal", pr.need.trim().length >= MIN_SENTENCE ? "text-signal" : "text-ash")}>{`${pr.need.trim().length} / ${MIN_SENTENCE} ${tt("characters", "Zeichen")}`}</span>}
              >
                <div className="space-y-2">
                  <div>
                    <p className="smallcaps">{tt("Business value", "Geschäftswert")}</p>
                    <Toggles<Value> label={tt(`Business value of ${SEGMENTS[s].label}`, `Geschäftswert von ${SEGMENTS[s].label}`)} value={pr.value} onChange={(v) => setProf(s, { value: v })} options={valueOpts} />
                    <p className="mt-1 text-micro normal-case tracking-normal text-ash">{tt(`Your tally: ${tally.count[s]} accounts, ${euro(tally.acv[s])}.`, `Ihre Auszählung: ${tally.count[s]} Accounts, ${euro(tally.acv[s])}.`)}</p>
                  </div>
                  <textarea id={`profile-${s}-need`} rows={2} className="field" value={pr.need} onChange={(e) => setProf(s, { need: e.target.value })} aria-describedby={`profile-${s}-need-help`} placeholder={tt("They need …, and they decide …", "Sie brauchen …, und sie entscheiden …")} />
                  <div>
                    <p className="smallcaps">{tt("What to personalise for them", "Was für sie personalisiert wird")}</p>
                    <OptionList<ContentId> cols={2} label={tt(`What to personalise for ${SEGMENTS[s].label}`, `Was für ${SEGMENTS[s].label} personalisiert wird`)} value={pr.content} onChange={(v) => setProf(s, { content: v })} options={CONTENT_IDS.map((c) => ({ id: c, label: CONTENTS[c].label, sub: CONTENTS[c].sub }))} />
                  </div>
                </div>
              </Field>
              <ExampleAnswer id={`profile-${s}-example`} guide={profileGuide(s)} />
              {mentor && <MentorGuide guide={profileGuide(s)} />}
            </div>
          );
        })}
        <CheckBar onCheck={check} checkLabel={tt("Check my profiles", "Meine Profile prüfen")} checks={l1.checks} />
        {l1.profResult && (
          <Reading>
            {complete
              ? tt(
                  `${l1.profResult.value} of 3 value ratings agree with the rule applied to your own tally, and ${l1.profResult.content} of 3 content choices answer the segment's need. Rows that do not are outlined; each has a clue.`,
                  `${l1.profResult.value} von 3 Wertbewertungen stimmen mit der Regel überein, angewandt auf Ihre eigene Auszählung, und ${l1.profResult.content} von 3 Inhaltswahlen beantworten den Bedarf des Segments. Zeilen, die das nicht tun, sind markiert; jede hat einen Hinweis.`,
                )
              : tt(`The check reads your own tally, which is not complete: ${tally.placed} of 12 accounts are assigned. Assign the rest in Block 2.1 and check again.`, `Die Prüfung liest Ihre eigene Auszählung, die noch nicht vollständig ist: ${tally.placed} von 12 Accounts sind zugeordnet. Ordnen Sie den Rest in Block 2.1 zu und prüfen Sie erneut.`)}
          </Reading>
        )}
        <AnswerKey block={profileKey()} />
      </div>

      <div className="space-y-3 border-t border-line pt-3">
        <div id={IDS.gaps}>
          <p className="font-semibold text-ink">{tt("What does the file not tell you?", "Was verrät die Datei nicht?")}</p>
          <p className="text-caption text-ash">
            {tt(
              "Choose two or more things you would want to know that would change the segment DataCloud picks or the offer it builds. Test each with the rule in Materi A6.",
              "Wählen Sie zwei oder mehr Dinge, die Sie wissen wollen und die ändern würden, welches Segment DataCloud wählt oder welches Angebot es baut. Prüfen Sie jedes mit der Regel in Materi A6.",
            )}
          </p>
          <div className="mt-2">
            <OptionList<GapId> multi label={tt("Missing information", "Fehlende Information")} options={GAPS.map((g) => ({ id: g.id, label: g.label }))} value={l1.gaps} onChange={toggleGap} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => patch((s) => ({ checks: s.checks + 1, gapResult: gapHolds(s.gaps) }))} className="btn-ghost btn-sm">
              {tt("Check my choices", "Meine Auswahl prüfen")}
            </button>
            {l1.gapResult && (
              <span role="status" className="text-caption text-ink">
                {l1.gapResult.chosen === 0
                  ? tt("Nothing chosen yet.", "Noch nichts gewählt.")
                  : tt(`${l1.gapResult.holds} of ${l1.gapResult.chosen} chosen would change the segment or the offer. The others are about DataCloud's own activity or are already in the file.`, `${l1.gapResult.holds} von ${l1.gapResult.chosen} gewählten würden Segment oder Angebot ändern. Die anderen betreffen die eigene Aktivität von DataCloud oder stehen schon in der Datei.`)}
              </span>
            )}
          </div>
          <AnswerKey block={gapKey()} />
        </div>
        <TextBox
          id={IDS.riskText}
          label={tt("One risk of a wrong segmentation, and the sign you would see", "Ein Risiko einer falschen Segmentierung, und das Anzeichen, das Sie sehen würden")}
          help={tt("Name what could go wrong if DataCloud segments badly, and what you would notice in the deals. At least 20 characters.", "Nennen Sie, was schiefgehen könnte, wenn DataCloud schlecht segmentiert, und was Sie in den Deals bemerken würden. Mindestens 20 Zeichen.")}
          value={l1.riskText}
          onChange={(v) => patch({ riskText: v })}
          min={20}
          rows={2}
        />
        <ExampleAnswer id="risk-text-example" guide={riskTextGuide()} />
        {mentor && <MentorGuide guide={riskTextGuide()} />}
      </div>
      <BlockMissing block="2.2" route={1} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.3 */

export function Block23() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const chosen = l1.chosen;
  const cost = totalCost(chosen);
  const cov = coverage(l1);
  const tally = tallyOf(l1.assign);
  const shown = l1.order.length === chosen.length && chosen.every((id) => l1.order.includes(id)) ? l1.order : chosen;
  const inv = orderInversions({ ...l1, order: shown });

  const toggle = (id: MeasureId) =>
    patch((s) => {
      const has = s.chosen.includes(id);
      const next = has ? s.chosen.filter((x) => x !== id) : [...s.chosen, id];
      return { chosen: next, order: s.order.filter((x) => next.includes(x)), measureFlags: [] };
    });
  const setAims = (id: MeasureId, aims: SegmentId[]) => patch((s) => ({ aims: { ...s.aims, [id]: aims }, measureFlags: s.measureFlags.filter((f) => f !== `${id}.aims`) }));
  const setScore = (k: "rel" | "dif" | "eco", id: MeasureId, v: Score) =>
    patch((s) => ({ [k]: { ...s[k], [id]: v }, measureFlags: k === "eco" ? s.measureFlags.filter((f) => f !== `${id}.eco`) : s.measureFlags }) as Partial<typeof s>);
  const move = (id: MeasureId, d: -1 | 1) => {
    const list = [...shown];
    const i = list.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    patch({ order: list });
  };
  const check = () =>
    patch((s) => {
      const flags: string[] = [];
      for (const id of s.chosen) {
        if (s.aims[id] !== undefined && !aimsHold(id, s.aims[id])) flags.push(`${id}.aims`);
        if (s.eco[id] && !ecoHolds(id, s.eco[id])) flags.push(`${id}.eco`);
      }
      return { checks: s.checks + 1, measureFlags: flags };
    });
  const aimsFlagged = (id: MeasureId) => l1.measureFlags.includes(`${id}.aims`);
  const ecoFlagged = (id: MeasureId) => l1.measureFlags.includes(`${id}.eco`);
  const nAims = l1.measureFlags.filter((f) => f.endsWith(".aims")).length;
  const nEco = l1.measureFlags.filter((f) => f.endsWith(".eco")).length;

  return (
    <AnswerBlock
      id="block-2-3"
      title={tt("Block 2.3 · Choose three measures, score them, put them in order", "Block 2.3 · Drei Maßnahmen wählen, bewerten, in eine Reihenfolge bringen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.3"]}
      core={true}
      findIt={tt(
        `Route 1 → Task 1 → “The limits” in the case above (${euro(BUDGET)}, ${MONTHS} months) and the nine measures below. Answer by choosing three and filling their cards.`,
        `Route 1 → Task 1 → „Die Grenzen“ im Fall oben (${euro(BUDGET)}, ${MONTHS} Monate) und die neun Maßnahmen unten. Antworten Sie, indem Sie drei wählen und ihre Karten ausfüllen.`,
      )}
    >
      <MaterialRefs refs={["A7"]} />
      <div className="rounded-lg border border-line bg-canvas p-3 text-caption text-ink">
        <p className="smallcaps">{tt("Your segments by value · from your placement in Block 2.1", "Ihre Segmente nach Wert · aus Ihrer Zuordnung in Block 2.1")}</p>
        <ul className="mt-1 grid gap-1 sm:grid-cols-3">
          {SEGMENT_IDS.map((s) => (
            <li key={s}>
              <strong>{SEGMENTS[s].label}</strong>: {euro(tally.acv[s])} → {VALUE_LABEL[ownValue(s, tally)]}
            </li>
          ))}
        </ul>
        <p className="mt-1 text-ash">
          {tt(
            `Value = the potential contract values of the accounts you placed in the segment, added up: ${euro(VALUE_HIGH)} or more High, ${euro(VALUE_MID)} or more Mid, less Low. ${tally.placed} of 12 accounts placed. The Relevance score uses this value.`,
            `Wert = die potenziellen Vertragswerte der Accounts, die Sie dem Segment zugeordnet haben, addiert: ${euro(VALUE_HIGH)} oder mehr Hoch, ${euro(VALUE_MID)} oder mehr Mittel, weniger Niedrig. ${tally.placed} von 12 Accounts zugeordnet. Der Relevanz-Wert nutzt diesen Wert.`,
          )}
        </p>
      </div>
      <div id={IDS.measurePick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>
            {tt(
              "Choose exactly three of the nine measures. Each says what it changes for the account, what it costs and how many accounts it reaches; it does not say which segment it serves. That is your job. You can change your choice at any time and your entries for a measure come back if you choose it again.",
              "Wählen Sie genau drei der neun Maßnahmen. Jede sagt, was sie für den Account ändert, was sie kostet und wie viele Accounts sie erreicht; sie sagt nicht, welchem Segment sie dient. Das ist Ihre Aufgabe. Sie können Ihre Wahl jederzeit ändern, und Ihre Einträge zu einer Maßnahme kommen zurück, wenn Sie sie wieder wählen.",
            )}
          </Gloss>
        </p>
        <OptionList<MeasureId>
          multi
          label={tt("Measures", "Maßnahmen")}
          value={chosen}
          onChange={toggle}
          disabledIds={chosen.length >= CHOOSE ? MEASURES.map((m) => m.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.measurePick, "warn")}
          options={MEASURES.map((m) => ({
            id: m.id,
            label: tt(`${m.name} · ${euro(m.cost)} · reaches ${m.reach} accounts · ${m.weeks} weeks`, `${m.name} · ${euro(m.cost)} · erreicht ${m.reach} Accounts · ${m.weeks} Wochen`),
            sub: `${m.what} ${m.mechanism} ${tt("Needs:", "Voraussetzung:")} ${m.needs}`,
          }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${chosen.length} of ${CHOOSE} chosen.`, `${chosen.length} von ${CHOOSE} gewählt.`)}
          {chosen.length >= CHOOSE ? tt(" To choose another, first remove one.", " Um eine andere zu wählen, entfernen Sie zuerst eine.") : ""}
        </p>
        <div className="flex flex-wrap items-start gap-2">
          <RevealHint id="aims-help" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("How to match a measure to a segment · taught in Materi A7", "Wie man eine Maßnahme einem Segment zuordnet · aus Materi A7")}>
            <div className="space-y-2 text-caption text-ink">
              <p>{tt("For each measure ask: what does it change for the account, and which segment's need does that change answer? This list repeats what answers each segment; it never says which measure it is.", "Fragen Sie bei jeder Maßnahme: Was ändert sie für den Account, und welchen Segmentbedarf beantwortet diese Änderung? Diese Liste wiederholt, was jedes Segment beantwortet; sie sagt nie, welche Maßnahme es ist.")}</p>
              <ul className="space-y-1.5">
                {SEGMENT_IDS.map((s) => (
                  <li key={s}>
                    <span className="font-semibold">{SEGMENTS[s].label}. </span>
                    <Gloss>{SEGMENTS[s].answeredBy}</Gloss>
                  </li>
                ))}
              </ul>
              <p>{EV_RULE.v}</p>
              <MaterialRefs refs={["A7"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        </div>
      </div>

      {chosen.length > 0 && (
        <div className="space-y-3">
          <BudgetBar items={chosen.map((id) => ({ id, short: MEASURE_BY_ID[id].name.split(" ")[0], cost: MEASURE_BY_ID[id].cost }))} budget={BUDGET} title={tt(`Chosen measures against the ${euro(BUDGET)} budget`, `Gewählte Maßnahmen gegen das Budget von ${euro(BUDGET)}`)} />
          <p className="text-caption text-ash">
            {tt(`${chosen.length} measure${chosen.length === 1 ? "" : "s"} cost ${euro(cost)} of ${euro(BUDGET)}.`, `${chosen.length} ${chosen.length === 1 ? "Maßnahme kostet" : "Maßnahmen kosten"} ${euro(cost)} von ${euro(BUDGET)}.`)}
            {cost > BUDGET ? tt(` That is ${euro(cost - BUDGET)} over: leave out the measure with the lowest score.`, ` Das sind ${euro(cost - BUDGET)} zu viel: Lassen Sie die Maßnahme mit dem niedrigsten Wert weg.`) : tt(` ${euro(BUDGET - cost)} is left.`, ` ${euro(BUDGET - cost)} bleiben übrig.`)}
          </p>
        </div>
      )}

      {chosen.map((id) => {
        const m = MEASURE_BY_ID[id];
        const aims = l1.aims[id];
        const score = measureScore(l1, id);
        return (
          <div key={id} id={IDS.measure(id)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", (aimsFlagged(id) || ecoFlagged(id)) && "is-flagged")}>
            <p className="font-semibold text-ink">
              {m.name} <span className="font-normal text-ash">· {euro(m.cost)} · {tt(`${m.reach} accounts`, `${m.reach} Accounts`)} · {tt(`${m.weeks} weeks`, `${m.weeks} Wochen`)}</span>
            </p>
            <div>
              <p className="smallcaps">{tt("Which segments does it serve? (choose the ones whose need it answers, or none)", "Welchen Segmenten dient sie? (wählen Sie die, deren Bedarf sie beantwortet, oder keines)")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {SEGMENT_IDS.map((s) => {
                  const on = aims?.includes(s) ?? false;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAims(id, on ? (aims ?? []).filter((x) => x !== s) : [...(aims ?? []), s])}
                      className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}
                    >
                      {on ? "☑ " : "☐ "}
                      {SEGMENTS[s].label}
                    </button>
                  );
                })}
                <button type="button" aria-pressed={aims !== undefined && aims.length === 0} onClick={() => setAims(id, [])} className={clsx("btn btn-sm min-h-[40px] border", aims !== undefined && aims.length === 0 ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                  {tt("None of the three", "Keinem der drei")}
                </button>
              </div>
              {aimsFlagged(id) && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt(
                    "Read what this measure changes for the account against the table “Matching a measure to a segment” in Materi A7. Whose need does that change answer, if anyone's? A change in wording or price answers no segment's need.",
                    "Lesen Sie, was diese Maßnahme für den Account ändert, gegen die Tabelle „Eine Maßnahme einem Segment zuordnen“ in Materi A7. Wessen Bedarf beantwortet diese Änderung, wenn überhaupt? Eine Änderung in Wortwahl oder Preis beantwortet keinen Segmentbedarf.",
                  )}
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="smallcaps">{tt("Relevance", "Relevanz")}</p>
                <ScorePick label={tt(`Relevance of ${m.name}`, `Relevanz von ${m.name}`)} value={l1.rel[id] || 0} onChange={(v) => setScore("rel", id, v)} />
              </div>
              <div>
                <p className="smallcaps">{tt("Differentiation", "Differenzierung")}</p>
                <ScorePick label={tt(`Differentiation of ${m.name}`, `Differenzierung von ${m.name}`)} value={l1.dif[id] || 0} onChange={(v) => setScore("dif", id, v)} />
              </div>
              <div>
                <p className="smallcaps">{tt("Economic viability (from the cost per account)", "Wirtschaftlichkeit (aus den Kosten pro Account)")}</p>
                <ScorePick label={tt(`Economic viability of ${m.name}`, `Wirtschaftlichkeit von ${m.name}`)} value={l1.eco[id] || 0} onChange={(v) => setScore("eco", id, v)} flagged={ecoFlagged(id)} />
                {ecoFlagged(id) && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt(`Divide ${euro(m.cost)} by ${m.reach} accounts and read the result against the rule in Materi A7.`, `Teilen Sie ${euro(m.cost)} durch ${m.reach} Accounts und lesen Sie das Ergebnis gegen die Regel in Materi A7.`)}</p>}
                <div className="mt-1">
                  <RevealHint id={`eco-${id}-formula`} label={tt("Show the formula", "Formel zeigen")} title={tt("The formula · from Materi A7", "Die Formel · aus Materi A7")}>
                    <div className="space-y-1.5 text-caption text-ink">
                      <p>{tt("Cost per account = the measure's cost ÷ the number of accounts it reaches. Both are printed in the header of this card.", "Kosten pro Account = die Kosten der Maßnahme ÷ die Zahl der Accounts, die sie erreicht. Beides steht im Kopf dieser Karte.")}</p>
                      <p>{EV_RULE.v}</p>
                      <MaterialRefs refs={["A7"]} lead={tt("Taught in", "Gelehrt in")} />
                    </div>
                  </RevealHint>
                </div>
              </div>
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Score: ", "Wert: ")}
              {measureScored(l1, id) ? `${l1.rel[id]} × ${l1.dif[id]} × ${l1.eco[id]} = ` : tt("fill all three scores · ", "alle drei Werte ausfüllen · ")}
              <strong>{score || "—"}</strong>
            </p>
            {mentor && <MentorGuide guide={scoreGuide(id)} />}
          </div>
        );
      })}

      {chosen.length > 0 && (
        <div className="space-y-2">
          <p className="smallcaps">{tt("Which segments do your measures reach? (from what each measure really serves)", "Welche Segmente erreichen Ihre Maßnahmen? (aus dem, wem jede Maßnahme wirklich dient)")}</p>
          <ul className="grid gap-1.5 sm:grid-cols-3">
            {cov.map((c) => (
              <li key={c.segment} className={clsx("rounded-md border px-3 py-1.5 text-caption", c.covered ? "border-signal/40 bg-signalSoft text-ink" : "border-dashed border-ash bg-mist text-ink")}>
                <span aria-hidden>{c.covered ? "● " : "○ "}</span>
                <strong>{SEGMENTS[c.segment].label}</strong> ({VALUE_LABEL[ownValue(c.segment, tally)]}): {c.covered ? tt("at least one chosen measure serves it", "mindestens eine gewählte Maßnahme dient ihm") : tt("nothing you chose serves it", "nichts Gewähltes dient ihm")}
              </li>
            ))}
          </ul>
          <p className="text-micro normal-case tracking-normal text-ash">{tt("The value in brackets comes from your own placement in Block 2.1.", "Der Wert in Klammern kommt aus Ihrer eigenen Zuordnung in Block 2.1.")}</p>
        </div>
      )}

      <CheckBar onCheck={check} checkLabel={tt("Check my measures", "Meine Maßnahmen prüfen")} checks={l1.checks} />
      {chosen.length > 0 && l1.checks > 0 && (
        <Reading>
          {l1.measureFlags.length > 0
            ? tt(
                `${nAims} measure${nAims === 1 ? " names" : "s name"} segments that do not match what ${nAims === 1 ? "it serves" : "they serve"}, and ${nEco} economic viability score${nEco === 1 ? " does not" : "s do not"} follow the cost per account. They are outlined in the cards above.`,
                `${nAims} ${nAims === 1 ? "Maßnahme nennt" : "Maßnahmen nennen"} Segmente, die nicht zu dem passen, wem sie dienen, und ${nEco} ${nEco === 1 ? "Wirtschaftlichkeitswert folgt" : "Wirtschaftlichkeitswerte folgen"} nicht den Kosten pro Account. Sie sind in den Karten oben markiert.`,
              )
            : tt("The segments you named and the economic viability scores match the measures. Relevance and differentiation are your judgement.", "Die genannten Segmente und die Wirtschaftlichkeitswerte passen zu den Maßnahmen. Relevanz und Differenzierung sind Ihr Urteil.")}
          {cost > BUDGET ? tt(` The plan is ${euro(cost - BUDGET)} over the budget.`, ` Der Plan liegt ${euro(cost - BUDGET)} über dem Budget.`) : ""}
        </Reading>
      )}
      <AnswerKey block={measureKey()} />

      {chosen.length === CHOOSE && (
        <div id={IDS.order} className="space-y-2 border-t border-line pt-3">
          <p className="font-semibold text-ink">{tt("Put your three measures in priority order", "Bringen Sie Ihre drei Maßnahmen in eine Reihenfolge")}</p>
          <p className="text-caption text-ash">{tt("The first one is the one you start with. Use the arrows, then keep the order.", "Die erste ist die, mit der Sie beginnen. Nutzen Sie die Pfeile und behalten Sie dann die Reihenfolge.")}</p>
          <ol className="space-y-1.5">
            {shown.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-caption font-bold text-paper">{i + 1}</span>
                <span className="min-w-0 flex-1 text-caption text-ink">
                  {MEASURE_BY_ID[id].name} <span className="tnum text-ash">· {tt("score", "Wert")} {measureScore(l1, id) || "—"}</span>
                </span>
                <button type="button" onClick={() => move(id, -1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} up`, `${MEASURE_BY_ID[id].name} nach oben`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↑
                </button>
                <button type="button" onClick={() => move(id, 1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} down`, `${MEASURE_BY_ID[id].name} nach unten`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => patch({ order: [...shown] })} className={clsx("btn-sm", l1.order.length === CHOOSE ? "btn-ghost" : "btn-primary")}>
              {l1.order.length === CHOOSE && chosen.every((id) => l1.order.includes(id)) ? tt("✓ Order kept", "✓ Reihenfolge übernommen") : tt("Keep this order", "Diese Reihenfolge übernehmen")}
            </button>
            {inv.length > 0 && (
              <span role="status" className="text-caption text-ink">
                <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
                {inv.length === 1 ? tt("One measure sits above one with a higher score.", "Eine Maßnahme steht über einer mit höherem Wert.") : tt(`${inv.length} measures sit above ones with a higher score.`, `${inv.length} Maßnahmen stehen über solchen mit höherem Wert.`)}{" "}
                {tt("If the order is deliberate, say why in the field below.", "Ist die Reihenfolge Absicht, sagen Sie im Feld unten, warum.")}
              </span>
            )}
          </div>
          <AnswerKey block={orderKey()} />
          <TextBox
            id={IDS.why}
            label={tt("Why does your first priority go first?", "Warum kommt Ihre erste Priorität zuerst?")}
            help={tt(
              "Give the order, name the score or the segment value that decides it, say what the plan costs against the budget, and which segment you leave to a standard offer. At least 60 characters.",
              "Nennen Sie die Reihenfolge, den Wert oder den Segmentwert, der sie entscheidet, was der Plan gegen das Budget kostet und welches Segment Sie einem Standardangebot überlassen. Mindestens 60 Zeichen.",
            )}
            value={l1.why}
            onChange={(v) => patch({ why: v })}
            min={60}
            rows={4}
          >
            <WritingHelp
              id="why-help"
              steps={[
                tt("Say which measure goes first and why: its score, or the value of the segment it serves.", "Sagen Sie, welche Maßnahme zuerst kommt und warum: ihr Wert, oder der Wert des Segments, dem sie dient."),
                tt("Say what the three cost together against the €120,000.", "Sagen Sie, was die drei zusammen gegen die 120.000 € kosten."),
                tt("Say which segment no chosen measure serves, and how DataCloud will serve it instead.", "Sagen Sie, welchem Segment keine gewählte Maßnahme dient, und wie DataCloud es stattdessen bedient."),
              ]}
              refs={[
                { label: tt("Budget", "Budget"), value: euro(BUDGET), target: IDS.measurePick },
                { label: tt("Time", "Zeit"), value: tt(`${MONTHS} months`, `${MONTHS} Monate`), target: IDS.measurePick },
              ]}
            />
          </TextBox>
          <ExampleAnswer id="why-example" guide={whyGuide()} />
          {mentor && <MentorGuide guide={whyGuide()} />}
        </div>
      )}
      <BlockMissing block="2.3" route={1} />
    </AnswerBlock>
  );
}
