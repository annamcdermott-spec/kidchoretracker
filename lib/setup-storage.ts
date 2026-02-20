/** Shared key and types for setup data persisted to localStorage (prototype only). */

export const SETUP_STORAGE_KEY = "kidchoretracker-setup";

export type StoredKid = { id: string; name: string };
export type StoredChore = { id: string; name: string; requiredCount: number };
export type StoredAssignment = { kidId: string; choreId: string };
export type StoredCompletion = { kidId: string; choreId: string; count: number };

export type SetupData = {
  kids: StoredKid[];
  chores: StoredChore[];
  assignments: StoredAssignment[];
  completions: StoredCompletion[];
};

const defaultData: SetupData = {
  kids: [],
  chores: [],
  assignments: [],
  completions: [],
};

export function getSetupData(): SetupData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = window.localStorage.getItem(SETUP_STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as SetupData;
    return {
      kids: Array.isArray(parsed.kids) ? parsed.kids : defaultData.kids,
      chores: Array.isArray(parsed.chores) ? parsed.chores : defaultData.chores,
      assignments: Array.isArray(parsed.assignments) ? parsed.assignments : defaultData.assignments,
      completions: Array.isArray(parsed.completions) ? parsed.completions : defaultData.completions,
    };
  } catch {
    return defaultData;
  }
}

export function setSetupData(data: SetupData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}
