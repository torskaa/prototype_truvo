import React, { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import type { UserProfile } from '../types';
import { LEVELS, PREMIUM_FEATURES } from '../features/rewards/economy';
import { useRewards } from '../features/rewards/RewardProvider';

interface ViewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ViewPlanModal: React.FC<ViewPlanModalProps> = ({ isOpen, onClose }) => {
  const { snapshot } = useRewards();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen && !dialog.current?.open) dialog.current?.showModal();
    if (!isOpen && dialog.current?.open) dialog.current.close();
  }, [isOpen]);
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="member-plan-title" className="fixed inset-0 m-auto max-h-[90vh] w-[calc(100%_-_2rem)] max-w-4xl overflow-y-auto rounded-2xl bg-white p-0 text-[#0b1c30] shadow-2xl backdrop:bg-slate-900/60">
    <header className="flex items-start justify-between gap-3 bg-[#5338ec] p-6 text-white"><div><p className="text-xs font-bold uppercase tracking-widest text-white/70">Beta membership</p><h2 id="member-plan-title" className="mt-1 text-2xl font-bold">Four levels. More research access.</h2></div><button autoFocus onClick={onClose} aria-label="Close member levels" className="rounded-lg p-2 hover:bg-white/10"><X className="h-5 w-5" /></button></header>
    <div className="space-y-5 p-6">
      <div className="rounded-xl bg-purple-50 p-4"><p className="font-semibold text-[#5338ec]">LV{snapshot.level.level} {snapshot.level.name} · {snapshot.activePoints} active Points</p><p className="mt-1 text-xs text-slate-600">All Point grants expire individually after 90 days, including conversions. Level benefits follow your current active Points.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{LEVELS.map(level => <section key={level.level} className={`rounded-xl border p-4 ${snapshot.level.level === level.level ? 'border-[#5338ec] bg-purple-50' : 'border-slate-200'}`}>
        <p className="text-xs font-bold text-[#5338ec]">LV{level.level}{snapshot.level.level === level.level ? ' · CURRENT' : ''}</p><h3 className="mt-1 text-lg font-bold">{level.name}</h3><p className="mt-3 text-sm font-semibold">{level.minPoints}+ active Points</p>
        <p className="mt-3 text-sm font-semibold text-[#5338ec]">{['Full Credit price', '20% Credit discount', '50% Credit discount', 'All premium features included'][level.level - 1]}</p>
        <ul className="mt-4 space-y-3 text-xs text-slate-600">{Object.values(PREMIUM_FEATURES).map(feature => <li key={feature.title} className="flex items-start gap-1.5">{level.level >= feature.includedLevel && <Check className="h-4 w-4 shrink-0 text-green-700" />}<span>{feature.title}: {level.level >= feature.includedLevel ? 'included · 0 Credits' : `included at LV${feature.includedLevel}`}</span></li>)}</ul>
      </section>)}</div>
      <div className="grid gap-4 sm:grid-cols-2"><section className="rounded-xl bg-slate-50 p-4"><h3 className="font-bold">5 Credits = 1 Point stays</h3><p className="mt-2 text-sm text-slate-600">Convert positive whole multiples of 5 in the rewards hub. Unconverted Credits are preserved. New Points last 90 days; conversion is one-way.</p></section><section className="rounded-xl bg-lime-50 p-4"><h3 className="font-bold">Monthly D6 · 10 Points, 0 Credits</h3><p className="mt-2 text-sm text-slate-600">Complete all four research quest types across seven UTC days in the current UTC month, then validate and claim once that month.</p></section></div>
      <p className="text-xs leading-relaxed text-slate-500">Discounts apply only to premium features not already included with your level. If Points expire, your level may decrease. Unexpired purchased access remains valid. Cashback and partner rebate rules are separate and unchanged; these membership levels do not promise cash rebate boosts.</p>
    </div>
    <footer className="flex justify-end border-t border-slate-200 p-4"><button onClick={onClose} className="rounded-xl bg-[#5338ec] px-5 py-2.5 text-sm font-bold text-white">Done</button></footer>
  </dialog>;
};
