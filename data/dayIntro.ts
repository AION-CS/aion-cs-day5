import { bi, t } from "@/lib/lang";

/**
 * The home page's day intro (CLAUDE.md #27): what the day is about, the story that runs through the two routes, and "What's in it
 * for you" (WIIFM), the personal pay-off of each skill. Only facts the day's own material and cases state (DataCloud Services, its
 * generic offers, low conversion and customers who do not feel understood, the €120,000 and five months of Route 1, the twelve
 * accounts, the €150,000 and six months of Route 2).
 */
export const DAY_INTRO = bi({
  about: t(
    "Today is about not treating every customer the same. You learn why segmentation matters in B2B IT sales, the difference between a target group and a segment, which criteria to segment by (firmographic, behaviour-based, needs-based), and when personalising an offer pays for its effort. In the second half you stop analysing accounts and decide, as the head of sales, which segments get your focus and what you standardise for the rest.",
    "Heute geht es darum, nicht jeden Kunden gleich zu behandeln. Sie lernen, warum Segmentierung im B2B-IT-Vertrieb zählt, was eine Zielgruppe von einem Segment unterscheidet, nach welchen Kriterien man segmentiert (firmografisch, verhaltensbasiert, bedarfsbasiert) und wann sich die Personalisierung eines Angebots für ihren Aufwand lohnt. In der zweiten Hälfte analysieren Sie nicht mehr Accounts, sondern entscheiden als Vertriebsleitung, welche Segmente Ihren Fokus bekommen und was Sie für den Rest standardisieren.",
  ),
  caseLine: t(
    "One case runs through the whole day: DataCloud Services GmbH, a German cloud provider for the Mittelstand. Its offers appear generic, its conversion rate is low and customers say they do not feel understood. In Route 1 you work with twelve accounts, €120,000 and five months; in Route 2 you are the Chief Sales Officer with €150,000, six months and incomplete customer data.",
    "Ein Fall zieht sich durch den ganzen Tag: DataCloud Services GmbH, ein deutscher Cloud-Anbieter für den Mittelstand. Seine Angebote wirken generisch, die Conversion Rate ist niedrig und Kunden sagen, sie fühlen sich nicht verstanden. In Route 1 arbeiten Sie mit zwölf Accounts, 120.000 € und fünf Monaten; in Route 2 sind Sie Chief Sales Officer mit 150.000 €, sechs Monaten und unvollständigen Kundendaten.",
  ),
  story: [
    {
      route: 1 as const,
      verb: t("Segment and personalise", "Segmentieren und personalisieren"),
      question: t(
        "Which segments are hidden in DataCloud's accounts, what does each one need, where does personalising pay, and which three measures fit inside €120,000 and five months?",
        "Welche Segmente stecken in den Accounts von DataCloud, was braucht jedes, wo lohnt sich Personalisierung, und welche drei Maßnahmen passen in 120.000 € und fünf Monate?",
      ),
      output: t("the Segment Analysis File (Levels 1 and 2)", "die Segment Analysis File (Level 1 und 2)"),
    },
    {
      route: 2 as const,
      verb: t("Decide", "Entscheiden"),
      question: t(
        "Which segments does DataCloud focus on, how does it sell to each, what does it standardise, and what does it decide before the data is complete?",
        "Auf welche Segmente konzentriert sich DataCloud, wie verkauft es an jedes, was standardisiert es, und was entscheidet es, bevor die Daten vollständig sind?",
      ),
      output: t("the Segment Strategy Memo (Level 3)", "das Segment Strategy Memo (Level 3)"),
    },
  ],
  wiifm: [
    {
      skill: t("Tell a useful criterion from an easy one", "Ein nützliches Kriterium von einem bequemen unterscheiden"),
      payoff: t(
        "Industry and size are in every CRM, and they rarely decide what a customer needs. With three short tests you can sort any customer field into firmographic, behaviour or need, and see which ones should drive your offers.",
        "Branche und Größe stehen in jedem CRM und entscheiden selten, was ein Kunde braucht. Mit drei kurzen Tests können Sie jedes Kundenfeld in firmografisch, Verhalten oder Bedarf einordnen und sehen, welche Ihre Angebote steuern sollten.",
      ),
      route: 1 as const,
    },
    {
      skill: t("Put a number on “is personalising worth it?”", "„Lohnt sich Personalisierung?“ mit einer Zahl beantworten"),
      payoff: t(
        "Proposals times the change in win rate times contract value times margin, less the cost: the same arithmetic tells you, for any customer group at work, whether a tailored approach pays or a standard offer is better.",
        "Angebote mal Änderung der Win Rate mal Vertragswert mal Marge, abzüglich der Kosten: Dieselbe Rechnung sagt Ihnen für jede Kundengruppe im Job, ob sich ein zugeschnittener Ansatz lohnt oder ein Standardangebot besser ist.",
      ),
      route: 1 as const,
    },
    {
      skill: t("Segment by need and decision behaviour", "Nach Bedarf und Entscheidungsverhalten segmentieren"),
      payoff: t(
        "You learn to read a customer note for what the account must solve and how it decides, and to place it in a segment even when its industry points the other way. That is how you stop sending the right offer to the wrong people.",
        "Sie lernen, eine Kundennotiz daraufhin zu lesen, was der Account lösen muss und wie er entscheidet, und ihn einem Segment zuzuordnen, auch wenn seine Branche in die andere Richtung zeigt. So hören Sie auf, das richtige Angebot an die falschen Leute zu schicken.",
      ),
      route: 1 as const,
    },
    {
      skill: t("Score measures inside a budget", "Maßnahmen innerhalb eines Budgets bewerten"),
      payoff: t(
        "Relevance times differentiation times economic viability, checked against a budget, works for any shortlist of ideas. It also tells you which segment to serve with a standard offer instead.",
        "Relevanz mal Differenzierung mal Wirtschaftlichkeit, geprüft gegen ein Budget, funktioniert für jede Shortlist von Ideen. Es sagt Ihnen auch, welches Segment Sie besser mit einem Standardangebot bedienen.",
      ),
      route: 1 as const,
    },
    {
      skill: t("Choose where to focus, and say what you leave", "Entscheiden, worauf man sich konzentriert, und sagen, was man lässt"),
      payoff: t(
        "Attractiveness against ability to win turns a long list of possible markets into two core segments, one to serve efficiently and the rest to park. It is the question behind every plan that has more ideas than money.",
        "Attraktivität gegen Gewinnfähigkeit macht aus einer langen Liste möglicher Märkte zwei Kernsegmente, eines zum effizienten Bedienen und den Rest zum Zurückstellen. Diese Frage steckt hinter jedem Plan, der mehr Ideen als Geld hat.",
      ),
      route: 2 as const,
    },
    {
      skill: t("Decide before the data is complete", "Entscheiden, bevor die Daten vollständig sind"),
      payoff: t(
        "A staged decision with a tripwire (a metric, a threshold, a month and an action agreed in advance) lets you commit to a segment without betting everything on data you know is incomplete.",
        "Eine gestufte Entscheidung mit Tripwire (Kennzahl, Schwellenwert, Monat und Aktion vorab festgelegt) erlaubt Ihnen, sich auf ein Segment festzulegen, ohne alles auf Daten zu setzen, von denen Sie wissen, dass sie unvollständig sind.",
      ),
      route: 2 as const,
    },
    {
      skill: t("Leave with two documents you can reuse", "Mit zwei wiederverwendbaren Dokumenten gehen"),
      payoff: t(
        "The Segment Analysis File and the Segment Strategy Memo are yours: the first is a template for segmenting any customer list, the second for defending a focus decision to a board.",
        "Die Segment Analysis File und das Segment Strategy Memo gehören Ihnen: Das erste ist eine Vorlage, um jede Kundenliste zu segmentieren, das zweite, um eine Fokusentscheidung vor einem Vorstand zu vertreten.",
      ),
      route: 2 as const,
    },
  ],
});
