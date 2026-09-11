import React from 'react';
import { ArrowLeft, Coins } from 'lucide-react';
import type { UserProfile } from '../types';
import { QUESTS, PREMIUM_FEATURES, getUnlockCost, type PremiumFeature } from '../features/rewards/economy';
import { useRewards } from '../features/rewards/RewardProvider';

interface CreditEarningGuideViewProps {
  user: UserProfile;
  onBackToMissions?: () => void;
}

export const CreditEarningGuideView: React.FC<CreditEarningGuideViewProps> = ({ onBackToMissions }) => {
  const { snapshot } = useRewards();
  return <div className="mx-auto max-w-5xl space-y-6 pb-12 text-[#0b1c30]">
    <button onClick={onBackToMissions} className="flex items-center gap-2 text-sm font-semibold text-[#5338ec]"><ArrowLeft className="h-4 w-4" />Back to rewards</button>
    <header className="rounded-2xl bg-[#5338ec] p-6 text-white"><Coins className="mb-3 h-8 w-8 text-[#c6f831]" /><p className="text-xs font-bold uppercase tracking-widest text-white/70">Beta exploration guide</p><h1 className="mt-2 text-3xl font-bold">Earn through learning, not clicking</h1><p className="mt-3 text-sm text-white/85">Your browser balance: {snapshot.credits} SydeCredits. No cash value, withdrawal or trading requirement.</p></header>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="p-5"><h2 className="text-xl font-bold">The live beta reward schedule</h2><p className="mt-2 text-sm text-slate-500">Research requires evidence and a completed learning check. Reusing identical work does not earn another reward.</p></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><caption className="sr-only">Validated beta quests and UTC earning limits</caption><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th scope="col" className="p-4">Activity</th><th scope="col" className="p-4">Credits</th><th scope="col" className="p-4">Limit</th></tr></thead><tbody className="divide-y divide-slate-100">{Object.entries(QUESTS).map(([id, quest]) => <tr key={id}><th scope="row" className="p-4 font-normal"><span className="font-semibold">{quest.title}</span><p className="mt-1 max-w-md text-xs text-slate-500">{quest.description}</p></th><td className="p-4 font-bold text-[#5338ec]">+{quest.credits}</td><td className="p-4 text-slate-500">{quest.limitLabel}</td></tr>)}</tbody></table></div>
      <p className="border-t border-slate-100 p-4 text-xs text-slate-500">Daily limits reset at 00:00 UTC. Weekly limits reset Monday at 00:00 UTC. The fixed amounts above are the active quest rewards, not illustrative catalogue estimates.</p>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">Spend on exactly what you need</h2><p className="mt-2 text-sm text-slate-500">Choose 1 hour, 1 day or 7 days in the rewards hub. Access is scoped to one named feature, not the entire screener or chart.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{(Object.keys(PREMIUM_FEATURES) as PremiumFeature[]).map(feature => <article key={feature} className="rounded-xl bg-purple-50 p-4"><h3 className="text-sm font-bold">{PREMIUM_FEATURES[feature].title}</h3><p className="mt-2 text-sm font-semibold text-[#5338ec]">{snapshot.level.level >= PREMIUM_FEATURES[feature].includedLevel ? 'Included with level · 0 Credits' : `${getUnlockCost(feature, '1d', snapshot.level.level)} Credits / 1 day at your level`}</p></article>)}</div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">Exact cost = daily price × duration factor (0.4 for 1 hour, 1 for 1 day, 4.5 for 7 days) × level factor (1 at LV1, 0.8 at LV2, 0.5 at LV3), rounded once to a whole Credit. Level-included features always cost 0. Review the exact price before confirming.</p>
    </section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">Good to know</h2><div className="mt-4 space-y-3">
      <details className="rounded-xl bg-slate-50 p-4" open><summary className="cursor-pointer font-semibold">Can I still convert Credits to Points?</summary><p className="mt-3 text-sm text-slate-600">Yes. 5 Credits = 1 Point. Only positive whole multiples of 5 are deducted; remaining Credits are preserved. Converted Points expire individually after 90 days. The conversion is one-way.</p></details>
      <details className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">What does not earn Credits?</summary><p className="mt-3 text-sm text-slate-600">Ad clicks, opening pages, changing filters, executing real trades and simulated broker connections earn none. D6 is a validated monthly milestone granting 10 Points and 0 Credits. The proposed 120-Credit verified-broker reward is pending backend support and is not claimable in this demo.</p></details>
      <details className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">Do Credits expire or become Cashback?</summary><p className="mt-3 text-sm text-slate-600">This beta has no scheduled Credit expiry. Browser data can be cleared or lost; it is not a secure financial ledger. Credits cannot be withdrawn or converted into Cashback. The 90-day expiry applies to Points, and each purchased feature has its own access deadline.</p></details>
      <details className="rounded-xl bg-slate-50 p-4"><summary className="cursor-pointer font-semibold">Can I repeat a research quest?</summary><p className="mt-3 text-sm text-slate-600">Yes, within the daily or weekly limit, with new validated evidence each time. Duplicate research submissions are rejected even after a period reset. Progress and claims are persisted locally in this browser.</p></details>
    </div></section>
    <p className="text-xs text-slate-500">Local beta only. No secure backend validation, real broker verification, trade execution or financial rewards are provided.</p>
  </div>;
};
