export const ECONOMY_VERSION = 1;
export const STORAGE_KEY = 'marketsyde.reward-beta.v1';
const DAY = 86_400_000;
export const POINT_LIFETIME = 90 * DAY;

export const LEVELS = [
  { level: 1, name: 'Starter', minPoints: 0, nextPoints: 100 },
  { level: 2, name: 'Active', minPoints: 100, nextPoints: 300 },
  { level: 3, name: 'Advanced', minPoints: 300, nextPoints: 700 },
  { level: 4, name: 'Elite', minPoints: 700, nextPoints: null },
] as const;

export type PremiumFeature = 'advancedScreener' | 'signalPrecision' | 'eventIntelligence' | 'orderFlow';
export type UnlockDuration = '1h' | '1d' | '7d';
export const PREMIUM_FEATURES: Record<PremiumFeature, { title: string; dailyPrice: number; includedLevel: number }> = {
  advancedScreener: { title: 'Advanced screener scatter', dailyPrice: 100, includedLevel: 2 },
  signalPrecision: { title: 'High-precision signals & correlations', dailyPrice: 140, includedLevel: 3 },
  eventIntelligence: { title: 'Chart event intelligence', dailyPrice: 120, includedLevel: 3 },
  orderFlow: { title: 'Chart order-flow analysis', dailyPrice: 180, includedLevel: 4 },
};
const durations: Record<UnlockDuration, { multiplier: number; milliseconds: number }> = {
  '1h': { multiplier: 0.4, milliseconds: DAY / 24 },
  '1d': { multiplier: 1, milliseconds: DAY },
  '7d': { multiplier: 4.5, milliseconds: 7 * DAY },
};

export type QuestId = 'daily-checkin' | 'explorer-research' | 'screener-research' | 'instrument-research' | 'chart-risk';
export type QuestEvidence = {
  symbols?: string[]; note?: string; answer?: string;
  entry?: number; stop?: number; budget?: number; riskPercent?: number;
};
export const QUESTS: Record<QuestId, { title: string; credits: number; limitLabel: string; description: string; period: 'day' | 'week'; limit: number }> = {
  'daily-checkin': { title: 'Daily market check-in', credits: 20, limitLabel: 'Once per UTC day', description: 'Claim your daily research allowance.', period: 'day', limit: 1 },
  'explorer-research': { title: 'Explain a market observation', credits: 30, limitLabel: 'Once per UTC day', description: 'Review an instrument, record an observation and distinguish data from a prediction.', period: 'day', limit: 1 },
  'screener-research': { title: 'Build a research shortlist', credits: 50, limitLabel: 'Once per UTC day', description: 'Compare two instruments and record a reason for further research.', period: 'day', limit: 1 },
  'instrument-research': { title: 'Compare broker conditions', credits: 30, limitLabel: 'Twice per UTC week', description: 'Compare two brokers, record costs and check eligibility.', period: 'week', limit: 2 },
  'chart-risk': { title: 'Complete a risk-planning scenario', credits: 40, limitLabel: 'Twice per UTC week', description: 'Calculate an educational risk scenario without placing an order.', period: 'week', limit: 2 },
};

export type GuidanceAction = 'broker-comparison' | 'risk-calculator';
export type CreditGuidance = {
  id: QuestId;
  code: string;
  title: string;
  reward: string;
  cadence: string;
  description: string;
  route: string;
  action?: GuidanceAction;
  section?: string;
};
export const CREDIT_GUIDANCE: readonly CreditGuidance[] = [
  { id: 'daily-checkin', code: 'D1', title: 'Daily market check-in', reward: '+20 C', cadence: '1/day', description: 'Review the market overview and record a meaningful observation.', route: 'screener' },
  { id: 'explorer-research', code: 'D2', title: 'Explain a market observation', reward: '+30 C', cadence: '1/day', description: 'Explore an instrument and separate evidence from prediction.', route: 'screener' },
  { id: 'screener-research', code: 'D3', title: 'Build a research shortlist', reward: '+50 C', cadence: '1/day', description: 'Compare two instruments and save a reason for further research.', route: 'screener' },
  { id: 'instrument-research', code: 'D3', title: 'Compare partner spreads', reward: '+30 C', cadence: '2/week', description: 'Compare broker costs, products, and eligibility before choosing a venue.', route: 'brokers', action: 'broker-comparison' },
  { id: 'chart-risk', code: 'D3', title: 'Configure risk control', reward: '+40 C', cadence: '2/week', description: 'Complete an educational risk scenario without placing an order.', route: 'calculators', action: 'risk-calculator' },
] as const;

export type TemporaryUnlockGuidance = {
  title: string;
  cost: string;
  route: string;
  action?: GuidanceAction;
  section?: string;
};
export const TEMPORARY_UNLOCK_GUIDANCE: readonly TemporaryUnlockGuidance[] = [
  { title: 'Premium signal preview', cost: '20 C one use · 30 C 1h', route: 'signals' },
  { title: 'Advanced signal details', cost: '30 C one use · 50 C 1h', route: 'signals' },
  { title: 'Signal Alerts+', cost: '35 C one use · 55 C 1h', route: 'signals' },
  { title: 'Advanced broker comparison', cost: '25 C one use · 40 C 1h', route: 'brokers', action: 'broker-comparison' },
  { title: 'Advanced risk analytics', cost: '45 C one use · 70 C 1h', route: 'calculators', action: 'risk-calculator' },
  { title: 'Premium community analytics', cost: '30 C one use · 50 C 1h', route: 'community' },
  { title: 'Premium analysis', cost: '25 C one use · 40 C 1h', route: 'instrument', section: 'Analysis' },
  { title: 'Live / voice community access', cost: '30 C one use · 50 C 1h', route: 'community' },
] as const;

export interface RewardEntry {
  id: string;
  kind: 'seed' | 'quest' | 'conversion' | 'unlock' | 'milestone';
  title: string;
  at: string;
  credits: number;
  points: number;
  expiresAt?: string;
}
export interface EconomyState {
  version: number;
  ledger: RewardEntry[];
  claims: { questId: QuestId; at: string; fingerprint: string }[];
  entitlements: { feature: PremiumFeature; expiresAt: string }[];
  connections: { brokerId: string; accountId: string }[];
}
export interface ActionResult { ok: boolean; message: string; credits?: number; points?: number }
type Transition = { state: EconomyState; result: ActionResult };
const iso = (now: number) => new Date(now).toISOString();
const fail = (state: EconomyState, message: string): Transition => ({ state, result: { ok: false, message } });
const round = (value: number) => Math.round(value * 100) / 100;

export function createInitialState(now = Date.now()): EconomyState {
  return {
    version: ECONOMY_VERSION,
    ledger: [{ id: 'beta-opening-balance', kind: 'seed', title: 'Demo opening balance', at: iso(now), credits: 154, points: 50, expiresAt: iso(now + POINT_LIFETIME) }],
    claims: [], entitlements: [], connections: [],
  };
}

export function getSnapshot(state: EconomyState, now = Date.now()) {
  const activeEntries = state.ledger.filter(entry => entry.points > 0 && Date.parse(entry.at) <= now && entry.expiresAt && Date.parse(entry.expiresAt) > now);
  const activePoints = round(activeEntries.reduce((sum, entry) => sum + entry.points, 0));
  const level = [...LEVELS].reverse().find(item => activePoints >= item.minPoints)!;
  const expiry = activeEntries.map(entry => entry.expiresAt!).sort()[0];
  return {
    credits: state.ledger.reduce((sum, entry) => sum + entry.credits, 0),
    activePoints,
    level,
    nextExpiry: expiry ? { at: expiry, points: round(activeEntries.filter(entry => entry.expiresAt === expiry).reduce((sum, entry) => sum + entry.points, 0)) } : null,
    ledger: [...state.ledger].reverse(),
    entitlements: state.entitlements.filter(item => Date.parse(item.expiresAt) > now),
    connections: state.connections,
  };
}

export function getUnlockCost(feature: PremiumFeature, duration: UnlockDuration, level: number): number {
  if (!Object.hasOwn(PREMIUM_FEATURES, feature) || !Object.hasOwn(durations, duration) || !Number.isInteger(level) || level < 1 || level > 4) {
    throw new Error('Invalid feature, duration or member level.');
  }
  if (level >= PREMIUM_FEATURES[feature].includedLevel) return 0;
  return Math.round(PREMIUM_FEATURES[feature].dailyPrice * durations[duration].multiplier * [1, 0.8, 0.5, 0][level - 1]);
}

export function hasFeatureAccess(state: EconomyState, feature: PremiumFeature, now = Date.now()) {
  return getSnapshot(state, now).level.level >= PREMIUM_FEATURES[feature].includedLevel ||
    state.entitlements.some(item => item.feature === feature && Date.parse(item.expiresAt) > now);
}

export function calculateCreditReward(base: number, difficulty: 1 | 2 | 3 | 4 | 5 | 6, relevance = 1, novelty = 1, occurrence = 1) {
  if (!Number.isFinite(base) || base < 0 || !Number.isInteger(difficulty) || difficulty < 1 || difficulty > 6 ||
      !Number.isFinite(relevance) || relevance < 1 || relevance > 1.3 || !Number.isFinite(novelty) || novelty < 0.5 || novelty > 1.3 ||
      !Number.isInteger(occurrence) || occurrence < 1) throw new Error('Invalid Credit reward parameters.');
  if (difficulty === 6) return { credits: 0, points: 10 };
  const frequency = [1, 0.5, 0.25][occurrence - 1] ?? 0;
  return { credits: Math.min(200, Math.round(base * [1, 1.25, 1.5, 1.75, 2][difficulty - 1] * relevance * novelty * frequency)), points: 0 };
}

export function estimatePoints(pointValue: number, partner: number, campaign: number, consistency: number) {
  if (!Number.isFinite(pointValue) || pointValue < 0 || !Number.isFinite(partner) || partner < 1 || partner > 1.5 ||
      !Number.isFinite(campaign) || campaign < 1 || campaign > 2 || !Number.isFinite(consistency) || consistency < 1 || consistency > 1.2) {
    throw new Error('Enter a non-negative Point Value and boosts within the beta limits.');
  }
  const combined = partner * campaign * consistency;
  const multiplier = Math.min(2, combined);
  const total = round(pointValue * multiplier);
  if (!Number.isFinite(total)) throw new Error('Point Value is too large.');
  return { base: pointValue, total, multiplier, capped: combined > 2 };
}

function periodStart(period: 'day' | 'week', now: number) {
  const date = new Date(now);
  date.setUTCHours(0, 0, 0, 0);
  if (period === 'week') date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  return date.getTime();
}

export function questAvailable(state: EconomyState, id: QuestId, now = Date.now()) {
  const quest = QUESTS[id];
  return state.claims.filter(claim => claim.questId === id && Date.parse(claim.at) >= periodStart(quest.period, now)).length < quest.limit;
}

function evidenceError(id: QuestId, evidence: QuestEvidence): string | null {
  if (id === 'daily-checkin') return null;
  if (typeof evidence.note !== 'string' || evidence.note.trim().length < 30 || evidence.note.length > 2000) return 'Record a research observation of 30 to 2,000 characters.';
  const symbols = new Set((evidence.symbols ?? []).map(symbol => symbol.trim().toUpperCase()).filter(Boolean));
  if (id === 'explorer-research' && (symbols.size < 1 || evidence.answer !== 'not-a-prediction')) return 'Select an instrument and confirm that market observations are not predictions.';
  if (id === 'screener-research' && (symbols.size < 2 || evidence.answer !== 'not-a-recommendation')) return 'Compare two different instruments and confirm that a shortlist is not a recommendation.';
  if (id === 'instrument-research' && (symbols.size < 2 || evidence.answer !== 'costs-and-eligibility')) return 'Compare two different brokers and acknowledge costs and product/region eligibility.';
  if (id === 'chart-risk') {
    const { entry, stop, budget, riskPercent } = evidence;
    if (![entry, stop, budget, riskPercent].every(value => typeof value === 'number' && Number.isFinite(value) && value > 0) ||
        entry === stop || riskPercent! > 2 || evidence.answer !== 'simulation-only') return 'Use positive prices, a distinct stop, a positive budget and risk above 0% up to 2%; confirm this is simulation only.';
    const units = budget! * riskPercent! / 100 / Math.abs(entry! - stop!);
    if (!Number.isFinite(units)) return 'The position-sizing calculation is outside the supported range.';
  }
  return null;
}

function append(state: EconomyState, entry: RewardEntry, result: ActionResult): Transition {
  return { state: { ...state, ledger: [...state.ledger, entry] }, result };
}

export function claimQuest(state: EconomyState, id: QuestId, evidence: QuestEvidence, now = Date.now()): Transition {
  if (!Object.hasOwn(QUESTS, id)) return fail(state, 'Unknown quest.');
  if (!questAvailable(state, id, now)) return fail(state, 'Reward already claimed for this UTC period.');
  const error = evidenceError(id, evidence);
  if (error) return fail(state, error);
  const fingerprint = JSON.stringify({
    symbols: [...new Set((evidence.symbols ?? []).map(symbol => symbol.trim().toUpperCase()))].sort(),
    note: evidence.note?.trim().toLowerCase().replace(/\s+/g, ' '), answer: evidence.answer,
    entry: evidence.entry, stop: evidence.stop, budget: evidence.budget, riskPercent: evidence.riskPercent,
  });
  if (id !== 'daily-checkin' && state.claims.some(claim => claim.questId === id && claim.fingerprint === fingerprint)) return fail(state, 'This research outcome has already earned a reward. Submit new work.');
  const quest = QUESTS[id];
  const count = state.claims.filter(claim => claim.questId === id && Date.parse(claim.at) >= periodStart(quest.period, now)).length;
  const next = { ...state, claims: [...state.claims, { questId: id, at: iso(now), fingerprint }] };
  return append(next, { id: `quest:${id}:${periodStart(quest.period, now)}:${count}`, kind: 'quest', title: quest.title, at: iso(now), credits: quest.credits, points: 0 },
    { ok: true, credits: quest.credits, message: `Quest complete: +${quest.credits} Credits.` });
}

export function convertCredits(state: EconomyState, amount: number, now = Date.now()): Transition {
  if (!Number.isSafeInteger(amount) || amount < 5 || amount % 5 !== 0) return fail(state, 'Enter a whole Credit amount in multiples of 5. No remainder will be deducted.');
  if (amount > getSnapshot(state, now).credits) return fail(state, 'Not enough Credits for this conversion.');
  const points = amount / 5;
  return append(state, { id: `conversion:${now}:${state.ledger.length}`, kind: 'conversion', title: 'Credits converted at 5:1', at: iso(now), credits: -amount, points, expiresAt: iso(now + POINT_LIFETIME) },
    { ok: true, credits: -amount, points, message: `Converted ${amount} Credits to ${points} Points, active for 90 days.` });
}

export function unlockFeature(state: EconomyState, feature: PremiumFeature, duration: UnlockDuration, now = Date.now()): Transition {
  if (!Object.hasOwn(PREMIUM_FEATURES, feature) || !Object.hasOwn(durations, duration)) return fail(state, 'Choose a supported feature and duration.');
  const snapshot = getSnapshot(state, now);
  if (snapshot.level.level >= PREMIUM_FEATURES[feature].includedLevel) return fail(state, 'Included with your level. No Credits are needed.');
  if (hasFeatureAccess(state, feature, now)) return fail(state, 'This feature is already unlocked. No Credits were charged.');
  const cost = getUnlockCost(feature, duration, snapshot.level.level);
  if (cost > snapshot.credits) return fail(state, `You need ${cost - snapshot.credits} more Credits for this access.`);
  const expiresAt = iso(now + durations[duration].milliseconds);
  const next = { ...state, entitlements: [...state.entitlements.filter(item => item.feature !== feature), { feature, expiresAt }] };
  return append(next, { id: `unlock:${feature}:${now}:${state.ledger.length}`, kind: 'unlock', title: `${PREMIUM_FEATURES[feature].title} (${duration})`, at: iso(now), credits: -cost, points: 0 },
    { ok: true, credits: -cost, message: `Access unlocked for ${cost} Credits until ${new Date(expiresAt).toLocaleString()}.` });
}

export function connectBroker(state: EconomyState, brokerId: string, accountId: string): Transition {
  if (!brokerId.trim() || !/^DEMO-[a-z0-9-]{1,40}$/i.test(accountId.trim())) return fail(state, 'Use a demo identifier such as DEMO-1234, not a real trading account.');
  return {
    state: { ...state, connections: [...state.connections.filter(connection => connection.brokerId !== brokerId), { brokerId, accountId: accountId.trim() }] },
    result: { ok: true, credits: 0, points: 0, message: 'Account saved.' },
  };
}

export function claimMonthlyMilestone(state: EconomyState, now = Date.now()): Transition {
  const month = iso(now).slice(0, 7);
  const id = `milestone:monthly:${month}`;
  if (state.ledger.some(entry => entry.id === id)) return fail(state, 'This monthly milestone has already been claimed.');
  const claims = state.claims.filter(claim => claim.questId !== 'daily-checkin' && claim.at.startsWith(month) && Date.parse(claim.at) <= now);
  if (new Set(claims.map(claim => claim.questId)).size < 4 || new Set(claims.map(claim => claim.at.slice(0, 10))).size < 7) {
    return fail(state, 'Complete all four research quest types across at least seven UTC days this month first.');
  }
  return append(state, { id, kind: 'milestone', title: 'Monthly exploration journey (D6)', at: iso(now), credits: 0, points: 10, expiresAt: iso(now + POINT_LIFETIME) },
    { ok: true, points: 10, credits: 0, message: 'D6 milestone: +10 Points, 0 Credits. Points stay active for 90 days.' });
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const date = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isFeature = (value: unknown): value is PremiumFeature => typeof value === 'string' && Object.hasOwn(PREMIUM_FEATURES, value);
const isQuest = (value: unknown): value is QuestId => typeof value === 'string' && Object.hasOwn(QUESTS, value);

function isEntry(value: unknown): value is RewardEntry {
  return record(value) && typeof value.id === 'string' && typeof value.title === 'string' &&
    ['seed', 'quest', 'conversion', 'unlock', 'milestone'].includes(String(value.kind)) && date(value.at) &&
    finite(value.credits) && Number.isSafeInteger(value.credits) && finite(value.points) && value.points >= 0 &&
    (value.expiresAt === undefined || date(value.expiresAt)) &&
    (value.points === 0 || (date(value.expiresAt) && Date.parse(value.expiresAt) === Date.parse(value.at) + POINT_LIFETIME));
}
function isClaim(value: unknown): value is EconomyState['claims'][number] {
  return record(value) && isQuest(value.questId) && date(value.at) && typeof value.fingerprint === 'string';
}
function isEntitlement(value: unknown): value is EconomyState['entitlements'][number] {
  return record(value) && isFeature(value.feature) && date(value.expiresAt);
}
function isConnection(value: unknown): value is EconomyState['connections'][number] {
  return record(value) && typeof value.brokerId === 'string' && typeof value.accountId === 'string' && /^DEMO-[a-z0-9-]{1,40}$/i.test(value.accountId);
}

export function parseStoredState(value: unknown): EconomyState {
  if (!record(value) || value.version !== ECONOMY_VERSION || !Array.isArray(value.ledger) || !value.ledger.every(isEntry) ||
      !Array.isArray(value.claims) || !value.claims.every(isClaim) || !Array.isArray(value.entitlements) || !value.entitlements.every(isEntitlement) ||
      !Array.isArray(value.connections) || !value.connections.every(isConnection)) throw new Error('Saved reward data is invalid or from an unsupported version. It has not been overwritten.');
  const creditBalance = value.ledger.reduce((sum, entry) => sum + entry.credits, 0);
  const totalPoints = value.ledger.reduce((sum, entry) => sum + entry.points, 0);
  if (new Set(value.ledger.map(entry => entry.id)).size !== value.ledger.length ||
      new Set(value.entitlements.map(item => item.feature)).size !== value.entitlements.length ||
      new Set(value.connections.map(item => item.brokerId)).size !== value.connections.length ||
      !Number.isSafeInteger(creditBalance) || creditBalance < 0 || !Number.isFinite(totalPoints)) throw new Error('Saved reward ledger is inconsistent. It has not been overwritten.');
  return { version: ECONOMY_VERSION, ledger: value.ledger, claims: value.claims, entitlements: value.entitlements, connections: value.connections };
}
