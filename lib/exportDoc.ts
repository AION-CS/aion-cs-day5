import { ACCOUNTS, GAP_BY_ID, STATUS_LABEL } from "@/data/accounts";
import { CRIT_LABEL, FIELDS } from "@/data/criteria";
import { BUDGET, MEASURE_BY_ID } from "@/data/measures";
import { CONTENTS, SEGMENTS, SEGMENT_IDS, VALUE_LABEL } from "@/data/segments";
import { BASIS_LABEL, DIFF_QUESTION, TG_QUESTION } from "@/data/sketches";
import { DATACLOUD } from "@/data/tailoring";
import { ARCH, ARCH_BY_ID, ARCH_IDS, CAND_BY_ID, CAND_IDS, CRITERIA, DECISIONS, ELEMENTS, ELEMENT_IDS, KPI_BY_ID, LEVELS, OWNERS, R2_BUDGET, R2_MONTHS, ROLES, SALES_MODELS, costPerDeal, tailorLimit } from "@/data/route2";
import { archCost, archLeft, coverage, funded, measureScore, ownValue, servedIds, tailorCost, tallyOf, totalCost } from "@/lib/checks";
import { euro, getLang, num, pct, tt } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";
import { COURSE } from "@/lib/routes";
import { esc } from "@/lib/svg";
import type { Persisted } from "@/store/useStore";

/**
 * Each exported document is built here as a self-contained HTML string (inline CSS + inline SVG), in the active language. The
 * on-screen "Preview of your ..." renders this same body, so what the participant reads is what they download. It never prints
 * answer keys, ticks, crosses or scores (a measure's relevance × differentiation × economic viability is the learner's own priority
 * score, not a mark).
 */

export const DOC_CSS = `
.doc{font-family:Georgia,Cambria,"Times New Roman",serif;color:#1F2328;background:#FFFEFA;line-height:1.5;font-size:14px}
.doc *{box-sizing:border-box}
.doc h1{font-size:22px;margin:0 0 4px;font-weight:600}
.doc h2{font-size:15px;margin:22px 0 8px;padding-bottom:4px;border-bottom:1px solid #D8D1BF;font-weight:600;letter-spacing:.01em}
.doc h3{font-size:13.5px;margin:14px 0 4px;font-weight:600}
.doc .meta{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;margin:12px 0 4px;font-family:system-ui,sans-serif;font-size:12.5px}
.doc .meta dt{color:#59606A}.doc .meta dd{margin:0}
.doc .kicker{font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A5A0B}
.doc table{width:100%;border-collapse:collapse;font-size:12.5px;font-family:system-ui,sans-serif}
.doc th{text-align:left;font-weight:600;color:#59606A;border-bottom:1px solid #59606A;padding:4px 8px 4px 0;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.doc td{border-bottom:1px solid #ECE6D6;padding:6px 8px 6px 0;vertical-align:top}
.doc td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.doc td.id{font-weight:700}
.doc table{table-layout:auto}.doc td,.doc th{overflow-wrap:anywhere}
.doc blockquote{margin:6px 0;padding:6px 12px;border-left:3px solid #D99A2B;background:#FBF0D6}
.doc .muted{color:#59606A}
.doc .foot{margin-top:26px;padding-top:8px;border-top:1px solid #59606A;font-family:system-ui,sans-serif;font-size:12px;color:#59606A}
.doc .legend{font-family:system-ui,sans-serif;font-size:11.5px;color:#59606A;margin:4px 0 0}
.doc svg{display:block;margin:8px 0}
@media print{.doc{font-size:12px}.doc h2{break-after:avoid}.doc table,.doc svg,.doc blockquote{break-inside:avoid}}
`;

const dateLabel = () => new Date().toLocaleDateString(getLang() === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

function header(title: string, level: string, p: Persisted): string {
  return `
<div class="kicker">${esc(COURSE.course)} · ${esc(COURSE.company)}</div>
<h1>${esc(title)}</h1>
<dl class="meta">
  <dt>${esc(tt("Course", "Kurs"))}</dt><dd>${esc(COURSE.course)} · ${esc(tt(`Day ${COURSE.day}`, `Tag ${COURSE.day}`))}</dd>
  <dt>${esc(tt("Position", "Einordnung"))}</dt><dd>${esc(level)}</dd>
  <dt>${esc(tt("Participant", "Teilnehmer/in"))}</dt><dd>${esc(p.participant.name.trim() || "—")}</dd>
  <dt>${esc(tt("Date", "Datum"))}</dt><dd>${esc(dateLabel())}</dd>
</dl>`;
}

const para = (s: string) => `<blockquote>${esc(s.trim()) || "—"}</blockquote>`;
const cell = (s: string) => esc(s.trim()) || "—";

export function wrapDocument(title: string, body: string): string {
  return `<!doctype html>
<html lang="${getLang()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>body{margin:0;background:#F3EFE4}.sheet{max-width:820px;margin:0 auto;padding:36px 40px;background:#FFFEFA}@media print{body{background:#fff}.sheet{padding:0;max-width:none}@page{margin:16mm}}${DOC_CSS}</style>
</head><body><div class="sheet"><div class="doc">${body}</div></div></body></html>`;
}

export function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Opens the same document in a new window and prints it (no PDF library). Falls back to a hidden frame if pop-ups are blocked. */
export function printDocument(title: string, html: string) {
  const win = window.open("", "_blank");
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.document.title = title;
    win.focus();
    window.setTimeout(() => win.print(), 250);
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.appendChild(iframe);
  const w = iframe.contentWindow;
  if (!w) return iframe.remove();
  w.document.open();
  w.document.write(html);
  w.document.close();
  window.setTimeout(() => {
    w.focus();
    w.print();
    window.setTimeout(() => iframe.remove(), 1000);
  }, 250);
}

/* ------------------------------------------------------------------ Route 1 · the Segment Analysis File */

/** Bars of the learner's own tally: potential contract value per segment, as an inline SVG. */
function tallySvg(p: Persisted): string {
  const t = tallyOf(p.l1.assign);
  const W = 560;
  const rowH = 28;
  const max = Math.max(250000, ...SEGMENT_IDS.map((s) => t.acv[s]));
  const rows = SEGMENT_IDS.map((s, i) => {
    const y = 8 + i * rowH;
    const w = (t.acv[s] / max) * 300;
    return `<text x="0" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(SEGMENTS[s].label)}</text>
<rect x="130" y="${y}" width="${Math.max(w, 1.5).toFixed(1)}" height="16" fill="#2F5D62" stroke="#1F2328"/>
<text x="${(136 + w).toFixed(1)}" y="${y + 13}" font-size="11.5" fill="#1F2328" font-family="system-ui,sans-serif">${esc(`${t.count[s]} · ${euro(t.acv[s])} · ${VALUE_LABEL[ownValue(s, t)]}`)}</text>`;
  }).join("\n");
  const H = 8 + SEGMENT_IDS.length * rowH;
  const title = tt("Accounts and potential contract value per segment, as you assigned them", "Accounts und potenzieller Vertragswert pro Segment, wie Sie sie zugeordnet haben");
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${rows}</svg>`;
}

export function segmentBody(p: Persisted): string {
  const { l1 } = p;
  const sortRows = FIELDS.map((f, i) => `<tr><td class="id">${i + 1}</td><td>${esc(f.text)}</td><td>${l1.sort[f.id] ? esc(CRIT_LABEL[l1.sort[f.id]!]) : "—"}</td></tr>`).join("");
  const sortNote = l1.sortReasoning ? `<p class="legend">${esc(tt(`The reasoning for the sort was opened after ${l1.sortChecks} checks.`, `Die Begründung zur Sortierung wurde nach ${l1.sortChecks} Prüfungen geöffnet.`))}</p>` : "";
  const fig = (v: string) => (v.trim() ? esc(v.trim()) : "—");
  const figTable = `<table><thead><tr><th>${esc(tt("Figure", "Wert"))}</th><th class="num">${esc(tt("Your figure (€ per year)", "Ihr Wert (€ pro Jahr)"))}</th></tr></thead><tbody>
<tr><td class="id">${esc(tt("F1 · Extra gross profit, Compliance-first", "F1 · Zusätzlicher Rohertrag, Compliance-first"))}</td><td class="num">${fig(l1.fig.F1)}</td></tr>
<tr><td class="id">${esc(tt("F2 · Extra gross profit, Hands-off", "F2 · Zusätzlicher Rohertrag, Hands-off"))}</td><td class="num">${fig(l1.fig.F2)}</td></tr>
<tr><td class="id">${esc(tt("F3 · Net result, Hands-off", "F3 · Nettoergebnis, Hands-off"))}</td><td class="num">${fig(l1.fig.F3)}</td></tr></tbody></table>
<p class="legend">${esc(tt(`As briefed (pilot, Case assumption): Compliance-first ${DATACLOUD.assure.proposals} proposals, ${DATACLOUD.assure.standard}% → ${DATACLOUD.assure.tailored}%, ${euro(DATACLOUD.assure.acv)}; Hands-off ${DATACLOUD.handsoff.proposals} proposals, ${DATACLOUD.handsoff.standard}% → ${DATACLOUD.handsoff.tailored}%, ${euro(DATACLOUD.handsoff.acv)}; margin ${DATACLOUD.margin}%; yearly cost ${euro(DATACLOUD.cost)} per segment.`, `Laut Auftrag (Pilot, Fallannahme): Compliance-first ${DATACLOUD.assure.proposals} Angebote, ${DATACLOUD.assure.standard} % → ${DATACLOUD.assure.tailored} %, ${euro(DATACLOUD.assure.acv)}; Hands-off ${DATACLOUD.handsoff.proposals} Angebote, ${DATACLOUD.handsoff.standard} % → ${DATACLOUD.handsoff.tailored} %, ${euro(DATACLOUD.handsoff.acv)}; Marge ${DATACLOUD.margin} %; jährliche Kosten ${euro(DATACLOUD.cost)} pro Segment.`))}</p>`;
  const tgLabel = TG_QUESTION.options.find((o) => o.id === l1.tg)?.label ?? "—";
  const diffLabel = DIFF_QUESTION.options.find((o) => o.id === l1.diff)?.label ?? "—";
  const sketches = l1.sketches.map((s, i) => `<h3>${esc(tt(`Sketch ${i + 1}`, `Skizze ${i + 1}`))} · ${s.basis ? esc(BASIS_LABEL[s.basis]) : "—"}</h3>${para(s.text)}`).join("");
  const assignRows = ACCOUNTS.map((a) => `<tr><td class="id">${esc(a.name)}</td><td>${esc(a.sector)} · ${num(a.staff)} · ${esc(STATUS_LABEL[a.status])}</td><td class="num">${esc(euro(a.acv))}</td><td>${l1.assign[a.id] ? esc(SEGMENTS[l1.assign[a.id]!].label) : "—"}</td></tr>`).join("");
  const assignNote = l1.assignReasoning ? `<p class="legend">${esc(tt(`The reasoning for the assignment was opened after ${l1.assignChecks} checks.`, `Die Begründung zur Zuordnung wurde nach ${l1.assignChecks} Prüfungen geöffnet.`))}</p>` : "";
  const profRows = SEGMENT_IDS.map((s) => {
    const pr = l1.profiles[s];
    return `<tr><td class="id">${esc(SEGMENTS[s].label)}</td><td>${pr.value ? esc(VALUE_LABEL[pr.value]) : "—"}</td><td>${cell(pr.need)}</td><td>${pr.content ? esc(CONTENTS[pr.content].label) : "—"}</td></tr>`;
  }).join("");
  const gapList = l1.gaps.length ? `<ul>${l1.gaps.map((g) => `<li>${esc(GAP_BY_ID[g].label)}</li>`).join("")}</ul>` : `<p class="muted">—</p>`;
  const chosen = l1.chosen;
  const measureRows = chosen
    .map((id) => {
      const m = MEASURE_BY_ID[id];
      const aims = l1.aims[id];
      return `<tr><td class="id">${esc(m.name)}</td><td>${aims === undefined ? "—" : aims.length ? esc(aims.map((a) => SEGMENTS[a].label).join(", ")) : esc(tt("none of the three", "keinem der drei"))}</td><td class="num">${l1.rel[id] || "—"} × ${l1.dif[id] || "—"} × ${l1.eco[id] || "—"} = ${measureScore(l1, id) || "—"}</td><td class="num">${esc(euro(m.cost))} · ${m.reach}</td></tr>`;
    })
    .join("");
  const cov = coverage(l1);
  const covLine = chosen.length
    ? tt(`Segments at least one chosen measure serves: ${cov.filter((c) => c.covered).length} of 3${cov.some((c) => !c.covered) ? ` (not served: ${cov.filter((c) => !c.covered).map((c) => SEGMENTS[c.segment].label).join(", ")})` : ""}.`, `Segmente, denen mindestens eine gewählte Maßnahme dient: ${cov.filter((c) => c.covered).length} von 3${cov.some((c) => !c.covered) ? ` (nicht bedient: ${cov.filter((c) => !c.covered).map((c) => SEGMENTS[c.segment].label).join(", ")})` : ""}.`)
    : "";
  const cost = totalCost(chosen);
  const order = l1.order.filter((id) => chosen.includes(id));

  return `${header("Segment Analysis File", tt("Levels 1 and 2 · Knowledge and application", "Level 1 und 2 · Wissen und Anwendung"), p)}
<h2>${esc(tt("The case", "Der Fall"))}</h2>
<p>${esc(tt("DataCloud Services GmbH, a German cloud provider for the Mittelstand: offers appear generic, the conversion rate is low, customers do not feel understood. Budget €120,000, time 5 months. Evidence in the file: nine CRM fields, a six-month pilot and twelve accounts.", "DataCloud Services GmbH, ein deutscher Cloud-Anbieter für den Mittelstand: Angebote wirken generisch, die Conversion Rate ist niedrig, Kunden fühlen sich nicht verstanden. Budget 120.000 €, Zeit 5 Monate. Evidenz in der Datei: neun CRM-Felder, ein sechsmonatiger Pilot und zwölf Accounts."))}</p>

<h2>${esc(tt("Part 1 · Understand the landscape", "Teil 1 · Die Landschaft verstehen"))}</h2>
<h3>${esc(tt("1.1 · The CRM fields, sorted by kind of criterion", "1.1 · Die CRM-Felder, nach Art des Kriteriums sortiert"))}</h3>
<table><thead><tr><th>#</th><th>${esc(tt("Field", "Feld"))}</th><th>${esc(tt("Your tag", "Ihre Einordnung"))}</th></tr></thead><tbody>${sortRows}</tbody></table>${sortNote}
<h3>${esc(tt("A criterion of my own", "Ein eigenes Kriterium"))}</h3>${para(l1.extraCrit)}
<h3>${esc(tt("1.2 · Is tailoring worth it?", "1.2 · Lohnt sich der Zuschnitt?"))}</h3>
${figTable}
${para(l1.worth)}
<h2>${esc(tt("1.3 · Target group, differences, segment sketches", "1.3 · Zielgruppe, Unterschiede, Segmentskizzen"))}</h2>
<p><strong>${esc(tt("The strategy paper names:", "Das Strategiepapier nennt:"))}</strong> ${esc(tgLabel)}</p>
<p><strong>${esc(tt("The accounts differ most in:", "Die Accounts unterscheiden sich am stärksten:"))}</strong> ${esc(diffLabel)}</p>
${sketches}
<h2>${esc(tt("1.4 · Coaching reflection", "1.4 · Coaching-Reflexion"))}</h2>
<h3>${esc(tt("Where did I oversimplify?", "Wo habe ich vereinfacht?"))}</h3>${para(l1.reflect.simplify)}
<h3>${esc(tt("When does personalising make sense, and when not?", "Wann ist Personalisierung sinnvoll, und wann nicht?"))}</h3>${para(l1.reflect.worth)}
<h3>${esc(tt("How would a strategic decision-maker prioritise?", "Wie würde eine strategische Entscheiderin priorisieren?"))}</h3>${para(l1.reflect.prioritise)}

<h2>${esc(tt("Part 2 · Analyse and act", "Teil 2 · Analysieren und handeln"))}</h2>
<h3>${esc(tt("2.1 · The twelve accounts, as you assigned them", "2.1 · Die zwölf Accounts, wie Sie sie zugeordnet haben"))}</h3>
<table><thead><tr><th>${esc(tt("Account", "Account"))}</th><th>${esc(tt("Sector · staff · status", "Branche · Beschäftigte · Status"))}</th><th class="num">${esc(tt("Potential", "Potenzial"))}</th><th>${esc(tt("Segment", "Segment"))}</th></tr></thead><tbody>${assignRows}</tbody></table>${assignNote}
${tallySvg(p)}
<p class="legend">${esc(tt("Value rule: €150,000 or more High, €100,000 to €149,999 Mid, less Low. Sums follow your own assignment.", "Wertregel: 150.000 € oder mehr Hoch, 100.000 bis 149.999 € Mittel, weniger Niedrig. Die Summen folgen Ihrer eigenen Zuordnung."))}</p>
<h2>${esc(tt("2.2 · The three segment profiles", "2.2 · Die drei Segmentprofile"))}</h2>
<table><thead><tr><th>${esc(tt("Segment", "Segment"))}</th><th>${esc(tt("Value", "Wert"))}</th><th>${esc(tt("What they need and how they decide", "Was sie brauchen und wie sie entscheiden"))}</th><th>${esc(tt("What to personalise", "Was personalisiert wird"))}</th></tr></thead><tbody>${profRows}</tbody></table>
<h3>${esc(tt("What the file does not tell you", "Was die Datei nicht verrät"))}</h3>${gapList}
<h3>${esc(tt("A risk of a wrong segmentation, and its sign", "Ein Risiko falscher Segmentierung, und sein Anzeichen"))}</h3>${para(l1.riskText)}
<h2>${esc(tt("2.3 · Three measures, scored and ordered", "2.3 · Drei Maßnahmen, bewertet und geordnet"))}</h2>
<table><thead><tr><th>${esc(tt("Measure", "Maßnahme"))}</th><th>${esc(tt("Serves", "Dient"))}</th><th class="num">${esc(tt("Relevance × Differentiation × Economic viability", "Relevanz × Differenzierung × Wirtschaftlichkeit"))}</th><th class="num">${esc(tt("Cost · accounts", "Kosten · Accounts"))}</th></tr></thead><tbody>${measureRows || `<tr><td colspan="4">—</td></tr>`}</tbody></table>
<p class="legend">${esc(tt(`Total cost ${euro(cost)} of the ${euro(BUDGET)} budget${cost > BUDGET ? ` (${euro(cost - BUDGET)} over)` : ""}.`, `Gesamtkosten ${euro(cost)} vom Budget von ${euro(BUDGET)}${cost > BUDGET ? ` (${euro(cost - BUDGET)} darüber)` : ""}.`))} ${esc(covLine)}</p>
<h3>${esc(tt("Priority order", "Reihenfolge"))}</h3>
<ol>${order.map((id) => `<li>${esc(MEASURE_BY_ID[id].name)}</li>`).join("") || "<li>—</li>"}</ol>
${para(l1.why)}

<div class="foot">${esc(tt(`Checks requested: ${l1.checks}`, `Angeforderte Prüfungen: ${l1.checks}`))}<br/>${esc(tt(`Generated ${dateLabel()}.`, `Erstellt am ${dateLabel()}.`))}</div>`;
}

/* ------------------------------------------------------------------ Route 2 · the Segment Strategy Memo */

/** The Level 3 memo. The on-screen live preview and the exported file are both built by this function. */
export function memoBody(p: Persisted): string {
  const { l1, r2 } = p;
  const name = p.participant.name.trim();
  const rated = SEGMENT_IDS.filter((s) => l1.profiles[s].value).map((s) => `${SEGMENTS[s].label} (${VALUE_LABEL[l1.profiles[s].value!]})`);
  const situation =
    rated.length || l1.chosen.length
      ? `<blockquote><strong>${esc(tt("Where Route 1 left off.", "Wo Route 1 aufgehört hat."))}</strong> ${esc(tt("Segment values:", "Segmentwerte:"))} ${esc(rated.join(", ") || "—")}. ${esc(tt("Measures chosen:", "Gewählte Maßnahmen:"))} ${esc(l1.chosen.map((id) => MEASURE_BY_ID[id].name).join(", ") || "—")}.</blockquote>`
      : `<p class="muted">${esc(tt("Route 1 is not finished, so there is nothing to quote yet. Nothing is blocked.", "Route 1 ist nicht fertig, daher gibt es noch nichts zu zitieren. Nichts ist gesperrt."))}</p>`;
  const critRows = r2.crits.map((c) => `<tr><td class="id">${esc(CRITERIA[c].name)}</td><td>${cell(r2.critText[c] ?? "")}</td></tr>`).join("");
  const B = ["—", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")];
  const rateRows = CAND_IDS.map((id) => `<tr><td class="id">${esc(CAND_BY_ID[id].name)}</td><td>${esc(B[r2.attract[id] || 0])}</td><td>${esc(B[r2.ability[id] || 0])}</td><td>${r2.roles[id] ? esc(ROLES[r2.roles[id]!].label) : "—"}</td></tr>`).join("");
  const served = servedIds(r2);
  const salesRows = served
    .map((id) => {
      const m = r2.sales[id];
      const share = m ? (costPerDeal(m, CAND_BY_ID[id].acv) / CAND_BY_ID[id].acv) * 100 : null;
      return `<tr><td class="id">${esc(CAND_BY_ID[id].name)}</td><td>${m ? esc(SALES_MODELS[m].name) : "—"}${share !== null ? ` <span class="muted">(${esc(pct(Math.round(share)))})</span>` : ""}</td><td>${cell(r2.prop[id] ?? "")}</td></tr>`;
    })
    .join("");
  const gridHead = served.map((id) => `<th>${esc(CAND_BY_ID[id].name)}</th>`).join("");
  const gridRows = ELEMENT_IDS.map((el) => `<tr><td class="id">${esc(ELEMENTS[el].name)}</td>${served.map((id) => `<td>${r2.grid[`${id}.${el}`] ? esc(LEVELS[r2.grid[`${id}.${el}`]].label) : "—"}</td>`).join("")}</tr>`).join("");
  const costRow = `<tr><td class="id">${esc(tt("Tailoring cost per account · limit", "Zuschnittkosten pro Account · Grenze"))}</td>${served.map((id) => `<td>${esc(euro(tailorCost(r2, id)))} · ${esc(euro(tailorLimit(id)))}</td>`).join("")}</tr>`;
  const fundedIds = funded(r2);
  const archRows = ARCH.map((a) => {
    const on = !!r2.alloc[a.id];
    return `<tr><td class="id">${esc(a.name)}</td><td>${esc(on ? tt("funded", "finanziert") : tt("not funded", "nicht finanziert"))}</td><td class="num">${on ? esc(euro(a.cost)) : "—"}</td><td class="num">${on && r2.start[a.id] != null ? esc(tt(`month ${r2.start[a.id]}`, `Monat ${r2.start[a.id]}`)) : "—"}</td><td>${on && r2.owner[a.id] ? esc(OWNERS[r2.owner[a.id]!].name) : "—"}</td><td>${on ? cell(r2.trigger[a.id] ?? "") : "—"}</td></tr>`;
  }).join("");
  const d = DECISIONS.find((x) => x.id === r2.decision);
  const k = r2.tripKpi ? KPI_BY_ID[r2.tripKpi] : null;
  const thr = parseAmount(r2.tripThreshold);
  const u = (x: typeof k) => (x ? (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`) : "");
  const action = { "": "—", scale: tt("scale up anyway", "trotzdem ausweiten"), adjust: tt("adjust one measure and continue", "eine Maßnahme anpassen und weitermachen"), stop: tt("stop and reconsider the segment focus", "stoppen und den Segmentfokus überdenken") }[r2.tripAction];

  return `${header("Segment Strategy Memo", tt("Level 3 · Management decision", "Level 3 · Managemententscheidung"), p)}
<p class="muted">${esc(tt(`To: the board · From: ${name || "Chief Sales Officer"}, DataCloud Services GmbH · Budget ${euro(R2_BUDGET)} over ${R2_MONTHS} months.`, `An: den Vorstand · Von: ${name || "Chief Sales Officer"}, DataCloud Services GmbH · Budget ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate.`))}</p>
<h2>${esc(tt("1 · Situation", "1 · Lage"))}</h2>
<p>${esc(tt("An unclear target group strategy, limited resources, a heterogeneous market, budget restrictions, incomplete customer data and time pressure. The board asks for a segment decision anyway.", "Eine unklare Zielgruppenstrategie, begrenzte Ressourcen, ein heterogener Markt, Budgetgrenzen, unvollständige Kundendaten und Zeitdruck. Der Vorstand verlangt trotzdem eine Segmententscheidung."))}</p>
${situation}
<h2>${esc(tt("2 · Prioritisation criteria", "2 · Priorisierungskriterien"))}</h2>
<table><thead><tr><th>${esc(tt("Criterion", "Kriterium"))}</th><th>${esc(tt("What it measures for DataCloud", "Was es für DataCloud misst"))}</th></tr></thead><tbody>${critRows || `<tr><td colspan="2">—</td></tr>`}</tbody></table>
<h2>${esc(tt("3 · Core target segments", "3 · Kernzielsegmente"))}</h2>
<table><thead><tr><th>${esc(tt("Segment", "Segment"))}</th><th>${esc(tt("Attractiveness", "Attraktivität"))}</th><th>${esc(tt("Ability to win", "Gewinnfähigkeit"))}</th><th>${esc(tt("Role", "Rolle"))}</th></tr></thead><tbody>${rateRows}</tbody></table>
<h2>${esc(tt("4 · Sales strategy per segment", "4 · Vertriebsstrategie pro Segment"))}</h2>
<table><thead><tr><th>${esc(tt("Segment", "Segment"))}</th><th>${esc(tt("Sales model (cost share)", "Vertriebsmodell (Kostenanteil)"))}</th><th>${esc(tt("Value proposition", "Nutzenversprechen"))}</th></tr></thead><tbody>${salesRows || `<tr><td colspan="3">—</td></tr>`}</tbody></table>
<h2>${esc(tt("5 · Standardisation and individualisation", "5 · Standardisierung und Individualisierung"))}</h2>
${served.length ? `<table><thead><tr><th>${esc(tt("Element", "Element"))}</th>${gridHead}</tr></thead><tbody>${gridRows}${costRow}</tbody></table>` : `<p class="muted">—</p>`}
<h2>${esc(tt("6 · The measures architecture", "6 · Die Maßnahmenarchitektur"))}</h2>
<table><thead><tr><th>${esc(tt("Item", "Punkt"))}</th><th>${esc(tt("Status", "Status"))}</th><th class="num">${esc(tt("Cost", "Kosten"))}</th><th class="num">${esc(tt("Start", "Start"))}</th><th>${esc(tt("Owner", "Owner"))}</th><th>${esc(tt("Trigger", "Trigger"))}</th></tr></thead><tbody>${archRows}</tbody></table>
<p class="legend">${esc(tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)} (${euro(archLeft(r2))} left) across ${fundedIds.length} item${fundedIds.length === 1 ? "" : "s"}.`, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)} (${euro(archLeft(r2))} übrig) über ${fundedIds.length} ${fundedIds.length === 1 ? "Punkt" : "Punkte"}.`))}</p>
${ARCH_IDS.every((id) => r2.alloc[id]) ? "" : `<h3>${esc(tt("Left out, and when we look again", "Weggelassen, und wann wir es wieder ansehen"))}</h3>${para(r2.postponed)}<p><strong>${esc(tt("Pickup point:", "Pickup Point:"))}</strong> ${cell(r2.pickup)}</p>`}
<h2>${esc(tt("7 · The decision", "7 · Die Entscheidung"))}</h2>
<p><strong>${d ? esc(d.label) : "—"}</strong>${d ? ` — ${esc(d.detail)}` : ""}</p>
<h3>${esc(tt("What this decision rests on", "Worauf diese Entscheidung beruht"))}</h3>
<ol>${r2.assumptions.map((a) => `<li>${cell(a)}</li>`).join("")}</ol>
<h3>Tripwire</h3>
<p>${esc(tt(`${k ? k.label : "—"} reaches ${thr !== null && k ? `${num(thr)}${u(k)}` : "—"} by month ${r2.tripMonth ?? "—"} (today: ${k ? `${num(k.baseline)}${u(k)}` : "—"}). If it is missed: ${action}.`, `${k ? k.label : "—"} erreicht ${thr !== null && k ? `${num(thr)}${u(k)}` : "—"} bis Monat ${r2.tripMonth ?? "—"} (heute: ${k ? `${num(k.baseline)}${u(k)}` : "—"}). Wenn er verfehlt wird: ${action}.`))}</p>
<h3>${esc(tt("If the segment turns out smaller in month 2", "Wenn sich das Segment in Monat 2 als kleiner herausstellt"))}</h3>${para(r2.challenge)}

<div class="foot">${esc(tt(`Checks requested: ${r2.checks}`, `Angeforderte Prüfungen: ${r2.checks}`))}<br/>${esc(tt(`Generated ${dateLabel()}.`, `Erstellt am ${dateLabel()}.`))}</div>`;
}

export { ARCH_BY_ID };
