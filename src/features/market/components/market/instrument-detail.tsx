'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  LineChart,
  Lock,
  Maximize2,
  MessageCircle,
  Minimize2,
  Newspaper,
  Plus,
  Send,
  ShieldCheck,
  Star,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react';
import type { Instrument, InstrumentDetailData, MarketIndex } from '@market/types';
import { instrumentDetailData, marketIndices } from '@market/data/mock-market';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@market/components/ui/resizable';
import type { PanelImperativeHandle } from 'react-resizable-panels';

type DetailTab =
  | 'Overview'
  | 'Technicals'
  | 'Market Data'
  | 'News'
  | 'Analysis'
  | 'Forecast'
  | 'Products'
  | 'Brokers'
  | 'Tokenomics'
  | 'Financial Report';
type ProductType =
  | 'Spot'
  | 'Share'
  | 'Fractional share'
  | 'FX spot'
  | 'CFD'
  | 'Future'
  | 'Perpetual';
type Broker = {
  name: string;
  venue: string;
  products: ProductType[];
  symbols: string[];
  status: 'Available' | 'Requires account' | 'Restricted';
  spread: string;
  minimum: string;
  platform: string;
  commission?: string;
  execution?: string;
  details?: string;
};

const brokers: Broker[] = [
  {
    name: 'Marketsyde Demo',
    venue: 'Multi-asset gateway',
    products: ['Share', 'Fractional share', 'FX spot', 'CFD', 'Future', 'Spot'],
    symbols: ['AAPL', 'NVDA', 'EUR/USD', 'BTC/USD', 'XAU/USD', 'SPX'],
    status: 'Available',
    spread: 'Demo quote',
    minimum: '$0',
    platform: 'Marketsyde',
    commission: '$0 demo',
    execution: 'Simulated instant fill',
    details: 'Practice account with synthetic quotes and no real-money execution.',
  },
  {
    name: 'ApexTrade Demo',
    venue: 'US equity routing demo',
    products: ['Share', 'Fractional share'],
    symbols: ['AAPL', 'MSFT', 'NVDA'],
    status: 'Available',
    spread: 'From $0.01',
    minimum: '$5',
    platform: 'Apex Web',
    commission: '$0 per share',
    execution: 'Demo smart routing',
    details: 'Dummy US equity broker with whole and fractional share access.',
  },
  {
    name: 'Nova CFD Lab',
    venue: 'Multi-asset CFD demo',
    products: ['CFD'],
    symbols: ['AAPL', 'NVDA', 'XAU/USD', 'SPX'],
    status: 'Requires account',
    spread: 'From 0.12%',
    minimum: '$100',
    platform: 'Nova Terminal',
    commission: 'Included in spread',
    execution: 'Demo market execution',
    details: 'Dummy leveraged-product provider for testing eligibility and account flows.',
  },
  {
    name: 'FractionHub Sandbox',
    venue: 'Fractional equity demo',
    products: ['Fractional share'],
    symbols: ['AAPL', 'MSFT', 'NVDA'],
    status: 'Restricted',
    spread: 'Reference quote',
    minimum: '$1',
    platform: 'Mobile + web',
    commission: '$0 demo',
    execution: 'Scheduled batch demo',
    details: 'Dummy fractional-share venue with region-dependent availability.',
  },
  {
    name: 'Northstar Markets',
    venue: 'Regulated broker demo',
    products: ['Share', 'FX spot', 'CFD', 'Future'],
    symbols: ['AAPL', 'MSFT', 'EUR/USD', 'XAU/USD', 'SPX'],
    status: 'Requires account',
    spread: 'From 0.8 pip',
    minimum: '$250',
    platform: 'WebTrader',
  },
  {
    name: 'Atlas Exchange',
    venue: 'Digital asset venue demo',
    products: ['Spot', 'Perpetual'],
    symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
    status: 'Requires account',
    spread: 'From 0.04%',
    minimum: '$10',
    platform: 'API + web',
  },
  {
    name: 'Regional Access Desk',
    venue: 'Jurisdiction-dependent',
    products: ['CFD', 'Future'],
    symbols: ['XAU/USD', 'WTI/USD', 'SPX'],
    status: 'Restricted',
    spread: 'Check conditions',
    minimum: 'Varies',
    platform: 'Partner platform',
  },
];

const tabList: DetailTab[] = [
  'Overview',
  'Technicals',
  'Market Data',
  'News',
  'Analysis',
  'Forecast',
  'Products',
  'Brokers',
];
type InstrumentNews = {
  source: string;
  time: string;
  title: string;
  summary: string;
};
const instrumentNews = (instrument: Instrument): InstrumentNews[] => [
  {
    source: 'Marketsyde AI',
    time: '10:42',
    title: `${instrument.name} holds its monitored technical level`,
    summary: `${instrument.symbol} is showing ${instrument.rvol.toFixed(2)}x relative volume with sentiment at ${instrument.sentiment}%.`,
  },
  {
    source: 'Demo Wire',
    time: '09:18',
    title: `Participation broadens across ${instrument.sector}`,
    summary: `The latest move is being tracked alongside ${instrument.subSector ?? 'the broader market'} activity.`,
  },
  {
    source: 'Market Brief',
    time: 'Yesterday',
    title: `What matters next for ${instrument.symbol}`,
    summary:
      'Macro context, liquidity, and provider availability remain the main watch items.',
  },
  {
    source: 'Sector Pulse',
    time: 'Yesterday',
    title: `${instrument.sector} breadth keeps expanding`,
    summary: `Related names are contributing to the ${instrument.symbol} move, with participation spreading across the group.`,
  },
  {
    source: 'Exchange Desk',
    time: 'Sep 9',
    title: `Liquidity remains healthy around ${instrument.symbol}`,
    summary:
      'Demo market depth and relative activity remain above the recent baseline.',
  },
  {
    source: 'Research Note',
    time: 'Sep 8',
    title: `Analysts update the ${instrument.name} watchlist`,
    summary:
      'The latest context combines momentum, volume, and upcoming market catalysts.',
  },
];

function assetClass(instrument: Instrument) {
  if (instrument.market === 'Forex') return 'Forex';
  if (instrument.market === 'Crypto') return 'Crypto';
  if (instrument.market === 'Commodity') return 'Commodity';
  if (instrument.market === 'US Stocks' || instrument.market === 'Stocks')
    return 'Stock';
  return 'Index';
}

function availableProducts(instrument: Instrument): ProductType[] {
  const kind = assetClass(instrument);
  if (kind === 'Crypto') return ['Spot', 'Perpetual', 'CFD'];
  if (kind === 'Forex') return ['FX spot', 'CFD', 'Future'];
  if (kind === 'Commodity') return ['Spot', 'CFD', 'Future'];
  if (kind === 'Index') return ['CFD', 'Future'];
  return ['Share', 'Fractional share', 'CFD'];
}

function recommendedProductCopy(
  kind: string,
): { product: ProductType; detail: string }[] {
  if (kind === 'Crypto')
    return [
      { product: 'Spot', detail: 'Direct 24/7 asset exposure' },
      { product: 'Perpetual', detail: 'Leveraged directional product' },
    ];
  if (kind === 'Forex')
    return [
      { product: 'FX spot', detail: 'Standard currency-pair access' },
      { product: 'CFD', detail: 'Flexible margin product' },
    ];
  if (kind === 'Commodity')
    return [
      { product: 'Future', detail: 'Exchange-traded contract' },
      { product: 'CFD', detail: 'Flexible margin product' },
    ];
  if (kind === 'Index')
    return [
      { product: 'CFD', detail: 'Broad index exposure' },
      { product: 'Future', detail: 'Exchange-traded contract' },
    ];
  return [
    { product: 'Share', detail: 'Direct company ownership' },
    { product: 'Fractional share', detail: 'Smaller position sizing' },
  ];
}

function displayValue(instrument: Instrument) {
  if (assetClass(instrument) === 'Forex') return instrument.price.toFixed(4);
  if (instrument.price < 1) return instrument.price.toFixed(4);
  return instrument.price.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

type PerformancePeriod = '1D' | '1W' | '1M' | '1Y';
type CompareRange =
  | '1d'
  | '3d'
  | '7d'
  | '14d'
  | '1m'
  | '3m'
  | '6m'
  | '1y'
  | '3y'
  | '5y';
const periodDays: Record<PerformancePeriod, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '1Y': 365,
};
const thirtyTwo = 32;
const compareRanges: CompareRange[] = [
  '1d',
  '3d',
  '7d',
  '14d',
  '1m',
  '3m',
  '6m',
  '1y',
  '3y',
  '5y',
];
const marketTagTopics = ['TECHNICAL', 'BREADTH', 'MACRO', 'SECTOR', 'RISK'] as const;
const rangeReturnMultiplier: Record<CompareRange, number> = {
  '1d': 1,
  '3d': 1.35,
  '7d': 1.8,
  '14d': 2.2,
  '1m': 1,
  '3m': 2.2,
  '6m': 3.8,
  '1y': 7.4,
  '3y': 16,
  '5y': 25,
};
const compareReturn = (instrument: Instrument, range: CompareRange) =>
  range === '1m'
    ? instrument.return1m
    : instrument.change * rangeReturnMultiplier[range];
const periodReturn = (instrument: Instrument, period: PerformancePeriod) =>
  period === '1D'
    ? instrument.change
    : period === '1W'
      ? compareReturn(instrument, '7d')
      : period === '1M'
        ? instrument.return1m
        : compareReturn(instrument, '1y');
const periodToRange: Record<PerformancePeriod, CompareRange> = {
  '1D': '1d',
  '1W': '7d',
  '1M': '1m',
  '1Y': '1y',
};
const rangeToPeriod: Partial<Record<CompareRange, PerformancePeriod>> = {
  '1d': '1D',
  '7d': '1W',
  '1m': '1M',
  '1y': '1Y',
};
function performanceSeries(
  instrument: Instrument,
  period: PerformancePeriod,
  selectedReturn = periodReturn(instrument, period),
) {
  const totalReturn = selectedReturn;
  const volatility = Math.max(Math.abs(totalReturn) * 0.18, 0.35);
  return Array.from({ length: thirtyTwo }, (_, index) => {
    const progress = index / (thirtyTwo - 1);
    const wave =
      Math.sin(index * 1.37 + instrument.price) * volatility * (1 - progress) +
      Math.sin(index * 0.47) * volatility * 0.35;
    return (
      instrument.price *
      (1 - totalReturn / 100 + (totalReturn / 100) * progress + wave / 100)
    );
  });
}

export function InstrumentDetail({ instrument, chartOpen, chartContent, showLinkedTags, onShowLinkedTagsChange, onCommunityChart, onBack, onChart, onToast }: { instrument: Instrument; chartOpen: boolean; chartContent: ReactNode; showLinkedTags: boolean; onShowLinkedTagsChange: (show: boolean) => void; onCommunityChart: (name: string) => void; onBack: () => void; onChart: () => void; onToast: (message: string) => void }) {
  const [tab, setTab] = useState('Overview');
  const [watching, setWatching] = useState(false);
  const [vote, setVote] = useState<string | null>(null);
  const [article, setArticle] = useState<InstrumentNews | null>(null);
  const [product, setProduct] = useState<ProductType>(availableProducts(instrument)[0]);
  const [newsFilter, setNewsFilter] = useState('All news');
  const kind = assetClass(instrument);
  const news = instrumentNews(instrument);
  const taggedNews = news.map((item, index) => ({ ...item, tag: marketTagTopics[index % marketTagTopics.length] }));
  const positive = instrument.change >= 0;
  const focusCommunityPost = (name: string) => {
    const post = Array.from(document.querySelectorAll<HTMLElement>('.concept-post')).find((item) => item.querySelector('b')?.textContent?.includes(name));
    if (!post) return;
    post.scrollIntoView({ behavior: 'smooth', block: 'center' });
    post.classList.add('concept-post-focus');
    window.setTimeout(() => post.classList.remove('concept-post-focus'), 2200);
  };
  const instrumentTabs = <nav className="concept-tabs concept-tabs-workspace" aria-label="Instrument sections">{[...tabList.filter(item => !['News', 'Products', 'Brokers'].includes(item)), 'Products & Brokers', ...(kind === 'Stock' ? ['Financial Report'] : [])].map(item => <button key={item} onClick={() => setTab(item)} aria-current={tab === item ? 'page' : undefined}>{item}</button>)}</nav>;
  return <div className="concept-instrument">
    <section className="concept-bounty"><div className="concept-bounty-icon"><TrendingUp /></div><div><span className="concept-gold-label">DAILY MARKET FOCUS</span><h2>Explore {instrument.symbol}, from price to perspective</h2><p>Review the chart, market context, and community outlook.</p></div><button onClick={onChart}>Open advanced chart <ArrowRight size={16} /></button></section>
    <section className="concept-quote">
      <div className="concept-identity"><button onClick={onBack} className="concept-back"><ArrowLeft size={14} /> Markets / {kind}</button><div className="concept-name"><div className="concept-symbol">{instrument.symbol.slice(0, 4)}</div><div><h1>{instrument.name}</h1><div className="concept-tags"><span>{instrument.primaryMarket ?? instrument.market}: {instrument.symbol}</span><span>{instrument.subSector ?? instrument.sector}</span></div><p>Demo quote · {kind === 'Crypto' ? '24/7 market' : 'Regular market session'} · USD</p></div></div></div>
      <div className="concept-price"><h2>{kind === 'Forex' ? '' : '$'}{displayValue(instrument)}</h2><span className={positive ? 'concept-up' : 'concept-down'}>{positive ? '↗ +' : '↘ '}{instrument.change.toFixed(2)}%</span><small> Today · demo snapshot</small><div className="concept-quote-stats"><div><small>MARKET CAP</small><b>{instrument.marketCap ? `$${instrument.marketCap.toLocaleString()}B` : '—'}</b></div><div><small>VOLUME</small><b>{instrument.volume.toLocaleString()}M</b></div><div><small>RELATIVE VOLUME</small><b>{instrument.rvol.toFixed(2)}×</b></div><div><small>1 MONTH RETURN</small><b>{instrument.return1m > 0 ? '+' : ''}{instrument.return1m}%</b></div></div><div className="concept-actions"><button onClick={() => { setWatching(!watching); onToast(watching ? 'Removed from watchlist' : 'Added to watchlist'); }}><Star size={15} fill={watching ? 'currentColor' : 'none'} />{watching ? 'Watching' : 'Watchlist'}</button><button onClick={() => onToast(`Demo price alert created for ${instrument.symbol}`)}><Bell size={15} /> Alert</button><button className="concept-primary" onClick={() => setTab('Brokers')}>Trade via broker <ArrowRight size={16} /></button></div></div>
    </section>
    <div className="concept-columns">
      <aside className="concept-news concept-card"><div className="concept-section-title"><Newspaper size={19} /><div><h2>Latest news</h2><p>Market context for {instrument.symbol}</p></div><span className="concept-demo">DEMO</span></div><div className="concept-news-filters">{['All news', 'Market', 'Research'].map(item => <button key={item} className={newsFilter === item ? 'selected' : ''} onClick={() => setNewsFilter(item)}>{item}</button>)}</div>{taggedNews.filter((_, index) => newsFilter === 'All news' || (newsFilter === 'Market' ? index < 3 : index >= 3)).map(item => <article id={`news-${instrument.symbol.replaceAll('/', '-')}-${item.tag}`} className="market-tag-target" key={item.title}><div className="concept-news-meta"><span>{item.source}</span><small>{item.time}</small></div><a className="market-context-tag" href={`#community-${instrument.symbol.replaceAll('/', '-')}-${item.tag}`}>#{instrument.symbol}_{item.tag}</a><h3>{item.title}</h3><p>{item.summary}</p><button onClick={() => setArticle(item)}>Read full <ArrowRight size={12} /></button></article>)}</aside>
      <div className="concept-analysis">
        {tab !== 'Overview' && <section className="panel concept-tabs-panel">{instrumentTabs}</section>}
        {tab === 'Overview' && <><Overview instrument={instrument} kind={kind} onChart={onChart} chartOpen={chartOpen} chartContent={chartContent} showLinkedTags={showLinkedTags} onShowLinkedTagsChange={onShowLinkedTagsChange} tabs={instrumentTabs} /><section className="concept-card concept-summary"><div className="concept-summary-top"><div><p className="concept-eyebrow">TECHNICAL OUTLOOK</p><h2 className={positive ? 'concept-up' : 'concept-down'}>{instrument.signal === 'LONG' ? 'Positive momentum' : instrument.signal === 'WATCH' ? 'Watch for confirmation' : 'Neutral outlook'}</h2><p>Synthetic signal · {instrument.confidence}% confidence</p></div><div><p className="concept-eyebrow">COMMUNITY OUTLOOK</p><b>{instrument.sentiment}% bullish</b></div></div><div className="concept-sentiment-bar"><i style={{width: `${instrument.sentiment}%`}} /></div><h3>Key valuation & activity</h3><div className="concept-metrics"><Metric label="P/E ratio" value={instrument.pe ? `${instrument.pe.toFixed(1)}x` : '—'} /><Metric label="RSI (14)" value={instrument.rsi.toFixed(1)} /><Metric label="Relative volume" value={`${instrument.rvol.toFixed(2)}x`} /><Metric label="1M return" value={`${instrument.return1m}%`} /></div><h3>Technical evidence</h3><TechnicalSummary instrument={instrument} /></section></>}
        {tab === 'Technicals' && <TechnicalSummary instrument={instrument} />}
        {tab === 'Market Data' && <MarketStats instrument={instrument} kind={kind} />}
        {tab === 'Analysis' && <Analysis instrument={instrument} kind={kind} />}
        {tab === 'Forecast' && <Forecast instrument={instrument} kind={kind} onCommunityScenario={focusCommunityPost} />}
        {['Products', 'Brokers', 'Products & Brokers'].includes(tab) && <ProductsAndBrokersTable instrument={instrument} product={product} products={availableProducts(instrument)} setProduct={setProduct} brokers={brokers.filter(b => b.symbols.includes(instrument.symbol))} />}
        {tab === 'Financial Report' && <FinancialReport instrument={instrument} />}
      </div>
      <aside className="concept-community concept-card"><div className="concept-section-title"><Users size={20} /><div><h2>Community sentiment</h2><p>{instrument.symbol} trader perspectives</p></div></div><div className="concept-voting"><div><b className="concept-up">↗ {instrument.sentiment}% Bullish</b><b className="concept-down">{100-instrument.sentiment}% Bearish ↘</b></div><div className="concept-sentiment-bar"><i style={{width: `${instrument.sentiment}%`}} /></div><div>{['Bullish', 'Bearish'].map(item => <button key={item} aria-pressed={vote === item} onClick={() => {setVote(item); onToast(`${item} demo vote recorded`);}}>{vote === item ? '✓ ' : ''}Vote {item}</button>)}</div></div><h3 className="concept-eyebrow">PREDICTOR SPOTLIGHT</h3><div className="concept-predictor"><span className="concept-avatar">MC</span><div><b>Maya Chen</b><p>Momentum analyst</p></div><strong>82%<small>accuracy · demo</small></strong></div><button className="concept-outline" onClick={() => onToast(`Community discussion for ${instrument.symbol} is in demo mode`)}>Discuss {instrument.symbol} <MessageCircle size={15} /></button>{[{name:'Daniel Markson',initials:'DM',time:'19h',tag:'TECHNICAL',text:`Watching ${instrument.symbol}: participation is stronger than the prior session. Looking for confirmation around the next pullback.`},{name:'CLORA',initials:'CL',time:'21h',tag:'BREADTH',text:`The ${instrument.symbol} setup looks constructive. Volume and broader ${instrument.sector.toLowerCase()} activity are the next things on my checklist.`},{name:'Aisha Rahman',initials:'AR',time:'1d',tag:'MACRO',text:`Base case for ${instrument.symbol}: steady demand and improving breadth support a measured continuation, with volatility around earnings.`},{name:'Leo Park',initials:'LP',time:'1d',tag:'SECTOR',text:`I see a range scenario for ${instrument.symbol}. A breakout needs stronger volume; otherwise consolidation remains likely.`},{name:'Sofia Mendes',initials:'SM',time:'2d',tag:'RISK',text:`Risk case for ${instrument.symbol}: valuation sensitivity could create a deeper retest before the longer-term trend resumes.`}].map(post => <article id={`community-${instrument.symbol.replaceAll('/', '-')}-${post.tag}`} className="concept-post market-tag-target" key={post.name}><div><span className="concept-avatar">{post.initials}</span><b>{post.name}<small>Community contributor · {post.time}</small></b></div><a className="concept-post-tag market-context-tag" href={`#chart-${instrument.symbol.replaceAll('/', '-')}-${post.tag}`}>#{instrument.symbol}_{post.tag}</a><p>{post.text}</p><button onClick={() => onToast('Reaction recorded in demo')}><ThumbsUp size={14} /> Agree</button><button onClick={() => onCommunityChart(post.name)}><LineChart size={14} /> View chart</button></article>)}</aside>
    </div>
    <section className="concept-cashback"><div className="concept-bounty-icon"><WalletCards /></div><div><span className="concept-gold-label">BROKER REWARDS</span><h2>Make your {instrument.symbol} trades go further</h2><p>Explore matched brokers, product access, and available cashback offers.</p></div><button onClick={() => {setTab('Brokers'); window.scrollTo({top:400,behavior:'smooth'});}}>Explore broker offers <ArrowRight size={16} /></button></section>
    <footer className="concept-footer"><b>marketsyde</b><span>Market intelligence · News · Community · Rewards</span><small>Demo market data and community content</small></footer>
    {article && <div className="concept-modal-backdrop" onClick={() => setArticle(null)}><section role="dialog" aria-modal="true" aria-label={article.title} className="concept-card concept-article" onClick={event => event.stopPropagation()}><button className="concept-outline" onClick={() => setArticle(null)}>Close article</button><p className="concept-eyebrow">{article.source} · {article.time} · DEMO</p><h2>{article.title}</h2><p>{article.summary}</p><p>This preview contains a synthetic market brief for {instrument.symbol}.</p></section></div>}
  </div>;
}

function LegacyInstrumentDetail({
  instrument,
  onBack,
  onChart,
  onToast,
}: {
  instrument: Instrument;
  onBack: () => void;
  onChart: () => void;
  onToast: (message: string) => void;
}) {
  const kind = assetClass(instrument);
  const products = availableProducts(instrument);
  const [tab, setTab] = useState<DetailTab>('Overview');
  const [product, setProduct] = useState<ProductType>(products[0]);
  const [watching, setWatching] = useState(false);
  const [alerting, setAlerting] = useState(false);
  const [compare, setCompare] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [selectedNews, setSelectedNews] = useState<InstrumentNews | null>(null);
  const [shareReference, setShareReference] = useState<InstrumentNews | null>(
    null,
  );
  const [communityReference, setCommunityReference] =
    useState<InstrumentNews | null>(null);
  const matchingBrokers = brokers.filter(
    (broker) =>
      broker.symbols.includes(instrument.symbol) &&
      broker.products.includes(product),
  );
  const related =
    kind === 'Index'
      ? marketIndices
          .filter((index) => index.symbol !== instrument.symbol)
          .slice(0, 3)
          .map((index) => ({
            symbol: index.symbol,
            name: index.name,
            change: index.change,
          }))
      : [];
  const tabs =
    kind === 'Crypto'
      ? [...tabList, 'Tokenomics' as DetailTab]
      : kind === 'Stock'
        ? [...tabList, 'Financial Report' as DetailTab]
        : tabList;

  return (
    <div className="instrument-page space-y-4">
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <button onClick={onBack} className="secondary">
          <ArrowLeft />
          Back to screener
        </button>
        <span>Markets</span>
        <ArrowRight className="size-3" />
        <span>{kind}</span>
        <ArrowRight className="size-3" />
        <b className="text-slate-800">{instrument.symbol}</b>
      </div>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-violet-100 text-lg font-semibold text-violet-700">
              {instrument.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{kind}</span>
                <span className="badge">
                  {instrument.primaryMarket ?? instrument.market}
                </span>
                <span className="badge positive">DEMO DATA</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {instrument.name}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {instrument.symbol} - {instrument.sector} -{' '}
                {instrument.subSector ?? 'Unclassified'} -{' '}
                {kind === 'Crypto'
                  ? '24/7 market'
                  : kind === 'Forex'
                    ? '24/5 market'
                    : 'Market session applies'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setWatching(!watching);
                onToast(
                  watching ? 'Removed from watchlist' : 'Added to watchlist',
                );
              }}
              className="secondary"
            >
              <Star
                className={watching ? 'fill-violet-600 text-violet-600' : ''}
              />
              {watching ? 'Watching' : 'Watchlist'}
            </button>
            <button
              onClick={() => {
                setAlerting(!alerting);
                onToast(alerting ? 'Alert removed' : 'Alert created');
              }}
              className="secondary"
            >
              <Bell />
              {alerting ? 'Alert active' : 'Alert'}
            </button>
            <button
              onClick={() => {
                setCompare(!compare);
                onToast(
                  compare ? 'Removed from comparison' : 'Added to comparison',
                );
              }}
              className="secondary"
            >
              <Plus />
              Compare
            </button>
            <button
              onClick={() => setInsightsOpen(!insightsOpen)}
              className="secondary"
            >
              <MessageCircle />
              {insightsOpen ? 'Hide insights' : 'Show insights'}
            </button>
            <button onClick={onChart} className="primary">
              <LineChart />
              Advanced chart
            </button>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_260px] border-t border-border max-md:grid-cols-1">
          <div className="p-5">
            <div className="flex items-end gap-3">
              <span className="font-mono text-3xl font-semibold text-slate-900">
                {displayValue(instrument)}
              </span>
              <span className="mb-1 text-xs text-slate-400">
                {kind === 'Forex'
                  ? 'quote'
                  : kind === 'Index'
                    ? 'points'
                    : 'USD'}
              </span>
              <span
                className={`mb-1 flex items-center gap-1 text-sm font-semibold ${instrument.change >= 0 ? 'up' : 'down'}`}
              >
                {instrument.change >= 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                {instrument.change > 0 ? '+' : ''}
                {instrument.change}% 1D
              </span>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">
              Last update: demo snapshot - Market data availability does not
              imply broker trading availability.
            </p>
          </div>
          <div className="border-l border-border bg-slate-50 p-3 max-md:border-l-0 max-md:border-t">
            <div className="flex items-center justify-between">
              <span className="label">Trading access</span>
              <span className="text-[9px] text-violet-600">
                {instrument.symbol}
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-900">
              Recommended products
            </p>
            <div className="mt-2 space-y-1.5">
              {recommendedProductCopy(kind).map((option) => (
                <button
                  key={option.product}
                  onClick={() => {
                    setProduct(option.product);
                    setTab('Brokers');
                  }}
                  className="w-full rounded-lg border border-border bg-white p-2 text-left hover:border-violet-300"
                >
                  <span className="block text-[10px] font-semibold text-slate-800">
                    {option.product}
                  </span>
                  <span className="mt-0.5 block text-[9px] text-slate-500">
                    {option.detail}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setTab('Brokers')}
              className="primary mt-2 w-full justify-center"
            >
              <BriefcaseBusiness />
              Find broker
            </button>
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] ${tab === item ? 'bg-violet-100 font-semibold text-violet-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
      <DailyMarketFocus instrument={instrument} />
      <div className="mb-1 flex items-center justify-between">
        <span className="label text-violet-600">Market workspace</span>
        <span className="text-[9px] text-slate-400">
          Price, chart, technicals, fundamentals, and products
        </span>
      </div>
      <div className="grid grid-cols-1 items-start gap-4">
        <div className="min-w-0 space-y-4">
          {tab === 'Overview' && (
            <AssetOverviewLayout
              instrument={instrument}
              kind={kind}
              onChart={onChart}
              onNews={() => setTab('News')}
            />
          )}
          {tab === 'Technicals' && <TechnicalSummary instrument={instrument} />}
          {tab === 'Market Data' && (
            <MarketStats instrument={instrument} kind={kind} />
          )}
          {tab === 'News' && (
            <News
              instrument={instrument}
              onSelect={(article) => {
                setSelectedNews(article);
                setInsightsOpen(true);
              }}
              onShare={(article) => {
                setSelectedNews(article);
                setShareReference(article);
                setInsightsOpen(true);
              }}
              onCommunity={(article) => {
                setSelectedNews(article);
                setCommunityReference(article);
                setInsightsOpen(true);
              }}
            />
          )}
          {tab === 'Analysis' && (
            <Analysis instrument={instrument} kind={kind} />
          )}
          {tab === 'Forecast' && (
            <Forecast instrument={instrument} kind={kind} />
          )}
          {tab === 'Products' && (
            <ProductPanel
              products={products}
              product={product}
              setProduct={setProduct}
            />
          )}
          {tab === 'Brokers' && (
            <BrokerPanel
              instrument={instrument}
              product={product}
              products={products}
              setProduct={setProduct}
              brokers={matchingBrokers}
            />
          )}
          {tab === 'Tokenomics' && (
            <AssetSpecific kind="Crypto" instrument={instrument} />
          )}
          {tab === 'Financial Report' && (
            <FinancialReport instrument={instrument} />
          )}
          {related.length > 0 && (
            <section className="panel p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label">Related markets</p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-900">
                    Compare nearby indices
                  </h2>
                </div>
                <CircleHelp className="size-4 text-slate-400" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
                {related.map((item) => (
                  <div
                    key={item.symbol}
                    className="rounded-xl border border-border p-3"
                  >
                    <b className="text-sm text-slate-900">{item.name}</b>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {item.symbol}
                    </p>
                    <span
                      className={`mt-3 block text-xs font-semibold ${item.change >= 0 ? 'up' : 'down'}`}
                    >
                      {item.change > 0 ? '+' : ''}
                      {item.change}%
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="grid grid-cols-2 items-stretch gap-4 max-md:grid-cols-1">
          <div className="panel p-5">
            <p className="label">User workspace</p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              Track {instrument.symbol}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Manage watchlist, alerts, broker access, and symbol rewards.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setWatching(!watching);
                  onToast(
                    watching ? 'Removed from watchlist' : 'Added to watchlist',
                  );
                }}
                className="secondary justify-center"
              >
                <Star />
                {watching ? 'Watching' : 'Watch'}
              </button>
              <button
                onClick={() => {
                  setAlerting(!alerting);
                  onToast(alerting ? 'Alert removed' : 'Alert created');
                }}
                className="secondary justify-center"
              >
                <Bell />
                {alerting ? 'Active' : 'Alert'}
              </button>
            </div>
          </div>
          <CampaignPromotion instrument={instrument} />
        </aside>
      </div>
      {insightsOpen && (
        <InstrumentInsightRail
          instrument={instrument}
          selectedNews={selectedNews}
          shareReference={shareReference}
          communityReference={communityReference}
          onSelectNews={setSelectedNews}
          openNews={() => setTab('News')}
          openChart={onChart}
          onClose={() => setInsightsOpen(false)}
        />
      )}
      <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-[9px] text-slate-400">
        <span>MarketSyde · Demo market intelligence</span>
        <span>
          Market data, broker access, rewards, News, and Community remain
          asset-linked to {instrument.symbol}.
        </span>
      </footer>
    </div>
  );
}

function DailyMarketFocus({ instrument }: { instrument: Instrument }) {
  return (
    <section className="rounded-2xl bg-linear-to-r from-violet-700 to-indigo-600 px-5 py-4 text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-violet-200">
            Daily market focus
          </p>
          <h2 className="mt-1 text-sm font-semibold">
            Analyze {instrument.symbol} and review today&apos;s market context
          </h2>
          <p className="mt-1 text-[10px] text-violet-100">
            Chart, News, Community, and broker insights stay linked to{' '}
            {instrument.name}.
          </p>
        </div>
        <button className="rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-violet-700">
          Open asset checklist
        </button>
      </div>
    </section>
  );
}

function AssetOverviewLayout({
  instrument,
  kind,
  onChart,
  onNews,
}: {
  instrument: Instrument;
  kind: string;
  onChart: () => void;
  onNews: () => void;
}) {
  return (
    <div className="asset-overview-grid grid grid-cols-[minmax(0,1fr)_300px] items-start gap-4 max-lg:grid-cols-1">
      <section className="min-w-0">
        <News
          instrument={instrument}
          onSelect={() => onNews()}
          onShare={() => onNews()}
          onCommunity={() => onNews()}
        />
      </section>
      <section className="min-w-0">
        <div className="mb-2 flex items-center justify-between">
          <span className="label text-violet-600">Market analysis</span>
          <span className="text-xs text-slate-400">
            Overview, chart, and evidence
          </span>
        </div>
        <Overview instrument={instrument} kind={kind} onChart={onChart} />
      </section>
      <CommunityOverviewCard instrument={instrument} />
    </div>
  );
}

function CommunityOverviewCard({ instrument }: { instrument: Instrument }) {
  const bullish = Math.max(0, Math.min(100, Math.round(instrument.sentiment)));
  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="label">Community</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Sentiment
          </h2>
        </div>
        <Users className="size-4 text-cyan-600" />
      </div>
      <p className="mt-1 text-[10px] text-slate-400">
        Active {instrument.market.toLowerCase()} traders
      </p>
      <div className="mt-4 flex items-center justify-between text-xs">
        <b className="text-emerald-600">{bullish}% Bullish</b>
        <b className="text-rose-600">{100 - bullish}% Bearish</b>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-rose-500">
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${bullish}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="rounded-lg border border-emerald-300 py-2 text-[10px] font-semibold text-emerald-600">
          Vote Bullish
        </button>
        <button className="rounded-lg border border-rose-300 py-2 text-[10px] font-semibold text-rose-600">
          Vote Bearish
        </button>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <p className="label">Top predictor</p>
        <div className="mt-2 flex items-center justify-between">
          <b className="text-xs text-slate-800">Maya Chen</b>
          <span className="text-[10px] font-semibold text-violet-600">
            82% accuracy
          </span>
        </div>
        <p className="mt-1 text-[9px] text-slate-400">
          {instrument.symbol} market view
        </p>
      </div>
      <button className="secondary mt-3 w-full justify-center">
        Open Community
      </button>
    </section>
  );
}

function CampaignPromotion({ instrument }: { instrument: Instrument }) {
  const brokers = [
    {
      name: 'HFM',
      mark: 'HFM',
      tone: 'bg-slate-950 text-white',
      points: '1.5x',
      credit: '50 credits',
    },
    {
      name: 'Exness',
      mark: 'ex',
      tone: 'bg-yellow-400 text-slate-950',
      points: '1.25x',
      credit: '50 credits',
    },
    {
      name: 'FX Pro',
      mark: 'Fx',
      tone: 'bg-red-500 text-white',
      points: '1.1x',
      credit: '50 credits',
    },
  ];
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-border bg-violet-50 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="label text-violet-600">Campaigns & Brokers</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-semibold text-amber-700">
                SPONSORED
              </span>
            </div>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              Bonus points for {instrument.symbol}
            </h2>
            <p className="mt-1 text-[10px] text-slate-500">
              Symbol-linked rewards for {instrument.name} · {instrument.market}{' '}
              · {instrument.primaryMarket ?? 'Demo venue'}.
            </p>
          </div>
          <button className="secondary">
            <ArrowRight />
            View all brokers
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          {brokers.map((broker) => (
            <article
              key={broker.name}
              className="rounded-xl border border-violet-100 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`grid size-9 place-items-center rounded-lg text-xs font-bold ${broker.tone}`}
                >
                  {broker.mark}
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">
                  VERIFIED
                </span>
              </div>
              <b className="mt-3 block text-xs text-slate-900">{broker.name}</b>
              <p className="mt-1 text-[10px] font-semibold text-violet-600">
                {broker.credit} for using {broker.name}
              </p>
              <p className="mt-1 text-[9px] text-slate-500">
                {broker.points} points on {instrument.symbol}
              </p>
              <div className="mt-2 space-y-1 border-t border-border pt-2 text-[9px] text-slate-500">
                <div className="flex justify-between">
                  <span>Bonus</span>
                  <b className="text-slate-800">{broker.credit}</b>
                </div>
                <div className="flex justify-between">
                  <span>Asset</span>
                  <b className="text-slate-800">{instrument.symbol}</b>
                </div>
              </div>
              <button className="primary mt-3 w-full justify-center">
                <BriefcaseBusiness />
                View offer
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function InstrumentInsightRail({
  instrument,
  selectedNews,
  shareReference,
  communityReference,
  onSelectNews,
  openNews,
  openChart,
  onClose,
}: {
  instrument: Instrument;
  selectedNews: InstrumentNews | null;
  shareReference: InstrumentNews | null;
  communityReference: InstrumentNews | null;
  onSelectNews: (article: InstrumentNews) => void;
  openNews: () => void;
  openChart: () => void;
  onClose: () => void;
}) {
  const [communityTab, setCommunityTab] = useState<'Top' | 'Latest'>('Top');
  const [followed, setFollowed] = useState(false);
  const [draft, setDraft] = useState('');
  const [newsExpanded, setNewsExpanded] = useState(true);
  const [votes, setVotes] = useState<
    Record<
      string,
      { agreement?: 'agree' | 'disagree'; direction?: 'bull' | 'bear' }
    >
  >({});
  useEffect(() => {
    if (shareReference)
      setDraft(
        `Sharing ${shareReference.title}  -  #${instrument.symbol}:${instrument.name}`,
      );
  }, [instrument, shareReference]);
  const [panelSize, setPanelSize] = useState({ width: 390, height: 720 });
  const [newsWindowExpanded, setNewsWindowExpanded] = useState(false);
  const newsPanelRef = useRef<PanelImperativeHandle | null>(null);
  const [resizeStart, setResizeStart] = useState<{
    axis: 'width' | 'height' | 'both';
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  useEffect(() => {
    if (!resizeStart) return;
    const move = (event: PointerEvent) =>
      setPanelSize((current) => ({
        width:
          resizeStart.axis === 'height'
            ? current.width
            : Math.max(
                320,
                Math.min(
                  window.innerWidth - 32,
                  resizeStart.width + resizeStart.x - event.clientX,
                ),
              ),
        height:
          resizeStart.axis === 'width'
            ? current.height
            : Math.max(
                Math.round(window.innerHeight * 0.5),
                Math.min(
                  window.innerHeight - 96,
                  resizeStart.height + event.clientY - resizeStart.y,
                ),
              ),
      }));
    const up = () => setResizeStart(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [resizeStart]);
  const news = instrumentNews(instrument);
  const visibleNews = newsExpanded ? news : news.slice(0, 4);
  const toggleNewsWindow = () => {
    const expanded = !newsWindowExpanded;
    setNewsWindowExpanded(expanded);
    newsPanelRef.current?.resize(expanded ? '95%' : '85%');
  };
  const setBalancedLayout = () => {
    setNewsWindowExpanded(false);
    newsPanelRef.current?.resize('50%');
  };
  const posts = communityReference
    ? [
        {
          author: 'Topic thread',
          role: 'Community share',
          text: `Discussing: ${communityReference.title}`,
          sentiment: 'Watch',
        },
      ]
    : communityTab === 'Top'
      ? [
          {
            author: 'Daniel_Markson',
            role: 'Momentum desk',
            text: `Watching ${instrument.symbol}: the move has better participation than the prior session.`,
            sentiment: 'Bullish',
          },
          {
            author: 'CLORA',
            role: 'Community analyst',
            text: `The ${instrument.symbol} setup looks constructive, but I want confirmation before adding risk.`,
            sentiment: 'Watch',
          },
        ]
      : [
          {
            author: 'Maya Chen',
            role: 'Marketsyde Pro',
            text: `Fresh read on ${instrument.symbol}: volume and breadth are moving together.`,
            sentiment: 'Bullish',
          },
          {
            author: 'Jon Bell',
            role: 'Risk monitor',
            text: `Keeping a tight invalidation level around this ${instrument.market.toLowerCase()} setup.`,
            sentiment: 'Watch',
          },
        ];
  const updateVote = (
    author: string,
    kind: 'agreement' | 'direction',
    value: 'agree' | 'disagree' | 'bull' | 'bear',
  ) =>
    setVotes((current) => ({
      ...current,
      [author]: {
        ...current[author],
        [kind]: current[author]?.[kind] === value ? undefined : value,
      },
    }));
  return (
    <aside
      style={{ width: panelSize.width, height: panelSize.height }}
      className="instrument-insights fixed right-0 top-16 bottom-0 z-40 min-h-[420px] min-w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden border-l border-border bg-white shadow-none"
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div>
          <p className="label">Asset insights</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {instrument.name} - {instrument.symbol}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-600">
            MOCK
          </span>
          <button
            aria-label="Close asset insights"
            onClick={onClose}
            className="text-lg leading-none text-slate-400 hover:text-slate-700"
          >
            x
          </button>
        </div>
      </div>
      <ResizablePanelGroup
        orientation="vertical"
        className="h-[calc(100%-47px)] min-h-0"
      >
        <ResizablePanel
          id="news-panel"
          panelRef={newsPanelRef}
          defaultSize="75%"
          minSize="10%"
          maxSize="85%"
          className="min-h-0 overflow-y-auto"
        >
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Newspaper className="size-3.5 text-violet-600" />
                <b className="text-xs text-slate-900">News</b>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-400">
                  {news.length} articles
                </span>
                <button
                  onClick={() => setNewsExpanded(!newsExpanded)}
                  className="text-[9px] font-semibold text-violet-600"
                >
                  {newsExpanded ? 'Show less' : 'Show more'}
                </button>
                <button
                  onClick={setBalancedLayout}
                  title="Set News and Community to equal height"
                  className="text-[9px] font-semibold text-slate-500 hover:text-violet-600"
                >
                  50/50
                </button>
                <button
                  onClick={toggleNewsWindow}
                  title={
                    newsWindowExpanded
                      ? 'Restore News window'
                      : 'Expand News window'
                  }
                  aria-label={
                    newsWindowExpanded
                      ? 'Restore News window'
                      : 'Expand News window'
                  }
                  className="text-slate-400 hover:text-violet-600"
                >
                  {newsWindowExpanded ? (
                    <Minimize2 className="size-3" />
                  ) : (
                    <Maximize2 className="size-3" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {visibleNews.map((item) => (
                <article
                  key={item.title}
                  className="border-b border-border pb-3 last:border-0"
                >
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>{item.source}</span>
                    <span>{item.time}</span>
                  </div>
                  <h3 className="mt-1 text-[11px] font-semibold leading-snug text-slate-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                    {item.summary}
                  </p>
                  <button className="mt-2 text-[9px] font-medium text-violet-600">
                    Read article <ArrowRight className="ml-1 inline size-2.5" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="relative z-50 !my-1 !h-2 !w-full !shrink-0 cursor-row-resize border-y border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50" />
        <ResizablePanel
          id="community-panel"
          defaultSize="25%"
          minSize="15%"
          className="min-h-0 overflow-y-auto bg-white"
        >
          <div className="p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="size-3.5 text-cyan-600" />
                <b className="text-xs text-slate-900">Community</b>
              </div>
              <span className="flex items-center gap-1 text-[9px] text-slate-400">
                <Users className="size-3" /> 6.7M votes
              </span>
            </div>
            <div className="rounded-lg border border-border bg-white p-2.5">
              <div className="flex items-center justify-between text-[9px]">
                <b className="text-slate-700">Community sentiment</b>
                <span className="font-semibold text-violet-600">See more</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-emerald-600">74%</span>
                <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-rose-500">
                  <div className="w-3/4 bg-emerald-500" />
                </div>
                <span className="font-semibold text-rose-600">26%</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button className="rounded-md border border-emerald-400 py-1 text-[9px] font-semibold text-emerald-600">
                  Bullish
                </button>
                <button className="rounded-md border border-rose-400 py-1 text-[9px] font-semibold text-rose-600">
                  Bearish
                </button>
              </div>
            </div>
            <div className="mt-3 flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setCommunityTab('Top')}
                className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold ${communityTab === 'Top' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                Top
              </button>
              <button
                onClick={() => setCommunityTab('Latest')}
                className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold ${communityTab === 'Latest' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                Latest
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {posts.map((post, index) => (
                <article
                  key={post.author}
                  className="border-b border-border pb-3 last:border-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                        {post.author.slice(0, 1)}
                      </span>
                      <div>
                        <b className="block text-[10px] text-slate-800">
                          {post.author}
                        </b>
                        <span className="text-[9px] text-slate-400">
                          {post.role} - {index ? '21h' : '19h'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setFollowed(!followed)}
                      className={`rounded-md px-2.5 py-1.5 text-[9px] font-semibold ${followed ? 'bg-slate-100 text-slate-600' : 'bg-violet-600 text-white'}`}
                    >
                      {followed ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-700">
                    {post.text}{' '}
                    <span className="font-medium text-violet-600">
                      #{instrument.symbol.replace('/', '')}
                    </span>
                  </p>
                  <button
                    onClick={openChart}
                    aria-label={`Open full chart for ${instrument.symbol}`}
                    className="mt-2 block h-20 w-full rounded-lg bg-[#0b1119] p-2 text-left hover:ring-1 hover:ring-cyan-400/60"
                  >
                    <div className="relative h-full overflow-hidden">
                      <svg
                        viewBox="0 0 320 64"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full"
                      >
                        <polyline
                          points="0,48 32,42 64,49 96,30 128,36 160,24 192,31 224,18 256,23 288,10 320,15"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="2"
                        />
                        <polyline
                          points="0,58 320,58"
                          fill="none"
                          stroke="#ffffff33"
                          strokeDasharray="3 4"
                        />
                      </svg>
                      <div className="relative flex h-full items-end justify-between">
                        <span className="rounded bg-black/50 px-1.5 py-1 text-[9px] font-semibold text-cyan-200">
                          {instrument.symbol} · SHARED CHART
                        </span>
                        <span className="rounded bg-black/50 px-1.5 py-1 text-[8px] text-emerald-300">
                          Open full chart
                        </span>
                      </div>
                    </div>
                  </button>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    <button
                      title="Agree"
                      aria-label="Agree with this post"
                      onClick={() =>
                        updateVote(post.author, 'agreement', 'agree')
                      }
                      className={`flex items-center justify-center gap-1 rounded border px-2 py-1 text-[8px] font-semibold ${votes[post.author]?.agreement === 'agree' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-border text-slate-500'}`}
                    >
                      <ThumbsUp className="size-3.5" />
                    </button>
                    <button
                      title="Disagree"
                      aria-label="Disagree with this post"
                      onClick={() =>
                        updateVote(post.author, 'agreement', 'disagree')
                      }
                      className={`flex items-center justify-center gap-1 rounded border px-2 py-1 text-[8px] font-semibold ${votes[post.author]?.agreement === 'disagree' ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-border text-slate-500'}`}
                    >
                      <ThumbsDown className="size-3.5" />
                    </button>
                    <button
                      title="Bull"
                      aria-label="Vote bullish on this post"
                      onClick={() =>
                        updateVote(post.author, 'direction', 'bull')
                      }
                      className={`flex items-center justify-center gap-1 rounded border px-2 py-1 text-[8px] font-semibold ${votes[post.author]?.direction === 'bull' ? 'border-cyan-400 bg-cyan-50 text-cyan-700' : 'border-border text-slate-500'}`}
                    >
                      <TrendingUp className="size-3.5" />
                    </button>
                    <button
                      title="Bear"
                      aria-label="Vote bearish on this post"
                      onClick={() =>
                        updateVote(post.author, 'direction', 'bear')
                      }
                      className={`flex items-center justify-center gap-1 rounded border px-2 py-1 text-[8px] font-semibold ${votes[post.author]?.direction === 'bear' ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-border text-slate-500'}`}
                    >
                      <TrendingDown className="size-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 p-1.5">
              <span className="grid size-6 place-items-center rounded-full bg-slate-300 text-[9px] text-white">
                @
              </span>
              <input
                aria-label={`Post about ${instrument.symbol}`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`$${instrument.symbol} How do you feel today?`}
                className="min-w-0 flex-1 bg-transparent px-1 text-[10px] text-slate-700 outline-none"
              />
              <button
                onClick={() => setDraft('')}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-[9px] font-semibold text-white"
              >
                <Send className="size-3" />
              </button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="relative z-50 !my-1 !h-2 !w-full !shrink-0 cursor-row-resize border-y border-slate-200 bg-slate-50 hover:border-violet-300 hover:bg-violet-50" />
        <ResizablePanel
          id="promotion-panel"
          defaultSize="10%"
          minSize="8%"
          maxSize="25%"
          className="min-h-0 overflow-y-auto"
        >
          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-violet-600" />
                <b className="text-xs text-slate-900">Campaigns & Brokers</b>
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[8px] font-semibold text-amber-600">
                SPONSORED
              </span>
            </div>
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-2.5">
              <p className="text-[10px] font-semibold text-slate-800">
                Trade {instrument.symbol} with a matched broker
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
                Compare demo access, product availability, and campaign rewards
                for this asset.
              </p>
              <div className="mt-2 flex gap-1.5">
                <button className="flex-1 rounded-md bg-violet-600 px-2 py-1.5 text-[9px] font-semibold text-white">
                  View brokers
                </button>
                <button className="rounded-md border border-violet-200 bg-white px-2 py-1.5 text-[9px] font-semibold text-violet-700">
                  Campaign
                </button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <div className="pointer-events-none absolute bottom-1 right-1 text-xs text-slate-300">
        â—¢
      </div>
      <button
        aria-label="Resize insights width"
        onPointerDown={(event) =>
          setResizeStart({
            axis: 'width',
            x: event.clientX,
            y: event.clientY,
            width: panelSize.width,
            height: panelSize.height,
          })
        }
        className="absolute inset-y-12 left-0 w-1 cursor-ew-resize bg-transparent hover:bg-violet-200/60"
      />
      <button
        aria-label="Resize insights height"
        onPointerDown={(event) =>
          setResizeStart({
            axis: 'height',
            x: event.clientX,
            y: event.clientY,
            width: panelSize.width,
            height: panelSize.height,
          })
        }
        className="absolute inset-x-12 bottom-0 h-1 cursor-ns-resize bg-transparent hover:bg-violet-200/60"
      />
      <button
        aria-label="Resize insights width and height"
        onPointerDown={(event) =>
          setResizeStart({
            axis: 'both',
            x: event.clientX,
            y: event.clientY,
            width: panelSize.width,
            height: panelSize.height,
          })
        }
        className="absolute bottom-0 left-0 size-4 cursor-nwse-resize bg-slate-200/70"
      />
    </aside>
  );
}

function Overview({
  instrument,
  kind,
  onChart,
  chartOpen = false,
  chartContent = null,
  showLinkedTags = true,
  onShowLinkedTagsChange = () => undefined,
  tabs = null,
}: {
  instrument: Instrument;
  kind: string;
  onChart: () => void;
  chartOpen?: boolean;
  chartContent?: ReactNode;
  showLinkedTags?: boolean;
  onShowLinkedTagsChange?: (show: boolean) => void;
  tabs?: ReactNode;
}) {
  const [period, setPeriod] = useState<PerformancePeriod>('1D');
  const [compareRange, setCompareRange] = useState<CompareRange>('1d');
  const selectedReturn = compareReturn(instrument, compareRange);
  const series = performanceSeries(instrument, period, selectedReturn);
  const low = Math.min(...series);
  const high = Math.max(...series);
  const range = Math.max(high - low, 0.0001);
  const points = series
    .map(
      (value, index) =>
        `${(index / (series.length - 1)) * 100},${94 - ((value - low) / range) * 76}`,
    )
    .join(' ');
  const changeLabel = `${selectedReturn >= 0 ? '+' : ''}${selectedReturn.toFixed(2)}%`;
  const volatility = (
    Math.abs(selectedReturn) * 0.42 +
    (period === '1D' ? 8 : period === '1W' ? 11 : period === '1M' ? 16 : 27)
  ).toFixed(1);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-4 max-xl:grid-cols-1">
      <section className="panel p-5">
        {tabs}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label">Performance</p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {instrument.symbol} price performance
            </h2>
            <p className="mt-1 text-[10px] text-slate-400">
              Demo price series · {compareRange} range
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="seg" aria-label="Chart display">
              <button onClick={() => chartOpen && onChart()} className={!chartOpen ? 'active' : ''}>Performance</button>
              <button onClick={() => !chartOpen && onChart()} className={chartOpen ? 'active' : ''}>Advanced chart</button>
            </div>
            {!chartOpen && <>
            <select
              aria-label="Chart range"
              value={compareRange}
              onChange={(event) => {
                const nextRange = event.target.value as CompareRange;
                setCompareRange(nextRange);
                const nextPeriod = rangeToPeriod[nextRange];
                if (nextPeriod) setPeriod(nextPeriod);
              }}
              className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600"
            >
              {compareRanges.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <div className="seg">
              {(['1D', '1W', '1M', '1Y'] as PerformancePeriod[]).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPeriod(item);
                    setCompareRange(periodToRange[item]);
                  }}
                  className={period === item ? 'active' : ''}
                >
                  {item}
                </button>
              ))}
            </div>
            </>}
          </div>
        </div>
        {chartOpen ? <div className="mt-5 min-w-0 overflow-hidden rounded-xl">{chartContent}</div> : <>
        <div className="relative mt-5 h-52 overflow-hidden rounded-xl border border-border bg-white grid-surface">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            <defs>
              <linearGradient id="instrumentArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity=".24" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline
              points={`0,94 ${points} 100,94`}
              fill="url(#instrumentArea)"
              stroke="none"
            />
            <polyline
              points={points}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.8"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="absolute left-3 top-3 rounded-md bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-600">
            {compareRange} - {changeLabel}
          </div>
          <div className="absolute right-3 top-3 rounded-md bg-white/85 px-2 py-1 text-[9px] text-slate-500">
            Max ({compareRange}) {displayValue({ ...instrument, price: high })}
          </div>
          <div className="absolute right-3 bottom-7 rounded-md bg-white/85 px-2 py-1 text-[9px] text-slate-500">
            Min ({compareRange}) {displayValue({ ...instrument, price: low })}
          </div>
          {showLinkedTags && marketTagTopics.map((topic, index) => <span key={topic} id={`chart-${instrument.symbol.replaceAll('/', '-')}-${topic}`} className="market-tag-target group absolute z-10" style={{left: `${22 + index * 14}%`, top: `${68 - index * 10}%`}}><a href={`#community-${instrument.symbol.replaceAll('/', '-')}-${topic}`} title={`Open #${instrument.symbol}_${topic} community context`} className="grid size-5 place-items-center rounded-full border-2 border-white bg-violet-600 text-[7px] font-bold text-white shadow-md transition group-hover:scale-125">{index + 1}</a><span className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded-lg bg-slate-900 p-2 text-[8px] font-medium text-white shadow-xl group-hover:block"><b className="mb-1 block text-violet-300">#{instrument.symbol}_{topic}</b><span className="flex gap-2"><a className="rounded bg-white/10 px-2 py-1 hover:bg-white/20" href={`#news-${instrument.symbol.replaceAll('/', '-')}-${topic}`}>News</a><a className="rounded bg-white/10 px-2 py-1 hover:bg-white/20" href={`#community-${instrument.symbol.replaceAll('/', '-')}-${topic}`}>Community</a></span></span></span>)}
          <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[9px] text-slate-400">
            <span>{compareRange} range</span>
            <span>Now - {displayValue(instrument)}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2">
          <Metric label={`${compareRange} return`} value={changeLabel} />
          <Metric
            label={`Min (${compareRange})`}
            value={displayValue({ ...instrument, price: low })}
          />
          <Metric
            label={`Max (${compareRange})`}
            value={displayValue({ ...instrument, price: high })}
          />
          <Metric
            label="Price range"
            value={`${displayValue({ ...instrument, price: low })} - ${displayValue({ ...instrument, price: high })}`}
          />
          <Metric label="Last price" value={displayValue(instrument)} />
          <Metric
            label="Signal"
            value={`${instrument.signal} ${instrument.confidence}%`}
          />
        </div>
        </>}
        <div className="mt-4 flex justify-end"><label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-2 text-[9px] font-medium text-slate-600"><input type="checkbox" checked={showLinkedTags} onChange={(event) => onShowLinkedTagsChange(event.target.checked)} className="accent-violet-600" />Linked tags</label></div>
      </section>
      <section className="panel p-5">
        <p className="label">Key information</p>
        <div className="mt-3 space-y-3">
          <InfoRow label="Asset class" value={kind} />
          <InfoRow
            label="Venue"
            value={instrument.primaryMarket ?? instrument.market}
          />
          <InfoRow label="Sector" value={instrument.sector} />
          <InfoRow
            label="Sub-sector"
            value={instrument.subSector ?? 'Unclassified'}
          />
          <InfoRow
            label="Market status"
            value={kind === 'Crypto' ? 'Open 24/7' : 'Demo session'}
          />
          <InfoRow label="Data status" value="Delayed demo" />
        </div>
      </section>
    </div>
  );
}

function TechnicalSummary({ instrument }: { instrument: Instrument }) {
  const oscillatorScore = Math.max(0, Math.min(100, 100 - instrument.rsi));
  const movingAverageScore = Math.max(
    0,
    Math.min(100, 50 + instrument.return1m * 2.5),
  );
  const overallScore = Math.round(
    (oscillatorScore + movingAverageScore + instrument.confidence) / 3,
  );
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="label">Technical summary</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Evidence, not an instruction
          </h2>
        </div>
        <span className="badge positive">
          {instrument.signal} - {instrument.confidence}%
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 max-md:grid-cols-1">
        <CompassGauge
          label="Oscillators"
          score={oscillatorScore}
          detail={`RSI 14  -  ${instrument.rsi.toFixed(1)}`}
        />
        <CompassGauge
          label="Moving averages"
          score={movingAverageScore}
          detail={`1M trend  -  ${instrument.return1m > 0 ? '+' : ''}${instrument.return1m}%`}
        />
        <CompassGauge
          label="Overall summary"
          score={overallScore}
          detail={`Confidence  -  ${instrument.confidence}%`}
        />
      </div>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
        RSI 14 is {instrument.rsi}. Relative volume is {instrument.rvol}x.
        Confidence summarizes demo evidence quality and is not a probability of
        profit.
      </div>
    </section>
  );
}
function CompassGauge({
  label,
  score,
  detail,
}: {
  label: string;
  score: number;
  detail: string;
}) {
  const rating =
    score >= 78
      ? 'Strong Buy'
      : score >= 60
        ? 'Buy'
        : score >= 42
          ? 'Neutral'
          : score >= 24
            ? 'Sell'
            : 'Strong Sell';
  const angle = -90 + score * 1.8;
  return (
    <div className="rounded-xl border border-border bg-white p-4 text-center">
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
      <div
        className="compass-gauge mx-auto mt-3"
        style={
          {
            '--gauge-angle': `${angle}deg`,
            '--gauge-fill': `${score * 1.8}deg`,
          } as React.CSSProperties
        }
      >
        <div className="compass-gauge__arc" />
        <div className="compass-gauge__needle" />
        <div className="compass-gauge__hub" />
        <span className="compass-gauge__score">{Math.round(score)}</span>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-800">{rating}</p>
      <p className="mt-1 text-[9px] text-slate-400">{detail}</p>
    </div>
  );
}
function fallbackDetailData(instrument: Instrument): InstrumentDetailData {
  return {
    quoteCurrency: 'USD',
    unit: 'points',
    dataSource: 'Marketsyde Demo Provider',
    marketStatus: 'Demo session',
    open: instrument.price,
    previousClose: instrument.price - instrument.change,
    dayLow: instrument.price - Math.abs(instrument.change),
    dayHigh: instrument.price + Math.abs(instrument.change),
    historicalLow: instrument.price * 0.7,
    historicalHigh: instrument.price * 1.25,
    volumeType: 'Index reference volume',
    performance1d: instrument.change,
    performance1w: instrument.change * 1.8,
    performance1m: instrument.return1m,
    performance6m: instrument.return1m * 3.8,
    performanceYtd: instrument.return1m * 4.6,
    performance1y: instrument.return1m * 7.4,
    factors: [
      { label: 'Index family', value: instrument.name },
      { label: 'Market breadth', value: 'Demo constituent basket' },
      {
        label: 'Sector contribution',
        value: instrument.subSector ?? 'Broad market',
      },
    ],
  };
}
function MarketStats({
  instrument,
  kind,
}: {
  instrument: Instrument;
  kind: string;
}) {
  const detail =
    instrumentDetailData[instrument.symbol] ?? fallbackDetailData(instrument);
  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <p className="label">Market statistics</p>
        <div className="mt-4 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          <Metric label="Last price" value={displayValue(instrument)} />
          <Metric
            label="Absolute change"
            value={`${instrument.change >= 0 ? '+' : ''}${(instrument.price - detail.previousClose).toFixed(2)}`}
          />
          <Metric label="Daily change" value={`${instrument.change}%`} />
          <Metric label="Quote currency" value={detail.quoteCurrency} />
          <Metric
            label="Open"
            value={detail.open.toFixed(kind === 'Forex' ? 4 : 2)}
          />
          <Metric
            label="Previous close"
            value={detail.previousClose.toFixed(kind === 'Forex' ? 4 : 2)}
          />
          <Metric
            label="Day low / high"
            value={`${detail.dayLow.toFixed(kind === 'Forex' ? 4 : 2)} / ${detail.dayHigh.toFixed(kind === 'Forex' ? 4 : 2)}`}
          />
          <Metric
            label="Historical low / high"
            value={`${detail.historicalLow.toFixed(2)} / ${detail.historicalHigh.toFixed(2)}`}
          />
          <Metric label="Volume" value={`${instrument.volume}M`} />
          <Metric label="Volume type" value={detail.volumeType} />
          <Metric
            label={kind === 'Stock' ? 'P/E' : 'Market size'}
            value={
              kind === 'Stock'
                ? `${instrument.pe ?? 'n/a'}x`
                : `$${instrument.marketCap}B`
            }
          />
          <Metric label="Data source" value={detail.dataSource} />
        </div>
      </section>
      <FinancialFactors factors={detail.factors} />
      <SeasonalPerformance instrument={instrument} />
    </div>
  );
}
function FinancialFactors({
  factors,
}: {
  factors: InstrumentDetailData['factors'];
}) {
  return (
    <section className="panel p-5">
      <p className="label">Financial factors</p>
      <div className="mt-4 grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        {factors.map((factor) => (
          <Metric
            key={factor.label}
            label={factor.label}
            value={factor.value}
          />
        ))}
      </div>
    </section>
  );
}

function SeasonalPerformance({ instrument }: { instrument: Instrument }) {
  const [year, setYear] = useState('All years');
  const [dateRange, setDateRange] = useState<'1Y' | '3Y' | '5Y' | 'All'>('All');
  const [scale, setScale] = useState<'Monthly' | 'Quarterly'>('Monthly');
  const [mode, setMode] = useState<'Table' | 'Chart'>('Table');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const periods = scale === 'Monthly' ? months : ['Q1', 'Q2', 'Q3', 'Q4'];
  const rangeYears =
    dateRange === '1Y'
      ? 1
      : dateRange === '3Y'
        ? 3
        : dateRange === '5Y'
          ? 5
          : 6;
  const years =
    year === 'All years'
      ? Array.from({ length: rangeYears }, (_, index) => 2026 - index)
      : [Number(year)];
  const seasonal = years.map((currentYear, yearIndex) =>
    periods.map((_, periodIndex) =>
      Number(
        (
          Math.sin(currentYear * 0.31 + periodIndex * 1.7 + instrument.price) *
            1.4 +
          instrument.return1m / (scale === 'Monthly' ? 13 : 4) +
          instrument.change * 0.18
        ).toFixed(2),
      ),
    ),
  );
  const average = periods.map((_, periodIndex) =>
    Number(
      (
        seasonal.reduce((sum, row) => sum + row[periodIndex], 0) /
        seasonal.length
      ).toFixed(2),
    ),
  );
  const annual = seasonal.map((row) =>
    Number(row.reduce((sum, value) => sum + value, 0).toFixed(2)),
  );
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label">Seasonal performance</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Recurring {scale.toLowerCase()} performance patterns
          </h2>
          <p className="mt-1 text-[10px] text-slate-400">
            Demo historical tracking for {instrument.symbol}; positive values
            are green, negative values red.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Seasonal year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600"
          >
            <option>All years</option>
            {[2026, 2025, 2024, 2023, 2022, 2021].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
          <select
            aria-label="Seasonal date range"
            value={dateRange}
            onChange={(event) =>
              setDateRange(event.target.value as '1Y' | '3Y' | '5Y' | 'All')
            }
            className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600"
          >
            <option value="1Y">Date range: 1Y</option>
            <option value="3Y">Date range: 3Y</option>
            <option value="5Y">Date range: 5Y</option>
            <option value="All">Date range: All</option>
          </select>
          <select
            aria-label="Seasonal scale"
            value={scale}
            onChange={(event) =>
              setScale(event.target.value as 'Monthly' | 'Quarterly')
            }
            className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px] text-slate-600"
          >
            <option>Monthly</option>
            <option>Quarterly</option>
          </select>
          <div className="seg">
            <button
              onClick={() => setMode('Table')}
              className={mode === 'Table' ? 'active' : ''}
            >
              Table
            </button>
            <button
              onClick={() => setMode('Chart')}
              className={mode === 'Chart' ? 'active' : ''}
            >
              Chart
            </button>
          </div>
        </div>
      </div>
      {mode === 'Table' ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-180 text-left text-[10px]">
            <thead>
              <tr>
                <th className="px-2 py-2">Year</th>
                {periods.map((period) => (
                  <th className="px-2 py-2 text-right" key={period}>
                    {period}
                  </th>
                ))}
                <th className="px-2 py-2 text-right">Year</th>
              </tr>
            </thead>
            <tbody>
              {seasonal.map((row, rowIndex) => (
                <tr className="border-t border-border" key={years[rowIndex]}>
                  <td className="px-2 py-2 font-semibold text-slate-700">
                    {years[rowIndex]}
                  </td>
                  {row.map((value, index) => (
                    <td
                      className={`px-2 py-2 text-right font-mono ${value >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                      key={`${years[rowIndex]}-${index}`}
                    >
                      {value > 0 ? '+' : ''}
                      {value.toFixed(2)}%
                    </td>
                  ))}
                  <td
                    className={`px-2 py-2 text-right font-mono font-semibold ${annual[rowIndex] >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
                  >
                    {annual[rowIndex] > 0 ? '+' : ''}
                    {annual[rowIndex].toFixed(2)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-border">
                <td className="px-2 py-2 font-semibold text-slate-700">
                  Average
                </td>
                {average.map((value, index) => (
                  <td
                    className={`px-2 py-2 text-right font-mono font-semibold ${value >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
                    key={`average-${index}`}
                  >
                    {value > 0 ? '+' : ''}
                    {value.toFixed(2)}%
                  </td>
                ))}
                <td className="px-2 py-2 text-right font-mono font-semibold text-slate-700">
                  {average.reduce((sum, value) => sum + value, 0).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <SeasonalChart values={average} labels={periods} />
      )}
    </section>
  );
}

function SeasonalChart({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) {
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const span = Math.max(max - min, 0.01);
  const points = values
    .map(
      (value, index) =>
        `${(index / Math.max(values.length - 1, 1)) * 94 + 3},${92 - ((value - min) / span) * 72}`,
    )
    .join(' ');
  return (
    <div className="mt-5">
      <div className="relative h-56 overflow-hidden rounded-xl border border-border grid-surface">
        <div className="absolute left-3 right-3 top-1/2 border-t border-dashed border-slate-300" />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <polyline
            points={points}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
          <g>
            {values.map((value, index) => (
              <circle
                key={labels[index]}
                cx={(index / Math.max(values.length - 1, 1)) * 94 + 3}
                cy={92 - ((value - min) / span) * 72}
                r="1.6"
                fill={value >= 0 ? '#10b981' : '#ef4444'}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-12 gap-1 text-center text-[9px] text-slate-400">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
function News({
  instrument,
  onSelect,
  onShare,
  onCommunity,
}: {
  instrument: Instrument;
  onSelect: (article: InstrumentNews) => void;
  onShare: (article: InstrumentNews) => void;
  onCommunity: (article: InstrumentNews) => void;
}) {
  const articles = instrumentNews(instrument);
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="label">News & context</p>
          <p className="mt-1 text-[10px] text-slate-400">
            Related to #{instrument.symbol}:{instrument.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect(articles[0])}
            className="text-[9px] font-semibold text-violet-600"
          >
            Open in popup
          </button>
          <Newspaper className="size-4 text-violet-600" />
        </div>
      </div>
      <div className="mt-3 divide-y divide-border">
        {articles.map((article) => (
          <div
            className="flex items-start justify-between gap-4 py-3"
            key={article.title}
          >
            <button
              onClick={() => onSelect(article)}
              className="min-w-0 text-left"
            >
              <b className="text-xs text-slate-800">{article.title}</b>
              <p className="mt-1 text-[10px] text-slate-500">
                {article.summary}
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                {article.time} - {article.source} - #{instrument.symbol}:
                {instrument.name}
              </p>
            </button>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <button
                onClick={() => onShare(article)}
                className="text-[9px] font-semibold text-cyan-600"
              >
                Share here
              </button>
              <button
                onClick={() => onCommunity(article)}
                className="text-[9px] font-semibold text-violet-600"
              >
                View community
              </button>
              <ExternalLink className="size-3 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Analysis({
  instrument,
  kind,
}: {
  instrument: Instrument;
  kind: string;
}) {
  return (
    <section className="panel p-5">
      <p className="label">Analysis</p>
      <h2 className="mt-1 text-sm font-semibold text-slate-900">
        {instrument.name} decision context
      </h2>
      <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-500">
        {kind} instrument with{' '}
        {instrument.change >= 0 ? 'positive' : 'negative'} daily momentum,{' '}
        {instrument.rvol.toFixed(2)}x relative volume, and a{' '}
        {instrument.signal.toLowerCase()} demo signal. Validate market data,
        product terms, and broker eligibility before acting.
      </p>
    </section>
  );
}
function Forecast({
  instrument,
  kind,
  onCommunityScenario,
}: {
  instrument: Instrument;
  kind: string;
  onCommunityScenario?: (name: string) => void;
}) {
  const forecast = instrument.return1m * 1.35;
  const communityScenarios = [
    { author: 'Daniel Markson', initials: 'DM', bias: 'Bullish pullback', target: `+${Math.max(6, instrument.return1m * 0.9).toFixed(1)}%`, confidence: 76, summary: 'Participation remains constructive; confirmation is expected around the next controlled pullback.' },
    { author: 'CLORA', initials: 'CL', bias: 'Constructive trend', target: `+${Math.max(4, instrument.return1m * 0.65).toFixed(1)}%`, confidence: 69, summary: `Volume and broader ${instrument.sector.toLowerCase()} breadth support a continuation scenario.` },
    { author: 'Aisha Rahman', initials: 'AR', bias: 'Measured upside', target: '+6.4%', confidence: 72, summary: 'Steady demand and improving market breadth support upside, with event volatility kept in view.' },
    { author: 'Leo Park', initials: 'LP', bias: 'Range breakout', target: '+3.1%', confidence: 61, summary: 'Consolidation remains the base case until participation confirms a clean break from the current range.' },
    { author: 'Sofia Mendes', initials: 'SM', bias: 'Risk retest', target: '-5.8%', confidence: 58, summary: 'Valuation sensitivity creates a downside retest scenario before a potential longer-term trend recovery.' },
  ];
  return (
    <div className="space-y-4">
    <section className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">Forecast</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Demo forward outlook
          </h2>
          <p className="mt-1 text-[10px] text-slate-400">
            Scenario model for {instrument.symbol}; not a recommendation.
          </p>
        </div>
        <span className="badge">DEMO MODEL</span>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"><div><p className="text-[10px] font-semibold text-slate-900">Price scenario summary</p><p className="mt-1 text-[9px] text-slate-400">Select a community path to open its prediction post</p></div><div className="flex gap-3 text-[9px] text-slate-500"><span><i className="mr-1 inline-block size-2 rounded-full bg-violet-500" />History</span><span><i className="mr-1 inline-block size-2 rounded-full bg-emerald-400" />5 community scenarios</span></div></div>
        <div className="relative h-64 bg-gradient-to-b from-white to-slate-50">
          <svg viewBox="0 0 800 240" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-label={`${instrument.symbol} community forecast scenarios`}>
            <defs><linearGradient id="forecastFan" x1="0" x2="1"><stop offset="0%" stopColor="#34d399" stopOpacity=".05" /><stop offset="100%" stopColor="#34d399" stopOpacity=".2" /></linearGradient></defs>
            {[48,96,144,192].map((y) => <line key={y} x1="28" x2="770" y1={y} y2={y} stroke="#e8edf4" strokeWidth="1" />)}
            <line x1="472" x2="472" y1="18" y2="218" stroke="#cbd5e1" strokeDasharray="5 5" />
            <path d="M28 180 C80 169 116 184 162 160 S250 151 305 135 S398 144 472 118" fill="none" stroke="#7657ff" strokeWidth="4" strokeLinecap="round" />
            <path d="M472 118 C560 106 642 65 770 38 L770 130 C652 132 560 123 472 118 Z" fill="url(#forecastFan)" />
            <path d="M472 118 C560 100 650 62 770 38" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray="7 5" />
            <path d="M472 118 C565 116 654 102 770 82" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="7 5" />
            <path d="M472 118 C570 120 660 112 770 126" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 5" />
            <path d="M472 118 C570 132 660 146 770 160" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6 5" />
            <path d="M472 118 C570 145 660 178 770 196" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="6 5" />
            <circle cx="472" cy="118" r="6" fill="#7657ff" stroke="white" strokeWidth="3" />
            <circle cx="770" cy="38" r="6" fill="#34d399" stroke="white" strokeWidth="3" />
            <circle cx="770" cy="82" r="6" fill="#22d3ee" stroke="white" strokeWidth="3" />
            <circle cx="770" cy="126" r="5" fill="#f59e0b" stroke="white" strokeWidth="3" />
            <circle cx="770" cy="160" r="5" fill="#3b82f6" stroke="white" strokeWidth="3" />
            <circle cx="770" cy="196" r="5" fill="#f43f5e" stroke="white" strokeWidth="3" />
          </svg>
          <span className="absolute bottom-3 left-4 text-[9px] text-slate-400">Historical demo path</span><span className="absolute bottom-3 left-[59%] text-[9px] text-slate-400">Community forecast</span>
          {[['Daniel Markson','DM','+11.5%','top-2','text-emerald-600'],['CLORA','CL','+8.2%','top-[49px]','text-cyan-600'],['Aisha Rahman','AR','+6.4%','top-[96px]','text-amber-600'],['Leo Park','LP','+3.1%','top-[143px]','text-blue-600'],['Sofia Mendes','SM','-5.8%','top-[190px]','text-rose-600']].map(([name,initials,target,position,color]) => <button key={name} onClick={() => onCommunityScenario?.(name)} className={`absolute right-3 ${position} rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[9px] shadow-sm transition hover:-translate-x-1 hover:border-violet-300`}><b className={`block ${color}`}>{initials} · {target}</b></button>)}
          <div className="absolute left-[54%] top-[104px] rounded bg-violet-600 px-2 py-1 text-[9px] font-semibold text-white">Now · {displayValue(instrument)}</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
        <Metric
          label="30D scenario"
          value={`${forecast >= 0 ? '+' : ''}${forecast.toFixed(1)}%`}
        />
        <Metric
          label="Direction"
          value={forecast >= 0 ? 'Positive bias' : 'Negative bias'}
        />
        <Metric
          label="Confidence"
          value={`${Math.max(35, Math.min(88, instrument.confidence - 4))}%`}
        />
        <Metric
          label="Driver"
          value={
            kind === 'Forex'
              ? 'Rates / macro'
              : kind === 'Crypto'
                ? 'Momentum / liquidity'
                : kind === 'Commodity'
                  ? 'Supply / USD'
                  : 'Trend / breadth'
          }
        />
      </div>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
        Forecast inputs are synthetic and combine recent return, relative
        volume, sentiment, and technical context. Production forecasts require a
        validated data provider and model provenance.
      </div>
    </section>
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5"><div><p className="label">Community scenarios</p><h2 className="mt-1 text-sm font-semibold text-slate-900">What contributors expect next</h2><p className="mt-1 text-[10px] text-slate-400">Community-authored demo scenarios linked to their original discussion posts.</p></div><span className="badge">5 VIEWS</span></div>
      <div className="grid grid-cols-2 gap-4 p-5 max-lg:grid-cols-1">{communityScenarios.map((scenario) => <button key={scenario.author} onClick={() => onCommunityScenario?.(scenario.author)} className="group rounded-xl border border-border bg-white p-4 text-left transition hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="concept-avatar">{scenario.initials}</span><div><b className="text-xs text-slate-900">{scenario.author}</b><span className="mt-1 block text-[9px] text-slate-400">Community contributor</span></div></div><span className="text-[10px] font-semibold text-emerald-600">{scenario.bias}</span></div><p className="mt-4 text-[11px] leading-relaxed text-slate-600">{scenario.summary}</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-lg bg-slate-50 p-3"><span className="text-[8px] uppercase tracking-wide text-slate-400">Scenario target</span><b className="mt-1 block text-sm text-emerald-600">{scenario.target}</b></div><div className="rounded-lg bg-slate-50 p-3"><span className="text-[8px] uppercase tracking-wide text-slate-400">Confidence</span><b className="mt-1 block text-sm text-slate-900">{scenario.confidence}%</b></div></div><div className="mt-4 flex items-center justify-between text-[9px] font-medium text-violet-600"><span>View original community post</span><ArrowRight className="size-3 transition-transform group-hover:translate-x-1" /></div></button>)}</div>
      <div className="border-t border-border bg-amber-50/60 px-5 py-3 text-[9px] text-amber-700">Community scenarios are opinions and synthetic demo content, not analyst research or investment advice.</div>
    </section>
    </div>
  );
}
function FinancialReport({ instrument }: { instrument: Instrument }) {
  const [period, setPeriod] = useState<'Annual' | 'Quarterly'>('Annual');
  const annual = [
    { label: 'FY22', revenue: 27.0, income: 9.8, margin: 36.2 },
    { label: 'FY23', revenue: 27.0, income: 4.4, margin: 16.2 },
    { label: 'FY24', revenue: 60.9, income: 29.8, margin: 48.9 },
    { label: 'FY25', revenue: 130.5, income: 72.9, margin: 55.8 },
  ];
  const quarterly = [
    { label: 'Q2 25', revenue: 30.0, income: 16.6, margin: 55.3 },
    { label: 'Q3 25', revenue: 35.1, income: 19.3, margin: 55.0 },
    { label: 'Q4 25', revenue: 39.3, income: 22.1, margin: 56.2 },
    { label: 'Q1 26', revenue: 44.1, income: 24.8, margin: 56.3 },
  ];
  const series = period === 'Annual' ? annual : quarterly;
  const maxRevenue = Math.max(...series.map((item) => item.revenue));
  return (
    <div className="space-y-4">
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="label">Fundamentals & stats</p>
            <h2 className="mt-1 text-sm font-semibold text-slate-900">
              {instrument.symbol} financial overview
            </h2>
            <p className="mt-1 text-[10px] text-slate-400">
              Interactive demo statements, profitability, valuation, and financial health.
            </p>
          </div>
          <div className="flex items-center gap-2"><div className="seg">{(['Annual', 'Quarterly'] as const).map((item) => <button key={item} onClick={() => setPeriod(item)} className={period === item ? 'active' : ''}>{item}</button>)}</div><span className="badge positive">DEMO DATA</span></div>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
          <Metric label="Market capitalization" value={`$${instrument.marketCap?.toLocaleString() ?? '—'}B`} />
          <Metric label="P/E ratio (TTM)" value={instrument.pe ? `${instrument.pe.toFixed(1)}×` : '—'} />
          <Metric label="Basic EPS (TTM)" value={`$${(instrument.price / (instrument.pe ?? 25)).toFixed(2)}`} />
          <Metric label="Revenue growth" value="+114.2%" />
        </div>
      </section>
      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        <section className="panel p-5">
          <div className="flex items-start justify-between"><div><p className="label">Growth</p><h3 className="mt-1 text-sm font-semibold text-slate-900">Revenue & net income</h3></div><div className="flex gap-3 text-[9px] text-slate-500"><span><i className="mr-1 inline-block size-2 rounded-sm bg-violet-500" />Revenue</span><span><i className="mr-1 inline-block size-2 rounded-sm bg-emerald-400" />Net income</span></div></div>
          <div className="mt-5 flex h-64 items-end gap-4 border-b border-slate-200 px-2">
            {series.map((item) => <div key={item.label} className="group flex h-full flex-1 flex-col justify-end"><div className="relative flex flex-1 items-end justify-center gap-1"><div className="w-2/5 rounded-t bg-violet-500 transition-opacity group-hover:opacity-80" style={{height: `${(item.revenue / maxRevenue) * 88}%`}} title={`${item.label} revenue: $${item.revenue}B`} /><div className="w-2/5 rounded-t bg-emerald-400 transition-opacity group-hover:opacity-80" style={{height: `${(item.income / maxRevenue) * 88}%`}} title={`${item.label} net income: $${item.income}B`} /><div className="pointer-events-none absolute bottom-2 left-1/2 z-20 hidden w-36 -translate-x-1/2 rounded-lg bg-slate-900 p-2 text-[9px] text-white shadow-xl group-hover:block"><b>{item.label}</b><span className="mt-1 block">Revenue ${item.revenue}B</span><span className="block">Net income ${item.income}B</span></div></div><span className="py-2 text-center text-[9px] text-slate-500">{item.label}</span></div>)}
          </div>
        </section>
        <section className="panel p-5">
          <p className="label">Profitability</p><h3 className="mt-1 text-sm font-semibold text-slate-900">Net margin trend</h3>
          <div className="mt-5 space-y-5">{series.map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-[10px]"><span className="text-slate-500">{item.label}</span><b className="text-slate-900">{item.margin}%</b></div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400" style={{width: `${item.margin}%`}} title={`${item.label} net margin: ${item.margin}%`} /></div></div>)}</div>
          <div className="mt-6 grid grid-cols-2 gap-3"><Metric label="Gross margin" value="75.0%" /><Metric label="Operating margin" value="62.1%" /><Metric label="ROE" value="91.4%" /><Metric label="Free cash flow" value="$60.9B" /></div>
        </section>
      </div>
      <section className="panel overflow-hidden">
        <div className="border-b border-border p-5"><p className="label">Financial health</p><h3 className="mt-1 text-sm font-semibold text-slate-900">Balance sheet & valuation</h3></div>
        <div className="grid grid-cols-2 max-lg:grid-cols-1"><div className="p-5"><div className="space-y-4">{[['Cash & equivalents','$43.2B',72],['Total debt','$10.3B',24],['Current assets','$80.1B',88],['Total liabilities','$32.3B',42]].map(([label,value,width]) => <div key={label as string}><div className="mb-2 flex justify-between text-[10px]"><span className="text-slate-500">{label}</span><b>{value}</b></div><div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500" style={{width: `${width}%`}} /></div></div>)}</div></div><div className="border-l border-border p-5 max-lg:border-l-0 max-lg:border-t"><table className="w-full text-[10px]"><tbody className="divide-y divide-border">{[['Price / sales','26.1×'],['Price / book','51.8×'],['EV / EBITDA','42.7×'],['Debt / equity','11.5%'],['Current ratio','4.1×'],['Dividend yield','0.03%']].map(([label,value]) => <tr key={label}><td className="py-3 text-slate-500">{label}</td><td className="py-3 text-right font-semibold text-slate-900">{value}</td></tr>)}</tbody></table></div></div>
      </section>
      <p className="px-1 text-[9px] leading-relaxed text-slate-400">All figures are synthetic demo data for interface evaluation and are not investment information.</p>
    </div>
  );
}
function ProductsAndBrokersTable({
  instrument,
  products,
  product,
  setProduct,
  brokers,
}: {
  instrument: Instrument;
  products: ProductType[];
  product: ProductType;
  setProduct: (product: ProductType) => void;
  brokers: Broker[];
}) {
  const matchedBrokers = brokers.filter((broker) => broker.products.includes(product));
  const productDetails: Record<ProductType, string> = {
    Spot: 'Buy or sell the underlying asset for direct settlement.',
    Share: 'Whole-share ownership with standard equity market access.',
    'Fractional share': 'Trade part of one share with a smaller minimum amount.',
    'FX spot': 'Exchange currency pairs at the current market rate.',
    CFD: 'Track price movement without owning the underlying asset; leverage may apply.',
    Future: 'Standardized contract with a defined expiry and contract size.',
    Perpetual: 'Derivative contract without expiry; funding charges may apply.',
  };
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-border p-5">
        <p className="label">Products & broker access</p>
        <h2 className="mt-1 text-sm font-semibold text-slate-900">Trade {instrument.symbol} by product</h2>
        <p className="mt-1 text-[10px] text-slate-400">Choose a product to compare matching providers, costs, minimums, and access.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {products.map((item) => <span key={item} className="group relative"><button onClick={() => setProduct(item)} aria-describedby={`product-tip-${item.replaceAll(' ', '-')}`} className={`rounded-lg border px-3 py-2 text-[10px] font-medium ${product === item ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-border bg-white text-slate-600'}`}>{item}</button><span id={`product-tip-${item.replaceAll(' ', '-')}`} role="tooltip" className="pointer-events-none absolute left-0 top-full z-30 mt-2 hidden w-56 rounded-lg border border-slate-200 bg-slate-900 p-3 text-left text-[10px] font-normal leading-relaxed text-white shadow-xl group-hover:block group-focus-within:block"><b className="mb-1 block text-violet-300">{item}</b>{productDetails[item]}</span></span>)}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[10px]">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-4 py-3">Broker</th><th className="px-4 py-3">Venue</th><th className="px-4 py-3">Spread</th><th className="px-4 py-3">Minimum</th><th className="px-4 py-3">Platform</th><th className="px-4 py-3">Access</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-border">
            {matchedBrokers.map((broker) => <tr key={`${product}-${broker.name}`} className="group bg-white hover:bg-violet-50/40"><td className="px-5 py-4 font-semibold text-violet-700">{product}</td><td className="relative px-4 py-4 font-semibold text-slate-900" tabIndex={0}>{broker.name}<div role="tooltip" className="pointer-events-none absolute left-2 top-[calc(100%-4px)] z-40 hidden w-72 rounded-lg border border-violet-200 bg-white p-4 text-left font-normal shadow-2xl group-hover:block group-focus:block"><b className="text-xs text-slate-900">{broker.name}</b><p className="mt-1 leading-relaxed text-slate-500">{broker.details}</p><dl className="mt-3 grid grid-cols-2 gap-2"><div><dt className="text-[8px] uppercase text-slate-400">Commission</dt><dd className="mt-1 text-slate-700">{broker.commission}</dd></div><div><dt className="text-[8px] uppercase text-slate-400">Execution</dt><dd className="mt-1 text-slate-700">{broker.execution}</dd></div></dl></div></td><td className="px-4 py-4 text-slate-500">{broker.venue}</td><td className="px-4 py-4 text-slate-600">{broker.spread}</td><td className="px-4 py-4 text-slate-600">{broker.minimum}</td><td className="px-4 py-4 text-slate-600">{broker.platform}</td><td className="px-4 py-4"><span className={`badge ${broker.status === 'Available' ? 'positive' : ''}`}>{broker.status}</span></td><td className="px-5 py-4 text-right"><button className="primary justify-center">Connect</button></td></tr>)}
          </tbody>
        </table>
      </div>
      {matchedBrokers.length === 0 && <div className="m-5 rounded-xl bg-amber-50 p-4 text-xs text-amber-700"><Lock className="mr-2 inline size-3" />No demo provider supports this exact product combination.</div>}
    </section>
  );
}
function ProductPanel({
  products,
  product,
  setProduct,
}: {
  products: ProductType[];
  product: ProductType;
  setProduct: (product: ProductType) => void;
}) {
  return (
    <section className="panel p-5">
      <p className="label">Trading products</p>
      <h2 className="mt-1 text-sm font-semibold text-slate-900">
        Choose the exact product
      </h2>
      <p className="mt-1 text-[10px] text-slate-400">
        Spot, CFD, futures, shares, and perpetuals are separate products.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3 max-md:grid-cols-1">
        {products.map((item) => (
          <button
            key={item}
            onClick={() => setProduct(item)}
            className={`rounded-xl border p-4 text-left ${product === item ? 'border-violet-300 bg-violet-50' : 'border-border bg-white'}`}
          >
            <b className="text-xs text-slate-900">{item}</b>
            <p className="mt-2 text-[10px] text-slate-500">
              {item === 'Share'
                ? 'Shares'
                : item === 'Future'
                  ? 'Contracts'
                  : item === 'FX spot'
                    ? 'Lots / units'
                    : 'Product-specific units'}
            </p>
            {product === item && (
              <Check className="mt-3 size-4 text-violet-600" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
function BrokerPanel({
  instrument,
  product,
  products,
  setProduct,
  brokers,
}: {
  instrument: Instrument;
  product: ProductType;
  products: ProductType[];
  setProduct: (product: ProductType) => void;
  brokers: Broker[];
}) {
  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label">Broker matching</p>
          <h2 className="mt-1 text-sm font-semibold text-slate-900">
            Providers for {instrument.symbol} - {product}
          </h2>
          <p className="mt-1 text-[10px] text-slate-400">
            Matched by exact symbol, product type, and demo eligibility.
          </p>
        </div>
        <label className="flex items-center gap-2 text-[10px] text-slate-500">
          Product
          <select
            value={product}
            onChange={(event) => setProduct(event.target.value as ProductType)}
            className="rounded-lg border border-border bg-white px-2 py-1.5 text-[10px]"
          >
            {products.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 max-lg:grid-cols-1">
        {brokers.map((broker) => (
          <div
            key={broker.name}
            className="rounded-xl border border-border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <b className="text-sm text-slate-900">{broker.name}</b>
                <p className="mt-1 text-[10px] text-slate-400">
                  {broker.venue}
                </p>
              </div>
              <span
                className={`badge ${broker.status === 'Available' ? 'positive' : ''}`}
              >
                {broker.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Metric label="Spread" value={broker.spread} />
              <Metric label="Minimum" value={broker.minimum} />
              <Metric label="Platform" value={broker.platform} />
              <Metric label="Symbol" value={instrument.symbol} />
            </div>
            <div className="mt-4 flex gap-2">
              <button className="primary flex-1 justify-center">Connect</button>
              <button className="secondary">
                <ExternalLink />
              </button>
            </div>
          </div>
        ))}
      </div>
      {brokers.length === 0 && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs text-amber-700">
          <Lock className="mr-2 inline size-3" />
          No demo provider supports this exact product combination.
        </div>
      )}
    </section>
  );
}
function AssetSpecific({
  kind,
  instrument,
}: {
  kind: string;
  instrument: Instrument;
}) {
  const rows =
    kind === 'Crypto'
      ? [
          ['Network', 'Demo chain metadata'],
          ['Consensus', 'Proof of Stake'],
          ['Supply', 'Protocol-defined'],
          ['24h volume', `${instrument.volume}M USD`],
        ]
      : [
          ['Revenue', 'Demo financial statement'],
          ['Earnings', 'Next event not connected'],
          ['Balance sheet', 'Demo balance sheet'],
          ['Cash flow', 'Demo cash flow'],
        ];
  return (
    <section className="panel p-5">
      <p className="label">{kind} detail</p>
      <div className="mt-4 grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {rows.map(([label, value]) => (
          <InfoRow key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-[9px] uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-xs font-semibold text-slate-800">{value}</div>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-2 text-xs">
      <span className="text-slate-400">{label}</span>
      <b className="text-right text-slate-700">{value}</b>
    </div>
  );
}
