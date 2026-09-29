"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Diagram, Insight, Story, Toggles } from "@/components/materi/kit";
import { SEGMENTS } from "@/data/segments";
import type { SegmentId } from "@/data/segments";
import { CRIT_LABEL } from "@/data/criteria";
import type { CritTag } from "@/data/criteria";
import { WESER, WESER_RESULT, extraProfit } from "@/data/tailoring";
import type { SegmentCalc } from "@/data/tailoring";
import { evBucket } from "@/data/measures";
import { VALUE_LABEL, valueOf } from "@/data/segments";
import { bi, euro, euroSigned, num, pct, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi A (Route 1). Every one uses the worked-example company Weserdata (a Bremen hosting firm, Case
 * assumption), never DataCloud, so the answer to a task block is never printed. Every control is followed by an always-visible
 * "What this shows" (CLAUDE.md #20).
 */

const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };

/* ------------------------------------------------------------------ A1 · one offer for all, or segments? */

type Ind = "H" | "L" | "S";
const DOTS: { x: number; y: number; ind: Ind; need: SegmentId }[] = [
  { x: 28, y: 86, ind: "H", need: "assure" },
  { x: 38, y: 80, ind: "L", need: "assure" },
  { x: 22, y: 76, ind: "S", need: "assure" },
  { x: 34, y: 91, ind: "H", need: "assure" },
  { x: 44, y: 84, ind: "S", need: "assure" },
  { x: 14, y: 22, ind: "H", need: "handsoff" },
  { x: 20, y: 13, ind: "L", need: "handsoff" },
  { x: 9, y: 30, ind: "S", need: "handsoff" },
  { x: 25, y: 26, ind: "L", need: "handsoff" },
  { x: 16, y: 17, ind: "S", need: "handsoff" },
  { x: 82, y: 24, ind: "S", need: "scale" },
  { x: 88, y: 35, ind: "L", need: "scale" },
  { x: 76, y: 18, ind: "H", need: "scale" },
  { x: 91, y: 20, ind: "H", need: "scale" },
  { x: 80, y: 31, ind: "L", need: "scale" },
];
const IND_NAME = bi({ H: t("Health", "Gesundheit"), L: t("Logistics", "Logistik"), S: t("Software", "Software") });
type FitMode = "one" | "industry" | "need";

function centroid(pts: { x: number; y: number }[]) {
  return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
}
function groupsFor(mode: FitMode) {
  const key = (d: (typeof DOTS)[number]) => (mode === "one" ? "all" : mode === "industry" ? d.ind : d.need);
  const g = new Map<string, number[]>();
  DOTS.forEach((d, i) => g.set(key(d), [...(g.get(key(d)) ?? []), i]));
  return [...g.entries()].map(([k, idx]) => ({ k, idx, c: centroid(idx.map((i) => DOTS[i])) }));
}
const gapOf = (mode: FitMode) => {
  const gs = groupsFor(mode);
  let sum = 0;
  for (const g of gs) for (const i of g.idx) sum += Math.hypot(DOTS[i].x - g.c.x, DOTS[i].y - g.c.y);
  return sum / DOTS.length;
};

export function FitGap() {
  const uid = useId().replace(/:/g, "");
  const [mode, setMode] = useState<FitMode>("one");
  const gs = groupsFor(mode);
  const X = (v: number) => 60 + v * 4.6;
  const Y = (v: number) => 250 - v * 2.2;
  const gOne = gapOf("one");
  const gInd = gapOf("industry");
  const gNeed = gapOf("need");
  const cur = gapOf(mode);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 290" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Fifteen customers of Weserdata placed by their two needs, and the offers that serve them", "Fünfzehn Kunden von Weserdata, nach ihren zwei Bedarfen platziert, und die Angebote, die sie bedienen")}</title>
        <desc id={`${uid}-d`}>{tt(`Mode: ${mode}. ${gs.length} offer(s). Average distance between what a customer needs and its offer: ${num(Math.round(cur))} points.`, `Modus: ${mode}. ${gs.length} Angebot(e). Durchschnittlicher Abstand zwischen Bedarf und Angebot: ${num(Math.round(cur))} Punkte.`)}</desc>
        <rect x="60" y="30" width="460" height="220" fill={C.paper} stroke={C.line} />
        <line x1="60" y1="250" x2="520" y2="250" stroke={C.ash} strokeWidth="1.4" />
        <line x1="60" y1="30" x2="60" y2="250" stroke={C.ash} strokeWidth="1.4" />
        <text x="290" y="276" textAnchor="middle" fontSize="12" fill={C.ash}>{tt("need for control: run it for me  →  we run it ourselves", "Bedarf an Kontrolle: für mich betreiben  →  selbst betreiben")}</text>
        <text x="20" y="140" textAnchor="middle" fontSize="12" fill={C.ash} transform="rotate(-90 20 140)">{tt("need for proof →", "Bedarf an Nachweisen →")}</text>
        {gs.map((g) =>
          g.idx.map((i) => <line key={`l${g.k}-${i}`} x1={X(DOTS[i].x)} y1={Y(DOTS[i].y)} x2={X(g.c.x)} y2={Y(g.c.y)} stroke={C.gold} strokeWidth="1.3" strokeDasharray="3 3" />),
        )}
        {DOTS.map((d, i) => (
          <g key={i}>
            <circle cx={X(d.x)} cy={Y(d.y)} r="10" fill={C.tealSoft} stroke={C.teal} strokeWidth="1.5" />
            <text x={X(d.x)} y={Y(d.y) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>{d.ind}</text>
          </g>
        ))}
        {gs.map((g) => (
          <g key={`o${g.k}`}>
            <rect x={X(g.c.x) - 9} y={Y(g.c.y) - 9} width="18" height="18" transform={`rotate(45 ${X(g.c.x)} ${Y(g.c.y)})`} fill={C.data} stroke={C.ink} strokeWidth="1.5" />
          </g>
        ))}
        <text x="64" y="22" fontSize="11.5" fill={C.ash}>{tt("circle = customer (H health, L logistics, S software) · diamond = an offer · dashed = the gap", "Kreis = Kunde (H Gesundheit, L Logistik, S Software) · Raute = ein Angebot · gestrichelt = die Lücke")}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("How many offers, built around what?", "Wie viele Angebote, gebaut worum?")}</p>
        <Toggles<FitMode>
          label={tt("Offer design", "Angebotsdesign")}
          value={mode}
          onChange={setMode}
          options={[
            { id: "one", label: tt("One offer for all", "Ein Angebot für alle") },
            { id: "industry", label: tt("One offer per industry", "Ein Angebot pro Branche") },
            { id: "need", label: tt("One offer per need", "Ein Angebot pro Bedarf") },
          ]}
        />
      </div>
      <Insight>
        {mode === "one"
          ? tt(
              `One offer sits in the middle of everyone and close to no one: on average it is ${num(Math.round(gOne))} points away from what a customer needs. That distance is what “our offers feel generic” means in numbers.`,
              `Ein Angebot sitzt in der Mitte von allen und nah bei niemandem: Im Schnitt liegt es ${num(Math.round(gOne))} Punkte von dem entfernt, was ein Kunde braucht. Dieser Abstand ist „unsere Angebote wirken generisch“ in Zahlen.`,
            )
          : mode === "industry"
            ? tt(
                `Three industry offers bring the average gap only from ${num(Math.round(gOne))} to ${num(Math.round(gInd))} points, because every industry has customers in every corner. Segmenting by the easy criterion costs the effort of three offers and buys little fit.`,
                `Drei Branchenangebote senken die durchschnittliche Lücke nur von ${num(Math.round(gOne))} auf ${num(Math.round(gInd))} Punkte, weil jede Branche Kunden in jeder Ecke hat. Nach dem bequemen Kriterium zu segmentieren kostet den Aufwand von drei Angeboten und bringt wenig Passung.`,
              )
            : tt(
                `Three offers built around the needs cut the average gap from ${num(Math.round(gOne))} to ${num(Math.round(gNeed))} points. Same number of offers as by industry, a far better fit: the basis you segment on matters more than how many segments you make.`,
                `Drei Angebote, die um die Bedarfe gebaut sind, senken die durchschnittliche Lücke von ${num(Math.round(gOne))} auf ${num(Math.round(gNeed))} Punkte. Gleich viele Angebote wie nach Branche, aber viel bessere Passung: Die Grundlage der Segmentierung zählt mehr als die Zahl der Segmente.`,
              )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A2 · target group → segment → need → offer */

type Path = "clinic" | "retail" | "soft";
const PATHS = bi({
  clinic: { seg: t("Clinics that must prove", "Kliniken mit Nachweispflicht"), need: t("Show the auditor where patient data is and how to leave", "Dem Prüfer zeigen, wo Patientendaten liegen und wie man aussteigt"), offer: t("Audit folder, German data centres, exit plan", "Prüfordner, deutsche Rechenzentren, Exit-Plan") },
  retail: { seg: t("Retail chains without IT staff", "Handelsketten ohne IT-Personal"), need: t("Have it run, one number to call, a fixed price", "Betreiben lassen, eine Nummer, ein fester Preis"), offer: t("Managed package with one contact", "Managed-Paket mit einem Ansprechpartner") },
  soft: { seg: t("Software teams", "Software-Teams"), need: t("Test, control and compare the price", "Testen, steuern und den Preis vergleichen"), offer: t("API, free test, price per minute", "API, kostenloser Test, Minutenpreis") },
});
type Step = "market" | "target" | "segment" | "need" | "offer";
const STEP_TEXT = bi({
  market: { name: t("Market", "Markt"), what: t("All German companies that buy hosting or cloud services.", "Alle deutschen Unternehmen, die Hosting- oder Cloud-Services kaufen."), kind: t("Not a choice yet: everyone who could buy.", "Noch keine Wahl: alle, die kaufen könnten.") },
  target: { name: t("Target group", "Zielgruppe"), what: t("Weserdata's choice: Mittelstand companies in Northern Germany with 50 to 2,000 employees.", "Die Wahl von Weserdata: Mittelständler in Norddeutschland mit 50 bis 2.000 Mitarbeitenden."), kind: t("Strategic. It says whom the company addresses at all, and is set by management for years.", "Strategisch. Sie sagt, wen das Unternehmen überhaupt anspricht, und wird von der Geschäftsführung für Jahre festgelegt.") },
  segment: { name: t("Segment", "Segment"), what: t("A group inside the target group that gets its own offer.", "Eine Gruppe innerhalb der Zielgruppe, die ein eigenes Angebot bekommt."), kind: t("Operational. It says how sales and marketing serve one group differently from another, and it can change every year.", "Operativ. Es sagt, wie Vertrieb und Marketing eine Gruppe anders bedienen als eine andere, und kann sich jedes Jahr ändern.") },
  need: { name: t("Need", "Bedarf"), what: t("What the segment's companies have to solve.", "Was die Unternehmen des Segments lösen müssen."), kind: t("The reason the segment exists: without a shared need, a group is only a list.", "Der Grund, warum das Segment existiert: Ohne gemeinsamen Bedarf ist eine Gruppe nur eine Liste.") },
  offer: { name: t("Offer", "Angebot"), what: t("What the segment gets: content, service, price, terms.", "Was das Segment bekommt: Inhalte, Service, Preis, Konditionen."), kind: t("It follows from the need. If two segments get the same offer, they are one segment.", "Es folgt aus dem Bedarf. Bekommen zwei Segmente dasselbe Angebot, sind sie ein Segment.") },
});
const STEPS: Step[] = ["market", "target", "segment", "need", "offer"];

export function SegmentLadder() {
  const uid = useId().replace(/:/g, "");
  const [path, setPath] = useState<Path>("clinic");
  const [step, setStep] = useState<Step>("segment");
  const p = PATHS[path];
  const label = (s: Step) => (s === "segment" ? p.seg : s === "need" ? p.need : s === "offer" ? p.offer : s === "market" ? tt("All companies buying cloud", "Alle Cloud-Käufer") : tt("Mittelstand, North, 50–2,000", "Mittelstand, Nord, 50–2.000"));
  const W = [520, 440, 360, 360, 360];
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 290" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("From market to target group to segment to need to offer", "Vom Markt zur Zielgruppe zum Segment zum Bedarf zum Angebot")}</title>
        <desc id={`${uid}-d`}>{tt(`Following the segment “${p.seg}”: need “${p.need}”, offer “${p.offer}”.`, `Segment „${p.seg}“: Bedarf „${p.need}“, Angebot „${p.offer}“.`)}</desc>
        {STEPS.map((s, i) => {
          const y = 8 + i * 56;
          const w = W[i];
          const x = (560 - w) / 2;
          const on = s === step;
          const strategic = s === "target" || s === "market";
          return (
            <g key={s} className="hit" role="button" tabIndex={0} aria-label={STEP_TEXT[s].name} onClick={() => setStep(s)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setStep(s)}>
              <rect className="hit-shape" x={x} y={y} width={w} height="44" rx="8" fill={on ? C.soft : strategic ? C.mist : C.tealSoft} stroke={on ? C.amber : strategic ? C.ash : C.teal} strokeWidth={on ? 2.4 : 1.4} strokeDasharray={strategic ? "6 4" : undefined} />
              <text x="280" y={y + 18} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ash}>{STEP_TEXT[s].name.toUpperCase()}</text>
              <text x="280" y={y + 35} textAnchor="middle" fontSize="13" fontWeight="600" fill={C.ink}>{label(s)}</text>
              {i < STEPS.length - 1 && <line x1="280" y1={y + 44} x2="280" y2={y + 56} stroke={C.ink} strokeWidth="1.6" />}
            </g>
          );
        })}
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Follow one segment of Weserdata", "Einem Segment von Weserdata folgen")}</p>
          <Toggles<Path> label={tt("Segment", "Segment")} value={path} onChange={setPath} options={(Object.keys(PATHS) as Path[]).map((k) => ({ id: k, label: PATHS[k].seg }))} />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Read one level", "Eine Ebene lesen")}</p>
          <Toggles<Step> label={tt("Level", "Ebene")} value={step} onChange={setStep} options={STEPS.map((s) => ({ id: s, label: STEP_TEXT[s].name }))} />
        </div>
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{STEP_TEXT[step].name}</p>
        <p className="mt-1 text-ink">
          <Gloss>{STEP_TEXT[step].what}</Gloss>
        </p>
        <p className="mt-1 text-ash">
          <Gloss>{STEP_TEXT[step].kind}</Gloss>
        </p>
      </div>
      <Insight>
        {tt(
          `The two dashed levels at the top are the same for all three paths: the target group does not change when you switch segment. Only the three teal levels change. That is the difference: the target group is one strategic choice; “${p.seg}” is one of several operational groups inside it, each with its own need (“${p.need}”) and its own offer.`,
          `Die zwei gestrichelten Ebenen oben sind für alle drei Pfade gleich: Die Zielgruppe ändert sich nicht, wenn Sie das Segment wechseln. Nur die drei türkisen Ebenen ändern sich. Das ist der Unterschied: Die Zielgruppe ist eine strategische Wahl; „${p.seg}“ ist eine von mehreren operativen Gruppen darin, jede mit eigenem Bedarf („${p.need}“) und eigenem Angebot.`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A3 · the nested approach, and a worked sort */

type Ring = "firmo" | "operating" | "purchasing" | "situation" | "personal";
const RINGS = bi([
  { id: "firmo" as Ring, name: t("Firmographics", "Firmografie"), holds: t("Industry, size, location, legal form.", "Branche, Größe, Standort, Rechtsform."), cloud: t("“Hospital, 1,200 staff, Bremen.”", "„Krankenhaus, 1.200 Beschäftigte, Bremen.“"), see: 3, predict: 1, kind: "firmo" as CritTag },
  { id: "operating" as Ring, name: t("Operating variables", "Betriebliche Merkmale"), holds: t("Technology in use, whether the firm has its own IT team, how much it already uses cloud.", "Eingesetzte Technik, ob die Firma ein eigenes IT-Team hat, wie viel Cloud sie schon nutzt."), cloud: t("“Runs its own Kubernetes; no IT on weekends.”", "„Betreibt eigenes Kubernetes; keine IT am Wochenende.“"), see: 2, predict: 2, kind: "behaviour" as CritTag },
  { id: "purchasing" as Ring, name: t("Purchasing approach", "Einkaufsverhalten"), holds: t("Who decides, how (committee, tender, one owner), what they weigh.", "Wer entscheidet, wie (Gremium, Ausschreibung, ein Inhaber), was sie gewichten."), cloud: t("“Legal and the data protection officer read everything first.”", "„Rechtsabteilung und Datenschutz lesen erst alles.“"), see: 2, predict: 3, kind: "behaviour" as CritTag },
  { id: "situation" as Ring, name: t("Situational factors", "Situative Faktoren"), holds: t("Urgency, a deadline, the size of this order, the problem that has to be solved now.", "Dringlichkeit, eine Frist, die Größe dieses Auftrags, das Problem, das jetzt gelöst werden muss."), cloud: t("“Must pass a NIS2 audit by March.”", "„Muss bis März ein NIS2-Audit bestehen.“"), see: 1, predict: 3, kind: "need" as CritTag },
  { id: "personal" as Ring, name: t("Personal characteristics", "Persönliche Merkmale"), holds: t("The buyer's own attitude to risk, loyalty, how they like to be served.", "Die eigene Haltung der Käuferin zu Risiko, Loyalität, wie sie bedient werden will."), cloud: t("“Wants the same contact every time.”", "„Will jedes Mal denselben Ansprechpartner.“"), see: 1, predict: 2, kind: "need" as CritTag },
]);
const DOTS3 = ["", "●○○", "●●○", "●●●"];

export function NestedRings() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState<Ring>("firmo");
  const r = RINGS.find((x) => x.id === sel)!;
  const idx = RINGS.findIndex((x) => x.id === sel);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 250" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("The nested approach: five layers from the outside in", "Der Nested Approach: fünf Schichten von außen nach innen")}</title>
        <desc id={`${uid}-d`}>{tt(`Selected layer ${idx + 1} of 5: ${r.name}. Easy to see ${r.see} of 3, predicts the need ${r.predict} of 3.`, `Gewählte Schicht ${idx + 1} von 5: ${r.name}. Leicht zu sehen ${r.see} von 3, sagt den Bedarf voraus ${r.predict} von 3.`)}</desc>
        {RINGS.map((ring, i) => {
          const rx = 230 - i * 42;
          const ry = 118 - i * 22;
          const on = ring.id === sel;
          return (
            <g key={ring.id} className="hit" role="button" tabIndex={0} aria-label={ring.name} onClick={() => setSel(ring.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(ring.id)}>
              <ellipse className="hit-shape" cx="280" cy="125" rx={rx} ry={ry} fill={on ? C.soft : i % 2 ? C.paper : C.mist} stroke={on ? C.amber : C.ash} strokeWidth={on ? 2.6 : 1.2} />
              <text x="280" y={125 - ry + 16} textAnchor="middle" fontSize="12" fontWeight={on ? 800 : 600} fill={C.ink}>{`${i + 1} · ${ring.name}`}</text>
            </g>
          );
        })}
        <text x="10" y="240" fontSize="11.5" fill={C.ash}>{tt("outside: easy to see, weak predictor · inside: hard to see, strong predictor", "außen: leicht zu sehen, schwache Vorhersage · innen: schwer zu sehen, starke Vorhersage")}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one layer", "Eine Schicht lesen")}</p>
        <Toggles<Ring> label={tt("Layer", "Schicht")} value={sel} onChange={setSel} options={RINGS.map((x, i) => ({ id: x.id, label: `${i + 1} · ${x.name}` }))} />
      </div>
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
        <p className="smallcaps">{r.name}</p>
        <p className="mt-1 text-ink">
          <Gloss>{r.holds}</Gloss>
        </p>
        <p className="mt-1 text-ash">
          <span className="font-semibold text-ink">{tt("In a cloud deal. ", "In einem Cloud-Deal. ")}</span>
          {r.cloud}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">{tt("Easy to find out: ", "Leicht herauszufinden: ")}</span>
          <span aria-hidden>{DOTS3[r.see]}</span> {r.see}/3 · <span className="font-semibold text-ink">{tt("Predicts the need: ", "Sagt den Bedarf voraus: ")}</span>
          <span aria-hidden>{DOTS3[r.predict]}</span> {r.predict}/3 · <span className="font-semibold text-ink">{tt("Kind of criterion: ", "Art des Kriteriums: ")}</span>
          {CRIT_LABEL[r.kind]}
        </p>
      </div>
      <Insight>
        {r.see > r.predict
          ? tt(
              `${r.name} is the easiest layer to fill (${r.see} of 3) and the weakest guide to what a customer needs (${r.predict} of 3). That is why most CRMs are full of it, and why offers built on it feel generic.`,
              `${r.name} ist die Schicht, die sich am leichtesten füllen lässt (${r.see} von 3), und der schwächste Hinweis darauf, was ein Kunde braucht (${r.predict} von 3). Deshalb sind die meisten CRMs voll davon, und deshalb wirken Angebote, die darauf bauen, generisch.`,
            )
          : r.predict > r.see
            ? tt(
                `${r.name} is harder to find out (${r.see} of 3) and a stronger guide to the need (${r.predict} of 3). You get it from conversations and notes, not from a database: moving inwards costs effort and pays in fit.`,
                `${r.name} ist schwerer herauszufinden (${r.see} von 3) und ein stärkerer Hinweis auf den Bedarf (${r.predict} von 3). Man bekommt es aus Gesprächen und Notizen, nicht aus einer Datenbank: Nach innen zu gehen kostet Mühe und zahlt sich in Passung aus.`,
              )
            : tt(`${r.name} sits in between: moderately easy to find out and moderately telling.`, `${r.name} liegt dazwischen: mittelschwer herauszufinden und mittelmäßig aussagekräftig.`)}
      </Insight>
    </div>
  );
}

const WS_FIELDS = bi([
  { id: "w1", text: t("Industry: hospital", "Branche: Krankenhaus"), tag: "firmo" as CritTag, test: t("Could you read it in a register?", "Könnten Sie es in einem Register lesen?"), why: t("A registered fact about the company. It says nothing about what this hospital must solve.", "Eine registrierte Tatsache über das Unternehmen. Sie sagt nichts darüber, was dieses Krankenhaus lösen muss.") },
  { id: "w2", text: t("Employees: 1,200", "Mitarbeitende: 1.200"), tag: "firmo" as CritTag, test: t("Is it a property of the company?", "Ist es eine Eigenschaft des Unternehmens?"), why: t("Size is firmographic. Big hospitals and small practices can have the same need.", "Größe ist firmografisch. Große Kliniken und kleine Praxen können denselben Bedarf haben.") },
  { id: "w3", text: t("Logs in to the portal twice a day", "Loggt sich zweimal täglich ins Portal ein"), tag: "behaviour" as CritTag, test: t("Did your systems record it as an action?", "Haben Ihre Systeme es als Handlung festgehalten?"), why: t("A recorded action. It hints that someone watches the service closely; it does not say why.", "Eine festgehaltene Handlung. Sie deutet an, dass jemand den Service genau beobachtet; sie sagt nicht, warum.") },
  { id: "w4", text: t("Renewed early twice", "Hat zweimal vorzeitig verlängert"), tag: "behaviour" as CritTag, test: t("Is it in the order history?", "Steht es in der Bestellhistorie?"), why: t("A buying pattern read from orders: behaviour.", "Ein Kaufmuster aus den Bestellungen: Verhalten.") },
  { id: "w5", text: t("Must keep patient images for 30 years", "Muss Patientenbilder 30 Jahre aufbewahren"), tag: "need" as CritTag, test: t("Is it a duty the customer has to meet?", "Ist es eine Pflicht, die der Kunde erfüllen muss?"), why: t("A legal retention duty: a need that decides which offer can work.", "Eine gesetzliche Aufbewahrungspflicht: ein Bedarf, der entscheidet, welches Angebot funktionieren kann.") },
  { id: "w6", text: t("Needs a fixed price because budgets are set a year ahead", "Braucht einen Festpreis, weil Budgets ein Jahr im Voraus stehen"), tag: "need" as CritTag, test: t("Is it a requirement the offer must meet?", "Ist es eine Anforderung, die das Angebot erfüllen muss?"), why: t("A requirement that follows from how the customer budgets. It holds whatever it did so far.", "Eine Anforderung, die aus der Budgetplanung des Kunden folgt. Sie gilt, egal was er bisher getan hat.") },
]);
const TAG_STYLE: Record<CritTag, string> = {
  firmo: "border-ash/50 bg-mist text-ink",
  behaviour: "border-signal/50 bg-signalSoft text-signal",
  need: "border-accent/50 bg-accentSoft text-accent",
};

export function CritSortExample() {
  const [sel, setSel] = useState("w1");
  const [seen, setSeen] = useState<string[]>(["w1"]);
  const r = WS_FIELDS.find((x) => x.id === sel)!;
  const pick = (id: string) => {
    setSel(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  return (
    <Diagram label={tt("Worked example · six fields from Weserdata's CRM (Case assumption, read-only)", "Durchgerechnetes Beispiel · sechs Felder aus dem CRM von Weserdata (Fallannahme, nur lesen)")}>
      <ol className="grid gap-2 sm:grid-cols-2">
        {WS_FIELDS.map((h) => {
          const on = h.id === sel;
          return (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => pick(h.id)}
                aria-pressed={on}
                className={clsx("flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border bg-paper px-3 py-2 text-left text-caption transition-colors", on ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line hover:border-ash")}
              >
                <span className="text-ink">{h.text}</span>
                {seen.includes(h.id) && <span className={clsx("pill", TAG_STYLE[h.tag])}>{CRIT_LABEL[h.tag]}</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 space-y-1 rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          {tt("Tag: ", "Einordnung: ")}
          <span className="text-accent">{CRIT_LABEL[r.tag]}</span>
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("The test question. ", "Die Testfrage. ")}</span>
          {r.test}
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("Why. ", "Warum. ")}</span>
          {r.why}
        </p>
      </div>
      <Insight className="mt-3">
        {tt(
          `Two fields are firmographic, two are behaviour and two are needs. The trap is between behaviour and need: “logs in twice a day” is what happened, “must keep images for 30 years” is why an offer has to look a certain way. You have opened ${seen.length} of 6.`,
          `Zwei Felder sind firmografisch, zwei Verhalten und zwei Bedarf. Die Falle liegt zwischen Verhalten und Bedarf: „loggt sich zweimal täglich ein“ ist, was passiert ist, „muss Bilder 30 Jahre aufbewahren“ ist, warum ein Angebot auf eine bestimmte Art aussehen muss. Sie haben ${seen.length} von 6 geöffnet.`,
        )}
      </Insight>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ A4 · effort against benefit */

type WSeg = "clinics" | "retail";
type Focus = "profit" | "cost" | "net" | null;

export function EffortBenefit() {
  const uid = useId().replace(/:/g, "");
  const [seg, setSeg] = useState<WSeg>("clinics");
  const [uplift, setUplift] = useState<number | null>(null);
  /** null = the learner explores alone; a number = the guided walk-through is on that step (CLAUDE.md #36). */
  const [story, setStory] = useState<number | null>(null);
  const base = WESER[seg];
  const up = uplift ?? base.tailored - base.standard;
  const calc = (sg: WSeg, points: number) => {
    const b = WESER[sg];
    const extra = extraProfit({ ...b, tailored: b.standard + points }, WESER.margin);
    return { extra, net: extra - WESER.cost, deals: (b.proposals * points) / 100, breakEven: (WESER.cost / (b.proposals * b.acv * (WESER.margin / 100))) * 100 };
  };
  const now = calc(seg, up);
  const extra = now.extra;
  const net = now.net;
  const breakEvenUp = now.breakEven;
  const max = 40000;
  const X = (v: number) => 150 + (Math.max(0, v) / max) * 380;

  // The guided walk-through: each step sets the same two controls the learner can press, and moves the spotlight in the picture.
  const cl = WESER.clinics;
  const rt = WESER.retail;
  const c2 = calc("clinics", 2);
  const c10 = calc("clinics", 10);
  const r10 = calc("retail", 10);
  const steps: { seg: WSeg; up: number; focus: Focus; title: string; say: string; look: string }[] = [
    {
      seg: "clinics",
      up: 2,
      focus: "profit",
      title: tt("A small lift does not pay", "Ein kleiner Anstieg lohnt sich nicht"),
      say: tt(
        `Weserdata sells cloud hosting to clinics: about ${cl.proposals} offers a year, ${euro(cl.acv)} for each signed contract. Tailoring its approach costs ${euro(WESER.cost)} every year (the striped bar). If tailoring wins just 2 more deals in every 100 offers, that is ${num(c2.deals, { maximumFractionDigits: 1 })} extra deals and only ${euro(c2.extra)} of extra profit (the dark bar). Weserdata would lose ${euro(-c2.net)}.`,
        `Weserdata verkauft Cloud-Hosting an Kliniken: etwa ${cl.proposals} Angebote im Jahr, ${euro(cl.acv)} pro unterschriebenem Vertrag. Der Zuschnitt seines Ansatzes kostet jedes Jahr ${euro(WESER.cost)} (der schraffierte Balken). Wenn der Zuschnitt nur 2 Abschlüsse mehr pro 100 Angebote bringt, sind das ${num(c2.deals, { maximumFractionDigits: 1 })} zusätzliche Abschlüsse und nur ${euro(c2.extra)} Zusatzgewinn (der dunkle Balken). Weserdata würde ${euro(-c2.net)} verlieren.`,
      ),
      look: tt("the dark bar is far shorter than the striped bar.", "auf den dunklen Balken: Er ist viel kürzer als der schraffierte."),
    },
    {
      seg: "clinics",
      up: 10,
      focus: "net",
      title: tt("A bigger lift pays, just", "Ein größerer Anstieg lohnt sich, knapp"),
      say: tt(
        `Now 10 more deals in every 100 offers: ${num(c10.deals, { maximumFractionDigits: 1 })} extra deals and ${euro(c10.extra)} of extra profit. The dark bar passes the dashed line, so after paying ${euro(WESER.cost)} Weserdata keeps ${euro(c10.net)}. Below about ${num(c10.breakEven, { maximumFractionDigits: 1 })} points it loses money. That point is called break-even.`,
        `Jetzt 10 Abschlüsse mehr pro 100 Angebote: ${num(c10.deals, { maximumFractionDigits: 1 })} zusätzliche Abschlüsse und ${euro(c10.extra)} Zusatzgewinn. Der dunkle Balken überschreitet die gestrichelte Linie, nach ${euro(WESER.cost)} Kosten behält Weserdata also ${euro(c10.net)}. Unter etwa ${num(c10.breakEven, { maximumFractionDigits: 1 })} Punkten verliert es Geld. Dieser Punkt heißt Break-even.`,
      ),
      look: tt("the dark bar crosses the dashed line; the teal line at the bottom says “pays”.", "auf den dunklen Balken: Er überschreitet die gestrichelte Linie; die türkisfarbene Zeile unten sagt „lohnt sich“."),
    },
    {
      seg: "retail",
      up: 10,
      focus: "net",
      title: tt("Same lift, small contracts", "Gleicher Anstieg, kleine Verträge"),
      say: tt(
        `Weserdata's retail segment has ${rt.proposals} offers a year, but each contract is only ${euro(rt.acv)}. The same 10-point lift earns ${euro(r10.extra)}, which is ${euro(-r10.net)} less than the cost. Take-away: tailoring pays where each contract is big; where contracts are small, a good standard offer is usually better. In the task you run this check on DataCloud's numbers. Now try the buttons yourself.`,
        `Das Handelssegment von Weserdata hat ${rt.proposals} Angebote im Jahr, aber jeder Vertrag ist nur ${euro(rt.acv)} wert. Derselbe Anstieg um 10 Punkte bringt ${euro(r10.extra)}, das sind ${euro(-r10.net)} weniger als die Kosten. Merksatz: Der Zuschnitt lohnt sich dort, wo jeder Vertrag groß ist; bei kleinen Verträgen ist ein gutes Standardangebot meist besser. In der Aufgabe führen Sie diese Prüfung mit den Zahlen von DataCloud durch. Probieren Sie jetzt die Schaltflächen selbst aus.`,
      ),
      look: tt("the dark bar ends before the dashed line again, although the lift is the same.", "auf den dunklen Balken: Er endet wieder vor der gestrichelten Linie, obwohl der Anstieg derselbe ist."),
    },
  ];
  const goStep = (i: number | null) => {
    setStory(i);
    if (i === null) return;
    setSeg(steps[i].seg);
    setUplift(steps[i].up);
  };
  const focus: Focus = story === null ? null : steps[story].focus;
  const ring = (y: number, h: number) => <rect x="2" y={y} width="556" height={h} rx="6" fill="none" stroke={C.gold} strokeWidth="2.5" strokeDasharray="6 4" className="anim-pulse" />;
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Extra gross profit from tailoring against its yearly cost", "Zusätzlicher Rohertrag durch Zuschnitt gegen die jährlichen Kosten")}</title>
        <desc id={`${uid}-d`}>{tt(`Extra gross profit ${euro(extra)}, cost ${euro(WESER.cost)}, net ${euroSigned(net)}.`, `Zusätzlicher Rohertrag ${euro(extra)}, Kosten ${euro(WESER.cost)}, netto ${euroSigned(net)}.`)}</desc>
        <defs>
          <pattern id={`${uid}-h`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill={C.soft} />
            <line x1="0" y1="0" x2="0" y2="8" stroke={C.amber} strokeWidth="3" />
          </pattern>
        </defs>
        {focus === "profit" && ring(16, 46)}
        {focus === "cost" && ring(72, 46)}
        {focus === "net" && ring(130, 38)}
        <text x="4" y="42" fontSize="13" fontWeight="700" fill={C.ink}>{tt("Extra gross profit", "Zusatz-Rohertrag")}</text>
        <rect x="150" y="24" width={Math.max(X(extra) - 150, 1)} height="30" fill={C.data} stroke={C.ink} className="anim-grow-x" />
        <text x={X(extra) + 6} y="44" fontSize="13" fontWeight="700" fill={C.ink}>{euro(extra)}</text>
        <text x="4" y="98" fontSize="13" fontWeight="700" fill={C.ink}>{tt("Yearly cost", "Jährliche Kosten")}</text>
        <rect x="150" y="80" width={X(WESER.cost) - 150} height="30" fill={`url(#${uid}-h)`} stroke={C.amber} strokeWidth="1.6" />
        <text x={X(WESER.cost) + 6} y="100" fontSize="13" fontWeight="700" fill={C.ink}>{euro(WESER.cost)}</text>
        <line x1={X(WESER.cost)} x2={X(WESER.cost)} y1="14" y2="120" stroke={C.ink} strokeDasharray="5 4" strokeWidth="1.5" />
        <text x="150" y="146" fontSize="13" fontWeight="700" fill={net >= 0 ? C.teal : C.rust}>{tt(`Net per year: ${euroSigned(net)} ${net >= 0 ? "(pays)" : "(does not pay)"}`, `Netto pro Jahr: ${euroSigned(net)} ${net >= 0 ? "(lohnt sich)" : "(lohnt sich nicht)"}`)}</text>
        <text x="150" y="164" fontSize="11.5" fill={C.ash}>{tt("solid = extra gross profit · hatched = cost of tailoring · dashed = break-even", "voll = Zusatz-Rohertrag · schraffiert = Kosten des Zuschnitts · gestrichelt = Break-even")}</text>
      </svg>
      <Story
        step={story}
        onStep={goStep}
        steps={steps.map((s) => ({ title: s.title, say: s.say, look: s.look }))}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Weserdata segment", "Segment von Weserdata")}</p>
          <Toggles<WSeg>
            label={tt("Segment", "Segment")}
            value={seg}
            onChange={(v) => {
              setStory(null);
              setSeg(v);
              setUplift(null);
            }}
            options={[
              { id: "clinics", label: tt(`Clinics · ${WESER.clinics.proposals} proposals · ${euro(WESER.clinics.acv)}`, `Kliniken · ${WESER.clinics.proposals} Angebote · ${euro(WESER.clinics.acv)}`) },
              { id: "retail", label: tt(`Retail · ${WESER.retail.proposals} proposals · ${euro(WESER.retail.acv)}`, `Handel · ${WESER.retail.proposals} Angebote · ${euro(WESER.retail.acv)}`) },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <p className="smallcaps">{tt("Rise in win rate from tailoring (points)", "Anstieg der Win Rate durch Zuschnitt (Punkte)")}</p>
          <Toggles<string>
            label={tt("Uplift", "Anstieg")}
            value={String(up)}
            onChange={(v) => {
              setStory(null);
              setUplift(Number(v));
            }}
            options={[2, 3, 5, 10].map((v) => ({ id: String(v), label: `+${v}` }))}
          />
          <p className="text-micro normal-case tracking-normal text-ash">{tt("“+5” means 5 more signed deals in every 100 offers.", "„+5“ heißt: 5 unterschriebene Abschlüsse mehr pro 100 Angebote.")}</p>
        </div>
      </div>
      <Insight>
        {tt(
          `In plain words: ${seg === "clinics" ? "clinics" : "retail"} get ${num(now.deals, { maximumFractionDigits: 1 })} extra deals a year at a ${up}-point lift. They bring in ${euro(extra)} of profit and tailoring costs ${euro(WESER.cost)}, so Weserdata ${net >= 0 ? `keeps ${euro(net)}` : `loses ${euro(-net)}`}. It breaks even at about ${num(breakEvenUp, { maximumFractionDigits: 1 })} points. ${seg === "clinics" ? "Few offers, but each contract is large, so a moderate lift already pays." : "Many offers, but each contract is small, so tailoring pays only if the win rate jumps; a good standard offer is usually the better answer."}`,
          `In einfachen Worten: ${seg === "clinics" ? "Kliniken" : "Handel"} bringen bei einem Anstieg um ${up} Punkte ${num(now.deals, { maximumFractionDigits: 1 })} zusätzliche Abschlüsse pro Jahr. Sie bringen ${euro(extra)} Gewinn, und der Zuschnitt kostet ${euro(WESER.cost)}, also ${net >= 0 ? `behält Weserdata ${euro(net)}` : `verliert Weserdata ${euro(-net)}`}. Break-even liegt bei etwa ${num(breakEvenUp, { maximumFractionDigits: 1 })} Punkten. ${seg === "clinics" ? "Wenige Angebote, aber jeder Vertrag ist groß, also lohnt sich schon ein mäßiger Anstieg." : "Viele Angebote, aber jeder Vertrag ist klein, also lohnt sich Zuschnitt nur, wenn die Win Rate springt; ein gutes Standardangebot ist meist die bessere Antwort."}`,
        )}
      </Insight>
      <p className="text-caption text-ash">
        {tt(
          `Pilot results of Weserdata (Case assumption): Clinics ${WESER.clinics.standard}% → ${WESER.clinics.tailored}%, Retail ${WESER.retail.standard}% → ${WESER.retail.tailored}%. At the pilot values the clinics net ${euroSigned(WESER_RESULT.clinics - WESER.cost)} and retail ${euroSigned(WESER_RESULT.retail - WESER.cost)}.`,
          `Pilotergebnisse von Weserdata (Fallannahme): Kliniken ${WESER.clinics.standard} % → ${WESER.clinics.tailored} %, Handel ${WESER.retail.standard} % → ${WESER.retail.tailored} %. Mit den Pilotwerten ergeben die Kliniken netto ${euroSigned(WESER_RESULT.clinics - WESER.cost)} und der Handel ${euroSigned(WESER_RESULT.retail - WESER.cost)}.`,
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ A5 · worked assignment: Weserdata's accounts */

const WS_ACCOUNTS = bi([
  { id: "x1", name: "Klinikum Weserbergland", meta: t("Healthcare · 1,400 staff", "Gesundheitswesen · 1.400 Beschäftigte"), text: t("“Our IT security officer needs the C5 report and the list of subcontractors before the first meeting.”", "„Unser IT-Sicherheitsbeauftragter braucht den C5-Bericht und die Liste der Subunternehmer vor dem ersten Termin.“"), key: t("needs the C5 report and the list of subcontractors", "braucht den C5-Bericht und die Liste der Subunternehmer"), seg: "assure" as SegmentId, alt: "handsoff" as SegmentId, altWhy: t("Nobody asks for the service to be run; they ask for documents to show.", "Niemand fragt danach, den Service betrieben zu bekommen; man fragt nach Unterlagen zum Vorzeigen.") },
  { id: "x2", name: "Autohaus Lange", meta: t("Car dealer · 40 staff", "Autohaus · 40 Beschäftigte"), text: t("“Nobody here knows servers. Can you just make sure it runs?”", "„Hier kennt sich niemand mit Servern aus. Können Sie einfach sorgen, dass es läuft?“"), key: t("Can you just make sure it runs?", "Können Sie einfach sorgen, dass es läuft?"), seg: "handsoff" as SegmentId, alt: "scale" as SegmentId, altWhy: t("Nobody in-house wants control; they want it done.", "Niemand im Haus will Kontrolle; man will es erledigt haben.") },
  { id: "x3", name: "Codewerk Studio", meta: t("Software · 25 staff", "Software · 25 Beschäftigte"), text: t("“We will run a benchmark against two other clouds before we talk.”", "„Wir fahren einen Benchmark gegen zwei andere Clouds, bevor wir reden.“"), key: t("run a benchmark against two other clouds", "fahren einen Benchmark gegen zwei andere Clouds"), seg: "scale" as SegmentId, alt: "handsoff" as SegmentId, altWhy: t("Small, but its own engineers want to test and compare.", "Klein, aber die eigenen Engineers wollen testen und vergleichen.") },
  { id: "x4", name: "Hanse Versicherungsmakler", meta: t("Insurance broker · 60 staff", "Versicherungsmakler · 60 Beschäftigte"), text: t("“Our auditor asks where client files are stored. We need that in writing.”", "„Unser Prüfer fragt, wo Kundenakten gespeichert sind. Das brauchen wir schriftlich.“"), key: t("Our auditor asks where client files are stored", "Unser Prüfer fragt, wo Kundenakten gespeichert sind"), seg: "assure" as SegmentId, alt: "handsoff" as SegmentId, altWhy: t("Small, but it needs proof for an auditor, not someone to run it.", "Klein, aber es braucht Nachweise für einen Prüfer, nicht jemanden, der betreibt.") },
  { id: "x5", name: "Sonnenkorn Backstuben", meta: t("Bakery chain · 300 staff", "Bäckereikette · 300 Beschäftigte"), text: t("“We want one monthly price and one person to call. Our shops cannot wait for tickets.”", "„Wir wollen einen Monatspreis und eine Person zum Anrufen. Unsere Filialen können nicht auf Tickets warten.“"), key: t("one monthly price and one person to call", "einen Monatspreis und eine Person zum Anrufen"), seg: "handsoff" as SegmentId, alt: "scale" as SegmentId, altWhy: t("Larger, but it wants less to operate, not more control.", "Größer, aber es will weniger betreiben, nicht mehr Kontrolle.") },
  { id: "x6", name: "Logistikzentrum Nord", meta: t("Logistics · 700 staff", "Logistik · 700 Beschäftigte"), text: t("“Our platform team wants to automate everything with Terraform and test the API first.”", "„Unser Plattformteam will alles mit Terraform automatisieren und zuerst die API testen.“"), key: t("automate everything with Terraform and test the API first", "alles mit Terraform automatisieren und zuerst die API testen"), seg: "scale" as SegmentId, alt: "assure" as SegmentId, altWhy: t("Nothing is to be proven to a third party; the team wants control.", "Nichts muss einer dritten Stelle nachgewiesen werden; das Team will Kontrolle.") },
]);

function Marked({ text, mark }: { text: string; mark: string }) {
  const i = text.indexOf(mark);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-gold/40 px-0.5 font-semibold text-ink">{mark}</mark>
      {text.slice(i + mark.length)}
    </>
  );
}

export function AssignExample() {
  const [sel, setSel] = useState("x1");
  const [seen, setSeen] = useState<string[]>(["x1"]);
  const w = WS_ACCOUNTS.find((x) => x.id === sel)!;
  const pick = (id: string) => {
    setSel(id);
    setSeen((s) => (s.includes(id) ? s : [...s, id]));
  };
  return (
    <Diagram label={tt("Worked example · six accounts of Weserdata, another provider (Case assumption, read-only)", "Durchgerechnetes Beispiel · sechs Accounts von Weserdata, einem anderen Anbieter (Fallannahme, nur lesen)")}>
      <ol className="grid gap-2 sm:grid-cols-2">
        {WS_ACCOUNTS.map((n) => {
          const on = n.id === sel;
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => pick(n.id)}
                aria-pressed={on}
                className={clsx("flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border bg-paper px-3 py-2 text-left text-caption transition-colors", on ? "border-accent bg-accentSoft ring-2 ring-gold" : "border-line hover:border-ash")}
              >
                <span className="smallcaps">{`${n.name} · ${n.meta}`}</span>
                <span className="text-ink">{n.text}</span>
                {seen.includes(n.id) && <span className="pill border-signal/50 bg-signalSoft text-signal">{SEGMENTS[n.seg].label}</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 space-y-1.5 rounded-lg border border-line bg-paper p-3 text-caption" aria-live="polite">
        <p className="smallcaps">
          {tt("Segment: ", "Segment: ")}
          <span className="text-accent">{SEGMENTS[w.seg].label}</span>
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("The words that decide it. ", "Die Worte, die entscheiden. ")}</span>
          <Marked text={w.text} mark={w.key} />
        </p>
        <p>
          <span className="font-semibold text-ink">{tt("The test question. ", "Die Testfrage. ")}</span>
          {SEGMENTS[w.seg].test}
        </p>
        <p>
          <span className="font-semibold text-ink">{tt(`Why not ${SEGMENTS[w.alt].label}? `, `Warum nicht ${SEGMENTS[w.alt].label}? `)}</span>
          {w.altWhy}
        </p>
      </div>
      <Insight className="mt-3">
        {tt(
          `Each note is settled by one phrase, the highlighted one, and by asking the test question of the segment it points to. The size in the heading never decides: a 60-person broker is Compliance-first and a 300-person bakery chain is Hands-off. You have opened ${seen.length} of 6.`,
          `Jede Notiz wird von einer Wendung entschieden, der markierten, und von der Testfrage des Segments, auf das sie zeigt. Die Größe in der Überschrift entscheidet nie: Ein Makler mit 60 Beschäftigten ist Compliance-first, eine Bäckereikette mit 300 ist Hands-off. Sie haben ${seen.length} von 6 geöffnet.`,
        )}
      </Insight>
    </Diagram>
  );
}

/* ------------------------------------------------------------------ A6 · count or value? */

const W_SEGS = bi([
  { id: "clinics", name: t("Clinics", "Kliniken"), accounts: 3, acv: 150000 },
  { id: "retail", name: t("Retail", "Handel"), accounts: 5, acv: 60000 },
  { id: "soft", name: t("Software", "Software"), accounts: 2, acv: 110000 },
]);

export function ValueExample() {
  const uid = useId().replace(/:/g, "");
  const [by, setBy] = useState<"count" | "value">("count");
  const rows = [...W_SEGS].sort((a, b) => (by === "count" ? b.accounts - a.accounts : b.acv - a.acv));
  const X = (v: number) => 140 + (by === "count" ? (v / 6) * 360 : (v / 180000) * 360);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 160" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Weserdata's three segments ranked by accounts or by potential contract value", "Die drei Segmente von Weserdata, geordnet nach Accounts oder nach potenziellem Vertragswert")}</title>
        <desc id={`${uid}-d`}>{rows.map((r) => `${r.name}: ${r.accounts}, ${euro(r.acv)}`).join(". ")}</desc>
        {rows.map((r, i) => {
          const y = 12 + i * 44;
          const v = by === "count" ? r.accounts : r.acv;
          return (
            <g key={r.id}>
              <text x="4" y={y + 21} fontSize="13.5" fontWeight="700" fill={C.ink}>{r.name}</text>
              <rect x="140" y={y + 4} width={X(v) - 140} height="26" fill={by === "count" ? C.grey : C.data} stroke={C.ink} className="anim-grow-x" />
              <text x={X(v) + 6} y={y + 22} fontSize="12.5" fontWeight="700" fill={C.ink}>
                {by === "count" ? tt(`${r.accounts} accounts`, `${r.accounts} Accounts`) : `${euro(r.acv)} · ${VALUE_LABEL[valueOf(r.acv)]}`}
              </text>
            </g>
          );
        })}
        <text x="140" y="154" fontSize="11.5" fill={C.ash}>{by === "count" ? tt("grey = number of accounts in the sample", "grau = Zahl der Accounts in der Stichprobe") : tt("teal-dark = sum of potential annual contract value", "dunkel = Summe des potenziellen Jahresvertragswerts")}</text>
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Rank the segments by", "Segmente ordnen nach")}</p>
        <Toggles<"count" | "value">
          label={tt("Ranking basis", "Grundlage der Rangfolge")}
          value={by}
          onChange={setBy}
          options={[
            { id: "count", label: tt("Number of accounts", "Zahl der Accounts") },
            { id: "value", label: tt("Potential contract value", "Potenzieller Vertragswert") },
          ]}
        />
      </div>
      <Insight>
        {by === "count"
          ? tt(
              "By count, Retail leads with 5 of the 10 accounts. A team that ranks by count would put most of its effort there, into the smallest contracts.",
              "Nach Anzahl führt der Handel mit 5 von 10 Accounts. Ein Team, das nach Anzahl ordnet, würde den Großteil seiner Mühe dorthin stecken, in die kleinsten Verträge.",
            )
          : tt(
              `By value, the order turns round: Clinics ${euro(150000)} (${VALUE_LABEL.high}), Software ${euro(110000)} (${VALUE_LABEL.mid}), Retail ${euro(60000)} (${VALUE_LABEL.low}). The segment with the most accounts is worth the least. Business value, not size of the list, decides where personalising starts.`,
              `Nach Wert dreht sich die Reihenfolge: Kliniken ${euro(150000)} (${VALUE_LABEL.high}), Software ${euro(110000)} (${VALUE_LABEL.mid}), Handel ${euro(60000)} (${VALUE_LABEL.low}). Das Segment mit den meisten Accounts ist am wenigsten wert. Der Geschäftswert, nicht die Länge der Liste, entscheidet, wo Personalisierung beginnt.`,
            )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A7 · scoring: Weserdata's three measures */

type EM = { id: string; name: string; cost: number; reach: number; rel: 1 | 2 | 3; dif: 1 | 2 | 3 };
const BUD_W = 60000;

export function ScoreExample() {
  const uid = useId().replace(/:/g, "");
  const start = (): EM[] => [
    { id: "p", name: tt("Clinic audit folder", "Prüfordner für Kliniken"), cost: 24000, reach: 15, rel: 3, dif: 3 },
    { id: "q", name: tt("Retail care package", "Betreuungspaket für den Handel"), cost: 18000, reach: 50, rel: 1, dif: 2 },
    { id: "r", name: tt("Individual proposals", "Individuelle Angebote"), cost: 40000, reach: 8, rel: 2, dif: 2 },
  ];
  const [rows, setRows] = useState<EM[]>(start);
  const [inc, setInc] = useState<string[]>(["p", "q", "r"]);
  const cycle = (id: string, f: "rel" | "dif") => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [f]: ((r[f] % 3) + 1) as 1 | 2 | 3 } : r)));
  const toggle = (id: string) => setInc((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const scored = rows.map((r) => {
    const per = r.cost / r.reach;
    const ev = evBucket(per);
    return { ...r, per, ev, score: r.rel * r.dif * ev };
  });
  const chosen = scored.filter((r) => inc.includes(r.id));
  const total = chosen.reduce((s, r) => s + r.cost, 0);
  const over = total - BUD_W;
  const lowest = [...chosen].sort((a, b) => a.score - b.score)[0];
  const S = (v: number) => 8 + (v / (BUD_W * 1.5)) * 544;
  let acc = 0;
  return (
    <div className="space-y-3">
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[38rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Three measures of Weserdata scored on relevance, differentiation and economic viability", "Drei Maßnahmen von Weserdata, bewertet nach Relevanz, Differenzierung und Wirtschaftlichkeit")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("In the plan", "Im Plan")}</th>
              <th className="px-3 py-2">{tt("Measure", "Maßnahme")}</th>
              <th className="px-3 py-2">{tt("Cost · reach", "Kosten · Reichweite")}</th>
              <th className="px-3 py-2">{tt("Relevance", "Relevanz")}</th>
              <th className="px-3 py-2">{tt("Differentiation", "Differenzierung")}</th>
              <th className="px-3 py-2">{tt("Econ. viability", "Wirtschaftl.")}</th>
              <th className="px-3 py-2 text-right">{tt("Score", "Wert")}</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((r) => (
              <tr key={r.id} className={clsx("border-t border-line align-top", !inc.includes(r.id) && "opacity-60")}>
                <td className="px-3 py-2">
                  <input type="checkbox" checked={inc.includes(r.id)} onChange={() => toggle(r.id)} aria-label={tt(`Include ${r.name}`, `${r.name} aufnehmen`)} className="h-5 w-5 accent-[#8A5A0B]" />
                </td>
                <td className="px-3 py-2 font-semibold">{r.name}</td>
                <td className="tnum px-3 py-2">
                  {euro(r.cost)} · {r.reach} {tt("accts", "Accts")}
                  <br />
                  <span className="text-ash">= {euro(r.per)} {tt("per account", "pro Account")}</span>
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "rel")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={tt(`Relevance of ${r.name}: ${r.rel}. Click to change.`, `Relevanz von ${r.name}: ${r.rel}. Klicken zum Ändern.`)}>
                    {r.rel}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "dif")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={tt(`Differentiation of ${r.name}: ${r.dif}. Click to change.`, `Differenzierung von ${r.name}: ${r.dif}. Klicken zum Ändern.`)}>
                    {r.dif}
                  </button>
                </td>
                <td className="tnum px-3 py-2">{r.ev}</td>
                <td className="tnum px-3 py-2 text-right font-bold">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <svg viewBox="0 0 560 84" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt(`Budget check against ${euro(BUD_W)}`, `Budgetprüfung gegen ${euro(BUD_W)}`)}</title>
        <desc id={`${uid}-d`}>{tt(`${chosen.length} measures cost ${euro(total)}.`, `${chosen.length} Maßnahmen kosten ${euro(total)}.`)}</desc>
        <defs>
          <pattern id={`${uid}-over`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill={C.soft} />
            <line x1="0" y1="0" x2="0" y2="7" stroke={C.amber} strokeWidth="2.8" />
          </pattern>
        </defs>
        <rect x={S(0)} y="22" width={S(BUD_W * 1.5) - S(0)} height="30" fill={C.mist} stroke={C.line} />
        {chosen.map((r, i) => {
          const from = acc;
          acc += r.cost;
          return <rect key={r.id} x={S(from)} y="22" width={S(acc) - S(from)} height="30" fill={i % 2 ? C.grey : C.data} stroke={C.ink} />;
        })}
        {over > 0 && <rect x={S(BUD_W)} y="22" width={S(total) - S(BUD_W)} height="30" fill={`url(#${uid}-over)`} stroke={C.amber} strokeWidth="1.6" />}
        <line x1={S(BUD_W)} x2={S(BUD_W)} y1="12" y2="62" stroke={C.ink} strokeWidth="2.2" />
        <text x={S(BUD_W)} y="9" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.ink}>{`Budget ${euro(BUD_W)}`}</text>
        <text x="8" y="78" fontSize="12" fill={C.ash}>{`Plan ${euro(total)}`}</text>
        {over > 0 && <text x="552" y="78" textAnchor="end" fontSize="12.5" fontWeight="700" fill={C.amber}>{tt(`${euro(over)} over`, `${euro(over)} darüber`)}</text>}
      </svg>
      <Insight>
        {over > 0
          ? tt(`The plan costs ${euro(total)}, ${euro(over)} over the ${euro(BUD_W)} budget. Leave out the measure with the lowest score: ${lowest ? `“${lowest.name}” with ${lowest.score}` : "none"}. `, `Der Plan kostet ${euro(total)}, ${euro(over)} über dem Budget von ${euro(BUD_W)}. Lassen Sie die Maßnahme mit dem niedrigsten Wert weg: ${lowest ? `„${lowest.name}“ mit ${lowest.score}` : "keine"}. `)
          : tt(`The plan costs ${euro(total)} and fits the ${euro(BUD_W)} budget. `, `Der Plan kostet ${euro(total)} und passt ins Budget von ${euro(BUD_W)}. `)}
        {tt(
          "Economic viability follows from the printed cost and reach, so you do not judge it: the individual proposals cost €5,000 per account and score 1, however relevant they are. The care package is cheap per account but serves the Low-value segment, so its relevance is 1.",
          "Die Wirtschaftlichkeit folgt aus den gedruckten Kosten und der Reichweite, Sie beurteilen sie also nicht: Die individuellen Angebote kosten 5.000 € pro Account und erzielen 1, egal wie relevant sie sind. Das Betreuungspaket ist pro Account günstig, bedient aber das Segment mit niedrigem Wert, also ist seine Relevanz 1.",
        )}
      </Insight>
    </div>
  );
}

export { pct };
