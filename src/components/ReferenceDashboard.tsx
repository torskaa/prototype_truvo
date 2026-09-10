import React, { useState } from 'react';
import {
  UserProfile,
  Broker,
  MarketSignal,
  QuickStep,
  PerformanceTimeframeData,
  LeaderboardUser,
} from '../types';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Calendar,
  Grid,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Gem,
  X as CloseIcon,
} from 'lucide-react';
import { EarningRewardData } from './EarningRewardModal';
import { HowItWorksModal } from './dashboard/HowItWorksModal';
import { WidgetPickerModal } from './dashboard/WidgetPickerModal';
import { CustomizableWidget } from './dashboard/CustomizableWidgets';
import { DashboardRow, DashboardSlot, WidgetType, WidgetSize } from '../types/dashboardWidgets';

interface ReferenceDashboardProps {
  user: UserProfile;
  brokers: Broker[];
  signals: MarketSignal[];
  quickSteps?: QuickStep[];
  performanceData?: Record<'1D' | '1W' | '1M' | 'All', PerformanceTimeframeData>;
  leaderboardUsers?: LeaderboardUser[];
  onOpenViewPlan: () => void;
  onAddDemoPoints?: () => void;
  onStepClick?: (stepIndex: number) => void;
  onToggleStep?: (stepIndex: number) => void;
  onOpenConnectModal: (broker?: Broker) => void;
  onOpenLedger?: () => void;
  onSelectSignal: (signal: MarketSignal) => void;
  onNavigateToTab: (tab: string) => void;
  onTriggerEarningModal?: (data: EarningRewardData) => void;
  onOpenSearchModal?: () => void;
  onShowToast?: (msg: string) => void;
}

// ─────────────────────────────────────────────────────────────
// Custom 3D SVGs & Icons matching Dashboard; Desktop.png
// ─────────────────────────────────────────────────────────────

/**
 * Rookie Ghost Vector Badge (matches exact ghost outline from reference)
 */
function RookieGhostIcon() {
  return (
    <div className="w-14 h-16 sm:w-16 sm:h-18 flex items-center justify-center shrink-0">
      <svg
        viewBox="0 0 70 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Ghost Body Outline */}
        <path
          d="M 12 40 C 12 18, 22 8, 35 8 C 48 8, 58 18, 58 40 L 58 64 C 58 68, 54 70, 50 67 C 46 64, 43 64, 40 68 C 37 72, 33 72, 30 68 C 27 64, 24 64, 20 67 C 16 70, 12 68, 12 64 Z"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Left Eye */}
        <ellipse cx="27" cy="34" rx="3" ry="5" fill="white" />
        {/* Right Eye */}
        <ellipse cx="43" cy="34" rx="3" ry="5" fill="white" />
      </svg>
    </div>
  );
}

/**
 * 3D Calendar Streak Tile Icon
 */
function ActiveStreakCalendarIcon() {
  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7662f9] to-[#5945F1] p-1.5 shadow-md flex flex-col justify-between relative shrink-0">
      {/* Calendar top ring markers */}
      <div className="flex justify-between px-1.5 -mt-2.5">
        <span className="w-1.5 h-2.5 rounded-full bg-slate-300 border border-slate-400/30" />
        <span className="w-1.5 h-2.5 rounded-full bg-slate-300 border border-slate-400/30" />
      </div>
      {/* Calendar Sheet */}
      <div className="w-full h-full bg-white/95 rounded-lg flex flex-col items-center justify-center p-1 shadow-inner relative overflow-hidden">
        <div className="w-full h-1.5 bg-[#FD02B0] rounded-xs mb-1" />
        <svg viewBox="0 0 20 20" className="w-5 h-5 fill-none stroke-[#16a34a] stroke-[2.5]">
          <path d="M 4 10 L 8 14 L 16 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/**
 * 3D Cumulative Cashback Coin & Receipt Icon
 */
function CumulativeCashbackIcon() {
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4f46e5] via-[#5945F1] to-[#3b82f6] p-0.5 shadow-md flex items-center justify-center relative shrink-0">
      <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center relative overflow-hidden">
        {/* Receipt paper behind */}
        <div className="absolute top-1.5 right-1.5 w-4 h-6 bg-white/90 rounded-xs shadow-xs rotate-12 flex flex-col justify-around p-0.5">
          <div className="w-full h-0.5 bg-slate-300 rounded-full" />
          <div className="w-3/4 h-0.5 bg-slate-300 rounded-full" />
          <div className="w-1/2 h-0.5 bg-emerald-500 rounded-full" />
        </div>
        {/* Dollar Symbol */}
        <span className="font-extrabold text-white text-lg font-mono relative z-10 drop-shadow-xs">$</span>
      </div>
    </div>
  );
}

/**
 * Donut Chart for Top 3 Performers
 */
function TopPerformersDonutChart() {
  // SVG donut with 3 arcs: Gold/Amber (~40%), Indigo (~35%), Magenta (~25%)
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
        {/* Background Track */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="16" />
        {/* Amber Segment: XAU/USD (~38%) */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="16"
          strokeDasharray="91 238"
          strokeDashoffset="0"
          strokeLinecap="round"
        />
        {/* Indigo Segment: Dow Jones (~34%) */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="16"
          strokeDasharray="81 238"
          strokeDashoffset="-96"
          strokeLinecap="round"
        />
        {/* Magenta Segment: AUDUSD (~28%) */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#FD02B0"
          strokeWidth="16"
          strokeDasharray="66 238"
          strokeDashoffset="-182"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="w-3 h-3 rounded-full bg-white shadow-2xs" />
      </div>
    </div>
  );
}

/**
 * Mini Sparkline SVG helper
 */
function MiniSparkline({ trend = 'up', color = '#16a34a' }: { trend?: 'up' | 'down'; color?: string }) {
  const points =
    trend === 'up'
      ? '0,14 6,12 12,15 18,10 24,11 30,7 36,9 42,4 48,2'
      : '0,4 6,7 12,5 18,11 24,9 30,13 36,11 42,15 48,16';

  return (
    <svg viewBox="0 0 50 18" className="w-14 h-4 overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

const DEFAULT_ROWS: DashboardRow[] = [
  {
    id: 'row-1',
    slots: [
      { id: 'slot-1-1', type: 'level-card', size: 1, title: 'Rookie Level' },
      { id: 'slot-1-2', type: 'saved-calculators', size: 1, title: 'Saved Calculators' },
      { id: 'slot-1-3', type: 'most-recent-signals', size: 1, title: 'Most Recent Signals' },
    ],
  },
];

function ConnectedBrokersRow({
  brokers,
  onOpenConnectModal,
  onNavigateToTab,
}: {
  brokers: Broker[];
  onOpenConnectModal: (broker?: Broker) => void;
  onNavigateToTab: (tab: string) => void;
}) {
  const featuredBrokers = [
    { name: 'XM', logoColor: 'bg-black', logoText: 'XM', cashback: '$8.00', verified: true },
    { name: 'HFM', logoColor: 'bg-black', logoText: 'HFM', cashback: '$8.00', verified: true },
    { name: 'Exness', logoColor: 'bg-[#FFD200]', logoText: 'ex', cashback: '$8.00', verified: true },
    { name: 'Pepperstone', logoColor: 'bg-[#002B49]', logoText: 'P', cashback: '$8.00', verified: false },
    { name: 'IC Markets', logoColor: 'bg-[#002D3B]', logoText: 'IC', cashback: '$8.00', verified: false },
    { name: 'FxPro', logoColor: 'bg-[#E11928]', logoText: 'fx', cashback: '$8.00', verified: false },
  ];

  return (
    <div className="rounded-2xl border-2 border-[#f0abfc] p-5 sm:p-6 bg-white shadow-2xs space-y-4">
      <div>
        <h3 className="font-display font-extrabold text-lg text-[#5945F1] tracking-tight">
          More Connected Brokers. More Opportunities.
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          Connect more broker partners and give your trades more ways to earn cashback.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {featuredBrokers.map((b) => {
          const brokerObj = brokers.find((br) => br.name.toLowerCase().includes(b.name.toLowerCase()));
          return (
            <div
              key={b.name}
              className="rounded-xl border border-slate-200/90 bg-white p-3 flex flex-col items-center justify-between text-center space-y-2.5 shadow-2xs hover:border-indigo-300 transition-all"
            >
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl ${b.logoColor} text-white flex items-center justify-center font-black text-sm shadow-2xs`}>
                  {b.logoText}
                </div>
                {b.verified && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow-xs">
                    ✓
                  </span>
                )}
              </div>

              <div>
                <div className="font-extrabold text-xs text-[#0b1c30] truncate max-w-[100px]">{b.name}</div>
                <div className="text-[10px] text-slate-500 font-medium">{b.cashback} Max Cashback</div>
              </div>

              <button
                onClick={() => onOpenConnectModal(brokerObj)}
                className="w-full py-1.5 rounded-lg bg-[#5945F1] hover:bg-[#4836d9] text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                Connect
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-1">
        <button
          onClick={() => onNavigateToTab('brokers')}
          className="px-6 py-2 rounded-xl bg-[#FD02B0] hover:bg-[#e0029c] text-white font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          Explore All Brokers
        </button>
      </div>
    </div>
  );
}

function CustomizeRightSidebar({
  signals,
  onSelectSignal,
  onNavigateToTab,
}: {
  signals: MarketSignal[];
  onSelectSignal: (s: MarketSignal) => void;
  onNavigateToTab: (tab: string) => void;
}) {
  return (
    <div className="space-y-5">
      {/* 1. 😎 Just This Spot */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-md border border-indigo-100 p-6 shadow-2xs text-center space-y-2 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FD02B0] text-white text-xs font-bold shadow-xs">
          <span>😎 Just This Spot</span>
        </div>
        <p className="text-xs text-slate-600 max-w-[220px] mx-auto font-medium leading-relaxed">
          We locked it so you won't miss your account status
        </p>
      </div>

      {/* 2. Your Winning Signals */}
      <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-display font-extrabold text-base text-[#0b1c30]">
              Your <span className="text-[#5945F1]">Winning Signals.</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Signals from your actual money-makers.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('signals')}
            className="text-xs font-bold text-slate-600 hover:text-[#5945F1] transition-colors cursor-pointer flex items-center gap-0.5 shrink-0"
          >
            <span>All Signals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* EUR/USD */}
          <div
            onClick={() => {
              const s = signals.find((item) => item.ticker === 'EUR/USD') || signals[0];
              if (s) onSelectSignal(s);
            }}
            className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
              <span className="text-sm">🇪🇺</span>
              <span>EUR/USD</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#16a34a] font-mono">+0.33%</span>
            </div>
          </div>

          {/* Dow Jones */}
          <div
            onClick={() => {
              const s = signals.find((item) => item.ticker.includes('Dow')) || signals[1];
              if (s) onSelectSignal(s);
            }}
            className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
              <span className="text-sm">🇬🇧</span>
              <span className="truncate">Dow Jones</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#5945F1] font-mono">-0.11%</span>
            </div>
          </div>

          {/* AUDUSD */}
          <div
            onClick={() => {
              const s = signals.find((item) => item.ticker.includes('AUD')) || signals[2];
              if (s) onSelectSignal(s);
            }}
            className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
              <span className="text-sm">🇦🇺</span>
              <span>AUDUSD</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-[#16a34a] font-mono">+0.44%</span>
            </div>
          </div>

          {/* BTC/USD */}
          <div
            onClick={() => {
              const s = signals.find((item) => item.ticker === 'BTC/USD') || signals[0];
              if (s) onSelectSignal(s);
            }}
            className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-1.5"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
              <span className="text-sm">₿</span>
              <span>BTC/USD</span>
            </div>
            <div className="text-xs font-black text-[#FD02B0] tracking-tight">
              Your next win?
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tops Earning Points */}
      <div className="rounded-2xl bg-white border-2 border-[#FD02B0]/80 p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-display font-extrabold text-base text-[#0b1c30]">
            Tops Earning Points<span className="text-[#FD02B0]">.</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-snug">
            Get rewarded for trading your usual assets.{' '}
            <strong className="text-slate-800 font-bold">No extra effort required.</strong>
          </p>
        </div>

        <div className="space-y-3.5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🇪🇺</span>
              <span className="font-bold text-sm text-[#0b1c30]">EUR/USD</span>
            </div>
            <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
              <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
              <span>50</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black shadow-2xs">
                <span className="text-[#4285F4]">G</span>
              </div>
              <span className="font-bold text-sm text-[#0b1c30]">GOOGL</span>
            </div>
            <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
              <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
              <span>35</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🪙</span>
              <span className="font-bold text-sm text-[#0b1c30]">XAU/USD</span>
            </div>
            <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
              <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
              <span>20</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#E11928] text-white flex items-center justify-center text-[9px] font-black shadow-2xs">
                500
              </div>
              <span className="font-bold text-sm text-[#0b1c30]">S&P 500</span>
            </div>
            <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
              <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
              <span>20</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('points-credits')}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#5945F1] hover:bg-[#492CED] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View More</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export const ReferenceDashboard: React.FC<ReferenceDashboardProps> = ({
  user,
  brokers,
  signals,
  onOpenViewPlan,
  onOpenConnectModal,
  onSelectSignal,
  onNavigateToTab,
  onTriggerEarningModal,
  onOpenSearchModal,
  onShowToast,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | 'All'>('1M');
  const [connectedPage, setConnectedPage] = useState<number>(1);
  const [readyPage, setReadyPage] = useState<number>(1);
  const [activeAssetFilter, setActiveAssetFilter] = useState<string>('Earning Assets');

  // Dashboard Widget Customization Mode state
  const [isCustomizeMode, setIsCustomizeMode] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isWidgetPickerOpen, setIsWidgetPickerOpen] = useState<boolean>(false);
  const [targetSlot, setTargetSlot] = useState<{ rowIndex: number; slotIndex: number } | null>(null);

  const [rows, setRows] = useState<DashboardRow[]>(() => {
    try {
      const saved = localStorage.getItem('marketsyde_dashboard_rows');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ROWS;
  });

  const [originalRows, setOriginalRows] = useState<DashboardRow[]>(rows);
  const [draggedSlotInfo, setDraggedSlotInfo] = useState<{ rowIndex: number; slotIndex: number } | null>(null);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);

  const handleEnterCustomizeMode = () => {
    setOriginalRows(JSON.parse(JSON.stringify(rows)));
    setIsCustomizeMode(true);
    const hideRules = localStorage.getItem('marketsyde_hide_rules_modal');
    if (!hideRules) {
      setIsRulesModalOpen(true);
    }
  };

  const handleDiscard = () => {
    setRows(JSON.parse(JSON.stringify(originalRows)));
    setIsCustomizeMode(false);
    if (onShowToast) onShowToast('Customizations discarded.');
  };

  const handleReset = () => {
    setRows(JSON.parse(JSON.stringify(DEFAULT_ROWS)));
    if (onShowToast) onShowToast('Dashboard layout reset to default.');
  };

  const handleSave = () => {
    try {
      localStorage.setItem('marketsyde_dashboard_rows', JSON.stringify(rows));
    } catch {
      // ignore
    }
    setOriginalRows(JSON.parse(JSON.stringify(rows)));
    setIsCustomizeMode(false);
    if (onShowToast) onShowToast('Dashboard layout saved successfully!');
  };

  const handleAddRow = () => {
    const newRowId = `row-${Date.now()}`;
    const newRow: DashboardRow = {
      id: newRowId,
      slots: [
        { id: `slot-${Date.now()}-1`, type: 'empty', size: 1 },
        { id: `slot-${Date.now()}-2`, type: 'empty', size: 1 },
        { id: `slot-${Date.now()}-3`, type: 'empty', size: 1 },
      ],
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (rows.length <= 1) {
      setRows([
        {
          id: `row-${Date.now()}`,
          slots: [
            { id: `slot-${Date.now()}-1`, type: 'empty', size: 1 },
            { id: `slot-${Date.now()}-2`, type: 'empty', size: 1 },
            { id: `slot-${Date.now()}-3`, type: 'empty', size: 1 },
          ],
        },
      ]);
      return;
    }
    setRows((prev) => prev.filter((_, idx) => idx !== rowIndex));
  };

  const handleOpenPickerForSlot = (rowIndex: number, slotIndex: number) => {
    setTargetSlot({ rowIndex, slotIndex });
    setIsWidgetPickerOpen(true);
  };

  const handleSelectWidget = (type: WidgetType, size: WidgetSize) => {
    if (!targetSlot) return;
    const { rowIndex, slotIndex } = targetSlot;
    setRows((prev) => {
      const copy: DashboardRow[] = JSON.parse(JSON.stringify(prev));
      if (copy[rowIndex] && copy[rowIndex].slots[slotIndex]) {
        copy[rowIndex].slots[slotIndex] = {
          id: `slot-${Date.now()}`,
          type,
          size,
        };
      }
      return copy;
    });
    setTargetSlot(null);
  };

  const handleEmptySlot = (rowIndex: number, slotIndex: number) => {
    setRows((prev) => {
      const copy: DashboardRow[] = JSON.parse(JSON.stringify(prev));
      if (copy[rowIndex] && copy[rowIndex].slots[slotIndex]) {
        copy[rowIndex].slots[slotIndex] = {
          id: `slot-${Date.now()}`,
          type: 'empty',
          size: 1,
        };
      }
      return copy;
    });
  };

  // Interactive accounts data matching reference: HFM, XM, FxPro
  const [accountList, setAccountList] = useState([
    {
      id: 'hfm-acc-1',
      broker: 'HFM',
      accountType: 'Premium',
      accountNumber: '1100045789',
      status: 'pending',
      statusLabel: 'Pending Approval',
      timeEstimate: 'Takes 2–3 days',
      progressPercent: 45,
      logoColor: 'bg-black',
      textColor: 'text-white',
    },
    {
      id: 'xm-acc-2',
      broker: 'XM',
      accountType: 'Ultra Low',
      accountNumber: '1100098765',
      status: 'pending',
      statusLabel: 'Pending Approval',
      timeEstimate: 'Takes 2–3 days',
      progressPercent: 45,
      logoColor: 'bg-black',
      textColor: 'text-white',
    },
    {
      id: 'fxpro-acc-3',
      broker: 'FxPro',
      accountType: 'Raw+',
      accountNumber: '1100034521',
      status: 'approved',
      statusLabel: 'Approved',
      timeEstimate: '',
      progressPercent: 100,
      logoColor: 'bg-[#E11928]',
      textColor: 'text-white',
    },
  ]);

  const handleTradeNow = (accountName: string) => {
    if (onTriggerEarningModal) {
      onTriggerEarningModal({
        type: 'trade',
        points: 20,
        credits: 10,
        brokerName: accountName,
      });
    } else {
      onNavigateToTab('signals');
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ─── 1. TOP GREETING / CUSTOMIZER HEADER ─── */}
      {isCustomizeMode ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 bg-white p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-2xs">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              <span>Your vibe. Your dashboar</span>
              <span className="text-[#FD02B0]">d</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
              Save it. Don't let your masterpiece vanish into the ether.
            </p>
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              <span>See the rules</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleDiscard}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer active:scale-95"
            >
              ✕ Discard
            </button>
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-indigo-200 text-[#5945F1] hover:bg-indigo-50 text-xs font-semibold transition-colors cursor-pointer active:scale-95"
            >
              ↺ Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#5945F1] hover:bg-[#4734dc] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Save</span>
              <span>💾</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4 pt-1">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight leading-tight">
              <span className="text-[#5945F1]">Oh look, you're </span>
              <span className="text-[#FD02B0]">back!</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              The market kept moving. Good thing you did too.
            </p>
          </div>

          {/* Right edit button to enter widget customize mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnterCustomizeMode}
              className="px-3 py-1.5 rounded-xl border border-indigo-100/90 bg-white hover:bg-indigo-50 text-[#5945F1] flex items-center gap-2 shadow-2xs transition-all cursor-pointer hover:border-indigo-300 font-bold text-xs"
              title="Customize dashboard widgets"
            >
              <Pencil className="w-3.5 h-3.5 stroke-[2]" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── 2. MAIN DASHBOARD CONTENT (CUSTOMIZE MODE vs STANDARD BENTO) ─── */}
      {isCustomizeMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ════ LEFT COLUMN (8 cols): Customizable Rows + More Connected Brokers ════ */}
          <div className="lg:col-span-8 space-y-5">
            {rows.map((row, rowIndex) => (
              <div
                key={row.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedRowIndex === null || draggedRowIndex === rowIndex) return;
                  setRows((prev) => {
                    const copy = [...prev];
                    const [moved] = copy.splice(draggedRowIndex, 1);
                    copy.splice(rowIndex, 0, moved);
                    return copy;
                  });
                  setDraggedRowIndex(null);
                }}
                className="flex items-stretch gap-2 sm:gap-3"
              >
                {/* Drag Grip Handle on the left */}
                <div
                  draggable
                  onDragStart={() => setDraggedRowIndex(rowIndex)}
                  title="Drag to reorder row"
                  className="w-6 sm:w-7 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-center text-indigo-400 cursor-grab active:cursor-grabbing hover:text-indigo-600 hover:bg-indigo-100 transition-colors shadow-2xs shrink-0 self-center py-4"
                >
                  <div className="grid grid-cols-2 gap-0.5 pointer-events-none">
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                    <span className="w-1 h-1 rounded-full bg-current" />
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {row.slots.map((slot, slotIndex) => (
                    <div
                      key={slot.id}
                      draggable={slot.type !== 'empty'}
                      onDragStart={() => setDraggedSlotInfo({ rowIndex, slotIndex })}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (!draggedSlotInfo) return;
                        if (draggedSlotInfo.rowIndex === rowIndex && draggedSlotInfo.slotIndex === slotIndex) return;
                        setRows((prev) => {
                          const copy: DashboardRow[] = JSON.parse(JSON.stringify(prev));
                          const source = copy[draggedSlotInfo.rowIndex].slots[draggedSlotInfo.slotIndex];
                          const target = copy[rowIndex].slots[slotIndex];
                          copy[draggedSlotInfo.rowIndex].slots[draggedSlotInfo.slotIndex] = target;
                          copy[rowIndex].slots[slotIndex] = source;
                          return copy;
                        });
                        setDraggedSlotInfo(null);
                      }}
                      className="h-full"
                    >
                      <CustomizableWidget
                        slot={slot}
                        isCustomizeMode={true}
                        onEmptySlot={() => handleEmptySlot(rowIndex, slotIndex)}
                        onClickSlot={() => handleOpenPickerForSlot(rowIndex, slotIndex)}
                        user={user}
                        signals={signals}
                        brokers={brokers}
                        onOpenViewPlan={onOpenViewPlan}
                        onOpenConnectModal={onOpenConnectModal}
                        onSelectSignal={onSelectSignal}
                        onNavigateToTab={onNavigateToTab}
                      />
                    </div>
                  ))}
                </div>

                {/* Red Circular Delete Row Button on the right */}
                <button
                  onClick={() => handleDeleteRow(rowIndex)}
                  title="Delete row"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100/90 hover:bg-rose-200 text-rose-500 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0 self-center"
                >
                  <CloseIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ))}

            {/* ─── ADD MORE ROW BUTTON (Matching New (1).png) ─── */}
            <div className="rounded-2xl border-2 border-dashed border-indigo-200/90 bg-white/40 p-4 flex items-center justify-center">
              <button
                onClick={handleAddRow}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50/90 hover:bg-indigo-100 text-[#5945F1] font-bold text-xs transition-colors cursor-pointer shadow-2xs active:scale-95"
              >
                <div className="w-4 h-4 border border-indigo-400 rounded-xs flex items-center justify-center">
                  <div className="w-2 h-0.5 bg-indigo-500 rounded-xs" />
                </div>
                <span>Add More Row</span>
              </button>
            </div>

            {/* ─── MORE CONNECTED BROKERS. MORE OPPORTUNITIES (Matching New.png) ─── */}
            <ConnectedBrokersRow
              brokers={brokers}
              onOpenConnectModal={onOpenConnectModal}
              onNavigateToTab={onNavigateToTab}
            />
          </div>

          {/* ════ RIGHT COLUMN (4 cols): Just This Spot + Winning Signals + Tops Earning Points ════ */}
          <div className="lg:col-span-4">
            <CustomizeRightSidebar
              signals={signals}
              onSelectSignal={onSelectSignal}
              onNavigateToTab={onNavigateToTab}
            />
          </div>
        </div>
      ) : (
        <>
          {/* ─── 2. TOP ROW BENTO CARDS (3 Cards) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ── CARD 1: Ready to Trade (Left Wide Card ~ 6 cols) ── */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-[#f0abfc]/80 p-5 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow">
          <div>
            {/* Header with Title and Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-display font-extrabold text-lg sm:text-xl tracking-tight leading-snug">
                  <span className="text-[#5945F1]">Ready </span>
                  <span className="text-[#FD02B0]">to Trade</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Account connected and ready for trading.
                </p>
              </div>

              {/* Tag & Actions */}
              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold text-[#5945F1] border border-[#5945F1]/30 bg-white shadow-2xs">
                  Connected Accounts
                </span>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#5945F1] pt-0.5">
                  <button
                    onClick={() => onOpenConnectModal()}
                    className="hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    + Add More Accounts ,
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenSearchModal) {
                        onOpenSearchModal();
                      } else {
                        onNavigateToTab('brokers');
                      }
                    }}
                    className="hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>Explore Brokers</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Connected Account Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
              {/* Account 1: HFM */}
              <div className="rounded-xl p-3 bg-white border border-slate-200/80 flex flex-col justify-between space-y-3 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex flex-col items-center justify-center p-0.5 shrink-0 shadow-xs">
                    <span className="font-black text-[9px] tracking-tight leading-none">HFM</span>
                    <span className="text-[5px] uppercase font-semibold text-slate-400 leading-none scale-75">HF MARKETS</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#0b1c30] truncate">Premium</div>
                    <div className="text-[10px] text-slate-400 font-mono">1100045789</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fffbeb] border border-[#fef3c7] text-[#d97706] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    <span>Pending Approval</span>
                  </div>

                  {/* Dual-color progress indicator */}
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden flex">
                    <div className="w-1/2 bg-gradient-to-r from-[#5945F1] to-[#FD02B0] h-full" />
                  </div>
                  <div className="text-[10px] text-slate-400 text-center font-medium">
                    Takes 2–3 days
                  </div>
                </div>
              </div>

              {/* Account 2: XM */}
              <div className="rounded-xl p-3 bg-white border border-slate-200/80 flex flex-col justify-between space-y-3 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E11928] rounded-full" />
                    <span className="font-black text-[11px] tracking-tighter">XM</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#0b1c30] truncate">Ultra Low</div>
                    <div className="text-[10px] text-slate-400 font-mono">1100098765</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#fffbeb] border border-[#fef3c7] text-[#d97706] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                    <span>Pending Approval</span>
                  </div>

                  {/* Dual-color progress indicator */}
                  <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden flex">
                    <div className="w-1/2 bg-gradient-to-r from-[#5945F1] to-[#FD02B0] h-full" />
                  </div>
                  <div className="text-[10px] text-slate-400 text-center font-medium">
                    Takes 2–3 days
                  </div>
                </div>
              </div>

              {/* Account 3: FxPro (Approved & Ready) */}
              <div className="rounded-xl p-3 bg-white border border-slate-200/80 flex flex-col justify-between space-y-3 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E11928] text-white flex flex-col items-center justify-center p-0.5 shrink-0 shadow-xs">
                    <span className="font-black text-[9px] tracking-tight leading-none">FxPro</span>
                    <span className="text-[5px] font-medium text-white/80 leading-none scale-75">Trade Like a Pro</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#0b1c30] truncate">Raw+</div>
                    <div className="text-[10px] text-slate-400 font-mono">1100034521</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-[#d1fae5] text-[#16a34a] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                    <span>Approved</span>
                  </div>

                  <button
                    onClick={() => handleTradeNow('FxPro')}
                    className="w-full py-2 px-2 rounded-xl bg-[#5945F1] hover:bg-[#492CED] text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer text-center"
                  >
                    Trade Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-center gap-2 pt-3 text-slate-400">
            <button
              onClick={() => setReadyPage((p) => Math.max(1, p - 1))}
              className="p-1 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${readyPage === 1 ? 'bg-slate-300' : 'bg-slate-200'}`} />
              <span className={`w-2 h-2 rounded-full ${readyPage === 2 ? 'bg-[#5945F1]' : 'bg-[#5945F1]'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${readyPage === 3 ? 'bg-slate-300' : 'bg-slate-200'}`} />
            </div>
            <button
              onClick={() => setReadyPage((p) => Math.min(3, p + 1))}
              className="p-1 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── CARD 2: Rookie Card (Middle Purple Card ~ 3.5 cols) ── */}
        <div className="lg:col-span-3 rounded-2xl bg-[#5945F1] p-5 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div>
            {/* Top Row: Ghost Icon & Title */}
            <div className="flex items-start gap-4">
              <RookieGhostIcon />

              <div className="flex-1 min-w-0">
                <h3 className="font-display font-extrabold text-2xl text-white tracking-tight leading-none">
                  {user.rankTitle || 'Rookie'}
                </h3>

                {/* Dual-color Progress Bar */}
                <div className="w-full bg-white/25 rounded-full h-2 mt-3 mb-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#FD02B0] rounded-full"
                    style={{ width: `${Math.min(100, (user.currentPoints / 150) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/95">
                  <Gem className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>{user.currentPoints}/150 points.</span>
                </div>

                <div className="text-xs font-extrabold text-[#CAEB0E] mt-0.5 tracking-tight">
                  Don't Stop Now
                </div>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-white/20 my-4" />

            {/* Bottom Perks & View Plan */}
            <div className="flex items-end justify-between gap-2">
              <div className="space-y-1.5">
                <div className="text-[11px] font-medium text-white/80">
                  Next level at 50 Points
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <span className="font-bold text-sm leading-none">$</span>
                  <span>+{user.boostPercentage || 10}% Cashback Boost</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <span className="font-bold text-sm leading-none">%</span>
                  <span>Higher Confidence Signals</span>
                </div>
              </div>

              <button
                onClick={onOpenViewPlan}
                className="px-3.5 py-1.5 rounded-full border border-white/90 hover:bg-white/15 text-white font-bold text-xs transition-all shadow-2xs whitespace-nowrap cursor-pointer active:scale-95"
              >
                View Plan
              </button>
            </div>
          </div>
        </div>

        {/* ── CARD 3: You're Connected. Nice! (Top-Right Milestone Card ~ 2.5 cols) ── */}
        <div className="lg:col-span-3 rounded-2xl bg-white border-2 border-[#5945F1] p-4 relative flex flex-col justify-between shadow-2xs">
          {/* Milestone Badge Floating on Top Right Border */}
          <div className="absolute -top-3.5 right-4 px-3 py-0.5 rounded-full bg-[#FD02B0] text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Next Milestone</span>
          </div>

          <div className="pt-2">
            <div className="flex items-center gap-3">
              {/* Exness Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#0055FF] text-white flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                  <path d="M 6 6 L 11 12 L 6 18 L 9 18 L 13 13 L 17 18 L 20 18 L 15 12 L 20 6 L 17 6 L 13 11 L 9 6 Z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#0b1c30] leading-snug">
                  You're Connected. Nice!
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                  Start trading to get cashback
                </div>
              </div>

              <button
                onClick={() => handleTradeNow('Exness')}
                className="py-1.5 px-3 rounded-xl bg-[#5945F1] hover:bg-[#492CED] text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Trade Now
              </button>
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="flex items-center justify-center gap-2 pt-3 text-slate-400">
            <button
              onClick={() => setConnectedPage((p) => Math.max(1, p - 1))}
              className="p-1 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${connectedPage === 1 ? 'bg-[#5945F1]' : 'bg-slate-300'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${connectedPage === 2 ? 'bg-[#5945F1]' : 'bg-slate-300'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${connectedPage === 3 ? 'bg-[#5945F1]' : 'bg-slate-300'}`} />
            </div>
            <button
              onClick={() => setConnectedPage((p) => Math.min(3, p + 1))}
              className="p-1 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3. LOWER SECTION (2 Columns: Left 8 cols, Right 4 cols) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ════════════ LEFT COLUMN: Your Stats: March 2026 ════════════ */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
          {/* Header Row: Title & Timeframe Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-700 tracking-tight">
              Your Stats: <span className="text-[#0b1c30] font-black">March 2026</span>
            </h2>

            {/* Timeframe & Calendar Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setSelectedTimeframe('1D')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTimeframe === '1D'
                      ? 'bg-[#CAEB0E] text-[#0b1c30] font-black shadow-xs'
                      : 'hover:text-[#0b1c30]'
                  }`}
                >
                  1D
                </button>
                <button
                  onClick={() => setSelectedTimeframe('1W')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTimeframe === '1W'
                      ? 'bg-[#CAEB0E] text-[#0b1c30] font-black shadow-xs'
                      : 'hover:text-[#0b1c30]'
                  }`}
                >
                  1W
                </button>
                <button
                  onClick={() => setSelectedTimeframe('1M')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTimeframe === '1M'
                      ? 'bg-[#CAEB0E] text-[#0b1c30] font-black shadow-xs'
                      : 'hover:text-[#0b1c30]'
                  }`}
                >
                  1M
                </button>
                <button
                  onClick={() => setSelectedTimeframe('All')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedTimeframe === 'All'
                      ? 'bg-[#CAEB0E] text-[#0b1c30] font-black shadow-xs'
                      : 'hover:text-[#0b1c30]'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Date View Icons */}
              <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer">
                  <Calendar className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer">
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Metric Blocks in a Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3 pb-5 border-b border-slate-100 items-stretch">
            {/* Block 1: ACTIVE STREAK */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <ActiveStreakCalendarIcon />
                <div>
                  <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    ACTIVE STREAK
                  </div>
                  <div className="text-2xl font-black font-display text-[#0b1c30] leading-tight">
                    12 days
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-normal">
                    Track your consistency
                  </div>
                </div>
              </div>

              {/* Heatmap Grid (2 Rows of Squares) */}
              <div className="space-y-1 pt-1">
                {/* Row 1: 14 squares */}
                <div className="flex items-center gap-1">
                  {[...Array(14)].map((_, i) => (
                    <span
                      key={`sq1-${i}`}
                      className={`w-2.5 h-2.5 rounded-xs transition-colors ${
                        i < 11
                          ? 'bg-[#A3E635] shadow-2xs'
                          : 'border border-slate-300 bg-white'
                      }`}
                    />
                  ))}
                </div>
                {/* Row 2: 14 squares */}
                <div className="flex items-center gap-1">
                  {[...Array(14)].map((_, i) => (
                    <span
                      key={`sq2-${i}`}
                      className={`w-2.5 h-2.5 rounded-xs transition-colors ${
                        i < 8
                          ? 'bg-[#A3E635] shadow-2xs'
                          : 'border border-slate-300 bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Block 2: CUMULATIVE CASHBACK */}
            <div className="space-y-2 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <CumulativeCashbackIcon />
                <div>
                  <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                    CUMULATIVE CASHBACK
                  </div>
                  <div className="text-2xl font-black font-display text-[#0b1c30] leading-tight">
                    ${user.totalCashbackEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-normal">
                    163.6 Lots
                  </div>
                </div>
              </div>

              {/* Wave Chart Graphic Filling Bottom */}
              <div className="w-full h-10 mt-2 relative">
                <svg viewBox="0 0 200 40" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cashbackWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CAEB0E" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#CAEB0E" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 35 Q 35 32 60 28 T 120 22 T 170 14 T 200 8 L 200 40 L 0 40 Z"
                    fill="url(#cashbackWave)"
                  />
                  <path
                    d="M 0 35 Q 35 32 60 28 T 120 22 T 170 14 T 200 8"
                    fill="none"
                    stroke="#CAEB0E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Block 3: TOP 3 PERFORMERS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
                  TOP 3 PERFORMERS
                </span>
                <button
                  onClick={() => {
                    const filters = ['Earning Assets', 'Top Volume', 'Forex Only'];
                    const next = filters[(filters.indexOf(activeAssetFilter) + 1) % filters.length];
                    setActiveAssetFilter(next);
                  }}
                  className="px-2.5 py-0.5 rounded-full border border-[#5945F1]/30 text-[#5945F1] text-[10px] font-semibold flex items-center gap-1 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                >
                  <span>{activeAssetFilter}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Donut Chart & List */}
              <div className="flex items-center gap-3 pt-1">
                <TopPerformersDonutChart />

                <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                  {/* Performer 1: XAU/USD */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">🪙 XAU/USD</span>
                    </div>
                    <span className="font-bold text-[#0b1c30] text-xs font-mono">$1,150.00</span>
                  </div>

                  {/* Performer 2: Dow Jones */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#4F46E5] shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">🇬🇧 Dow Jones</span>
                    </div>
                    <span className="font-bold text-[#0b1c30] text-xs font-mono">$1,035.00</span>
                  </div>

                  {/* Performer 3: AUDUSD */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-[#FD02B0] shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">🇦🇺 AUDUSD</span>
                    </div>
                    <span className="font-bold text-[#0b1c30] text-xs font-mono">$943.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary 4-Column Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1 text-left border-b border-slate-100">
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Cashback (1M)</div>
              <div className="text-sm sm:text-base font-bold text-[#0b1c30] mt-1 font-mono">
                $0.00
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Lots Traded</div>
              <div className="text-sm sm:text-base font-bold text-[#0b1c30] mt-1 font-mono">
                0
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Avg Cashback / Lot</div>
              <div className="text-sm sm:text-base font-bold text-[#0b1c30] mt-1 font-mono">
                $0.00
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Best Day</div>
              <div className="text-sm sm:text-base font-bold text-[#0b1c30] mt-1 font-mono">
                $0.00
              </div>
            </div>
          </div>

          {/* Bottom Chart Grid with Dashed Lines */}
          <div className="space-y-4 pt-2">
            {[
              { dollar: '$100', lot: '10 lots' },
              { dollar: '$90', lot: '9 lots' },
              { dollar: '$80', lot: '8 lots' },
              { dollar: '$70', lot: '7 lots' },
            ].map((row) => (
              <div key={row.dollar} className="flex items-center justify-between gap-3 text-xs text-slate-400 font-medium font-mono">
                <span className="w-10 shrink-0 text-left">{row.dollar}</span>
                <div className="flex-1 border-b border-dashed border-slate-300 h-0" />
                <span className="w-14 shrink-0 text-right">{row.lot}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════ RIGHT COLUMN (Two Stacked Cards) ════════════ */}
        <div className="lg:col-span-4 space-y-5">
          {/* ── CARD A: Your Winning Signals. ── */}
          <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-extrabold text-base text-[#0b1c30]">
                  Your <span className="text-[#5945F1]">Winning Signals.</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signals from your actual money-makers.
                </p>
              </div>

              <button
                onClick={() => onNavigateToTab('signals')}
                className="text-xs font-bold text-slate-600 hover:text-[#5945F1] transition-colors cursor-pointer flex items-center gap-0.5 shrink-0"
              >
                <span>All Signals</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2x2 Grid of White Signal Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Item 1: EUR/USD */}
              <div
                onClick={() => {
                  const s = signals.find((item) => item.ticker === 'EUR/USD') || signals[0];
                  if (s) onSelectSignal(s);
                }}
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
                  <span className="text-sm">🇪🇺</span>
                  <span>EUR/USD</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <MiniSparkline trend="up" color="#16a34a" />
                  <span className="text-xs font-bold text-[#16a34a] font-mono">+0.33%</span>
                </div>
              </div>

              {/* Item 2: Dow Jones */}
              <div
                onClick={() => {
                  const s = signals.find((item) => item.ticker.includes('Dow') || item.ticker.includes('US30')) || signals[1];
                  if (s) onSelectSignal(s);
                }}
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
                  <span className="text-sm">🇬🇧</span>
                  <span className="truncate">Dow Jones</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <MiniSparkline trend="down" color="#5945F1" />
                  <span className="text-xs font-bold text-[#5945F1] font-mono">-0.11%</span>
                </div>
              </div>

              {/* Item 3: AUDUSD */}
              <div
                onClick={() => {
                  const s = signals.find((item) => item.ticker.includes('AUD')) || signals[2];
                  if (s) onSelectSignal(s);
                }}
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
                  <span className="text-sm">🇦🇺</span>
                  <span>AUDUSD</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <MiniSparkline trend="up" color="#16a34a" />
                  <span className="text-xs font-bold text-[#16a34a] font-mono">+0.44%</span>
                </div>
              </div>

              {/* Item 4: BTC/USD (Your next win?) */}
              <div
                onClick={() => {
                  const s = signals.find((item) => item.ticker === 'BTC/USD') || signals[0];
                  if (s) onSelectSignal(s);
                }}
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#0b1c30]">
                  <span className="text-sm">₿</span>
                  <span>BTC/USD</span>
                </div>
                <div className="text-xs font-black text-[#FD02B0] tracking-tight">
                  Your next win?
                </div>
              </div>
            </div>
          </div>

          {/* ── CARD B: Tops Earning Points. ── */}
          <div className="rounded-2xl bg-white border-2 border-[#FD02B0]/80 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="font-display font-extrabold text-base text-[#0b1c30]">
                Tops Earning Points<span className="text-[#FD02B0]">.</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                Get rewarded for trading your usual assets.{' '}
                <strong className="text-slate-800 font-bold">No extra effort required.</strong>
              </p>
            </div>

            {/* List of 4 Assets */}
            <div className="space-y-3.5 pt-1">
              {/* Asset 1: EUR/USD */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🇪🇺</span>
                  <span className="font-bold text-sm text-[#0b1c30]">EUR/USD</span>
                </div>
                <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
                  <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
                  <span>50</span>
                </div>
              </div>

              {/* Asset 2: GOOGL */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black shadow-2xs">
                    <span className="text-[#4285F4]">G</span>
                  </div>
                  <span className="font-bold text-sm text-[#0b1c30]">GOOGL</span>
                </div>
                <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
                  <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
                  <span>35</span>
                </div>
              </div>

              {/* Asset 3: XAU/USD */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold text-sm text-[#0b1c30]">XAU/USD</span>
                </div>
                <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
                  <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
                  <span>20</span>
                </div>
              </div>

              {/* Asset 4: S&P 500 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E11928] text-white flex items-center justify-center text-[9px] font-black shadow-2xs">
                    500
                  </div>
                  <span className="font-bold text-sm text-[#0b1c30]">S&P 500</span>
                </div>
                <div className="flex items-center gap-1 text-[#5945F1] font-bold text-sm">
                  <Gem className="w-3.5 h-3.5 fill-[#5945F1]/20 stroke-[#5945F1]" />
                  <span>20</span>
                </div>
              </div>
            </div>

            {/* Full-width View More Button */}
            <button
              onClick={() => onNavigateToTab('points-credits')}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#5945F1] hover:bg-[#492CED] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View More</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )}

      {/* ─── HOW IT WORKS RULES MODAL ─── */}
      <HowItWorksModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        onDontShowAgain={(dontShow) => {
          if (dontShow) {
            localStorage.setItem('marketsyde_hide_rules_modal', 'true');
          } else {
            localStorage.removeItem('marketsyde_hide_rules_modal');
          }
        }}
      />

      {/* ─── WIDGET PICKER MODAL ─── */}
      <WidgetPickerModal
        isOpen={isWidgetPickerOpen}
        onClose={() => {
          setIsWidgetPickerOpen(false);
          setTargetSlot(null);
        }}
        onSelectWidget={handleSelectWidget}
        currentlyUsedTypes={rows.flatMap((r) => r.slots.map((s) => s.type)).filter((t) => t !== 'empty')}
      />
    </div>
  );
};
