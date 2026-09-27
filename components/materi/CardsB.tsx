"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { ArchExample, NineBox, RegretTable, SalesModelCost, TailorGridExample } from "@/components/materi/diagramsB";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { COST_SHARE_MAX, LEVEL_COST, MODEL_IDS, SALES_MODELS, TAILOR_SHARE_MAX } from "@/data/route2";
import { euro, tt } from "@/lib/lang";

/** Materi B: the five cards of Route 2 (Level 3). 60 minutes in all. */

const p = "text-body text-ink";

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan={tt(
        "A segment deserves focus when it is attractive (a large profit pool) and when you can win it (your win rate there). Rate both, place the segment, and let the position decide its role: core, serve standard, or deprioritise.",
        "Ein Segment verdient Fokus, wenn es attraktiv ist (ein großer Profit Pool) und wenn Sie es gewinnen können (Ihre Win Rate dort). Bewerten Sie beides, platzieren Sie das Segment, und lassen Sie die Position seine Rolle bestimmen: Kernsegment, standardisiert bedienen oder zurückstellen.",
      )}
      reasoning={[
        tt("Choose your prioritisation criteria so that both axes are covered: at least one for attractiveness (the profit pool) and one for the ability to win (the win rate). A scorecard with only attractiveness chases markets you cannot win.", "Wählen Sie Ihre Priorisierungskriterien so, dass beide Achsen abgedeckt sind: mindestens eines für Attraktivität (der Profit Pool) und eines für die Gewinnfähigkeit (die Win Rate). Eine Scorecard nur mit Attraktivität jagt Märkten hinterher, die man nicht gewinnen kann."),
        tt("Profit pool = accounts × average contract value × gross margin. €2.5 million or more is High, €1.0 to €2.49 million is Mid, less than €1.0 million is Low.", "Profit Pool = Accounts × durchschnittlicher Vertragswert × Bruttomarge. 2,5 Mio. € oder mehr ist Hoch, 1,0 bis 2,49 Mio. € ist Mittel, weniger als 1,0 Mio. € ist Niedrig."),
        tt("Ability to win = today's win rate in the segment. 20% or more is High, 10 to 19% is Mid, less than 10% is Low.", "Gewinnfähigkeit = die heutige Win Rate im Segment. 20 % oder mehr ist Hoch, 10 bis 19 % ist Mittel, weniger als 10 % ist Niedrig."),
        tt("The role follows from the two ratings: Low on either axis → deprioritise; High attractiveness and at least Mid ability → core; everything else → serve standard.", "Die Rolle folgt aus den beiden Bewertungen: Niedrig auf einer Achse → zurückstellen; hohe Attraktivität und mindestens mittlere Gewinnfähigkeit → Kernsegment; alles andere → standardisiert bedienen."),
        tt("Name no more than two core segments. Focus is what you do not do: a third core segment divides the same budget three ways.", "Benennen Sie nicht mehr als zwei Kernsegmente. Fokus ist das, was man nicht tut: Ein drittes Kernsegment teilt dasselbe Budget durch drei."),
        tt("Data confidence does not change a rating, it changes how you commit: a segment rated on thin data gets a staged start and a tripwire, not the whole budget at once (B4).", "Datenvertrauen ändert keine Bewertung, es ändert, wie Sie sich festlegen: Ein Segment, das auf dünnen Daten bewertet ist, bekommt einen gestuften Start und einen Tripwire, nicht das ganze Budget auf einmal (B4)."),
      ]}
      sources={["coyne2008", "porter1980"]}
    >
      <p className={p}>
        {tt(
          "The nine-box matrix, developed by GE with McKinsey in the 1970s (Coyne 2008), crosses how attractive a market is with how strong your position in it is. Porter (1980) called the choice that follows a focus strategy: serve a few segments better than broad competitors can. The matrix does not make the decision, but it makes the trade-off visible: the most attractive segment is not the best one if you win there only one proposal in twelve.",
          "Die Neun-Felder-Matrix, in den 1970er-Jahren von GE mit McKinsey entwickelt (Coyne 2008), kreuzt die Attraktivität eines Marktes mit der Stärke der eigenen Position darin. Porter (1980) nannte die Wahl, die daraus folgt, Fokusstrategie: wenige Segmente besser bedienen, als es breite Wettbewerber können. Die Matrix trifft die Entscheidung nicht, aber sie macht den Zielkonflikt sichtbar: Das attraktivste Segment ist nicht das beste, wenn man dort nur jedes zwölfte Angebot gewinnt.",
        )}
      </p>
      <Diagram label={tt("Attractiveness against ability to win · a worked example on Nordhafen IT", "Attraktivität gegen Gewinnfähigkeit · ein Beispiel mit Nordhafen IT")} caption={tt("Click a segment to read its profit pool, its win rate and the role they give. Switch the role zones off to see the bare positions.", "Klicken Sie ein Segment an, um Profit Pool, Win Rate und die daraus folgende Rolle zu lesen. Schalten Sie die Rollenzonen aus, um nur die Positionen zu sehen.")}>
        <NineBox />
      </Diagram>
      <DataTable
        head={[tt("Criterion", "Kriterium"), tt("Axis", "Achse"), tt("What it tells you", "Was es sagt"), tt("Its blind spot", "Sein blinder Fleck")]}
        rows={[
          [tt("Profit pool", "Profit Pool"), tt("Attractiveness", "Attraktivität"), tt("How much profit the segment holds", "Wie viel Gewinn das Segment enthält"), tt("Says nothing about whether you can win it", "Sagt nichts darüber, ob Sie es gewinnen können")],
          [tt("Growth", "Wachstum"), tt("Attractiveness", "Attraktivität"), tt("Where the pool will be bigger", "Wo der Pool größer werden wird"), tt("Fast growth from a tiny base is still tiny", "Schnelles Wachstum von winziger Basis bleibt winzig")],
          [tt("Ability to win", "Gewinnfähigkeit"), tt("Ability", "Gewinnfähigkeit"), tt("Whether your offer fits the segment today", "Ob Ihr Angebot heute zum Segment passt"), tt("A small sample can mislead", "Eine kleine Stichprobe kann täuschen")],
          [tt("Strategic fit", "Strategischer Fit"), tt("Ability", "Gewinnfähigkeit"), tt("Whether you build on what you already are", "Ob Sie auf dem aufbauen, was Sie schon sind")  , tt("Can defend comfortable habits", "Kann bequeme Gewohnheiten verteidigen")],
          [tt("Cost to serve", "Cost to Serve"), tt("Ability", "Gewinnfähigkeit"), tt("Whether an account earns more than it costs", "Ob ein Account mehr einbringt, als er kostet"), tt("Hard to measure without time data", "Ohne Zeitdaten schwer zu messen")],
          [tt("Data confidence", "Datenvertrauen"), tt("Neither: how far to trust the other two", "Keine: wie weit man den beiden anderen trauen kann"), tt("Whether the ratings rest on enough cases", "Ob die Bewertungen auf genug Fällen beruhen"), tt("Low confidence is a reason to test, not to ignore", "Geringes Vertrauen ist ein Grund zu testen, nicht zu ignorieren")],
        ]}
        caption={tt("Six prioritisation criteria", "Sechs Priorisierungskriterien")}
      />
    </MaterialCard>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan={tt(
        "Every segment needs a sales model whose cost it can carry and that matches how it decides. A committee that buys from documents needs a key account team; engineers want to test online; small firms want a person nearby at a price the contract can pay.",
        "Jedes Segment braucht ein Vertriebsmodell, dessen Kosten es tragen kann und das dazu passt, wie es entscheidet. Ein Gremium, das nach Unterlagen kauft, braucht ein Key-Account-Team; Engineers wollen online testen; kleine Firmen wollen eine Person in der Nähe, zu einem Preis, den der Vertrag bezahlen kann.",
      )}
      reasoning={[
        tt(`Cost rule: the cost of winning one deal must stay at or below ${COST_SHARE_MAX}% of its first-year contract value. Divide the model's cost per won deal by the segment's average contract value.`, `Kostenregel: Die Kosten, einen Deal zu gewinnen, dürfen höchstens ${COST_SHARE_MAX} % seines Erstjahres-Vertragswerts betragen. Teilen Sie die Kosten des Modells pro gewonnenem Deal durch den durchschnittlichen Vertragswert des Segments.`),
        tt("Behaviour rule: the model must match how the segment decides. Group decisions with documents → key account team or field sales. Engineers who test → digital self-service or inside sales. Owner-managers who want a person → partner channel or inside sales.", "Verhaltensregel: Das Modell muss dazu passen, wie das Segment entscheidet. Gremienentscheidungen mit Unterlagen → Key-Account-Team oder Außendienst. Engineers, die testen → digitaler Self-Service oder Inside Sales. Inhaber, die eine Person wollen → Partnervertrieb oder Inside Sales."),
        tt("A model must pass both rules. A cheap model that does not match the decision loses the deal; a matching model the contract cannot pay for loses money on every deal.", "Ein Modell muss beide Regeln bestehen. Ein günstiges Modell, das nicht zur Entscheidung passt, verliert den Deal; ein passendes Modell, das der Vertrag nicht bezahlen kann, verliert bei jedem Deal Geld."),
        tt("A partner keeps a share of the contract value, so its cost grows with the deal; the other models cost a fixed amount per deal.", "Ein Partner behält einen Anteil am Vertragswert, seine Kosten wachsen also mit dem Deal; die anderen Modelle kosten einen festen Betrag pro Deal."),
        tt("The value proposition names the segment's need and what the offer does about it, in the customer's words: “Your auditor gets every document before asking” is a proposition; “best-in-class cloud” is not.", "Das Nutzenversprechen nennt den Bedarf des Segments und was das Angebot dagegen tut, in den Worten des Kunden: „Ihr Prüfer bekommt jedes Dokument, bevor er fragt“ ist ein Versprechen; „erstklassige Cloud“ nicht."),
      ]}
      sources={["zoltners2004", "kaplan2004"]}
    >
      <p className={p}>
        {tt(
          "Zoltners, Sinha and Lorimer (2004) describe sales-force design as matching the channel to what an account is worth and to how it buys. Kaplan and Anderson (2004) showed how often the most active customers are the least profitable once the time spent on them is counted. For segments this means: the sales model is part of the offer, and it has a price the segment has to be able to pay.",
          "Zoltners, Sinha und Lorimer (2004) beschreiben Vertriebsdesign als Abstimmung des Kanals darauf, was ein Account wert ist und wie er kauft. Kaplan und Anderson (2004) zeigten, wie oft die aktivsten Kunden die am wenigsten profitablen sind, wenn man die Zeit für sie mitzählt. Für Segmente heißt das: Das Vertriebsmodell ist Teil des Angebots, und es hat einen Preis, den das Segment bezahlen können muss.",
        )}
      </p>
      <DataTable
        head={[tt("Model", "Modell"), tt("How it works", "Wie es funktioniert"), tt("Cost per won deal (Case assumption)", "Kosten pro gewonnenem Deal (Fallannahme)"), tt("Fits", "Passt zu")]}
        rows={MODEL_IDS.map((m) => [SALES_MODELS[m].name, SALES_MODELS[m].how, m === "partner" ? tt(`${SALES_MODELS.partner.share}% of first-year contract value`, `${SALES_MODELS.partner.share} % des Erstjahres-Vertragswerts`) : euro(SALES_MODELS[m].cost), SALES_MODELS[m].fits])}
        caption={tt("Five sales models", "Fünf Vertriebsmodelle")}
      />
      <Diagram label={tt("Which models a contract can carry · move the contract value", "Welche Modelle ein Vertrag tragen kann · den Vertragswert verschieben")} caption={tt("Move the slider or pick a preset. A hatched bar is over the cost limit.", "Verschieben Sie den Regler oder wählen Sie eine Voreinstellung. Ein schraffierter Balken liegt über der Kostengrenze.")}>
        <SalesModelCost />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB3() {
  return (
    <MaterialCard
      id="B3"
      scan={tt(
        "Standardise what every segment can share, individualise only where a segment's need really differs, and use modular building blocks in between. The limit is what the account's margin can carry.",
        "Standardisieren Sie, was alle Segmente teilen können, individualisieren Sie nur dort, wo der Bedarf eines Segments wirklich abweicht, und nutzen Sie dazwischen modulare Bausteine. Die Grenze ist das, was die Marge des Accounts tragen kann.",
      )}
      reasoning={[
        tt("The platform and product stay standard for every segment. One platform is where the scale economies of a cloud provider come from; a platform version per segment ends them.", "Plattform und Produkt bleiben für jedes Segment Standard. Aus einer Plattform kommen die Skaleneffekte eines Cloud-Anbieters; eine Plattformversion pro Segment beendet sie."),
        tt("A segment you serve standard gets no individual element. If it needed one, it would be a core segment.", "Ein Segment, das Sie standardisiert bedienen, bekommt kein individuelles Element. Bräuchte es eines, wäre es ein Kernsegment."),
        tt(`Cost limit: the tailoring cost per account and year must stay at or below ${TAILOR_SHARE_MAX}% of the gross margin the account brings (average contract value × margin). Modular costs ${euro(LEVEL_COST.mod)} per element, individual ${euro(LEVEL_COST.ind)}.`, `Kostengrenze: Die Zuschnittkosten pro Account und Jahr dürfen höchstens ${TAILOR_SHARE_MAX} % der Bruttomarge betragen, die der Account bringt (durchschnittlicher Vertragswert × Marge). Modular kostet ${euro(LEVEL_COST.mod)} pro Element, individuell ${euro(LEVEL_COST.ind)}.`),
        tt("Individualise where the segment's need lives: for those who must prove, the contract and compliance terms; for those who want control, the pricing model and technical onboarding. Everything else stays standard or modular.", "Individualisieren Sie dort, wo der Bedarf des Segments sitzt: für die, die nachweisen müssen, Vertrag und Compliance-Klauseln; für die, die Kontrolle wollen, Preismodell und technisches Onboarding. Alles andere bleibt Standard oder modular."),
        tt("Modular is the default answer to “they need something a bit different”: prepared building blocks give variety at close to standard cost.", "Modular ist die Standardantwort auf „die brauchen etwas ein bisschen anderes“: Vorbereitete Bausteine geben Vielfalt zu fast standardisierten Kosten."),
      ]}
      sources={["pine1993", "gilmore1997", "kaplan2004"]}
    >
      <p className={p}>
        {tt(
          "Pine (1993) called it mass customization: offering variety at close to standard cost by building offers from modules. Gilmore and Pine (1997) added the rule that matters most for segments: customise only what the customer values, and keep the rest standard. The question is never “standard or individual?” for the whole offer, but for each element of it.",
          "Pine (1993) nannte es Mass Customization: Vielfalt zu fast standardisierten Kosten, indem man Angebote aus Modulen baut. Gilmore und Pine (1997) ergänzten die Regel, die für Segmente am meisten zählt: Nur anpassen, was der Kunde schätzt, und den Rest standardisiert lassen. Die Frage lautet nie „Standard oder individuell?“ für das ganze Angebot, sondern für jedes seiner Elemente.",
        )}
      </p>
      <Diagram label={tt("One segment's offer, element by element · a worked example on Nordhafen IT", "Das Angebot eines Segments, Element für Element · ein Beispiel mit Nordhafen IT")} caption={tt("Click a level to cycle through standard, modular and individual, and switch the segment. The bar compares the tailoring cost with what the margin can carry.", "Klicken Sie auf eine Stufe, um zwischen Standard, modular und individuell zu wechseln, und wechseln Sie das Segment. Der Balken vergleicht die Zuschnittkosten mit dem, was die Marge tragen kann.")}>
        <TailorGridExample />
      </Diagram>
      <Callout label={tt("Efficiency and individuality: the coaching question", "Effizienz und Individualität: die Coaching-Frage")} tone="amber">
        <p>
          {tt(
            "Every individual element is a promise someone has to keep for every account in the segment, every year. Before you individualise, ask who will keep it when the segment has three times as many accounts.",
            "Jedes individuelle Element ist ein Versprechen, das jemand für jeden Account im Segment halten muss, jedes Jahr. Bevor Sie individualisieren, fragen Sie, wer es halten wird, wenn das Segment dreimal so viele Accounts hat.",
          )}
        </p>
      </Callout>
    </MaterialCard>
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan={tt(
        "Customer data is never complete. Decide the direction now, commit money in stages, and agree in advance on the result that makes you change course. Waiting for complete data is a decision too.",
        "Kundendaten sind nie vollständig. Entscheiden Sie die Richtung jetzt, binden Sie Geld in Stufen, und vereinbaren Sie vorab das Ergebnis, bei dem Sie den Kurs ändern. Auf vollständige Daten zu warten, ist auch eine Entscheidung.",
      )}
      reasoning={[
        tt("Collect more data only if it could change the decision (the value of information). If every likely answer leads to the same segment choice, decide now and let the first months produce the data.", "Sammeln Sie nur dann mehr Daten, wenn sie die Entscheidung ändern könnten (der Wert von Information). Führt jede wahrscheinliche Antwort zur selben Segmentwahl, entscheiden Sie jetzt und lassen Sie die ersten Monate die Daten liefern."),
        tt("Match the commitment to what is known: a no-regret move (the data fields) at once, options (a first segment measure) next, the big bet (a sales team) only when a checkpoint is met.", "Richten Sie die Festlegung am Wissen aus: einen No-regret-Schritt (die Datenfelder) sofort, Optionen (eine erste Segmentmaßnahme) danach, die große Wette (ein Vertriebsteam) erst, wenn ein Kontrollpunkt erreicht ist."),
        tt("Waiting has the smallest spread and the lowest result whenever the segment is real. The brief asks for a decision despite incomplete data; waiting does not answer it.", "Warten hat die kleinste Streuung und das niedrigste Ergebnis, wann immer das Segment echt ist. Der Auftrag verlangt eine Entscheidung trotz unvollständiger Daten; Warten beantwortet ihn nicht."),
        tt("Write each assumption with the sign that would show it is wrong: a number or something you could see, and when.", "Schreiben Sie jede Annahme mit dem Anzeichen auf, das zeigen würde, dass sie falsch ist: eine Zahl oder etwas Sichtbares, und wann."),
        tt("A tripwire measures a customer response (a win rate, a cycle time, a conversion), not your own activity (emails sent, fields filled). Its threshold must be better than today's baseline, or reaching it proves nothing.", "Ein Tripwire misst eine Kundenreaktion (eine Win Rate, eine Durchlaufzeit, eine Conversion), nicht Ihre eigene Aktivität (versendete E-Mails, ausgefüllte Felder). Sein Schwellenwert muss besser sein als die heutige Baseline, sonst beweist das Erreichen nichts."),
        tt("When new data shrinks a core segment, re-rate it with the new numbers before you drop it: a smaller segment can still hold the highest profit per account.", "Wenn neue Daten ein Kernsegment verkleinern, bewerten Sie es mit den neuen Zahlen neu, bevor Sie es fallen lassen: Ein kleineres Segment kann immer noch den höchsten Gewinn pro Account enthalten."),
      ]}
      sources={["courtney1997", "hubbard2014", "klein2007", "doran1981"]}
    >
      <p className={p}>
        {tt(
          "Courtney, Kirkland and Viguerie (1997) sorted strategic moves by how much they commit: no-regret moves that pay whatever happens, options that buy the right to decide later, and big bets. Hubbard (2014) adds the test for more research: data has value only if it could change what you do. A premortem (Klein 2007) finds the assumptions worth watching: imagine the segment strategy has failed a year from now, and write down why.",
          "Courtney, Kirkland und Viguerie (1997) ordneten strategische Schritte danach, wie stark sie binden: No-regret-Schritte, die sich in jedem Fall lohnen, Optionen, die das Recht auf eine spätere Entscheidung kaufen, und große Wetten. Hubbard (2014) ergänzt den Test für weitere Recherche: Daten haben nur Wert, wenn sie ändern könnten, was man tut. Ein Premortem (Klein 2007) findet die Annahmen, die es zu beobachten lohnt: Stellen Sie sich vor, die Segmentstrategie ist in einem Jahr gescheitert, und schreiben Sie auf, warum.",
        )}
      </p>
      <Diagram label={tt("Three strategies, three segment sizes · a worked example on Nordhafen IT", "Drei Strategien, drei Segmentgrößen · ein Beispiel mit Nordhafen IT")} caption={tt("Switch between the result and the regret, and move your estimate of how likely the segment is smaller than assumed.", "Wechseln Sie zwischen Ergebnis und Bedauern, und verschieben Sie Ihre Schätzung, wie wahrscheinlich das Segment kleiner ist als angenommen.")}>
        <RegretTable />
      </Diagram>
      <DataTable
        head={[tt("Part of a tripwire", "Teil eines Tripwires"), tt("What it must be", "Was es sein muss"), tt("Not like this", "Nicht so")]}
        rows={[
          [tt("Metric", "Kennzahl"), tt("A customer response: win rate, days to signature, test-to-contract rate", "Eine Kundenreaktion: Win Rate, Tage bis zur Unterschrift, Test-zu-Vertrag-Quote"), tt("Emails sent, fields filled", "Versendete E-Mails, ausgefüllte Felder")],
          [tt("Threshold", "Schwellenwert"), tt("Better than today's baseline", "Besser als die heutige Baseline"), tt("Today's value, or worse", "Der heutige Wert, oder schlechter")],
          [tt("Month", "Monat"), tt("Early enough to act on the rest of the budget", "Früh genug, um über das restliche Budget zu entscheiden"), tt("The last month", "Der letzte Monat")],
          [tt("Action", "Aktion"), tt("Agreed now: adjust one lever, or stop", "Jetzt vereinbart: einen Hebel anpassen oder stoppen"), tt("“We will discuss it”", "„Wir besprechen es dann“")],
        ]}
        caption={tt("How to write a tripwire", "Wie man einen Tripwire schreibt")}
      />
    </MaterialCard>
  );
}

export function CardB5() {
  return (
    <MaterialCard
      id="B5"
      scan={tt(
        "An architecture turns the strategy into funded items with a start month, one owner and a trigger each. The segment data comes first, because every trigger reads it. What does not fit is left out on purpose, with a pickup point.",
        "Eine Architektur macht aus der Strategie finanzierte Punkte mit je einem Startmonat, einem Owner und einem Trigger. Die Segmentdaten kommen zuerst, weil jeder Trigger sie liest. Was nicht passt, wird bewusst weggelassen, mit einem Pickup Point.",
      )}
      reasoning={[
        tt("Baseline first: the item that records the segment data starts no later than the first other item. Without it, no trigger can be read.", "Baseline zuerst: Der Punkt, der die Segmentdaten erfasst, startet nicht später als der erste andere Punkt. Ohne ihn lässt sich kein Trigger ablesen."),
        tt("Fund inside the budget. If the items you want cost more, leave out a whole item, the one with the weakest case, and do not trim every item a little.", "Finanzieren Sie innerhalb des Budgets. Kosten die gewünschten Punkte mehr, lassen Sie einen ganzen Punkt weg, den mit der schwächsten Begründung, und kürzen Sie nicht jeden Punkt ein bisschen."),
        tt("Fund nothing for a segment you deprioritised. Money for it contradicts your own segment decision.", "Finanzieren Sie nichts für ein Segment, das Sie zurückgestellt haben. Geld dafür widerspricht Ihrer eigenen Segmententscheidung."),
        tt("Owner test: who can change this item without asking anyone else? The CRM belongs to Sales Operations, contract terms to Legal, the platform to Product, the sellers to the CSO.", "Owner-Test: Wer kann diesen Punkt ändern, ohne jemanden zu fragen? Das CRM gehört Sales Operations, Vertragsklauseln der Rechtsabteilung, die Plattform dem Produkt, die Verkäufer dem CSO."),
        tt("Trigger test: a metric, a number, a date and an action. “If fewer than 80% of accounts carry the fields by month 2, the report waits” passes; “we monitor adoption” does not.", "Trigger-Test: eine Kennzahl, eine Zahl, ein Datum und eine Aktion. „Tragen bis Monat 2 weniger als 80 % der Accounts die Felder, wartet der Bericht“ besteht; „wir beobachten die Nutzung“ nicht."),
        tt("What you leave out gets a pickup point: the number and the date at which you look at it again.", "Was Sie weglassen, bekommt einen Pickup Point: die Zahl und das Datum, zu dem Sie es wieder ansehen."),
      ]}
      sources={["deming1986", "doran1981"]}
    >
      <p className={p}>
        {tt(
          "Deming's plan-do-study-act cycle (1986) is the logic behind an architecture: nothing is fixed once and forgotten; each item is measured, and the measurement decides the next step. Doran's S.M.A.R.T. test (1981) keeps the triggers honest: specific, measurable, assignable to one person, realistic and time-related.",
          "Demings Zyklus Plan-Do-Study-Act (1986) ist die Logik hinter einer Architektur: Nichts wird einmal festgelegt und vergessen; jeder Punkt wird gemessen, und die Messung entscheidet den nächsten Schritt. Dorans S.M.A.R.T.-Test (1981) hält die Trigger ehrlich: spezifisch, messbar, einer Person zuordenbar, realistisch und terminiert.",
        )}
      </p>
      <Diagram label={tt("Four funded items over six months · a worked example on Nordhafen IT", "Vier finanzierte Punkte über sechs Monate · ein Beispiel mit Nordhafen IT")} caption={tt("Click a row to read why it has this owner, this start and this trigger.", "Klicken Sie eine Zeile an, um zu lesen, warum sie diesen Owner, diesen Start und diesen Trigger hat.")}>
        <ArchExample />
      </Diagram>
      <Bul
        items={[
          tt("Owner: who can change it without asking anyone else?", "Owner: Wer kann es ändern, ohne jemanden zu fragen?"),
          tt("Start: does something have to exist before it, such as the segment data?", "Start: Muss vorher etwas existieren, etwa die Segmentdaten?"),
          tt("Trigger: does it have a metric, a number, a date and an action?", "Trigger: Hat er eine Kennzahl, eine Zahl, ein Datum und eine Aktion?"),
        ]}
      />
    </MaterialCard>
  );
}

export const CARDS_B = [CardB1, CardB2, CardB3, CardB4, CardB5];
