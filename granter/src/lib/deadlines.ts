import { daysUntil } from './format';
import { DEADLINE_ORDER } from './theme';
import type { Deadline, Project } from './types';

export const isActive = (p: Project) => p.status !== 'vyuctovana' && p.status !== 'zamietnuta';

/** Všetky nadchádzajúce termíny aktívnych projektov, zoradené podľa dátumu. */
export function upcomingDeadlines(projects: Project[]): Deadline[] {
  const out: Deadline[] = [];
  for (const p of projects) {
    if (!isActive(p)) continue;
    for (const kind of DEADLINE_ORDER) {
      const date = p.deadlines[kind];
      if (!date) continue;
      const days = daysUntil(date);
      if (days < 0) continue;
      out.push({ projectId: p.id, projectName: p.name, kind, date, days });
    }
  }
  return out.sort((a, b) => a.days - b.days);
}
