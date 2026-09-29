"use client";

import { Block31, Block32, Block33, Block34, Block35, Block36 } from "@/components/task2/Blocks";
import { MemoPanel } from "@/components/task2/MemoPanel";
import { ExportBar } from "@/components/ui/ExportBar";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { Callout } from "@/components/ui/MaterialCard";
import { MEASURE_BY_ID } from "@/data/measures";
import { SEGMENTS, SEGMENT_IDS, VALUE_LABEL } from "@/data/segments";
import { R2_BUDGET, R2_MONTHS } from "@/data/route2";
import { Gloss } from "@/lib/glossify";
import { ownValue, tallyOf } from "@/lib/checks";
import { euro, tt } from "@/lib/lang";
import { memoBody } from "@/lib/exportDoc";
import { r2Missing } from "@/lib/missing";
import { BLOCK_MINUTES, TASK2_MINUTES } from "@/lib/routes";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";

/** The situation of Route 2, stated once, directly above the task, with a soft pointer to the learner's own Route 1 answers. */
function CaseBrief() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const jump = useJumpTo();
  // Read from Core blocks only (CLAUDE.md #40): the values come from the learner's own placement in Block 2.1, not from the
  // Optional Block 2.2.
  const tally = tallyOf(p.l1.assign);
  const rated = tally.placed > 0 ? SEGMENT_IDS.map((s) => `${SEGMENTS[s].label} (${VALUE_LABEL[ownValue(s, tally)]})`) : [];
  const chosen = p.l1.chosen.map((id) => MEASURE_BY_ID[id].name);
  const has = hydrated && (rated.length > 0 || chosen.length > 0);
  return (
    <section id="task-2" aria-labelledby="task2-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="task2-h">{tt("The situation: you are the Chief Sales Officer", "Die Lage: Sie sind Chief Sales Officer")}</h2>
        <span className="smallcaps">{tt("Read once · about 4 min", "Einmal lesen · ca. 4 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            "DataCloud Services has run its first personalisation measures for twelve accounts. You now own the whole sales organisation, and the board wants a segment-based sales strategy for the next six months. The target group strategy is unclear: DataCloud addresses the whole Mittelstand with one offer. Resources are limited, the market is heterogeneous, and the customer data is incomplete. You are asked to make a strategic segment decision anyway.",
            "DataCloud Services hat seine ersten Personalisierungsmaßnahmen für zwölf Accounts umgesetzt. Sie verantworten jetzt die gesamte Vertriebsorganisation, und der Vorstand will für die nächsten sechs Monate eine segmentbasierte Vertriebsstrategie. Die Zielgruppenstrategie ist unklar: DataCloud spricht den ganzen Mittelstand mit einem Angebot an. Die Ressourcen sind begrenzt, der Markt ist heterogen, und die Kundendaten sind unvollständig. Sie sollen trotzdem eine strategische Segmententscheidung treffen.",
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(R2_BUDGET)}</strong> {tt("(Case assumption)", "(Fallannahme)")}
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${R2_MONTHS} months`, `${R2_MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The data on five candidate segments is printed in Block 3.2; baselines for the tripwire in Block 3.6.", "Die Daten zu fünf Kandidatensegmenten stehen in Block 3.2; Ausgangswerte für den Tripwire in Block 3.6.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption md:col-span-2">
          <p className="smallcaps">{tt(`What you build · about ${TASK2_MINUTES} min`, `Was Sie bauen · ca. ${TASK2_MINUTES} Min.`)}</p>
          <ol className="mt-1 grid list-decimal gap-x-6 pl-4 text-ink sm:grid-cols-2">
            <li>{tt("Criteria for segment prioritisation", "Kriterien für die Segmentpriorisierung")}</li>
            <li>{tt("The definition of your core target segments", "Die Definition Ihrer Kernzielsegmente")}</li>
            <li>{tt("A sales strategy per segment", "Eine Vertriebsstrategie pro Segment")}</li>
            <li>{tt("Standardisation against individualisation", "Standardisierung gegen Individualisierung")}</li>
            <li>{tt("The measures architecture", "Die Maßnahmenarchitektur")}</li>
            <li>{tt("A segment decision despite incomplete data", "Eine Segmententscheidung trotz unvollständiger Daten")}</li>
          </ol>
        </div>
      </div>
      <div role="note" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink" id="task1-quote">
        <p className="smallcaps text-accent">{tt("Where Route 1 left off · your own answers", "Wo Route 1 aufgehört hat · Ihre eigenen Antworten")}</p>
        {has ? (
          <p className="mt-1">
            {tt("Segment values from your placement in Block 2.1: ", "Segmentwerte aus Ihrer Zuordnung in Block 2.1: ")}
            <strong>{rated.join(", ") || tt("none yet", "noch keine")}</strong>. {tt("Measures you chose: ", "Von Ihnen gewählte Maßnahmen: ")}
            <strong>{chosen.join(", ") || tt("none yet", "noch keine")}</strong>.
          </p>
        ) : (
          <p className="mt-1">{tt("You have not answered Route 1 yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben Route 1 noch nicht beantwortet. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        )}
        <button type="button" onClick={() => jump("block-2-3", "/route-1/")} className="btn-ghost btn-sm mt-2">
          {tt("Go to Block 2.3 in Route 1", "Zu Block 2.3 in Route 1")}
        </button>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief gives the role and the situation: an unclear target group strategy, limited resources, a heterogeneous market, budget restrictions, incomplete customer data and time pressure, and the requirement to decide anyway. The budget, the segment data, the costs and the baselines are made up for this exercise.",
            "Der Auftrag gibt Rolle und Lage vor: eine unklare Zielgruppenstrategie, begrenzte Ressourcen, einen heterogenen Markt, Budgetgrenzen, unvollständige Kundendaten und Zeitdruck, und die Pflicht, trotzdem zu entscheiden. Budget, Segmentdaten, Kosten und Ausgangswerte sind für diese Übung erfunden.",
          )}
        </p>
      </Callout>
    </section>
  );
}

export function Task2() {
  const p = usePersisted();
  const missing = r2Missing(p);
  const filename = exportName(p.participant.name, "l3-strategy-memo");
  return (
    <div className="space-y-6">
      <CaseBrief />
      <OptionalSection
        id="block-3-1"
        title={tt("Block 3.1 · Prioritisation criteria", "Block 3.1 · Priorisierungskriterien")}
        minutes={BLOCK_MINUTES["3.1"]}
        reason={tt("Names the criteria behind the ratings; Block 3.2 can rate the segments without a separate ranking of criteria.", "Benennt die Kriterien hinter den Bewertungen; Block 3.2 kann die Segmente auch ohne eine eigene Rangfolge der Kriterien bewerten.")}
      >
        <Block31 />
      </OptionalSection>
      <Block32 />
      <OptionalSection
        id="block-3-3"
        title={tt("Block 3.3 · A sales model per segment", "Block 3.3 · Ein Vertriebsmodell pro Segment")}
        minutes={BLOCK_MINUTES["3.3"]}
        reason={tt("Turns the chosen segments into sales models; the measures in Block 3.5 and the decision in Block 3.6 do not require it.", "Macht aus den gewählten Segmenten Vertriebsmodelle; die Maßnahmen in Block 3.5 und die Entscheidung in Block 3.6 setzen es nicht voraus.")}
      >
        <Block33 />
      </OptionalSection>
      <OptionalSection
        id="block-3-4"
        title={tt("Block 3.4 · Standardise or individualise", "Block 3.4 · Standardisieren oder individualisieren")}
        minutes={BLOCK_MINUTES["3.4"]}
        reason={tt("A design question on how much of the offer is fixed; the decision in Block 3.6 can be made and defended without it.", "Eine Designfrage dazu, wie viel vom Angebot feststeht; die Entscheidung in Block 3.6 lässt sich auch ohne sie treffen und begründen.")}
      >
        <Block34 />
      </OptionalSection>
      <Block35 />
      <Block36 />
      <MemoPanel />
      <ExportBar
        id="export-l3"
        previewTitle={tt("Preview of your memo", "Vorschau Ihres Memos")}
        exportLabel={tt("Export the Segment Strategy Memo", "Segment Strategy Memo exportieren")}
        docTitle="Segment Strategy Memo"
        filename={filename}
        missing={missing}
        buildBody={() => memoBody(p)}
        showPreview={false}
      />
    </div>
  );
}
