"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { AssignExample, CritSortExample, EffortBenefit, FitGap, NestedRings, ScoreExample, SegmentLadder, ValueExample } from "@/components/materi/diagramsA";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { ShowMore } from "@/components/ui/ShowMore";
import { CRIT_TESTS } from "@/data/criteria";
import { EV_RULE } from "@/data/measures";
import { SEGMENTS, SEGMENT_IDS, SEGMENT_PAIR_TESTS } from "@/data/segments";
import { WESER, WESER_RESULT } from "@/data/tailoring";
import { euro, euroSigned, tt } from "@/lib/lang";

/** Materi A: the seven cards of Route 1 (Levels 1 and 2 on one case). 60 minutes in all. */

const p = "text-body text-ink";

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan={tt(
        "No two B2B customers need exactly the same thing. One offer for everyone sits close to no one; a segment is a group that needs the same thing and decides the same way, so one offer can serve it well.",
        "Keine zwei B2B-Kunden brauchen genau dasselbe. Ein Angebot für alle liegt bei niemandem richtig; ein Segment ist eine Gruppe, die dasselbe braucht und gleich entscheidet, sodass ein Angebot sie gut bedienen kann.",
      )}
      reasoning={[
        tt("A group is worth treating as a segment when it passes five tests: measurable, substantial, accessible, differentiable and actionable. A group that fails one of them is a list, not a segment.", "Eine Gruppe lohnt sich als Segment, wenn sie fünf Tests besteht: messbar, substanziell, erreichbar, unterscheidbar und umsetzbar. Eine Gruppe, die einen davon nicht besteht, ist eine Liste, kein Segment."),
        tt("“Differentiable” is the test most often failed: if two groups would react the same way to the same offer, they are one segment, however different their industries look.", "„Unterscheidbar“ ist der Test, der am häufigsten scheitert: Wenn zwei Gruppen auf dasselbe Angebot gleich reagieren würden, sind sie ein Segment, egal wie unterschiedlich ihre Branchen aussehen."),
        tt("The basis you segment on matters more than how many segments you make. Three segments built on the wrong criterion fit hardly better than one offer for all.", "Die Grundlage der Segmentierung zählt mehr als die Zahl der Segmente. Drei Segmente auf dem falschen Kriterium passen kaum besser als ein Angebot für alle."),
        tt("“Our offers feel generic” and “customers don't feel understood” are two descriptions of the same gap: the distance between what the offer says and what the customer needs.", "„Unsere Angebote wirken generisch“ und „Kunden fühlen sich nicht verstanden“ beschreiben dieselbe Lücke: den Abstand zwischen dem, was das Angebot sagt, und dem, was der Kunde braucht."),
      ]}
      sources={["smith1956", "kotler2022", "mckinsey2021", "gartner2019"]}
    >
      <p className={p}>
        {tt(
          "Wendell Smith (1956) put the idea simply: a market that looks like one is really several, and it is served better as several smaller, more similar markets. In B2B IT this is sharper than in retail. A cloud buyer at a clinic must satisfy an auditor; a buyer at a bakery chain wants someone to call when a shop system fails; a software firm's engineers want to test the API themselves. One proposal cannot answer all three.",
          "Wendell Smith (1956) hat die Idee einfach formuliert: Ein Markt, der wie einer aussieht, sind in Wahrheit mehrere, und er wird besser als mehrere kleinere, ähnlichere Märkte bedient. Im B2B-IT-Geschäft gilt das noch schärfer als im Handel. Eine Cloud-Käuferin in einer Klinik muss einen Prüfer zufriedenstellen; ein Käufer in einer Bäckereikette will jemanden, den er anrufen kann, wenn ein Filialsystem ausfällt; die Engineers einer Softwarefirma wollen die API selbst testen. Ein Angebot kann nicht alle drei beantworten.",
        )}
      </p>
      <Diagram label={tt("One offer, industry offers or need-based offers · a worked example on Weserdata", "Ein Angebot, Branchenangebote oder bedarfsbasierte Angebote · ein Beispiel mit Weserdata")} caption={tt("Each circle is one customer of Weserdata, placed by how much proof and how much control it needs. Switch the offer design and read the average gap.", "Jeder Kreis ist ein Kunde von Weserdata, platziert danach, wie viel Nachweis und wie viel Kontrolle er braucht. Wechseln Sie das Angebotsdesign und lesen Sie die durchschnittliche Lücke.")}>
        <FitGap />
      </Diagram>
      <ShowMore id="A1" part="table" label={tt("Show the five tests of a useful segment", "Die fünf Tests für ein nützliches Segment zeigen")}>
      <DataTable
        head={[tt("Test", "Test"), tt("The question", "Die Frage"), tt("A group that fails it", "Eine Gruppe, die durchfällt")]}
        rows={[
          [tt("Measurable", "Messbar"), tt("Can you count the accounts in it and their value?", "Können Sie die Accounts darin und ihren Wert zählen?"), tt("“Innovative companies”: nobody can say who is in it.", "„Innovative Unternehmen“: Niemand kann sagen, wer dazugehört.")],
          [tt("Substantial", "Substanziell"), tt("Is it big enough to pay for its own offer?", "Ist sie groß genug, um ein eigenes Angebot zu tragen?"), tt("Three accounts worth €20,000 in total.", "Drei Accounts mit zusammen 20.000 €.")],
          [tt("Accessible", "Erreichbar"), tt("Can sales and marketing reach it with a channel you have?", "Können Vertrieb und Marketing sie über einen vorhandenen Kanal erreichen?"), tt("Buyers you cannot identify before they call.", "Käufer, die Sie nicht erkennen, bevor sie anrufen.")],
          [tt("Differentiable", "Unterscheidbar"), tt("Would it react differently from other groups to the same offer?", "Würde sie auf dasselbe Angebot anders reagieren als andere Gruppen?"), tt("“Logistics” and “retail” that want exactly the same service.", "„Logistik“ und „Handel“, die genau denselben Service wollen.")],
          [tt("Actionable", "Umsetzbar"), tt("Can you build and deliver an offer for it?", "Können Sie ein Angebot dafür bauen und liefern?"), tt("A need your platform cannot meet.", "Ein Bedarf, den Ihre Plattform nicht erfüllen kann.")],
        ]}
        caption={tt("Five tests of a useful segment", "Fünf Tests für ein nützliches Segment")}
      />
      </ShowMore>
      <ShowMore id="A1" part="extra" label={tt("Show: what buyers expect", "Zeigen: was Käufer erwarten")}>
      <Callout label={tt("What buyers expect", "Was Käufer erwarten")} tone="signal">
        <p>
          {tt(
            "In McKinsey's 2021 study, 71% of customers expected personalised interactions and 76% were frustrated when they did not get them; personalisation most often lifted revenue by 10 to 15%. In B2B the buyer also does most of the work alone: Gartner (2019) found that buyers spend only about 17% of their buying time with suppliers. Whatever you send has to fit without a seller in the room.",
            "In der McKinsey-Studie von 2021 erwarteten 71 % der Kunden personalisierte Interaktionen und 76 % waren frustriert, wenn sie keine bekamen; Personalisierung steigerte den Umsatz meist um 10 bis 15 %. Im B2B macht der Käufer zudem den Großteil der Arbeit allein: Laut Gartner (2019) verbringen Käufer nur etwa 17 % ihrer Kaufzeit mit Anbietern. Was Sie schicken, muss passen, ohne dass ein Verkäufer im Raum ist.",
          )}
        </p>
      </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan={tt(
        "A target group is the strategic choice of whom you address at all. Segments are the operational groups inside it, each with its own need and its own offer. The chain is always: segment → need → offer.",
        "Eine Zielgruppe ist die strategische Wahl, wen man überhaupt anspricht. Segmente sind die operativen Gruppen darin, jede mit eigenem Bedarf und eigenem Angebot. Die Kette lautet immer: Segment → Bedarf → Angebot.",
      )}
      reasoning={[
        tt("Target group or segment? Ask whether the statement says whom to address at all (target group, strategic) or how one group is served differently from another (segment, operational).", "Zielgruppe oder Segment? Fragen Sie, ob die Aussage sagt, wen man überhaupt anspricht (Zielgruppe, strategisch), oder wie eine Gruppe anders bedient wird als eine andere (Segment, operativ)."),
        tt("A description by size, region and legal form that covers every account you have is a target group. It cannot be a segment, because it does not separate anyone inside it.", "Eine Beschreibung nach Größe, Region und Rechtsform, die jeden Ihrer Accounts umfasst, ist eine Zielgruppe. Sie kann kein Segment sein, weil sie niemanden darin trennt."),
        tt("Every segment needs its own need. If you cannot name what the segment has to solve, you do not yet have a segment.", "Jedes Segment braucht seinen eigenen Bedarf. Wenn Sie nicht sagen können, was das Segment lösen muss, haben Sie noch kein Segment."),
        tt("The offer follows from the need, not from the segment's name. If two segments would get the same offer, merge them.", "Das Angebot folgt aus dem Bedarf, nicht aus dem Namen des Segments. Bekämen zwei Segmente dasselbe Angebot, legen Sie sie zusammen."),
      ]}
      sources={["kotler2022", "wind1978", "dickson1987"]}
    >
      <p className={p}>
        {tt(
          "The two words are often used as if they meant the same. They do not, and the difference decides who owns what. Management chooses the target group, usually for years: it is where the company plays. Sales and marketing define the segments inside it and change them as they learn: it is how the company plays. Segmentation, targeting and positioning (Kotler et al. 2022) are three steps for this reason: first split the market, then choose, then build the offer.",
          "Die beiden Wörter werden oft gleich verwendet. Sie bedeuten nicht dasselbe, und der Unterschied entscheidet, wer was verantwortet. Die Geschäftsführung wählt die Zielgruppe, meist für Jahre: Dort spielt das Unternehmen. Vertrieb und Marketing definieren die Segmente darin und ändern sie, wenn sie dazulernen: So spielt das Unternehmen. Segmentierung, Targeting und Positionierung (Kotler et al. 2022) sind aus diesem Grund drei Schritte: erst den Markt teilen, dann wählen, dann das Angebot bauen.",
        )}
      </p>
      <Diagram label={tt("From market to offer · a worked example on Weserdata", "Vom Markt zum Angebot · ein Beispiel mit Weserdata")} caption={tt("Follow one of Weserdata's three segments and read each level. The dashed levels are strategic; the teal ones are operational.", "Folgen Sie einem der drei Segmente von Weserdata und lesen Sie jede Ebene. Die gestrichelten Ebenen sind strategisch, die türkisen operativ.")}>
        <SegmentLadder />
      </Diagram>
      <ShowMore id="A2" part="table" label={tt("Show the table: target group against segment", "Die Tabelle zeigen: Zielgruppe gegen Segment")}>
      <DataTable
        head={["", tt("Target group", "Zielgruppe"), tt("Segment", "Segment")]}
        rows={[
          [tt("Question it answers", "Beantwortete Frage"), tt("Whom do we address at all?", "Wen sprechen wir überhaupt an?"), tt("How do we serve this group differently?", "Wie bedienen wir diese Gruppe anders?")],
          [tt("Level", "Ebene"), tt("Strategic", "Strategisch"), tt("Operational", "Operativ")],
          [tt("Who decides", "Wer entscheidet"), tt("Management", "Geschäftsführung"), tt("Sales and marketing", "Vertrieb und Marketing")],
          [tt("How long it holds", "Wie lange es gilt"), tt("Years", "Jahre"), tt("Until the needs change, often a year", "Bis sich die Bedarfe ändern, oft ein Jahr")],
          [tt("Typical form", "Typische Form"), tt("Size band, region, industries", "Größenband, Region, Branchen"), tt("A shared need and a shared way of deciding", "Ein gemeinsamer Bedarf und eine gemeinsame Art zu entscheiden")],
        ]}
        caption={tt("Target group against segment", "Zielgruppe gegen Segment")}
      />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan={tt(
        "Three kinds of criteria: firmographic (what the company is), behaviour-based (what it did) and needs-based (what it must solve). The easier a criterion is to get, the less it usually tells you about the offer that will work.",
        "Drei Arten von Kriterien: firmografisch (was das Unternehmen ist), verhaltensbasiert (was es getan hat) und bedarfsbasiert (was es lösen muss). Je leichter ein Kriterium zu bekommen ist, desto weniger sagt es meist über das Angebot, das funktioniert.",
      )}
      reasoning={[
        ...CRIT_TESTS.slice(0, 3).map((c) => `${c.name}: ${c.test}`),
        CRIT_TESTS[3].test,
        tt("Segment on the criterion that predicts the response you care about (Wind 1978). For an offer, that is almost always the need and the way the customer decides, not its industry or size.", "Segmentieren Sie nach dem Kriterium, das die gewünschte Reaktion vorhersagt (Wind 1978). Für ein Angebot sind das fast immer der Bedarf und die Art zu entscheiden, nicht Branche oder Größe."),
        tt("Where do accounts differ most? Look for two accounts with the same industry or size and ask whether they want the same thing. If they do not, the industry is not where they differ.", "Wo unterscheiden sich Accounts am stärksten? Suchen Sie zwei Accounts mit gleicher Branche oder Größe und fragen Sie, ob sie dasselbe wollen. Wenn nicht, liegt der Unterschied nicht in der Branche."),
        tt("Firmographics are still useful: to reach a segment (lists, territories) and to size it. Use them to find accounts, not to decide what to offer them.", "Firmografie bleibt nützlich: um ein Segment zu erreichen (Listen, Gebiete) und seine Größe zu schätzen. Nutzen Sie sie, um Accounts zu finden, nicht um zu entscheiden, was Sie ihnen anbieten."),
      ]}
      sources={["shapiro1984", "wind1978", "christensen2016"]}
    >
      <p className={p}>
        {tt(
          "Shapiro and Bonoma (1984) proposed segmenting business customers in nested layers, like an onion. On the outside are firmographics, which anyone can buy from a data provider. Inside are the customer's operations, its purchasing approach, its situation, and the people who decide. The inner layers are harder to find out, because you learn them in conversations, and they are far better at telling you what a customer will buy. Christensen et al. (2016) make the same point from another side: customers “hire” a product for a job, and the job explains the purchase better than the customer's attributes.",
          "Shapiro und Bonoma (1984) schlugen vor, Geschäftskunden in verschachtelten Schichten zu segmentieren, wie eine Zwiebel. Außen liegt die Firmografie, die jeder bei einem Datenanbieter kaufen kann. Innen liegen der Betrieb des Kunden, sein Einkaufsverhalten, seine Lage und die Menschen, die entscheiden. Die inneren Schichten sind schwerer herauszufinden, weil man sie in Gesprächen erfährt, und sie sagen viel besser voraus, was ein Kunde kaufen wird. Christensen et al. (2016) sagen dasselbe von der anderen Seite: Kunden „engagieren“ ein Produkt für eine Aufgabe, und die Aufgabe erklärt den Kauf besser als die Merkmale des Kunden.",
        )}
      </p>
      <Diagram label={tt("The nested approach · five layers", "Der Nested Approach · fünf Schichten")} caption={tt("Click a layer or use the buttons. The dots compare how easy each layer is to find out with how well it predicts the need.", "Klicken Sie eine Schicht an oder nutzen Sie die Schaltflächen. Die Punkte vergleichen, wie leicht jede Schicht herauszufinden ist und wie gut sie den Bedarf vorhersagt.")}>
        <NestedRings />
      </Diagram>
      <CritSortExample />
      <DataTable
        head={[tt("Kind", "Art"), tt("The test question", "Die Testfrage"), tt("Example from a CRM", "Beispiel aus einem CRM")]}
        rows={[
          [CRIT_TESTS[0].name, CRIT_TESTS[0].test, tt("Industry code, employees, head office", "Branchencode, Mitarbeitende, Hauptsitz")],
          [CRIT_TESTS[1].name, CRIT_TESTS[1].test, tt("Tickets, orders, downloads, renewals", "Tickets, Bestellungen, Downloads, Verlängerungen")],
          [CRIT_TESTS[2].name, CRIT_TESTS[2].test, tt("A duty to an auditor, a capacity peak, no one to run it", "Eine Pflicht gegenüber einem Prüfer, eine Kapazitätsspitze, niemand für den Betrieb")],
        ]}
        caption={tt("Three kinds of criteria and their tests", "Drei Arten von Kriterien und ihre Tests")}
      />
    </MaterialCard>
  );
}

export function CardA4() {
  const cl = WESER.clinics;
  const upPts = cl.tailored - cl.standard;
  return (
    <MaterialCard
      id="A4"
      scan={tt(
        "Personalisation changes what you offer or say so it fits a group better. It costs effort, so it pays only where the win rate moves enough on contracts big enough. Where it does not pay, a good standard offer wins.",
        "Personalisierung verändert, was man anbietet oder sagt, damit es besser zu einer Gruppe passt. Sie kostet Aufwand, also lohnt sie sich nur, wo sich die Win Rate genug bewegt und die Verträge groß genug sind. Wo sie sich nicht lohnt, gewinnt ein gutes Standardangebot.",
      )}
      reasoning={[
        tt("Extra gross profit per year = proposals per year × (tailored win rate − standard win rate) × average first-year contract value × gross margin.", "Zusätzlicher Rohertrag pro Jahr = Angebote pro Jahr × (Win Rate zugeschnitten − Win Rate Standard) × durchschnittlicher Erstjahres-Vertragswert × Bruttomarge."),
        tt("Subtract the two win rates first; the difference is in points. Divide the points and the margin by 100 before you multiply.", "Ziehen Sie zuerst die beiden Win Rates voneinander ab; die Differenz ist in Punkten. Teilen Sie die Punkte und die Marge durch 100, bevor Sie multiplizieren."),
        tt("Net result = extra gross profit − the yearly cost of the tailored approach. A negative net result means the segment is better served with a standard offer.", "Nettoergebnis = zusätzlicher Rohertrag − jährliche Kosten des zugeschnittenen Ansatzes. Ein negatives Nettoergebnis heißt: Das Segment ist mit einem Standardangebot besser bedient."),
        tt("Many proposals with small contracts need a big jump in win rate to pay; few proposals with large contracts pay with a small one. Compare the net results, not the number of proposals.", "Viele Angebote mit kleinen Verträgen brauchen einen großen Sprung der Win Rate, um sich zu lohnen; wenige Angebote mit großen Verträgen lohnen sich schon mit einem kleinen. Vergleichen Sie die Nettoergebnisse, nicht die Zahl der Angebote."),
        tt("Personalise the content that answers the segment's need (proof, service model, technical access). Changing only the industry name in a message is not personalisation.", "Personalisieren Sie die Inhalte, die den Bedarf des Segments beantworten (Nachweise, Servicemodell, technischer Zugang). Nur den Branchennamen in einer Botschaft zu ändern, ist keine Personalisierung."),
        tt("Personalisation must pass the law first: use only the data you need, respect a customer's objection to direct marketing, and do not track or email without the consent German law requires.", "Personalisierung muss zuerst das Recht bestehen: nur die nötigen Daten nutzen, den Widerspruch eines Kunden gegen Direktwerbung respektieren und nicht ohne die Einwilligung tracken oder mailen, die deutsches Recht verlangt."),
      ]}
      sources={["mckinsey2021", "burgess2021", "gdpr", "uwg7", "tdddg25"]}
    >
      <ShowMore id="A4" part="table" label={tt("Show the table: how far to personalise", "Die Tabelle zeigen: wie weit man personalisiert")}>
      <DataTable
        head={[tt("Level", "Stufe"), tt("What is tailored", "Was zugeschnitten wird"), tt("Cost per account", "Kosten pro Account"), tt("When it fits", "Wann es passt")]}
        rows={[
          [tt("Mass (one-to-all)", "Masse (One-to-all)"), tt("Nothing: one offer for everyone", "Nichts: ein Angebot für alle"), tt("Lowest", "Am niedrigsten"), tt("A market where needs really are alike", "Ein Markt, in dem die Bedarfe wirklich gleich sind")],
          [tt("Segment (one-to-many)", "Segment (One-to-many)"), tt("Content, proof, service model per segment", "Inhalte, Nachweise, Servicemodell pro Segment"), tt("Low", "Niedrig"), tt("Groups with different needs, many accounts each", "Gruppen mit unterschiedlichen Bedarfen, jeweils viele Accounts")],
          [tt("Cluster (one-to-few)", "Cluster (One-to-few)"), tt("Messages and offers for a small cluster of similar accounts", "Botschaften und Angebote für eine kleine Gruppe ähnlicher Accounts"), tt("Medium", "Mittel"), tt("A handful of accounts that share a situation", "Eine Handvoll Accounts in derselben Lage")],
          [tt("Account (one-to-one)", "Account (One-to-one)"), tt("Everything, for one account", "Alles, für einen Account"), tt("Highest", "Am höchsten"), tt("A few large accounts worth the effort", "Wenige große Accounts, die den Aufwand wert sind")],
        ]}
        caption={tt("How far to personalise", "Wie weit man personalisiert")}
      />
      </ShowMore>
      <Diagram label={tt("Effort against benefit · a worked example on Weserdata", "Aufwand gegen Nutzen · ein Beispiel mit Weserdata")} caption={tt("Choose a segment and a rise in win rate. The bar compares the extra gross profit with the yearly cost of tailoring.", "Wählen Sie ein Segment und einen Anstieg der Win Rate. Der Balken vergleicht den zusätzlichen Rohertrag mit den jährlichen Kosten des Zuschnitts.")}>
        <EffortBenefit />
      </Diagram>
      <ShowMore id="A4" part="calc" label={tt("Show the worked calculation, step by step", "Die Beispielrechnung Schritt für Schritt zeigen")}>
      <DataTable
        head={[tt("Step", "Schritt"), tt("Calculation for Weserdata's clinics (Case assumption)", "Rechnung für die Kliniken von Weserdata (Fallannahme)"), tt("Result", "Ergebnis")]}
        rows={[
          [tt("1 · Rise in win rate, in points", "1 · Anstieg der Win Rate, in Punkten"), `${cl.tailored}% − ${cl.standard}%`, tt(`${upPts} points = 0.${String(upPts).padStart(2, "0")}`, `${upPts} Punkte = 0,${String(upPts).padStart(2, "0")}`)],
          [tt("2 · Extra contracts a year", "2 · Zusätzliche Verträge pro Jahr"), `${cl.proposals} × 0.${String(upPts).padStart(2, "0")}`, `${(cl.proposals * upPts) / 100}`],
          [tt("3 · Extra revenue", "3 · Zusätzlicher Umsatz"), `${(cl.proposals * upPts) / 100} × ${euro(cl.acv)}`, euro(((cl.proposals * upPts) / 100) * cl.acv)],
          [tt("4 · Extra gross profit = revenue × margin", "4 · Zusätzlicher Rohertrag = Umsatz × Marge"), `${euro(((cl.proposals * upPts) / 100) * cl.acv)} × ${WESER.margin}%`, euro(WESER_RESULT.clinics)],
          [tt("5 · Net result = gross profit − yearly cost", "5 · Nettoergebnis = Rohertrag − jährliche Kosten"), `${euro(WESER_RESULT.clinics)} − ${euro(WESER.cost)}`, euroSigned(WESER_RESULT.clinics - WESER.cost)],
        ]}
        caption={tt("The same method as the task, on different numbers", "Dieselbe Methode wie in der Aufgabe, mit anderen Zahlen")}
      />
      </ShowMore>
      <ShowMore id="A4" part="extra" label={tt("Show: Personalisation and German law, three tests", "Zeigen: Personalisierung und deutsches Recht, drei Tests")}>
      <Callout label={tt("Personalisation and German law: three tests before any campaign", "Personalisierung und deutsches Recht: drei Tests vor jeder Kampagne")} tone="rust">
        <ol className="list-decimal space-y-1 pl-5">
          <li>{tt("Data minimisation (GDPR Art. 5): use only the data the offer really needs. A need stated in a meeting is enough; a profile of every click is not.", "Datenminimierung (Art. 5 DSGVO): nur die Daten nutzen, die das Angebot wirklich braucht. Ein im Termin genannter Bedarf reicht; ein Profil aus jedem Klick nicht.")}</li>
          <li>{tt("Tracking a website visitor with cookies needs consent unless it is strictly necessary (§ 25 TDDDG).", "Das Tracking eines Website-Besuchers mit Cookies braucht eine Einwilligung, außer es ist unbedingt erforderlich (§ 25 TDDDG).")}</li>
          <li>{tt("Advertising emails generally need prior express consent, also between businesses (§ 7 UWG); anyone may object to direct marketing at any time (GDPR Art. 21).", "Werbe-E-Mails brauchen grundsätzlich eine vorherige ausdrückliche Einwilligung, auch zwischen Unternehmen (§ 7 UWG); jeder kann der Direktwerbung jederzeit widersprechen (Art. 21 DSGVO).")}</li>
        </ol>
      </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan={tt(
        "In B2B cloud three needs-based segments recur: accounts that must prove (Compliance-first), accounts that want it run for them (Hands-off) and accounts whose engineers want control (Scale-optimiser). Each has one test question.",
        "Im B2B-Cloud-Markt tauchen drei bedarfsbasierte Segmente immer wieder auf: Accounts, die nachweisen müssen (Compliance-first), Accounts, die betreiben lassen wollen (Hands-off), und Accounts, deren Engineers Kontrolle wollen (Scale-optimiser). Jedes hat eine Testfrage.",
      )}
      reasoning={[
        ...SEGMENT_IDS.map((s) => `${SEGMENTS[s].label}: ${SEGMENTS[s].test}`),
        tt("Assign an account by what its own words ask for, not by its industry or size. Find the phrase that decides the note, then ask the test question of the segment it points to.", "Ordnen Sie einen Account danach zu, wonach seine eigenen Worte fragen, nicht nach Branche oder Größe. Finden Sie die Wendung, die die Notiz entscheidet, und stellen Sie dann die Testfrage des Segments, auf das sie zeigt."),
        ...SEGMENT_PAIR_TESTS.map((x) => `${x.pair} ${x.test}`),
        tt("A segment sketch names who, the criterion, the need and how they decide: “[Name]: accounts that [criterion], who need [need], and who decide [how].”", "Eine Segmentskizze nennt, wer, das Kriterium, den Bedarf und wie entschieden wird: „[Name]: Accounts, die [Kriterium], die [Bedarf] brauchen und die [wie] entscheiden.“"),
      ]}
      sources={["bsic5", "nis2", "christensen2016", "shapiro1984"]}
    >
      <p className={p}>
        {tt(
          "These three are practitioner archetypes, not a law of nature; a provider with other customers would find other segments. What makes them useful is that each is defined by a need and a way of deciding, and each needs a different offer. Regulation drives the first one in Germany: a supervised financial firm, a KRITIS utility under NIS2 or a clinic handling patient data must show an auditor where the data is, often by asking for the provider's BSI C5 report.",
          "Diese drei sind Archetypen aus der Praxis, kein Naturgesetz; ein Anbieter mit anderen Kunden fände andere Segmente. Nützlich macht sie, dass jedes über einen Bedarf und eine Art zu entscheiden definiert ist und jedes ein anderes Angebot braucht. Das erste treibt in Deutschland die Regulierung: Eine beaufsichtigte Finanzfirma, ein KRITIS-Versorger unter NIS2 oder eine Klinik mit Patientendaten muss einem Prüfer zeigen, wo die Daten liegen, oft über den BSI-C5-Bericht des Anbieters.",
        )}
      </p>
      <DataTable
        head={[tt("Segment", "Segment"), tt("What it needs", "Was es braucht"), tt("How it decides", "Wie es entscheidet"), tt("What it sounds like", "Wie es klingt"), tt("Test question", "Testfrage")]}
        rows={SEGMENT_IDS.map((s) => [SEGMENTS[s].label, SEGMENTS[s].need, SEGMENTS[s].decides, SEGMENTS[s].sounds, SEGMENTS[s].test])}
        caption={tt("Three needs-based segments: a profile of each", "Drei bedarfsbasierte Segmente: ein Profil von jedem")}
      />
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("When two segments seem to fit", "Wenn zwei Segmente zu passen scheinen")}</p>
        <Bul
          items={SEGMENT_PAIR_TESTS.map((x) => (
            <>
              <strong>{x.pair}</strong> {x.test}
            </>
          ))}
        />
      </div>
      <AssignExample />
      <Callout label={tt("Size and industry are clues, not answers", "Größe und Branche sind Hinweise, keine Antworten")} tone="signal">
        <p>{SEGMENT_IDS.map((s) => `${SEGMENTS[s].label}: ${SEGMENTS[s].typical}`).join(" ")}</p>
      </Callout>
    </MaterialCard>
  );
}

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan={tt(
        "A segment's business value is what its accounts could pay, not how many accounts it has. Add up their potential contract value, rate it, and then say honestly what your data cannot tell you.",
        "Der Geschäftswert eines Segments ist das, was seine Accounts zahlen könnten, nicht wie viele Accounts es hat. Summieren Sie den potenziellen Vertragswert, bewerten Sie ihn, und sagen Sie dann ehrlich, was Ihre Daten nicht verraten.",
      )}
      reasoning={[
        tt("Business value = the sum of the potential annual contract value of the accounts you placed in the segment. €150,000 or more is High, €100,000 to €149,999 is Mid, less than €100,000 is Low.", "Geschäftswert = die Summe des potenziellen Jahresvertragswerts der Accounts, die Sie dem Segment zugeordnet haben. 150.000 € oder mehr ist Hoch, 100.000 bis 149.999 € ist Mittel, weniger als 100.000 € ist Niedrig."),
        tt("Apply the rule to your own assignment. If you placed an account differently, your sums differ and your rating follows your own evidence.", "Wenden Sie die Regel auf Ihre eigene Zuordnung an. Haben Sie einen Account anders zugeordnet, ändern sich Ihre Summen, und Ihre Bewertung folgt Ihrer eigenen Evidenz."),
        tt("The segment with the most accounts is not necessarily the most valuable. Rank by value, not by count.", "Das Segment mit den meisten Accounts ist nicht unbedingt das wertvollste. Ordnen Sie nach Wert, nicht nach Anzahl."),
        tt("What to personalise for a segment is the content that answers its need: evidence for those who must prove, a service model and a contact for those who want it run, technical access and transparent prices for those who want control.", "Was man für ein Segment personalisiert, sind die Inhalte, die seinen Bedarf beantworten: Nachweise für die, die nachweisen müssen, ein Servicemodell und ein Ansprechpartner für die, die betreiben lassen wollen, technischer Zugang und transparente Preise für die, die Kontrolle wollen."),
        tt("A useful gap is one that would change the segment you pick or the offer you build, and that the file does not already hold. A count of your own activity (emails, newsletter opens) is not about the customer's need.", "Eine nützliche Lücke ist eine, die das gewählte Segment oder das gebaute Angebot ändern würde und die die Datei noch nicht enthält. Ein Zählwert Ihrer eigenen Aktivität (E-Mails, Newsletter-Öffnungen) sagt nichts über den Bedarf des Kunden."),
        tt("The typical risk of a wrong segmentation is sending the right offer to the wrong accounts. Name the sign you would see: proposals that stall although the offer fits the segment on paper.", "Das typische Risiko einer falschen Segmentierung: das richtige Angebot an die falschen Accounts schicken. Nennen Sie das Anzeichen, das Sie sehen würden: Angebote, die stocken, obwohl das Angebot auf dem Papier zum Segment passt."),
      ]}
      sources={["kotler2022", "wind1978", "kaplan2004"]}
    >
      <Diagram label={tt("Count or value · a worked example on Weserdata's ten accounts", "Anzahl oder Wert · ein Beispiel mit zehn Accounts von Weserdata")} caption={tt("Switch the ranking between the number of accounts and the potential contract value, and watch the order turn round.", "Wechseln Sie die Rangfolge zwischen Zahl der Accounts und potenziellem Vertragswert, und sehen Sie, wie sich die Reihenfolge umdreht.")}>
        <ValueExample />
      </Diagram>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("What a segment file cannot tell you: four kinds of gap", "Was eine Segmentdatei nicht verrät: vier Arten von Lücken")}</p>
        <Bul
          items={[
            <>
              <strong>{tt("Revenue, not profit.", "Umsatz, nicht Gewinn.")}</strong> {tt("Contract value says nothing about what an account costs to serve (Kaplan & Anderson 2004).", "Der Vertragswert sagt nichts darüber, was die Betreuung eines Accounts kostet (Kaplan & Anderson 2004).")}
            </>,
            <>
              <strong>{tt("A sample, not the market.", "Eine Stichprobe, nicht der Markt.")}</strong> {tt("Twelve accounts show a pattern; how many more there are decides whether the segment is substantial.", "Zwölf Accounts zeigen ein Muster; wie viele es darüber hinaus gibt, entscheidet, ob das Segment substanziell ist.")}
            </>,
            <>
              <strong>{tt("One voice, not the buying centre.", "Eine Stimme, nicht das Buying Center.")}</strong> {tt("An account manager's note shows one contact's view of how the account decides.", "Die Notiz eines Account Managers zeigt die Sicht eines Kontakts darauf, wie der Account entscheidet.")}
            </>,
            <>
              <strong>{tt("A snapshot, not a trend.", "Eine Momentaufnahme, kein Trend.")}</strong> {tt("A need tied to one audit or one migration may be gone next year.", "Ein Bedarf, der an ein Audit oder eine Migration gebunden ist, kann nächstes Jahr weg sein.")}
            </>,
          ]}
        />
      </div>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Three ways a segmentation goes wrong in practice", "Drei Arten, wie Segmentierung in der Praxis scheitert")}</p>
        <Bul
          items={[
            tt("Segmenting by the easy criterion: industry lists look tidy and do not separate needs.", "Nach dem bequemen Kriterium segmentieren: Branchenlisten sehen ordentlich aus und trennen keine Bedarfe."),
            tt("Too many segments: each is too small to pay for its own offer, and sellers cannot remember them.", "Zu viele Segmente: Jedes ist zu klein für ein eigenes Angebot, und der Vertrieb kann sie sich nicht merken."),
            tt("Having data without understanding segments: a CRM full of fields, and nobody who can say what a segment needs.", "Daten haben, ohne Segmente zu verstehen: ein CRM voller Felder, und niemand kann sagen, was ein Segment braucht."),
          ]}
        />
      </div>
      <ShowMore id="A6" part="extra" label={tt("Show: small numbers", "Zeigen: kleine Zahlen")}>
      <Callout label={tt("Small numbers", "Kleine Zahlen")} tone="rust">
        <p>{tt("Twelve accounts are a pattern to act on, not a statistic to quote. Say “in the twelve accounts”, not “the market”.", "Zwölf Accounts sind ein Muster zum Handeln, keine Statistik zum Zitieren. Sagen Sie „in den zwölf Accounts“, nicht „der Markt“.")}</p>
      </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA7() {
  return (
    <MaterialCard
      id="A7"
      scan={tt(
        "A personalisation measure is worth funding when it answers the need of a valuable segment, when competitors cannot easily copy it, and when it costs little enough per account it reaches. Multiply the three scores and check the budget.",
        "Eine Personalisierungsmaßnahme lohnt sich, wenn sie den Bedarf eines wertvollen Segments beantwortet, wenn Wettbewerber sie nicht leicht kopieren können und wenn sie pro erreichtem Account wenig genug kostet. Multiplizieren Sie die drei Werte und prüfen Sie das Budget.",
      )}
      reasoning={[
        tt("Match first. Each measure says what it changes for the account. Name the segments whose need that change answers; a measure that answers no segment's need serves none.", "Zuerst zuordnen. Jede Maßnahme sagt, was sie für den Account ändert. Nennen Sie die Segmente, deren Bedarf diese Änderung beantwortet; eine Maßnahme, die keinen Segmentbedarf beantwortet, dient keinem."),
        tt("Segment value: add up the potential contract values of the accounts in the segment. €150,000 or more is High, €100,000 to €149,999 Mid, less is Low.", "Segmentwert: Addieren Sie die potenziellen Vertragswerte der Accounts im Segment. 150.000 € oder mehr ist Hoch, 100.000 bis 149.999 € Mittel, weniger Niedrig."),
        tt("Relevance: 3 if it answers the first need of a segment your own tally rates High; 2 if it answers a Mid segment's need, or touches every segment only a little; 1 if it serves a Low segment or no segment's need.", "Relevanz: 3, wenn sie den ersten Bedarf eines Segments beantwortet, das Ihre eigene Auszählung als Hoch einstuft; 2, wenn sie den Bedarf eines mittleren Segments beantwortet oder jedes Segment nur ein wenig berührt; 1, wenn sie einem niedrigen Segment oder keinem Segmentbedarf dient."),
        tt("Differentiation: 3 if a generic provider offer does not include it; 2 if competitors offer something similar; 1 if any competitor can match it at once (a discount, sales training, industry wording).", "Differenzierung: 3, wenn ein generisches Anbieterangebot das nicht enthält; 2, wenn Wettbewerber etwas Ähnliches bieten; 1, wenn jeder Wettbewerber es sofort nachziehen kann (ein Rabatt, ein Vertriebstraining, Branchensprache)."),
        EV_RULE.v,
        tt("Score = relevance × differentiation × economic viability, from 1 to 27. Compare the products, and check that the plan's costs add up to no more than the budget.", "Wert = Relevanz × Differenzierung × Wirtschaftlichkeit, von 1 bis 27. Vergleichen Sie die Produkte und prüfen Sie, dass die Kosten des Plans das Budget nicht übersteigen."),
        tt("If the measures you want cost more than the budget, leave out the one with the lowest score. Do not shave every measure a little.", "Kosten die gewünschten Maßnahmen mehr als das Budget, lassen Sie die mit dem niedrigsten Wert weg. Kürzen Sie nicht jede Maßnahme ein bisschen."),
        tt("A Low-value segment is not ignored: it is served with a standard offer. Leaving it out of the personalisation budget is a decision, and you say so.", "Ein Segment mit niedrigem Wert wird nicht ignoriert: Es wird mit einem Standardangebot bedient. Es aus dem Personalisierungsbudget herauszulassen, ist eine Entscheidung, und Sie sagen das."),
        tt("A measure that fails the legal tests of A4 (tracking without consent, unsolicited emails) is out, whatever its score.", "Eine Maßnahme, die die rechtlichen Tests aus A4 nicht besteht (Tracking ohne Einwilligung, unerbetene E-Mails), ist raus, egal wie hoch ihr Wert ist."),
      ]}
      sources={["gilmore1997", "burgess2021", "gdpr", "uwg7"]}
    >
      <DataTable
        head={[tt("Segment", "Segment"), tt("What answers it", "Was es beantwortet"), tt("What does not", "Was es nicht beantwortet")]}
        rows={[
          [SEGMENTS.assure.label, SEGMENTS.assure.answeredBy, tt("A discount, or pictures of its industry.", "Ein Rabatt, oder Bilder seiner Branche.")],
          [SEGMENTS.handsoff.label, SEGMENTS.handsoff.answeredBy, tt("More portal features, or a longer proposal.", "Mehr Portalfunktionen, oder ein längeres Angebot.")],
          [SEGMENTS.scale.label, SEGMENTS.scale.answeredBy, tt("A sales presentation, or a fixed bundle it cannot measure.", "Eine Verkaufspräsentation, oder ein festes Paket, das es nicht messen kann.")],
        ]}
        caption={tt("Matching a measure to a segment", "Eine Maßnahme einem Segment zuordnen")}
      />
      <Diagram label={tt("Scoring three measures · a worked example on Weserdata", "Drei Maßnahmen bewerten · ein Beispiel mit Weserdata")} caption={tt(`Weserdata has ${euro(60000)}. Change a relevance or differentiation score, or take a measure out of the plan. Economic viability follows from the cost per account.`, `Weserdata hat ${euro(60000)}. Ändern Sie einen Relevanz- oder Differenzierungswert oder nehmen Sie eine Maßnahme aus dem Plan. Die Wirtschaftlichkeit folgt aus den Kosten pro Account.`)}>
        <ScoreExample />
      </Diagram>
      <DataTable
        head={[tt("Score", "Wert"), "3", "2", "1"]}
        rows={[
          [tt("Relevance", "Relevanz"), tt("First need of a High-value segment", "Erster Bedarf eines Segments mit hohem Wert"), tt("A Mid segment's need, or every segment a little", "Bedarf eines mittleren Segments, oder jedes Segment ein wenig"), tt("A Low segment, or no segment's need", "Ein niedriges Segment, oder kein Segmentbedarf")],
          [tt("Differentiation", "Differenzierung"), tt("Not in a generic offer", "Nicht in einem generischen Angebot"), tt("Competitors offer something similar", "Wettbewerber bieten Ähnliches"), tt("Anyone can match it at once", "Jeder kann es sofort nachziehen")],
          [tt("Economic viability", "Wirtschaftlichkeit"), tt("€2,000 or less per account", "2.000 € oder weniger pro Account"), tt("€2,001 to €4,000 per account", "2.001 bis 4.000 € pro Account"), tt("More than €4,000 per account", "Mehr als 4.000 € pro Account")],
        ]}
        caption={tt("The three scores", "Die drei Werte")}
      />
      <p className="text-caption text-ash">
        {tt(
          "The three scores are the evaluation the course plan names for this case: relevance × differentiation × economic viability. They make a judgement explicit and comparable; they are not a mark.",
          "Die drei Werte sind die Bewertung, die der Kursplan für diesen Fall nennt: Relevanz × Differenzierung × Wirtschaftlichkeit. Sie machen ein Urteil ausdrücklich und vergleichbar; sie sind keine Note.",
        )}
      </p>
    </MaterialCard>
  );
}

export const CARDS_A = [CardA1, CardA2, CardA3, CardA4, CardA5, CardA6, CardA7];
