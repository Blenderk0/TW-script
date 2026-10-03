import { eur, formatDate, formatDateShort } from './format';
import { DEADLINE_LABEL, DEADLINE_ORDER, ITEM_STATE, STATUS, STATUS_ORDER } from './theme';
import type { Project, ProjectStatus } from './types';

export interface SummaryOptions {
  title: string;
  author: string;
  orgName: string;
  statuses: ProjectStatus[];
  showAmount: boolean;
  showProvider: boolean;
  showDeadlines: boolean;
  showItems: boolean;
  showNotes: boolean;
  showStats: boolean;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildSummaryHtml(projects: Project[], o: SummaryOptions): string {
  const total = projects.reduce((s, p) => s + p.amount, 0);
  const byStatus = STATUS_ORDER.filter((s) => o.statuses.includes(s)).map((s) => ({
    s,
    list: projects.filter((p) => p.status === s),
  }));

  const stats = o.showStats
    ? `<div class="stats">
        <div class="stat"><div class="k">Počet projektov</div><div class="v">${projects.length}</div></div>
        <div class="stat"><div class="k">Celková suma</div><div class="v">${eur(total)}</div></div>
        ${byStatus
          .filter((g) => g.list.length)
          .map(
            (g) =>
              `<div class="stat"><div class="k">${STATUS[g.s].label}</div><div class="v">${g.list.length}</div></div>`,
          )
          .join('')}
      </div>`
    : '';

  const projectHtml = (p: Project) => {
    const meta: string[] = [];
    if (o.showProvider) meta.push(esc([p.provider, p.callName].filter(Boolean).join(' · ')));
    const deadlines = o.showDeadlines
      ? DEADLINE_ORDER.filter((k) => p.deadlines[k])
          .map((k) => `<span>${DEADLINE_LABEL[k]}: <b>${formatDateShort(p.deadlines[k]!)}</b></span>`)
          .join('')
      : '';
    const items =
      o.showItems && p.items.length
        ? `<table class="items">${p.items
            .map(
              (i) =>
                `<tr><td>${esc(i.name)}</td><td class="st">${ITEM_STATE[i.state].label}</td><td class="num">${eur(i.amount)}</td></tr>`,
            )
            .join('')}</table>`
        : '';
    const notes = o.showNotes && p.notes.trim() ? `<p class="notes">${esc(p.notes)}</p>` : '';
    return `<div class="project">
      <div class="row"><h3>${esc(p.name)}</h3>${o.showAmount ? `<div class="amt">${eur(p.amount)}</div>` : ''}</div>
      ${meta.length ? `<div class="meta">${meta.join('')}</div>` : ''}
      ${deadlines ? `<div class="dl">${deadlines}</div>` : ''}
      ${items}${notes}
    </div>`;
  };

  const sections = byStatus
    .filter((g) => g.list.length)
    .map((g) => `<h2>${STATUS[g.s].long} <small>(${g.list.length})</small></h2>${g.list.map(projectHtml).join('')}`)
    .join('');

  return `<!doctype html><html lang="sk"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @page { margin: 22mm 18mm; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1C1A17; font-size: 11pt; line-height: 1.45; }
  h1 { font-family: Georgia, serif; font-size: 24pt; margin: 0 0 4pt; }
  .sub { color: #6F695E; margin-bottom: 18pt; }
  .brand { color: #1E4D3A; font-weight: 700; font-size: 10pt; letter-spacing: .5pt; margin-bottom: 14pt; }
  h2 { font-family: Georgia, serif; font-size: 14pt; border-bottom: 2px solid #1C1A17; padding-bottom: 4pt; margin-top: 20pt; }
  h2 small { color: #6F695E; font-weight: normal; }
  .stats { display: flex; flex-wrap: wrap; gap: 8pt; margin: 8pt 0 6pt; }
  .stat { border: 1px solid #E3DCCB; border-radius: 6pt; padding: 8pt 12pt; min-width: 90pt; }
  .stat .k { font-size: 8pt; text-transform: uppercase; color: #6F695E; letter-spacing: .5pt; }
  .stat .v { font-family: Georgia, serif; font-size: 16pt; font-weight: 700; }
  .project { border: 1px solid #E3DCCB; border-radius: 6pt; padding: 10pt 12pt; margin: 8pt 0; page-break-inside: avoid; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  h3 { margin: 0; font-size: 12pt; }
  .amt { font-weight: 700; white-space: nowrap; }
  .meta { color: #6F695E; font-size: 9.5pt; margin-top: 2pt; }
  .dl { display: flex; flex-wrap: wrap; gap: 4pt 14pt; font-size: 9.5pt; margin-top: 6pt; }
  .items { width: 100%; border-collapse: collapse; margin-top: 6pt; font-size: 9.5pt; }
  .items td { border-top: 1px solid #F1EFEA; padding: 3pt 0; }
  .items .st { color: #6F695E; width: 70pt; }
  .num { text-align: right; white-space: nowrap; width: 70pt; }
  .notes { font-size: 9.5pt; color: #3c3a36; margin: 6pt 0 0; white-space: pre-wrap; }
  .foot { margin-top: 26pt; color: #A29B8D; font-size: 8.5pt; border-top: 1px solid #E3DCCB; padding-top: 6pt; }
</style></head><body>
  <div class="brand">GRANTÉR · ${esc(o.orgName)}</div>
  <h1>${esc(o.title)}</h1>
  <div class="sub">${o.author ? `Predkladá: ${esc(o.author)} · ` : ''}Stav k ${formatDate(new Date().toISOString().slice(0, 10))}</div>
  ${stats}
  ${sections || '<p>Pre zvolené filtre nie sú žiadne projekty.</p>'}
  <div class="foot">Vygenerované aplikáciou Grantér — granty pod kontrolou.</div>
</body></html>`;
}
