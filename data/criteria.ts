import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.1. Nine fields from DataCloud's CRM export, to sort into the three kinds of segmentation criteria taught in
 * Materi A3: firmographic, behaviour-based, needs-based. `truth` is never shown to the learner outside the mentor answer key.
 */
export type CritTag = "firmo" | "behaviour" | "need";
export const CRIT_TAGS = bi([
  { id: "firmo" as CritTag, label: t("Firmographic", "Firmografisch"), hint: t("A fact about the company you could read in a register without ever talking to it.", "Eine Tatsache über das Unternehmen, die Sie in einem Register lesen könnten, ohne je mit ihm zu sprechen.") },
  { id: "behaviour" as CritTag, label: t("Behaviour-based", "Verhaltensbasiert"), hint: t("Something the account did, recorded in your own systems.", "Etwas, das der Account getan hat, festgehalten in Ihren eigenen Systemen.") },
  { id: "need" as CritTag, label: t("Needs-based", "Bedarfsbasiert"), hint: t("A problem, duty or goal the account has to solve.", "Ein Problem, eine Pflicht oder ein Ziel, das der Account lösen muss.") },
]);
export const CRIT_LABEL = bi({ firmo: t("Firmographic", "Firmografisch"), behaviour: t("Behaviour-based", "Verhaltensbasiert"), need: t("Needs-based", "Bedarfsbasiert") });

export type FieldId = "nace" | "staff" | "hq" | "tickets" | "renewal" | "download" | "audit" | "runit" | "peak";

export type CrmField = {
  id: FieldId;
  /** The CRM field as printed. */
  text: string;
  truth: CritTag;
  /** One question that teaches how to test the item. Shown for every item at once, never only the wrong ones. */
  clue: string;
  /** Why it belongs where it does. Opened only after two genuine checks, and recorded in the export. */
  why: string;
  /** For the mentor answer key: why each rejected tag is rejected. */
  rejected: Partial<Record<CritTag, string>>;
};

export const FIELDS: CrmField[] = bi([
  {
    id: "nace" as FieldId,
    text: t("Industry code (NACE): 49.41, road freight transport", "Branchencode (NACE): 49.41, Güterbeförderung im Straßenverkehr"),
    truth: "firmo" as CritTag,
    clue: t("Could you look this up in a company register without ever speaking to the account?", "Könnten Sie das in einem Handelsregister nachschlagen, ohne je mit dem Account zu sprechen?"),
    why: t("An industry code is a registered fact about the company. It describes what the firm is, not what it did or needs.", "Ein Branchencode ist eine registrierte Tatsache über das Unternehmen. Er beschreibt, was die Firma ist, nicht was sie getan hat oder braucht."),
    rejected: {
      need: t("It says nothing about a problem the account must solve. Two hauliers can have opposite needs.", "Er sagt nichts über ein Problem, das der Account lösen muss. Zwei Speditionen können gegensätzliche Bedürfnisse haben."),
      behaviour: t("Nobody at the account did anything to produce it.", "Niemand beim Account hat etwas getan, um ihn zu erzeugen."),
    },
  },
  {
    id: "staff" as FieldId,
    text: t("Employees: 380", "Mitarbeitende: 380"),
    truth: "firmo" as CritTag,
    clue: t("Is this a property of the company, or something it did or needs?", "Ist das eine Eigenschaft des Unternehmens, oder etwas, das es getan hat oder braucht?"),
    why: t("Company size is the classic firmographic criterion. It is easy to get and says little about what the account needs.", "Die Unternehmensgröße ist das klassische firmografische Kriterium. Sie ist leicht zu bekommen und sagt wenig darüber, was der Account braucht."),
    rejected: { need: t("A headcount is not a problem to solve.", "Eine Mitarbeiterzahl ist kein Problem, das gelöst werden muss.") },
  },
  {
    id: "hq" as FieldId,
    text: t("Head office: Bremen", "Hauptsitz: Bremen"),
    truth: "firmo" as CritTag,
    clue: t("Could a data provider sell you this field for any company in Germany?", "Könnte ein Datenanbieter Ihnen dieses Feld für jedes Unternehmen in Deutschland verkaufen?"),
    why: t("Location is a geographic, firmographic fact. It matters for sales territories, rarely for the offer.", "Der Standort ist eine geografische, firmografische Tatsache. Er zählt für Vertriebsgebiete, selten für das Angebot."),
    rejected: { behaviour: t("The account did not do anything; it is where it is.", "Der Account hat nichts getan; er sitzt einfach dort.") },
  },
  {
    id: "tickets" as FieldId,
    text: t("Opened 3 support tickets about restoring backups in the last quarter", "Hat im letzten Quartal 3 Support-Tickets zur Wiederherstellung von Backups eröffnet"),
    truth: "behaviour" as CritTag,
    clue: t("Is this something you observed in your own systems, or the reason behind it?", "Ist das etwas, das Sie in Ihren eigenen Systemen beobachtet haben, oder der Grund dahinter?"),
    why: t("Tickets are recorded actions. They hint at a need (reliable restores) but the field itself is what the account did.", "Tickets sind aufgezeichnete Handlungen. Sie deuten auf einen Bedarf hin (verlässliche Wiederherstellung), aber das Feld selbst ist das, was der Account getan hat."),
    rejected: { need: t("The need would be “must restore within four hours”; the field only counts what happened.", "Der Bedarf wäre „muss innerhalb von vier Stunden wiederherstellen“; das Feld zählt nur, was passiert ist.") },
  },
  {
    id: "renewal" as FieldId,
    text: t("Buys extra storage only at contract renewal, never in between", "Kauft zusätzlichen Speicher nur bei der Vertragsverlängerung, nie dazwischen"),
    truth: "behaviour" as CritTag,
    clue: t("Would you find this in the order history?", "Würden Sie das in der Bestellhistorie finden?"),
    why: t("A buying pattern read from orders is behaviour. Why the account buys that way is a separate question.", "Ein Kaufmuster aus den Bestellungen ist Verhalten. Warum der Account so kauft, ist eine andere Frage."),
    rejected: { firmo: t("It cannot be read in any register; only your own order data shows it.", "Es steht in keinem Register; nur Ihre eigenen Bestelldaten zeigen es.") },
  },
  {
    id: "download" as FieldId,
    text: t("Downloaded the migration checklist twice in one week", "Hat die Migrations-Checkliste zweimal in einer Woche heruntergeladen"),
    truth: "behaviour" as CritTag,
    clue: t("Is this a recorded action or a stated obligation?", "Ist das eine aufgezeichnete Handlung oder eine genannte Pflicht?"),
    why: t("A download is a digital trace of what someone did. It can signal interest, not a need the account has named.", "Ein Download ist eine digitale Spur dessen, was jemand getan hat. Er kann Interesse anzeigen, aber keinen Bedarf, den der Account benannt hat."),
    rejected: { need: t("Interest is not yet a need; the account has not said what it must solve.", "Interesse ist noch kein Bedarf; der Account hat nicht gesagt, was er lösen muss.") },
  },
  {
    id: "audit" as FieldId,
    text: t("Must prove to its auditor that customer data never leaves Germany", "Muss seinem Wirtschaftsprüfer nachweisen, dass Kundendaten Deutschland nie verlassen"),
    truth: "need" as CritTag,
    clue: t("Is this a duty the account has to meet, whatever it did so far?", "Ist das eine Pflicht, die der Account erfüllen muss, egal was er bisher getan hat?"),
    why: t("An obligation towards an auditor is a need. It decides what offer can work, and it holds before any contact with you.", "Eine Pflicht gegenüber einem Prüfer ist ein Bedarf. Sie entscheidet, welches Angebot funktionieren kann, und gilt schon vor jedem Kontakt mit Ihnen."),
    rejected: { firmo: t("No register shows it; the same industry can have accounts without this duty.", "Kein Register zeigt es; in derselben Branche gibt es Accounts ohne diese Pflicht.") },
  },
  {
    id: "runit" as FieldId,
    text: t("Has no in-house engineer and wants the service run for it", "Hat keinen eigenen Engineer und will, dass der Service für ihn betrieben wird"),
    truth: "need" as CritTag,
    clue: t("Does this describe what the account did, or what it has to have solved?", "Beschreibt das, was der Account getan hat, oder was er gelöst haben muss?"),
    why: t("The missing capacity and the wish to have it run are the problem the account must solve. That is a need.", "Die fehlende Kapazität und der Wunsch, es betreiben zu lassen, sind das Problem, das der Account lösen muss. Das ist ein Bedarf."),
    rejected: { behaviour: t("Nothing here was recorded as an action; it describes the account's situation.", "Hier wurde keine Handlung aufgezeichnet; es beschreibt die Lage des Accounts.") },
  },
  {
    id: "peak" as FieldId,
    text: t("Needs capacity that doubles for four weeks around the year-end close", "Braucht Kapazität, die sich für vier Wochen rund um den Jahresabschluss verdoppelt"),
    truth: "need" as CritTag,
    clue: t("Is this a requirement the service has to meet, or a trace of past activity?", "Ist das eine Anforderung an den Service, oder eine Spur früherer Aktivität?"),
    why: t("A capacity requirement is a need. It tells you which offer fits (flexible capacity), whatever the account's size.", "Eine Kapazitätsanforderung ist ein Bedarf. Sie sagt Ihnen, welches Angebot passt (flexible Kapazität), unabhängig von der Größe des Accounts."),
    rejected: { behaviour: t("It is stated as a requirement, not observed as usage.", "Es ist als Anforderung formuliert, nicht als beobachtete Nutzung.") },
  },
]);

export const FIELD_BY_ID = Object.fromEntries(FIELDS.map((f) => [f.id, f])) as Record<FieldId, CrmField>;
export const FIELD_IDS: FieldId[] = ["nace", "staff", "hq", "tickets", "renewal", "download", "audit", "runit", "peak"];

/** The tests taught in Materi A3 for each tag. */
export const CRIT_TESTS = bi([
  { tag: "firmo" as CritTag, name: t("Firmographic", "Firmografisch"), test: t("Could you read it from a company register or a data provider without ever talking to the account?", "Könnten Sie es aus einem Register oder von einem Datenanbieter ablesen, ohne je mit dem Account zu sprechen?") },
  { tag: "behaviour" as CritTag, name: t("Behaviour-based", "Verhaltensbasiert"), test: t("Is it something the account did, recorded in your own systems (tickets, orders, downloads, logins)?", "Ist es etwas, das der Account getan hat, festgehalten in Ihren eigenen Systemen (Tickets, Bestellungen, Downloads, Logins)?") },
  { tag: "need" as CritTag, name: t("Needs-based", "Bedarfsbasiert"), test: t("Is it a problem, duty or goal the account must solve, whatever it has done so far?", "Ist es ein Problem, eine Pflicht oder ein Ziel, das der Account lösen muss, egal was er bisher getan hat?") },
  { tag: "behaviour" as CritTag, name: t("Behaviour or need?", "Verhalten oder Bedarf?"), test: t("A behaviour is what you observed; a need is the reason behind it. “Opened three restore tickets” is behaviour; “must restore within four hours” is a need.", "Verhalten ist, was Sie beobachtet haben; Bedarf ist der Grund dahinter. „Hat drei Restore-Tickets eröffnet“ ist Verhalten; „muss innerhalb von vier Stunden wiederherstellen“ ist Bedarf.") },
]);
