# Market feature transfer

Local integration branch: `codex/integrate-market-intelligence`.
Target base: `074a96458e299451ecd33547f24ed1f8f9617ec4`.
Source: the local `trading-intelligence` project.

## Preview

Run `npm install`, then `npm run dev -- --port 3001`.
Open `/?view=explorer`. Other supported queries are
`?view=screener`, `?view=instrument&symbol=NVDA`, and `?view=chart&symbol=NVDA`.
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
- The host-wide type check still reports existing errors in App,
  CustomizableWidgets, Header, PointsAndCreditsView, SearchModal, and
  TradingSignalsPage. These are not claimed as fixed by this transfer.
- Quotes, financials, news, community, rewards, alerts, and several trading
  actions retain prototype behavior; this is not a live brokerage integration.
- The built-in chart renderer works without proprietary assets. TradingView's
  optional adapter requires a separately licensed charting library.
- Watchlist and chart selections are session state, not backend persistence.
- Integration is maintained on its feature branch; deployment and merging into
  the main branch are separate steps.
