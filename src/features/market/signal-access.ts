import type { MarketSignal } from "../../types";

export type SignalAccessTier = 1 | 2 | 3 | 4;

export function signalTierForConfidence(confidence: number): SignalAccessTier {
  if (confidence >= 90) return 4;
  if (confidence >= 80) return 3;
  if (confidence >= 75) return 2;
  return 1;
}

export function withSignalAccessTier(signal: MarketSignal): MarketSignal {
  return {
    ...signal,
    minLevel: signalTierForConfidence(signal.confidence),
  };
}

export function clampSignalConfidence(confidence: number): number {
  return Math.max(70, Math.min(99, Math.round(confidence)));
}
