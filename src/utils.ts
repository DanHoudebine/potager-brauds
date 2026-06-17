// ============================================================
//  Utilities — dates, formatting, labels
// ============================================================
import type { Category, Season, CellStatus } from './types';

/** Local-date ISO string (YYYY-MM-DD), timezone-safe (no UTC shift). */
export function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function parseISO(s: string): Date {
  if (!s) return new Date();
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(s: string): string {
  try {
    return parseISO(s).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return s || '—';
  }
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function clampInt(v: string | number, min: number, max: number, def: number): number {
  const n = parseInt(String(v), 10);
  if (isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
}

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};
export function escapeHTML(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

export function capitalize(s: string): string {
  return (s || '').charAt(0).toUpperCase() + (s || '').slice(1);
}

export function seasonLabel(s: Season | string): string {
  return ({ spring: 'Printemps', summer: 'Été', autumn: 'Automne', winter: 'Hiver' } as Record<string, string>)[s] || capitalize(String(s));
}

export function categoryLabel(c: Category | string): string {
  return ({ legume: 'Légume', herbe: 'Herbe', fruit: 'Fruit', 'arbre-fruitier': '🌳 Fruitier' } as Record<string, string>)[c] || String(c || '');
}

export function categoryColor(c: Category | string): string {
  return ({ 'arbre-fruitier': 'earth' } as Record<string, string>)[c] || 'green';
}

export function statusColor(s: CellStatus | string): string {
  return s === 'urgent' ? 'var(--urgent)' : s === 'warn' ? 'var(--warn)' : 'var(--healthy)';
}

/** Compact, collision-resistant id generator. */
export function uid(prefix = ''): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
