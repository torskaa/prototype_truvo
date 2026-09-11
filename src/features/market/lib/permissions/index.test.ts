import assert from 'node:assert/strict';
import test from 'node:test';
import { can } from './index';

test('a feature entitlement grants only that feature without changing the tier', () => {
  const entitlements = { orderFlow: true };
  assert.equal(can('BASIC', 'orderFlow', entitlements), true);
  assert.equal(can('BASIC', 'capitalFlow', entitlements), false);
  assert.equal(can('BASIC', 'eventIntelligence', entitlements), false);
});

test('explicit expired access overrides legacy tier permission', () => {
  assert.equal(can('PREMIUM', 'eventIntelligence', { eventIntelligence: false }), false);
  assert.equal(can('PREMIUM', 'orderFlow', { orderFlow: false }), false);
});

test('basic alert and existing unrelated permissions retain their behavior', () => {
  assert.equal(can('BASIC', 'basicAlert', { orderFlow: false }), true);
  assert.equal(can('BASIC', 'saveWatchlist'), true);
  assert.equal(can('INTERMEDIATE', 'correlation'), true);
  assert.equal(can('BASIC', 'correlation'), false);
});
