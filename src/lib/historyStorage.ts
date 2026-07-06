import type { ReadingOutput } from "../types/tarot";

const STORAGE_KEY = "ai_tarot_reading_history_v1";

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRaw(): ReadingOutput[] {
  try {
    if (!canUseLocalStorage()) return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReadingOutput[]) : [];
  } catch {
    return [];
  }
}

function writeRaw(history: ReadingOutput[]): void {
  try {
    if (!canUseLocalStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage can fail in private browsing, quota limits, or locked-down browsers.
  }
}

export function saveReading(reading: ReadingOutput): void {
  const existing = readRaw().filter((item) => item.id !== reading.id);
  writeRaw([reading, ...existing].slice(0, 80));
}

export function getAllHistory(): ReadingOutput[] {
  return readRaw();
}

export function deleteHistoryItem(id: string): void {
  writeRaw(readRaw().filter((item) => item.id !== id));
}

export function clearHistory(): void {
  writeRaw([]);
}

export function filterHistory(category?: string, keyword?: string): ReadingOutput[] {
  const normalizedKeyword = keyword?.trim();
  return readRaw().filter((item) => {
    const matchCategory = !category || category === "全部" || item.category === category;
    const matchKeyword = !normalizedKeyword || item.question.includes(normalizedKeyword) || item.overallSummary.includes(normalizedKeyword);
    return matchCategory && matchKeyword;
  });
}
