import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  DEFAULT_SETTINGS,
  DEFAULT_USER,
  STORAGE_KEYS,
  initStorage,
  loadKey,
  saveKey,
} from '../utils/storage.js';
import { calculateClassFromStudyData } from '../constants/classes.js';
import { getDragonState } from '../utils/dragon-evolution.js';
import { calculateActionXP, calculateBossDamage } from '../utils/xp-calculator.js';
import { ACHIEVEMENTS, getAchievementById } from '../constants/achievements.js';
import { useSound } from '../hooks/useSound.js';

const AppContext = createContext(null);

const EMPTY_EDITAL = { subjects: [] };

function useDebouncedSave(key, value, delay = 200) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => saveKey(key, value), delay);
    return () => ref.current && clearTimeout(ref.current);
  }, [key, value, delay]);
}

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editalObjetiva, setEditalObjetiva] = useState(EMPTY_EDITAL);
  const [editalDiscursiva, setEditalDiscursiva] = useState(EMPTY_EDITAL);
  const [examPerformance, setExamPerformance] = useState([]);
  const [toasts, setToasts] = useState([]);

  const sound = useSound({ enabled: settings.soundsEnabled });

  useEffect(() => {
    initStorage();
    setUser(loadKey(STORAGE_KEYS.shared, DEFAULT_USER));
    setSettings(loadKey(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
    setEditalObjetiva(loadKey(STORAGE_KEYS.editalObjetiva, EMPTY_EDITAL));
    setEditalDiscursiva(loadKey(STORAGE_KEYS.editalDiscursiva, EMPTY_EDITAL));
    setExamPerformance(loadKey(STORAGE_KEYS.examPerformance, []));
    setReady(true);
  }, []);

  useDebouncedSave(STORAGE_KEYS.shared, user);
  useDebouncedSave(STORAGE_KEYS.settings, settings);
  useDebouncedSave(STORAGE_KEYS.editalObjetiva, editalObjetiva);
  useDebouncedSave(STORAGE_KEYS.editalDiscursiva, editalDiscursiva);
  useDebouncedSave(STORAGE_KEYS.examPerformance, examPerformance);

  const pushToast = useCallback((toast) => {
    const id = uuid();
    setToasts((curr) => [...curr, { id, ...toast }]);
    setTimeout(() => {
      setToasts((curr) => curr.filter((t) => t.id !== id));
    }, toast.duration || 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const updateUser = useCallback((updater) => {
    setUser((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const updateSettings = useCallback((updater) => {
    setSettings((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const addXP = useCallback((amount, options = {}) => {
    if (!amount || amount === 0) return null;
    let evolution = null;
    setUser((prev) => {
      const before = getDragonState(prev.totalXP);
      const totalXP = Math.max(0, prev.totalXP + amount);
      const after = getDragonState(totalXP);
      if (after.stage > before.stage) {
        evolution = { from: before, to: after };
      }
      const newAchievements = checkXPAchievements(totalXP, prev.achievements);
      return {
        ...prev,
        totalXP,
        level: after.level,
        currentStage: after.stage,
        currentSubLevel: after.subLevel,
        achievements: [...prev.achievements, ...newAchievements],
        lastActive: new Date().toISOString(),
      };
    });

    if (amount > 0 && options.silent !== true) {
      pushToast({
        type: 'xp',
        title: `+${amount} XP`,
        message: options.reason || 'Você está evoluindo!',
        duration: 2400,
      });
    }
    return { amount, evolution };
  }, [pushToast]);

  const registrarEstudo = useCallback((entry) => {
    const xp = calculateActionXP({
      type: entry.type,
      durationMin: entry.durationMin || 0,
      questionsCount: entry.questionsCount || 0,
      weight: entry.weight || 3,
      isEssential: entry.isEssential || false,
      dragonClass: user.dragonClass,
      isAttackMode: entry.isAttackMode || false,
    });
    const damage = calculateBossDamage({
      type: entry.type,
      durationMin: entry.durationMin || 0,
      questionsCount: entry.questionsCount || 0,
      weight: entry.weight || 3,
      isEssential: entry.isEssential || false,
    });
    const today = new Date().toISOString();
    const todayDate = today.split('T')[0];

    setUser((prev) => {
      const lastLogDate = prev.dailyLogs.length
        ? prev.dailyLogs[prev.dailyLogs.length - 1].date.split('T')[0]
        : null;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let streak = prev.streak;
      if (lastLogDate !== todayDate) {
        streak = lastLogDate === yesterday ? streak + 1 : 1;
      } else if (streak === 0) {
        streak = 1;
      }
      return {
        ...prev,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        dailyLogs: [
          ...prev.dailyLogs,
          {
            id: uuid(),
            date: today,
            type: entry.type,
            durationMin: entry.durationMin || 0,
            hours: (entry.durationMin || 0) / 60,
            questionsCount: entry.questionsCount || 0,
            xp,
            subject: entry.subject || null,
            notes: entry.notes || '',
            isAttackMode: entry.isAttackMode || false,
          },
        ],
      };
    });

    sound.play(entry.type === 'questoes' ? 'swordHit' : 'click');
    const result = addXP(xp, { reason: entry.subject || labelForType(entry.type) });
    return { xp, damage, evolution: result?.evolution };
  }, [user.dragonClass, addXP, sound]);

  const checkXPAchievements = useCallback((totalXP, existing) => {
    const unlocked = [];
    const xpThresholds = [
      ['xp_1k', 1000],
      ['xp_5k', 5000],
      ['xp_10k', 10000],
      ['xp_50k', 50000],
    ];
    xpThresholds.forEach(([id, threshold]) => {
      if (totalXP >= threshold && !existing.includes(id)) {
        unlocked.push(id);
      }
    });
    return unlocked;
  }, []);

  const unlockAchievement = useCallback((id) => {
    setUser((prev) => {
      if (prev.achievements.includes(id)) return prev;
      const achievement = getAchievementById(id);
      if (!achievement) return prev;
      pushToast({
        type: 'achievement',
        title: '🏆 Conquista Desbloqueada',
        message: achievement.name,
        rarity: achievement.rarity,
        duration: 4500,
      });
      sound.play('achievement');
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  }, [pushToast, sound]);

  const refreshDragonClass = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      dragonClass: calculateClassFromStudyData(prev.dailyLogs),
    }));
  }, []);

  const dragon = useMemo(() => getDragonState(user.totalXP), [user.totalXP]);

  const value = useMemo(
    () => ({
      ready,
      user,
      settings,
      editalObjetiva,
      editalDiscursiva,
      examPerformance,
      toasts,
      dragon,
      sound,
      updateUser,
      updateSettings,
      setEditalObjetiva,
      setEditalDiscursiva,
      setExamPerformance,
      addXP,
      registrarEstudo,
      unlockAchievement,
      refreshDragonClass,
      pushToast,
      dismissToast,
    }),
    [
      ready,
      user,
      settings,
      editalObjetiva,
      editalDiscursiva,
      examPerformance,
      toasts,
      dragon,
      sound,
      updateUser,
      updateSettings,
      addXP,
      registrarEstudo,
      unlockAchievement,
      refreshDragonClass,
      pushToast,
      dismissToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function labelForType(type) {
  switch (type) {
    case 'teoria':
      return 'Sessão de teoria';
    case 'questoes':
      return 'Sessão de questões';
    case 'checkbox':
      return 'Tópico completado';
    case 'simulado':
      return 'Simulado registrado';
    default:
      return 'Estudo registrado';
  }
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
