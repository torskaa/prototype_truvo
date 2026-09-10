import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Link2,
  CandlestickChart,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
  Info,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { UserProfile, Broker, MarketSignal } from '../types';

interface CashbackOverviewPageProps {
  user: UserProfile;
  brokers: Broker[];
  signals: MarketSignal[];
  onOpenConnectModal: (broker?: Broker) => void;
  onOpenViewPlan: () => void;
  onNavigateToBrokers: () => void;
  onNavigateToSignals: () => void;
  onSelectSignal: (signal: MarketSignal) => void;
  onBackToDashboard?: () => void;
  onSimulateTradeCashback?: () => void;
}

export const CashbackOverviewPage: React.FC<CashbackOverviewPageProps> = ({
  user,
  brokers,
  signals,
  onOpenConnectModal,
  onOpenViewPlan,
  onNavigateToBrokers,
  onNavigateToSignals,
  onSelectSignal,
  onBackToDashboard,
  onSimulateTradeCashback,
}) => {
  // FAQ accordion active item
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Default first open as in screenshot

  // Quick simulation state for interactive demo
  const [simulatedLots, setSimulatedLots] = useState(user.connectedBrokersCount > 0 ? 12.4 : 0.0);
  const [currentCashback, setCurrentCashback] = useState(user.totalCashbackEarned);
  const [simNotification, setSimNotification] = useState<string | null>(null);

  const handleSimulateTrade = () => {
    const lotIncrement = 1.5;
    const addedCashback = +(lotIncrement * 8.0).toFixed(2);
    setSimulatedLots((prev) => +(prev + lotIncrement).toFixed(2));
    setCurrentCashback((prev) => +(prev + addedCashback).toFixed(2));
    setSimNotification(`🎉 +$${addedCashback} Cashback Credited for ${lotIncrement} lots!`);
    setTimeout(() => setSimNotification(null), 3500);
    onSimulateTradeCashback?.();
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  // Top 3 featured brokers for the card
  const featuredBrokers = [
    {
      id: 'xm',
      name: 'XM',
      maxCashback: '$8.00',
      logoBg: 'bg-[#0b0d13]',
      renderLogo: () => (
        <div className="flex items-center justify-center font-black text-white text-lg tracking-wider">
          <span className="text-white">X</span>
          <span className="text-red-600 italic -ml-0.5">M</span>
        </div>
      ),
    },
    {
      id: 'hfm',
      name: 'HFM',
      maxCashback: '$8.00',
      logoBg: 'bg-[#0b0d13]',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="font-extrabold text-white text-sm tracking-tight">HFM</span>
          <span className="text-[6.5px] text-red-500 font-bold uppercase tracking-tighter">HF MARKETS</span>
        </div>
      ),
    },
    {
      id: 'exness',
      name: 'Exness',
      maxCashback: '$8.00',
      logoBg: 'bg-[#ffcc00]',
      renderLogo: () => (
        <div className="flex items-center justify-center font-black text-black text-xl tracking-tighter">
          ex
        </div>
      ),
    },
  ];

  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Breadcrumb / Navigation Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#5338ec] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display">
            <span className="bg-gradient-to-r from-[#5945F1] to-[#FE01B1] bg-clip-text text-transparent inline-block pb-0.5">
              Cashback Overview
            </span>
            <span className="text-[#c6f831] font-extrabold">.</span>
          </h1>
        </div>

        {/* Live Simulation Button for interactivity */}
        <button
          onClick={handleSimulateTrade}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5945F1] to-[#FE01B1] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c6f831]" />
          <span>Simulate Trade Rebate (+$12.00)</span>
        </button>
      </div>

      {/* Floating Simulation Alert */}
      <AnimatePresence>
        {simNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-2xl bg-[#0b1c30] border border-[#c6f831] text-[#c6f831] text-xs font-bold shadow-xl flex items-center justify-between"
          >
            <span>{simNotification}</span>
            <span className="text-[10px] text-slate-300 font-mono">Updated in Real-Time</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          TOP SECTION: 2 COLUMNS (Left 66%, Right Sidebar 34%)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (Cols 1-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* 1. Total Cashback Card (Dashed Border Outline) */}
          <div className="md:col-span-5 bg-white rounded-2xl p-6 border-2 border-dashed border-[#3b82f6] shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#5945F1] font-mono">
                  ${currentCashback.toFixed(2)}
                </div>
                <div className="text-xs font-semibold text-slate-600 mt-1">
                  Your Total Cashback
                </div>
              </div>

              <div className="inline-block">
                <span className="text-xs font-bold text-[#3b82f6] hover:underline cursor-pointer">
                  {simulatedLots.toFixed(2)} Lots Traded
                </span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our total cashback reflects all cashback credited from eligible brokers and your connected trading accounts.
              </p>
            </div>
          </div>

          {/* 2. Your Cashback Starts Here Card (3 Featured Brokers) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[#0b1c30]">
                    Your cashback starts her<span className="text-[#FE01B1]">e</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    One connection away from making your trades more rewarding.
                  </p>
                </div>
                <button
                  onClick={onNavigateToBrokers}
                  className="px-3.5 py-1.5 rounded-xl bg-[#5945F1] hover:bg-[#4f46e5] text-white text-xs font-bold whitespace-nowrap shadow-xs transition-colors shrink-0"
                >
                  Explore All Brokers
                </button>
              </div>

              {/* 3 Brokers Row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-4">
                {featuredBrokers.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-slate-300 bg-white shadow-2xs hover:shadow-sm transition-all flex flex-col items-center text-center group"
                  >
                    {/* Verified Tag */}
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-900 bg-amber-400/90 px-2 py-0.5 rounded-full mb-3">
                      ✓ Verified
                    </span>

                    {/* Logo Square */}
                    <div
                      className={`w-12 h-12 rounded-xl ${b.logoBg} shadow-sm flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}
                    >
                      {b.renderLogo()}
                    </div>

                    {/* Broker Name */}
                    <div className="font-extrabold text-xs text-[#0b1c30]">
                      {b.name}
                    </div>

                    {/* Max Cashback */}
                    <div className="mt-1">
                      <div className="text-xs font-black text-[#5945F1] font-mono">
                        {b.maxCashback}
                      </div>
                      <div className="text-[9px] text-slate-400 font-medium">
                        Max Cashback
                      </div>
                    </div>

                    {/* Connect Button */}
                    <button
                      onClick={() => {
                        const target = brokers.find((br) => br.name.toLowerCase().includes(b.id)) || brokers[0];
                        onOpenConnectModal(target);
                      }}
                      className="w-full mt-3 py-1 px-2 rounded-lg bg-white hover:bg-[#5945F1] text-[#5945F1] hover:text-white border border-[#5945F1]/40 text-[11px] font-bold transition-all shadow-2xs"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN / SIDEBAR (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card A: You're on the board */}
          <div className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-sm relative overflow-hidden">
            <h3 className="font-display font-black text-base text-[#0b1c30]">
              You're on the board<span className="text-[#FE01B1]">.</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Just connect a broker and trade to unlock your next rank!
            </p>

            {/* Rank Progress Stepper */}
            <div className="mt-6 mb-4 relative">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="text-[#FE01B1]">You</span>
                <span className="text-[#5945F1]">Climber</span>
              </div>

              {/* Progress Line */}
              <div className="relative w-full h-1.5 bg-slate-100 rounded-full mt-2 mb-3">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FE01B1] to-[#5945F1] rounded-full"
                  style={{ width: '45%' }}
                />
                <div className="absolute left-[45%] -top-1 w-3.5 h-3.5 rounded-full bg-[#5945F1] border-2 border-white shadow-xs" />
              </div>

              {/* Tooltip callout */}
              <div className="flex items-center justify-end">
                <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <span>Want this</span>
                  <span className="bg-[#c6f831] px-1 py-0.2 rounded-xs font-bold text-slate-900">
                    level?
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenViewPlan}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-[#5945F1] bg-white text-xs font-bold text-[#5945F1] hover:bg-slate-50 transition-all text-center shadow-2xs"
            >
              View Plan
            </button>
          </div>

          {/* Card B: Most Recent Signals */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-sm text-[#0b1c30]">
                Most Recent Signal<span className="text-[#FE01B1]">s.</span>
              </h3>
              <button
                onClick={onNavigateToSignals}
                className="text-xs font-bold text-slate-500 hover:text-[#5945F1] flex items-center gap-0.5 transition-colors"
              >
                <span>More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              View most recent signals for your trading
            </p>

            {/* List of 5 Signals */}
            <div className="space-y-2 pt-1">
              {/* Signal 1: EUR/USD */}
              <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🇺🇸</span>
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">EUR/USD</div>
                    <div className="text-[10px] text-emerald-600 font-mono font-bold">+0.33%</div>
                  </div>
                </div>
                {/* Mini Sparkline SVG */}
                <svg className="w-12 h-5 text-emerald-500" viewBox="0 0 50 20">
                  <path d="M 0,15 Q 15,18 25,10 T 50,5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <button
                  onClick={() => onSelectSignal(signals[0])}
                  className="px-3 py-1 rounded-lg bg-[#bcf026] text-black font-extrabold text-[11px] shadow-2xs hover:opacity-90"
                >
                  Buy
                </button>
              </div>

              {/* Signal 2: GOOGL */}
              <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">🇬</span>
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">GOOGL</div>
                    <div className="text-[10px] text-red-500 font-mono font-bold">-0.11%</div>
                  </div>
                </div>
                <svg className="w-12 h-5 text-red-400" viewBox="0 0 50 20">
                  <path d="M 0,5 Q 15,3 25,12 T 50,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <button
                  onClick={() => onSelectSignal(signals[1] || signals[0])}
                  className="px-3 py-1 rounded-lg bg-[#5945F1] text-white font-extrabold text-[11px] shadow-2xs hover:opacity-90"
                >
                  Sell
                </button>
              </div>

              {/* Signal 3: BTC/USD (Locked / Upgrade) */}
              <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">₿</span>
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">BTC/USD</div>
                    <div className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Premium Signal
                    </div>
                  </div>
                </div>
                <button
                  onClick={onOpenViewPlan}
                  className="px-3 py-1 rounded-lg bg-white border border-[#5945F1]/40 text-[#5945F1] font-bold text-[11px] shadow-2xs hover:bg-[#5945F1] hover:text-white transition-all"
                >
                  Upgrade
                </button>
              </div>

              {/* Signal 4: S&P 500 */}
              <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[8px] flex items-center justify-center">
                    500
                  </span>
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">S&P 500</div>
                    <div className="text-[10px] text-emerald-600 font-mono font-bold">+0.44%</div>
                  </div>
                </div>
                <svg className="w-12 h-5 text-emerald-500" viewBox="0 0 50 20">
                  <path d="M 0,16 Q 15,14 25,8 T 50,4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <button
                  onClick={() => onSelectSignal(signals[2] || signals[0])}
                  className="px-3 py-1 rounded-lg bg-[#bcf026] text-black font-extrabold text-[11px] shadow-2xs hover:opacity-90"
                >
                  Buy
                </button>
              </div>

              {/* Signal 5: XAU/USD */}
              <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[9px] flex items-center justify-center">
                    🥇
                  </span>
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">XAU/USD</div>
                    <div className="text-[10px] text-emerald-600 font-mono font-bold">+0.24%</div>
                  </div>
                </div>
                <svg className="w-12 h-5 text-emerald-500" viewBox="0 0 50 20">
                  <path d="M 0,14 Q 15,10 25,6 T 50,3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <button
                  onClick={() => onSelectSignal(signals[3] || signals[0])}
                  className="px-3 py-1 rounded-lg bg-[#bcf026] text-black font-extrabold text-[11px] shadow-2xs hover:opacity-90"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MIDDLE BANNER: READY TO EARN YOUR FIRST CASHBACK?
         ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-gradient-to-r from-[#5030e5] via-[#5945F1] to-[#6366f1] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-center">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#c6f831]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-[#c6f831]">
            Ready To Earn Your First Cashback?
          </h2>
          <p className="text-xs sm:text-sm text-purple-100">
            A few simple steps and your cashback won't be empty for long!
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10 mb-8 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-white">
              Choose Broker
            </div>
            <div className="text-[11px] text-purple-200 leading-relaxed">
              Pick yours, or find a better one here.
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
              <Link2 className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-white">
              Link Trading Account
            </div>
            <div className="text-[11px] text-purple-200 leading-relaxed">
              So we know where the trades are happening.
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
              <CandlestickChart className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-white">
              Trade as Usual
            </div>
            <div className="text-[11px] text-purple-200 leading-relaxed">
              Keep trading like you do, and we'll keep an eye on the cashback
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="font-bold text-sm text-white">
              Earn Cashback
            </div>
            <div className="text-[11px] text-purple-200 leading-relaxed">
              Start earning cashback on eligible trades automatically
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="relative z-10">
          <button
            onClick={onNavigateToBrokers}
            className="px-6 py-2.5 rounded-full bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-extrabold tracking-wide border border-white/20 shadow-lg transition-all hover:scale-105"
          >
            Explore All Brokers
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: CASHBACK ELIGIBILITY & PAYOUTS
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-2">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] font-display">
            Cashback Eligibility & Payout<span className="text-[#FE01B1]">s.</span>
          </h2>
          <p className="text-xs text-slate-500">
            Here are some quick answers to what's probably on your mind.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs max-w-4xl mx-auto">
          <ol className="space-y-4 text-xs sm:text-[13px] text-slate-700 leading-relaxed list-decimal pl-5">
            <li>
              Cashback is earned on eligible trades placed through a linked and approved broker's trading account.
            </li>
            <li>
              Trading activity must be validated and approved by the broker before cashback is released.
            </li>
            <li>
              Cashback amounts can differ based on the broker, instrument traded, account type, and your MarketSyde membership level.
            </li>
            <li>
              Cashback is credited directly to your trading account with the broker
            </li>
          </ol>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: HOW CASHBACK WORKS (ACCORDION)
         ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#0b1c30] font-display">
            How Cashback Work<span className="text-[#FE01B1]">s</span>
          </h2>
          <p className="text-xs text-slate-500">
            Automated Rebates Across All Assets. Total Transparency.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-3">
          {[
            {
              question: 'How is my cashback generated?',
              answer:
                'Cashback is generated from eligible trades placed through a connected broker account. The account must be linked correctly for trades to count.',
            },
            {
              question: 'Does my cashback rate increase over time?',
              answer:
                'Yes! As your trading volume and MarketSyde membership tier increase (from Rookie to Climber, Bronze, Silver, and Gold), your rebate multiplier automatically increases by up to +35%.',
            },
            {
              question: 'When will my cashback appear?',
              answer:
                'Cashback transactions are validated in real-time as trades settle with connected brokers. Confirmed rebates appear in your Cashback Ledger within 1-24 hours.',
            },
            {
              question: 'When can I withdraw my cashback?',
              answer:
                'Depending on the broker partner, cashback is either credited directly to your live trading balance with instant withdrawal capability, or paid weekly to your designated wallet.',
            },
            {
              question: 'How do I withdraw my cashback?',
              answer:
                'You can withdraw via your broker\'s standard withdrawal channels (Bank Wire, Crypto, Visa/Mastercard, Skrill, Neteller) with $0 MarketSyde platform withdrawal fees.',
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-xl border transition-all ${
                  isOpen
                    ? 'border-l-4 border-l-[#5945F1] border-slate-200 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-900"
                >
                  <span>{item.question}</span>
                  <div className="w-5 h-5 flex items-center justify-center text-[#5945F1] shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
