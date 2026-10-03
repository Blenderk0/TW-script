import { Platform } from 'react-native';

import type { CallArea, DeadlineKind, ItemState, OrgType, ProjectStatus } from './types';

export const C = {
  bg: '#F4F0E7',
  surface: '#FFFFFF',
  sand: '#EAE3D2',
  border: '#E3DCCB',
  ink: '#1C1A17',
  muted: '#6F695E',
  faint: '#A29B8D',
  green: '#1E4D3A',
  greenSoft: '#D6EFE0',
  red: '#B4232A',
  redSoft: '#FDE2E2',
  orange: '#9A5B00',
  orangeSoft: '#FCEFC2',
  graySoft: '#F1EFEA',
  accent: '#F5C33B',
};

export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });

export const STATUS: Record<ProjectStatus, { label: string; long: string; fg: string; bg: string }> = {
  podana: { label: 'Podaná', long: 'Podané (čakajúce na vyhodnotenie)', fg: '#8A6100', bg: '#FCEFC2' },
  schvalena: { label: 'Schválená', long: 'Schválené', fg: '#17703F', bg: '#D6F5E2' },
  realizacia: { label: 'V realizácii', long: 'V realizácii', fg: '#2456A6', bg: '#DCE8FB' },
  vyuctovana: { label: 'Vyúčtovaná', long: 'Vyúčtované (uzavreté úspešne)', fg: '#5E5A52', bg: '#ECEAE5' },
  zamietnuta: { label: 'Zamietnutá', long: 'Neúspešné / zamietnuté', fg: '#B4232A', bg: '#FDE2E2' },
};

export const STATUS_ORDER: ProjectStatus[] = ['podana', 'schvalena', 'realizacia', 'vyuctovana', 'zamietnuta'];

export const ITEM_STATE: Record<ItemState, { label: string; color: string }> = {
  caka: { label: 'Čaká', color: '#C9C3B6' },
  objednane: { label: 'Objednané', color: '#E9B10C' },
  dorucene: { label: 'Doručené', color: '#1FA463' },
};

export const DEADLINE_LABEL: Record<DeadlineKind, string> = {
  podanie: 'Podanie',
  hodnotenie: 'Hodnotenie',
  realizacia: 'Koniec realizácie',
  zaverecna: 'Záverečná správa',
  vyuctovanie: 'Vyúčtovanie',
};

export const DEADLINE_ORDER: DeadlineKind[] = ['podanie', 'hodnotenie', 'realizacia', 'zaverecna', 'vyuctovanie'];

export const ORG_TYPE: Record<OrgType, string> = {
  obec: 'Obec / mesto',
  oz: 'OZ / n.o.',
  skola: 'Škola',
  firma: 'Firma',
};

export const AREA: Record<CallArea, string> = {
  kultura: 'Kultúra',
  sport: 'Šport',
  zp: 'Životné prostredie',
  socialna: 'Sociálna oblasť',
  infra: 'Infraštruktúra',
  vzdelavanie: 'Vzdelávanie',
};

/** Farba podľa naliehavosti: červená do 3 dní, oranžová do týždňa, inak sivá. */
export function urgency(days: number) {
  if (days <= 3) return { fg: C.red, bg: C.redSoft, border: '#F6B9B9' };
  if (days <= 7) return { fg: C.orange, bg: C.orangeSoft, border: '#F0D57A' };
  return { fg: C.ink, bg: C.graySoft, border: C.border };
}
