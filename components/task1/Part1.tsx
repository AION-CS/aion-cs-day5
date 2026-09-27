"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { CheckBar, OptionList, Reading, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { CRIT_TAGS, CRIT_TESTS, FIELDS } from "@/data/criteria";
import type { CritTag, FieldId } from "@/data/criteria";
import { DATACLOUD, FIGURES, FIGURE_IDS } from "@/data/tailoring";
import type { FigureId } from "@/data/tailoring";
import { BASES, BASIS_LABEL, DIFF_QUESTION, SKETCH_COUNT, SKETCH_FRAME, SKETCH_MIN, TG_QUESTION } from "@/data/sketches";
import type { Basis, DiffId, TgId } from "@/data/sketches";
import { FIGURE_BUILDERS, figAnswer, figurePartFlags, partKey } from "@/lib/calcBuilder";
import { choiceFlags, citesTailorFigure, figMatches, sketchFlags, sortHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { IDS } from "@/lib/missing";
import { euro, pct, tt } from "@/lib/lang";
import { extraCritGuide, figureGuide, reflectGuide, sketchGuide, worthGuide } from "@/lib/mentorGuide";
import { diffKey, sortKey, tgKey } from "@/lib/answerKey";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function Block11() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeField);
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  return (
    <AnswerBlock
      id="block-1-1"
      title={tt("Block 1.1 · Sort the CRM fields by kind of criterion", "Block 1.1 · Die CRM-Felder nach Art des Kriteriums sortieren")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["1.1"]}
      findIt={tt(
        "Route 1 → Task 1 → the nine fields on the sort board below, copied from DataCloud's CRM export. Answer on the sort board.",
        "Route 1 → Task 1 → die neun Felder auf der Sortiertafel unten, kopiert aus dem CRM-Export von DataCloud. Antworten Sie auf der Sortiertafel.",
      )}
    >
      <MaterialRefs refs={["A3"]} />
      <PlacementBoard<CritTag>
        items={FIELDS.map((f, i) => ({ id: f.id, meta: tt(`CRM field ${i + 1}`, `CRM-Feld ${i + 1}`), text: f.text }))}
        bins={CRIT_TAGS.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
        value={l1.sort}
        onPlace={(id, tag) => place(id as FieldId, tag)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.sortHistory.length}
        redoCount={l1.sortFuture.length}
        domId={IDS.field}
        clues={Object.fromEntries(FIELDS.map((f) => [f.id, f.clue]))}
        reasons={Object.fromEntries(FIELDS.map((f) => [f.id, f.why]))}
        result={l1.sortResult}
        checks={l1.sortChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, sortChecks: s.sortChecks + 1, sortResult: sortHolds(s.sort) }))}
        onClue={() => patch({ sortClue: true })}
        clueShown={l1.sortClue}
        reasoningOpened={l1.sortReasoning}
        onOpenReasoning={() => patch({ sortReasoning: true })}
        noun={tt("field", "Feld")}
        intro={tt("Drag a field into a bin, or select it and then select a bin. Select a placed one to move it again.", "Ziehen Sie ein Feld in eine Spalte, oder wählen Sie es aus und dann eine Spalte. Wählen Sie ein platziertes Feld, um es erneut zu verschieben.")}
        tests={
          <RevealHint id="sort-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A3", "Testfragen · aus Materi A3")}>
            <div className="space-y-2 text-caption text-ink">
              <p>{tt("Ask these of every field. They repeat the tests from Materi A3; they never say which field goes where.", "Stellen Sie diese Fragen zu jedem Feld. Sie wiederholen die Tests aus Materi A3; sie sagen nie, welches Feld wohin gehört.")}</p>
              <ul className="space-y-1.5">
                {CRIT_TESTS.map((c) => (
                  <li key={c.name}>
                    <span className="font-semibold">{c.name}. </span>
                    <Gloss>{c.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A3"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <TextBox
        id={IDS.extraCrit}
        label={tt("One criterion of your own that DataCloud should record, and its kind", "Ein eigenes Kriterium, das DataCloud erfassen sollte, und seine Art")}
        help={tt(
          "Name one more field that would help DataCloud tell its customers apart, and say whether it is firmographic, behaviour-based or needs-based. At least 30 characters.",
          "Nennen Sie ein weiteres Feld, das DataCloud helfen würde, seine Kunden zu unterscheiden, und sagen Sie, ob es firmografisch, verhaltensbasiert oder bedarfsbasiert ist. Mindestens 30 Zeichen.",
        )}
        value={l1.extraCrit}
        onChange={(v) => patch({ extraCrit: v })}
        min={MIN_LINE}
        rows={2}
      />
      {mentor && <MentorGuide guide={extraCritGuide()} />}
      <p className="text-caption text-ash">
        {tt("Words in the fields, explained in plain language: ", "Begriffe in den Feldern, einfach erklärt: ")}
        <Gloss>{tt("NACE, CRM.", "NACE, CRM.")}</Gloss>
      </p>
      <AnswerKey block={sortKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.2 */

const row = (id: string, label: string, value: string) => (
  <tr id={id} className="border-t border-line">
    <td className="px-3 py-2">{label}</td>
    <td className="tnum px-3 py-2 text-right font-semibold">{value}</td>
  </tr>
);

function PilotTable({ seg, name }: { seg: "assure" | "handsoff"; name: string }) {
  const d = DATACLOUD[seg];
  return (
    <div className="relative overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-caption">
        <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt(`DataCloud's pilot · ${name}`, `Pilot von DataCloud · ${name}`)}</caption>
        <tbody>
          {row(`tailor-${seg}-proposals`, tt("Proposals per year", "Angebote pro Jahr"), String(d.proposals))}
          {row(`tailor-${seg}-standard`, tt("Win rate with the standard offer", "Win Rate mit Standardangebot"), pct(d.standard))}
          {row(`tailor-${seg}-tailored`, tt("Win rate with the tailored approach (pilot)", "Win Rate mit zugeschnittenem Ansatz (Pilot)"), pct(d.tailored))}
          {row(`tailor-${seg}-acv`, tt("Average first-year contract value", "Durchschnittlicher Erstjahres-Vertragswert"), euro(d.acv))}
        </tbody>
      </table>
    </div>
  );
}

export function Block12() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);

  const setFig = (id: FigureId, v: string) => patch((s) => ({ fig: { ...s.fig, [id]: v }, figFlagged: s.figFlagged.filter((f) => f !== id), worthFlagged: false }));
  const check = () =>
    patch((s) => {
      const parts = figurePartFlags(s.parts);
      const figFlagged = FIGURE_IDS.filter((id) => s.fig[id].trim() !== "" && !figMatches(s.fig[id], figAnswer(id)));
      const w = s.worth.trim();
      return { checks: s.checks + 1, figFlagged, figClue: {}, partFlags: parts, worthFlagged: w !== "" && (w.length < MIN_SENTENCE || !citesTailorFigure(w)), worthClue: false };
    });

  return (
    <AnswerBlock
      id="block-1-2"
      title={tt("Block 1.2 · Is tailoring worth it? Effort against benefit", "Block 1.2 · Lohnt sich der Zuschnitt? Aufwand gegen Nutzen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["1.2"]}
      findIt={tt(
        "Route 1 → Task 1 → the three tables “DataCloud's pilot” directly below. The numbers are printed there. Answer in the fields under the tables.",
        "Route 1 → Task 1 → die drei Tabellen „Pilot von DataCloud“ direkt darunter. Die Zahlen stehen dort. Antworten Sie in den Feldern unter den Tabellen.",
      )}
    >
      <MaterialRefs refs={["A4"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "DataCloud tried a tailored approach for six months with two segments. The tables give the pilot's results. Work out, for each segment, whether tailoring pays. The numbers you need are in the tables below. Look for them first; the buttons “Show where the numbers are” and “Show the formula” are there if you get stuck. The method is taught in",
            "DataCloud hat sechs Monate lang einen zugeschnittenen Ansatz mit zwei Segmenten getestet. Die Tabellen zeigen die Ergebnisse des Pilots. Rechnen Sie für jedes Segment aus, ob sich der Zuschnitt lohnt. Die Zahlen stehen in den Tabellen unten. Suchen Sie sie zuerst selbst; die Schaltflächen „Zeigen, wo die Zahlen stehen“ und „Formel zeigen“ helfen, wenn Sie nicht weiterkommen. Die Methode steht in",
          )}
        </Gloss>{" "}
        <button type="button" onClick={() => scrollToAndFlash("mat-A4", "ref")} className="font-semibold text-accent underline decoration-dotted underline-offset-2">
          Materi A4
        </button>
        {tt(", on other numbers. What you practise is combining them correctly.", ", mit anderen Zahlen. Was Sie üben, ist, sie richtig zu kombinieren.")}
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <PilotTable seg="assure" name="Compliance-first" />
        <PilotTable seg="handsoff" name="Hands-off" />
        <div className="relative overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Both segments (Case assumption)", "Beide Segmente (Fallannahme)")}</caption>
            <tbody>
              {row("tailor-margin", tt("Gross margin", "Bruttomarge"), pct(DATACLOUD.margin))}
              {row("tailor-cost", tt("Yearly cost of the tailored approach, per segment", "Jährliche Kosten des zugeschnittenen Ansatzes, pro Segment"), euro(DATACLOUD.cost))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-5">
        {FIGURE_IDS.map((id) => {
          const f = FIGURES[id];
          const b = FIGURE_BUILDERS[id];
          const flagged = l1.figFlagged.includes(id);
          const partsFlagged = b.parts.some((p) => l1.partFlags.includes(partKey(id, p.id)));
          return (
            <div key={id} className="space-y-2">
              <Field
                id={IDS.figure(id)}
                htmlFor={`fig-${id}-in`}
                label={f.label}
                help={tt(`${f.question} Type the figure in euros, for example 12500 or -4000.`, `${f.question} Tippen Sie den Wert in Euro, zum Beispiel 12500 oder -4000.`)}
                flagged={flagged}
                clue={f.clue}
                clueShown={!!l1.figClue[id]}
                onShowClue={() => patch((s) => ({ figClue: { ...s.figClue, [id]: true } }))}
              >
                <input id={`fig-${id}-in`} className="field tnum max-w-xs" inputMode="decimal" autoComplete="off" value={l1.fig[id]} onChange={(e) => setFig(id, e.target.value)} aria-invalid={flagged || undefined} />
              </Field>
              {flagged && (
                <CalcDiagnosis
                  builder={b}
                  figure={id}
                  parts={l1.parts}
                  partFlags={l1.partFlags}
                  name={tt(`your ${id}`, `Ihr ${id}`)}
                  mismatch={(r) => tt(`The parts in the formula calculator are right and give ${r}, but the figure you entered differs. Press “Use this result in ${id}” or check the entry.`, `Die Teile im Formelrechner stimmen und ergeben ${r}, aber Ihr eingetragener Wert weicht ab. Drücken Sie „Ergebnis übernehmen in ${id}“ oder prüfen Sie den Eintrag.`)}
                />
              )}
              <div className="flex flex-wrap items-start gap-2">
                <RevealHint id={`fig-${id}-where`} label={tt("Show where the numbers are", "Zeigen, wo die Zahlen stehen")} title={tt("Numbers you need · the printed rows", "Zahlen, die Sie brauchen · die gedruckten Zeilen")}>
                  <ul className="space-y-1 text-caption">
                    {f.sources.map((s) => (
                      <li key={s.label}>
                        <button type="button" onClick={() => scrollToAndFlash(s.target, "ref")} className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft">
                          <span className="text-ink">{s.label}:</span>
                          <span className="tnum font-semibold text-ink">{s.value}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </RevealHint>
                <RevealHint id={`fig-${id}-formula`} label={tt("Show the formula", "Formel zeigen")} title={tt(`The formula · from Materi ${f.taughtIn}`, `Die Formel · aus Materi ${f.taughtIn}`)} forceOpen={partsFlagged}>
                  <p className="text-caption text-ink">
                    <Gloss>{f.formula}</Gloss>
                  </p>
                  <FormulaBuilder
                    figure={id}
                    builder={b}
                    parts={l1.parts}
                    partFlags={l1.partFlags}
                    onPart={(k, v) => patch((s) => ({ parts: { ...s.parts, [k]: v }, partFlags: s.partFlags.filter((x) => x !== k) }))}
                    onUse={(v) => setFig(id, String(Math.round(v)))}
                    unit="€"
                    label={id}
                    source={id === "F3" ? tt("your F2 and the cost line", "Ihrem F2 und der Kostenzeile") : tt("the tables above", "den Tabellen oben")}
                  />
                </RevealHint>
              </div>
              {mentor && <MentorGuide guide={figureGuide(id)} />}
            </div>
          );
        })}
      </div>

      <TextBox
        id={IDS.worth}
        label={tt("Where is tailoring worth it, and where is a standard offer better?", "Wo lohnt sich der Zuschnitt, und wo ist ein Standardangebot besser?")}
        help={tt(
          "One or two sentences. Use at least one figure from your calculation, and say for which segment tailoring pays and for which it does not.",
          "Ein oder zwei Sätze. Nutzen Sie mindestens eine Zahl aus Ihrer Rechnung, und sagen Sie, für welches Segment sich der Zuschnitt lohnt und für welches nicht.",
        )}
        value={l1.worth}
        onChange={(v) => patch({ worth: v, worthFlagged: false })}
        min={MIN_SENTENCE}
        rows={4}
        flagged={l1.worthFlagged}
        clue={tt(
          "Which of your figures shows the benefit, and which shows what is left after the cost? A sentence that quotes one of them and names the segment is enough.",
          "Welche Ihrer Zahlen zeigt den Nutzen, und welche zeigt, was nach den Kosten übrig bleibt? Ein Satz, der eine davon zitiert und das Segment nennt, reicht.",
        )}
        clueShown={l1.worthClue}
        onShowClue={() => patch({ worthClue: true })}
      >
        <WritingHelp
          id="worth-help"
          steps={[
            tt("Say which segment gains more gross profit from tailoring, and by how much.", "Sagen Sie, welches Segment mehr Rohertrag durch den Zuschnitt gewinnt, und wie viel."),
            tt("Subtract the yearly cost for both segments and say which net result is positive.", "Ziehen Sie für beide Segmente die jährlichen Kosten ab und sagen Sie, welches Nettoergebnis positiv ist."),
            tt("Finish with what DataCloud should do for the other segment instead.", "Schließen Sie damit, was DataCloud stattdessen für das andere Segment tun sollte."),
          ]}
          refs={[
            { label: tt("Yearly cost per segment", "Jährliche Kosten pro Segment"), value: euro(DATACLOUD.cost), target: "tailor-cost" },
            { label: tt("Gross margin", "Bruttomarge"), value: pct(DATACLOUD.margin), target: "tailor-margin" },
          ]}
        />
      </TextBox>
      {mentor && <MentorGuide guide={worthGuide()} />}

      <CheckBar onCheck={check} checkLabel={tt("Check my figures and sentence", "Meine Werte und meinen Satz prüfen")} checks={l1.checks} />
      {l1.checks > 0 && (
        <Reading>
          {l1.figFlagged.length === 0 && !l1.worthFlagged && l1.partFlags.length === 0
            ? tt("Nothing is outlined by the last check.", "Die letzte Prüfung hat nichts markiert.")
            : tt(
                `${l1.figFlagged.length > 0 ? `${l1.figFlagged.length} figure${l1.figFlagged.length === 1 ? " is" : "s are"} outlined above. Each says what to check.` : ""}${l1.worthFlagged ? " The sentence needs at least one of your calculated figures." : ""}${l1.partFlags.length > 0 ? " A part of the formula calculator is outlined." : ""}`,
                `${l1.figFlagged.length > 0 ? `${l1.figFlagged.length} ${l1.figFlagged.length === 1 ? "Wert ist" : "Werte sind"} oben markiert. Jeder sagt, was zu prüfen ist.` : ""}${l1.worthFlagged ? " Der Satz braucht mindestens eine Ihrer berechneten Zahlen." : ""}${l1.partFlags.length > 0 ? " Ein Teil des Formelrechners ist markiert." : ""}`,
              )}
        </Reading>
      )}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.3 */

export function Block13() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const checkChoices = () => patch((s) => ({ checks: s.checks + 1, choiceChecked: true, choiceFlags: choiceFlags(s), choiceClue: false }));
  const checkSketches = () => patch((s) => ({ checks: s.checks + 1, sketchChecked: true, sketchClue: false, sketchFlagged: sketchFlags(s) }));
  const setRow = (i: number, p: Partial<{ basis: Basis | null; text: string }>) =>
    patch((s) => ({ sketches: s.sketches.map((h, j) => (j === i ? { ...h, ...p } : h)), sketchFlagged: s.sketchFlagged.filter((x) => x !== i) }));
  return (
    <AnswerBlock
      id="block-1-3"
      title={tt("Block 1.3 · Target group, where accounts differ, three segment sketches", "Block 1.3 · Zielgruppe, wo Accounts sich unterscheiden, drei Segmentskizzen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["1.3"]}
      findIt={tt(
        "Route 1 → Task 1 → the sentence from DataCloud's strategy paper below, the twelve accounts in Block 2.1 and the kinds of criteria in Materi A2 and A3. Answer in the fields below.",
        "Route 1 → Task 1 → der Satz aus dem Strategiepapier von DataCloud unten, die zwölf Accounts in Block 2.1 und die Arten von Kriterien in Materi A2 und A3. Antworten Sie in den Feldern unten.",
      )}
    >
      <MaterialRefs refs={["A2", "A3", "A5"]} />
      <div id={IDS.tg} className={clsx("space-y-2 rounded-lg p-1", l1.choiceFlags.includes("tg") && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("a · Target group or segment?", "a · Zielgruppe oder Segment?")}</p>
        <blockquote className="border-l-4 border-gold bg-accentSoft px-3 py-2 text-body text-ink">
          <Gloss>{TG_QUESTION.statement}</Gloss>
        </blockquote>
        <OptionList<TgId> label={tt("Target group or segment", "Zielgruppe oder Segment")} value={l1.tg} onChange={(v) => patch((s) => ({ tg: v, choiceFlags: s.choiceFlags.filter((x) => x !== "tg") }))} options={TG_QUESTION.options} />
        {l1.choiceFlags.includes("tg") && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {TG_QUESTION.clue}
          </p>
        )}
        <AnswerKey block={tgKey()} />
      </div>
      <div id={IDS.diff} className={clsx("space-y-2 rounded-lg p-1", l1.choiceFlags.includes("diff") && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("b · Where do the accounts differ the most?", "b · Wo unterscheiden sich die Accounts am stärksten?")}</p>
        <p className="text-caption text-ash">{DIFF_QUESTION.statement}</p>
        <OptionList<DiffId> cols={2} label={tt("Where the accounts differ most", "Wo sich die Accounts am stärksten unterscheiden")} value={l1.diff} onChange={(v) => patch((s) => ({ diff: v, choiceFlags: s.choiceFlags.filter((x) => x !== "diff") }))} options={DIFF_QUESTION.options} />
        {l1.choiceFlags.includes("diff") && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {DIFF_QUESTION.clue}
          </p>
        )}
        <AnswerKey block={diffKey()} />
      </div>
      <CheckBar onCheck={checkChoices} checkLabel={tt("Check a and b", "a und b prüfen")} checks={l1.checks} />
      {l1.choiceChecked && (
        <Reading>
          {l1.choiceFlags.length === 0
            ? tt("Nothing is outlined: both answers hold, or one is still open.", "Nichts ist markiert: Beide Antworten stimmen, oder eine ist noch offen.")
            : tt(`${l1.choiceFlags.length} of the two answers ${l1.choiceFlags.length === 1 ? "is" : "are"} outlined, with a clue.`, `${l1.choiceFlags.length} der zwei Antworten ${l1.choiceFlags.length === 1 ? "ist" : "sind"} markiert, mit Hinweis.`)}
        </Reading>
      )}

      <div className="space-y-3 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("c · Three segments of your own", "c · Drei eigene Segmente")}</p>
        <p className="text-body text-ink">
          <Gloss>
            {tt(
              "Before you use DataCloud's segments in Part 2, sketch three segments you would form from what you have read. Give each a basis and describe who is in it, what they need and how they decide. At most one may rest on firmographics alone.",
              "Bevor Sie in Teil 2 die Segmente von DataCloud nutzen, skizzieren Sie drei Segmente, die Sie aus dem Gelesenen bilden würden. Geben Sie jedem eine Grundlage und beschreiben Sie, wer dazugehört, was sie brauchen und wie sie entscheiden. Höchstens eines darf nur auf Firmografie beruhen.",
            )}
          </Gloss>
        </p>
        <p className="text-caption text-ash">
          {tt("The frame: ", "Der Rahmen: ")}
          {SKETCH_FRAME.v}
        </p>
        {l1.sketches.map((h, i) => {
          const flagged = l1.sketchFlagged.includes(i);
          return (
            <div key={i} className="space-y-1.5">
              <TextBox
                id={IDS.sketch(i)}
                label={tt(`Segment sketch ${i + 1}`, `Segmentskizze ${i + 1}`)}
                help={tt(`Choose the basis, then write the sketch in one or two sentences that name a need, at least ${SKETCH_MIN} characters.`, `Wählen Sie die Grundlage und schreiben Sie dann die Skizze in ein oder zwei Sätzen, die einen Bedarf nennen, mindestens ${SKETCH_MIN} Zeichen.`)}
                value={h.text}
                onChange={(v) => setRow(i, { text: v })}
                min={SKETCH_MIN}
                flagged={flagged}
                clue={tt(`Use the frame: ${SKETCH_FRAME.v} Name what the accounts need, and base no more than one sketch on industry or size alone.`, `Nutzen Sie den Rahmen: ${SKETCH_FRAME.v} Nennen Sie, was die Accounts brauchen, und stützen Sie höchstens eine Skizze nur auf Branche oder Größe.`)}
                clueShown={l1.sketchClue}
                onShowClue={() => patch({ sketchClue: true })}
              >
                <div>
                  <label htmlFor={`sketch-${i}-basis`} className="smallcaps block">
                    {tt("Basis", "Grundlage")}
                  </label>
                  <select id={`sketch-${i}-basis`} className="field mt-1 max-w-md" value={h.basis ?? ""} onChange={(e) => setRow(i, { basis: (e.target.value || null) as Basis | null })}>
                    <option value="">{tt("Choose a basis…", "Grundlage wählen…")}</option>
                    {BASES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} (Materi {m.from})
                      </option>
                    ))}
                  </select>
                  {h.basis && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{tt("Chosen: ", "Gewählt: ")}{BASIS_LABEL[h.basis]}</p>}
                </div>
              </TextBox>
              {mentor && <MentorGuide guide={sketchGuide(i)} />}
            </div>
          );
        })}
        <CheckBar onCheck={checkSketches} checkLabel={tt("Check my sketches", "Meine Skizzen prüfen")} checks={l1.checks} />
        {l1.sketchChecked && (
          <Reading>
            {l1.sketchFlagged.length === 0
              ? tt(`All ${SKETCH_COUNT} sketches have a basis and name a need. Whether they are useful segments is for you and your facilitator to judge, with the five tests of Materi A1.`, `Alle ${SKETCH_COUNT} Skizzen haben eine Grundlage und nennen einen Bedarf. Ob sie nützliche Segmente sind, beurteilen Sie und Ihre Moderation mit den fünf Tests aus Materi A1.`)
              : tt(`${l1.sketchFlagged.length} sketch${l1.sketchFlagged.length === 1 ? " is" : "es are"} outlined: a basis is missing, the text is short, it names no need, or it is a second firmographic-only segment.`, `${l1.sketchFlagged.length} ${l1.sketchFlagged.length === 1 ? "Skizze ist" : "Skizzen sind"} markiert: Eine Grundlage fehlt, der Text ist kurz, er nennt keinen Bedarf, oder es ist ein zweites rein firmografisches Segment.`)}
          </Reading>
        )}
      </div>
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.4 */

export function Block14() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const fields: { k: "simplify" | "worth" | "prioritise"; label: string; help: string }[] = [
    {
      k: "simplify",
      label: tt("Where did I oversimplify, or reach for the easy criterion?", "Wo habe ich vereinfacht oder zum bequemen Kriterium gegriffen?"),
      help: tt("One or two sentences about something you actually did in Blocks 1.1 to 1.3, for example how you first grouped the accounts.", "Ein oder zwei Sätze über etwas, das Sie in den Blöcken 1.1 bis 1.3 wirklich getan haben, zum Beispiel wie Sie die Accounts zuerst gruppiert haben."),
    },
    {
      k: "worth",
      label: tt("When does personalising make sense, and when not?", "Wann ist Personalisierung sinnvoll, und wann nicht?"),
      help: tt("Name one situation where it pays and one where a standard offer is better, and why. Your figures from Block 1.2 can help.", "Nennen Sie eine Situation, in der sie sich lohnt, und eine, in der ein Standardangebot besser ist, und warum. Ihre Zahlen aus Block 1.2 können helfen."),
    },
    {
      k: "prioritise",
      label: tt("How would a strategic decision-maker prioritise the segments?", "Wie würde eine strategische Entscheiderin die Segmente priorisieren?"),
      help: tt("What would they look at first, and what would they do with the segments that do not come first? Be concrete.", "Worauf würde sie zuerst schauen, und was würde sie mit den Segmenten tun, die nicht zuerst kommen? Seien Sie konkret."),
    },
  ];
  return (
    <AnswerBlock
      id="block-1-4"
      title={tt("Block 1.4 · Coaching reflection: from Level 1 to Level 2", "Block 1.4 · Coaching-Reflexion: von Level 1 zu Level 2")}
      kind="JUDGED"
      minutes={BLOCK_MINUTES["1.4"]}
      findIt={tt(
        "Route 1 → Task 1 → your own answers in Blocks 1.1 to 1.3 above, and the three ways segmentation fails in Materi A6. Answer in the three fields below.",
        "Route 1 → Task 1 → Ihre eigenen Antworten in den Blöcken 1.1 bis 1.3 oben und die drei Arten, wie Segmentierung scheitert, in Materi A6. Antworten Sie in den drei Feldern unten.",
      )}
    >
      <MaterialRefs refs={["A4", "A6"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Before you place the twelve accounts, look at how you reasoned so far. Why do segmentations fail in practice? What is the difference between having data and understanding segments? And where is it oversimplified?",
            "Bevor Sie die zwölf Accounts zuordnen, schauen Sie, wie Sie bisher gedacht haben. Warum scheitern Segmentierungen in der Praxis? Was ist der Unterschied zwischen Daten haben und Segmente verstehen? Und wo wird vereinfacht?",
          )}
        </Gloss>
      </p>
      {fields.map((f) => (
        <div key={f.k} className="space-y-1.5">
          <TextBox id={IDS.reflect(f.k)} label={f.label} help={f.help} value={l1.reflect[f.k]} onChange={(v) => patch((s) => ({ reflect: { ...s.reflect, [f.k]: v } }))} min={MIN_LINE} rows={3} />
          {mentor && <MentorGuide guide={reflectGuide(f.k)} />}
        </div>
      ))}
    </AnswerBlock>
  );
}
