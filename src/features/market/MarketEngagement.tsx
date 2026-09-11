import { createContext, useContext, useState, type ReactNode } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import type { Broker } from '../../types';
import { useRewards } from '../rewards/RewardProvider';
import { estimatePoints, getUnlockCost, PREMIUM_FEATURES, QUESTS, type PremiumFeature, type QuestEvidence, type QuestId, type UnlockDuration } from '../rewards/economy';
import type { Instrument } from './types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './components/ui/dialog';

type QuestRequest = { id: QuestId; symbols: string[] };
type Engagement = {
  brokers: Broker[];
  symbol: string;
  requestQuest: (id: QuestId, symbols?: string[]) => void;
  requestUnlock: (feature: PremiumFeature) => void;
  openBrokerAccess: () => void;
  connect: (broker: Broker) => void;
  compare: () => void;
  estimate: () => void;
  navigateSymbol: (symbol: string) => void;
};
const EngagementContext = createContext<Engagement | null>(null);
export function useMarketEngagement() {
  const value = useContext(EngagementContext);
  if (!value) throw new Error('Market engagement requires MarketEngagement');
  return value;
}
const terms = 'Illustrative campaign; no active offer/verification. Product and region eligibility must be checked.';
const field = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100';
const dateLabel = (value: string) => new Date(value).toLocaleString();

export function MarketEngagement({ children, view, instrument, symbols, brokers, onConnectBroker, onCompareBrokers, onOpenRewards, onOpenPlans, onNavigate }: {
  children: ReactNode; view: string; instrument: Instrument; symbols: string[]; brokers: Broker[];
  onConnectBroker: (broker: Broker, symbol?: string) => void; onCompareBrokers: () => void;
  onOpenRewards: () => void; onOpenPlans: () => void; onNavigate: (view: string, symbol?: string) => void;
}) {
  const [quest, setQuest] = useState<QuestRequest | null>(null);
  const [purchase, setPurchase] = useState<PremiumFeature | null>(null);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [estimatorOpen, setEstimatorOpen] = useState(false);
  const requestQuest = (id: QuestId, choices = symbols) => setQuest({ id, symbols: choices });
  const connect = (broker: Broker) => { setBrokerOpen(false); onConnectBroker(broker, instrument.symbol); };
  const value: Engagement = { brokers, symbol: instrument.symbol, requestQuest, requestUnlock: setPurchase, openBrokerAccess: () => setBrokerOpen(true), connect, compare: () => { setBrokerOpen(false); onCompareBrokers(); }, estimate: () => setEstimatorOpen(true), navigateSymbol: symbol => onNavigate('instrument', symbol) };
  return <EngagementContext.Provider value={value}>
    {children}
    {view !== 'instrument' && <div className="mt-5"><SponsoredExample /></div>}
    {quest && <QuestDialog key={`${quest.id}-${quest.symbols.join(',')}`} request={quest} instrument={instrument} onClose={() => setQuest(null)} />}
    {purchase && <UnlockDialog key={purchase} feature={purchase} onClose={() => setPurchase(null)} onPlans={() => { setPurchase(null); onOpenPlans(); }} />}
    <Dialog open={brokerOpen} onOpenChange={setBrokerOpen}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"><DialogTitle>Broker access · {instrument.symbol}</DialogTitle><DialogDescription>Compare account conditions and product availability.</DialogDescription><BrokerDirectory /><p className="text-xs text-slate-500">{terms}</p></DialogContent></Dialog>
    <Dialog open={estimatorOpen} onOpenChange={setEstimatorOpen}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg"><DialogTitle>Hypothetical points estimator</DialogTitle><DialogDescription>Preview the calculation only. No points, credits, or cashback are awarded.</DialogDescription><PointsEstimator /></DialogContent></Dialog>
  </EngagementContext.Provider>;
}

export function BrokerDirectory() {
  const { brokers, symbol, connect, compare } = useMarketEngagement();
  const { snapshot } = useRewards();
  return <div className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-slate-500">Host broker directory · not ranked by sponsorship</p><button className="secondary" onClick={compare}>Compare broker conditions</button></div>
    <div className="grid gap-3 sm:grid-cols-2">{brokers.map(broker => {
      const connected = snapshot.connections.some(connection => connection.brokerId === broker.id);
      return <article key={broker.id} className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2"><b className="text-sm text-slate-800">{broker.name}</b><span className={`rounded-full px-2 py-1 text-[10px] ${connected ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>{connected ? 'Connected' : 'Not connected'}</span></div>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]"><div><dt className="text-slate-500">Illustrative spread</dt><dd className="text-slate-800">{broker.spreadFrom}</dd></div><div><dt className="text-slate-500">Illustrative minimum</dt><dd className="text-slate-800">{broker.minDeposit}</dd></div><div className="col-span-2"><dt className="text-slate-500">Listed platforms (unverified)</dt><dd className="text-slate-800">{broker.platforms.join(', ')}</dd></div></dl>
        <p className="mt-2 text-[10px] text-slate-500">{symbol} access and jurisdiction eligibility.</p>
        <button className="primary mt-3 w-full justify-center" onClick={() => connect(broker)}>{connected ? 'Manage account' : 'Connect account'}<ArrowRight size={13} /></button>
      </article>;
    })}</div>
    {!brokers.length && <p role="status" className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">No brokers are currently available.</p>}
  </div>;
}

export function SponsoredExample() {
  const { brokers, symbol, openBrokerAccess, compare, estimate } = useMarketEngagement();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return <div className="py-2 text-right"><button className="text-[11px] text-slate-500 underline" onClick={() => setDismissed(false)}>Show sponsored example</button></div>;
  return <aside aria-label="Sponsored example" className="relative rounded-xl border border-violet-200 bg-violet-50/60 p-4">
    <button aria-label="Dismiss sponsored example" className="absolute right-2 top-2 rounded p-1 text-slate-500 hover:bg-violet-100" onClick={() => setDismissed(true)}><X size={15} /></button>
    <div className="flex flex-wrap items-center justify-between gap-4 pr-4"><div className="max-w-xl"><span className="text-[10px] font-bold uppercase tracking-widest text-violet-700">Sponsored example</span><h3 className="mt-1 text-sm font-semibold text-slate-900">Understand partner conditions before connecting</h3><p className="mt-1 text-xs text-slate-600">{symbol} research context · {brokers.length ? brokers.map(broker => broker.name).slice(0, 3).join(' / ') : 'No host partners listed'}. Research results are independent of sponsorship.</p></div><div className="flex flex-wrap gap-2"><button className="secondary" onClick={compare}>Compare conditions</button><button className="primary" onClick={openBrokerAccess}>Broker access<ArrowRight size={13} /></button><button className="secondary" onClick={estimate}>Points example</button></div></div>
    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{terms} Hypothetical boosts: partner 1.20× · campaign 1.25× · consistency 1.05× · capped at 2.00×. Points are not cashback. No reward for ad clicks, account connection, or trades.</p>
  </aside>;
}

function QuestDialog({ request, instrument, onClose }: { request: QuestRequest; instrument: Instrument; onClose: () => void }) {
  const { claimQuest, questAvailable } = useRewards();
  const { brokers } = useMarketEngagement();
  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [entry, setEntry] = useState(String(instrument.price));
  const [stop, setStop] = useState('');
  const [budget, setBudget] = useState('');
  const [riskPercent, setRiskPercent] = useState('1');
  const [completed, setCompleted] = useState(false);
  const isChart = request.id === 'chart-risk';
  const isBroker = request.id === 'instrument-research';
  const isScreener = request.id === 'screener-research';
  const choices = isBroker ? brokers.map(broker => ({ id: broker.id, label: broker.name })) : [...new Set(request.symbols)].map(symbol => ({ id: symbol, label: symbol }));
  const question = isChart ? 'What does this position-sizing exercise do?' : isBroker ? 'What must you check before choosing a broker?' : isScreener ? 'What does a screener match mean?' : 'Does market momentum predict the next price move?';
  const answers = isChart ? [['simulation-only', 'An educational simulation; it does not execute a trade'], ['execute', 'It submits an order to the broker']] : isBroker ? [['costs-and-eligibility', 'Total costs, product conditions, and regional eligibility'], ['boost-only', 'Only the largest reward multiplier']] : isScreener ? [['not-a-recommendation', 'It meets chosen criteria; it is not a recommendation'], ['buy', 'It is a recommendation to buy']] : [['not-a-prediction', 'No. A historical snapshot is not a prediction'], ['guarantee', 'Yes. Momentum guarantees future returns']];
  const values = { entry: Number(entry), stop: Number(stop), budget: Number(budget), riskPercent: Number(riskPercent) };
  const validSizing = Object.values(values).every(value => Number.isFinite(value) && value > 0) && values.entry !== values.stop && values.riskPercent <= 2;
  const riskAmount = values.budget * values.riskPercent / 100;
  const units = riskAmount / Math.abs(values.entry - values.stop);
  const submit = () => {
    const evidence: QuestEvidence = { symbols: selected, note, answer, ...(isChart ? values : {}) };
    const result = claimQuest(request.id, evidence);
    setMessage(result.message);
    if (result.ok) setCompleted(true);
  };
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
    <DialogTitle className="pr-6">{QUESTS[request.id].title}</DialogTitle>
    <DialogDescription>{QUESTS[request.id].description}</DialogDescription>
    <div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-700">+{QUESTS[request.id].credits} credits</span><span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{QUESTS[request.id].limitLabel}</span><span className="px-1 py-1 text-slate-500">{questAvailable(request.id) ? 'Available' : 'Completed for this period'}</span></div>
    <form className="space-y-4" onSubmit={event => { event.preventDefault(); submit(); }}>
      {isChart ? <><div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">Review position sizing for <b>{instrument.symbol}</b> using a budget and a risk limit of up to 2%. Fees, slippage, leverage, and contract multipliers are excluded.</div><div className="grid grid-cols-2 gap-3">{[['Entry price', entry, setEntry], ['Stop price', stop, setStop], ['Budget', budget, setBudget], ['Risk limit (%)', riskPercent, setRiskPercent]].map(([label, value, setter]) => <label key={label as string} className="text-xs font-medium text-slate-700">{label as string}<input className={field} type="number" step="any" min="0" max={label === 'Risk limit (%)' ? 2 : undefined} value={value as string} onChange={event => (setter as (value: string) => void)(event.target.value)} required /></label>)}</div>{validSizing && <output className="block rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-800">Risk budget: {riskAmount.toFixed(2)} · size: {units.toFixed(4)} units.<span className="mt-1 block text-xs">Actual losses can exceed a stop.</span></output>}</> : <fieldset><legend className="mb-2 text-xs font-semibold text-slate-700">Select {isBroker || isScreener ? 'at least two' : 'at least one'} {isBroker ? 'brokers to compare' : 'research symbols'}</legend><div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto">{choices.map(choice => <label key={choice.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs ${selected.includes(choice.id) ? 'border-violet-300 bg-violet-50 text-violet-800' : 'border-slate-200 text-slate-600'}`}><input type="checkbox" checked={selected.includes(choice.id)} onChange={event => setSelected(current => event.target.checked ? [...current, choice.id] : current.filter(id => id !== choice.id))} />{choice.label}</label>)}</div>{!choices.length && <p className="text-xs text-amber-700">No candidates in the current selection. Adjust the research filters first.</p>}</fieldset>}
      {isBroker && <div className="grid gap-2 sm:grid-cols-2">{brokers.filter(broker => selected.includes(broker.id)).map(broker => <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600" key={broker.id}><b>{broker.name}</b><p className="mt-1">Illustrative spread: {broker.spreadFrom} · minimum: {broker.minDeposit}</p><p>Listed platforms: {broker.platforms.join(', ')}</p><p className="mt-1">Unverified demo conditions; confirm costs and eligibility independently.</p></div>)}</div>}
      <label className="block text-xs font-semibold text-slate-700">{isChart ? 'Explain your risk limit and one limitation of the simulation' : isBroker ? 'Compare costs and identify what eligibility you still need to check' : isScreener ? 'Compare your selected results and document a limitation of your criteria' : 'Record an observation and explain one uncertainty in the market snapshot'}<textarea className={`${field} min-h-24`} minLength={30} maxLength={2000} required value={note} onChange={event => setNote(event.target.value)} placeholder="Write your own research note (at least 30 characters)." /><span className="mt-1 block text-[10px] font-normal text-slate-500">{note.trim().length}/30 minimum · identical evidence cannot earn again</span></label>
      <label className="block text-xs font-semibold text-slate-700">{question}<select className={field} required value={answer} onChange={event => setAnswer(event.target.value)}><option value="">Choose a checkpoint answer</option>{answers.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
      {message && <p role="status" className="rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{message}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="max-w-sm text-[10px] text-slate-500">Fixed award, not multiplied. No credits for browsing, filters, watchlists, clicks, or executing trades.</p><button type="submit" className="primary" disabled={completed || !questAvailable(request.id)}>{completed ? 'Research submitted' : 'Submit research for review'}<ArrowRight size={14} /></button></div>
    </form>
  </DialogContent></Dialog>;
}

function UnlockDialog({ feature, onClose, onPlans }: { feature: PremiumFeature; onClose: () => void; onPlans: () => void }) {
  const { snapshot, hasAccess, unlock } = useRewards();
  const [duration, setDuration] = useState<UnlockDuration>('1d');
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const active = hasAccess(feature);
  const cost = getUnlockCost(feature, duration, snapshot.level.level);
  const entitlement = snapshot.entitlements.find(item => item.feature === feature && new Date(item.expiresAt).getTime() > Date.now());
  const expiry = new Date(Date.now() + ({ '1h': 3600000, '1d': 86400000, '7d': 604800000 }[duration])).toISOString();
  const included = snapshot.level.level >= PREMIUM_FEATURES[feature].includedLevel;
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
    <DialogTitle className="pr-6">{PREMIUM_FEATURES[feature].title}</DialogTitle><DialogDescription>Use credits to unlock this tool. Other premium features remain separate.</DialogDescription>
    <div className="rounded-xl bg-violet-50 p-4"><div className="flex items-center gap-2 text-violet-700"><Sparkles size={18} /><b>{active ? 'Access active' : 'Choose your access window'}</b></div><p className="mt-2 text-xs text-slate-600">{included ? `Included with Level ${snapshot.level.level}. No credit deduction.` : entitlement ? `Unlocked until ${dateLabel(entitlement.expiresAt)}. You will not be charged again while active.` : `Level ${snapshot.level.level} pricing · ${snapshot.credits} C available. No cash payment.`}</p></div>
    {!active && <><label className="text-xs font-semibold text-slate-700">Duration<select className={field} value={duration} onChange={event => { setDuration(event.target.value as UnlockDuration); setConfirmed(false); }}>{(['1h', '1d', '7d'] as UnlockDuration[]).map(value => <option value={value} key={value}>{value === '1h' ? '1 hour' : value === '1d' ? '1 day' : '7 days'} · {getUnlockCost(feature, value, snapshot.level.level)} C</option>)}</select></label><div className="flex justify-between rounded-lg border border-slate-200 p-3 text-sm"><span>Credit deduction</span><b className="text-violet-700">{cost} C</b></div><p className="text-xs text-slate-500">Estimated expiry: {dateLabel(expiry)}. Starts on confirmation; no automatic renewal. Access ends at expiry unless included in your level.</p><label className="flex items-start gap-2 text-xs text-slate-700"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} />I confirm spending {cost} credits for {duration} of {PREMIUM_FEATURES[feature].title}.</label><button disabled={!confirmed} className="primary justify-center" onClick={() => { const result = unlock(feature, duration); setMessage(result.message); }}>{snapshot.credits < cost ? 'Confirm · check credit balance' : `Confirm unlock · ${cost} C`}</button></>}
    {message && <p role="status" className="rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{message}</p>}
    <div className="flex justify-between gap-2"><button className="secondary" onClick={onPlans}>View level benefits</button><button className="secondary" onClick={onClose}>{active ? 'Continue research' : 'Cancel'}</button></div>
  </DialogContent></Dialog>;
}

function PointsEstimator() {
  const [pointValue, setPointValue] = useState('100');
  let result: ReturnType<typeof estimatePoints> | null = null;
  let error = '';
  try {
    if (!pointValue.trim()) throw new Error('Enter a normalized Point Value.');
    result = estimatePoints(Number(pointValue), 1.2, 1.25, 1.05);
  } catch (reason) { error = reason instanceof Error ? reason.message : 'Invalid Point Value'; }
  return <div className="space-y-3"><label className="block text-xs font-semibold text-slate-700">Normalized Point Value (not a deposit or trade amount)<input className={field} type="number" min="0" step="any" value={pointValue} onChange={event => setPointValue(event.target.value)} /></label><p className="text-xs text-slate-600">Hypothetical partner 1.20× × campaign 1.25× × consistency 1.05×. Combined multiplier capped at 2.00×.</p>{result && <output className="block rounded-xl bg-violet-50 p-4 text-violet-800"><b>{result.total.toLocaleString()} hypothetical points</b><span className="mt-1 block text-xs">Base {result.base.toLocaleString()} · multiplier {result.multiplier.toFixed(3)}× · {result.capped ? 'cap applied' : 'below cap'}</span></output>}{error && <p role="status" className="text-sm text-amber-700">{error}</p>}<p className="text-xs text-slate-500">{terms} This is not a cashback estimate or a promise of earnings.</p></div>;
}
