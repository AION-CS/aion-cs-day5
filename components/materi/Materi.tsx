"use client";

import { CARDS_A } from "@/components/materi/CardsA";
import { CARDS_B } from "@/components/materi/CardsB";
import { useCardMore } from "@/store/useCardMore";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { MATERIALS, SECTIONS, materialAnchorId } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { tt } from "@/lib/lang";

/** The material block of a route: one continuous run of study cards, then the block's own reference list. */

const CARDS_A_META = MATERIALS.filter((m) => m.block === "A");
const CARDS_B_META = MATERIALS.filter((m) => m.block === "B");

const REFS_A: RefKey[] = ["smith1956", "wind1978", "dickson1987", "kotler2022", "shapiro1984", "christensen2016", "mckinsey2021", "gartner2019", "gilmore1997", "burgess2021", "kaplan2004", "gdpr", "uwg7", "tdddg25", "bsic5", "nis2"];
const REFS_B: RefKey[] = ["coyne2008", "porter1980", "zoltners2004", "kaplan2004", "pine1993", "gilmore1997", "courtney1997", "hubbard2014", "klein2007", "doran1981", "deming1986"];

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  const all = useCardMore((s) => s.all);
  const setAll = useCardMore((s) => s.setAll);
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{title}</p>
        <h2 id={`${id}-h`}>{intro}</h2>
        <button type="button" aria-pressed={all} onClick={() => setAll(!all)} className="btn-ghost btn-sm">
          {all ? tt("Hide the extra explanations", "Zusatzerklärungen ausblenden") : tt("Show every extra explanation, video and rule", "Alle Zusatzerklärungen, Videos und Regeln zeigen")}
        </button>
      </header>
      {children}
    </section>
  );
}

const NOTE = () => tt("Check every source before you teach from it: page numbers and editions differ between printings, and statutes change.", "Prüfen Sie jede Quelle, bevor Sie damit unterrichten: Seitenzahlen und Auflagen unterscheiden sich, und Gesetze ändern sich.");

export function MateriA() {
  const s = SECTIONS[1][0];
  return (
    <Block
      id={s.id}
      title={tt(`Materi A · ${s.minutes} minutes, facilitator-led`, `Materi A · ${s.minutes} Minuten, moderiert`)}
      intro={tt("Segments and personalisation: why segment, by what, and when tailoring pays", "Segmente und Personalisierung: warum segmentieren, wonach, und wann sich Zuschnitt lohnt")}
    >
      <p className="max-w-prose text-body text-ash">
        {tt(
          "Seven cards, Level 1 and Level 2 in one run: knowledge first (why segment, target group and segment, the criteria, personalisation and its economics), then application (three needs-based segments, what a segment is worth, choosing measures). Every diagram uses Weserdata, another provider, so the task is never answered for you.",
          "Sieben Karten, Level 1 und Level 2 in einem Durchgang: zuerst Wissen (warum segmentieren, Zielgruppe und Segment, die Kriterien, Personalisierung und ihre Wirtschaftlichkeit), dann Anwendung (drei bedarfsbasierte Segmente, was ein Segment wert ist, Maßnahmen wählen). Jedes Diagramm nutzt Weserdata, einen anderen Anbieter, damit die Aufgabe nie für Sie gelöst wird.",
        )}
      </p>
      {CARDS_A.map((C, i) => {
        const m = CARDS_A_META[i];
        return m.optional ? (
          <OptionalSection
            key={i}
            id={materialAnchorId(m.id)}
            title={`${m.id} · ${m.title}`}
            minutes={m.minutes}
            reason={tt("Deepens a card a Core task block already covers. Not needed to complete the Segment Analysis File.", "Vertieft eine Karte, die ein Kern-Block schon abdeckt. Für die Segment Analysis File nicht nötig.")}
          >
            <C />
          </OptionalSection>
        ) : (
          <C key={i} />
        );
      })}
      <ReferencesAccordion block="A" keys={REFS_A} note={NOTE()} />
    </Block>
  );
}

export function MateriB() {
  const s = SECTIONS[2][0];
  return (
    <Block
      id={s.id}
      title={tt(`Materi B · ${s.minutes} minutes, facilitator-led`, `Materi B · ${s.minutes} Minuten, moderiert`)}
      intro={tt("Segment strategy: where to focus, how to sell, what to standardise, and how to decide without all the data", "Segmentstrategie: worauf man sich konzentriert, wie man verkauft, was man standardisiert, und wie man ohne alle Daten entscheidet")}
    >
      <p className="max-w-prose text-body text-ash">
        {tt(
          "Five cards for Level 3. You stop sorting accounts and start deciding where a whole sales organisation puts its money. Each card ends in rules the task uses; each diagram uses Nordhafen IT, another provider.",
          "Fünf Karten für Level 3. Sie sortieren keine Accounts mehr, sondern entscheiden, wohin eine ganze Vertriebsorganisation ihr Geld steckt. Jede Karte endet mit Regeln, die die Aufgabe nutzt; jedes Diagramm nutzt Nordhafen IT, einen anderen Anbieter.",
        )}
      </p>
      {CARDS_B.map((C, i) => {
        const m = CARDS_B_META[i];
        return m.optional ? (
          <OptionalSection
            key={i}
            id={materialAnchorId(m.id)}
            title={`${m.id} · ${m.title}`}
            minutes={m.minutes}
            reason={tt("Deepens a card a Core task block already covers. Not needed to complete the Segment Strategy Memo.", "Vertieft eine Karte, die ein Kern-Block schon abdeckt. Für das Segment Strategy Memo nicht nötig.")}
          >
            <C />
          </OptionalSection>
        ) : (
          <C key={i} />
        );
      })}
      <ReferencesAccordion block="B" keys={REFS_B} note={NOTE()} />
    </Block>
  );
}
