import { bi, t } from "@/lib/lang";

/**
 * The three needs-based segments of DataCloud Services (Materi A5, Task 1 Blocks 2.1 to 2.3). One place, so the material, the
 * assignment board, the segment profiles, the measures, the answer keys and the export all read the same definitions. The
 * three are practitioner archetypes of the B2B cloud market (Case assumption as to the names), defined by need and decision
 * behaviour, not by industry or size. The test question of each is the one taught in A5; it never says which account goes where.
 */
export type SegmentId = "assure" | "handsoff" | "scale";
export const SEGMENT_IDS: SegmentId[] = ["assure", "handsoff", "scale"];

export const SEGMENTS = bi({
  assure: {
    id: "assure" as SegmentId,
    label: t("Compliance-first", "Compliance-first"),
    short: t("Compliance", "Compliance"),
    need: t(
      "Must prove to a third party (an auditor, a supervisory authority, a tender committee) where the data is, who can reach it and how the provider can be left.",
      "Muss einer dritten Stelle (Wirtschaftsprüfer, Aufsichtsbehörde, Vergabekommission) nachweisen, wo die Daten liegen, wer darauf zugreifen kann und wie man den Anbieter wieder verlässt.",
    ),
    decides: t(
      "Slowly and in a group: IT, legal and the data protection officer read the documents before anyone talks about price.",
      "Langsam und im Gremium: IT, Rechtsabteilung und Datenschutzbeauftragte lesen die Unterlagen, bevor jemand über den Preis spricht.",
    ),
    sounds: t(
      "“Can we see the C5 report?”, “Where exactly are the data centres?”, “We need audit rights in the contract.”",
      "„Können wir den C5-Bericht sehen?“, „Wo genau stehen die Rechenzentren?“, „Wir brauchen Prüfrechte im Vertrag.“",
    ),
    test: t(
      "Does the account need evidence it can show to someone outside the company?",
      "Braucht der Account Nachweise, die er jemandem außerhalb des Unternehmens vorlegen kann?",
    ),
    answeredBy: t(
      "Evidence it can hand on: certificates, a data-location map, a data processing agreement, audit rights, references from the same regulated sector.",
      "Nachweise, die er weitergeben kann: Zertifikate, eine Übersicht der Datenstandorte, einen Auftragsverarbeitungsvertrag (AVV), Prüfrechte, Referenzen aus derselben regulierten Branche.",
    ),
    typical: t("Often regulated sectors, but size varies: a 150-person leasing firm can be as strict as a group.", "Oft regulierte Branchen, aber die Größe schwankt: Eine Leasingfirma mit 150 Mitarbeitenden kann so streng sein wie ein Konzern."),
  },
  handsoff: {
    id: "handsoff" as SegmentId,
    label: t("Hands-off", "Hands-off"),
    short: t("Hands-off", "Hands-off"),
    need: t(
      "Wants the service run for them: no in-house engineer, or no wish to build one, and a price that can be planned month by month.",
      "Will, dass der Service für sie betrieben wird: kein eigener Engineer oder kein Wunsch, einen aufzubauen, und ein Preis, der sich Monat für Monat planen lässt.",
    ),
    decides: t(
      "Quickly once they trust a person: one visit or one good call can decide it. Documents and portals matter little.",
      "Schnell, sobald sie einer Person vertrauen: Ein Besuch oder ein gutes Telefonat kann entscheiden. Unterlagen und Portale zählen wenig.",
    ),
    sounds: t(
      "“One number to call when something breaks.”, “Can you simply take care of all of it?”, “I do not want to learn a portal.”",
      "„Eine Nummer, die ich anrufe, wenn etwas kaputt ist.“, „Können Sie sich einfach um alles kümmern?“, „Ich will kein Portal lernen.“",
    ),
    test: t(
      "Does the account want somebody else to do the technical work for it?",
      "Will der Account, dass jemand anderes die technische Arbeit für ihn erledigt?",
    ),
    answeredBy: t(
      "A managed service with one named contact, one fixed monthly price and nothing to operate themselves.",
      "Ein Managed Service mit einem festen Ansprechpartner, einem festen Monatspreis und nichts, das sie selbst betreiben müssen.",
    ),
    typical: t("Often small firms without IT staff, but not always: a 900-person manufacturer can decide to outsource its operations.", "Oft kleine Firmen ohne IT-Personal, aber nicht immer: Ein Maschinenbauer mit 900 Mitarbeitenden kann beschließen, seinen Betrieb auszulagern."),
  },
  scale: {
    id: "scale" as SegmentId,
    label: t("Scale-optimiser", "Scale-optimiser"),
    short: t("Scale", "Scale"),
    need: t(
      "Wants control and measurable price-performance: its own engineers want access (API, infrastructure as code), flexible capacity and costs they can compare.",
      "Will Kontrolle und messbares Preis-Leistungs-Verhältnis: Die eigenen Engineers wollen Zugriff (API, Infrastructure as Code), flexible Kapazität und Kosten, die sich vergleichen lassen.",
    ),
    decides: t(
      "By a technical test run by its own team: a benchmark, a load test or a proof of concept, not a sales meeting.",
      "Über einen technischen Test des eigenen Teams: einen Benchmark, einen Lasttest oder einen Proof of Concept, nicht über ein Verkaufsgespräch.",
    ),
    sounds: t(
      "“Send us the API docs.”, “We compare the price per vCPU every quarter.”, “Give us a two-week proof of concept.”",
      "„Schicken Sie uns die API-Doku.“, „Wir vergleichen jedes Quartal den Preis pro vCPU.“, „Geben Sie uns einen Proof of Concept über zwei Wochen.“",
    ),
    test: t(
      "Do the account's own engineers want to test, control and measure the service themselves?",
      "Wollen die eigenen Engineers des Accounts den Service selbst testen, steuern und messen?",
    ),
    answeredBy: t(
      "Technical access before any sales talk: documentation, a free test environment, usage-based prices that can be compared.",
      "Technischer Zugang vor jedem Verkaufsgespräch: Dokumentation, eine kostenlose Testumgebung, nutzungsbasierte Preise, die sich vergleichen lassen.",
    ),
    typical: t("Often software and data firms, but also any company with a strong platform team, including energy traders.", "Oft Software- und Datenfirmen, aber auch jede Firma mit starkem Plattformteam, bis hin zum Energiehändler."),
  },
});

/** The pairs a learner most often confuses, with the question that separates them (Materi A5). */
export const SEGMENT_PAIR_TESTS = bi([
  {
    pair: t("Compliance-first or Hands-off?", "Compliance-first oder Hands-off?"),
    test: t(
      "Ask what the account wants from you. Evidence it can show a third party is Compliance-first. Someone to run the service so they do not have to is Hands-off.",
      "Fragen Sie, was der Account von Ihnen will. Nachweise für eine dritte Stelle: Compliance-first. Jemand, der den Service betreibt, damit man es nicht selbst tun muss: Hands-off.",
    ),
  },
  {
    pair: t("Hands-off or Scale-optimiser?", "Hands-off oder Scale-optimiser?"),
    test: t(
      "Ask who does the technical work. Nobody in-house, and they want it done for them, is Hands-off. Their own engineers, who want access and control, is Scale-optimiser.",
      "Fragen Sie, wer die technische Arbeit macht. Niemand im Haus, und man will es erledigt haben: Hands-off. Die eigenen Engineers, die Zugriff und Kontrolle wollen: Scale-optimiser.",
    ),
  },
  {
    pair: t("Compliance-first or Scale-optimiser?", "Compliance-first oder Scale-optimiser?"),
    test: t(
      "Ask what decides the purchase. Documents and rights for someone outside is Compliance-first. A technical test measured by their own team is Scale-optimiser.",
      "Fragen Sie, was den Kauf entscheidet. Unterlagen und Rechte für eine externe Stelle: Compliance-first. Ein technischer Test, gemessen vom eigenen Team: Scale-optimiser.",
    ),
  },
  {
    pair: t("The sector points one way, the words another?", "Die Branche zeigt in eine Richtung, die Worte in eine andere?"),
    test: t(
      "Follow the words. The sector is a clue to check, not an answer: in DataCloud's file three sectors appear in two different segments.",
      "Folgen Sie den Worten. Die Branche ist ein Hinweis zum Prüfen, keine Antwort: In der Datei von DataCloud tauchen drei Branchen in zwei verschiedenen Segmenten auf.",
    ),
  },
]);

/* ------------------------------------------------------------------ business value of a segment (Materi A6) */

/** The value rule taught in A6: the sum of the potential annual contract value (ACV) of the accounts in a segment. */
export const VALUE_HIGH = 150000;
export const VALUE_MID = 100000;
export type Value = "low" | "mid" | "high";
export const VALUE_ORDER: Value[] = ["low", "mid", "high"];
export const valueOf = (sum: number): Value => (sum >= VALUE_HIGH ? "high" : sum >= VALUE_MID ? "mid" : "low");
export const VALUE_LABEL = bi({ low: t("Low", "Niedrig"), mid: t("Mid", "Mittel"), high: t("High", "Hoch") });
export const VALUE_GLYPH: Record<Value, string> = { low: "●○○", mid: "●●○", high: "●●●" };

/* ------------------------------------------------------------------ what to personalise (Block 2.2) */

export type ContentId = "proof" | "service" | "access" | "discount" | "industry";
export const CONTENT_IDS: ContentId[] = ["proof", "service", "access", "discount", "industry"];
export const CONTENTS = bi({
  proof: { id: "proof" as ContentId, label: t("Proof and compliance evidence", "Nachweise und Compliance-Unterlagen"), sub: t("Certificates, data locations, audit rights, references from the same sector.", "Zertifikate, Datenstandorte, Prüfrechte, Referenzen aus derselben Branche.") },
  service: { id: "service" as ContentId, label: t("Service model and one contact", "Servicemodell und ein Ansprechpartner"), sub: t("Who runs it, who to call, one planned monthly price.", "Wer betreibt es, wen ruft man an, ein planbarer Monatspreis.") },
  access: { id: "access" as ContentId, label: t("Technical access and price transparency", "Technischer Zugang und Preistransparenz"), sub: t("API, test environment, usage-based price per unit.", "API, Testumgebung, nutzungsbasierter Preis pro Einheit.") },
  discount: { id: "discount" as ContentId, label: t("A lower price", "Ein niedrigerer Preis"), sub: t("The same offer, cheaper.", "Das gleiche Angebot, günstiger.") },
  industry: { id: "industry" as ContentId, label: t("Industry wording and pictures", "Branchensprache und Branchenbilder"), sub: t("The same offer, told with the account's industry name.", "Das gleiche Angebot, erzählt mit dem Branchennamen des Accounts.") },
});
/** The content element that answers each segment's need (reference answer for Block 2.2). */
export const CONTENT_TRUTH: Record<SegmentId, ContentId> = { assure: "proof", handsoff: "service", scale: "access" };
