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
  const [xpFloats, setXPFloats] = useState([]);
  const [evolution, setEvolution] = useState(null);

  const sound = useSound({ enabled: settings.soundsEnabled });
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

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

  const pushXPFloat = useCallback((amount) => {
    const id = uuid();
    setXPFloats((curr) => [...curr, { id, amount }]);
    setTimeout(() => {
      setXPFloats((curr) => curr.filter((x) => x.id !== id));
    }, 1700);
  }, []);

  const updateUser = useCallback((updater) => {
    setUser((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const updateSettings = useCallback((updater) => {
    setSettings((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  }, []);

  const checkAchievementsForUser = useCallback((u) => {
    const unlocked = [];
    const has = (id) => u.achievements.includes(id) || unlocked.includes(id);

    if (u.totalXP >= 100 && !has('first_xp')) unlocked.push('first_xp');
    if (u.totalXP >= 1000 && !has('xp_1k')) unlocked.push('xp_1k');
    if (u.totalXP >= 5000 && !has('xp_5k')) unlocked.push('xp_5k');
    if (u.totalXP >= 10000 && !has('xp_10k')) unlocked.push('xp_10k');
    if (u.totalXP >= 50000 && !has('xp_50k')) unlocked.push('xp_50k');

    if (u.level >= 2 && !has('dragon_baby')) unlocked.push('dragon_baby');

    if (u.streak >= 3 && !has('streak_3')) unlocked.push('streak_3');
    if (u.streak >= 7 && !has('streak_7')) unlocked.push('streak_7');
    if (u.streak >= 14 && !has('streak_14')) unlocked.push('streak_14');
    if (u.streak >= 25 && !has('streak_25')) unlocked.push('streak_25');
    if (u.streak >= 30 && !has('streak_30')) unlocked.push('streak_30');
    if (u.streak >= 50 && !has('streak_50')) unlocked.push('streak_50');
    if (u.streak >= 75 && !has('streak_75')) unlocked.push('streak_75');

    const totalTeoriaH = u.dailyLogs
      .filter((l) => l.type === 'teoria')
      .reduce((acc, l) => acc + (l.hours || 0), 0);
    if (totalTeoriaH >= 10 && !has('class_filosofo')) unlocked.push('class_filosofo');

    const totalQuestoes = u.dailyLogs
      .filter((l) => l.type === 'questoes')
      .reduce((acc, l) => acc + (l.questionsCount || 0), 0);
    if (totalQuestoes >= 100 && !has('class_gladiador')) unlocked.push('class_gladiador');

    const hour = new Date().getHours();
    if (u.dailyLogs.length && hour < 7 && !has('secret_madrugador')) unlocked.push('secret_madrugador');
    if (u.dailyLogs.length && hour >= 20 && !has('secret_coruja')) unlocked.push('secret_coruja');

    return unlocked;
  }, []);

  const unlockAchievement = useCallback((id) => {
    setUser((prev) => {
      if (prev.achievements.includes(id)) return prev;
      const achievement = getAchievementById(id);
      if (!achievement) return prev;
      pushToast({
        type: 'achievement',
        title: '🏆 Conquista desbloqueada',
        message: achievement.name,
        rarity: achievement.rarity,
        duration: 4500,
      });
      sound.play('achievement');
      return {
        ...prev,
        achievements: [...prev.achievements, id],
        totalXP: prev.totalXP + (achievement.xp || 0),
      };
    });
  }, [pushToast, sound]);

  const addXP = useCallback(
    (amount, options = {}) => {
      if (!amount) return null;
      let evolutionEvent = null;
      let unlockedIds = [];

      setUser((prev) => {
        const before = getDragonState(prev.totalXP);
        const totalXP = Math.max(0, prev.totalXP + amount);
        const after = getDragonState(totalXP);
        if (after.stage > before.stage) {
          evolutionEvent = { from: before, to: after };
        }
        const next = {
          ...prev,
          totalXP,
          level: after.level,
          currentStage: after.stage,
          currentSubLevel: after.subLevel,
          lastActive: new Date().toISOString(),
        };
        unlockedIds = checkAchievementsForUser(next);
        return {
          ...next,
          achievements: [...next.achievements, ...unlockedIds],
        };
      });

      if (amount > 0 && !options.silent) {
        pushXPFloat(amount);
        if (options.reason) {
          pushToast({
            type: 'xp',
            title: `+${amount} XP`,
            message: options.reason,
            duration: 2400,
          });
        }
      }

      if (evolutionEvent) {
        setEvolution(evolutionEvent);
      }

      unlockedIds.forEach((id) => {
        const achievement = getAchievementById(id);
        if (!achievement) return;
        pushToast({
          type: 'achievement',
          title: '🏆 Conquista desbloqueada',
          message: achievement.name,
          rarity: achievement.rarity,
          duration: 4500,
        });
        sound.play('achievement');
      });

      return { amount, evolution: evolutionEvent };
    },
    [pushToast, pushXPFloat, sound, checkAchievementsForUser],
  );

  const registrarEstudo = useCallback(
    (entry) => {
      const dragonClass = userRef.current.dragonClass;
      const xp = calculateActionXP({
        type: entry.type,
        durationMin: entry.durationMin || 0,
        questionsCount: entry.questionsCount || 0,
        weight: entry.weight || 3,
        isEssential: entry.isEssential || false,
        dragonClass,
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
      const reasonMap = {
        teoria: 'Sessão de teoria registrada',
        questoes: 'Sessão de questões registrada',
        checkbox: entry.subject || 'Tópico completado',
        simulado: 'Simulado registrado',
      };
      const result = addXP(xp, { reason: reasonMap[entry.type] || 'Estudo registrado' });
      return { xp, damage, evolution: result?.evolution };
    },
    [addXP, sound],
  );

  const refreshDragonClass = useCallback(() => {
    setUser((prev) => {
      const next = calculateClassFromStudyData(prev.dailyLogs);
      if (next === prev.dragonClass) return prev;
      return { ...prev, dragonClass: next };
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    refreshDragonClass();
    const lastLog = user.dailyLogs[user.dailyLogs.length - 1];
    if (lastLog) {
      const lastDay = lastLog.date.split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      if (lastDay !== today) {
        const last = new Date(lastDay).getTime();
        const now = new Date(today).getTime();
        const daysSince = Math.floor((now - last) / 86400000);
        if (daysSince > 1 && user.streak > 0) {
          setUser((prev) => ({ ...prev, streak: 0 }));
        }
      }
    }
  }, [ready, refreshDragonClass, user.dailyLogs, user.streak]);

  const dismissEvolution = useCallback(() => setEvolution(null), []);
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
      xpFloats,
      evolution,
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
      dismissEvolution,
    }),
    [
      ready,
      user,
      settings,
      editalObjetiva,
      editalDiscursiva,
      examPerformance,
      toasts,
      xpFloats,
      evolution,
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
      dismissEvolution,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
