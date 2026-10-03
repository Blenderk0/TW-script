import type { ISODate } from './types';

const MONTHS_GEN = [
  'januára', 'februára', 'marca', 'apríla', 'mája', 'júna',
  'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra',
];
export const MONTHS_NOM = [
  'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
  'Júl', 'August', 'September', 'Október', 'November', 'December',
];
const WEEKDAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];

const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parsuje YYYY-MM-DD ako lokálny dátum o poludní (bez posunov časových pásiem). */
export function parseISO(s: ISODate): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function todayISO(): ISODate {
  return toISO(new Date());
}

export function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysUntil(s: ISODate): number {
  return Math.round((parseISO(s).getTime() - parseISO(todayISO()).getTime()) / 86_400_000);
}

export function formatDate(s: ISODate): string {
  const d = parseISO(s);
  return `${d.getDate()}. ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShort(s: ISODate): string {
  const d = parseISO(s);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export function formatToday(): string {
  const d = new Date();
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'Dobré ráno.';
  if (h < 18) return 'Dobrý deň.';
  return 'Dobrý večer.';
}

export function eur(n: number): string {
  const rounded = Math.round(n);
  const s = Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${rounded < 0 ? '−' : ''}${s} €`;
}

/** Slovenské skloňovanie: 1 deň, 2–4 dni, 5+ dní */
export function daysWord(n: number): string {
  const a = Math.abs(n);
  if (a === 1) return 'deň';
  if (a >= 2 && a <= 4) return 'dni';
  return 'dní';
}

export function relativeDays(n: number): string {
  if (n === 0) return 'dnes';
  if (n === 1) return 'zajtra';
  if (n === -1) return 'včera';
  if (n > 0) return `o ${n} ${daysWord(n)}`;
  return `pred ${-n} dňami`;
}

export function projectsWord(n: number): string {
  if (n === 1) return 'projekt';
  if (n >= 2 && n <= 4) return 'projekty';
  return 'projektov';
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function parseAmount(s: string): number {
  const n = Number(s.replace(/\s| |€/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}
