import { useState } from "react";
import { Screener, initialRules, indexAsInstrument } from "./views";
import { InstrumentDetail } from "./components/market/instrument-detail";
import { TechnicalChartWorkspace } from "./components/charts/technical-chart-workspace";
import { instruments, marketIndices } from "./data/mock-market";
import type { Instrument, View, Visualization, Tier } from "./types";
import type { Broker, CashbackTrade } from "../../types";
import { useRewards } from "../rewards/RewardProvider";
import { MarketEngagement } from "./MarketEngagement";
import { watchlistLimitForTier } from "./tier-access";

export const marketViews = ["screener", "instrument", "chart"];
export default function MarketWorkspace({
  view,
  locationSearch,
  onNavigate,
  onToast,
  brokers,
  recentTrades,
  onConnectBroker,
  onCompareBrokers,
  onOpenRewards,
  onOpenPlans,
}: {
  view: string;
  locationSearch: string;
  onNavigate: (view: string, symbol?: string) => void;
  tierLevel: number;
  onToast: (message: string) => void;
  brokers: Broker[];
  recentTrades: CashbackTrade[];
  onConnectBroker: (broker: Broker, symbol?: string) => void;
  onCompareBrokers: () => void;
  onOpenRewards: () => void;
  onOpenPlans: () => void;
}) {
  const { snapshot } = useRewards();
  const routeParams = new URLSearchParams(locationSearch);
  const symbol = routeParams.get("symbol");
  const section = routeParams.get("section");
  const focus = routeParams.get("focus");
  const index = marketIndices.find((item) => item.symbol === symbol);
  const selectedInstrument =
    instruments.find((item) => item.symbol === symbol) ??
    (index ? indexAsInstrument(index) : undefined) ??
    (symbol
      ? {
          symbol,
          name: `${symbol} generated market instrument`,
          market: symbol.includes("/") ? "Market" : "Stocks",
          sector: "Market",
          price: 100,
          change: 0,
          volume: 1,
          rvol: 1,
          rsi: 50,
          return1m: 0,
          marketCap: 100,
          sentiment: 50,
          signal: "NEUTRAL" as const,
          confidence: 50,
        }
      : undefined);
  const instrument = selectedInstrument ?? {
    symbol: "",
    name: "Select an instrument",
    market: "Market",
    sector: "Market",
    price: 0,
    change: 0,
    volume: 0,
    rvol: 0,
    rsi: 0,
    return1m: 0,
    marketCap: 0,
    sentiment: 0,
    signal: "NEUTRAL" as const,
    confidence: 0,
  };
  const hasSelectedInstrument = !!selectedInstrument;
  const [rules, setRules] = useState(initialRules);
  const [viz, setViz] = useState<Visualization>("Table");
  const [timeframe, setTimeframe] = useState("1D");
  const [indicators, setIndicators] = useState(["Volume"]);
  const [watchlist, setWatchlist] = useState<string[]>(["MSFT", "BTC/USD"]);
  const [chartOpen, setChartOpen] = useState(
    () =>
      new URLSearchParams(locationSearch).get("mode") === "chart" ||
      view === "chart",
  );
  const [sharedChartBy, setSharedChartBy] = useState<string | null>(null);
  const [showLinkedTags, setShowLinkedTags] = useState(true);
  const [followedPublisher, setFollowedPublisher] = useState<{
    name: string;
    tag: string;
  } | null>(null);
  const tier: Tier =
    snapshot.level.level >= 4
      ? "PREMIUM"
      : snapshot.level.level >= 2
        ? "INTERMEDIATE"
        : "BASIC";
  const watchlistLimit = watchlistLimitForTier(snapshot.level.level);
  const navigate = (next: View) => onNavigate(next, instrument.symbol);
  const openInstrument = (item: Instrument) =>
    onNavigate("instrument", item.symbol);
  const toggleWatch = (ticker: string) => {
    setWatchlist((current) => {
      if (current.includes(ticker)) {
        onToast("Market watchlist updated");
        return current.filter((item) => item !== ticker);
      }
      if (current.length >= watchlistLimit) {
        onToast(`Level ${snapshot.level.level} watchlists are limited to ${watchlistLimit} symbols.`);
        return current;
      }
      onToast("Market watchlist updated");
      return [...current, ticker];
    });
  };
  return (
    <div className="market-feature min-w-0 rounded-2xl">
      <MarketEngagement
        view={view}
        instrument={instrument}
        symbols={instruments.map((item) => item.symbol)}
        brokers={brokers}
        onConnectBroker={onConnectBroker}
        onCompareBrokers={onCompareBrokers}
        onOpenRewards={onOpenRewards}
        onOpenPlans={onOpenPlans}
        onNavigate={onNavigate}
      >
        {(view === "screener" ||
          (view === "instrument" && !hasSelectedInstrument)) && (
          <Screener
            tier={tier}
            rules={rules}
            setRules={setRules}
            results={instruments}
            viz={viz}
            setViz={setViz}
            openInstrument={openInstrument}
            openIndex={(item) => openInstrument(indexAsInstrument(item))}
            watchlist={watchlist}
            toggleWatch={toggleWatch}
            toast={onToast}
            recentTrades={recentTrades}
          />
        )}
        {(view === "instrument" || view === "chart") && hasSelectedInstrument && (
          <InstrumentDetail
            key={`${instrument.symbol}-${section ?? "overview"}-${focus ?? ""}`}
            instrument={instrument}
            initialTab={
              section === "News" ||
              section === "Market Data" ||
              section === "Forecast"
                ? section
                : undefined
            }
            focusId={focus ?? undefined}
            chartOpen={chartOpen}
            showLinkedTags={showLinkedTags}
            watchlistCount={watchlist.length}
            watchlistLimit={watchlistLimit}
            onShowLinkedTagsChange={setShowLinkedTags}
            followedPublisher={followedPublisher}
            onFollowPublisher={(name, tag) => {
              const unfollow = followedPublisher?.tag === tag;
              setFollowedPublisher(unfollow ? null : { name, tag });
              onToast(
                unfollow
                  ? `Stopped following ${name}'s alerts`
                  : `Following ${name}'s publisher alerts`,
              );
            }}
            chartContent={
              <TechnicalChartWorkspace
                key={sharedChartBy ?? "personal"}
                sharedBy={sharedChartBy ?? undefined}
              followedPublisher={followedPublisher ?? undefined}
                showLinkedTags={showLinkedTags}
                instrument={instrument}
                tier={tier}
                tierLevel={snapshot.level.level}
                onToast={onToast}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                indicators={indicators}
                addIndicator={(item) =>
                  setIndicators((current) =>
                    current.includes(item) ? current : [...current, item],
                  )
                }
                watchlist={watchlist}
                toggleWatch={() => toggleWatch(instrument.symbol)}
                createAlert={() =>
                  onToast(`Demo alert created for ${instrument.symbol}`)
                }
                inspectSignal={() => onNavigate("signals", instrument.symbol)}
              />
            }
            onCommunityChart={(name, tag) => {
              setSharedChartBy(name);
              setChartOpen(true);
              onToast(`Viewing ${name}'s shared ${instrument.symbol} chart`);
              window.setTimeout(() => {
                const marker = document.getElementById(
                  `chart-${instrument.symbol.replaceAll("/", "-")}-${tag}`,
                );
                marker?.scrollIntoView({ behavior: "smooth", block: "center" });
                marker?.querySelector<HTMLButtonElement>("button")?.click();
              }, 250);
            }}
            onOpenCommunity={() => onNavigate("community", instrument.symbol)}
            onBack={() => onNavigate("screener")}
            onChart={() => {
              setSharedChartBy(null);
              setChartOpen((open) => !open);
            }}
            onToast={onToast}
          />
        )}
      </MarketEngagement>
    </div>
  );
}
