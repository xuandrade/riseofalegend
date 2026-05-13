import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

export const STORAGE_KEYS = {
  shared: 'rise_shared',
  editalObjetiva: 'rise_edital_objetiva',
  editalDiscursiva: 'rise_edital_discursiva',
  examPerformance: 'rise_exam_performance',
  settings: 'rise_settings',
};

const COMPRESS_THRESHOLD = 2048;

export function loadKey(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    if (raw.startsWith('__c__')) {
      const compressed = raw.slice(5);
      const decompressed = decompressFromUTF16(compressed);
      return decompressed ? JSON.parse(decompressed) : fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] Failed to load "${key}":`, err);
    return fallback;
  }
}

export function saveKey(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (serialized.length > COMPRESS_THRESHOLD) {
      const compressed = compressToUTF16(serialized);
      window.localStorage.setItem(key, `__c__${compressed}`);
    } else {
      window.localStorage.setItem(key, serialized);
    }
    return true;
  } catch (err) {
    console.error(`[storage] Failed to save "${key}":`, err);
    return false;
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}

export function exportAllData() {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = loadKey(key);
  });
  data._exportedAt = new Date().toISOString();
  data._version = '1.0.0';
  return data;
}

export function importAllData(data) {
  if (!data || typeof data !== 'object') return false;
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined && data[name] !== null) {
      saveKey(key, data[name]);
    }
  });
  return true;
}

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => removeKey(key));
}

export const DEFAULT_USER = {
  playerName: 'Estudante',
  dragonClass: 'mago',
  totalXP: 0,
  level: 1,
  currentStage: 0,
  currentSubLevel: 0,
  streak: 0,
  bestStreak: 0,
  dailyLogs: [],
  attackModeStreak: 0,
  attackModeBestStreak: 0,
  studySchedule: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  achievements: [],
  items: [],
  bossesDefeated: [],
  examDate: null,
  lastActive: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const DEFAULT_SETTINGS = {
  soundsEnabled: true,
  animationsEnabled: true,
  notificationsEnabled: true,
};

export function initStorage() {
  if (!window.localStorage.getItem(STORAGE_KEYS.shared)) {
    saveKey(STORAGE_KEYS.shared, DEFAULT_USER);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.editalObjetiva)) {
    saveKey(STORAGE_KEYS.editalObjetiva, { subjects: [] });
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.editalDiscursiva)) {
    saveKey(STORAGE_KEYS.editalDiscursiva, { subjects: [] });
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.examPerformance)) {
    saveKey(STORAGE_KEYS.examPerformance, []);
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.settings)) {
    saveKey(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  }
}
