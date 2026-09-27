"use client";

import { ExportBar } from "@/components/ui/ExportBar";
import { Block11, Block12, Block13, Block14 } from "@/components/task1/Part1";
import { Block21, Block22, Block23 } from "@/components/task1/Part2";
import { Callout } from "@/components/ui/MaterialCard";
import { BUDGET, MONTHS } from "@/data/measures";
import { segmentBody } from "@/lib/exportDoc";
import { l1Missing } from "@/lib/missing";
import { euro, tt } from "@/lib/lang";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { Gloss } from "@/lib/glossify";
import { TASK1_MINUTES } from "@/lib/routes";

/** The case, stated once, directly above the task. */
function CaseBrief() {
  return (
    <section id="case-brief" aria-labelledby="case-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="case-h">{tt("The case: DataCloud Services GmbH", "Der Fall: DataCloud Services GmbH")}</h2>
        <span className="smallcaps">{tt("Read once · about 5 min", "Einmal lesen · ca. 5 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            "DataCloud Services GmbH is a German cloud provider for the Mittelstand: hosting, backup and managed cloud platforms from two data centres in Germany. Its offers go out in one version to every prospect. The results show it: the offers appear generic, the conversion rate is low, and customers say they do not feel understood. Management wants DataCloud to understand its customers in segments and to personalise where it pays.",
            "DataCloud Services GmbH ist ein deutscher Cloud-Anbieter für den Mittelstand: Hosting, Backup und gemanagte Cloud-Plattformen aus zwei Rechenzentren in Deutschland. Seine Angebote gehen in einer Version an jeden Prospect. Die Ergebnisse zeigen es: Die Angebote wirken generisch, die Conversion Rate ist niedrig, und Kunden sagen, sie fühlen sich nicht verstanden. Die Geschäftsführung will, dass DataCloud seine Kunden in Segmenten versteht und dort personalisiert, wo es sich lohnt.",
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("What you have", "Was Sie haben")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>{tt("Nine fields from DataCloud's CRM export, printed in Block 1.1.", "Neun Felder aus dem CRM-Export von DataCloud, abgedruckt in Block 1.1.")}</li>
            <li>{tt("The results of a six-month pilot with a tailored approach, printed in Block 1.2.", "Die Ergebnisse eines sechsmonatigen Pilots mit zugeschnittenem Ansatz, abgedruckt in Block 1.2.")}</li>
            <li>{tt("Twelve accounts with their account manager's note and potential contract value, printed in Block 2.1.", "Zwölf Accounts mit der Notiz ihres Account Managers und dem potenziellen Vertragswert, abgedruckt in Block 2.1.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(BUDGET)}</strong>
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${MONTHS} months`, `${MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The cost, reach and weeks of every measure are printed on it in Block 2.3.", "Kosten, Reichweite und Wochen jeder Maßnahme stehen in Block 2.3 an der Maßnahme.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt(`How the task runs · about ${TASK1_MINUTES} min`, `So läuft die Aufgabe · ca. ${TASK1_MINUTES} Min.`)}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>{tt("Understand the customer landscape and whether personalising pays (Level 1).", "Die Kundenlandschaft verstehen und ob sich Personalisierung lohnt (Level 1).")}</li>
            <li>{tt("Place twelve accounts in segments, rate each segment's value and needs (Level 2).", "Zwölf Accounts Segmenten zuordnen, Wert und Bedarf jedes Segments bewerten (Level 2).")}</li>
            <li>{tt("Choose three personalisation measures and defend the order.", "Drei Personalisierungsmaßnahmen wählen und die Reihenfolge begründen.")}</li>
          </ol>
        </div>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief says: offers appear generic, a low conversion rate, customers who do not feel understood, a budget of €120,000 and five months. Everything else is made up for this exercise: the account names, the notes, the pilot figures and the costs. They are labelled where you meet them.",
            "Der Auftrag sagt: generisch wirkende Angebote, eine niedrige Conversion Rate, Kunden, die sich nicht verstanden fühlen, ein Budget von 120.000 € und fünf Monate. Alles andere ist für diese Übung erfunden: die Namen der Accounts, die Notizen, die Pilotzahlen und die Kosten. Sie sind dort gekennzeichnet, wo Sie ihnen begegnen.",
          )}
        </p>
      </Callout>
    </section>
  );
}

function PartHeading({ id, n, title, level }: { id: string; n: number; title: string; level: string }) {
  return (
    <div id={id} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-ink pb-1 pt-2">
      <span className="smallcaps text-accent">{tt(`Part ${n}`, `Teil ${n}`)}</span>
      <h2>{title}</h2>
      <span className="smallcaps ml-auto">{level}</span>
    </div>
  );
}

export function Task1() {
  const p = usePersisted();
  const missing = l1Missing(p);
  const filename = exportName(p.participant.name, "l1l2-segment-analysis");
  return (
    <section id="task-1" aria-labelledby="task1-h" className="space-y-6">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt(`Task 1 · about ${TASK1_MINUTES} minutes`, `Task 1 · ca. ${TASK1_MINUTES} Minuten`)}</p>
        <h2 id="task1-h">{tt("Segment Analysis: from twelve accounts to three measures", "Segment Analysis: von zwölf Accounts zu drei Maßnahmen")}</h2>
      </header>
      <CaseBrief />

      <PartHeading id="part-1" n={1} title={tt("Understand the landscape", "Die Landschaft verstehen")} level={tt("Level 1 · Knowledge", "Level 1 · Wissen")} />
      <Block11 />
      <Block12 />
      <Block13 />
      <Block14 />

      <PartHeading id="part-2" n={2} title={tt("Analyse and act", "Analysieren und handeln")} level={tt("Level 2 · Application", "Level 2 · Anwendung")} />
      <Block21 />
      <Block22 />
      <Block23 />

      <ExportBar
        id="export-l1l2"
        previewTitle={tt("Preview of your Segment Analysis File", "Vorschau Ihrer Segment Analysis File")}
        exportLabel={tt("Export the Segment Analysis File", "Segment Analysis File exportieren")}
        docTitle="Segment Analysis File"
        filename={filename}
        missing={missing}
        buildBody={() => segmentBody(p)}
      />
    </section>
  );
}
