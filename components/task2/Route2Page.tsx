"use client";

import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriB } from "@/components/materi/Materi";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export function Route2Page() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">{tt("Route 2 · Level 3 · Management decision", "Route 2 · Level 3 · Managemententscheidung")}</p>
          <h1>{tt("Choose your segments, and decide before the data is complete", "Wählen Sie Ihre Segmente, und entscheiden Sie, bevor die Daten vollständig sind")}</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            <Gloss>
              {tt(
                "Route 1 sorted twelve accounts into segments. Level 3 asks a different question: across the whole market, which segments get DataCloud's focus, how does it sell to each, what does it standardise, and what does it decide today although the customer data is incomplete?",
                "Route 1 hat zwölf Accounts in Segmente sortiert. Level 3 stellt eine andere Frage: Welche Segmente bekommen über den ganzen Markt hinweg den Fokus von DataCloud, wie verkauft es an jedes, was standardisiert es, und was entscheidet es heute, obwohl die Kundendaten unvollständig sind?",
              )}
            </Gloss>
          </p>
        </blockquote>
      </header>
      <SuggestedOrderBanner
        routeKey="r2"
        text={tt(
          "Route 1 first is recommended, because the situation quotes the segments and measures you named there. Every section stays open, so you can work through this route regardless.",
          "Route 1 zuerst wird empfohlen, weil die Lage die Segmente und Maßnahmen zitiert, die Sie dort benannt haben. Jeder Abschnitt bleibt offen, Sie können diese Route trotzdem bearbeiten.",
        )}
      />
      <SectionRail route={2} />
      <PageNav route={2} />
      <MateriB />
      <Task2 />
      <ResetRoute route={2} />
    </div>
  );
}
