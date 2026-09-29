import { getLang } from "@/lib/lang";

/**
 * Plain-language glossary (CLAUDE.md #19), in English and German (#32). Every technical term, abbreviation or German word that the
 * material or a task uses is an entry here. In the text it becomes a dotted link; a click opens the explanation. Written for someone
 * who is NOT an expert: short sentences, everyday words, one example where it helps.
 *
 * `match` lists every English written form; `de.match` every form the German text uses (the English term itself, with the German
 * plural or genitive forms, and German words). The German `title` keeps the English term where German practitioners use it. An
 * all-capitals match ("CRM") is matched exactly, so ordinary words never turn into links.
 */
export type GlossDe = { title?: string; match: string[]; plain: string; example?: string };
export type GlossEntry = {
  id: string;
  title: string;
  match: string[];
  exactCase?: boolean;
  plain: string;
  example?: string;
  from?: string;
  de?: GlossDe;
};

export const GLOSSARY: GlossEntry[] = [
  // --- segmentation ------------------------------------------------------------
  {
    id: "segment",
    title: "Segment",
    match: ["segment", "segments", "segmentation", "segmenting", "segmented"],
    plain: "A group of customers who need similar things and decide in a similar way, so one offer can serve all of them well. Segmentation is splitting a market into such groups.",
    example: "Firms that must prove where their data is form one segment; firms that want someone to run their IT form another.",
    from: "Smith 1956",
    de: {
      match: ["Segment", "Segments", "Segmente", "Segmenten", "Segmentierung", "segmentieren", "segmentiert"],
      plain: "Eine Gruppe von Kunden, die Ähnliches brauchen und ähnlich entscheiden, sodass ein Angebot alle gut bedienen kann. Segmentierung heißt, einen Markt in solche Gruppen zu teilen.",
      example: "Firmen, die nachweisen müssen, wo ihre Daten liegen, bilden ein Segment; Firmen, die jemanden für den IT-Betrieb wollen, ein anderes.",
    },
  },
  {
    id: "target-group",
    title: "Target group",
    match: ["target group", "target groups"],
    plain: "The strategic choice of whom a company addresses at all, such as “Mittelstand firms in Germany”. Segments are the groups inside it that get their own offer.",
    de: {
      title: "Zielgruppe",
      match: ["Zielgruppe", "Zielgruppen", "Zielgruppenstrategie"],
      plain: "Die strategische Entscheidung, wen ein Unternehmen überhaupt anspricht, etwa „Mittelständler in Deutschland“. Segmente sind die Gruppen darin, die ein eigenes Angebot bekommen.",
    },
  },
  {
    id: "firmographic",
    title: "Firmographic",
    match: ["firmographic", "firmographics"],
    plain: "Facts about a company you can look up without talking to it: industry, size, location, legal form. Easy to get, and often weak at predicting what the company needs.",
    example: "“Employees: 380” and “Head office: Bremen” are firmographic.",
    de: {
      title: "Firmografisch (Firmographics)",
      match: ["Firmografisch", "firmografisch", "firmografische", "firmografischen", "Firmografie", "Firmographics"],
      plain: "Fakten über ein Unternehmen, die man nachschlagen kann, ohne mit ihm zu sprechen: Branche, Größe, Standort, Rechtsform. Leicht zu bekommen, aber oft schwach darin vorherzusagen, was das Unternehmen braucht.",
      example: "„Mitarbeitende: 380“ und „Hauptsitz: Bremen“ sind firmografisch.",
    },
  },
  {
    id: "behaviour-based",
    title: "Behaviour-based criterion",
    match: ["behaviour-based", "buying behaviour", "usage behaviour"],
    plain: "Something a customer did that your own systems recorded: orders, tickets, logins, downloads. It shows what happened, not why.",
    example: "“Opened three restore tickets last quarter.”",
    de: {
      title: "Verhaltensbasiertes Kriterium",
      match: ["Verhaltensbasiert", "verhaltensbasiert", "verhaltensbasierte", "verhaltensbasierten", "Kaufverhalten", "Nutzungsverhalten"],
      plain: "Etwas, das ein Kunde getan hat und das Ihre eigenen Systeme festgehalten haben: Bestellungen, Tickets, Logins, Downloads. Es zeigt, was passiert ist, nicht warum.",
      example: "„Hat im letzten Quartal drei Restore-Tickets eröffnet.“",
    },
  },
  {
    id: "needs-based",
    title: "Needs-based criterion",
    match: ["needs-based"],
    plain: "The problem, duty or goal a customer has to solve. It is the hardest criterion to find out and the best at predicting which offer will work.",
    example: "“Must prove to its auditor that data never leaves Germany.”",
    de: {
      title: "Bedarfsbasiertes Kriterium",
      match: ["Bedarfsbasiert", "bedarfsbasiert", "bedarfsbasierte", "bedarfsbasierten", "bedarfsbasiertes"],
      plain: "Das Problem, die Pflicht oder das Ziel, das ein Kunde lösen muss. Es ist das Kriterium, das man am schwersten herausfindet, und das beste, um vorherzusagen, welches Angebot funktioniert.",
      example: "„Muss seinem Prüfer nachweisen, dass die Daten Deutschland nie verlassen.“",
    },
  },
  {
    id: "nested",
    title: "Nested approach",
    match: ["nested approach", "nested model"],
    plain: "A way to segment business customers in layers, like an onion: firmographics on the outside (easy to see), then how the customer operates, how it buys, its situation, and the people inside (hard to see but most telling).",
    from: "Shapiro & Bonoma 1984",
    de: {
      title: "Nested Approach",
      match: ["Nested Approach", "Nested-Approach"],
      plain: "Eine Art, Geschäftskunden in Schichten zu segmentieren, wie eine Zwiebel: außen die Firmografie (leicht zu sehen), dann wie der Kunde arbeitet, wie er einkauft, seine Lage und die Menschen innen (schwer zu sehen, aber am aussagekräftigsten).",
    },
  },
  {
    id: "jtbd",
    title: "Jobs to be done",
    match: ["jobs to be done", "job to be done"],
    plain: "The idea that a customer “hires” a product to get a job done. The job explains the purchase better than facts about the customer do.",
    example: "A small firm does not buy “cloud storage”; it hires someone to make sure the backup works every night.",
    from: "Christensen et al. 2016",
    de: {
      title: "Jobs to be done",
      match: ["Jobs to be done", "Job to be done"],
      plain: "Die Idee, dass ein Kunde ein Produkt „einstellt“, um eine Aufgabe erledigt zu bekommen. Die Aufgabe erklärt den Kauf besser als Fakten über den Kunden.",
      example: "Eine kleine Firma kauft keinen „Cloud-Speicher“; sie engagiert jemanden, der sicherstellt, dass das Backup jede Nacht läuft.",
    },
  },
  {
    id: "msada",
    title: "Useful segment (five tests)",
    match: ["measurable", "substantial", "accessible", "differentiable", "actionable"],
    exactCase: true,
    plain: "A segment is useful when it is measurable (you can count it), substantial (big enough to pay for its own offer), accessible (you can reach it), differentiable (it reacts differently from others) and actionable (you can build an offer for it).",
    from: "Kotler, Keller & Chernev 2022",
    de: {
      title: "Nützliches Segment (fünf Tests)",
      match: ["messbar", "substanziell", "erreichbar", "unterscheidbar", "umsetzbar"],
      plain: "Ein Segment ist nützlich, wenn es messbar ist (man kann es zählen), substanziell (groß genug für ein eigenes Angebot), erreichbar (man kommt an es heran), unterscheidbar (es reagiert anders als andere) und umsetzbar (man kann ein Angebot dafür bauen).",
    },
  },
  {
    id: "compliance-first",
    title: "Compliance-first",
    match: ["Compliance-first"],
    exactCase: true,
    plain: "DataCloud's name for accounts that must prove to someone outside (an auditor, a supervisory authority, a tender committee) where their data is and how they could leave the provider.",
    de: {
      match: ["Compliance-first"],
      plain: "Der Name bei DataCloud für Accounts, die einer externen Stelle (Prüfer, Aufsicht, Vergabekommission) nachweisen müssen, wo ihre Daten liegen und wie sie den Anbieter verlassen könnten.",
    },
  },
  {
    id: "hands-off",
    title: "Hands-off",
    match: ["Hands-off"],
    exactCase: true,
    plain: "DataCloud's name for accounts that want the service run for them: no in-house engineer, one contact, one planned monthly price.",
    de: {
      match: ["Hands-off"],
      plain: "Der Name bei DataCloud für Accounts, die den Service betrieben haben wollen: kein eigener Engineer, ein Ansprechpartner, ein planbarer Monatspreis.",
    },
  },
  {
    id: "scale-optimiser",
    title: "Scale-optimiser",
    match: ["Scale-optimiser", "Scale-optimisers"],
    exactCase: true,
    plain: "DataCloud's name for accounts whose own engineers want access, flexible capacity and prices they can compare, and who decide through a technical test.",
    de: {
      match: ["Scale-optimiser"],
      plain: "Der Name bei DataCloud für Accounts, deren eigene Engineers Zugriff, flexible Kapazität und vergleichbare Preise wollen und die über einen technischen Test entscheiden.",
    },
  },
  {
    id: "buying-centre",
    title: "Buying centre",
    match: ["buying centre", "buying center", "buying group"],
    plain: "Everyone in a customer company who takes part in a purchase: the user, IT, finance, legal, the person who signs. Each can slow or stop it.",
    de: {
      title: "Buying Center",
      match: ["Buying Center", "Buying Centers", "Gremium", "Gremienentscheidungen"],
      plain: "Alle Personen im Kundenunternehmen, die an einem Kauf beteiligt sind: Nutzer, IT, Finanzen, Recht, wer unterschreibt. Jede kann den Kauf bremsen oder stoppen.",
    },
  },
  // --- personalisation ----------------------------------------------------------
  {
    id: "personalisation",
    title: "Personalisation",
    match: ["personalisation", "personalization", "personalise", "personalising", "personalised", "personalize", "personalized", "tailoring", "tailored"],
    plain: "Changing what you offer or say so it fits a particular customer group or account better. In B2B it ranges from one message per segment to a proposal written for one account.",
    from: "McKinsey 2021",
    de: {
      title: "Personalisierung",
      match: ["Personalisierung", "Personalisierungsmaßnahmen", "personalisiert", "personalisieren", "personalisierte", "Personalisieren", "Zuschnitt"],
      plain: "Das, was man anbietet oder sagt, so verändern, dass es besser zu einer Kundengruppe oder einem Account passt. Im B2B reicht es von einer Botschaft pro Segment bis zu einem Angebot für einen einzigen Account.",
    },
  },
  {
    id: "one-to-one",
    title: "One-to-one, one-to-few, one-to-many",
    match: ["one-to-one", "one-to-few", "one-to-many"],
    plain: "How far personalisation goes: one-to-one is made for a single account, one-to-few for a small cluster of similar accounts, one-to-many for a whole segment. The further you go, the more each account costs to serve.",
    from: "Burgess & Munn 2021",
    de: {
      match: ["One-to-one", "One-to-few", "One-to-many"],
      plain: "Wie weit Personalisierung geht: One-to-one ist für einen einzigen Account gemacht, One-to-few für eine kleine Gruppe ähnlicher Accounts, One-to-many für ein ganzes Segment. Je weiter man geht, desto mehr kostet die Betreuung jedes Accounts.",
    },
  },
  {
    id: "abm",
    title: "ABM — account-based marketing",
    match: ["ABM", "account-based marketing"],
    plain: "Treating one important account, or a few, as a market of their own, with messages and offers made for them. It is personalisation at its most expensive.",
    from: "Burgess & Munn 2021",
    de: {
      match: ["ABM", "Account-based Marketing"],
      plain: "Einen wichtigen Account oder wenige als eigenen Markt behandeln, mit Botschaften und Angeboten, die für sie gemacht sind. Es ist Personalisierung in ihrer teuersten Form.",
    },
  },
  {
    id: "acv",
    title: "ACV — annual contract value",
    match: ["ACV", "contract value", "first-year contract value"],
    plain: "What one customer pays per year under the contract. It is revenue, not profit.",
    example: "A €56,000 ACV at a 35% gross margin leaves €19,600 of gross profit a year.",
    de: {
      title: "ACV — Annual Contract Value (Jahresvertragswert)",
      match: ["ACV", "Vertragswert", "Erstjahres-Vertragswert", "Jahresvertragswert"],
      plain: "Was ein Kunde laut Vertrag pro Jahr zahlt. Es ist Umsatz, nicht Gewinn.",
      example: "Ein ACV von 56.000 € bei 35 % Bruttomarge lässt 19.600 € Rohertrag pro Jahr.",
    },
  },
  {
    id: "win-rate",
    title: "Win rate",
    match: ["win rate", "win rates"],
    plain: "The share of your proposals that become signed contracts.",
    example: "30 proposals and 6 signed contracts is a 20% win rate.",
    de: {
      title: "Win Rate (Abschlussquote)",
      match: ["Win Rate", "Win Rates", "Win-Rate", "Abschlussquote"],
      plain: "Der Anteil Ihrer Angebote, aus dem unterschriebene Verträge werden.",
      example: "30 Angebote und 6 unterschriebene Verträge sind eine Win Rate von 20 %.",
    },
  },
  {
    id: "conversion",
    title: "Conversion rate",
    match: ["conversion rate", "conversion"],
    plain: "The share of prospects that move to the next step, in the end to a contract. “Low conversion” means many conversations, few contracts.",
    de: {
      title: "Conversion Rate",
      match: ["Conversion Rate", "Conversion"],
      plain: "Der Anteil der Interessenten, die zum nächsten Schritt gehen, am Ende zum Vertrag. „Niedrige Conversion“ heißt: viele Gespräche, wenige Verträge.",
    },
  },
  {
    id: "gross-margin",
    title: "Gross margin, gross profit",
    match: ["gross margin", "gross profit", "margin", "extra profit"],
    plain: "What is left of revenue after the direct cost of delivering the service. The margin is that share in percent; the gross profit is the amount in euros.",
    example: "€10,000 of revenue at a 35% margin is €3,500 of gross profit.",
    de: {
      title: "Bruttomarge, Rohertrag",
      match: ["Bruttomarge", "Rohertrag", "Marge", "Zusatzgewinn"],
      plain: "Was vom Umsatz übrig bleibt, nachdem die direkten Kosten der Leistung bezahlt sind. Die Marge ist dieser Anteil in Prozent; der Rohertrag ist der Betrag in Euro.",
      example: "10.000 € Umsatz bei 35 % Marge sind 3.500 € Rohertrag.",
    },
  },
  {
    id: "break-even",
    title: "Break-even",
    match: ["break-even", "breaks even", "the cost to beat"],
    plain: "The point where what something earns is exactly what it costs. Below it you lose money, above it you make money.",
    example: "Tailoring costs €25,000 a year. If it earns €25,000 you are at break-even; €27,000 leaves €2,000.",
    de: {
      match: ["Break-even", "die zu schlagenden Kosten"],
      plain: "Der Punkt, an dem etwas genau so viel einbringt, wie es kostet. Darunter verliert man Geld, darüber verdient man.",
      example: "Der Zuschnitt kostet 25.000 € im Jahr. Bringt er 25.000 €, sind Sie beim Break-even; 27.000 € lassen 2.000 € übrig.",
    },
  },
  {
    id: "pilot",
    title: "Pilot",
    match: ["pilot"],
    plain: "A small, time-limited trial run on real customers before a change is rolled out to everyone. DataCloud tried its tailored approach for six months first.",
    de: {
      title: "Pilot",
      match: ["Pilot", "Piloten", "Pilotphase"],
      plain: "Ein kleiner, zeitlich begrenzter Versuch mit echten Kunden, bevor eine Änderung für alle eingeführt wird. DataCloud hat seinen zugeschnittenen Ansatz erst sechs Monate getestet.",
    },
  },
  {
    id: "rdev",
    title: "Relevance, differentiation, economic viability",
    match: ["economic viability", "differentiation", "relevance"],
    plain: "The three scores of a personalisation measure: does it answer the need of a valuable segment (relevance), could a competitor offer the same (differentiation), and does it cost little enough per account reached (economic viability)?",
    de: {
      title: "Relevanz, Differenzierung, Wirtschaftlichkeit",
      match: ["Wirtschaftlichkeit", "Differenzierung", "Relevanz"],
      plain: "Die drei Bewertungen einer Personalisierungsmaßnahme: Beantwortet sie den Bedarf eines wertvollen Segments (Relevanz), könnte ein Wettbewerber dasselbe bieten (Differenzierung), und kostet sie wenig genug pro erreichtem Account (Wirtschaftlichkeit)?",
    },
  },
  {
    id: "cost-per-account",
    title: "Cost per account reached",
    match: ["cost per account", "per account reached"],
    plain: "A measure's cost divided by the number of accounts it reaches. It lets you compare a cheap campaign for many with an expensive one for few.",
    example: "€38,000 reaching 20 accounts is €1,900 per account.",
    de: {
      title: "Kosten pro erreichtem Account",
      match: ["Kosten pro Account", "pro erreichtem Account"],
      plain: "Die Kosten einer Maßnahme geteilt durch die Zahl der Accounts, die sie erreicht. So kann man eine günstige Kampagne für viele mit einer teuren für wenige vergleichen.",
      example: "38.000 € für 20 Accounts sind 1.900 € pro Account.",
    },
  },
  // --- cloud and compliance terms ------------------------------------------------
  {
    id: "crm",
    title: "CRM — customer relationship management system",
    match: ["CRM"],
    plain: "The software in which a sales team records every customer and deal: contacts, notes, orders, next steps. It is where segment fields would be stored.",
    de: { title: "CRM — Customer Relationship Management", match: ["CRM", "CRM-Felder", "CRM-Feldern", "CRM-Export"], plain: "Die Software, in der ein Vertriebsteam jeden Kunden und jeden Deal festhält: Kontakte, Notizen, Bestellungen, nächste Schritte. Dort würden Segmentfelder gespeichert." },
  },
  {
    id: "nace",
    title: "NACE code",
    match: ["NACE"],
    plain: "The EU's standard code for a company's industry, such as 49.41 for road freight. It is a firmographic fact.",
    de: { title: "NACE-Code", match: ["NACE", "NACE-Code", "NACE-Branchencode"], plain: "Der EU-Standardcode für die Branche eines Unternehmens, etwa 49.41 für Güterverkehr auf der Straße. Er ist eine firmografische Tatsache." },
  },
  {
    id: "c5",
    title: "BSI C5",
    match: ["C5", "BSI C5", "C5 report"],
    plain: "A catalogue of security requirements for cloud providers, published by Germany's Federal Office for Information Security (BSI). An independent auditor checks a provider against it and writes a report that customers can show their own auditors.",
    from: "BSI C5:2020",
    de: { title: "BSI C5", match: ["C5", "BSI C5", "C5-Bericht", "BSI-C5-Bericht", "C5-Bericht"], plain: "Ein Katalog von Sicherheitsanforderungen an Cloud-Anbieter, herausgegeben vom Bundesamt für Sicherheit in der Informationstechnik (BSI). Ein unabhängiger Prüfer prüft den Anbieter danach und schreibt einen Bericht, den Kunden ihren eigenen Prüfern vorlegen können." },
  },
  {
    id: "nis2",
    title: "NIS2",
    match: ["NIS2"],
    plain: "An EU directive on cybersecurity. Companies in important sectors such as energy, health and transport must manage and document their security risks.",
    from: "Directive (EU) 2022/2555",
    de: { match: ["NIS2", "NIS2-Maßnahmen"], plain: "Eine EU-Richtlinie zur Cybersicherheit. Unternehmen in wichtigen Sektoren wie Energie, Gesundheit und Verkehr müssen ihre Sicherheitsrisiken steuern und dokumentieren." },
  },
  {
    id: "kritis",
    title: "KRITIS (critical infrastructure)",
    match: ["KRITIS"],
    plain: "The German term for critical infrastructure: energy, water, health and similar services whose failure would hurt the public. Operators face strict security duties.",
    de: { title: "KRITIS (kritische Infrastruktur)", match: ["KRITIS"], plain: "Der deutsche Begriff für kritische Infrastruktur: Energie, Wasser, Gesundheit und ähnliche Dienste, deren Ausfall der Allgemeinheit schaden würde. Betreiber haben strenge Sicherheitspflichten." },
  },
  {
    id: "bafin",
    title: "BaFin",
    match: ["BaFin"],
    plain: "Germany's financial supervisory authority. Banks, insurers and leasing firms it supervises must be able to audit and leave their IT providers.",
    de: { match: ["BaFin", "BaFin-Aufsicht"], plain: "Die deutsche Finanzaufsicht. Banken, Versicherer und Leasingfirmen unter ihrer Aufsicht müssen ihre IT-Dienstleister prüfen und verlassen können." },
  },
  {
    id: "dpa",
    title: "Data processing agreement",
    match: ["data processing agreement", "DPA", "sub-processor", "sub-processors"],
    plain: "The contract a customer must sign with any provider that handles personal data on its behalf (GDPR Art. 28). It lists, among other things, the sub-processors: other firms the provider uses.",
    de: { title: "Auftragsverarbeitungsvertrag (AVV)", match: ["Auftragsverarbeitungsvertrag", "AVV", "Unterauftragsverarbeiter"], plain: "Der Vertrag, den ein Kunde mit jedem Anbieter schließen muss, der in seinem Auftrag personenbezogene Daten verarbeitet (Art. 28 DSGVO). Er nennt unter anderem die Unterauftragsverarbeiter: andere Firmen, die der Anbieter einsetzt." },
  },
  {
    id: "audit-rights",
    title: "Audit rights, exit plan",
    match: ["audit rights", "audit-rights", "exit plan", "audit clause"],
    plain: "Contract terms a regulated customer often needs: the right to check the provider (audit rights) and a written plan for moving data away if the contract ends (exit plan).",
    de: { title: "Prüfrechte, Exit-Plan", match: ["Prüfrechte", "Prüfrechten", "Prüfrechtsklausel", "Prüfklausel", "Exit-Plan"], plain: "Vertragsklauseln, die ein regulierter Kunde oft braucht: das Recht, den Anbieter zu prüfen (Prüfrechte), und ein schriftlicher Plan, wie die Daten beim Vertragsende umziehen (Exit-Plan)." },
  },
  {
    id: "gdpr",
    title: "GDPR",
    match: ["GDPR"],
    plain: "The EU's data protection law. For personalisation it matters because using personal data needs a legal basis, people can object to direct marketing, and you should collect only the data you need.",
    from: "Regulation (EU) 2016/679",
    de: { title: "DSGVO (GDPR)", match: ["DSGVO", "GDPR"], plain: "Das Datenschutzgesetz der EU. Für Personalisierung zählt es, weil die Nutzung personenbezogener Daten eine Rechtsgrundlage braucht, Menschen der Direktwerbung widersprechen können und man nur die Daten erheben soll, die man braucht." },
  },
  {
    id: "uwg7",
    title: "§ 7 UWG",
    match: ["§ 7 UWG", "UWG"],
    plain: "A rule in the German Act against Unfair Competition: advertising emails generally need the recipient's prior consent, also when the recipient is a business.",
    de: { match: ["§ 7 UWG", "UWG"], plain: "Eine Regel im Gesetz gegen den unlauteren Wettbewerb: Werbe-E-Mails brauchen grundsätzlich die vorherige Einwilligung des Empfängers, auch wenn er ein Unternehmen ist." },
  },
  {
    id: "tdddg",
    title: "§ 25 TDDDG (cookie consent)",
    match: ["TDDDG", "TTDSG"],
    plain: "The German rule that tracking cookies and similar tools on a website need the visitor's consent, unless they are strictly necessary.",
    de: { title: "§ 25 TDDDG (Cookie-Einwilligung)", match: ["TDDDG", "TTDSG"], plain: "Die deutsche Regel, dass Tracking-Cookies und ähnliche Werkzeuge auf einer Website die Einwilligung des Besuchers brauchen, außer sie sind unbedingt erforderlich." },
  },
  {
    id: "sla",
    title: "SLA — service level agreement",
    match: ["SLA"],
    plain: "The part of a contract that fixes how good the service must be, for example how fast a problem is answered. “24/7” means around the clock.",
    de: { match: ["SLA", "24/7-SLA"], plain: "Der Teil eines Vertrags, der festlegt, wie gut der Service sein muss, etwa wie schnell auf ein Problem reagiert wird. „24/7“ heißt rund um die Uhr." },
  },
  {
    id: "managed-service",
    title: "Managed service",
    match: ["managed service", "managed backup", "managed services"],
    plain: "A service the provider runs for the customer, including monitoring and fixing, so the customer does not need its own staff for it.",
    de: { title: "Managed Service", match: ["Managed Service", "Managed Services", "Managed-Service", "gemanagtes"], plain: "Ein Service, den der Anbieter für den Kunden betreibt, einschließlich Überwachung und Störungsbehebung, sodass der Kunde dafür kein eigenes Personal braucht." },
  },
  {
    id: "api",
    title: "API",
    match: ["API"],
    plain: "An interface through which software talks to software. Engineers use it to control a cloud service with their own programs instead of clicking in a portal.",
    de: { match: ["API", "API-Doku", "API-Dokumentation", "API-Zugang"], plain: "Eine Schnittstelle, über die Software mit Software spricht. Engineers steuern damit einen Cloud-Service mit eigenen Programmen, statt in einem Portal zu klicken." },
  },
  {
    id: "iac",
    title: "Infrastructure as code (Terraform)",
    match: ["infrastructure as code", "Terraform"],
    plain: "Describing servers and networks in text files that a tool such as Terraform turns into running infrastructure. Teams that work this way want full technical access.",
    de: { title: "Infrastructure as Code (Terraform)", match: ["Infrastructure as Code", "Terraform"], plain: "Server und Netze in Textdateien beschreiben, die ein Werkzeug wie Terraform in laufende Infrastruktur umsetzt. Teams, die so arbeiten, wollen vollen technischen Zugriff." },
  },
  {
    id: "poc",
    title: "Proof of concept",
    match: ["proof of concept", "proof-of-concept"],
    plain: "A short technical test on real workloads to show that a service works before anyone signs.",
    de: { title: "Proof of Concept", match: ["Proof of Concept", "Proof-of-Concept"], plain: "Ein kurzer technischer Test mit echten Anwendungen, der zeigt, dass ein Service funktioniert, bevor jemand unterschreibt." },
  },
  {
    id: "load-test",
    title: "Load test, benchmark",
    match: ["load test", "load tests", "benchmark"],
    plain: "Measuring how a system performs under heavy use, or comparing it against others on the same test.",
    de: { title: "Lasttest, Benchmark", match: ["Lasttest", "Lasttests", "Benchmark"], plain: "Messen, wie sich ein System unter starker Nutzung verhält, oder es mit anderen im selben Test vergleichen." },
  },
  {
    id: "hyperscaler",
    title: "Hyperscaler, vCPU",
    match: ["hyperscaler", "hyperscalers", "vCPU"],
    plain: "The very large global cloud providers. A vCPU is one virtual processor, the unit many of them price computing power by.",
    de: { title: "Hyperscaler, vCPU", match: ["Hyperscaler", "Hyperscalern", "vCPU"], plain: "Die sehr großen globalen Cloud-Anbieter. Eine vCPU ist ein virtueller Prozessor, die Einheit, nach der viele von ihnen Rechenleistung abrechnen." },
  },
  {
    id: "autoscaling",
    title: "Autoscaling",
    match: ["autoscaling"],
    plain: "Capacity that grows and shrinks automatically with demand, so a seasonal peak does not need servers bought for the whole year.",
    de: { title: "Autoscaling", match: ["Autoscaling"], plain: "Kapazität, die automatisch mit der Nachfrage wächst und schrumpft, sodass eine Saisonspitze keine Server für das ganze Jahr braucht." },
  },
  {
    id: "devops",
    title: "DevOps, platform team",
    match: ["DevOps", "platform team", "platform engineers"],
    plain: "The in-house engineers who build and run a company's technical platform. Where they exist, they usually want to test and control a provider themselves.",
    de: { title: "DevOps, Plattformteam", match: ["DevOps", "DevOps-Team", "Plattformteam", "Platform Engineers"], plain: "Die internen Engineers, die die technische Plattform eines Unternehmens bauen und betreiben. Wo es sie gibt, wollen sie einen Anbieter meist selbst testen und steuern." },
  },
  {
    id: "mittelstand",
    title: "Mittelstand (mid-sized companies)",
    match: ["Mittelstand"],
    exactCase: true,
    plain: "The German word for mid-sized, often family-owned companies, the backbone of the German economy. Many have a small IT team or none.",
    de: { title: "Mittelstand", match: ["Mittelstand", "Mittelstandsunternehmen", "Mittelständler"], plain: "Mittelgroße, oft familiengeführte Unternehmen, das Rückgrat der deutschen Wirtschaft. Viele haben ein kleines oder gar kein IT-Team." },
  },
  {
    id: "ausschreibung",
    title: "Ausschreibung (formal tender)",
    match: ["Ausschreibung", "tender", "tenders"],
    plain: "A formal procedure in which a buyer, often public, publishes its requirements and compares written offers against fixed criteria.",
    de: { title: "Ausschreibung", match: ["Ausschreibung", "Ausschreibungen", "Vergabeverfahren", "Vergabekommission"], plain: "Ein förmliches Verfahren, in dem ein Käufer, oft ein öffentlicher, seine Anforderungen veröffentlicht und schriftliche Angebote nach festen Kriterien vergleicht." },
  },
  {
    id: "dpo",
    title: "Data protection officer",
    match: ["data protection officer"],
    plain: "The person a company must name to watch over its handling of personal data. In a purchase, they check the provider's data protection documents.",
    de: { title: "Datenschutzbeauftragte", match: ["Datenschutzbeauftragte", "Datenschutzbeauftragten"], plain: "Die Person, die ein Unternehmen benennen muss, um den Umgang mit personenbezogenen Daten zu überwachen. Bei einem Kauf prüft sie die Datenschutzunterlagen des Anbieters." },
  },
  {
    id: "cio",
    title: "CIO, CSO",
    match: ["CIO", "CSO", "Chief Sales Officer"],
    plain: "The chief information officer (the head of IT) and the chief sales officer (the head of sales).",
    de: { title: "CIO, CSO", match: ["CIO", "CSO", "Chief Sales Officer"], plain: "Der Chief Information Officer (die IT-Leitung) und der Chief Sales Officer (die Vertriebsleitung)." },
  },
  // --- Level 3 --------------------------------------------------------------------
  {
    id: "profit-pool",
    title: "Profit pool",
    match: ["profit pool"],
    plain: "How much profit a whole segment holds: accounts × average contract value × gross margin. It tells you how attractive a segment is, whoever serves it.",
    example: "140 accounts × €56,000 × 38% ≈ €2.98 million.",
    de: { title: "Profit Pool", match: ["Profit Pool", "Profit Pools"], plain: "Wie viel Gewinn ein ganzes Segment enthält: Accounts × durchschnittlicher Vertragswert × Bruttomarge. Er sagt, wie attraktiv ein Segment ist, egal wer es bedient.", example: "140 Accounts × 56.000 € × 38 % ≈ 2,98 Mio. €." },
  },
  {
    id: "ability-to-win",
    title: "Ability to win",
    match: ["ability to win"],
    plain: "How well your offer and your position let you win in a segment, read here from today's win rate.",
    de: { title: "Ability to win (Gewinnfähigkeit)", match: ["Ability to win", "Gewinnfähigkeit"], plain: "Wie gut Ihr Angebot und Ihre Position Sie in einem Segment gewinnen lassen, hier abgelesen an der heutigen Win Rate." },
  },
  {
    id: "nine-box",
    title: "Nine-box matrix (GE–McKinsey)",
    match: ["nine-box", "GE–McKinsey", "GE-McKinsey"],
    plain: "A three-by-three grid with market attractiveness on one axis and the strength of your position on the other. Invest top right, serve efficiently in the middle, hold back bottom left.",
    from: "Coyne 2008",
    de: { title: "Neun-Felder-Matrix (GE–McKinsey)", match: ["Neun-Felder-Matrix", "GE–McKinsey", "GE-McKinsey"], plain: "Ein Raster mit drei mal drei Feldern: auf einer Achse die Marktattraktivität, auf der anderen die Stärke der eigenen Position. Oben rechts investieren, in der Mitte effizient bedienen, unten links zurückhalten." },
  },
  {
    id: "focus-strategy",
    title: "Focus strategy",
    match: ["focus strategy"],
    plain: "Choosing to serve a few segments better than broad competitors can, instead of serving everyone a little.",
    from: "Porter 1980",
    de: { title: "Fokusstrategie", match: ["Fokusstrategie"], plain: "Die Entscheidung, wenige Segmente besser zu bedienen, als es breit aufgestellte Wettbewerber können, statt alle ein bisschen." },
  },
  {
    id: "cost-to-serve",
    title: "Cost to serve",
    match: ["cost to serve", "cost-to-serve"],
    plain: "Everything it costs to win and look after one account: sales time, onboarding, support, tailoring. Some accounts cost more than they bring.",
    from: "Kaplan & Anderson 2004",
    de: { title: "Cost to Serve (Betreuungskosten)", match: ["Cost to Serve", "Betreuungskosten"], plain: "Alles, was es kostet, einen Account zu gewinnen und zu betreuen: Vertriebszeit, Onboarding, Support, Zuschnitt. Manche Accounts kosten mehr, als sie bringen." },
  },
  {
    id: "key-account",
    title: "Key account, field sales, inside sales",
    match: ["key account", "key accounts", "field sales", "inside sales"],
    plain: "Sales models from most to least personal: a key account team looks after one large account; field sales visit; inside sales work by phone and video from the office.",
    from: "Zoltners et al. 2004",
    de: { title: "Key Account, Außendienst, Inside Sales", match: ["Key Account", "Key-Account-Team", "Key Account Manager", "Außendienst", "Inside Sales"], plain: "Vertriebsmodelle vom persönlichsten zum am wenigsten persönlichen: Ein Key-Account-Team betreut einen großen Account; der Außendienst besucht; Inside Sales arbeitet per Telefon und Video aus dem Büro." },
  },
  {
    id: "partner-channel",
    title: "Partner channel, self-service",
    match: ["partner channel", "self-service", "digital self-service"],
    plain: "Two low-cost ways to sell: local partner firms sell and support in your name for a share of the revenue, or customers test and buy online on their own.",
    de: { title: "Partnervertrieb, Self-Service", match: ["Partnervertrieb", "Self-Service", "Self-Service-Zugang"], plain: "Zwei günstige Wege zu verkaufen: Lokale Partnerfirmen verkaufen und betreuen in Ihrem Namen gegen einen Umsatzanteil, oder Kunden testen und kaufen selbst online." },
  },
  {
    id: "mass-customisation",
    title: "Mass customisation, modular offer",
    match: ["mass customisation", "mass customization", "modular"],
    plain: "Building offers from standard building blocks so that each customer group gets a fitting combination at close to standard cost. Only what the customer values is customised.",
    from: "Pine 1993; Gilmore & Pine 1997",
    de: { title: "Mass Customization, modulares Angebot", match: ["Mass Customization", "modular", "modulare", "modulares", "Modular"], plain: "Angebote aus Standardbausteinen bauen, sodass jede Kundengruppe eine passende Kombination zu fast standardisierten Kosten bekommt. Angepasst wird nur, was dem Kunden wichtig ist." },
  },
  {
    id: "data-confidence",
    title: "Data confidence",
    match: ["data confidence"],
    plain: "How far a figure can be trusted: how many cases it rests on and how it was collected. A figure from 25 proposals is weaker than one from 900 customers.",
    de: { title: "Datenvertrauen", match: ["Datenvertrauen"], plain: "Wie weit man einer Zahl trauen kann: auf wie vielen Fällen sie beruht und wie sie erhoben wurde. Eine Zahl aus 25 Angeboten ist schwächer als eine aus 900 Kunden." },
  },
  {
    id: "voi",
    title: "Value of information",
    match: ["value of information"],
    plain: "More data is worth collecting only if it could change the decision. If every likely answer leads to the same choice, decide now.",
    from: "Hubbard 2014",
    de: { title: "Wert von Information", match: ["Wert von Information", "Wert der Information"], plain: "Mehr Daten lohnen sich nur, wenn sie die Entscheidung ändern könnten. Führt jede wahrscheinliche Antwort zur selben Wahl, entscheiden Sie jetzt." },
  },
  {
    id: "regret",
    title: "Regret",
    match: ["regret"],
    plain: "How much worse a choice turned out than the best choice would have been, once you know what happened. Keeping the largest possible regret small is a way to decide under uncertainty.",
    de: { title: "Regret (Bedauern)", match: ["Regret", "Bedauern"], plain: "Wie viel schlechter eine Wahl ausgefallen ist als die beste mögliche, wenn man weiß, was passiert ist. Das größtmögliche Bedauern klein zu halten ist eine Art, unter Unsicherheit zu entscheiden." },
  },
  {
    id: "tripwire",
    title: "Tripwire",
    match: ["tripwire"],
    plain: "A result agreed in advance that makes you change course: a metric, a threshold, a date and an action.",
    example: "If the win rate is below 26% by month 4, one key account manager moves to new accounts.",
    de: { title: "Tripwire", match: ["Tripwire", "Tripwires"], plain: "Ein vorab vereinbartes Ergebnis, bei dem Sie den Kurs ändern: eine Kennzahl, ein Schwellenwert, ein Datum und eine Aktion.", example: "Liegt die Win Rate in Monat 4 unter 26 %, wechselt ein Key Account Manager zu Neukunden." },
  },
  {
    id: "staged",
    title: "Staged decision",
    match: ["staged", "stage it"],
    plain: "Deciding the direction now, but committing money in steps, each released only when a checkpoint is met.",
    from: "Courtney et al. 1997",
    de: { title: "Gestufte Entscheidung", match: ["stufenweise", "gestufte"], plain: "Die Richtung jetzt entscheiden, das Geld aber in Schritten binden, die jeweils erst freigegeben werden, wenn ein Kontrollpunkt erreicht ist." },
  },
  {
    id: "baseline",
    title: "Baseline",
    match: ["baseline", "baselines"],
    plain: "The value of a metric before you change anything. Without it you cannot tell whether a measure made a difference.",
    de: { title: "Baseline (Ausgangswert)", match: ["Baseline", "Ausgangswert", "Ausgangswerte"], plain: "Der Wert einer Kennzahl, bevor Sie etwas ändern. Ohne ihn können Sie nicht sagen, ob eine Maßnahme etwas bewirkt hat." },
  },
  {
    id: "owner",
    title: "Owner",
    match: ["owner", "owners"],
    plain: "The one person who can change a measure without asking anyone else, and who must act when its trigger fires.",
    de: { title: "Owner", match: ["Owner"], plain: "Die eine Person, die eine Maßnahme ändern kann, ohne jemanden zu fragen, und die handeln muss, wenn ihr Trigger auslöst." },
  },
  {
    id: "trigger",
    title: "Trigger",
    match: ["trigger", "triggers"],
    plain: "A written rule that says when the owner must act: a metric, a number, a date and an action.",
    de: { title: "Trigger", match: ["Trigger"], plain: "Eine schriftliche Regel, die sagt, wann der Owner handeln muss: eine Kennzahl, eine Zahl, ein Datum und eine Aktion." },
  },
  {
    id: "pickup",
    title: "Pickup point",
    match: ["pickup point"],
    plain: "The number and the date at which you look again at something you postponed. It turns “later” into a decision.",
    de: { title: "Pickup Point", match: ["Pickup Point"], plain: "Die Zahl und das Datum, zu dem Sie etwas Zurückgestelltes wieder ansehen. So wird aus „später“ eine Entscheidung." },
  },
  {
    id: "kpi",
    title: "KPI — key performance indicator",
    match: ["KPI", "KPIs"],
    plain: "One number that shows whether something is working. A good KPI measures the customer's response, not your own activity.",
    de: { match: ["KPI", "KPIs", "Kennzahl"], plain: "Eine Zahl, die zeigt, ob etwas funktioniert. Eine gute KPI misst die Reaktion des Kunden, nicht Ihre eigene Aktivität." },
  },
  {
    id: "premortem",
    title: "Premortem",
    match: ["premortem"],
    plain: "Before a plan starts, imagine it has failed and write down why. It brings hidden assumptions into the open.",
    from: "Klein 2007",
    de: { title: "Premortem", match: ["Premortem"], plain: "Bevor ein Plan startet, stellt man sich vor, er sei gescheitert, und schreibt auf, warum. So kommen versteckte Annahmen ans Licht." },
  },
];

// --- lookup ---------------------------------------------------------------------

export const GLOSS_BY_ID: Record<string, GlossEntry> = Object.fromEntries(GLOSSARY.map((g) => [g.id, g]));

/** The texts of an entry in the active language (the English text where a German version is missing). */
export function glossText(g: GlossEntry): { title: string; plain: string; example?: string; from?: string } {
  if (getLang() === "de" && g.de) return { title: g.de.title ?? g.title, plain: g.de.plain, example: g.de.example, from: g.from };
  return { title: g.title, plain: g.plain, example: g.example, from: g.from };
}

const isAcronym = (s: string) => s === s.toUpperCase() && /[A-Z]/.test(s);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function build(forms: (g: GlossEntry) => string[] | undefined) {
  const lookup = new Map<string, { entry: GlossEntry; exact: string | null }>();
  for (const g of GLOSSARY) for (const m of forms(g) ?? []) if (!lookup.has(m.toLowerCase())) lookup.set(m.toLowerCase(), { entry: g, exact: g.exactCase || isAcronym(m) ? m : null });
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}_])(${[...lookup.keys()]
      .sort((a, b) => b.length - a.length)
      .map(escapeRe)
      .join("|")})(?![\\p{L}\\p{N}_])`,
    "giu",
  );
  return { lookup, re };
}

const EN = build((g) => g.match);
const DE = build((g) => g.de?.match);

/** lowercase written form → its entry, and whether that form must be matched exactly. */
export const GLOSS_LOOKUP = EN.lookup;
export const GLOSS_RE = EN.re;
export const GLOSS_LOOKUP_DE = DE.lookup;
export const GLOSS_RE_DE = DE.re;
