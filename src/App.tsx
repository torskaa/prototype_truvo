import React, { useState, useEffect, lazy, Suspense } from 'react';
const MarketWorkspace = lazy(() => import('./features/market/MarketWorkspace'));
const marketViews = ['screener', 'instrument'];
import {
  INITIAL_USER,
  INITIAL_BROKERS,
  INITIAL_SIGNALS,
  QUICK_START_STEPS,
  PERFORMANCE_DATA,
  LEADERBOARD_USERS,
  RECENT_TRADES,
  INITIAL_COMMUNITY_POSTS,
  COMMUNITY_CHALLENGES,
  TOP_CONTRIBUTORS,
  INITIAL_MISSIONS,
  INITIAL_ACTIVITY_LOGS,
} from './data/mockData';
import {
  Broker,
  MarketSignal,
  UserProfile,
  CommunityPost,
  CommunityChallenge,
  TopContributor,
  Mission,
  ActivityLogItem,
} from './types';
import { Header } from './components/Header';
import { ReferenceDashboard } from './components/ReferenceDashboard';
import { DashboardBentoGrid } from './components/DashboardBentoGrid';
import { BrokerDirectory } from './components/BrokerDirectory';
import { SignalsList } from './components/SignalsList';
import { CommunityHub } from './components/CommunityHub';
import { CommunityPage } from './components/community/CommunityPage';
import { LeaderboardCard } from './components/LeaderboardCard';
import { PointsAndCreditsView } from './components/PointsAndCreditsView';
import { LevelPointsGuideView } from './components/LevelPointsGuideView';
import { CreditEarningGuideView } from './components/CreditEarningGuideView';
import { ActivityLogsView } from './components/ActivityLogsView';
import { CashbackOverviewPage } from './components/CashbackOverviewPage';
import { ConnectToTruvoPage } from './components/ConnectToTruvoPage';
import { TradingSignalsPage } from './components/TradingSignalsPage';
import { LeverageCalculatorPage } from './components/calculators/LeverageCalculatorPage';
import { TradingCalculatorsModal, CalculatorType } from './components/calculators/TradingCalculatorsModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { Footer } from './components/Footer';
import { ConnectBrokerModal } from './components/ConnectBrokerModal';
import { ViewPlanModal } from './components/ViewPlanModal';
import { SignalDetailModal } from './components/SignalDetailModal';
import { CashbackLedgerModal } from './components/CashbackLedgerModal';
import { BrokerComparisonModal } from './components/BrokerComparisonModal';
import { SearchModal } from './components/SearchModal';
import { Coins, Sparkles, Trophy, Zap, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { RewardProvider, useRewards } from './features/rewards/RewardProvider';

export default function App() {
  return <RewardProvider><Application /></RewardProvider>;
}

function Application() {
  const { snapshot, connectBroker, claimQuest, questAvailable } = useRewards();
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER);
  const user: UserProfile = {
    ...profile,
    sydeCredits: snapshot.credits,
    currentPoints: snapshot.activePoints,
    tierLevel: snapshot.level.level,
    rankTitle: snapshot.level.name,
    maxPoints: snapshot.level.nextPoints ?? Math.max(700, snapshot.activePoints),
    connectedBrokersCount: snapshot.connections.length,
    lastWeekCredits: snapshot.ledger.filter(entry => entry.kind !== 'seed' && Date.parse(entry.at) >= Date.now() - 7 * 86_400_000).reduce((sum, entry) => sum + Math.max(0, entry.credits), 0),
    perks: ['90-day active Points', 'Credit-funded research tools'],
  };
  const brokers: Broker[] = INITIAL_BROKERS.map(broker => {
    const connection = snapshot.connections.find(item => item.brokerId === broker.id);
    return { ...broker, connected: !!connection, connectedAccountId: connection?.accountId };
  });
  const [signals, setSignals] = useState<MarketSignal[]>(INITIAL_SIGNALS);
  const [quickSteps, setQuickSteps] = useState(QUICK_START_STEPS.map(step => step.step === 2 ? { ...step, completed: snapshot.connections.length > 0 } : step));
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const activityLogs: ActivityLogItem[] = snapshot.ledger.flatMap<ActivityLogItem>(entry => [{
    id: entry.id, title: entry.title,
    description: `${entry.expiresAt ? `Points expire ${new Date(entry.expiresAt).toLocaleString()}.` : 'Reward activity recorded.'}`,
    timestamp: entry.at,
    type: entry.points && entry.credits ? 'both' : entry.points ? 'points' : 'credits',
    pointsChange: entry.points, creditsChange: entry.credits,
    category: entry.kind === 'conversion' ? 'Conversion' : entry.kind === 'unlock' ? 'Unlock' : entry.kind === 'seed' || entry.id.startsWith('quest:daily-checkin:') ? 'Bonus' : 'Mission',
  }, ...(entry.points > 0 && entry.expiresAt && Date.parse(entry.expiresAt) <= Date.now() ? [{
    id: `expired:${entry.id}`, title: 'Points expired after 90 days', description: `Expired grant: ${entry.title}. Credits are unaffected.`,
    timestamp: entry.expiresAt, type: 'points' as const, pointsChange: -entry.points, creditsChange: 0, category: 'Expiration' as const,
  }] : [])]).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const [activeTab, updateActiveTab] = useState<string>(() => {
    const requested = new URLSearchParams(window.location.search).get('view') || 'dashboard';
    if (requested === 'explorer' || requested === 'chart') {
      const params = new URLSearchParams(window.location.search);
      params.set('view', requested === 'chart' ? 'instrument' : 'screener');
      if (requested === 'chart') params.set('mode', 'chart');
      window.history.replaceState(null, '', `?${params}`);
      return requested === 'chart' ? 'instrument' : 'screener';
    }
    return requested;
  });
  const [routeSearch, setRouteSearch] = useState(window.location.search);
  const setActiveTab = (
    next: string,
    symbol?: string,
    section?: string,
    focus?: string,
  ) => {
    if (next === 'explorer') next = 'screener';
    const chartMode = next === 'chart';
    if (chartMode) next = 'instrument';
    const params = new URLSearchParams();
    params.set('view', next);
    if (chartMode) params.set('mode', 'chart');
    if (symbol) params.set('symbol', symbol);
    if (section) params.set('section', section);
    if (focus) params.set('focus', focus);
    window.history.pushState(null, '', `?${params}`);
    setRouteSearch(window.location.search);
    updateActiveTab(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  useEffect(() => {
    const chartOnly = new URLSearchParams(routeSearch).get("mode") === "chart";
    document.body.classList.toggle("chart-only-mode", chartOnly);
    return () => document.body.classList.remove("chart-only-mode");
  }, [routeSearch]);

  useEffect(() => {
    const onPopState = () => { updateActiveTab(new URLSearchParams(window.location.search).get('view') || 'dashboard'); setRouteSearch(window.location.search); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Community state
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [communityChallenges, setCommunityChallenges] = useState<CommunityChallenge[]>(COMMUNITY_CHALLENGES);
  const [topContributors, setTopContributors] = useState<TopContributor[]>(TOP_CONTRIBUTORS);

  // Modals state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedBrokerForConnect, setSelectedBrokerForConnect] = useState<Broker | null>(null);
  const [brokerContextSymbol, setBrokerContextSymbol] = useState<string | undefined>();
  const [isViewPlanOpen, setIsViewPlanOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<MarketSignal | null>(null);
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);
  const [isBrokerComparisonOpen, setIsBrokerComparisonOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [selectedCalculatorType, setSelectedCalculatorType] = useState<CalculatorType>('forex');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K opens Search Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddDemoPoints = () => {
    setActiveTab('points-credits');
  };

  const handleBrokerConnected = (brokerId: string, accountId: string) => {
    if (!brokers.some(broker => broker.id === brokerId)) {
      showToast('Unknown broker. No account was saved.');
      return { ok: false, message: 'Unknown broker. No account was saved.' };
    }
    const result = connectBroker(brokerId, accountId);
    showToast(result.message);
    if (result.ok) setQuickSteps(prev => prev.map(step => step.step === 2 ? { ...step, completed: true } : step));
    return result;
  };

  const handleStepClick = (index: number) => {
    if (index === 0) {
      setActiveTab('brokers');
    } else if (index === 1) {
      setSelectedBrokerForConnect(brokers.find((b) => !b.connected) || brokers[1]);
      setIsConnectModalOpen(true);
    } else if (index === 2) {
      setActiveTab('signals');
    } else if (index === 3) {
      setIsLedgerOpen(true);
    }
  };

  const handleToggleStep = (index: number) => {
    setQuickSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleSelectSignalByTicker = (ticker: string) => {
    const found = signals.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
    if (found) {
      setSelectedSignal(found);
      setIsSignalModalOpen(true);
    } else {
      setActiveTab('signals');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090119] text-[#0b1c30] dark:text-white transition-colors duration-200">
      {/* Top Header */}
      <Header
        user={user}
        signals={signals}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenConnectModal={() => {
          setSelectedBrokerForConnect(brokers.find((b) => !b.connected) || brokers[0]);
          setIsConnectModalOpen(true);
        }}
        onOpenViewPlan={() => setIsViewPlanOpen(true)}
        onOpenLedger={() => setIsLedgerOpen(true)}
        onOpenBrokerComparison={() => setIsBrokerComparisonOpen(true)}
        onOpenCalculator={(calcType) => {
          if (calcType === 'forex') {
            setActiveTab('leverage-calculator');
          } else {
            setSelectedCalculatorType(calcType);
            setIsCalculatorModalOpen(true);
          }
        }}
        onNavigateToCashbackOverview={() => setActiveTab('cashback-overview')}
        currentSymbol={new URLSearchParams(routeSearch).get('symbol') ?? undefined}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onShowToast={showToast}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-violet-100 bg-violet-50 px-4 py-1.5 text-[10px] text-violet-900">
        <button className="flex items-center gap-2 font-semibold hover:text-violet-700" onClick={() => showToast(claimQuest('daily-checkin', {}).message)} disabled={!questAvailable('daily-checkin')}>
          <span>{questAvailable('daily-checkin') ? 'Daily check-in quest' : 'Daily check-in completed'}</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-violet-700">+20 C</span>
        </button>
        <div className="flex items-center gap-3 text-[10px] text-violet-900">
          <span className="flex items-center gap-1 font-semibold"><Coins size={12} />{snapshot.credits.toLocaleString()} C</span>
          <span>{snapshot.activePoints.toLocaleString()} points</span>
          <span>Level {snapshot.level.level} · {snapshot.level.name}</span>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#c6f831] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-[56px] py-6 space-y-6">
        {marketViews.includes(activeTab) && <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading market workspace…</div>}><MarketWorkspace view={activeTab} locationSearch={routeSearch} onNavigate={setActiveTab} tierLevel={user.tierLevel} onToast={showToast} recentTrades={RECENT_TRADES}
          brokers={brokers}
          onConnectBroker={(broker, symbol) => { setSelectedBrokerForConnect(broker); setBrokerContextSymbol(symbol); setIsConnectModalOpen(true); }}
          onCompareBrokers={() => setIsBrokerComparisonOpen(true)}
          onOpenRewards={() => setActiveTab('points-credits')}
          onOpenPlans={() => setIsViewPlanOpen(true)}
        /></Suspense>}
        {/* Welcome Bar / Subheader for other tabs */}
        {!marketViews.includes(activeTab) && activeTab !== 'dashboard' && activeTab !== 'points-credits' && activeTab !== 'cashback-overview' && activeTab !== 'signals' && activeTab !== 'level-points-guide' && activeTab !== 'credit-earning-guide' && activeTab !== 'activity-logs' && activeTab !== 'leverage-calculator' && activeTab !== 'volatility-calculator' && activeTab !== 'spread-calculator' && activeTab !== 'pip-calculator' && activeTab !== 'pips-calculator' && activeTab !== 'margin-calculator' && activeTab !== 'rebate-calculator' && activeTab !== 'calculators' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                {activeTab === 'brokers' && (
                  <>
                    <span className="bg-gradient-to-r from-[#5945F1] to-[#FE01B1] bg-clip-text text-transparent inline-block pb-0.5">
                      Broker Directory & Rebates
                    </span>
                    <span className="text-[#c6f831] font-extrabold">.</span>
                  </>
                )}
                {activeTab === 'community' && (
                  <>
                    <span className="bg-gradient-to-r from-[#5945F1] to-[#FE01B1] bg-clip-text text-transparent inline-block pb-0.5">
                      Community Trading Floor
                    </span>
                    <span className="text-[#c6f831] font-extrabold">.</span>
                  </>
                )}
                {activeTab === 'leaderboard' && (
                  <>
                    <span className="bg-gradient-to-r from-[#5945F1] to-[#FE01B1] bg-clip-text text-transparent inline-block pb-0.5">
                      Trader Leaderboard & Rankings
                    </span>
                    <span className="text-[#c6f831] font-extrabold">.</span>
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-[#474556] mt-0.5">
                {activeTab === 'brokers' &&
                  'Connect your live trading accounts with institutional brokers to unlock instant per-lot rebates.'}
                {activeTab === 'community' &&
                  'Real-time trader feeds, verified institutional research, active market debates, and creator profiles.'}
                {activeTab === 'leaderboard' &&
                  'Compete for weekly $1,750 prize pools funded by institutional broker rebates.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Cashback Rate:
              </span>
              <span className="px-3 py-1 rounded-full bg-[#eef2ff] border border-[#d6d0ff] text-[#5338ec] text-xs font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#5338ec]" />
                <span>+{user.boostPercentage}% Multiplier Active</span>
              </span>
            </div>
          </div>
        )}

        {/* ─── TAB 0: Mission, Points & Credits (User Reference Focus) ─── */}
        {activeTab === 'points-credits' && (
          <PointsAndCreditsView
            user={user}
            missions={missions}
            signals={signals}
            onOpenViewPlan={() => setIsViewPlanOpen(true)}
            onOpenLevelPointsGuide={() => setActiveTab('level-points-guide')}
            onOpenCreditEarningGuide={() => setActiveTab('credit-earning-guide')}
            onOpenActivityLog={() => setActiveTab('activity-logs')}
            onNavigateToSignals={() => setActiveTab('signals')}
            onSelectSignal={(signal) => {
              setSelectedSignal(signal);
              setIsSignalModalOpen(true);
            }}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigateToMarket={setActiveTab}
          />
        )}

        {/* ─── TAB: Activity Logs (Matching Exact Reference Design) ─── */}
        {activeTab === 'activity-logs' && (
          <ActivityLogsView
            user={user}
            activityLogs={activityLogs}
            onBackToMissions={() => setActiveTab('points-credits')}
            onNavigateToSignals={() => setActiveTab('signals')}
          />
        )}

        {/* ─── TAB: Level Points Guide (Requested from Rookie Card 'Learn More') ─── */}
        {activeTab === 'level-points-guide' && (
          <LevelPointsGuideView
            user={user}
            onBackToMissions={() => setActiveTab('points-credits')}
          />
        )}

        {/* ─── TAB: Credit Earning Guide (Requested from Syde Credits Card 'Learn More') ─── */}
        {activeTab === 'credit-earning-guide' && (
          <CreditEarningGuideView
            user={user}
            onBackToMissions={() => setActiveTab('points-credits')}
          />
        )}

        {/* ─── TAB 1: Bento Grid Dashboard Matching Reference ─── */}
        {activeTab === 'dashboard' && (
          <ReferenceDashboard
            user={user}
            brokers={brokers}
            signals={signals}
            quickSteps={quickSteps}
            performanceData={PERFORMANCE_DATA}
            leaderboardUsers={LEADERBOARD_USERS}
            onOpenViewPlan={() => setIsViewPlanOpen(true)}
            onAddDemoPoints={handleAddDemoPoints}
            onStepClick={handleStepClick}
            onToggleStep={handleToggleStep}
            onOpenConnectModal={(broker) => {
              setSelectedBrokerForConnect(broker || brokers[0]);
              setIsConnectModalOpen(true);
            }}
            onOpenLedger={() => setIsLedgerOpen(true)}
            onSelectSignal={(sig) => {
              setSelectedSignal(sig);
              setIsSignalModalOpen(true);
            }}
            onNavigateToTab={setActiveTab}
            onNavigateToConnectBroker={(broker) => {
              if (broker) setSelectedBrokerForConnect(broker);
              setActiveTab('connect-to-truvo');
            }}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {/* ─── TAB 2: Broker Directory ─── */}
        {activeTab === 'brokers' && (
          <div className="space-y-6">
            <BrokerDirectory
              brokers={brokers}
              onConnectBroker={(b) => {
                setSelectedBrokerForConnect(b);
                setIsConnectModalOpen(true);
              }}
              onOpenComparison={() => setIsBrokerComparisonOpen(true)}
            />
          </div>
        )}

        {/* ─── TAB 3: Market Signals (Matching Reference Layout) ─── */}
        {activeTab === 'signals' && (
          <TradingSignalsPage
            user={user}
            signals={signals}
            brokers={brokers}
            onSelectSignal={(sig) => {
              setSelectedSignal(sig);
              setIsSignalModalOpen(true);
            }}
            onUpgradePrompt={() => setIsViewPlanOpen(true)}
            onOpenConnectModal={(broker) => {
              setSelectedBrokerForConnect(broker || brokers[0]);
              setIsConnectModalOpen(true);
            }}
            onOpenBrokerComparison={() => setIsBrokerComparisonOpen(true)}
            onNavigateToBrokers={() => setActiveTab('brokers')}
            onSimulateTradeCashback={() => showToast('This is a cashback estimate only. No trade, settled cashback or Points were recorded.')}
          />
        )}

        {/* ─── TAB 4: Community Page (Feeds, Topics, Articles, My Page, Profile) ─── */}
        {activeTab === 'community' && (
          <CommunityPage
            user={user}
            onUpdateUserProfile={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
            onRewardPoints={() => showToast('Community Credit rewards require moderation. No Points were awarded.')}
            onOpenConnectModal={() => {
              setSelectedBrokerForConnect(brokers[0]);
              setIsConnectModalOpen(true);
            }}
            onOpenAdvancedChart={(symbol) => {
              const chartSymbol =
                symbol === "BTC" || symbol === "ADA" ? `${symbol}/USD` : symbol;
              window.open(
                `/?view=instrument&symbol=${encodeURIComponent(chartSymbol)}&mode=chart`,
                "_blank",
              );
            }}
          />
        )}

        {/* ─── TAB: Cashback Overview (Matching Reference Image) ─── */}
        {activeTab === 'cashback-overview' && (
          <CashbackOverviewPage
            user={user}
            brokers={brokers}
            signals={signals}
            onOpenConnectModal={(broker) => {
              setSelectedBrokerForConnect(broker || brokers[0]);
              setIsConnectModalOpen(true);
            }}
            onOpenViewPlan={() => setIsViewPlanOpen(true)}
            onNavigateToBrokers={() => setActiveTab('brokers')}
            onNavigateToSignals={() => setActiveTab('signals')}
            onSelectSignal={(sig) => {
              setSelectedSignal(sig);
              setIsSignalModalOpen(true);
            }}
            onNavigateToConnectBroker={(broker) => {
              if (broker) setSelectedBrokerForConnect(broker);
              setActiveTab('connect-to-truvo');
            }}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {/* ─── TAB: Connect to Truvo Page (Broker Partnership & Verification) ─── */}
        {activeTab === 'connect-to-truvo' && (
          <ConnectToTruvoPage
            broker={selectedBrokerForConnect || brokers[0]}
            brokers={brokers}
            onSelectBroker={(b) => setSelectedBrokerForConnect(b)}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onNavigateToCashback={() => setActiveTab('cashback-overview')}
            onOpenConnectModal={(b) => {
              setSelectedBrokerForConnect(b);
              setIsConnectModalOpen(true);
            }}
            onShowToast={showToast}
          />
        )}

        {/* ─── TAB: Forex & Trading Calculators Suite (All 15 Specialized Tools) ─── */}
        {(activeTab === 'leverage-calculator' ||
          activeTab === 'volatility-calculator' ||
          activeTab === 'spread-calculator' ||
          activeTab === 'pip-calculator' ||
          activeTab === 'pips-calculator' ||
          activeTab === 'margin-calculator' ||
          activeTab === 'rebate-calculator' ||
          activeTab === 'position-size-calculator' ||
          activeTab === 'sltp-calculator' ||
          activeTab === 'stop-out-calculator' ||
          activeTab === 'fibonacci-calculator' ||
          activeTab === 'pivot-point-calculator' ||
          activeTab === 'loss-calculator' ||
          activeTab === 'profit-loss-calculator' ||
          activeTab === 'drawdown-calculator' ||
          activeTab === 'compound-calculator' ||
          activeTab === 'timezone-converter' ||
          activeTab === 'trading-timezone-converter' ||
          activeTab === 'currency-converter' ||
          activeTab === 'calculators') && (
          <LeverageCalculatorPage
            user={user}
            brokers={brokers}
            signals={signals}
            initialTool={
              activeTab === 'volatility-calculator'
                ? 'volatility'
                : activeTab === 'spread-calculator'
                ? 'spread'
                : activeTab === 'pip-calculator' || activeTab === 'pips-calculator'
                ? 'pips'
                : activeTab === 'margin-calculator'
                ? 'margin'
                : activeTab === 'rebate-calculator'
                ? 'rebate'
                : activeTab === 'position-size-calculator'
                ? 'position-size'
                : activeTab === 'sltp-calculator'
                ? 'sltp'
                : activeTab === 'stop-out-calculator'
                ? 'stop-out'
                : activeTab === 'fibonacci-calculator'
                ? 'fibonacci'
                : activeTab === 'pivot-point-calculator'
                ? 'pivot-point'
                : activeTab === 'loss-calculator' || activeTab === 'profit-loss-calculator'
                ? 'profit-loss'
                : activeTab === 'drawdown-calculator'
                ? 'drawdown'
                : activeTab === 'compound-calculator'
                ? 'compound'
                : activeTab === 'timezone-converter' || activeTab === 'trading-timezone-converter'
                ? 'timezone'
                : activeTab === 'currency-converter'
                ? 'currency'
                : 'leverage'
            }
            onOpenConnectModal={(broker) => {
              setSelectedBrokerForConnect(broker || brokers[0]);
              setIsConnectModalOpen(true);
            }}
            onOpenBrokerComparison={() => setIsBrokerComparisonOpen(true)}
            onSelectSignal={(sig) => {
              setSelectedSignal(sig);
              setIsSignalModalOpen(true);
            }}
            onNavigateToTab={setActiveTab}
            onShowToast={showToast}
          />
        )}

        {/* ─── TAB 5: Leaderboard ─── */}
        {activeTab === 'leaderboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <LeaderboardCard
                users={LEADERBOARD_USERS}
                onOpenViewPlan={() => setIsViewPlanOpen(true)}
              />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-display font-bold text-lg text-[#0b1c30]">
                    Weekly Community Prize Pool
                  </h3>
                </div>
                <p className="text-xs text-[#474556] leading-relaxed">
                  Every Sunday at 23:59 UTC, the top 10 traders on the leaderboard receive direct cash bonuses and boosted signal privileges funded by our institutional broker rebate pool.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between font-semibold text-amber-900">
                    <span>🥇 1st Place:</span>
                    <span>$1,000 Cash + 1 Mo Elite Tier</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between font-semibold text-slate-800">
                    <span>🥈 2nd Place:</span>
                    <span>$500 Cash + Pro Trader Tier</span>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between font-semibold text-orange-900">
                    <span>🥉 3rd Place:</span>
                    <span>$250 Cash + Silver Tier</span>
                  </div>
                </div>
                <button
                  onClick={handleAddDemoPoints}
                  className="w-full py-2.5 rounded-xl bg-[#5338ec] hover:bg-[#4338ca] text-white text-xs font-bold transition-all"
                >
                  Explore rewards and research quests
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Matching Reference */}
      <Footer />

      {/* Modals */}
      <ConnectBrokerModal
        isOpen={isConnectModalOpen}
        onClose={() => { setIsConnectModalOpen(false); setBrokerContextSymbol(undefined); }}
        brokers={brokers}
        selectedBroker={selectedBrokerForConnect}
        onSuccess={handleBrokerConnected}
        contextSymbol={brokerContextSymbol ?? new URLSearchParams(routeSearch).get('symbol') ?? (marketViews.includes(activeTab) ? 'Market research' : undefined)}
      />

      <ViewPlanModal
        isOpen={isViewPlanOpen}
        onClose={() => setIsViewPlanOpen(false)}
        user={user}
      />

      <SignalDetailModal
        isOpen={isSignalModalOpen}
        onClose={() => setIsSignalModalOpen(false)}
        signal={selectedSignal}
      />

      <CashbackLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        trades={RECENT_TRADES}
        totalEarned={user.totalCashbackEarned}
        pendingPayout={user.pendingPayout}
      />

      <ActivityLogModal
        isOpen={isActivityLogModalOpen}
        onClose={() => setIsActivityLogModalOpen(false)}
        user={user}
        activityLogs={activityLogs}
        onOpenFullPage={() => {
          setIsActivityLogModalOpen(false);
          setActiveTab('activity-logs');
        }}
      />

      <BrokerComparisonModal
        isOpen={isBrokerComparisonOpen}
        onClose={() => setIsBrokerComparisonOpen(false)}
        brokers={brokers}
        tierLevel={snapshot.level.level}
        onConnectBroker={(b) => {
          setIsBrokerComparisonOpen(false);
          setSelectedBrokerForConnect(b);
          setIsConnectModalOpen(true);
        }}
      />

      <TradingCalculatorsModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        initialType={selectedCalculatorType}
      />

      {/* ─── SEARCH COMMAND PALETTE MODAL (EXACT MATCH TO DESIGN) ─── */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        brokers={brokers}
        signals={signals}
        onSelectSignal={(sig) => {
          setSelectedSignal(sig);
          setIsSignalModalOpen(true);
        }}
        onOpenConnectModal={(broker) => {
          setSelectedBrokerForConnect(broker || brokers.find((b) => !b.connected) || brokers[0]);
          setIsConnectModalOpen(true);
        }}
        onOpenViewPlan={() => setIsViewPlanOpen(true)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onShowToast={showToast}
      />
    </div>
  );
}
