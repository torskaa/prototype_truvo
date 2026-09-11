import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState, getSnapshot, POINT_LIFETIME, claimQuest, convertCredits, unlockFeature,
  hasFeatureAccess, getUnlockCost, estimatePoints, calculateCreditReward, claimMonthlyMilestone,
  connectBroker, parseStoredState, type QuestId,
} from './economy';

const NOW = Date.parse('2026-09-11T03:00:00Z');
const DAY = 86_400_000;
const research = { symbols: ['NVDA', 'MSFT'], note: 'Compare volume and volatility before deciding whether further research is useful.', answer: 'not-a-recommendation' };

describe('shared beta economy', () => {
  it('opens with one explicitly simulated balance and no verified connections', () => {
    const snapshot = getSnapshot(createInitialState(NOW), NOW);
    assert.equal(snapshot.credits, 154);
    assert.equal(snapshot.activePoints, 50);
    assert.equal(snapshot.level.level, 1);
    assert.deepEqual(snapshot.connections, []);
  });

  it('uses inclusive four-level thresholds and expires individual points at 90 days', () => {
    for (const [points, expected] of [[0, 1], [99, 1], [100, 2], [299, 2], [300, 3], [699, 3], [700, 4]]) {
      const state = createInitialState(NOW);
      state.ledger[0].points = points;
      assert.equal(getSnapshot(state, NOW).level.level, expected);
    }
    const converted = convertCredits(createInitialState(NOW), 100, NOW + DAY).state;
    assert.equal(getSnapshot(converted, NOW + POINT_LIFETIME - 1).activePoints, 70);
    assert.equal(getSnapshot(converted, NOW + POINT_LIFETIME).activePoints, 20);
    assert.equal(getSnapshot(converted, NOW + POINT_LIFETIME + DAY).activePoints, 0);
    assert.equal(getSnapshot(converted, NOW + POINT_LIFETIME + DAY).credits, 54);
  });

  it('converts at 5:1 atomically without truncating a remainder or overdrawing', () => {
    const state = createInitialState(NOW);
    for (const invalid of [0, -5, 1, 6, 5.1, NaN, Infinity, 155]) {
      const next = convertCredits(state, invalid, NOW);
      assert.equal(next.result.ok, false);
      assert.equal(next.state, state);
    }
    const next = convertCredits(state, 150, NOW);
    assert.equal(next.result.ok, true);
    assert.equal(getSnapshot(next.state, NOW).credits, 4);
    assert.equal(getSnapshot(next.state, NOW).activePoints, 80);
    assert.equal(convertCredits(next.state, 5, NOW).result.ok, false);
    assert.equal(next.state.ledger.length, state.ledger.length + 1);
  });

  it('caps daily claims at UTC boundaries, including rapid repeated clicks', () => {
    const nearMidnight = Date.parse('2026-09-11T23:59:59Z');
    const first = claimQuest(createInitialState(NOW), 'daily-checkin', {}, nearMidnight);
    assert.equal(first.result.credits, 20);
    assert.equal(claimQuest(first.state, 'daily-checkin', {}, nearMidnight).result.ok, false);
    assert.equal(claimQuest(first.state, 'daily-checkin', {}, nearMidnight + 1000).result.ok, true);
  });

  it('rejects trivial research and repeated evidence, but accepts new research after cooldown', () => {
    const state = createInitialState(NOW);
    assert.equal(claimQuest(state, 'screener-research', {}, NOW).result.ok, false);
    assert.equal(claimQuest(state, 'screener-research', { ...research, symbols: ['NVDA', 'nvda'] }, NOW).result.ok, false);
    const first = claimQuest(state, 'screener-research', research, NOW);
    assert.equal(first.result.credits, 50);
    assert.equal(claimQuest(first.state, 'screener-research', research, NOW + DAY).result.ok, false);
    assert.equal(claimQuest(first.state, 'screener-research', { ...research, note: research.note + ' A new observation.' }, NOW + DAY).result.ok, true);
    assert.equal(getSnapshot(first.state, NOW).activePoints, 50);
  });

  it('enforces twice-weekly risk tasks and prevents unsafe or invalid scenarios', () => {
    const evidence = { note: research.note, entry: 100, stop: 95, budget: 1000, riskPercent: 1, answer: 'simulation-only' };
    const state = createInitialState(NOW);
    for (const change of [{ entry: 0 }, { stop: 100 }, { budget: Infinity }, { riskPercent: 0 }, { riskPercent: 2.1 }, { answer: 'execute-trade' }]) {
      assert.equal(claimQuest(state, 'chart-risk', { ...evidence, ...change }, NOW).result.ok, false);
    }
    const first = claimQuest(state, 'chart-risk', evidence, NOW);
    const second = claimQuest(first.state, 'chart-risk', { ...evidence, stop: 94 }, NOW);
    assert.equal(first.result.credits, 40);
    assert.equal(second.result.ok, true);
    assert.equal(claimQuest(second.state, 'chart-risk', { ...evidence, stop: 93 }, NOW).result.ok, false);
    assert.equal(claimQuest(second.state, 'chart-risk', { ...evidence, stop: 93 }, Date.parse('2026-09-14T00:00:00Z')).result.ok, true);
  });

  it('prices only the selected feature, with discounts and permanent inclusion overrides', () => {
    assert.equal(getUnlockCost('advancedScreener', '1h', 1), 40);
    assert.equal(getUnlockCost('eventIntelligence', '1h', 2), 38);
    assert.equal(getUnlockCost('orderFlow', '1d', 3), 90);
    assert.equal(getUnlockCost('orderFlow', '7d', 4), 0);
    assert.equal(getUnlockCost('advancedScreener', '7d', 2), 0);
    const first = unlockFeature(createInitialState(NOW), 'advancedScreener', '1h', NOW);
    assert.equal(first.result.ok, true);
    assert.equal(getSnapshot(first.state, NOW).credits, 114);
    assert.equal(hasFeatureAccess(first.state, 'advancedScreener', NOW), true);
    assert.equal(hasFeatureAccess(first.state, 'eventIntelligence', NOW), false);
    assert.equal(unlockFeature(first.state, 'advancedScreener', '7d', NOW).result.ok, false);
    assert.equal(hasFeatureAccess(first.state, 'advancedScreener', NOW + 3_600_000), false);
    assert.equal(unlockFeature(first.state, 'orderFlow', '1d', NOW).result.ok, false);
  });

  it('never charges for level-included features, and recomputes access after a downgrade', () => {
    const state = createInitialState(NOW);
    state.ledger[0].points = 700;
    assert.equal(unlockFeature(state, 'orderFlow', '7d', NOW).state, state);
    assert.equal(hasFeatureAccess(state, 'orderFlow', NOW), true);
    assert.equal(hasFeatureAccess(state, 'orderFlow', NOW + POINT_LIFETIME), false);
  });

  it('separates bounded Credit formula rewards from fixed D6 points', () => {
    assert.deepEqual(calculateCreditReward(30, 3), { credits: 45, points: 0 });
    assert.equal(calculateCreditReward(30, 3, 1, 1, 2).credits, 23);
    assert.equal(calculateCreditReward(30, 3, 1, 1, 3).credits, 11);
    assert.equal(calculateCreditReward(30, 3, 1, 1, 4).credits, 0);
    assert.equal(calculateCreditReward(200, 5, 1.3, 1.3).credits, 200);
    assert.deepEqual(calculateCreditReward(200, 6), { credits: 0, points: 10 });
    assert.throws(() => calculateCreditReward(NaN, 1));
  });

  it('shows separate hypothetical boosts, caps stacking and does not mint points', () => {
    assert.deepEqual(estimatePoints(100, 1.2, 1.5, 1.1), { base: 100, total: 198, multiplier: 1.98, capped: false });
    assert.equal(estimatePoints(100, 1.5, 2, 1.2).total, 200);
    assert.equal(estimatePoints(100, 1.5, 2, 1.2).capped, true);
    assert.throws(() => estimatePoints(-1, 1, 1, 1));
    assert.throws(() => estimatePoints(100, 1, 1, 0.5));
  });

  it('saves demo connections without a reward and rejects actual account-shaped identifiers', () => {
    const state = createInitialState(NOW);
    assert.equal(connectBroker(state, 'exness', '9281048').result.ok, false);
    const first = connectBroker(state, 'exness', 'DEMO-1234');
    const second = connectBroker(first.state, 'exness', 'DEMO-5678');
    assert.equal(second.state.connections.length, 1);
    assert.equal(second.state.ledger.length, 1);
    assert.equal(getSnapshot(second.state, NOW).activePoints, 50);
  });

  it('requires all four research types across seven days for a once-monthly D6 reward', () => {
    let state = createInitialState(NOW);
    assert.equal(claimMonthlyMilestone(state, NOW).result.ok, false);
    const ids: QuestId[] = ['explorer-research', 'screener-research', 'instrument-research', 'chart-risk'];
    state.claims = Array.from({ length: 7 }, (_, index) => ({
      questId: ids[index % 4], at: new Date(NOW + index * DAY).toISOString(), fingerprint: `outcome-${index}`,
    }));
    const next = claimMonthlyMilestone(state, NOW + 7 * DAY);
    assert.equal(next.result.points, 10);
    assert.equal(next.result.credits, 0);
    assert.equal(claimMonthlyMilestone(next.state, NOW + 7 * DAY).result.ok, false);
  });

  it('round-trips persistent state and refuses invalid data rather than silently resetting', () => {
    const state = convertCredits(createInitialState(NOW), 100, NOW).state;
    assert.deepEqual(parseStoredState(JSON.parse(JSON.stringify(state))), state);
    assert.throws(() => parseStoredState({ version: 5 }));
    assert.throws(() => parseStoredState({ ...state, ledger: [...state.ledger, state.ledger[0]] }));
    assert.throws(() => parseStoredState({ ...state, ledger: [{ ...state.ledger[0], points: NaN }] }));
    assert.throws(() => parseStoredState({ ...state, ledger: [{ ...state.ledger[0], points: 0, expiresAt: 42 }] }));
    assert.throws(() => parseStoredState({ ...state, entitlements: [{ feature: 'orderFlow', expiresAt: new Date(NOW).toISOString() }, { feature: 'orderFlow', expiresAt: new Date(NOW).toISOString() }] }));
  });
});
