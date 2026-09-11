import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Clock, Coins, Gem, Sparkles, X } from 'lucide-react';
import type { UserProfile, Mission, ActivityLogItem, MarketSignal } from '../types';
import type { EarningRewardData } from './EarningRewardModal';
import { useRewards } from '../features/rewards/RewardProvider';
import {
  LEVELS, QUESTS, PREMIUM_FEATURES, getUnlockCost,
  type ActionResult, type PremiumFeature, type UnlockDuration, type QuestId,
} from '../features/rewards/economy';

interface PointsAndCreditsViewProps {
  user: UserProfile;
  missions?: Mission[];
  signals?: MarketSignal[];
  onUpdateUser?: (updatedUser: Partial<UserProfile>) => void;
  onUpdateMissions?: (updatedMissions: Mission[]) => void;
  onAddActivityLog?: (log: ActivityLogItem) => void;
  onOpenViewPlan: () => void;
  onOpenLevelPointsGuide?: () => void;
  onOpenCreditEarningGuide?: () => void;
  onOpenActivityLog: () => void;
  onNavigateToSignals: () => void;
  onSelectSignal?: (signal: MarketSignal) => void;
  onOpenConnectModal?: () => void;
  onNavigateToMarket?: (view: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onTriggerEarningModal?: (data: EarningRewardData) => void;
}

const researchRoutes: { id: QuestId; view: string; label: string }[] = [
  { id: 'screener-research', view: 'screener', label: 'Screener' },
  { id: 'instrument-research', view: 'instrument', label: 'Instrument research' },
  { id: 'chart-risk', view: 'instrument', label: 'Instrument risk planner' },
];
const durations: { id: UnlockDuration; label: string }[] = [
  { id: '1h', label: '1 hour' }, { id: '1d', label: '1 day' }, { id: '7d', label: '7 days' },
];
const features = Object.keys(PREMIUM_FEATURES) as PremiumFeature[];
const button = 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#5338ec] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-50';
const secondary = 'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50';
const dateLabel = (date: string) => new Date(date).toLocaleString();

export const PointsAndCreditsView: React.FC<PointsAndCreditsViewProps> = ({
  onOpenViewPlan, onOpenLevelPointsGuide, onOpenCreditEarningGuide,
  onOpenActivityLog, onNavigateToSignals, onOpenConnectModal, onNavigateToMarket,
}) => {
  const { snapshot, claimQuest, questAvailable, convertCredits, unlock, hasAccess, claimMonthlyMilestone } = useRewards();
  const [amount, setAmount] = useState('5');
  const [result, setResult] = useState<ActionResult | null>(null);
  const [duration, setDuration] = useState<UnlockDuration>('1d');
  const [purchase, setPurchase] = useState<{ feature: PremiumFeature; duration: UnlockDuration; price: number } | null>(null);
  const purchaseDialog = useRef<HTMLDialogElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const { level, credits, activePoints, nextExpiry } = snapshot;
  const progress = level.nextPoints === null ? 100 : Math.min(100, Math.max(0, (activePoints - level.minPoints) / (level.nextPoints - level.minPoints) * 100));
  const conversion = Number(amount);
  const validConversion = Number.isSafeInteger(conversion) && conversion >= 5 && conversion % 5 === 0;
  const month = new Date().toISOString().slice(0, 7);
  const monthResearch = snapshot.ledger.filter(entry => entry.kind === 'quest' && entry.at.startsWith(month) && entry.title !== QUESTS['daily-checkin'].title);
  const researchTypes = new Set(monthResearch.map(entry => entry.title)).size;
  const researchDays = new Set(monthResearch.map(entry => entry.at.slice(0, 10))).size;
  const milestoneClaimed = snapshot.ledger.some(entry => entry.id === `milestone:monthly:${month}`);

  useEffect(() => {
    if (purchase && !purchaseDialog.current?.open) purchaseDialog.current?.showModal();
    if (!purchase && purchaseDialog.current?.open) purchaseDialog.current.close();
  }, [purchase]);

  useEffect(() => {
    if (result) {
      feedback.current?.focus({ preventScroll: true });
      feedback.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [result]);

  const confirmPurchase = () => {
    if (!purchase) return;
    const currentPrice = getUnlockCost(purchase.feature, purchase.duration, level.level);
    if (currentPrice !== purchase.price) {
      setResult({ ok: false, message: 'Your level changed. Review the updated price before confirming access.' });
    } else {
      setResult(unlock(purchase.feature, purchase.duration));
    }
    setPurchase(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-12 text-[#0b1c30]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#5338ec]">Your research, rewarded · Beta</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Points &amp; SydeCredits</h1>
          <p className="mt-2 text-sm text-slate-500">Explore with purpose. Learn at your pace. Unlock more insight.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className={secondary} onClick={onOpenViewPlan}>View member levels</button>
          <button className={secondary} onClick={onOpenActivityLog}>Activity log</button>
        </div>
      </header>

      <p className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-xs leading-relaxed text-purple-900">
        Local beta demo: balances, evidence and access are saved in this browser, not a secure backend ledger.
        No real money, broker verification or automatic trade tracking. Clearing browser data resets the demo.
      </p>
      {result && <div ref={feedback} tabIndex={-1} role="status" aria-live="polite" className={`rounded-xl border p-4 text-sm ${result.ok ? 'border-lime-300 bg-lime-50 text-lime-900' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{result.message}</div>}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl bg-[#5338ec] p-6 text-white lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-sm font-medium"><Gem className="h-5 w-5 text-[#c6f831]" /> Active membership Points</span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">LV{level.level} · {level.name}</span>
          </div>
          <div className="mt-4 text-5xl font-bold tabular-nums">{activePoints.toLocaleString()} <span className="text-base font-normal text-white/70">Points</span></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Progress to next membership level" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-[#c6f831]" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-white/85">{level.nextPoints === null ? 'All premium beta features included with your current level.' : `${level.nextPoints - activePoints} active Points to LV${level.level + 1}`}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LEVELS.map(item => <div key={item.level} className={`rounded-xl p-3 text-xs ${item.level === level.level ? 'bg-white text-[#5338ec]' : 'bg-white/10'}`}><strong className="block">LV{item.level} {item.name}</strong><span>{item.minPoints}+ Points</span></div>)}
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/80"><Clock className="h-4 w-4 shrink-0" />{nextExpiry ? `Next expiry: ${nextExpiry.points} Points on ${dateLabel(nextExpiry.at)}. ` : 'No upcoming Point expiry. '}Every grant, including conversions, expires individually after 90 days. Your level can decrease.</p>
          <button className="mt-3 text-sm font-semibold text-[#c6f831] underline underline-offset-4" onClick={onOpenLevelPointsGuide ?? onOpenViewPlan}>How Points work</button>
        </section>
        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Coins className="h-5 w-5 text-[#5338ec]" /> SydeCredits</span>
          <div className="mt-4 text-5xl font-bold tabular-nums">{credits.toLocaleString()}</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">Earn through validated exploration and learning. Spend on scoped premium access or convert to membership Points.</p>
          <div className="mt-5 rounded-xl bg-[#f4f2ff] p-3 text-sm"><strong>Cashback is separate.</strong><p className="mt-1 text-xs text-slate-500">Cash rebates follow separate partner rules. Credits and Points are not cash or withdrawable funds.</p></div>
          <button className="mt-5 text-left text-sm font-semibold text-[#5338ec] underline underline-offset-4" onClick={onOpenCreditEarningGuide ?? onOpenActivityLog}>Credit earning guide</button>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-bold">Your research journey</h2><p className="mt-1 text-sm text-slate-500">Only completed, validated work earns rewards. Opening pages, ads or filters does not.</p></div>
          <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-900">UTC daily / weekly limits</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#f4f2ff] p-4">
          <div><h3 className="font-bold">{QUESTS['daily-checkin'].title}</h3><p className="mt-1 text-xs text-slate-500">+20 Credits · Once per UTC day · Resets at 00:00 UTC</p></div>
          <button className={button} disabled={!questAvailable('daily-checkin')} onClick={() => setResult(claimQuest('daily-checkin', {}))}>{questAvailable('daily-checkin') ? 'Claim 20 Credits' : 'Claimed today'}</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {researchRoutes.map(({ id, view, label }) => <article key={id} className="flex flex-col rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3"><h3 className="font-bold">{QUESTS[id].title}</h3><span className="shrink-0 text-sm font-bold text-[#5338ec]">+{QUESTS[id].credits} C</span></div>
            <p className="mt-2 flex-1 text-sm text-slate-500">{QUESTS[id].description}</p>
            <p className="mt-3 text-xs font-medium text-slate-500">{QUESTS[id].limitLabel}{questAvailable(id) ? ' · Reward available' : ' · Period limit reached'}</p>
            <button className={`${secondary} mt-4 flex items-center justify-between gap-2 disabled:opacity-50`} disabled={!onNavigateToMarket} onClick={() => onNavigateToMarket?.(view)}>Open {label}<ArrowRight className="h-4 w-4" /></button>
          </article>)}
        </div>
        <div className="mt-4 rounded-xl border border-lime-300 bg-lime-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h3 className="flex items-center gap-2 font-bold"><Sparkles className="h-5 w-5 text-[#5338ec]" /> Monthly exploration journey · D6</h3><p className="mt-2 text-sm text-slate-600">Complete all four research quest types across at least seven distinct UTC days in the current UTC month.</p></div>
            <button className={button} disabled={milestoneClaimed} onClick={() => setResult(claimMonthlyMilestone())}>{milestoneClaimed ? 'Claimed this month' : 'Validate & claim 10 Points'}</button>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-600">{Math.min(4, researchTypes)}/4 research types · {Math.min(7, researchDays)}/7 UTC days · +10 Points, 0 Credits · Once per month</p>
          <p className="mt-1 text-xs text-slate-500">Daily check-ins do not count. Progress reflects this browser’s research ledger; validation checks the recorded evidence.</p>
        </div>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold">Keep the 5:1 conversion</h2>
          <p className="mt-2 text-sm text-slate-500">5 Credits = 1 Point. Choose a positive whole multiple of 5; any unconverted Credits stay in your balance.</p>
          <form className="mt-4 space-y-3" onSubmit={event => { event.preventDefault(); setResult(convertCredits(Number(amount))); }}>
            <label htmlFor="reward-conversion" className="block text-sm font-semibold">Credits to convert</label>
            <input id="reward-conversion" type="number" min="5" step="5" required value={amount} onChange={event => setAmount(event.target.value)} className="w-full rounded-xl border border-slate-300 p-3" aria-describedby="conversion-preview" />
            <button type="button" className="text-xs font-semibold text-[#5338ec] underline" onClick={() => setAmount(String(Math.floor(credits / 5) * 5))}>Use available multiples of 5</button>
            <p id="conversion-preview" className="text-xs text-slate-500">{validConversion ? `Receive ${conversion / 5} Points, active for 90 days.${conversion <= credits ? ` Keep ${credits - conversion} Credits.` : ' Not enough Credits.'}` : 'Enter a positive whole multiple of 5. No remainder is deducted.'}</p>
            <button className={`${button} w-full`} type="submit">Convert Credits to Points</button>
          </form>
          <p className="mt-3 text-xs text-slate-500">Conversion is one-way. Points cannot be converted back to Credits.</p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Unlock deeper research</h2><p className="mt-1 text-sm text-slate-500">Feature-specific access. Never a whole-page purchase.</p></div>
            <label className="text-xs font-semibold">Access duration<select value={duration} onChange={event => setDuration(event.target.value as UnlockDuration)} className="ml-2 rounded-lg border border-slate-200 p-2 text-sm">{durations.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          </div>
          <div className="mt-4 space-y-3">{features.map(feature => {
            const included = level.level >= PREMIUM_FEATURES[feature].includedLevel;
            const entitlement = snapshot.entitlements.find(item => item.feature === feature);
            const price = getUnlockCost(feature, duration, level.level);
            return <div key={feature} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
              <div><h3 className="font-semibold">{PREMIUM_FEATURES[feature].title}</h3><p className="mt-1 text-xs text-slate-500">Included from LV{PREMIUM_FEATURES[feature].includedLevel}</p>{!included && entitlement && <p className="mt-1 text-xs text-[#5338ec]">Access expires {dateLabel(entitlement.expiresAt)}</p>}</div>
              {included ? <span className="flex items-center gap-1 text-sm font-semibold text-[#5338ec]"><Check className="h-4 w-4" />Included with level · 0 C</span> : hasAccess(feature) ? <span className="text-sm font-semibold text-green-700">Access active</span> : <button className={button} onClick={() => setPurchase({ feature, duration, price })}>Review unlock · {price} C</button>}
            </div>;
          })}</div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">LV1: full price · LV2: 20% off · LV3: 50% off · LV4: all included. Exact prices round the full daily-price × duration × level-discount calculation to a whole Credit. Level-included access lasts while your active Points qualify.</p>
        </section>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Recent reward activity</h2><button onClick={onOpenActivityLog} className="text-sm font-semibold text-[#5338ec]">View all</button></div>
        <ul className="mt-3 divide-y divide-slate-100">{snapshot.ledger.slice(0, 5).map(entry => <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><div><p className="font-medium">{entry.title}</p><p className="mt-1 text-xs text-slate-500">{dateLabel(entry.at)}{entry.expiresAt ? ` · Points expire ${dateLabel(entry.expiresAt)}` : ''}</p></div><span className="font-semibold tabular-nums text-[#5338ec]">{entry.credits > 0 ? '+' : ''}{entry.credits} C · {entry.points > 0 ? '+' : ''}{entry.points} P</span></li>)}</ul>
        {snapshot.ledger.length === 0 && <p className="mt-4 text-sm text-slate-500">No reward activity yet.</p>}
      </section>
      <footer className="flex flex-wrap gap-3"><button className={secondary} onClick={onNavigateToSignals}>Explore signals</button>{onOpenConnectModal && <button className={secondary} onClick={onOpenConnectModal}>Manage demo broker connection · 0 rewards</button>}</footer>
      <dialog ref={purchaseDialog} onCancel={() => setPurchase(null)} onClose={() => setPurchase(null)} className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md rounded-2xl bg-white p-6 text-[#0b1c30] shadow-2xl backdrop:bg-slate-900/60" aria-labelledby="reward-unlock-title">
        {purchase && <><div className="flex items-start justify-between gap-3"><h2 id="reward-unlock-title" className="text-xl font-bold">Confirm feature access</h2><button aria-label="Close unlock confirmation" onClick={() => setPurchase(null)} className="rounded-lg p-1"><X className="h-5 w-5" /></button></div>
          <p className="mt-4 font-semibold">{PREMIUM_FEATURES[purchase.feature].title}</p>
          <p className="mt-2 text-sm text-slate-600">{durations.find(item => item.id === purchase.duration)?.label} of access from confirmation for exactly <strong>{purchase.price} Credits</strong>.</p>
          <p className="mt-2 text-xs text-slate-500">Only this feature unlocks. No Points are awarded and no cash is charged. Remaining Credits: {Math.max(0, credits - purchase.price)}.</p>
          {purchase.price > credits && <p role="alert" className="mt-3 text-sm text-rose-700">You need {purchase.price - credits} more Credits.</p>}
          <div className="mt-5 flex flex-wrap justify-end gap-2"><button autoFocus className={secondary} onClick={() => setPurchase(null)}>Cancel</button><button className={button} onClick={confirmPurchase}>Confirm · {purchase.price} Credits</button></div>
        </>}
      </dialog>
    </div>
  );
};
