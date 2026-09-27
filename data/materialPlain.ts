import type { MaterialId } from "@/data/materialIndex";
import { bi, t } from "@/lib/lang";

/**
 * The "In plain words" box under each card's scan line (CLAUDE.md #22): the idea in everyday language, why it matters for the day's
 * case and tasks, and how to read the diagram or interactive below. Written for someone who has never met the topic. Typed as a full
 * Record so a card without an explanation fails the typecheck. Every control and label named in `picture` was checked against the
 * component that draws it (components/materi/diagramsA.tsx, diagramsB.tsx).
 */
export type PlainExplain = { idea: string; why: string; picture?: string };

export const MATERIAL_PLAIN: Record<MaterialId, PlainExplain> = bi({
  /* ---------------------------------------------------------------- Materi A */
  A1: {
    idea: t(
      "Customers who look alike on paper often need very different things. If you make one offer for all of them, it fits nobody well. Segmenting means splitting customers into groups that need the same thing, so each group can get an offer that fits.",
      "Kunden, die auf dem Papier gleich aussehen, brauchen oft ganz Verschiedenes. Wenn Sie allen ein einziges Angebot machen, passt es niemandem richtig. Segmentieren heißt, Kunden in Gruppen zu teilen, die dasselbe brauchen, damit jede Gruppe ein passendes Angebot bekommt.",
    ),
    why: t(
      "DataCloud's problem is exactly this: its offers feel generic, conversion is low and customers say they do not feel understood. This card explains why that happens and what makes a group worth its own offer.",
      "Genau das ist das Problem von DataCloud: Die Angebote wirken generisch, die Conversion ist niedrig und Kunden sagen, sie fühlen sich nicht verstanden. Diese Karte erklärt, warum das passiert und was eine Gruppe ein eigenes Angebot wert macht.",
    ),
    picture: t(
      "Each circle is one customer of Weserdata, another provider; the letter inside is its industry. Left to right is how much control it wants, bottom to top how much proof it needs. The dark diamonds are offers, and the dashed lines show how far each customer is from its offer. Use the three buttons to switch between one offer, one per industry and one per need. The box “What this shows” gives the average gap.",
      "Jeder Kreis ist ein Kunde von Weserdata, einem anderen Anbieter; der Buchstabe darin ist seine Branche. Von links nach rechts steht, wie viel Kontrolle er will, von unten nach oben, wie viel Nachweis er braucht. Die dunklen Rauten sind Angebote, die gestrichelten Linien zeigen, wie weit jeder Kunde von seinem Angebot entfernt ist. Wechseln Sie mit den drei Schaltflächen zwischen einem Angebot, einem pro Branche und einem pro Bedarf. Das Feld „Was das zeigt“ nennt die durchschnittliche Lücke.",
    ),
  },
  A2: {
    idea: t(
      "A target group is the big choice of whom a company talks to at all, made by management for years. Segments are the smaller groups inside it that each get their own offer. Each segment has a need, and the offer follows from that need.",
      "Eine Zielgruppe ist die große Entscheidung, mit wem ein Unternehmen überhaupt spricht, von der Geschäftsführung für Jahre getroffen. Segmente sind die kleineren Gruppen darin, die jeweils ein eigenes Angebot bekommen. Jedes Segment hat einen Bedarf, und das Angebot folgt aus diesem Bedarf.",
    ),
    why: t(
      "Block 1.3 shows you a sentence from DataCloud's strategy paper and asks whether it names a target group or a segment. Block 1.3 also asks you to sketch segments of your own, each with a need.",
      "Block 1.3 zeigt Ihnen einen Satz aus dem Strategiepapier von DataCloud und fragt, ob er eine Zielgruppe oder ein Segment nennt. Block 1.3 bittet Sie auch, eigene Segmente zu skizzieren, jedes mit einem Bedarf.",
    ),
    picture: t(
      "The five boxes run from the whole market at the top to the offer at the bottom. The two grey dashed boxes are strategic, the three teal ones operational. Use the first row of buttons to follow one of Weserdata's three segments, and the second row (or a click on a box) to read one level.",
      "Die fünf Kästen reichen vom ganzen Markt oben bis zum Angebot unten. Die zwei grauen gestrichelten Kästen sind strategisch, die drei türkisen operativ. Folgen Sie mit der ersten Reihe von Schaltflächen einem der drei Segmente von Weserdata, und lesen Sie mit der zweiten Reihe (oder einem Klick auf einen Kasten) eine Ebene.",
    ),
  },
  A3: {
    idea: t(
      "You can describe a customer in three ways: what the company is (industry, size), what it did (tickets, orders), or what it has to solve (a duty, a problem). The first is easy to find and tells you little; the last is harder to find and tells you most.",
      "Man kann einen Kunden auf drei Arten beschreiben: was das Unternehmen ist (Branche, Größe), was es getan hat (Tickets, Bestellungen) oder was es lösen muss (eine Pflicht, ein Problem). Das Erste ist leicht zu finden und sagt wenig; das Letzte ist schwerer zu finden und sagt am meisten.",
    ),
    why: t(
      "Block 1.1 gives you nine fields from DataCloud's CRM to sort into these three kinds with the tests on this card. Block 1.3 asks where DataCloud's accounts differ the most.",
      "Block 1.1 gibt Ihnen neun Felder aus dem CRM von DataCloud, die Sie mit den Tests dieser Karte in diese drei Arten einsortieren. Block 1.3 fragt, wo sich die Accounts von DataCloud am stärksten unterscheiden.",
    ),
    picture: t(
      "The rings are layers of the nested approach, from the outside (easy to see) to the centre (most telling). Click a ring or a button to read it: the dots show how easy it is to find out and how well it predicts the need. Below it, six fields from Weserdata's CRM: click one to see its kind, its test question and why.",
      "Die Ringe sind die Schichten des Nested Approach, von außen (leicht zu sehen) bis zur Mitte (am aussagekräftigsten). Klicken Sie einen Ring oder eine Schaltfläche an, um ihn zu lesen: Die Punkte zeigen, wie leicht er herauszufinden ist und wie gut er den Bedarf vorhersagt. Darunter sechs Felder aus dem CRM von Weserdata: Klicken Sie eines an, um seine Art, seine Testfrage und die Begründung zu sehen.",
    ),
  },
  A4: {
    idea: t(
      "Personalising means making your offer fit a group better. It costs money, so it is worth it only if enough extra deals come out of it. You can work that out: extra deals times what a deal earns, minus what the personalising costs.",
      "Personalisieren heißt, das Angebot besser an eine Gruppe anzupassen. Das kostet Geld, also lohnt es sich nur, wenn genug zusätzliche Deals herauskommen. Das lässt sich ausrechnen: zusätzliche Deals mal was ein Deal einbringt, minus was die Personalisierung kostet.",
    ),
    why: t(
      "Block 1.2 asks you to do this calculation for two of DataCloud's segments, with the numbers of its pilot. The table of steps on this card shows the same method on Weserdata's numbers.",
      "Block 1.2 bittet Sie, diese Rechnung für zwei Segmente von DataCloud mit den Zahlen aus dessen Pilot zu machen. Die Schritt-Tabelle auf dieser Karte zeigt dieselbe Methode mit den Zahlen von Weserdata.",
    ),
    picture: t(
      "The solid bar is the extra gross profit a year, the hatched bar the yearly cost of tailoring, and the dashed line the break-even. Choose Clinics or Retail with the first buttons and a rise in win rate with the second. The line under the bars says whether it pays, and “What this shows” explains why.",
      "Der volle Balken ist der zusätzliche Rohertrag pro Jahr, der schraffierte die jährlichen Kosten des Zuschnitts, die gestrichelte Linie der Break-even. Wählen Sie mit den ersten Schaltflächen Kliniken oder Handel und mit den zweiten einen Anstieg der Win Rate. Die Zeile unter den Balken sagt, ob es sich lohnt, und „Was das zeigt“ erklärt warum.",
    ),
  },
  A5: {
    idea: t(
      "In the cloud market three kinds of customer come up again and again: those who must prove something to an auditor, those who want someone to run it for them, and those whose own engineers want control. You tell them apart by what they ask for, not by their industry or size.",
      "Im Cloud-Markt tauchen drei Arten von Kunden immer wieder auf: die, die einem Prüfer etwas nachweisen müssen, die, die jemanden wollen, der es für sie betreibt, und die, deren eigene Engineers Kontrolle wollen. Man unterscheidet sie an dem, wonach sie fragen, nicht an Branche oder Größe.",
    ),
    why: t(
      "Block 2.1 gives you twelve accounts from DataCloud's CRM, each with a note, and you place each in one of these three segments using the tests on this card.",
      "Block 2.1 gibt Ihnen zwölf Accounts aus dem CRM von DataCloud, jeden mit einer Notiz, und Sie ordnen jeden mit den Tests dieser Karte einem der drei Segmente zu.",
    ),
    picture: t(
      "Each box in the worked example is an account of Weserdata with what its buyer said. Click one to see its segment, the words that decide it (highlighted), the test question and why the nearest other segment does not fit. You can open all six.",
      "Jeder Kasten im Beispiel ist ein Account von Weserdata mit dem, was seine Käufer gesagt haben. Klicken Sie einen an, um sein Segment zu sehen, die entscheidenden Worte (markiert), die Testfrage und warum das nächstliegende andere Segment nicht passt. Sie können alle sechs öffnen.",
    ),
  },
  A6: {
    idea: t(
      "A segment is worth what its customers could pay, not how many customers it has. Add up their contract values to rate it. Then be honest about what your list cannot tell you, such as profit, or how many similar customers exist beyond it.",
      "Ein Segment ist so viel wert, wie seine Kunden zahlen könnten, nicht wie viele Kunden es hat. Summieren Sie die Vertragswerte, um es zu bewerten. Seien Sie dann ehrlich, was Ihre Liste nicht verrät, etwa den Gewinn oder wie viele ähnliche Kunden es darüber hinaus gibt.",
    ),
    why: t(
      "Block 2.2 asks you to rate each of DataCloud's segments by its value, from your own assignment, to say what to personalise for each, and to name what the file does not tell you.",
      "Block 2.2 bittet Sie, jedes Segment von DataCloud nach seinem Wert zu bewerten, ausgehend von Ihrer eigenen Zuordnung, zu sagen, was für jedes personalisiert wird, und zu nennen, was die Datei nicht verrät.",
    ),
    picture: t(
      "Each bar is one of Weserdata's three segments. Use the two buttons to rank them by the number of accounts (grey bars) or by the sum of potential contract value (dark bars, with the rating). Watch the order turn round.",
      "Jeder Balken ist eines der drei Segmente von Weserdata. Ordnen Sie sie mit den zwei Schaltflächen nach Zahl der Accounts (graue Balken) oder nach der Summe des potenziellen Vertragswerts (dunkle Balken, mit Bewertung). Sehen Sie, wie sich die Reihenfolge umdreht.",
    ),
  },
  A7: {
    idea: t(
      "A measure is worth funding if it answers what a valuable segment needs, if competitors cannot easily copy it, and if it does not cost too much per customer it reaches. Give each a score from 1 to 3, multiply, and check it fits the budget.",
      "Eine Maßnahme lohnt sich, wenn sie beantwortet, was ein wertvolles Segment braucht, wenn Wettbewerber sie nicht leicht kopieren können und wenn sie pro erreichtem Kunden nicht zu viel kostet. Geben Sie jeder Eigenschaft einen Wert von 1 bis 3, multiplizieren Sie und prüfen Sie, ob es ins Budget passt.",
    ),
    why: t(
      "Block 2.3 gives you nine personalisation measures, €120,000 and five months. You choose three, name the segments each serves, score them and put them in order. The rules for every score are on this card.",
      "Block 2.3 gibt Ihnen neun Personalisierungsmaßnahmen, 120.000 € und fünf Monate. Sie wählen drei, nennen die Segmente, denen jede dient, bewerten sie und bringen sie in eine Reihenfolge. Die Regeln für jeden Wert stehen auf dieser Karte.",
    ),
    picture: t(
      "The table lists three measures of Weserdata. The tick box in front of each puts it in or out of the plan. Click a relevance or differentiation number to change it; economic viability follows from the cost per account. The bar under the table is the budget: a hatched amber part is over budget. “What this shows” says which measure to leave out.",
      "Die Tabelle zeigt drei Maßnahmen von Weserdata. Das Kästchen vor jeder nimmt sie in den Plan auf oder heraus. Klicken Sie eine Zahl bei Relevanz oder Differenzierung an, um sie zu ändern; die Wirtschaftlichkeit folgt aus den Kosten pro Account. Der Balken unter der Tabelle ist das Budget: Ein schraffierter bernsteinfarbener Teil liegt über dem Budget. „Was das zeigt“ sagt, welche Maßnahme wegfällt.",
    ),
  },

  /* ---------------------------------------------------------------- Materi B */
  B1: {
    idea: t(
      "To decide where to focus, ask two questions about each segment: how much profit is in it, and how often do we win there today? A segment with a lot of profit that you can win gets your focus. One you can win but that holds little profit is served with a standard offer. One you cannot win is parked.",
      "Um zu entscheiden, worauf man sich konzentriert, stellen Sie zu jedem Segment zwei Fragen: Wie viel Gewinn steckt darin, und wie oft gewinnen wir dort heute? Ein Segment mit viel Gewinn, das Sie gewinnen können, bekommt Ihren Fokus. Eines, das Sie gewinnen können, das aber wenig Gewinn enthält, bedienen Sie mit einem Standardangebot. Eines, das Sie nicht gewinnen können, stellen Sie zurück.",
    ),
    why: t(
      "Blocks 3.1 and 3.2 ask you to choose the criteria, rate DataCloud's five candidate segments on these two questions, and give each a role. The limits for each rating are on this card.",
      "Die Blöcke 3.1 und 3.2 bitten Sie, die Kriterien zu wählen, die fünf Kandidatensegmente von DataCloud nach diesen zwei Fragen zu bewerten und jedem eine Rolle zu geben. Die Grenzen für jede Bewertung stehen auf dieser Karte.",
    ),
    picture: t(
      "The grid has nine fields: up is more profit, right is a higher win rate. Each circle is one of Nordhafen's segments, labelled with its first three letters. Click a circle or a button to read its numbers and its role. The second pair of buttons shows or hides the role zones.",
      "Das Raster hat neun Felder: Nach oben steht mehr Gewinn, nach rechts eine höhere Win Rate. Jeder Kreis ist ein Segment von Nordhafen, beschriftet mit seinen ersten drei Buchstaben. Klicken Sie einen Kreis oder eine Schaltfläche an, um Zahlen und Rolle zu lesen. Das zweite Schaltflächenpaar zeigt oder verbirgt die Rollenzonen.",
    ),
  },
  B2: {
    idea: t(
      "Every way of selling has a cost. A key account team is expensive, a web shop is cheap. A segment's contracts must be big enough to pay for the way you sell to it, and the way you sell must match how its customers like to decide.",
      "Jede Art zu verkaufen hat Kosten. Ein Key-Account-Team ist teuer, ein Webshop günstig. Die Verträge eines Segments müssen groß genug sein, um die Art zu bezahlen, wie Sie an es verkaufen, und diese Art muss dazu passen, wie seine Kunden entscheiden wollen.",
    ),
    why: t(
      "Block 3.3 asks you to choose a sales model and write a value proposition for each segment you serve. The two rules for the model are on this card.",
      "Block 3.3 bittet Sie, für jedes Segment, das Sie bedienen, ein Vertriebsmodell zu wählen und ein Nutzenversprechen zu schreiben. Die zwei Regeln für das Modell stehen auf dieser Karte.",
    ),
    picture: t(
      "Each bar is a sales model: how much winning one deal costs, as a share of the deal's first-year value. The dashed line is the 30% limit; a hatched bar is over it. Move the slider or pick a preset to change the contract value.",
      "Jeder Balken ist ein Vertriebsmodell: was ein gewonnener Deal kostet, als Anteil am Wert des ersten Vertragsjahres. Die gestrichelte Linie ist die 30-%-Grenze; ein schraffierter Balken liegt darüber. Verschieben Sie den Regler oder wählen Sie eine Voreinstellung, um den Vertragswert zu ändern.",
    ),
  },
  B3: {
    idea: t(
      "You do not have to decide “standard or tailor-made” for a whole offer. Split it into parts: keep the platform the same for everyone, prepare building blocks for parts where needs vary a little, and make something individual only where a segment's need is really different and its customers pay enough.",
      "Sie müssen nicht für ein ganzes Angebot „Standard oder maßgeschneidert“ entscheiden. Teilen Sie es in Teile: Die Plattform bleibt für alle gleich, für Teile mit leicht unterschiedlichen Bedarfen bereiten Sie Bausteine vor, und individuell wird nur, was ein Segment wirklich anders braucht und wofür seine Kunden genug zahlen.",
    ),
    why: t(
      "Block 3.4 gives you a grid of five offer elements for each segment you serve, and asks you to set each to standard, modular or individual within the limit on this card.",
      "Block 3.4 gibt Ihnen ein Raster mit fünf Angebotselementen für jedes Segment, das Sie bedienen, und bittet Sie, jedes innerhalb der Grenze dieser Karte auf Standard, modular oder individuell zu setzen.",
    ),
    picture: t(
      "Each row of the table is one part of Nordhafen's offer. Click a level button to cycle through standard (○), modular (◐) and individual (●). The bar below compares the tailoring cost per account with the limit; a hatched part is over it. Switch between Hospitals and Law firms to see how the limit changes with contract size.",
      "Jede Zeile der Tabelle ist ein Teil des Angebots von Nordhafen. Klicken Sie auf eine Stufe, um zwischen Standard (○), modular (◐) und individuell (●) zu wechseln. Der Balken darunter vergleicht die Zuschnittkosten pro Account mit der Grenze; ein schraffierter Teil liegt darüber. Wechseln Sie zwischen Krankenhäusern und Kanzleien, um zu sehen, wie sich die Grenze mit der Vertragsgröße ändert.",
    ),
  },
  B4: {
    idea: t(
      "You will never have complete data about your customers. You can still decide: choose the direction now, spend in steps, and agree in advance on the number that would make you change course. Waiting for perfect data also has a cost.",
      "Sie werden nie vollständige Daten über Ihre Kunden haben. Sie können trotzdem entscheiden: die Richtung jetzt wählen, in Schritten ausgeben und vorab die Zahl vereinbaren, bei der Sie den Kurs ändern würden. Auf perfekte Daten zu warten, kostet auch etwas.",
    ),
    why: t(
      "Block 3.6 asks you to make the segment decision although the data is incomplete: you choose a decision, name three assumptions, set a tripwire, and answer a challenge from the board.",
      "Block 3.6 bittet Sie, die Segmententscheidung trotz unvollständiger Daten zu treffen: Sie wählen eine Entscheidung, nennen drei Annahmen, setzen einen Tripwire und beantworten eine Frage des Vorstands.",
    ),
    picture: t(
      "The table shows three strategies and three possible segment sizes, in thousands of euros of gross profit over two years. The first buttons switch between the result and the regret (how much less than the best choice you would get). The slider is your own estimate that the segment is smaller than assumed; the highlighted row is the best on the current reading.",
      "Die Tabelle zeigt drei Strategien und drei mögliche Segmentgrößen, in Tausend Euro Rohertrag über zwei Jahre. Die ersten Schaltflächen wechseln zwischen Ergebnis und Bedauern (wie viel weniger als die beste Wahl Sie bekämen). Der Regler ist Ihre eigene Schätzung, dass das Segment kleiner ist als angenommen; die hervorgehobene Zeile ist die beste nach der aktuellen Lesart.",
    ),
  },
  B5: {
    idea: t(
      "A strategy becomes real when each measure has money, a start month, one person responsible and a rule for when that person must act. Start with the data you need to see whether anything works. Leave out what does not fit, and say when you will look at it again.",
      "Eine Strategie wird real, wenn jede Maßnahme Geld, einen Startmonat, eine verantwortliche Person und eine Regel hat, wann diese Person handeln muss. Beginnen Sie mit den Daten, die Sie brauchen, um zu sehen, ob etwas wirkt. Lassen Sie weg, was nicht passt, und sagen Sie, wann Sie es wieder ansehen.",
    ),
    why: t(
      "Block 3.5 asks you to fund items within DataCloud's budget, set their start months, name owners and write triggers. This card shows a finished example and the three tests behind every choice.",
      "Block 3.5 bittet Sie, Punkte innerhalb des Budgets von DataCloud zu finanzieren, Startmonate zu setzen, Owner zu benennen und Trigger zu schreiben. Diese Karte zeigt ein fertiges Beispiel und die drei Tests hinter jeder Wahl.",
    ),
    picture: t(
      "Each row is one of Nordhafen's items and each column a month. The dark box is the start month, the pale boxes after it show it running. Click a row or a button to read its owner, its trigger and why it starts when it does.",
      "Jede Zeile ist ein Punkt von Nordhafen und jede Spalte ein Monat. Der dunkle Kasten ist der Startmonat, die hellen danach zeigen, dass er läuft. Klicken Sie eine Zeile oder eine Schaltfläche an, um Owner, Trigger und den Grund für den Start zu lesen.",
    ),
  },
});

export const plainOf = (id: MaterialId): PlainExplain => MATERIAL_PLAIN[id];
