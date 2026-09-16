import { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Download, Filter, Lock, Plus, Star, X } from 'lucide-react';
import { CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import { hierarchy, treemap, type HierarchyNode } from 'd3-hierarchy';
import { instruments, marketIndices } from '@market/data/mock-market';
import { stockCountries } from '@market/data/stock-countries';
import { track } from '@market/lib/analytics/events';
import type { FilterRule, Instrument, IndexStatus, InstrumentMetric, MarketIndex, Tier, View, Visualization } from '@market/types';
import type { Broker } from '../../types';
import { useMarketEngagement } from './MarketEngagement';
import { useRewards } from '../rewards/RewardProvider';
import { clampSignalConfidence, signalTierForConfidence } from './signal-access';
import { historicalTierForTimeframe, visualizationLabels, visualizationRequiredTier } from './tier-access';

function IndexHeatmap({ data, open }: { data: MarketIndex[]; open: (index: MarketIndex) => void }) {
 const options = metricOptions.Indices;
 const [sizeBy, setSizeBy] = useState<InstrumentMetric>('price');
 const [colorBy, setColorBy] = useState<InstrumentMetric>('change');
 return <div className="p-3"><div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3"><div><p className="text-xs font-semibold text-slate-900">Market indices heatmap</p><p className="mt-0.5 text-[10px] text-slate-400">Tile size uses index points; color uses daily change.</p></div><div className="flex flex-wrap gap-2"><MetricSelect label="Size by" value={sizeBy} options={options} onChange={setSizeBy} /><MetricSelect label="Color by" value={colorBy} options={options} onChange={setColorBy} /></div></div><div className="grid min-h-95 grid-cols-4 grid-rows-2 gap-1">{data.map((index, position) => { const value = index[colorBy === 'change' ? 'change' : 'price']; const positive = value >= 0; return <button onClick={() => open(index)} key={index.symbol} className={`flex min-h-0 flex-col items-center justify-center rounded-lg border border-transparent p-2 hover:border-violet-300 ${positive ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-rose-50 hover:bg-rose-100'} ${position === 0 ? 'col-span-2' : ''}`}><b className="text-slate-900">{index.name}</b><span className={positive ? 'up' : 'down'}>{formatMetric(value, metricLabel(colorBy, 'Indices'))}</span><small className="text-slate-400">{metricLabel(sizeBy, 'Indices').label}: {formatMetric(index[sizeBy === 'change' ? 'change' : 'price'], metricLabel(sizeBy, 'Indices'))}</small></button>; })}</div></div>;
}

function IndexScatter({ data, open }: { data: MarketIndex[]; open: (index: MarketIndex) => void }) {
 const options = metricOptions.Indices;
 const [xMetric, setXMetric] = useState<InstrumentMetric>('change');
 const [yMetric, setYMetric] = useState<InstrumentMetric>('price');
 const [sizeMetric, setSizeMetric] = useState<InstrumentMetric>('price');
 const xOption = metricLabel(xMetric, 'Indices');
 const yOption = metricLabel(yMetric, 'Indices');
 const sizeOption = metricLabel(sizeMetric, 'Indices');
 const points = data.map(index => ({ index, xValue: index[xMetric === 'change' ? 'change' : 'price'], yValue: index[yMetric === 'change' ? 'change' : 'price'], sizeValue: index[sizeMetric === 'change' ? 'change' : 'price'] }));
 return <div className="p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3"><div><p className="text-xs font-semibold text-slate-900">Market indices scatter</p><p className="mt-0.5 text-[10px] text-slate-400">Compare index change % against last spot points.</p></div><div className="flex flex-wrap gap-2"><MetricSelect label="X axis" value={xMetric} options={options} onChange={setXMetric} /><MetricSelect label="Y axis" value={yMetric} options={options} onChange={setYMetric} /><MetricSelect label="Point size" value={sizeMetric} options={options} onChange={setSizeMetric} /></div></div><div className="mb-2 flex gap-4 text-[10px] text-slate-400"><span>X: {xOption.label} ({xOption.unit})</span><span>Y: {yOption.label} ({yOption.unit})</span><span>Size: {sizeOption.label} ({sizeOption.unit})</span></div><ResponsiveContainer width="100%" height={330}><ScatterChart margin={{ left: 10, right: 20, top: 10, bottom: 10 }}><CartesianGrid stroke="#eceaf3" /><XAxis type="number" dataKey="xValue" name={xOption.label} unit={xOption.unit} stroke="#94a3b8" fontSize={10} /><YAxis type="number" dataKey="yValue" name={yOption.label} unit={yOption.unit} stroke="#94a3b8" fontSize={10} /><ZAxis type="number" dataKey="sizeValue" range={[80, 720]} /><Tooltip cursor={{ stroke: '#7c3aed55' }} contentStyle={{ background: '#ffffff', border: '1px solid #e7e5ef', fontSize: 11 }} /><Scatter data={points} onClick={point => { const index = marketIndices.find(item => item.symbol === (point as unknown as { symbol: string }).symbol); if (index) open(index); }}>{points.map(index => <Cell key={index.symbol} fill={index.change >= 0 ? '#7c3aed' : '#ef4444'} />)}</Scatter></ScatterChart></ResponsiveContainer></div>;
}

type DerivativesSnapshot = {
 all: string;
 long: string;
 short: string;
 openInterest: string;
 openInterestChange: string;
 volume: string;
 volumeChange: string;
 marketSizeChange: string;
 marketSizeChangeValue: string;
 volume24hChange: string;
 volume24hChangeValue: string;
 bars: number[];
};

const marketCards = [
 ['Stocks', '$118.4T', '+0.82%', '+$6.8B', '64%', 68, { all: '$407.06M', long: '$318.09M', short: '$88.97M', openInterest: '$469.06B', openInterestChange: '10.74%', volume: '$767.32B', volumeChange: '5.72%', marketSizeChange: '+1.42%', marketSizeChangeValue: '+$1.66T', volume24hChange: '+8.64%', volume24hChangeValue: '+$62.4B', bars: [2, 3, 2, 3, 4, 6, 12, 8, 5, 4, 2, 5, 3, 4, 3, 5] }],
 ['Crypto', '$3.16T', '+2.41%', '+$1.2B', '71%', 72, { all: '$1.84B', long: '$1.21B', short: '$630M', openInterest: '$38.42B', openInterestChange: '8.36%', volume: '$142.8B', volumeChange: '12.48%', marketSizeChange: '+3.08%', marketSizeChangeValue: '+$94.4B', volume24hChange: '+18.26%', volume24hChangeValue: '+$22.0B', bars: [3, 5, 8, 4, 10, 7, 13, 6, 9, 5, 7, 11, 8, 6, 10, 12] }],
 ['Forex', '$7.5T/day', 'DXY −0.34%', 'Risk-on', '58%', 54, { all: '$96.4M', long: '$42.8M', short: '$53.6M', openInterest: '$1.24T', openInterestChange: '2.18%', volume: '$6.84T', volumeChange: '3.42%', marketSizeChange: '+0.24%', marketSizeChangeValue: '+$18.0B', volume24hChange: '+4.16%', volume24hChangeValue: '+$284B', bars: [5, 4, 6, 5, 7, 5, 4, 6, 8, 5, 7, 6, 5, 4, 6, 5] }],
 ['Commodities', '$14.2T', '+0.29%', '+$420M', '55%', 61, { all: '$284.7M', long: '$156.2M', short: '$128.5M', openInterest: '$82.16B', openInterestChange: '4.76%', volume: '$329.4B', volumeChange: '1.86%', marketSizeChange: '+0.67%', marketSizeChangeValue: '+$95.1B', volume24hChange: '+6.28%', volume24hChangeValue: '+$20.7B', bars: [4, 6, 5, 8, 7, 5, 9, 11, 6, 8, 5, 7, 10, 8, 6, 9] }],
 ['Indices', '41 tracked', '+0.48%', 'Broadening', '67%', 66, { all: '$72.8M', long: '$48.6M', short: '$24.2M', openInterest: '$216.38B', openInterestChange: '6.22%', volume: '$498.6B', volumeChange: '4.18%', marketSizeChange: '+0.91%', marketSizeChangeValue: '+$372B', volume24hChange: '+7.42%', volume24hChangeValue: '+$34.4B', bars: [2, 3, 4, 3, 5, 4, 7, 5, 6, 4, 3, 5, 7, 6, 5, 8] }],
] as const;

function FearGreedGauge({ score }: { score: number }) {
 const angle = Math.PI - (Math.max(0, Math.min(100, score)) / 100) * Math.PI;
 const dotX = 40 + Math.cos(angle) * 31;
 const dotY = 38 - Math.sin(angle) * 31;
 const label = score >= 60 ? 'Greed' : score <= 40 ? 'Fear' : 'Neutral';
 const labelClass = score >= 60 ? 'bg-lime-500' : score <= 40 ? 'bg-rose-500' : 'bg-amber-500';
 return <div aria-label={`Fear & Greed ${score}, ${label}`} className="mt-2 flex items-end justify-between gap-2">
  <div className="min-w-0">
   <span className="block text-[9px] font-semibold text-slate-500">Fear &amp; Greed</span>
   <svg aria-hidden="true" className="mt-0.5 h-10 w-[82px]" viewBox="0 0 80 44">
    <path d="M8 38 A32 32 0 0 1 18 15" fill="none" stroke="#ef4444" strokeLinecap="round" strokeWidth="5" />
    <path d="M18 15 A32 32 0 0 1 31 7" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeWidth="5" />
    <path d="M31 7 A32 32 0 0 1 49 7" fill="none" stroke="#facc15" strokeLinecap="round" strokeWidth="5" />
    <path d="M49 7 A32 32 0 0 1 63 16" fill="none" stroke="#84cc16" strokeLinecap="round" strokeWidth="5" />
    <path d="M63 16 A32 32 0 0 1 72 38" fill="none" stroke="#10b981" strokeLinecap="round" strokeWidth="5" />
    <circle cx={dotX} cy={dotY} r="4.5" fill="#111827" stroke="white" strokeWidth="2" />
   </svg>
  </div>
  <div className="pb-1 text-right"><b className="block font-mono text-sm text-slate-900">{score}</b><span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold text-white ${labelClass}`}>{label}</span></div>
 </div>;
}

function DerivativesPanel({ data }: { data: DerivativesSnapshot }) {
 return <div className="mt-3 rounded-lg border border-slate-100 bg-white/70 p-2">
  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-700">Derivatives <ArrowRight className="size-3 text-slate-400" /></div>
  <div className="mt-2 grid grid-cols-3 gap-1 text-[9px]">
   <div><span className="block text-slate-400">All liquidations</span><b className="font-mono text-slate-800">{data.all}</b></div>
   <div><span className="block text-slate-400">Long</span><b className="font-mono text-emerald-500">{data.long}</b></div>
   <div><span className="block text-slate-400">Short</span><b className="font-mono text-rose-500">{data.short}</b></div>
  </div>
  <div className="relative mt-2 flex h-7 items-center gap-px border-b border-slate-200">
   <div className="absolute inset-x-0 top-1/2 border-t border-slate-300" />
   {data.bars.map((bar, index) => <span key={`${index}-${bar}`} className="relative flex min-w-0 flex-1 flex-col justify-center">
    <i className="block w-full rounded-t-sm bg-emerald-400" style={{ height: `${Math.max(2, bar * 2.8)}px` }} />
    <i className="block w-full rounded-b-sm bg-rose-400" style={{ height: `${Math.max(2, (bar * (index % 3 === 0 ? 0.7 : 0.45)) * 2.8)}px` }} />
   </span>)}
  </div>
  <div className="mt-2 grid grid-cols-2 gap-2 text-[9px]">
   <div><span className="block text-slate-400">Open interest</span><b className="font-mono text-slate-800">{data.openInterest}</b> <span className="text-emerald-500">↑ {data.openInterestChange}</span></div>
   <div><span className="block text-slate-400">Volume</span><b className="font-mono text-slate-800">{data.volume}</b> <span className="text-rose-500">↓ {data.volumeChange}</span></div>
  </div>
 </div>;
}

function MarketChangeHighlights({ data }: { data: DerivativesSnapshot }) {
 return <div className="mt-2 rounded-lg border border-violet-100 bg-violet-50/50 p-2">
  <span className="text-[9px] font-semibold uppercase tracking-wider text-violet-600">24h market highlights</span>
  <div className="mt-1.5 grid grid-cols-2 gap-2 text-[9px]">
   <div><span className="block text-slate-400">Market size</span><b className="font-mono text-slate-800">{data.marketSizeChange}</b> <span className="text-slate-500">{data.marketSizeChangeValue}</span></div>
   <div><span className="block text-slate-400">Volume</span><b className="font-mono text-slate-800">{data.volume24hChange}</b> <span className="text-slate-500">{data.volume24hChangeValue}</span></div>
  </div>
 </div>;
}

const initialRules: FilterRule[] = [{ id: '2', field: 'Market Cap', operator: '>', value: '$10B', join: 'AND' }, { id: '3', field: 'Relative Volume', operator: '>', value: '1.5', join: 'AND' }, { id: '4', field: 'RSI (14)', operator: '<', value: '45', join: 'AND' }, { id: '5', field: '1M Return', operator: '>', value: '5%', join: 'AND' }];

const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(2)}T` : `$${n}B`);

const indexAsInstrument = (index: MarketIndex): Instrument => ({ symbol: index.symbol, name: index.name, market: 'Index', sector: 'Index', primaryMarket: index.region, subSector: [...index.sectors].sort((a, b) => b.change - a.change)[0]?.sector ?? 'Broad market', price: index.price, change: index.change, volume: 0, rvol: 1, rsi: 50, return1m: index.change * 2.4, marketCap: 0, sentiment: index.change >= 0 ? 65 : 42, signal: index.signal, confidence: index.confidence });

function PageHead({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc: string; action?: React.ReactNode }) {
 return <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[9px] font-semibold uppercase tracking-[.18em] text-violet-600">{eyebrow}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{title}</h1><p className="mt-1 text-xs text-slate-500">{desc}</p></div>{action}</div>;
}

type ExplorerMarket = 'Global' | (typeof marketCards)[number][0];

function Explorer({ navigate, openInstrument }: { navigate: (v: View) => void; openInstrument: (i: Instrument) => void }) {
 const { requestQuest, openBrokerAccess } = useMarketEngagement();
 const [market, setMarket] = useState<ExplorerMarket>('Global');
 const explorerMarkets: ExplorerMarket[] = ['Global', ...marketCards.map(card => card[0] as ExplorerMarket)];
 const visibleCards = market === 'Global' ? marketCards : marketCards.filter(card => card[0] === market);
 const visibleInstruments = market === 'Global' ? instruments : market === 'Indices' ? marketIndices.map(indexAsInstrument) : instruments.filter(instrument => market === 'Stocks' ? instrument.market === 'US Stocks' || instrument.market === 'Stocks' : market === 'Commodities' ? instrument.market === 'Commodity' : market === 'Crypto' ? instrument.market === 'Crypto' : market === 'Forex' ? instrument.market === 'Forex' : true);
 function chooseMarket(nextMarket: ExplorerMarket) {
  setMarket(nextMarket);
  const nextInstruments = nextMarket === 'Global' ? instruments : nextMarket === 'Indices' ? marketIndices.map(indexAsInstrument) : instruments.filter(instrument => nextMarket === 'Stocks' ? instrument.market === 'US Stocks' || instrument.market === 'Stocks' : nextMarket === 'Commodities' ? instrument.market === 'Commodity' : instrument.market === 'Crypto' ? instrument.market === 'Crypto' : instrument.market === 'Forex' ? instrument.market === 'Forex' : true);
 }
 return (
  <>
   <PageHead eyebrow="Discover → Explain → Monitor" title="Market Explorer" desc="Where momentum, participation, and risk are concentrating now." action={<div className="seg">{explorerMarkets.map(x => <button onClick={() => { chooseMarket(x); track('market_viewed', { market: x }); }} className={market === x ? 'active' : ''} key={x}>{x}</button>)}</div>} />
  <div>
    <div className="grid grid-cols-5 gap-3 max-xl:grid-cols-3">
    {visibleCards.map(m => (
     <button key={m[0]} onClick={() => chooseMarket(m[0] as ExplorerMarket)} className="panel p-3 text-left hover:border-violet-300">
      <div className="label flex justify-between">{m[0]}<ArrowRight className="size-3" /></div>
      <div className="mt-3 font-mono text-lg text-slate-900">{m[1]}</div>
      <div className="mt-2 flex justify-between text-[10px]"><span className="text-emerald-600">{m[2]}</span><span className="text-slate-400">Sent. {m[4]}</span></div>
      <div className="mt-1 text-[10px] text-slate-400">Participation {m[3]}</div>
     </button>
    ))}
   </div>
   {market !== 'Global' && <ExplorerMarketDetails market={market} instruments={visibleInstruments} />}
   <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-100 bg-white p-3"><p className="text-xs text-slate-500">Independent research · sponsorship does not affect the radar.</p><div className="flex flex-wrap gap-2"><button className="secondary" onClick={() => requestQuest('explorer-research', visibleInstruments.map(item => item.symbol))}>Research this market</button><button className="secondary" onClick={openBrokerAccess}>Broker access</button></div></div>
   <div className="mt-4 grid grid-cols-[minmax(0,1fr)_340px] gap-4 max-xl:grid-cols-1">
    <div className="panel">
    <div className="panel-head"><div><b className="text-sm text-slate-900">Opportunity radar</b><p>{visibleInstruments.length} matched · high volume + pullback strength</p></div><button onClick={() => navigate('screener')} className="primary"><Filter />Open screener</button></div>
    <InstrumentTable data={visibleInstruments.slice(0, 6)} open={openInstrument} openBrokerAccess={openBrokerAccess} />
    </div>
    <VolumeFlowPanel currentMarket="All" currentResults={visibleInstruments} />
   </div>
    </div>
  </>
 );
}

function ExplorerMarketDetails({ market, instruments: marketInstruments }: { market: Exclude<ExplorerMarket, 'Global'>; instruments: Instrument[] }) {
   const card = marketCards.find(item => item[0] === market);
   const movers = [...marketInstruments].sort((a, b) => b.change - a.change).slice(0, 5);
   const gainers = marketInstruments.filter(instrument => instrument.change >= 0).length;
   const losers = marketInstruments.length - gainers;
   const averageChange = marketInstruments.length ? marketInstruments.reduce((total, instrument) => total + instrument.change, 0) / marketInstruments.length : 0;
   const volume = marketInstruments.reduce((total, instrument) => total + instrument.volume, 0);
   const marketTitle = market === 'Indices' ? 'Index' : market === 'Commodities' ? 'Commodity' : market === 'Stocks' ? 'Stock' : market === 'Crypto' ? 'Crypto' : 'Forex';
   return <div className="mt-4 grid grid-cols-[1.1fr_1fr_1fr] gap-3 max-lg:grid-cols-1">
    <div className="panel p-4">
     <div className="flex items-center justify-between"><div><p className="label">{market} status</p><p className="mt-1 text-lg font-semibold text-slate-900">{card?.[1]}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${averageChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{averageChange >= 0 ? 'Risk-on' : 'Risk-off'}</span></div>
     <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-lg bg-slate-50 p-2"><span className="text-[10px] text-slate-400">Average change</span><b className={`mt-1 block text-sm ${averageChange >= 0 ? 'up' : 'down'}`}>{averageChange > 0 ? '+' : ''}{averageChange.toFixed(2)}%</b></div><div className="rounded-lg bg-slate-50 p-2"><span className="text-[10px] text-slate-400">Participation</span><b className="mt-1 block text-sm text-slate-900">{volume.toFixed(1)}M</b></div></div>
    </div>
    <div className="panel p-4"><div className="flex items-center justify-between"><p className="label">Top {marketTitle.toLowerCase()} movers</p><span className="text-[10px] text-slate-400">{marketInstruments.length} tracked</span></div><div className="mt-3 space-y-2">{movers.map(instrument => <div className="flex items-center justify-between gap-2 text-xs" key={instrument.symbol}><div className="min-w-0"><b className="block truncate text-slate-800">{instrument.symbol}</b><span className="block truncate text-[10px] text-slate-400">{instrument.name}</span></div><span className={instrument.change >= 0 ? 'up' : 'down'}>{instrument.change > 0 ? '+' : ''}{instrument.change.toFixed(2)}%</span></div>)}</div></div>
    <div className="panel p-4"><p className="label">Breadth & sentiment</p><div className="mt-3 space-y-3"><div><div className="mb-1 flex justify-between text-[10px] text-slate-500"><span>Gainers</span><b className="text-emerald-600">{gainers}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${marketInstruments.length ? gainers / marketInstruments.length * 100 : 0}%` }} /></div></div><div><div className="mb-1 flex justify-between text-[10px] text-slate-500"><span>Losers</span><b className="text-rose-600">{losers}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-rose-500" style={{ width: `${marketInstruments.length ? losers / marketInstruments.length * 100 : 0}%` }} /></div></div><div className="flex justify-between border-t border-border pt-2 text-[10px] text-slate-500"><span>Sentiment</span><b className="text-slate-900">{card?.[4]}</b></div></div></div>
   </div>;
  }

type FlowPeriod = '1D' | '1W' | '1M' | '1Y';

type FlowScope = 'Market' | 'Sector';

const flowMarkets = ['Stocks', 'Crypto', 'Forex', 'Commodities', 'Indices'] as const;

const flowMultipliers: Record<FlowPeriod, number> = { '1D': 1, '1W': 4.8, '1M': 18, '1Y': 92 };

const flowMarketName = (instrument: Instrument) => instrument.market === 'US Stocks' || instrument.market === 'Stocks' ? 'Stocks' : instrument.market === 'Commodity' ? 'Commodities' : instrument.market;

function VolumeFlowPanel({ currentMarket, currentResults, userTierLevel = 1, onToast }: { currentMarket: MarketFilter; currentResults: Instrument[]; userTierLevel?: number; onToast?: (message: string) => void }) {
 const [period, setPeriod] = useState<FlowPeriod>('1D');
 const [scope, setScope] = useState<FlowScope>('Market');
 const defaultMarket = currentMarket === 'Indices' ? 'Indices' : currentMarket === 'All' ? 'Stocks' : flowMarketName(currentResults[0] ?? instruments[0]) as (typeof flowMarkets)[number];
 const [selectedMarket, setSelectedMarket] = useState<(typeof flowMarkets)[number]>(defaultMarket);
 const selectedInstruments = currentMarket === 'All' ? instruments.filter(instrument => flowMarketName(instrument) === selectedMarket) : currentMarket === 'Indices' ? [] : currentResults;
 const marketRows = flowMarkets.map(name => ({ label: name, value: (name === 'Indices' ? marketIndices.reduce((sum, index) => sum + index.price * Math.abs(index.change) / 100, 0) : instruments.filter(instrument => flowMarketName(instrument) === name).reduce((sum, instrument) => sum + instrument.volume * instrument.rvol, 0)) * flowMultipliers[period] }));
 const sectorRows = selectedMarket === 'Indices' ? marketIndices.flatMap(index => index.sectors.map(sector => ({ label: sector.sector, value: index.price * Math.abs(sector.change) / 100 * flowMultipliers[period] }))).reduce<Record<string, number>>((rows, row) => { rows[row.label] = (rows[row.label] ?? 0) + row.value; return rows; }, {}) : selectedInstruments.reduce<Record<string, number>>((rows, instrument) => { const sector = instrument.subSector ?? instrument.sector; rows[sector] = (rows[sector] ?? 0) + instrument.volume * instrument.rvol * flowMultipliers[period]; return rows; }, {});
 const rows = scope === 'Market' ? marketRows : Object.entries(sectorRows).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
 const max = Math.max(...rows.map(row => row.value), 1);
 if (userTierLevel < 3) return <div className="panel flex min-h-48 flex-col items-center justify-center gap-2 p-4 text-center"><Lock className="size-5 text-violet-500" /><b className="text-xs text-slate-800">Cross-market comparison requires Level 3</b><p className="max-w-xs text-[10px] text-slate-500">Unlock cross-market activity comparisons when your account reaches the Intermediate tier.</p></div>;
 return <div className="panel p-3"><div className="flex items-start justify-between gap-2"><div><b className="text-sm text-slate-900">Market × Sector comparison</b><p className="sub">Relative activity using the current scanner filter</p></div><span className="text-[10px] text-slate-400">{currentMarket}</span></div><div className="mt-2 flex flex-wrap gap-2"><div className="seg">{(['1D', '1W', '1M', '1Y'] as FlowPeriod[]).map(item => { const requiredTier = historicalTierForTimeframe(item); const locked = requiredTier > userTierLevel; return <button key={item} type="button" onClick={() => locked ? onToast?.(`${item} historical data starts at Level ${requiredTier}.`) : setPeriod(item)} aria-disabled={locked} title={locked ? `Requires Level ${requiredTier}` : `Use ${item} period`} className={`${period === item ? 'active' : ''} ${locked ? 'cursor-not-allowed opacity-50' : ''}`}>{item}{locked && <Lock className="ml-1 inline size-2.5" />}</button>; })}</div><div className="seg">{(['Market', 'Sector'] as FlowScope[]).map(item => <button key={item} onClick={() => setScope(item)} className={scope === item ? 'active' : ''}>{item}</button>)}</div></div>{scope === 'Sector' && currentMarket === 'All' && <select aria-label="Comparison market" value={selectedMarket} onChange={event => setSelectedMarket(event.target.value as (typeof flowMarkets)[number])} className="mt-2 w-full rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600">{flowMarkets.map(name => <option key={name}>{name}</option>)}</select>}<div className="mt-3 space-y-2">{rows.slice(0, 6).map(row => <div key={row.label}><div className="mb-1 flex items-center justify-between gap-2 text-[10px]"><span className="truncate font-medium text-slate-700">{row.label}</span><span className="font-mono text-slate-500">{row.value.toFixed(1)}M</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500 transition-all duration-300" style={{ width: `${Math.max(4, row.value / max * 100)}%` }} /></div></div>)}</div><p className="mt-2 text-[9px] leading-relaxed text-slate-400">Relative activity compares participation; it is not a capital-flow or trade recommendation.</p></div>;
}

const marketFilters = ['All', 'Stocks', 'Crypto', 'Forex', 'Commodities', 'Indices'] as const;

type MarketFilter = (typeof marketFilters)[number];

const marketFilterKey: Partial<Record<MarketFilter, string[]>> = { Stocks: ['US Stocks', 'Stocks'], Crypto: ['Crypto'], Forex: ['Forex'], Commodities: ['Commodity'] };

function VisualizationTierLock({ visualization, currentTier }: { visualization: Visualization; currentTier: number }) {
 const requiredTier = visualizationRequiredTier[visualization];
 return <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center"><Lock className="size-7 text-violet-500" /><h2 className="font-semibold text-slate-800">{visualizationLabels[visualization]} is locked</h2><p className="max-w-md text-xs text-slate-500">This visualization is available from Level {requiredTier}. Your current access is Level {currentTier}.</p></div>;
}

const instrumentSubSector = (instrument: Instrument) => instrument.subSector ?? 'Unclassified';

const taxonomyLabels: Record<Exclude<MarketFilter, 'All'>, string> = { Stocks: 'NASDAQ · NYSE · SET · LSE | Technology · Finance · Energy · Consumer', Crypto: 'Crypto Spot | Layer 1 · DeFi · Meme', Forex: 'FX Spot | Major · Minor · Exotic', Commodities: 'COMEX · NYMEX · CBOT | Metals · Energy · Agriculture', Indices: 'United States · United Kingdom · India · Germany · Japan | Tech · Consumer · Healthcare · Communication · Finance · Industrials · Energy · Utilities' };

type MetricOption = { key: InstrumentMetric; label: string; unit: string; format: 'price' | 'percent' | 'number' | 'money' };

const metricOptions: Record<MarketFilter, MetricOption[]> = {
 All: [
  { key: 'change', label: 'Change 1D', unit: '%', format: 'percent' }, { key: 'rvol', label: 'Relative volume', unit: '×', format: 'number' }, { key: 'marketCap', label: 'Market cap', unit: '$B', format: 'money' }, { key: 'price', label: 'Last price', unit: '', format: 'price' },
 ],
 Stocks: [
  { key: 'change', label: 'Change 1D', unit: '%', format: 'percent' }, { key: 'return1m', label: 'Performance 1M', unit: '%', format: 'percent' }, { key: 'marketCap', label: 'Market cap', unit: '$B', format: 'money' }, { key: 'pe', label: 'P/E ratio', unit: '×', format: 'number' }, { key: 'rvol', label: 'Relative volume', unit: '×', format: 'number' },
 ],
 Crypto: [
  { key: 'change', label: 'Change 24h', unit: '%', format: 'percent' }, { key: 'return1m', label: 'Performance 1M', unit: '%', format: 'percent' }, { key: 'marketCap', label: 'Market cap', unit: '$B', format: 'money' }, { key: 'volume', label: 'Volume 24h', unit: '$M', format: 'money' }, { key: 'rvol', label: 'Relative volume', unit: '×', format: 'number' },
 ],
 Forex: [
  { key: 'change', label: 'Change 1D', unit: '%', format: 'percent' }, { key: 'return1m', label: 'Performance 1M', unit: '%', format: 'percent' }, { key: 'price', label: 'Last spot', unit: 'quote', format: 'price' }, { key: 'rvol', label: 'Relative volume', unit: '×', format: 'number' }, { key: 'rsi', label: 'RSI 14', unit: '', format: 'number' },
 ],
 Commodities: [
  { key: 'change', label: 'Change 1D', unit: '%', format: 'percent' }, { key: 'return1m', label: 'Performance 1M', unit: '%', format: 'percent' }, { key: 'price', label: 'Last spot', unit: 'USD', format: 'price' }, { key: 'volume', label: 'Volume', unit: '$M', format: 'money' }, { key: 'rsi', label: 'RSI 14', unit: '', format: 'number' },
 ],
 Indices: [
  { key: 'change', label: 'Change 1D', unit: '%', format: 'percent' }, { key: 'price', label: 'Last spot', unit: 'points', format: 'price' },
 ],
};

const metricLabel = (key: InstrumentMetric, market: MarketFilter) => metricOptions[market].find(option => option.key === key) ?? metricOptions.All[0];

const metricValue = (instrument: Instrument, key: InstrumentMetric) => instrument[key] ?? 0;

const formatMetric = (value: number, option: MetricOption) => option.format === 'percent' ? `${value > 0 ? '+' : ''}${value.toFixed(2)}${option.unit}` : option.format === 'price' ? `${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}${option.unit && option.unit !== 'quote' ? ` ${option.unit}` : ''}` : option.format === 'money' ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}${option.unit === '$B' ? 'B' : 'M'}` : `${value.toFixed(2)}${option.unit}`;

type CustomFilterOption = { field: string; operator: '>' | '<' | '='; value: string; unit?: string };

const customFilterOptions = (market: MarketFilter): CustomFilterOption[] => {
 const metricFilters = metricOptions[market].map(option => ({ field: option.label, operator: option.key === 'price' || option.key === 'marketCap' ? '=' as const : '>' as const, value: option.key === 'change' || option.key === 'return1m' ? '0' : option.key === 'rsi' ? '50' : option.key === 'rvol' ? '1.5' : option.key === 'pe' ? '25' : option.key === 'volume' ? '10' : '100', unit: option.unit }));
 const taxonomy = market === 'Indices' ? [{ field: 'Region', operator: '=' as const, value: 'United States' }, { field: 'Sector', operator: '=' as const, value: 'Tech' }] : [{ field: 'Sector', operator: '=' as const, value: market === 'Forex' ? 'Major' : market === 'Crypto' ? 'Smart Contract Platforms' : market === 'Commodities' ? 'Energy' : 'Technology' }, { field: 'Sub-sector', operator: '=' as const, value: market === 'Forex' ? 'USD Major Pairs' : market === 'Crypto' ? 'Layer 1' : market === 'Commodities' ? 'Crude Oil' : 'Software' }];
 return [...taxonomy, ...metricFilters];
};

function MarketHighlights({ openInstrument, market, currentResults, userTierLevel, toast }: { openInstrument: (instrument: Instrument) => void; market: MarketFilter; currentResults: Instrument[]; userTierLevel: number; toast: (message: string) => void }) {
 const [duration, setDuration] = useState('24H');
 const durations = ['1H', '6H', '12H', '24H', '1W', '1M', '6M', '1Y'] as const;
 const topMovers = [...instruments].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 3);
 return <section aria-label="CFD market highlights" className="mb-4 space-y-3">
  <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-slate-50 p-4">
   <div className="flex flex-wrap items-end justify-between gap-3">
    <div><p className="text-[9px] font-semibold uppercase tracking-[.18em] text-violet-600">Market pulse · CFD discovery</p><h2 className="mt-1 text-lg font-semibold text-slate-900">Understand the market before screening</h2><p className="mt-1 max-w-2xl text-xs text-slate-500">Explorer highlights are now linked to the scanner. Use the briefs to choose a market, then validate the idea with independent filters and risk conditions.</p></div>
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white/70 p-2">
     <span className="mr-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">Duration</span>
     {durations.map(option => {
      const requiredTier = historicalTierForTimeframe(option);
      const locked = requiredTier > userTierLevel;
      return <button key={option} type="button" onClick={() => locked ? toast(`${option} historical data starts at Level ${requiredTier}.`) : setDuration(option)} aria-disabled={locked} title={locked ? `Requires Level ${requiredTier}` : `Use ${option} duration`} className={`rounded-md px-2 py-1 text-[9px] font-semibold ${duration === option ? 'bg-violet-600 text-white' : locked ? 'cursor-not-allowed text-slate-300' : 'text-slate-500 hover:bg-violet-50'}`}>{option}{locked && <Lock className="ml-1 inline size-2.5" />}</button>;
     })}
    </div>
   </div>
   <div className="mt-4 grid grid-cols-5 gap-2 max-xl:grid-cols-3 max-md:grid-cols-2">
    {marketCards.map(([label, size, change, participation, , fearGreed, derivatives]) => <div className="rounded-xl border border-white bg-white/80 p-3 shadow-sm" key={label}><span className="text-[10px] font-semibold text-slate-500">{label} CFDs</span><b className="mt-2 block font-mono text-sm text-slate-900">{size}</b><div className="mt-1 flex justify-between gap-2 text-[10px]"><span className={change.includes('−') ? 'down' : 'up'}>{change}</span></div><span className="mt-1 block text-[10px] text-slate-400">Activity {participation}</span><FearGreedGauge score={fearGreed} /><MarketChangeHighlights data={derivatives} /><DerivativesPanel data={{ ...derivatives, bars: derivatives.bars.map((bar, index) => Math.max(1, Math.round(bar * (duration === '1H' ? .55 : duration === '1Y' ? 1.25 : 1 + index % 3 * .08)))) }} /></div>)}
   </div>
  </div>
  <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-3 max-xl:grid-cols-1">
   <div className="panel p-4"><div className="panel-head"><div><b className="text-sm text-slate-900">Today’s CFD briefs</b><p>Data-linked highlights from movers, breadth, and participation.</p></div><span className="text-[10px] text-slate-400">Independent of sponsorship</span></div><div className="mt-3 grid gap-2 md:grid-cols-3">{topMovers.map(instrument => <button key={instrument.symbol} onClick={() => openInstrument(instrument)} className="rounded-xl border border-border p-3 text-left transition hover:border-violet-300 hover:bg-violet-50/40"><span className="text-[9px] font-semibold uppercase tracking-wider text-violet-600">{instrument.change >= 0 ? 'Momentum brief' : 'Risk brief'}</span><b className="mt-1 block text-sm text-slate-900">{instrument.symbol} CFD</b><p className="mt-1 line-clamp-2 text-[10px] text-slate-500">{instrument.name} is showing {instrument.change >= 0 ? 'positive' : 'negative'} movement with {instrument.rvol.toFixed(1)}× relative activity.</p><span className={`mt-2 block text-xs font-semibold ${instrument.change >= 0 ? 'up' : 'down'}`}>{instrument.change > 0 ? '+' : ''}{instrument.change.toFixed(2)}% · Open details</span></button>)}</div></div>
   <VolumeFlowPanel currentMarket={market} currentResults={currentResults} userTierLevel={userTierLevel} onToast={toast} />
  </div>
 </section>;
}

function Screener({ tier, rules, setRules, results, viz, setViz, openInstrument, openIndex, watchlist, toggleWatch, toast, recentTrades }: { tier: Tier; rules: FilterRule[]; setRules: (r: FilterRule[]) => void; results: Instrument[]; viz: Visualization; setViz: (v: Visualization) => void; openInstrument: (i: Instrument) => void; openIndex: (index: MarketIndex) => void; watchlist: string[]; toggleWatch: (symbol: string) => void; toast: (s: string) => void; recentTrades: Array<{ symbol: string; type: 'BUY' | 'SELL'; broker: string; lots: number }> }) {
 const { requestQuest, requestUnlock, openBrokerAccess, compare, brokers } = useMarketEngagement();
 const { hasAccess, snapshot } = useRewards();
 const scatterUnlocked = hasAccess('advancedScreener');
 const precisionUnlocked = hasAccess('signalPrecision');
 const views: Visualization[] = ['Table', 'Heatmap', 'Scatter', 'Correlation'];
 const [market, setMarket] = useState<MarketFilter>('All');
 const [primary, setPrimary] = useState('All');
 const [sector, setSector] = useState('All');
 const [region, setRegion] = useState('All');
 const [country, setCountry] = useState('All');
 const [subSector, setSubSector] = useState('All');
 const [customFilterOpen, setCustomFilterOpen] = useState(false);
 const base = instruments;
 const marketBase = useMemo(() => {
  const key = marketFilterKey[market];
  if (!key) return market === 'Indices' ? [] : base;
  return base.filter(i => key.includes(i.market));
 }, [base, market]);
 const sectorOptions = useMemo(() => ['All', ...Array.from(new Set(marketBase.map(i => i.sector))).sort()], [marketBase]);
 const subSectorOptions = useMemo(() => ['All', ...Array.from(new Set(marketBase.filter(i => sector === 'All' || i.sector === sector).map(instrumentSubSector))).sort()], [marketBase, sector]);
 const regionOptions = useMemo(() => ['All', ...Array.from(new Set(stockCountries.map(item => item.region))).sort()], []);
 const countryOptions = useMemo(() => ['All', ...stockCountries.filter(item => region === 'All' || item.region === region).map(item => item.country).sort()], [region]);
 const filtered = useMemo(() => {
  let list = marketBase;
  if (sector !== 'All') list = list.filter(i => i.sector === sector);
  if (market === 'Stocks' && region !== 'All') list = list.filter(i => i.region === region);
  if (market === 'Stocks' && country !== 'All') list = list.filter(i => i.country === country);
  if (subSector !== 'All') list = list.filter(i => instrumentSubSector(i) === subSector);
  return list;
 }, [market, marketBase, sector, region, country, subSector]);
 const indexPrimaryOptions = ['All', ...Array.from(new Set(marketIndices.map(index => index.region))).sort()];
 const indexSubSectorOptions = ['All', ...Array.from(new Set(marketIndices.flatMap(index => index.sectors.map(sector => sector.sector)))).sort()];
 const filteredIndices = useMemo(() => market === 'Indices' ? marketIndices.filter(index => (primary === 'All' || index.region === primary) && (subSector === 'All' || index.sectors.some(sector => sector.sector === subSector))) : [], [market, primary, subSector]);
 const primaryChoices = indexPrimaryOptions;
 const subSectorChoices = market === 'Indices' ? indexSubSectorOptions : subSectorOptions;
 const sectorChoices = useMemo(() => market === 'Indices' ? ['All'] : sectorOptions, [market, sectorOptions]);
 const currentResults = market === 'Indices' ? filteredIndices.map(indexAsInstrument) : filtered;
 useEffect(() => {
  if (!primaryChoices.includes(primary)) setPrimary('All');
  if (!sectorChoices.includes(sector)) setSector('All');
  if (!regionOptions.includes(region)) setRegion('All');
  if (!countryOptions.includes(country)) setCountry('All');
  if (!subSectorChoices.includes(subSector)) setSubSector('All');
 }, [primaryChoices, sectorChoices, regionOptions, countryOptions, subSectorChoices, primary, sector, region, country, subSector]);
 return (
  <>
   <PageHead eyebrow="Discover → Explain → Monitor" title="Instrument Analysis" desc="Review market highlights, Fear & Greed, derivatives activity, and 24-hour changes before selecting an instrument." action={<button onClick={() => snapshot.level.level < 2 ? toast('Saved screeners start at Level 2.') : toast('Screen saved')} className="secondary">Save screen{snapshot.level.level < 2 && <Lock className="ml-1 inline size-3" />}</button>} />
   <MarketHighlights openInstrument={openInstrument} market={market} currentResults={currentResults} userTierLevel={snapshot.level.level} toast={toast} />
   <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
    <div className="flex flex-wrap items-center gap-2">
    <div className="seg">{marketFilters.map(m => <button key={m} onClick={() => { setMarket(m); setPrimary('All'); setSector('All'); setRegion('All'); setCountry('All'); setSubSector('All'); track('market_viewed', { market: m }); }} className={market === m ? 'active' : ''}>{m}</button>)}</div>
    {market === 'Indices' && <label className="flex items-center gap-2 text-[10px] text-slate-500"><span>Region</span><select value={primary} onChange={event => { setPrimary(event.target.value); setSubSector('All'); }} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none">{primaryChoices.map(option => <option key={option}>{option}</option>)}</select></label>}
    {market === 'Stocks' && <><label className="flex items-center gap-2 text-[10px] text-slate-500"><span>Region</span><select value={region} onChange={event => { setRegion(event.target.value); setCountry('All'); }} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none">{regionOptions.map(option => <option key={option}>{option}</option>)}</select></label><label className="flex items-center gap-2 text-[10px] text-slate-500"><span>Country / Market</span><select value={country} onChange={event => setCountry(event.target.value)} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none">{countryOptions.map(option => <option key={option}>{option}</option>)}</select></label></>}
    {market !== 'Indices' && <label className="flex items-center gap-2 text-[10px] text-slate-500"><span>Sector</span><select value={sector} onChange={event => { setSector(event.target.value); setSubSector('All'); }} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none">{sectorChoices.map(option => <option key={option}>{option}</option>)}</select></label>}
    <label className="flex items-center gap-2 text-[10px] text-slate-500"><span>{market === 'Indices' ? 'Index sector' : 'Sub-sector'}</span><select value={subSector} onChange={event => setSubSector(event.target.value)} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none">{subSectorChoices.map(option => <option key={option}>{option}</option>)}</select></label>
    </div>
    <div className="seg">{views.map(v => { const tierLocked = snapshot.level.level < visualizationRequiredTier[v]; const featureLocked = v === 'Scatter' && !scatterUnlocked; return <button key={v} onClick={() => { setViz(v); if (v === 'Scatter' && !scatterUnlocked && !tierLocked) requestUnlock('advancedScreener'); }} className={viz === v ? 'active' : ''}>{visualizationLabels[v]}{(tierLocked || featureLocked || v === 'Correlation' && !precisionUnlocked) && <Lock className="ml-1 inline size-2.5" />}</button>; })}</div>
   </div>
   <div className="panel p-3">
    <div className="flex flex-wrap items-center gap-2">
     <span className="label mr-2">Filter logic</span>
     {rules.map((r, i) => (
      <div className="flex items-center gap-1" key={r.id}>
       {i > 0 && <button onClick={() => setRules(rules.map(x => (x.id === r.id ? { ...x, join: x.join === 'AND' ? 'OR' : 'AND' } : x)))} className="logic">{r.join}</button>}
       <div className="filter-chip"><span>{r.field}</span><b>{r.operator}</b><input aria-label={`${r.field} value`} value={r.value} onChange={e => setRules(rules.map(x => (x.id === r.id ? { ...x, value: e.target.value } : x)))} /><button onClick={() => setRules(rules.filter(x => x.id !== r.id))}><X /></button></div>
      </div>
     ))}
    <div className="relative">
     <button aria-label="Add custom filter" onClick={() => snapshot.level.level < 2 ? toast('Advanced filters start at Level 2.') : setCustomFilterOpen(open => !open)} className={`icon-button ${customFilterOpen ? 'bg-violet-50 text-violet-700' : ''}`}><Plus />{snapshot.level.level < 2 && <Lock className="absolute -right-1 -top-1 size-2.5 rounded-full bg-white text-violet-600" />}</button>
     {customFilterOpen && <div className="absolute left-0 top-9 z-20 w-72 rounded-xl border border-border bg-white p-2 shadow-xl">
      <div className="flex items-start justify-between border-b border-border px-2 pb-2"><div><p className="text-xs font-semibold text-slate-900">Add custom filter</p><p className="mt-0.5 text-[10px] text-slate-400">{market === 'All' ? 'All market fields' : `${market} fields and units`}</p></div><button aria-label="Close custom filter menu" onClick={() => setCustomFilterOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="size-3.5" /></button></div>
      <div className="mt-1 max-h-72 overflow-y-auto">{customFilterOptions(market).map(option => <button key={`${option.field}-${option.operator}`} onClick={() => { setRules([...rules, { id: crypto.randomUUID(), field: option.field, operator: option.operator, value: option.value, join: 'AND' }]); track('filter_added', { field: option.field, market }); setCustomFilterOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-violet-50"><span><b className="block text-[10px] text-slate-700">{option.field}</b><span className="text-[9px] text-slate-400">{option.operator} {option.value}{option.unit && ` ${option.unit}`}</span></span><Plus className="size-3 text-violet-600" /></button>)}</div>
     </div>}
    </div>
    </div>
   </div>
  {market !== 'All' && <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/50 px-3 py-2 text-[10px] text-slate-500"><span className="font-semibold text-violet-700">Available {market} coverage:</span> {taxonomyLabels[market as Exclude<MarketFilter, 'All'>]}</div>}
   <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
    <span><b className="text-slate-900">{market === 'Indices' ? filteredIndices.length : filtered.length}</b> matches · independent results, never sponsored</span>
    <div className="flex flex-wrap gap-2"><button className="secondary border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-300 hover:bg-violet-100" onClick={() => requestQuest('screener-research', (market === 'Indices' ? filteredIndices : filtered).map(item => item.symbol))}><span className="block text-[9px] font-bold uppercase tracking-wide">Today&apos;s quest</span><span>Guided comparison · +50 C</span><span className="block text-[9px] text-violet-500">Available until 23:59 UTC</span></button><button className="secondary" onClick={openBrokerAccess}>Broker access</button><button className="secondary" onClick={() => {
      if (snapshot.level.level < 2) { toast('CSV export starts at Level 2.'); return; }
      const rows = market === 'Indices' ? filteredIndices : filtered;
      const csv = ['Symbol,Name,Price,Change', ...rows.map(item => [item.symbol, item.name, item.price, item.change].map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a'); link.href = url; link.download = 'market-research.csv'; link.click(); URL.revokeObjectURL(url);
      toast('Market research CSV exported');
    }}>{snapshot.level.level < 2 ? <Lock /> : <Download />}Export CSV</button></div>
   </div>
   <div className="panel mt-3 min-h-95">
    {snapshot.level.level < visualizationRequiredTier[viz] ? <VisualizationTierLock visualization={viz} currentTier={snapshot.level.level} /> : viz === 'Scatter' && !scatterUnlocked ? <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center"><Lock className="size-7 text-violet-500" /><h2 className="font-semibold text-slate-800">Advanced scatter research</h2><p className="max-w-md text-xs text-slate-500">Compare three dimensions with the existing scatter tool. Table, heatmap, exports, and guided research remain free.</p><button className="primary" onClick={() => requestUnlock('advancedScreener')}>Choose credit unlock</button></div> : viz === 'Cross-market' ? <VolumeFlowPanel currentMarket={market} currentResults={currentResults} userTierLevel={snapshot.level.level} onToast={toast} /> : viz === 'Custom' ? <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center"><b className="text-sm text-slate-900">Advanced custom visualization</b><p className="max-w-md text-xs text-slate-500">Tier 4 unlocks custom axes, saved layouts, and advanced visualization controls for the active screener results.</p><div className="flex flex-wrap justify-center gap-2 text-[10px] text-slate-500"><span className="rounded-lg bg-slate-100 px-2 py-1">{currentResults.length} results</span><span className="rounded-lg bg-slate-100 px-2 py-1">{rules.length} filters</span><span className="rounded-lg bg-violet-50 px-2 py-1 text-violet-700">{market} market</span></div></div> : market === 'Indices'
    ? <>{viz === 'Table' && <IndicesPanel data={filteredIndices} open={openIndex} />}{viz === 'Heatmap' && <IndexHeatmap data={filteredIndices} open={openIndex} />}{viz === 'Scatter' && <IndexScatter data={filteredIndices} open={openIndex} />}{viz === 'Correlation' && <Correlation names={filteredIndices.map(index => index.symbol)} instruments={filteredIndices.map(indexAsInstrument)} recentTrades={recentTrades} userTierLevel={snapshot.level.level} precisionUnlocked={precisionUnlocked} requestPrecisionUnlock={() => requestUnlock('signalPrecision')} brokers={brokers} onToast={toast} onOpenBrokerAccess={openBrokerAccess} />}</>
     : <>
      {viz === 'Table' && <InstrumentTable data={filtered} market={market} open={openInstrument} watchlist={watchlist} toggleWatch={toggleWatch} openBrokerAccess={openBrokerAccess} />}
      {viz === 'Heatmap' && <Heatmap data={filtered} market={market} open={openInstrument} brokers={brokers} userTierLevel={snapshot.level.level} precisionUnlocked={precisionUnlocked} />}
      {viz === 'Scatter' && <ScatterView data={filtered} market={market} open={openInstrument} brokers={brokers} userTierLevel={snapshot.level.level} precisionUnlocked={precisionUnlocked} />}
      {viz === 'Correlation' && <Correlation names={filtered.map(instrument => instrument.symbol)} instruments={filtered} recentTrades={recentTrades} userTierLevel={snapshot.level.level} precisionUnlocked={precisionUnlocked} requestPrecisionUnlock={() => requestUnlock('signalPrecision')} brokers={brokers} onToast={toast} onOpenBrokerAccess={openBrokerAccess} />}
     </>}
   </div>
   <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
    <div className="rounded-xl border border-slate-200 bg-white p-3">
     <div className="flex items-center justify-between gap-2"><div><b className="text-xs text-slate-900">Broker comparison</b><p className="mt-1 text-[10px] text-slate-500">Compare spreads, leverage, platforms, and symbol access before connecting.</p></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">{brokers.length} listed</span></div>
     <button className="secondary mt-3 w-full justify-center" onClick={compare}>Compare broker conditions</button>
    </div>
    <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-amber-50 p-3">
     <div className="flex flex-wrap items-start justify-between gap-2"><div><span className="text-[9px] font-bold uppercase tracking-wider text-violet-600">Special partner campaign</span><b className="mt-1 block text-xs text-slate-900">Connect an eligible broker and unlock more value</b><p className="mt-1 text-[10px] text-slate-500">Campaign eligibility, product access, and cashback terms vary by symbol and region.</p></div><span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-semibold text-amber-700">Limited offer</span></div>
     <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]"><span className="rounded-lg bg-white px-2 py-1 font-semibold text-violet-700 shadow-sm">+30 Credits</span><span className="rounded-lg bg-white px-2 py-1 font-semibold text-amber-700 shadow-sm">+10 Points</span><span className="rounded-lg bg-white px-2 py-1 font-semibold text-emerald-700 shadow-sm">Up to $25 cashback</span><button className="primary ml-auto" onClick={openBrokerAccess}>View eligible offers</button></div>
    </div>
   </div>
  </>
 );
}

type InstrumentSortKey = 'symbol' | 'price' | 'change' | 'return1m' | 'rvol' | 'rsi' | 'marketCap';

const instrumentColumns: { key: InstrumentSortKey; label: string }[] = [
 { key: 'symbol', label: 'Symbol' }, { key: 'price', label: 'Price' }, { key: 'change', label: 'Change' }, { key: 'return1m', label: '1M return' }, { key: 'rvol', label: 'Rel. volume' }, { key: 'rsi', label: 'RSI' }, { key: 'marketCap', label: 'Market cap' },
];

function SortHeader({ label, active, dir, onClick }: { label: string; active: boolean; dir: 1 | -1; onClick: () => void }) {
 return <button onClick={onClick} className="flex items-center gap-1 hover:text-slate-700">{label}{active && <span className="text-violet-600">{dir === 1 ? '▲' : '▼'}</span>}</button>;
}

function InstrumentTable({ data, market, open, watchlist, toggleWatch, openBrokerAccess }: { data: Instrument[]; market?: MarketFilter; open: (i: Instrument) => void; watchlist?: string[]; toggleWatch?: (symbol: string) => void; openBrokerAccess?: () => void }) {
 const [sort, setSort] = useState<{ key: InstrumentSortKey; dir: 1 | -1 } | null>(null);
 const sorted = useMemo(() => {
  if (!sort) return data;
  const { key, dir } = sort;
  return [...data].sort((a, b) => (typeof a[key] === 'string' ? (a[key] as string).localeCompare(b[key] as string) * dir : ((a[key] as number) - (b[key] as number)) * dir));
 }, [data, sort]);
 function toggleSort(key: InstrumentSortKey) { setSort(s => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 })); }
 return (
  <div className="max-w-full overflow-x-auto" role="region" aria-label="Market instrument results" tabIndex={0}><table className="market-screener-table w-full text-left text-xs">
  <thead><tr>{toggleWatch && <th>Watchlist</th>}<th>Logo</th>{instrumentColumns.map(c => <th key={c.key}><SortHeader label={c.label} active={sort?.key === c.key} dir={sort?.dir ?? 1} onClick={() => toggleSort(c.key)} /></th>)}<th>Price trend</th></tr></thead>
   <tbody>
    {sorted.map(i => (
     <tr key={i.symbol} className="group" onClick={() => open(i)}>
      {toggleWatch && <td><button aria-label={`${watchlist?.includes(i.symbol) ? 'Remove' : 'Add'} ${i.symbol} ${watchlist?.includes(i.symbol) ? 'from' : 'to'} watchlist`} onClick={event => { event.stopPropagation(); toggleWatch(i.symbol); }} className={`grid size-7 place-items-center rounded-lg border ${watchlist?.includes(i.symbol) ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-border text-slate-400 hover:bg-slate-50'}`}><Star className={`size-3.5 ${watchlist?.includes(i.symbol) ? 'fill-violet-600' : ''}`} /></button></td>}
      <td><span className="instrument-logo" aria-label={`${i.name} logo`}>{i.symbol.slice(0, 2).toUpperCase()}</span></td>
      <td><b className="text-slate-900">{market === 'Crypto' ? i.symbol.split('/')[0] : i.symbol}</b></td>
      <td className="mono"><div className="flex items-center gap-2"><span>{i.price.toLocaleString()}</span>{openBrokerAccess && <button type="button" className={`secondary px-2 py-1 text-[9px] ${i.signal === 'LONG' ? 'text-emerald-700' : 'text-rose-700'}`} onClick={event => { event.stopPropagation(); openBrokerAccess(); }}>{i.signal === 'LONG' ? 'Buy' : 'Sell'}</button>}</div></td>
      <td className={i.change >= 0 ? 'up' : 'down'}>{i.change > 0 ? '+' : ''}{i.change}%</td>
      <td className={i.return1m >= 0 ? 'up' : 'down'}>{i.return1m}%</td>
      <td>{i.rvol.toFixed(2)}</td>
      <td>{i.rsi}</td>
      <td>{fmt(i.marketCap)}</td>
      <td><PriceSparkline instrument={i} /></td>
     </tr>
    ))}
   </tbody>
  </table></div>
 );
}

function PriceSparkline({ instrument }: { instrument: Instrument }) {
 const points = Array.from({ length: 18 }, (_, index) => {
  const progress = index / 17;
  const wave = Math.sin(index * 1.45 + instrument.price) * Math.max(Math.abs(instrument.change) * .35, .18);
  return instrument.price * (1 - instrument.return1m / 100 + (instrument.return1m / 100) * progress) + wave;
 });
 const low = Math.min(...points);
 const high = Math.max(...points);
 const span = Math.max(high - low, .0001);
 const path = points.map((value, index) => `${(index / 17) * 76 + 2},${18 - ((value - low) / span) * 14}`).join(' ');
 const positive = instrument.change >= 0;
 return <svg viewBox="0 0 80 20" className="h-5 w-20" role="img" aria-label={`${instrument.symbol} price trend`}><polyline points={path} fill="none" stroke={positive ? '#10b981' : '#ef4444'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const indexStatusTone: Record<IndexStatus, string> = { 'Top Gainer': 'bg-emerald-100 text-emerald-700', 'Top Loser': 'bg-rose-100 text-rose-700', 'New High': 'bg-violet-100 text-violet-700', 'New Low': 'bg-amber-100 text-amber-700', Neutral: 'bg-slate-100 text-slate-600' };

type IndexSortKey = 'name' | 'price' | 'change' | 'status';

const indexColumns: { key: IndexSortKey; label: string }[] = [{ key: 'name', label: 'Index' }, { key: 'price', label: 'Last spot' }, { key: 'change', label: 'Change' }, { key: 'status', label: 'Status' }];

function IndicesPanel({ data, open }: { data: MarketIndex[]; open: (index: MarketIndex) => void }) {
 const [sort, setSort] = useState<{ key: IndexSortKey; dir: 1 | -1 } | null>(null);
 const [selected, setSelected] = useState<MarketIndex>(data[0] ?? marketIndices[0]);
 useEffect(() => {
  if (!data.some(index => index.symbol === selected.symbol)) setSelected(data[0] ?? marketIndices[0]);
 }, [data, selected.symbol]);
 const sorted = useMemo(() => {
  if (!sort) return data;
  const { key, dir } = sort;
  return [...data].sort((a, b) => (typeof a[key] === 'string' ? (a[key] as string).localeCompare(b[key] as string) * dir : ((a[key] as number) - (b[key] as number)) * dir));
 }, [data, sort]);
 function toggleSort(key: IndexSortKey) { setSort(s => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 })); }
 return (
  <div className="grid grid-cols-[minmax(0,1fr)_320px] max-xl:grid-cols-1">
   <table className="w-full text-left text-xs">
    <thead><tr>{indexColumns.map(c => <th key={c.key}><SortHeader label={c.label} active={sort?.key === c.key} dir={sort?.dir ?? 1} onClick={() => toggleSort(c.key)} /></th>)}<th>Signal</th></tr></thead>
    <tbody>
     {sorted.map(idx => (
      <tr key={idx.symbol} onClick={() => { setSelected(idx); open(idx); }} className={selected.symbol === idx.symbol ? 'bg-violet-50' : ''}>
       <td><b className="text-slate-900">{idx.name}</b><small>{idx.region}</small></td>
       <td className="mono">{idx.price.toLocaleString()}</td>
       <td className={idx.change >= 0 ? 'up' : 'down'}>{idx.change > 0 ? '+' : ''}{idx.change}%</td>
       <td><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${indexStatusTone[idx.status]}`}>{idx.status}</span></td>
       <td><span className={`badge ${idx.signal === 'LONG' ? 'positive' : ''}`}>{idx.signal} {idx.confidence}%</span></td>
      </tr>
     ))}
    </tbody>
   </table>
   <div className="border-t border-border p-4 xl:border-l xl:border-t-0">
    <p className="text-sm font-semibold text-slate-900">{selected.name}</p>
    <p className="sub">{selected.region} · Sector breadth</p>
    <div className="mt-4 space-y-2.5">
     {selected.sectors.map(s => (
      <div key={s.sector} className="flex items-center gap-2 text-[10px]">
       <span className="w-24 shrink-0 text-slate-500">{s.sector}</span>
       <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300" />
        <div className={`absolute inset-y-0 rounded-full ${s.change >= 0 ? 'left-1/2 bg-emerald-500' : 'right-1/2 bg-rose-500'}`} style={{ width: `${Math.min(50, Math.abs(s.change) * 18)}%` }} />
       </div>
       <span className={`w-12 shrink-0 text-right font-mono ${s.change >= 0 ? 'up' : 'down'}`}>{s.change > 0 ? '+' : ''}{s.change}%</span>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}

function MetricSelect({ label, value, options, onChange }: { label: string; value: InstrumentMetric; options: MetricOption[]; onChange: (value: InstrumentMetric) => void }) {
 return <label className="flex items-center gap-2 text-[10px] text-slate-500"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value as InstrumentMetric)} className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-700 outline-none"><option value="">Choose</option>{options.map(option => <option key={option.key} value={option.key}>{option.label}{option.unit && ` (${option.unit})`}</option>)}</select></label>;
}

const heatmapMetricKeys: InstrumentMetric[] = ['marketCap', 'pe', 'rvol', 'change', 'return1m'];

const heatmapMetricOptions = (market: MarketFilter) => metricOptions[market].filter(option => heatmapMetricKeys.includes(option.key));

const heatmapValue = (instrument: Instrument, key: InstrumentMetric): number | null => {
 const value = instrument[key];
 return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const finiteValues = (data: Instrument[], key: InstrumentMetric) => data.map(instrument => heatmapValue(instrument, key)).filter((value): value is number => value !== null);

const quantile = (values: number[], ratio: number) => {
 if (!values.length) return 0;
 const sorted = [...values].sort((a, b) => a - b);
 return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio))];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const heatmapWeight = (value: number | null, values: number[], key: InstrumentMetric) => {
 const fallback = quantile(values, .5);
 const safeValue = value === null ? fallback : value;
 const transformed = key === 'marketCap' ? Math.log1p(Math.max(0, safeValue)) : (key === 'change' || key === 'return1m') ? Math.sqrt(Math.abs(safeValue)) : Math.sqrt(Math.max(0, safeValue));
 const transformedValues = values.map(item => key === 'marketCap' ? Math.log1p(Math.max(0, item)) : (key === 'change' || key === 'return1m') ? Math.sqrt(Math.abs(item)) : Math.sqrt(Math.max(0, item)));
 const low = quantile(transformedValues, .05);
 const high = quantile(transformedValues, .95);
 return clamp(high === low ? 1 : (transformed - low) / (high - low), 0, 1) * 1.45 + .35;
};

const interpolateHex = (from: [number, number, number], to: [number, number, number], amount: number) => `rgb(${from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount)).join(', ')})`;

const heatmapColor = (value: number | null, values: number[], key: InstrumentMetric) => {
 if (value === null || !values.length) return { background: '#f8fafc', border: '#e2e8f0' };
 const low = quantile(values, .05);
 const high = quantile(values, .95);
 const scale = clamp(high === low ? .5 : (value - low) / (high - low), 0, 1);
 const isDiverging = key === 'change' || key === 'return1m';
 if (!isDiverging) return { background: interpolateHex([241, 245, 249], [5, 150, 105], scale), border: interpolateHex([226, 232, 240], [4, 120, 87], scale) };
 const center = clamp(value / Math.max(Math.abs(low), Math.abs(high), .0001), -1, 1);
 return center < 0 ? { background: interpolateHex([248, 250, 252], [220, 38, 38], Math.abs(center)), border: interpolateHex([226, 232, 240], [185, 28, 28], Math.abs(center)) } : { background: interpolateHex([248, 250, 252], [22, 163, 74], center), border: interpolateHex([226, 232, 240], [21, 128, 61], center) };
};

const heatmapMetricText = (value: number | null, option: MetricOption) => value === null ? 'N/A' : formatMetric(value, option);
const symbolOffer = (symbol: string, brokers: Broker[]) => {
 if (!brokers.length) return undefined;
 const score = [...symbol].reduce((sum, character) => sum + character.charCodeAt(0), 0);
 if (score % 4 === 0) return undefined;
 const broker = brokers[score % brokers.length];
 const campaign = score % 2 ? `${broker.maxCashback} cashback campaign` : `${broker.spreadFrom} spread campaign`;
 return { broker, campaign };
};
const availableSignalProducts = (instrument: Instrument) => instrument.market === 'Crypto' ? ['Spot', 'Perpetual', 'CFD'] : instrument.market === 'Forex' ? ['FX spot', 'CFD', 'Future'] : instrument.market === 'Commodity' ? ['Spot', 'CFD', 'Future'] : instrument.market === 'US Stocks' || instrument.market === 'Stocks' ? ['Share', 'Fractional share', 'CFD'] : ['CFD', 'Future'];
function Heatmap({ data, market, open, brokers, userTierLevel, precisionUnlocked }: { data: Instrument[]; market: MarketFilter; open: (i: Instrument) => void; brokers: Broker[]; userTierLevel: number; precisionUnlocked: boolean }) {
 const metricMarket = market === 'All' ? 'Stocks' : market;
 const options = heatmapMetricOptions(metricMarket);
 const [sizeBy, setSizeBy] = useState<InstrumentMetric>('marketCap');
 const [colorBy, setColorBy] = useState<InstrumentMetric>('change');
 const [hovered, setHovered] = useState<Instrument | null>(null);
 useEffect(() => {
  if (!options.some(option => option.key === sizeBy)) setSizeBy(options.find(option => option.key === 'marketCap')?.key ?? options[0]?.key ?? 'change');
  if (!options.some(option => option.key === colorBy)) setColorBy(options.find(option => option.key === 'change')?.key ?? options[0]?.key ?? 'change');
 }, [options, sizeBy, colorBy]);
 const sizeOption = metricLabel(sizeBy, metricMarket);
 const colorOption = metricLabel(colorBy, metricMarket);
 const sizeValues = useMemo(() => finiteValues(data, sizeBy), [data, sizeBy]);
 const colorValues = useMemo(() => finiteValues(data, colorBy), [data, colorBy]);
 const nodes = useMemo(() => {
  const root = hierarchy({ children: data.map(instrument => ({ instrument, weight: heatmapWeight(heatmapValue(instrument, sizeBy), sizeValues, sizeBy) })) }).sum(item => Number('weight' in item ? item.weight : 0));
  return treemap<{ instrument: Instrument; weight: number }>().size([1000, 600]).paddingInner(3).round(false)(root as unknown as HierarchyNode<{ instrument: Instrument; weight: number }>).leaves();
 }, [data, sizeBy, sizeValues]);
 const legendValues: [number, number] = colorValues.length ? [Math.min(...colorValues), Math.max(...colorValues)] : [0, 0];
 const isDiverging = colorBy === 'change' || colorBy === 'return1m';
 return (
  <div className="p-3">
   <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
    <div><p className="text-xs font-semibold text-slate-900">{market === 'All' ? 'Market' : market} heatmap</p><p className="mt-0.5 text-[10px] text-slate-400">Tile size and color use the selected market fields.</p></div>
    <div className="flex flex-wrap gap-2"><MetricSelect label="Size by" value={sizeBy} options={options} onChange={setSizeBy} /><MetricSelect label="Color by" value={colorBy} options={options} onChange={setColorBy} /></div>
   </div>
   <div className="relative aspect-[5/3] min-h-95 w-full min-w-0 overflow-hidden rounded-xl border border-border bg-slate-50">
    {nodes.map(node => {
     const instrument = node.data.instrument;
     const sizeValue = heatmapValue(instrument, sizeBy);
     const colorValue = heatmapValue(instrument, colorBy);
     const color = heatmapColor(colorValue, colorValues, colorBy);
     const area = (node.x1 - node.x0) * (node.y1 - node.y0);
     const detail = area > 12000;
     const compact = area < 5000;
     return <button key={instrument.symbol} onClick={() => open(instrument)} onMouseEnter={() => setHovered(instrument)} onMouseLeave={() => setHovered(null)} className="absolute flex min-h-0 flex-col items-center justify-center overflow-hidden rounded-md border p-1.5 text-center transition-[left,top,width,height,background-color,border-color] duration-500 ease-out hover:z-10 hover:brightness-95" style={{ left: `${node.x0 / 10}%`, top: `${node.y0 / 6}%`, width: `${(node.x1 - node.x0) / 10}%`, height: `${(node.y1 - node.y0) / 6}%`, backgroundColor: color.background, borderColor: color.border }}>
      <b className={`${compact ? 'text-[9px]' : detail ? 'text-sm' : 'text-[10px]'} truncate text-slate-900`}>{instrument.symbol}</b>
      {detail && <span className="max-w-full truncate text-[9px] text-slate-600">{instrument.name}</span>}
      {!compact && <span className="max-w-full truncate text-[9px] font-medium text-slate-700">{heatmapMetricText(sizeValue, sizeOption)}</span>}
      {!compact && <span className="max-w-full truncate text-[9px] text-slate-500">{heatmapMetricText(colorValue, colorOption)}</span>}
      {detail && symbolOffer(instrument.symbol, brokers) && <span className="max-w-full truncate text-[8px] font-semibold text-violet-700">Broker campaign · 7d access</span>}
     </button>;
    })}
    {hovered && <HeatmapTooltip instrument={hovered} offer={symbolOffer(hovered.symbol, brokers)} userTierLevel={userTierLevel} precisionUnlocked={precisionUnlocked} />}
   </div>
   <HeatmapLegend option={colorOption} values={legendValues} diverging={isDiverging} />
  </div>
 );
}

function HeatmapLegend({ option, values, diverging }: { option: MetricOption; values: [number, number]; diverging: boolean }) {
 return <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-400"><span>{heatmapMetricText(values[0], option)}</span><div className={`h-2 flex-1 rounded-full ${diverging ? 'bg-linear-to-r from-rose-500 via-slate-100 to-emerald-500' : 'bg-linear-to-r from-slate-100 to-emerald-600'}`} /><span>{heatmapMetricText(values[1], option)}</span><span className="ml-1 text-slate-500">{diverging ? 'negative · neutral · positive' : 'low · high'}</span></div>;
}

function HeatmapTooltip({ instrument, offer, userTierLevel, precisionUnlocked }: { instrument: Instrument; offer?: { broker: Broker; campaign: string }; userTierLevel: number; precisionUnlocked: boolean }) {
 const rows: [string, string][] = [['Price', instrument.price.toLocaleString(undefined, { maximumFractionDigits: 4 })], ['Market Cap', heatmapMetricText(heatmapValue(instrument, 'marketCap'), metricLabel('marketCap', 'Stocks'))], ['P/E Ratio', heatmapMetricText(heatmapValue(instrument, 'pe'), metricLabel('pe', 'Stocks'))], ['Change 1D', heatmapMetricText(heatmapValue(instrument, 'change'), metricLabel('change', 'Stocks'))], ['Performance 1M', heatmapMetricText(heatmapValue(instrument, 'return1m'), metricLabel('return1m', 'Stocks'))], ['Relative Volume', heatmapMetricText(heatmapValue(instrument, 'rvol'), metricLabel('rvol', 'Stocks'))]];
 const signalProducts = availableSignalProducts(instrument);
 return <div className="pointer-events-none absolute right-2 top-2 z-20 w-64 rounded-lg border border-border bg-white/95 p-3 text-left shadow-xl"><b className="block text-xs text-slate-900">{instrument.name} ({instrument.symbol})</b><p className="mt-1 text-[9px] text-slate-500">{instrument.sector} · {instrument.subSector ?? 'Unclassified'}</p><p className="text-[9px] text-slate-500">{instrument.primaryMarket ?? 'Exchange unavailable'} · {instrument.country ?? 'Country unavailable'}</p><div className="mt-2 border-t border-border pt-2"><b className="text-[9px] uppercase tracking-wide text-violet-700">Trading signals</b><div className="mt-1 space-y-1">{signalProducts.map((product, index) => { const confidence = clampSignalConfidence(instrument.confidence + (index === 0 ? 0 : index === 1 ? -3 : 2)); const tier = signalTierForConfidence(confidence); const locked = !precisionUnlocked && userTierLevel < tier; return <div className="rounded border border-violet-100 bg-violet-50/60 px-2 py-1.5" key={product}><div className="flex items-center justify-between gap-2"><span className="font-semibold text-violet-800">{product}</span><span className="font-semibold text-violet-700">{confidence}% · L{tier}</span></div>{locked ? <span className="text-[9px] font-semibold text-violet-600">Details locked</span> : <span className="text-[9px] text-slate-600">{instrument.signal === 'LONG' ? 'BUY' : 'SELL'} · Target / Entry / Stop {instrument.price.toLocaleString(undefined, { maximumFractionDigits: 4 })} · R:R 1:1.5</span>}</div>; })}</div></div>{offer && <p className="mt-2 rounded bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700">{offer.broker.name} · {offer.campaign} · 7d access</p>}<div className="mt-2 space-y-1 border-t border-border pt-2">{rows.map(([label, value]) => <div className="flex justify-between gap-2 text-[9px]" key={label}><span className="text-slate-400">{label}</span><b className="text-slate-700">{value}</b></div>)}</div></div>;
}

function ScatterView({ data, market, open, brokers, userTierLevel, precisionUnlocked }: { data: Instrument[]; market: MarketFilter; open: (i: Instrument) => void; brokers: Broker[]; userTierLevel: number; precisionUnlocked: boolean }) {
 const options = metricOptions[market];
 const defaultX = options.find(option => option.key === 'rsi')?.key ?? options[0].key;
 const defaultY = options.find(option => option.key === 'return1m')?.key ?? options.find(option => option.key === 'change')?.key ?? options[1]?.key ?? options[0].key;
 const defaultSize = options.find(option => option.key === 'marketCap')?.key ?? options.find(option => option.key === 'volume')?.key ?? options[0].key;
 const [xMetric, setXMetric] = useState<InstrumentMetric>(defaultX);
 const [yMetric, setYMetric] = useState<InstrumentMetric>(defaultY);
 const [sizeMetric, setSizeMetric] = useState<InstrumentMetric>(defaultSize);
 useEffect(() => {
  if (!options.some(option => option.key === xMetric)) setXMetric(defaultX);
  if (!options.some(option => option.key === yMetric)) setYMetric(defaultY);
  if (!options.some(option => option.key === sizeMetric)) setSizeMetric(defaultSize);
 }, [market, options, defaultX, defaultY, defaultSize, xMetric, yMetric, sizeMetric]);
 const xOption = metricLabel(xMetric, market);
 const yOption = metricLabel(yMetric, market);
 const sizeOption = metricLabel(sizeMetric, market);
 const points = data.map(instrument => ({ ...instrument, xValue: metricValue(instrument, xMetric), yValue: metricValue(instrument, yMetric), sizeValue: metricValue(instrument, sizeMetric) }));
 return (
  <div className="p-4">
   <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
    <div><p className="text-xs font-semibold text-slate-900">{market === 'All' ? 'Market' : market} scatter</p><p className="mt-0.5 text-[10px] text-slate-400">Compare available market metrics with native units.</p></div>
    <div className="flex flex-wrap gap-2"><MetricSelect label="X axis" value={xMetric} options={options} onChange={setXMetric} /><MetricSelect label="Y axis" value={yMetric} options={options} onChange={setYMetric} /><MetricSelect label="Point size" value={sizeMetric} options={options} onChange={setSizeMetric} /></div>
   </div>
   <div className="mb-2 flex gap-4 text-[10px] text-slate-400"><span>X: {xOption.label} {xOption.unit && `(${xOption.unit})`}</span><span>Y: {yOption.label} {yOption.unit && `(${yOption.unit})`}</span><span>Size: {sizeOption.label} {sizeOption.unit && `(${sizeOption.unit})`}</span></div>
   <ResponsiveContainer width="100%" height={330}>
    <ScatterChart margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
     <CartesianGrid stroke="#eceaf3" />
     <XAxis type="number" dataKey="xValue" name={xOption.label} unit={xOption.unit === 'quote' ? '' : xOption.unit} stroke="#94a3b8" fontSize={10} />
     <YAxis type="number" dataKey="yValue" name={yOption.label} unit={yOption.unit === 'quote' ? '' : yOption.unit} stroke="#94a3b8" fontSize={10} />
     <ZAxis type="number" dataKey="sizeValue" range={[80, 720]} />
    <Tooltip cursor={{ stroke: '#7c3aed55' }} content={<ScatterTooltip xOption={xOption} yOption={yOption} sizeOption={sizeOption} brokers={brokers} userTierLevel={userTierLevel} precisionUnlocked={precisionUnlocked} />} />
     <Scatter data={points} onClick={point => open(point as unknown as Instrument)}>{points.map(instrument => <Cell key={instrument.symbol} fill={instrument.change >= 0 ? '#7c3aed' : '#ef4444'} />)}</Scatter>
    </ScatterChart>
   </ResponsiveContainer>
  </div>
 );
}

function ScatterTooltip({ active, payload, xOption, yOption, sizeOption, brokers, userTierLevel, precisionUnlocked }: { active?: boolean; payload?: Array<{ payload?: { symbol?: string; name?: string; market?: string; price?: number; signal?: Instrument['signal']; confidence?: number; xValue?: number; yValue?: number; sizeValue?: number } }>; xOption: MetricOption; yOption: MetricOption; sizeOption: MetricOption; brokers: Broker[]; userTierLevel: number; precisionUnlocked: boolean }) {
 if (!active || !payload?.[0]?.payload) return null;
 const point = payload[0].payload;
 const offer = symbolOffer(point.symbol ?? '', brokers);
 const signalTier = signalTierForConfidence(point.confidence ?? 0);
 const detailsLocked = !precisionUnlocked && userTierLevel < signalTier;
 const signalAction = point.signal === 'LONG' ? 'BUY' : 'SELL';
 const signalPrice = point.price?.toLocaleString(undefined, { maximumFractionDigits: 4 }) ?? '—';
 const products = point.market === 'Crypto' ? 'Spot · Perpetual · CFD' : point.market === 'Forex' ? 'FX spot · CFD · Future' : point.market === 'Commodity' ? 'Spot · CFD · Future' : point.market === 'US Stocks' || point.market === 'Stocks' ? 'Share · Fractional share · CFD' : 'CFD · Future';
 return <div className="rounded-lg border border-border bg-white p-3 text-[10px] shadow-lg"><b className="block text-xs text-slate-900">{point.symbol}</b><span className="mt-0.5 block text-[10px] text-slate-500">{point.name}</span><div className="mt-2 flex items-center justify-between gap-3 rounded bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700"><span>{point.signal ?? 'NEUTRAL'} · {point.confidence ?? 0}% confidence</span><span>Level {signalTier}</span></div>{detailsLocked ? <div className="mt-2 rounded border border-violet-100 bg-violet-50/60 px-2 py-2 text-[9px] font-semibold text-violet-700">Signal details require Level {signalTier} access.</div> : <><div className="mt-2 grid grid-cols-3 gap-1 border-b border-border pb-2 text-center"><div><span className="block text-slate-400">Target</span><b className="text-slate-700">{signalPrice}</b></div><div><span className="block text-slate-400">Entry</span><b className="text-slate-700">{signalPrice}</b></div><div><span className="block text-slate-400">Stop</span><b className="text-slate-700">{signalPrice}</b></div></div><div className="mt-2 space-y-1 text-slate-600"><div>Signal: <b>{signalAction}</b></div><div>Products: <b>{products}</b></div><div>Risk/Reward: <b>1:1.5</b></div><div>{xOption.label}: <b>{formatMetric(point.xValue ?? 0, xOption)}</b></div><div>{yOption.label}: <b>{formatMetric(point.yValue ?? 0, yOption)}</b></div><div>{sizeOption.label}: <b>{formatMetric(point.sizeValue ?? 0, sizeOption)}</b></div></div>{offer && <span className="mt-2 block rounded bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700">{offer.broker.name} · {offer.campaign} · 7d access</span>}</>}</div>;
}

function Correlation({ names, instruments, recentTrades, userTierLevel, precisionUnlocked, requestPrecisionUnlock, brokers, onToast, onOpenBrokerAccess }: { names: string[]; instruments: Instrument[]; recentTrades: Array<{ symbol: string; type: 'BUY' | 'SELL'; broker: string; lots: number }>; userTierLevel: number; precisionUnlocked: boolean; requestPrecisionUnlock: () => void; brokers: Broker[]; onToast: (message: string) => void; onOpenBrokerAccess: () => void }) {
 const displayNames = names.length >= 2 ? names.slice(0, 20) : ['No match', 'No match'];
 const offer = names.map(name => symbolOffer(name, brokers)).find(Boolean);
 const latestTrade = recentTrades[0];
 const [reviewChecked, setReviewChecked] = useState(false);
 const [pairConfirmed, setPairConfirmed] = useState(false);
 const [transferConfirmed, setTransferConfirmed] = useState(false);
 const [selectedPairKey, setSelectedPairKey] = useState('');
 const [personalSetup, setPersonalSetup] = useState({ main: { lots: '1.0', stopLossPercent: '1.0', takeProfitPercent: '2.0' }, pair: { lots: '1.0', stopLossPercent: '1.0', takeProfitPercent: '2.0' } });
 const [customAction, setCustomAction] = useState<'AUTO' | 'BUY' | 'SELL'>('AUTO');
 const [customProduct, setCustomProduct] = useState('AUTO');
 const [customSecondaryAction, setCustomSecondaryAction] = useState<'AUTO' | 'BUY' | 'SELL'>('AUTO');
 const [customSecondaryProduct, setCustomSecondaryProduct] = useState('AUTO');
 const [customRiskReward, setCustomRiskReward] = useState('1:1.5');
 const [benchmarkRef, setBenchmarkRef] = useState(latestTrade?.symbol ?? 'last trade');
 const [benchmarkSymbol, setBenchmarkSymbol] = useState(latestTrade?.symbol ?? '');
 const [customPrices, setCustomPrices] = useState({ mainTarget: '', mainStop: '', pairTarget: '', pairStop: '' });
 const tradeBase = benchmarkSymbol.split('/')[0].toUpperCase();
 const primary = instruments.find(instrument => instrument.symbol.toUpperCase() === benchmarkSymbol.toUpperCase() || instrument.symbol.toUpperCase().startsWith(`${tradeBase}/`)) ?? instruments[0];
 const benchmarkAction = primary?.signal === 'LONG' ? 'BUY' : primary?.signal === 'SHORT' ? 'SELL' : latestTrade?.type ?? 'BUY';
 const primaryIndex = primary ? displayNames.indexOf(primary.symbol) : -1;
 const pairSuggestions = primary && primaryIndex >= 0 ? instruments.filter(instrument => instrument.symbol !== primary.symbol && displayNames.includes(instrument.symbol)).map((instrument, index) => {
   const candidateIndex = displayNames.indexOf(instrument.symbol);
   const correlation = Number((Math.cos((primaryIndex + 1) * (candidateIndex + 2) + displayNames.length) * 0.7).toFixed(2));
   const confidence = clampSignalConfidence((primary.confidence + instrument.confidence) / 2 + Math.abs(correlation) * 8);
   return { instrument, correlation, confidence, tier: signalTierForConfidence(confidence), key: `${primary.symbol}-${instrument.symbol}`, direction: correlation >= 0 ? benchmarkAction : (benchmarkAction === 'BUY' ? 'SELL' : 'BUY') };
 }).sort((left, right) => Math.abs(right.correlation) - Math.abs(left.correlation)) : [];
 const positivePairs = pairSuggestions.filter(pair => pair.correlation > 0).sort((left, right) => right.correlation - left.correlation).slice(0, 2);
 const negativePairs = pairSuggestions.filter(pair => pair.correlation < 0).sort((left, right) => left.correlation - right.correlation).slice(0, 2);
 const suggestions = [...positivePairs, ...negativePairs];
 const selectedPair = suggestions.find(pair => pair.key === selectedPairKey) ?? suggestions[0];
 const pairConfidence = selectedPair?.confidence ?? 70;
 const pairTier = selectedPair?.tier ?? 1;
 const pairLocked = !precisionUnlocked && pairTier > userTierLevel;
 const pairProduct = primary ? availableSignalProducts(primary)[0] : 'CFD';
 const pairLabel = primary && selectedPair ? `${primary.symbol} / ${selectedPair.instrument.symbol}` : 'Select two instruments';
 const pairAction = selectedPair?.direction ?? 'BUY';
 const effectiveAction = customAction === 'AUTO' ? pairAction : customAction;
 const effectiveProduct = customProduct === 'AUTO' ? pairProduct : customProduct;
 const secondaryAction = customSecondaryAction === 'AUTO' ? selectedPair?.direction ?? 'BUY' : customSecondaryAction;
 const secondaryProduct = customSecondaryProduct === 'AUTO' ? (selectedPair ? availableSignalProducts(selectedPair.instrument)[0] : 'CFD') : customSecondaryProduct;
 const effectiveRiskReward = customRiskReward.trim() || '1:1.5';
 const connectedBroker = brokers.find(broker => broker.connected);
 const defaultTargetPrice = (price: number, action: 'BUY' | 'SELL') => price * (action === 'BUY' ? 1.02 : 0.98);
 const defaultStopPrice = (price: number, action: 'BUY' | 'SELL') => price * (action === 'BUY' ? 0.99 : 1.01);
 const mainTargetPrice = customPrices.mainTarget || defaultTargetPrice(primary?.price ?? 0, effectiveAction).toFixed(4);
 const mainStopPrice = customPrices.mainStop || defaultStopPrice(primary?.price ?? 0, effectiveAction).toFixed(4);
 const pairTargetPrice = customPrices.pairTarget || defaultTargetPrice(selectedPair?.instrument.price ?? 0, secondaryAction).toFixed(4);
 const pairStopPrice = customPrices.pairStop || defaultStopPrice(selectedPair?.instrument.price ?? 0, secondaryAction).toFixed(4);
 const resetPairDraft = () => {
   setPairConfirmed(false);
   setTransferConfirmed(false);
 };
 const selectBenchmark = (symbol: string) => {
   if (!instruments.some(instrument => instrument.symbol === symbol)) return;
   setBenchmarkSymbol(symbol);
   setBenchmarkRef(symbol);
   setSelectedPairKey('');
   setReviewChecked(false);
   resetPairDraft();
   setCustomPrices({ mainTarget: '', mainStop: '', pairTarget: '', pairStop: '' });
 };
 const selectPair = (key: string) => {
   setSelectedPairKey(key);
   setReviewChecked(false);
   resetPairDraft();
   setCustomPrices({ mainTarget: '', mainStop: '', pairTarget: '', pairStop: '' });
 };
 const confirmPair = () => {
   if (!reviewChecked || pairLocked || !primary || !selectedPair) return;
   setPairConfirmed(true);
   setTransferConfirmed(false);
   onToast(`Pair trade draft confirmed for ${pairLabel} with ${personalSetup.main.lots}/${personalSetup.pair.lots} lots, ${effectiveAction}/${secondaryAction}, targets ${mainTargetPrice}/${pairTargetPrice}, stops ${mainStopPrice}/${pairStopPrice}, and ${effectiveRiskReward} from benchmark ${benchmarkRef}. No order was placed.`);
 };
 const transferPair = () => {
   if (!pairConfirmed || !connectedBroker) return;
   setTransferConfirmed(true);
   onToast(`Confirmed ${effectiveAction}/${secondaryAction} ${effectiveProduct}/${secondaryProduct} pair draft queued for ${connectedBroker.name}; lots ${personalSetup.main.lots}/${personalSetup.pair.lots}, targets ${mainTargetPrice}/${pairTargetPrice}, stops ${mainStopPrice}/${pairStopPrice}, benchmark ${benchmarkRef}. Broker execution still requires final approval.`);
 };
 return (
  <div className="p-6">
   <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-violet-600">Advanced user tool · Level 3–4</p><h2 className="mt-1 text-sm font-semibold text-slate-900">Adaptive pair-trade suggestion</h2><p className="mt-1 max-w-2xl text-[10px] text-slate-500">Aligns your latest trade benchmark with the strongest current instrument relationship. This creates a reviewable draft only; it never submits an order.</p></div>{userTierLevel < 3 && <button className="secondary px-2 py-1 text-[9px]" onClick={requestPrecisionUnlock}><Lock className="mr-1 inline size-2.5" />Requires Level 3</button>}</div>
   <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><p className="label">Adaptive correlation</p><p className="mt-1 text-[10px] text-slate-400">Derived from the current market, venue, sector, and filter selection.</p><p className="mt-1 text-[10px] text-slate-500">High-significance dynamics over ±60% require High-precision signals access.</p>{offer && <p className="mt-1 text-[10px] font-semibold text-violet-700">{offer.broker.name} · {offer.campaign} · unlock 7 days</p>}</div><div className="flex items-center gap-2"><span className="badge">{names.length} matches · showing {Math.min(names.length, 20)}×{Math.min(names.length, 20)}</span>{!precisionUnlocked && <button className="secondary px-2 py-1 text-[9px]" onClick={requestPrecisionUnlock}><Lock className="mr-1 inline size-2.5" />Unlock ±60%</button>}</div></div>
   {false && <section className="mb-4 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 via-white to-amber-50 p-4">
    {userTierLevel < 3 ? <p className="mt-3 rounded-lg border border-violet-100 bg-white/70 px-3 py-2 text-[10px] font-semibold text-violet-700">Reach Level 3 to generate a pair suggestion from your last trade.</p> : primary && suggestions.length ? <div className="mt-3 rounded-lg border border-white bg-white/80 p-3">
      <div className="mb-3"><span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Pairs matched to {benchmarkSymbol || primary.symbol}</span><div className="mt-2 grid gap-2 sm:grid-cols-2">{suggestions.map(pair => <button type="button" key={pair.key} onMouseEnter={() => selectPair(pair.key)} onFocus={() => selectPair(pair.key)} onClick={() => selectPair(pair.key)} className={`rounded border p-2 text-left transition ${selectedPair?.key === pair.key ? 'border-violet-400 bg-violet-50' : 'border-slate-100 bg-slate-50 hover:border-violet-200'}`}><div className="flex items-center justify-between gap-2"><b className="text-[10px] text-slate-800">{primary.symbol} / {pair.instrument.symbol}</b><span className={`text-[9px] font-semibold ${pair.correlation >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{pair.correlation >= 0 ? '+' : ''}{Math.round(pair.correlation * 100)}% corr.</span></div><span className="mt-1 block text-[9px] text-slate-500">{pair.correlation >= 0 ? 'Positive relationship · same-side bias' : 'Negative relationship · hedge-side bias'} · {pair.confidence}% confidence · L{pair.tier}</span></button>)}</div></div>
      {selectedPair && primary && <div className="mb-3 rounded-lg border border-violet-100 bg-violet-50/50 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="text-[9px] font-bold uppercase tracking-wider text-violet-600">Recommended signal details</span><p className="mt-1 text-[10px] text-slate-600">Edit each symbol directly below; targets and risk settings stay with their leg.</p></div><span className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-violet-700">{effectiveAction}/{secondaryAction} · {pairConfidence}% · Level {pairTier}</span></div><div className="mt-2 grid gap-2 sm:grid-cols-2"><div className="rounded border border-white bg-white/80 p-2"><div className="flex items-center justify-between gap-2"><b className="text-[10px] text-slate-800">{primary.symbol}</b><span className="text-[9px] text-slate-400">Main leg</span></div><div className="mt-2 grid grid-cols-2 gap-2 text-[9px] text-slate-500"><span>Entry<b className="mt-1 block text-slate-700">{primary.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</b></span><label>Side<select value={customAction} onChange={event => { setCustomAction(event.target.value as 'AUTO' | 'BUY' | 'SELL'); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700"><option value="AUTO">Latest trade ({pairAction})</option><option value="BUY">BUY</option><option value="SELL">SELL</option></select></label><label>Product<select value={customProduct} onChange={event => { setCustomProduct(event.target.value); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700"><option value="AUTO">Signal ({pairProduct})</option>{availableSignalProducts(primary).map(product => <option key={product} value={product}>{product}</option>)}</select></label><label>Target price<input type="number" value={mainTargetPrice} onChange={event => { setCustomPrices(current => ({ ...current, mainTarget: event.target.value })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label>Stop price<input type="number" value={mainStopPrice} onChange={event => { setCustomPrices(current => ({ ...current, mainStop: event.target.value })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label></div><div className="mt-2 grid grid-cols-3 gap-2"><label className="text-[9px] font-semibold text-slate-500">Lots<input type="number" min="0.01" step="0.01" value={personalSetup.main.lots} onChange={event => { setPersonalSetup(current => ({ ...current, main: { ...current.main, lots: event.target.value } })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label className="text-[9px] font-semibold text-slate-500">Stop loss %<input type="number" min="0.1" step="0.1" value={personalSetup.main.stopLossPercent} onChange={event => { setPersonalSetup(current => ({ ...current, main: { ...current.main, stopLossPercent: event.target.value } })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label className="text-[9px] font-semibold text-slate-500">Take profit %<input type="number" min="0.1" step="0.1" value={personalSetup.main.takeProfitPercent} onChange={event => { setPersonalSetup(current => ({ ...current, main: { ...current.main, takeProfitPercent: event.target.value } })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label></div><div className="mt-2 grid grid-cols-2 gap-2"><label className="text-[9px] font-semibold text-slate-500">Risk / reward<input value={customRiskReward} onChange={event => { setCustomRiskReward(event.target.value); resetPairDraft(); }} placeholder="1:1.5" className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label className="text-[9px] font-semibold text-slate-500">Benchmark ref<input value={benchmarkRef} onChange={event => { setBenchmarkRef(event.target.value); resetPairDraft(); }} placeholder={latestTrade?.symbol ?? 'last trade'} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label></div></div><div className="rounded border border-white bg-white/80 p-2"><div className="flex items-center justify-between gap-2"><b className="text-[10px] text-slate-800">{selectedPair.instrument.symbol}</b><span className="text-[9px] text-slate-400">{selectedPair.correlation >= 0 ? 'Same-side leg' : 'Hedge leg'}</span></div><div className="mt-2 grid grid-cols-2 gap-2 text-[9px] text-slate-500"><span>Entry<b className="mt-1 block text-slate-700">{selectedPair.instrument.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</b></span><label>Side<select value={customSecondaryAction} onChange={event => { setCustomSecondaryAction(event.target.value as 'AUTO' | 'BUY' | 'SELL'); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700"><option value="AUTO">Signal ({selectedPair.direction})</option><option value="BUY">BUY</option><option value="SELL">SELL</option></select></label><label>Product<select value={customSecondaryProduct} onChange={event => { setCustomSecondaryProduct(event.target.value); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700"><option value="AUTO">Signal ({availableSignalProducts(selectedPair.instrument)[0]})</option>{availableSignalProducts(selectedPair.instrument).map(product => <option key={product} value={product}>{product}</option>)}</select></label><label>Target price<input type="number" value={pairTargetPrice} onChange={event => { setCustomPrices(current => ({ ...current, pairTarget: event.target.value })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label>Stop price<input type="number" value={pairStopPrice} onChange={event => { setCustomPrices(current => ({ ...current, pairStop: event.target.value })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label></div><div className="mt-2 grid grid-cols-3 gap-2"><label className="text-[9px] font-semibold text-slate-500">Lots<input type="number" min="0.01" step="0.01" value={personalSetup.pair.lots} onChange={event => { setPersonalSetup(current => ({ ...current, pair: { ...current.pair, lots: event.target.value } })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label className="text-[9px] font-semibold text-slate-500">Stop loss %<input type="number" min="0.1" step="0.1" value={personalSetup.pair.stopLossPercent} onChange={event => { setPersonalSetup(current => ({ ...current, pair: { ...current.pair, stopLossPercent: event.target.value } })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label><label className="text-[9px] font-semibold text-slate-500">Take profit %<input type="number" min="0.1" step="0.1" value={personalSetup.pair.takeProfitPercent} onChange={event => { setPersonalSetup(current => ({ ...current, pair: { ...current.pair, takeProfitPercent: event.target.value } })); resetPairDraft(); }} className="mt-1 w-full rounded border border-slate-200 bg-white px-1 py-1 text-[10px] text-slate-700" /></label></div></div></div></div>}
      <div className="flex flex-wrap items-center justify-between gap-2"><div><span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Selected pair</span><b className="mt-1 block text-base text-slate-900">{pairLabel}</b><span className="text-[10px] text-slate-500">Benchmark: {benchmarkSymbol || latestTrade?.symbol || 'market bias'} · latest trade {latestTrade?.type ?? 'BUY'}{latestTrade?.broker ? ` · ${latestTrade.broker}` : ''}</span></div><div className="text-right"><b className="block text-lg text-violet-700">{pairConfidence}%</b><span className="text-[9px] font-semibold text-slate-500">Level {pairTier} signal</span></div></div>
      <label className="mt-3 flex items-start gap-2 text-[10px] text-slate-600"><input type="checkbox" checked={reviewChecked} onChange={event => { setReviewChecked(event.target.checked); setPairConfirmed(false); }} className="mt-0.5 accent-violet-600" /><span>I reviewed the pair, product, direction, confidence, and risk/reward. Prepare this draft for my confirmation.</span></label>
      <div className="mt-3 flex flex-wrap items-center gap-2"><button className="primary px-3 py-1.5 text-[10px]" disabled={!reviewChecked || pairLocked || pairConfirmed} onClick={confirmPair}>{pairConfirmed ? 'Draft confirmed · no order placed' : pairLocked ? `Unlock Level ${pairTier} signal` : 'Confirm pair-trade draft'}</button>{pairConfirmed && (connectedBroker ? <button className="secondary px-3 py-1.5 text-[10px]" disabled={transferConfirmed} onClick={transferPair}>{transferConfirmed ? `Queued for ${connectedBroker.name}` : `Send confirmed draft to ${connectedBroker.name}`}</button> : <button className="secondary px-3 py-1.5 text-[10px]" onClick={onOpenBrokerAccess}>Connect broker to transfer</button>)}{pairConfirmed && <span className="text-[10px] font-semibold text-emerald-700">{transferConfirmed ? 'Broker queue updated; final execution approval is still required.' : 'Ready for broker review.'}</span>}</div>
    </div> : <p className="mt-3 rounded-lg border border-slate-100 bg-white/70 px-3 py-2 text-[10px] text-slate-500">Apply at least two matching instruments to generate a pair suggestion.</p>}
   </section>}
  <div className="max-h-150 overflow-auto"><div className="grid min-w-225 gap-1 text-center text-[10px]" style={{ gridTemplateColumns: `repeat(${displayNames.length + 1}, minmax(38px, 1fr))` }}>
    <div />{displayNames.map(n => <button type="button" key={n} onClick={() => selectBenchmark(n)} className={`rounded p-2 font-bold text-slate-900 transition hover:bg-violet-50 ${benchmarkSymbol === n ? 'bg-violet-50 text-violet-700' : ''}`}>{n}</button>)}
    {displayNames.map((r, ri) => (
     <>
      <button type="button" className={`rounded p-3 font-bold text-slate-900 transition hover:bg-violet-50 ${benchmarkSymbol === r ? 'bg-violet-50 text-violet-700' : ''}`} key={`${r}-l`} onClick={() => selectBenchmark(r)}>{r}</button>
      {displayNames.map((_, ci) => { const v = ri === ci ? 1 : Number((Math.cos((ri + 1) * (ci + 2) + displayNames.length) * 0.7).toFixed(2)); const significant = Math.abs(v) >= 0.6; return <div key={`${ri}-${ci}`} className="grid aspect-square place-items-center rounded" style={{ background: v > 0 ? `rgba(124,58,237,${0.08 + Math.abs(v) * 0.45})` : `rgba(239,68,68,${0.08 + Math.abs(v) * 0.45})` }}>{significant && !precisionUnlocked ? <Lock className="size-3 text-slate-500" /> : `${Math.round(v * 100)}%`}</div>; })}
     </>
    ))}
  </div></div>
  </div>
 );
}

export { Screener, indexAsInstrument, initialRules };
