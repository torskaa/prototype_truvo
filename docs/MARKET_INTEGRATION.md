# Market feature transfer

Local integration branch: `codex/integrate-market-intelligence`.
Target base: `074a96458e299451ecd33547f24ed1f8f9617ec4`.
Source: the local `trading-intelligence` project.

## Preview

Run `npm ci`, then `npm run dev` (port 3000).
Open `/?view=screener` for the unified Market Scanner. Other supported queries are
`?view=instrument&symbol=NVDA`. Use `?view=instrument&mode=chart&symbol=NVDA` to
open the integrated advanced chart mode. Legacy `?view=chart` links are redirected
to the Instrument workspace with chart mode enabled; legacy `?view=explorer` links
are redirected to the Screener.
The host Trade menu and Market tools navigation expose all four views.

## Architecture

The transferred dependency tree lives in `src/features/market`, accessed through
the `@market` alias. `MarketWorkspace.tsx` adapts navigation, membership tiers,
and notifications to the host app. The host header, account state, and existing
pages remain in place. Browser history and symbol query parameters are supported.
Source styles are scoped to `.market-feature` to limit effects on host pages.
The migration script is a one-time extraction utility; rerunning it overwrites
local adjustments to imported components.

## Verification and limitations

- `npm run build` validates the production bundle.
- `npx tsc --noEmit -p tsconfig.market.json` checks the transferred module.
- `npm run test:rewards` exercises the beta economy's boundaries, caps, expiry, evidence, conversions and access rules.
- `npm run check:rewards` checks the reward engine, provider and tests.
- The host-wide type check still reports three pre-existing diagnostics:
  a missing `sparkline` on a fallback signal in SearchModal and two unsupported
  icon `title` props in TradingSignalsPage. These unrelated diagnostics remain;
  the rewards and market-module checks pass.
- Quotes, financials, news, community, rewards, alerts, and several trading
  actions retain prototype behavior; this is not a live brokerage integration.
- The built-in chart renderer works without proprietary assets. TradingView's
  optional adapter requires a separately licensed charting library.
- Watchlist and chart selections are session state, not backend persistence.
- Integration is maintained on its feature branch; deployment and merging into
  the main branch are separate steps.

## Reward and conversion beta (0.12.0)

The product model uses research as the entry point: discover a market, record a
research outcome, assess risk, and optionally compare/connect a broker. Ads are
clearly separated sponsored examples, not recommendations or inputs to research
rankings. Demo connection does not execute an order or verify product availability.

`src/features/rewards/economy.ts` is the shared deterministic rules module.
`RewardProvider.tsx` persists its versioned ledger, quest claims, per-feature
entitlements and demo connections under `marketsyde.reward-beta.v1` in localStorage.
The opening 154 Credits and 50 Points are explicitly simulated. Header, dashboard,
rewards hub and market pages derive balances and levels from this same ledger.
Storage failures are visible and block changes rather than silently resetting data.
Do not enter real financial credentials; demo account IDs must begin with `DEMO-`.

### Membership and Points

| Level | Active Points | Research access | Credit-price multiplier |
| --- | --- | --- | --- |
| 1 Starter | 0 to below 100 | Basic research | 1.00 |
| 2 Active | 100 to below 300 | Advanced screener scatter included | 0.80 |
| 3 Advanced | 300 to below 700 | Screener and chart event intelligence included | 0.50 |
| 4 Elite | 700+ | All eligible temporary research features included | 0 |

Points expire individually exactly 90 days after their grant. Expiry recalculates
levels and level-included access; purchased access retains its own expiry. The
activity view derives expiry movements without rewriting original grants.
Credits do not expire in this beta.

The owner explicitly retained **5 Credits = 1 Point**. This is an intentional
engagement-to-progression route in addition to trading and D6 milestones, not a
claim that Points come only from trading. Conversion requires a positive whole
multiple of 5, does not discard remainder Credits and creates one 90-day grant.
This relatively accessible progression route must be included in economy calibration.

Trading Points are estimates only: $1 *normalized Point Value*, not raw notional,
deposit or cash balance, corresponds to 1 Base Point. The example estimator
separately applies Partner, Campaign and positive Consistency boosts, capped at
2.00x combined. No estimator action mints Points. Live normalization rates,
contract specifications and campaign funding are not approved or connected.
Existing mock cashback data is separate from the new Point boost model.

### Credit earning

| Quest | Fixed beta reward | Limit |
| --- | --- | --- |
| Daily check-in | 20 C | Once per UTC day |
| Screener shortlist + research rationale | 50 C | Once per UTC day |
| Instrument broker-conditions comparison | 30 C | Twice per UTC week |
| Chart educational risk-planning scenario | 40 C | Twice per UTC week |

Weeks start Monday 00:00 UTC. Meaningful research requires a saved observation and
a task-specific checkpoint; identical outcomes cannot earn again. Risk scenarios
require a distinct stop and an educational risk budget above 0% up to 2%. They do
not represent orders, trade advice or verified broker risk controls.

These fixed quest awards are the beta schedule, not base amounts to multiply
again. The general formula helper separately supports D1-D5 difficulty,
relevance, novelty and frequency factors with a 200 C cap; identical repeat
factors are 1 / 0.5 / 0.25 / 0. D6 returns 10 Points and zero Credits.
The implemented monthly exploration D6 requires all four research types across
at least seven distinct UTC dates in the current month, claimed once that month.
Those completion criteria are this prototype's explicit beta configuration.

Sources: the supplied Credit System Formula v3, four-level/$1 Point Value beta
document and feature-audit CSVs. Where the source differs internally, this build
uses the later repository-matched daily 20 C schedule, the four-level thresholds,
and the owner's explicit 5:1 conversion choice. The new research quests are
feature-matched beta designs, not claims of existing production campaigns.

### Credit spending

Only working demo features are sold: advanced screener scatter (100 C/day),
chart event intelligence (120 C/day), and chart order flow (180 C/day).
These market-feature mappings are beta configurations derived from comparable
research/tool prices in the source, not the source's complete future catalogue.
Supported duration multipliers are 1 hour = 0.40, 1 day = 1.00 and 7 days = 4.50.
Cost is integer `Math.round(daily price * duration multiplier * level multiplier)`.
For example LV2 event intelligence for one hour costs 38 C. The Word document's
rounded-to-5 catalogue examples are illustrative; the formula is authoritative here.
Included or already-active features are never charged again. Only the chosen
feature is unlocked; buying event intelligence does not grant a premium tier.
Basic research, safety controls, trade execution and financial account utilities
are not Credit-gated.

### Production boundary

Browser persistence is for local demonstrations, not security, accounting or
multi-device authority. Local data and clocks can be altered; concurrent tabs
are synchronized best-effort, not with a server transaction lock. There is no
real broker verification, trade feed, campaign redemption or order execution.
The proposed 120 C verified-broker reward remains unavailable until a backend
can prove eligibility. Community actions do not earn until moderation exists.

Before production: add an authenticated transactional ledger, idempotent verified
events, server clocks/caps, real broker and region/product eligibility,
server-enforced entitlements, reversals and audited campaign configuration.
Measure verified partner activation, retained research use, issuance/burn and
reward cost per activated account; do not optimize for forced trading volume.
