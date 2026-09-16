import { useMemo, useState, type FormEvent } from "react";
import {
  Bot,
  ChevronDown,
  Crosshair,
  LineChart,
  Lock,
  Newspaper,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { instruments } from "../features/market/data/mock-market";
import type { CashbackTrade } from "../types";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type MarketAISuggestionProps = {
  activeTab: string;
  routeSearch: string;
  tierLevel: number;
  recentTrades: CashbackTrade[];
  onNavigate: (
    view: string,
    symbol?: string,
    section?: string,
    focus?: string,
  ) => void;
};

const quickPrompts = [
  "What stands out now?",
  "Check the main risks",
  "What should I research next?",
];

export function MarketAISuggestion({
  activeTab,
  routeSearch,
  tierLevel,
  recentTrades,
  onNavigate,
}: MarketAISuggestionProps) {
  const symbol = useMemo(
    () => new URLSearchParams(routeSearch).get("symbol"),
    [routeSearch],
  );
  const instrument = instruments.find((item) => item.symbol === symbol);
  const topInstrument = [...instruments].sort(
    (a, b) => b.confidence - a.confidence,
  )[0];
  const contextInstrument = instrument ?? topInstrument;
  const tradeContext = recentTrades.map((trade) => ({
    trade,
    instrument: instruments.find(
      (item) =>
        item.symbol === trade.symbol ||
        item.symbol === trade.symbol.replace("/USDT", "/USD"),
    ),
  }));
  const focusTrade =
    tradeContext.find((item) => item.instrument?.symbol === symbol)?.trade ??
    tradeContext[0]?.trade;
  const focusInstrument =
    tradeContext.find((item) => item.trade.id === focusTrade?.id)?.instrument ??
    contextInstrument;
  const precisionInstrument =
    tradeContext
      .map((item) => item.instrument)
      .filter((item): item is NonNullable<typeof item> => !!item)
      .sort((a, b) => b.confidence - a.confidence)[0] ?? contextInstrument;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const contextLabel = symbol
    ? `${symbol} on the ${activeTab} page`
    : "the current market workspace";

  const answerFor = (question: string) => {
    const normalized = question.toLowerCase();
    const selected = contextInstrument;
    const signal = selected
      ? `${selected.symbol} is showing ${selected.signal} at ${selected.confidence}% confidence`
      : "the available demo instruments are mixed";

    if (normalized.includes("risk")) {
      return `${signal}. Check volume, invalidation levels, and the 24H move before acting. This is a research prompt, not a trade instruction.`;
    }
    if (
      normalized.includes("next") ||
      normalized.includes("trade") ||
      normalized.includes("action")
    ) {
      return `Suggested next step: compare ${selected?.symbol ?? "the leading symbols"} against a higher timeframe, then review the broker and risk settings. Keep the decision reviewable before sending any order.`;
    }
    if (normalized.includes("stand") || normalized.includes("signal")) {
      return `${signal}. The strongest follow-up is to validate the signal with relative volume and a related market rather than relying on confidence alone.`;
    }
    return `I’m looking at ${contextLabel}. ${signal}. Ask me about the signal, risks, or the next research step and I’ll keep the answer tied to the visible demo market data.`;
  };

  const addAssistantMessage = (text: string) => {
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "assistant", text },
    ]);
  };

  const runGuidedOption = (option: "data" | "news" | "precision") => {
    const target = focusInstrument ?? contextInstrument;
    const targetSymbol = target?.symbol ?? focusTrade?.symbol;
    if (!targetSymbol) {
      addAssistantMessage("I could not match a recent trade to the available market data.");
      return;
    }

    if (option === "data") {
      onNavigate("instrument", targetSymbol, "Forecast");
      addAssistantMessage(
        `${targetSymbol} is ${target?.signal ?? "being monitored"} at ${target?.confidence ?? "—"}% confidence. Scenario idea: compare its current move with relative volume and define the price that would invalidate the setup.`,
      );
      return;
    }
    if (option === "news") {
      onNavigate(
        "instrument",
        targetSymbol,
        "News",
        `news-${targetSymbol.replaceAll("/", "-")}-TECHNICAL`,
      );
      addAssistantMessage(
        `Trade-linked news brief for ${targetSymbol}: review company, macro, and sector headlines around the position before changing direction. The visible demo feed is context only, so verify the original source and timestamp.`,
      );
      return;
    }
    if (tierLevel < 3) {
      addAssistantMessage(
        `High-precision signal selection starts at Level 3. Your recent ${focusTrade?.type ?? "BUY"} record for ${targetSymbol} is still available for market-data research.`,
      );
      return;
    }
    const precisionTarget = precisionInstrument ?? target;
    onNavigate("signals", precisionTarget?.symbol ?? targetSymbol);
    addAssistantMessage(
      `I selected ${precisionTarget?.symbol ?? targetSymbol} as the highest-confidence signal matched to your recent trade set at ${precisionTarget?.confidence ?? "—"}%. Validate entry, stop, target, and timeframe before taking action.`,
    );
  };

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text: trimmed },
      { id: Date.now() + 1, role: "assistant", text: answerFor(trimmed) },
    ]);
    setInput("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    ask(input);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI market suggestions"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-violet-300 bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-violet-900/20 transition hover:bg-violet-700"
      >
        <Sparkles className="size-4" />
        AI suggestions
      </button>
    );
  }

  return (
    <aside className="fixed bottom-6 right-6 z-40 flex w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-2xl shadow-slate-900/20">
      <header className="flex items-start justify-between gap-3 bg-gradient-to-r from-violet-700 to-indigo-600 p-4 text-white">
        <div className="flex items-start gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-white/15">
            <Bot className="size-4" />
          </span>
          <div>
            <p className="text-xs font-bold">AI market suggestions</p>
            <p className="mt-0.5 text-[10px] text-violet-100">
              Grounded in visible demo data · Level {tierLevel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Minimize AI market suggestions"
            className="rounded-lg p-1.5 text-violet-100 hover:bg-white/10"
          >
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setMessages([]);
            }}
            aria-label="Close AI market suggestions"
            className="rounded-lg p-1.5 text-violet-100 hover:bg-white/10"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <div className="max-h-72 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3 text-[10px] leading-relaxed text-violet-900">
            I can help interpret {contextLabel}. Choose a prompt or ask a
            question; suggestions are informational and should be checked
            against the underlying market data.
          </div>
        )}
        {recentTrades.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Recent trade context
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recentTrades.slice(0, 4).map((trade) => (
                <span
                  key={trade.id}
                  className="rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-slate-600"
                >
                  {trade.type} {trade.symbol}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-1.5">
          <button
            type="button"
            onClick={() => runGuidedOption("data")}
            className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white p-2.5 text-left hover:border-violet-300 hover:bg-violet-50/50"
          >
            <LineChart className="size-4 shrink-0 text-violet-600" />
            <span>
              <b className="block text-[10px] text-slate-800">
                Navigate to data and scenario
              </b>
              <small className="text-[9px] text-slate-500">
                Explain what changed around your latest trade.
              </small>
            </span>
          </button>
          <button
            type="button"
            onClick={() => runGuidedOption("news")}
            className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white p-2.5 text-left hover:border-violet-300 hover:bg-violet-50/50"
          >
            <Newspaper className="size-4 shrink-0 text-violet-600" />
            <span>
              <b className="block text-[10px] text-slate-800">
                Trade-linked news update
              </b>
              <small className="text-[9px] text-slate-500">
                Focus the news context on your recorded symbols.
              </small>
            </span>
          </button>
          <button
            type="button"
            onClick={() => runGuidedOption("precision")}
            className="flex items-center gap-2 rounded-xl border border-violet-100 bg-white p-2.5 text-left hover:border-violet-300 hover:bg-violet-50/50"
          >
            {tierLevel < 3 ? (
              <Lock className="size-4 shrink-0 text-slate-400" />
            ) : (
              <Crosshair className="size-4 shrink-0 text-violet-600" />
            )}
            <span>
              <b className="block text-[10px] text-slate-800">
                Select high-precision signal
              </b>
              <small className="text-[9px] text-slate-500">
                {tierLevel < 3
                  ? "Requires Level 3 access."
                  : "Match the strongest signal to your trade record."}
              </small>
            </span>
          </button>
        </div>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 ${
              message.role === "user" ? "justify-end" : ""
            }`}
          >
            {message.role === "assistant" && (
              <Bot className="mt-1 size-3.5 shrink-0 text-violet-600" />
            )}
            <p
              className={`max-w-[85%] rounded-xl px-3 py-2 text-[10px] leading-relaxed ${
                message.role === "user"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-violet-50 text-violet-900"
              }`}
            >
              {message.text}
            </p>
            {message.role === "user" && (
              <UserRound className="mt-1 size-3.5 shrink-0 text-slate-400" />
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              type="button"
              key={prompt}
              onClick={() => ask(prompt)}
              className="rounded-full border border-violet-200 px-2 py-1 text-[9px] font-semibold text-violet-700 hover:bg-violet-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about this market..."
            aria-label="Ask AI market suggestion"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-[10px] text-slate-700 outline-none focus:border-violet-400"
          />
          <button
            type="submit"
            aria-label="Send AI market question"
            className="grid size-8 shrink-0 place-items-center rounded-xl bg-violet-600 text-white hover:bg-violet-700"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
}
