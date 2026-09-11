import React from 'react';
import { ArrowLeft, Gem } from 'lucide-react';
import type { UserProfile } from '../types';
import { LEVELS, PREMIUM_FEATURES } from '../features/rewards/economy';
import { useRewards } from '../features/rewards/RewardProvider';

interface LevelPointsGuideViewProps {
  user: UserProfile;
  onBackToMissions?: () => void;
}

export const LevelPointsGuideView: React.FC<LevelPointsGuideViewProps> = ({ onBackToMissions }) => {
  const { snapshot } = useRewards();
  return <div className="mx-auto max-w-5xl space-y-6 pb-12 text-[#0b1c30]">
    <button onClick={onBackToMissions} className="flex items-center gap-2 text-sm font-semibold text-[#5338ec]"><ArrowLeft className="h-4 w-4" />Back to rewards</button>
    <header className="rounded-2xl bg-[#5338ec] p-6 text-white">
      <Gem className="mb-3 h-8 w-8 text-[#c6f831]" />
      <p className="text-xs font-bold uppercase tracking-widest text-white/70">Beta membership guide</p>
      <h1 className="mt-2 text-3xl font-bold">Points build your member level</h1>
      <p className="mt-3 text-sm text-white/85">Your {snapshot.activePoints} active Points place you at LV{snapshot.level.level} {snapshot.level.name}.</p>
    </header>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Membership levels">
      {LEVELS.map(level => <article key={level.level} className={`rounded-2xl border p-5 ${snapshot.level.level === level.level ? 'border-[#5338ec] bg-purple-50' : 'border-slate-200 bg-white'}`}>
        <p className="text-xs font-bold text-[#5338ec]">LV{level.level}</p><h2 className="mt-1 text-lg font-bold">{level.name}</h2>
        <p className="mt-3 text-sm font-semibold">{level.minPoints}+ active Points</p>
        <p className="mt-2 text-xs text-slate-500">{level.nextPoints === null ? 'Highest beta level' : `Up to ${level.nextPoints - 1} Points`}</p>
      </article>)}
    </section>
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">Two ways to add Points</h2>
        <ul className="mt-4 space-y-4 text-sm text-slate-600">
          <li><strong className="text-[#5338ec]">5 Credits = 1 Point.</strong> Convert a positive whole multiple of 5. Unconverted Credits stay in your balance; conversion cannot be reversed.</li>
          <li><strong className="text-[#5338ec]">Validated monthly milestone (D6): +10 Points, 0 Credits.</strong> Complete all four research quest types across at least seven distinct UTC days in the current UTC month. Claim once per month from the rewards hub. Daily check-ins do not qualify.</li>
        </ul>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">A rolling 90-day balance</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">Every Point grant expires individually 90 days after it is awarded, including converted Points and the demo opening balance. New activity does not extend older grants. Your current active balance determines your level, not lifetime earnings.</p>
        <p className="mt-3 text-sm text-slate-600">{snapshot.nextExpiry ? `Next: ${snapshot.nextExpiry.points} Points expire on ${new Date(snapshot.nextExpiry.at).toLocaleString()}.` : 'You have no upcoming Point expiry.'}</p>
        <p className="mt-3 text-xs text-slate-500">Expiry can lower your level and remove level-included features. Separately purchased, unexpired feature access remains available until its own deadline.</p>
      </section>
    </div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-bold">What membership includes</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">{Object.values(PREMIUM_FEATURES).map(feature => <li key={feature.title}><strong>LV{feature.includedLevel}+:</strong> {feature.title} included at 0 Credits while your level qualifies.</li>)}</ul>
      <p className="mt-4 text-sm text-slate-600">For features not yet included: LV1 pays full price, LV2 saves 20%, and LV3 saves 50%. LV4 includes all three premium features.</p>
    </section>
    <aside className="rounded-xl bg-lime-50 p-4 text-sm leading-relaxed text-slate-600"><strong>Keep the currencies separate.</strong> Points measure membership; SydeCredits fund exploration and learning; Cashback follows separate partner rules. Real trades, broker connections, ad clicks and filter changes do not grant beta Points or Credits. This local browser demo is not a secure ledger or a promise of financial rewards.</aside>
  </div>;
};
