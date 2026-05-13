import { useCallback, useEffect, useRef } from 'react';

const SOUND_LIBRARY = {
  swordHit: { freq: [880, 1320], duration: 0.16, type: 'triangle', volume: 0.18 },
  levelUp: { freq: [523, 659, 784, 1047], duration: 0.45, type: 'sine', volume: 0.22 },
  bossHit: { freq: [220, 110], duration: 0.22, type: 'sawtooth', volume: 0.2 },
  bossDefeat: { freq: [261, 329, 392, 523, 784], duration: 0.7, type: 'sine', volume: 0.25 },
  achievement: { freq: [659, 784, 988, 1175], duration: 0.55, type: 'sine', volume: 0.22 },
  click: { freq: [600], duration: 0.05, type: 'sine', volume: 0.1 },
  errorBuzz: { freq: [150, 100], duration: 0.4, type: 'sawtooth', volume: 0.25 },
  attackStart: { freq: [330, 440, 554], duration: 0.4, type: 'triangle', volume: 0.22 },
  attackComplete: { freq: [523, 784, 1047], duration: 0.5, type: 'sine', volume: 0.25 },
  notification: { freq: [880, 1175], duration: 0.18, type: 'sine', volume: 0.18 },
};

let cachedCtx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!cachedCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    cachedCtx = new AudioCtx();
  }
  if (cachedCtx.state === 'suspended') {
    cachedCtx.resume().catch(() => {});
  }
  return cachedCtx;
}

export function useSound({ enabled = true } = {}) {
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const play = useCallback((soundId) => {
    if (!enabledRef.current) return;
    const config = SOUND_LIBRARY[soundId];
    if (!config) return;
    const ctx = getCtx();
    if (!ctx) return;

    const { freq, duration, type, volume } = config;
    const startTime = ctx.currentTime;
    const noteDur = duration / freq.length;

    freq.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = f;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = startTime + i * noteDur;
      const t1 = t0 + noteDur;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t1);
      osc.start(t0);
      osc.stop(t1 + 0.02);
    });
  }, []);

  return { play };
}
