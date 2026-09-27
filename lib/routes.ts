import { bi, t } from "@/lib/lang";

/**
 * Day 5 route registry: Customer Retention & Buying Behaviour in B2B IT Sales, Module 3, Day 1 (segmentation and personalisation).
 * From Day 3 on, a day has TWO routes (CLAUDE.md #30): Route 1 merges Level 1 and Level 2 on one case, Route 2 is Level 3.
 */
export const COURSE = bi({
  title: t("Understanding Customer Segmentation and Strategically Developing Personalisation", "Kundensegmentierung verstehen und Personalisierung strategisch entwickeln"),
  site: t("Retention Lab · Day 5", "Retention Lab · Tag 5"),
  module: t("Module 3, Day 1 of 2", "Modul 3, Tag 1 von 2"),
  course: t("Customer Retention & Buying Behaviour in B2B IT Sales", "Customer Retention & Kaufverhalten im B2B-IT-Vertrieb"),
  day: 5,
  company: "DataCloud Services GmbH",
});

export type RouteNo = 1 | 2;

/** Minutes are a guide for the facilitator, not a timer. One place, so the home page, the rail and the blocks agree. */
export const BLOCK_MINUTES = {
  "1.1": 6,
  "1.2": 10,
  "1.3": 7,
  "1.4": 5,
  "2.1": 8,
  "2.2": 8,
  "2.3": 12,
  "3.1": 5,
  "3.2": 9,
  "3.3": 8,
  "3.4": 9,
  "3.5": 10,
  "3.6": 9,
} as const;

const sum = (keys: (keyof typeof BLOCK_MINUTES)[]) => keys.reduce((s, k) => s + BLOCK_MINUTES[k], 0);
export const TASK1_MINUTES = sum(["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3"]);
export const TASK2_MINUTES = sum(["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]);

export type RouteInfo = {
  n: RouteNo;
  href: string;
  short: string;
  title: string;
  level: string;
  blurb: string;
  plan: { label: string; minutes: number }[];
  built: boolean;
};

export const ROUTES: RouteInfo[] = bi([
  {
    n: 1 as RouteNo,
    href: "/route-1/",
    short: t("Segment & tailor", "Segmentieren & zuschneiden"),
    title: t("Route 1 · Segment and personalise", "Route 1 · Segmentieren und personalisieren"),
    level: t("Levels 1 + 2 · Knowledge and application", "Level 1 + 2 · Wissen und Anwendung"),
    blurb: t(
      "One case, two levels: DataCloud Services' offers feel generic, conversion is low and customers do not feel understood. You learn what makes a segment useful, which criteria to segment by, and when personalising pays. Then you sort twelve real-sounding accounts into needs-based segments, rate each segment's value and choose three personalisation measures inside €120,000 and five months. Material first, then one task that ends in a Segment Analysis File.",
      "Ein Fall, zwei Level: Die Angebote von DataCloud Services wirken generisch, die Conversion ist niedrig und Kunden fühlen sich nicht verstanden. Sie lernen, was ein Segment nützlich macht, nach welchen Kriterien man segmentiert und wann sich Personalisierung lohnt. Dann ordnen Sie zwölf realistisch klingende Accounts bedarfsbasierten Segmenten zu, bewerten den Wert jedes Segments und wählen drei Personalisierungsmaßnahmen innerhalb von 120.000 € und fünf Monaten. Erst das Material, dann eine Aufgabe, die mit einer Segment Analysis File endet.",
    ),
    plan: [
      { label: t("Materi A · seven cards, Levels 1 and 2", "Materi A · sieben Karten, Level 1 und 2"), minutes: 60 },
      { label: t("Task 1 · Segment Analysis, one task", "Task 1 · Segment Analysis, eine Aufgabe"), minutes: TASK1_MINUTES },
    ],
    built: true,
  },
  {
    n: 2 as RouteNo,
    href: "/route-2/",
    short: t("Decide", "Entscheiden"),
    title: t("Route 2 · Management decision", "Route 2 · Managemententscheidung"),
    level: t("Level 3 · Management decision", "Level 3 · Managemententscheidung"),
    blurb: t(
      "You are now DataCloud's Chief Sales Officer. The target group strategy is unclear, the market is mixed, resources are limited and the customer data is incomplete. You choose the criteria, rate five candidate segments, name two core segments, set a sales model for each, decide what to standardise and what to individualise, and commit to a plan before the data is complete. Material first, then a Segment Strategy Memo that assembles itself beside your answers.",
      "Sie sind jetzt Chief Sales Officer von DataCloud. Die Zielgruppenstrategie ist unklar, der Markt heterogen, die Ressourcen sind begrenzt und die Kundendaten unvollständig. Sie wählen die Kriterien, bewerten fünf Kandidatensegmente, benennen zwei Kernsegmente, legen für jedes ein Vertriebsmodell fest, entscheiden, was standardisiert und was individualisiert wird, und legen sich auf einen Plan fest, bevor die Daten vollständig sind. Erst das Material, dann ein Segment Strategy Memo, das sich neben Ihren Antworten selbst zusammensetzt.",
    ),
    plan: [
      { label: t("Materi B · five cards, Level 3", "Materi B · fünf Karten, Level 3"), minutes: 60 },
      { label: t("Task 2 · Segment Strategy Memo", "Task 2 · Segment Strategy Memo"), minutes: TASK2_MINUTES },
    ],
    built: true,
  },
]);
