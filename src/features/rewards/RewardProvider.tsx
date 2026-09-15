import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  STORAGE_KEY, createInitialState, parseStoredState, getSnapshot,
  claimQuest as claim, convertCredits as convert, unlockFeature, hasFeatureAccess,
  questAvailable as available, connectBroker as connect, claimMonthlyMilestone as milestone,
  type EconomyState, type ActionResult, type QuestId, type QuestEvidence, type PremiumFeature, type UnlockDuration,
} from './economy';

type Snapshot = ReturnType<typeof getSnapshot>;
interface Rewards {
  snapshot: Snapshot;
  storageError: string | null;
  claimQuest: (id: QuestId, evidence: QuestEvidence) => ActionResult;
  convertCredits: (amount: number) => ActionResult;
  unlock: (feature: PremiumFeature, duration: UnlockDuration) => ActionResult;
  hasAccess: (feature: PremiumFeature) => boolean;
  questAvailable: (id: QuestId) => boolean;
  connectBroker: (brokerId: string, accountId: string) => ActionResult;
  claimMonthlyMilestone: () => ActionResult;
  setDemoLevel: (level: 1 | 2 | 3 | 4) => ActionResult;
}
const RewardContext = createContext<Rewards | null>(null);
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Browser reward storage is unavailable.';

function readInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return { state: saved ? parseStoredState(JSON.parse(saved)) : createInitialState(), error: null };
  } catch (error) {
    const state = createInitialState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { state, error: null };
    } catch {
      return { state, error: errorMessage(error) };
    }
  }
}

export function RewardProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readInitial);
  const [state, setState] = useState(initial.state);
  const savedRef = useRef(JSON.stringify(state));
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (!initial.error) {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify(initial.state));
      } catch (error) { setStorageError(errorMessage(error)); }
    }
    const refresh = () => {
      setNow(Date.now());
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) throw new Error('Reward storage was removed. Reload to begin a new demo; current actions are blocked.');
        if (saved !== savedRef.current) {
          const next = parseStoredState(JSON.parse(saved));
          savedRef.current = saved;
          setState(next);
        }
        setStorageError(null);
      } catch (error) { setStorageError(errorMessage(error)); }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) refresh(); };
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('storage', onStorage); window.removeEventListener('focus', refresh); };
  }, [initial]);

  useEffect(() => {
    const currentTime = Date.now();
    const deadlines = [
      ...state.entitlements.map(item => Date.parse(item.expiresAt)),
      ...state.ledger.flatMap(entry => entry.expiresAt ? [Date.parse(entry.expiresAt)] : []),
    ].filter(at => at > currentTime);
    const nextDay = new Date(currentTime);
    nextDay.setUTCHours(24, 0, 0, 0);
    const deadline = Math.min(nextDay.getTime(), ...deadlines);
    const timer = window.setTimeout(() => setNow(Date.now()), deadline - currentTime + 10);
    return () => window.clearTimeout(timer);
  }, [state, now]);

  const transact = (operation: (current: EconomyState, time: number) => { state: EconomyState; result: ActionResult }): ActionResult => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) throw new Error('Reward storage is unavailable. Reload before trying again.');
      let current: EconomyState;
      try {
        current = parseStoredState(JSON.parse(saved));
      } catch {
        current = createInitialState();
      }
      const time = Date.now();
      const next = operation(current, time);
      const serialized = JSON.stringify(next.state);
      if (next.result.ok) localStorage.setItem(STORAGE_KEY, serialized);
      savedRef.current = serialized;
      setState(next.state);
      setNow(time);
      setStorageError(null);
      return next.result;
    } catch (error) {
      const message = `Reward action blocked: ${errorMessage(error)}`;
      setStorageError(message);
      return { ok: false, message };
    }
  };
  const value: Rewards = {
    snapshot: getSnapshot(state, now), storageError,
    claimQuest: (id, evidence) => transact((current, time) => claim(current, id, evidence, time)),
    convertCredits: amount => transact((current, time) => convert(current, amount, time)),
    unlock: (feature, duration) => transact((current, time) => unlockFeature(current, feature, duration, time)),
    hasAccess: feature => hasFeatureAccess(state, feature, now),
    questAvailable: id => available(state, id, now),
    connectBroker: (brokerId, accountId) => transact(current => connect(current, brokerId, accountId)),
    claimMonthlyMilestone: () => transact((current, time) => milestone(current, time)),
    setDemoLevel: level => transact((current, time) => {
      const points = [0, 100, 300, 700][level - 1];
      const entry = { id: `root-level-${time}`, kind: 'seed' as const, title: `Root demo level ${level}`, at: new Date(time).toISOString(), credits: 0, points, expiresAt: new Date(time + 31536000000).toISOString() };
      const ledger = current.ledger.filter(item => !item.id.startsWith('root-level-'));
      return { state: { ...current, ledger: [...ledger, entry] }, result: { ok: true, message: `Demo level changed to ${level}.` } };
    }),
  };
  return <RewardContext.Provider value={value}>
    {children}
  </RewardContext.Provider>;
}

export function useRewards() {
  const rewards = useContext(RewardContext);
  if (!rewards) throw new Error('useRewards must be used inside RewardProvider.');
  return rewards;
}
