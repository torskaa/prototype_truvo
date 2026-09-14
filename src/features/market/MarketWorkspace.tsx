import { useState } from 'react';
import { Screener, initialRules, indexAsInstrument } from './views';
import { InstrumentDetail } from './components/market/instrument-detail';
import { TechnicalChartWorkspace } from './components/charts/technical-chart-workspace';
import { instruments, marketIndices } from './data/mock-market';
import type { Instrument, View, Visualization, Tier } from './types';
import type { Broker } from '../../types';
import { useRewards } from '../rewards/RewardProvider';
import { MarketEngagement } from './MarketEngagement';

export const marketViews = ['screener', 'instrument'];
export default function MarketWorkspace({ view, locationSearch, onNavigate, onToast, brokers, onConnectBroker, onCompareBrokers, onOpenRewards, onOpenPlans }: { view: string; locationSearch: string; onNavigate: (view: string, symbol?: string) => void; tierLevel: number; onToast: (message: string) => void; brokers: Broker[]; onConnectBroker: (broker: Broker, symbol?: string) => void; onCompareBrokers: () => void; onOpenRewards: () => void; onOpenPlans: () => void }) {
  const { snapshot } = useRewards();
  const symbol = new URLSearchParams(locationSearch).get('symbol');
  const index = marketIndices.find(item => item.symbol === symbol);
  const selectedInstrument = instruments.find(item => item.symbol === symbol) ?? (index ? indexAsInstrument(index) : undefined);
  const instrument = selectedInstrument ?? { symbol: '', name: 'Select an instrument', market: 'Market', sector: 'Market', price: 0, change: 0, volume: 0, rvol: 0, rsi: 0, return1m: 0, marketCap: 0, sentiment: 0, signal: 'NEUTRAL' as const, confidence: 0 };
  const hasSelectedInstrument = !!selectedInstrument;
  const [rules, setRules] = useState(initialRules);
  const [viz, setViz] = useState<Visualization>('Table');
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState(['Volume']);
  const [watchlist, setWatchlist] = useState<string[]>(['MSFT', 'BTC/USD']);
  const [chartOpen, setChartOpen] = useState(() => new URLSearchParams(locationSearch).get('mode') === 'chart' || view === 'chart');
  const [sharedChartBy, setSharedChartBy] = useState<string | null>(null);
  const [showLinkedTags, setShowLinkedTags] = useState(true);
  const tier: Tier = snapshot.level.level >= 4 ? 'PREMIUM' : snapshot.level.level >= 2 ? 'INTERMEDIATE' : 'BASIC';
  const navigate = (next: View) => onNavigate(next, instrument.symbol);
  const openInstrument = (item: Instrument) => onNavigate('instrument', item.symbol);
  const toggleWatch = (ticker: string) => {
    setWatchlist(current => current.includes(ticker) ? current.filter(item => item !== ticker) : [...current, ticker]);
    onToast('Market watchlist updated');
  };
  return <div className="market-feature min-w-0 rounded-2xl">
    <MarketEngagement view={view} instrument={instrument} symbols={instruments.map(item => item.symbol)} brokers={brokers} onConnectBroker={onConnectBroker} onCompareBrokers={onCompareBrokers} onOpenRewards={onOpenRewards} onOpenPlans={onOpenPlans} onNavigate={onNavigate}>
    {(view === 'screener' || (view === 'instrument' && !hasSelectedInstrument)) && <Screener tier={tier} rules={rules} setRules={setRules} results={instruments} viz={viz} setViz={setViz} openInstrument={openInstrument} openIndex={item => openInstrument(indexAsInstrument(item))} watchlist={watchlist} toggleWatch={toggleWatch} toast={onToast} />}
    {view === 'instrument' && hasSelectedInstrument && <InstrumentDetail key={instrument.symbol} instrument={instrument} chartOpen={chartOpen} showLinkedTags={showLinkedTags} onShowLinkedTagsChange={setShowLinkedTags} chartContent={<TechnicalChartWorkspace key={sharedChartBy ?? 'personal'} sharedBy={sharedChartBy ?? undefined} showLinkedTags={showLinkedTags} instrument={instrument} tier={tier} timeframe={timeframe} setTimeframe={setTimeframe} indicators={indicators} addIndicator={item => setIndicators(current => current.includes(item) ? current : [...current,item])} watchlist={watchlist} toggleWatch={() => toggleWatch(instrument.symbol)} createAlert={() => onToast(`Demo alert created for ${instrument.symbol}`)} inspectSignal={() => onNavigate('signals',instrument.symbol)} />} onCommunityChart={(name, tag) => { setSharedChartBy(name); setChartOpen(true); onToast(`Viewing ${name}'s shared ${instrument.symbol} chart`); window.setTimeout(() => { const marker=document.getElementById(`chart-${instrument.symbol.replaceAll('/', '-')}-${tag}`); marker?.scrollIntoView({behavior:'smooth',block:'center'}); marker?.querySelector<HTMLButtonElement>('button')?.click(); }, 250); }} onBack={() => onNavigate('screener')} onChart={() => { setSharedChartBy(null); setChartOpen(open => !open); }} onToast={onToast} />}
    </MarketEngagement>
  </div>;
}
