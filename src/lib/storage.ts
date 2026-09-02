import type { Initiative } from "./types";

const STORAGE_KEY = "relayops.initiatives.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadInitiatives(): Initiative[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Initiative[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInitiatives(items: Initiative[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertInitiative(items: Initiative[], next: Initiative): Initiative[] {
  const idx = items.findIndex((i) => i.id === next.id);
  if (idx === -1) return [next, ...items];
  const copy = [...items];
  copy[idx] = next;
  return copy;
}

export function deleteInitiative(items: Initiative[], id: string): Initiative[] {
  return items.filter((i) => i.id !== id);
}

export function getInitiative(items: Initiative[], id: string): Initiative | undefined {
  return items.find((i) => i.id === id);
}
