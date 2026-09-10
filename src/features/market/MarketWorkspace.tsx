import { useState } from 'react';
import { Explorer, Screener, initialRules, indexAsInstrument } from './views';
import { InstrumentDetail } from './components/market/instrument-detail';
import { TechnicalChartWorkspace } from './components/charts/technical-chart-workspace';
import { instruments, marketIndices } from './data/mock-market';
import type { Instrument, View, Visualization, Tier } from './types';

export const marketViews = ['explorer', 'screener', 'instrument', 'chart'];
export default function MarketWorkspace({ view, locationSearch, onNavigate, tierLevel, onToast }: { view: string; locationSearch: string; onNavigate: (view: string, symbol?: string) => void; tierLevel: number; onToast: (message: string) => void }) {
  const symbol = new URLSearchParams(locationSearch).get('symbol');
  const index = marketIndices.find(item => item.symbol === symbol);
  const instrument = instruments.find(item => item.symbol === symbol) ?? (index ? indexAsInstrument(index) : instruments[0]);
  const [rules, setRules] = useState(initialRules);
  const [viz, setViz] = useState<Visualization>('Table');
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState(['Volume']);
  const [watchlist, setWatchlist] = useState<string[]>(['MSFT', 'BTC/USD']);
  const tier: Tier = tierLevel >= 3 ? 'PREMIUM' : tierLevel >= 2 ? 'INTERMEDIATE' : 'BASIC';
  const navigate = (next: View) => onNavigate(next, instrument.symbol);
  const openInstrument = (item: Instrument) => onNavigate('instrument', item.symbol);
  const toggleWatch = (ticker: string) => {
    setWatchlist(current => current.includes(ticker) ? current.filter(item => item !== ticker) : [...current, ticker]);
    onToast('Market watchlist updated');
  };
  return <div className="market-feature min-w-0 rounded-2xl">
    <nav aria-label="Market tools" className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2">
      {([['explorer','Market Explorer'],['screener','Market Screener'],['instrument',instrument.symbol],['chart','Advanced Chart']] as const).map(([id,label]) => <button key={id} onClick={() => onNavigate(id,instrument.symbol)} aria-current={view === id ? 'page' : undefined} className={`rounded-lg px-4 py-2 text-sm font-medium ${view === id ? 'bg-violet-100 text-violet-700' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</button>)}
    </nav>
    {view === 'explorer' && <Explorer navigate={navigate} openInstrument={openInstrument} />}
    {view === 'screener' && <Screener tier={tier} rules={rules} setRules={setRules} results={instruments} viz={viz} setViz={setViz} openInstrument={openInstrument} openIndex={item => openInstrument(indexAsInstrument(item))} watchlist={watchlist} toggleWatch={toggleWatch} toast={onToast} />}
    {view === 'instrument' && <InstrumentDetail key={instrument.symbol} instrument={instrument} onBack={() => onNavigate('screener')} onChart={() => onNavigate('chart',instrument.symbol)} onToast={onToast} />}
    {view === 'chart' && <TechnicalChartWorkspace key={instrument.symbol} instrument={instrument} tier={tier} requestEventAccess={() => onToast('Event intelligence requires an upgraded membership')} timeframe={timeframe} setTimeframe={setTimeframe} indicators={indicators} addIndicator={item => setIndicators(current => current.includes(item) ? current : [...current,item])} watchlist={watchlist} toggleWatch={() => toggleWatch(instrument.symbol)} createAlert={() => onToast(`Demo alert created for ${instrument.symbol}`)} inspectSignal={() => onNavigate('signals',instrument.symbol)} />}
  </div>;
}
