# Changelog

## [1.5.34] - 2026-09-16

### Changed

- Connected Forecast scenario lines to their detail callouts so hovering a line reveals the associated strategy and writer details.

## [1.5.33] - 2026-09-16

### Changed

- Expanded Forecast scenario callouts and community cards with strategy movement, entry, target, possibility, and writer opinion.

## [1.5.32] - 2026-09-16

### Changed

- Replaced the verbose Forecast vote text with compact accessible vote and direction icons.

## [1.5.31] - 2026-09-16

### Changed

- Added dynamic vote colors and Buy/Sell prediction labels to Forecast contributor callouts.

## [1.5.30] - 2026-09-16

### Changed

- Added Agree/Disagree vote percentages and Long/Short direction to Forecast scenario callouts.

## [1.5.29] - 2026-09-16

### Changed

- Updated Forecast chart callouts to show the community contributor account name and vote score.

## [1.5.28] - 2026-09-16

### Changed

- Added formula-based Credit guidance, validated quest metadata, temporary-unlock guidance, and navigation from each guidance item to its related feature.

## [1.5.27] - 2026-09-16

### Changed

- Reworked the instrument trading sidebar into a compact Most Recent Signals card with signal trends, actions, and upgrade routing.

## [1.5.26] - 2026-09-16

### Changed

- Restricted the Forecast scenario date filter to Level 3–4 users.

## [1.5.25] - 2026-09-16

### Changed

- Restricted financial growth, profitability, financial health, reporting-period, and custom technical-period controls to Level 3+ users.

## [1.5.24] - 2026-09-16

### Changed

- Expanded community forecast cards with scenario details and replaced confidence with community vote results.

## [1.5.23] - 2026-09-16

### Removed

- Removed the remaining adaptive pair-trade heading and explanatory copy from the correlation workspace.

## [1.5.22] - 2026-09-16

### Removed

- Removed the floating AI suggestions launcher and adaptive pair-trade suggestion panel from the market workspace.

## [1.5.21] - 2026-09-16

### Fixed

- Fixed the market workspace blank-page crash by keeping the selected instrument title in the `InstrumentDetail` component scope.

## [1.5.20] - 2026-09-16

### Fixed

- AI guidance now prioritizes the explicitly selected symbol instead of defaulting to the first recent trade, including selected-symbol context, precision matching, and basket instrument titles.

## [1.5.19] - 2026-09-16

### Changed

- Linked the AI data-and-scenario action directly to the selected instrument’s Forecast tab.

## [1.5.18] - 2026-09-16

### Changed

- Linked community symbol tags to the matching news article and added focused scrolling/highlighting for AI news navigation.

## [1.5.17] - 2026-09-16

### Changed

- Guided AI market-data and news actions now open the selected trade symbol directly on its matching destination tab.

## [1.5.16] - 2026-09-16

### Added

- Connected AI market suggestions to recent trade records with guided market-data, trade-linked news, scenario, and high-precision signal actions.

## [1.5.15] - 2026-09-16

### Added

- Added a bottom-right AI market suggestion chat box with context-aware quick prompts and grounded demo-market responses.

## [1.5.14] - 2026-09-16

### Changed

- Removed the Cross-market comparison and Advanced/custom visualization choices from the screener selector.

## [1.5.13] - 2026-09-16

### Changed

- Locked market duration, instrument performance, cross-market period, and seasonal historical controls to the shared Level 1–4 access rules.
- Added lock indicators and upgrade guidance when a selected historical range exceeds the current level.

## [1.5.12] - 2026-09-16

### Changed

- Added the full Tier 1–4 market intelligence access matrix to the member plan view.
- Enforced tier access for historical chart ranges, advanced filters, saved screeners, CSV export, custom dashboards, and watchlist capacity.
- Kept core market overview, instrument analysis, 24H data, and Fear & Greed available across all tiers.

## [1.5.11] - 2026-09-16

### Changed

- Applied the visualization access matrix: Table from Level 1, Heatmap from Level 2, Scatter/Correlation/Cross-market comparison from Level 3, and Advanced/custom visualization from Level 4.
- Added locked visualization states and tier indicators so restricted views cannot render below their required access level.

## [1.5.10] - 2026-09-16

### Changed

- Auto side selection now follows the selected benchmark symbol's own LONG/SHORT signal when switching through the correlation matrix.

## [1.5.9] - 2026-09-16

### Changed

- Made correlation matrix row and column symbols clickable benchmark selectors.
- Synchronize the selected benchmark symbol, recommended pairs, selected-pair title, and per-leg form data when a matrix symbol is clicked.

## [1.5.8] - 2026-09-16

### Changed

- Moved Lots, Stop loss %, and Take profit % into each recommended symbol card.
- Main and pair legs now keep independent position sizing and risk settings for separate setups such as EUR/USD and AMZN.
- Included both leg lot values in draft confirmation and broker-queue messages.

## [1.5.7] - 2026-09-16

### Changed

- Made each recommended leg card editable in place, including side, product, target price, and stop price.
- Kept risk/reward, benchmark, lots, stop-loss percentage, and take-profit percentage in the recommendation detail workflow.
- Included customized target and stop prices in pair-draft confirmation and broker-queue messages.

## [1.5.6] - 2026-09-16

### Changed

- Moved pair side, product, risk/reward, and benchmark customization into Recommended signal details so each setting stays next to the leg signals it changes.
- Removed the separate customization table from the selected-pair summary.

## [1.5.5] - 2026-09-16

### Changed

- Moved the Adaptive Pair-Trade tool header to the top of the Correlation experience.
- Replaced fixed action, product, risk/reward, and signal summary cards with editable benchmark and trade setup controls initialized from the latest trade.
- Included the customized setup in pair-draft confirmation and connected-broker queue messages while retaining calculated access-tier gating.

## [1.5.4] - 2026-09-16

### Changed

- Added hover/focus signal detail cards for each recommended pair, including both legs, products, directions, and editable lots/stop-loss/take-profit parameters.
- Confirmed broker transfers now use the reviewed personal setup rather than an immutable default.

## [1.5.3] - 2026-09-16

### Changed

- Expanded Adaptive Pair-Trade into multiple positive- and negative-correlation pair candidates anchored to the user’s latest trade.
- Added connected-broker draft transfer after pair review and confirmation; final broker execution approval remains required.

## [1.5.2] - 2026-09-16

### Added

- Added a Level 3–4 Adaptive Pair-Trade suggestion panel to Correlation.
- Suggestions use the latest recorded trade and current instrument confidence, require explicit review and confirmation, and never submit an order automatically.

## [1.5.1] - 2026-09-16

### Changed

- Added the same multi-product trading signals to heatmap hover details, with confidence levels and access gating synchronized to the instrument signal view.

## [1.5.0] - 2026-09-16

### Changed

- Synchronized screener scatter hover cards with instrument signal details, including action, target/entry/stop values, product coverage, risk/reward, and tier gating.

## [1.4.99] - 2026-09-16

### Changed

- Locked scatter-point metric and broker details when the hovered signal requires a higher confidence access level than the user’s current level.

## [1.4.98] - 2026-09-16

### Changed

- Added signal direction, confidence, and confidence-tier access information to screener scatter-point details.

## [1.4.97] - 2026-09-16

### Changed

- Applied the 70%–74%, 75%–79%, 80%–89%, and 90%+ confidence tiers consistently to the Trading Signals page.
- Expanded instrument-detail signals so every available market product receives its own monitored setup.

## [1.4.96] - 2026-09-16

### Changed

- Applied confidence-based Trading Signals access tiers: Level 1 (70–74%), Level 2 (75–79%), Level 3 (80–89%), and Level 4 (90%+).

## [1.4.95] - 2026-09-16

### Changed

- Bound generated Crypto broker rows to the active instrument symbol so SOL/USD never displays unrelated pairs such as BTC/USD.

## [1.4.94] - 2026-09-16

### Changed

- Made Crypto Spot, Perpetual, and CFD buttons filter the generated broker rows to the selected product.

## [1.4.93] - 2026-09-16

### Changed

- Added generated Crypto pair rows with 5–10 individual broker rows per pair across Spot, Perpetual, and CFD.

## [1.4.92] - 2026-09-16

### Changed

- Restored the Crypto Products & broker access table to the pre-coverage-edit layout with one current pair symbol.

## [1.4.91] - 2026-09-16

### Changed

- Reverted the latest Crypto broker coverage table edit and restored the previous pair coverage presentation.

## [1.4.90] - 2026-09-16

### Changed

- Reworked Crypto broker coverage into pair rows with 5–10 generated brokers per pair and Spot, Perpetual, and CFD coverage badges.

## [1.4.89] - 2026-09-16

### Changed

- Expanded Crypto broker rows to show a deterministic 5–10 pair coverage set for each active product filter.

## [1.4.88] - 2026-09-16

### Changed

- Moved the Crypto pair into a dedicated Pair column in the broker comparison table and removed the header Pair/Broker badges.

## [1.4.87] - 2026-09-16

### Changed

- Added Crypto-only Pair and Broker badges to the Products & broker access header using the matched provider for the selected product.

## [1.4.86] - 2026-09-16

### Changed

- Display Crypto screener symbols as base coins, such as `BTC` instead of `BTC/USD`.

## [1.4.85] - 2026-09-16

### Changed

- Removed the symbol-cell Buy/Sell hover pair so Crypto rows show only their coin symbol.

## [1.4.84] - 2026-09-16

### Changed

- Added the signal-driven Buy/Sell broker action to each screener price cell.

## [1.4.83] - 2026-09-16

### Changed

- Removed the visible Name and Signal columns from the market screener table.

## [1.4.82] - 2026-09-15

### Changed

- Consolidated post reactions into a single heart-as-like control in the engagement footer and removed the other emoji reaction buttons.

## [1.4.81] - 2026-09-15

### Fixed

- Replaced two unavailable topic image URLs with verified chart imagery.

## [1.4.80] - 2026-09-15

### Added

- Added topic-matched visual examples to the expanded Community posts, including market charts, crypto, forex, equities, indices, metals, and energy imagery.

## [1.4.79] - 2026-09-15

### Fixed

- Prioritized explicit Fundamental markers over overlapping technical language when generating post types and covers.

## [1.4.78] - 2026-09-15

### Added

- Expanded the Community feed with 16 additional deterministic posts across crypto, stocks, forex, commodities, and indices, covering Blog, Technical, Fundamental, and Poll types.

## [1.4.77] - 2026-09-15

### Fixed

- Classified unlisted token mentions as Crypto when no more specific market category is available.

## [1.4.76] - 2026-09-15

### Fixed

- Unified Community market filtering and generated covers with fallback classification for posts whose tokens are not in the synced market list.

## [1.4.75] - 2026-09-15

### Added

- Generated filter-aware post covers with market, post type, post title, and active sort context.

## [1.4.74] - 2026-09-15

### Added

- Added highlighted Agree/Disagree vote buttons with selected states.
- Added separate Donate and Subscribe controls to Community post cards.

## [1.4.73] - 2026-09-15

### Added

- Added post hashtags, Agree/Disagree prediction voting, Follow alerts toggles, and influencer prediction precision indicators to Community feed cards.

## [1.4.72] - 2026-09-15

### Changed

- Matched reaction and engagement controls to the compact inline reference style.

## [1.4.71] - 2026-09-15

### Changed

- Adapted Community post cards to a compact, flat reference layout with smaller headers, type chips, media, and action controls.

## [1.4.70] - 2026-09-15

### Changed

- Added deterministic post-type covers and exact type filtering for Blog, Technical, Fundamental, and Poll feed views.

## [1.4.69] - 2026-09-15

### Changed

- Replaced the inline Community feed filter pills with compact click-to-open menus for Market, Post type, and Sort by.

## [1.4.68] - 2026-09-15

### Changed

- Compactified the Trending Posts filter controls to reduce toolbar width while preserving all filter options.

## [1.4.67] - 2026-09-15

### Fixed

- Moved the Post type and Sort by filter groups into the Trending Posts toolbar and removed them from the sidebar.

## [1.4.66] - 2026-09-15

### Changed

- Merged Post type and Sort by controls into the core Trending Posts toolbar and removed the duplicate sidebar controls.

## [1.4.65] - 2026-09-15

### Changed

- Moved the Community feed filters into the main sidebar filter group and removed duplicate toolbar selects.

## [1.4.64] - 2026-09-15

### Added

- Added Market, Post type, and Popular/By date controls to the Community Trending Posts feed.

## [1.4.63] - 2026-09-15

### Changed

- Updated the Community feed to use a two-column card layout on large screens while retaining the stacked mobile layout.

## [1.4.62] - 2026-09-15

### Reverted

- Reverted the latest Community positioning change at the user's request.

## [1.4.61] - 2026-09-15

### Fixed

- Kept the desktop Community card in normal grid flow so the Broker Rewards banner cannot overlap it.

## [1.4.60] - 2026-09-15

### Reverted

- Reverted the latest Trading Signals and Financial News positioning change at the user's request.

## [1.4.59] - 2026-09-15

### Fixed

- Removed the Trading Signals and Financial News overlay by placing both cards in normal right-column grid flow with Financial News below and separated by 16px.

## [1.4.58] - 2026-09-15

### Reverted

- Reverted the later large-monitor layout and positioning overrides to the pre-layout state while preserving the Trade via broker broker-directory feature.

## [1.4.57] - 2026-09-15

### Fixed

- Gave Trading Signals and Financial News separate columns on very-large screens so their cards cannot overlap or shift into an unintended second row.

## [1.4.56] - 2026-09-15

### Fixed

- Moved Financial News below Trading Signals from 1151px upward, preventing the two cards from occupying the same grid row.

## [1.4.55] - 2026-09-15

### Reverted

- Restored the large-monitor layout from before the recent four-column and intermediate-width positioning edits.

## [1.4.54] - 2026-09-15

### Changed

- Reworked very-large-monitor instrument layout into four explicit columns so Community, Analysis, Trading Signals, and Financial News share one aligned top row without overlap.

## [1.4.53] - 2026-09-15

### Fixed

- Fixed overlap at large-but-under-1600px monitor widths by switching side cards into explicit grid flow from 1151px upward.

## [1.4.52] - 2026-09-15

### Reverted

- Restored the previous large-monitor side-card layout rules before the latest explicit grid override.

## [1.4.51] - 2026-09-15

### Fixed

- Added explicit large-monitor grid placement and static positioning for every instrument side panel to eliminate stale absolute offsets and overlap.

## [1.4.50] - 2026-09-15

### Fixed

- Normalized all large-monitor side-card positioning by returning Community, Trading Signals, and Financial News to explicit grid flow.

## [1.4.49] - 2026-09-15

### Fixed

- Removed large-desktop overlap by placing Trading Signals and Financial News in separate flow rows with a small 16px gap.

## [1.4.48] - 2026-09-15

### Fixed

- Added extra large-desktop top spacing before Financial News to reduce overlap with the Trading Signal card.

## [1.4.47] - 2026-09-15

### Reverted

- Restored the previous large-desktop Trading Signal and Financial News positioning.

## [1.4.46] - 2026-09-15

### Fixed

- Prevented large-desktop Trading Signal and Financial News cards from overlapping by placing them in separate grid rows with a 16px gap.

## [1.4.45] - 2026-09-15

### Reverted

- Restored the quote-card action group to its original normal-flow position.

## [1.4.44] - 2026-09-15

### Changed

- Positioned quote-card actions in the lower-right corner on desktop.

## [1.4.43] - 2026-09-15

### Changed

- Positioned instrument Watchlist, Alert, and Trade via broker actions in the quote card's upper-right corner on desktop, with normal flow on mobile.

## [1.4.42] - 2026-09-15

### Changed

- Connected the instrument Trade via broker action to the sponsored-first broker directory with symbol-specific offer details.

## [1.4.41] - 2026-09-15

### Changed

- Rebalanced screener column widths after removing the Broker Campaign column.

## [1.4.40] - 2026-09-15

### Changed

- Removed the redundant Broker Campaign table header and empty column so screener columns rebalance naturally.

## [1.4.39] - 2026-09-15

### Changed

- Enabled Buy/Sell actions for non-promotional symbols while keeping benefit tags limited to promoted campaigns.

## [1.4.38] - 2026-09-15

### Changed

- Anchored broker campaign Buy/Sell offers beside the hovered symbol instead of leaving them in the campaign column.

## [1.4.37] - 2026-09-15

### Changed

- Moved screener broker campaign offers into a hover reveal so Buy/Sell and benefit tags appear when inspecting a symbol row.

## [1.4.36] - 2026-09-15

### Changed

- Level 4 access now removes signal-detail locks and exposes all trading-signal details.

## [1.4.35] - 2026-09-15

### Added

- Added a detailed Community signal view for scenario cards, including target, confidence, horizon, source summary, original-post access, and Connect & trade actions.

## [1.4.34] - 2026-09-15

### Added

- Added deterministic prototype signal-detail locks that open the existing Credit unlock dialog when selected.

## [1.4.33] - 2026-09-15

### Changed

- Varied screener campaign offers deterministically so rows can show zero, one, two, or three benefit tags.

## [1.4.32] - 2026-09-15

### Changed

- Replaced screener broker initials and broker-name labels with Special pricing, Extra cashback, and Bonus credit tags.

## [1.4.31] - 2026-09-15

### Added

- Added sponsored broker hover offers to Trading Signal Buy/Sell actions.

## [1.4.30] - 2026-09-15

### Changed

- Signal context tags now open the instrument Advanced Chart view directly.

## [1.4.29] - 2026-09-15

### Changed

- Anchored the final linked chart tag to the recent right edge of the instrument timeline.

## [1.4.28] - 2026-09-15

### Added

- Added chart-synced context tags to symbol-page Trading Signal cards.

## [1.4.27] - 2026-09-15

### Changed

- Trading Signal Buy actions now open the Products & Brokers tab automatically.

## [1.4.26] - 2026-09-15

### Changed

- Reduced symbol-page Trading Signals to two compact cards with asset logos and dashboard-style trade details.

## [1.4.25] - 2026-09-15

### Added

- Added three scrollable, dashboard-style Trading Signal entries to symbol pages.

## [1.4.24] - 2026-09-15

### Fixed

- Extended the very-large-desktop Community card to a 1200px height matching the main content panel.

## [1.4.23] - 2026-09-15

### Fixed

- Constrained the very-large-desktop Community card height to prevent overlap with the Broker Rewards banner.

## [1.4.22] - 2026-09-15

### Fixed

- Added large-monitor clearance above the Broker Rewards banner to prevent overlap.

## [1.4.21] - 2026-09-15

### Fixed

- Increased the very-large-desktop separation between Trading Signal and Financial News to match the main panel spacing.

## [1.4.20] - 2026-09-15

### Fixed

- Added wide-monitor spacing between the Trading Signal and Financial News cards.

## [1.4.19] - 2026-09-15

### Fixed

- Matched the quote/symbol card width to the responsive center analysis column.

## [1.4.18] - 2026-09-15

### Fixed

- Kept top-aligned side cards at the same fixed 300px width as the large-desktop instrument grid.

## [1.4.17] - 2026-09-15

### Changed

- Moved the desktop Community card to the top-left beside the quote/symbol panel.

## [1.4.16] - 2026-09-15

### Changed

- Swapped the desktop side-column positions so Community is on the left and Financial News is on the right.

## [1.4.15] - 2026-09-15

### Fixed

- Kept Financial News explicitly on the left and Community explicitly on the right of the instrument analysis layout.

## [1.4.14] - 2026-09-15

### Changed

- Moved the desktop Trading Signal card to the instrument quote panel's top-right level, with responsive flow retained on smaller screens.

## [1.4.13] - 2026-09-15

### Reverted

- Restored the previous spacing below the instrument quote panel.

## [1.4.12] - 2026-09-15

### Changed

- Removed the extra desktop gap below the quote panel so the instrument content fills the available top space.

## [1.4.11] - 2026-09-15

### Fixed

- Explicitly aligned the News and Trading Signal cards to the same top grid row beside instrument analysis.

## [1.4.10] - 2026-09-15

### Fixed

- Recovered invalid prototype reward storage automatically so root level selection and level-gated feature permissions remain usable.

## [1.4.9] - 2026-09-15

### Changed

- Removed the prototype reward-storage warning banner from the interface.
- Made root level selection replace the previous demo level and highlight the active level button.

## [1.3.5] - 2026-09-15

### Changed

- Added broker initials, instrument-specific campaign details, and Buy/Sell actions that prioritize sponsored broker rows.

## [1.3.4] - 2026-09-15

### Changed

- Tightened Screener table spacing and campaign-cell sizing so rows fit the campaign text without excessive horizontal gaps.

## [1.3.3] - 2026-09-15

### Fixed

- Moved the Screener broker campaign cells, not only the header, beside each instrument row.

## [1.3.2] - 2026-09-15

### Changed

- Moved the Screener broker campaign column beside the Instrument column.

## [1.3.1] - 2026-09-14

### Changed

- Reduced chart-only mode to the `market-chart-workspace` feature and removed its surrounding instrument analysis container.

## [1.3.0] - 2026-09-14

### Changed

- Added chart-only window styling for Advanced Chart links, hiding the surrounding application pages and features.

## [1.2.9] - 2026-09-14

### Fixed

- Added generated instrument data for missing Community symbols so every chart link opens a usable Advanced Chart target.

## [1.2.8] - 2026-09-14

### Fixed

- Connected Community post symbols such as ADA and BTC to their canonical instrument chart symbols so chart links no longer fall back to the wrong instrument.

## [1.2.7] - 2026-09-14

### Fixed

- Corrected Community **View chart** links to the actual Advanced Chart route: instrument mode with chart state enabled.

## [1.2.6] - 2026-09-14

### Reverted

- Restored the Community sentiment **View chart** action to open the linked chart workspace.

## [1.2.5] - 2026-09-14

### Changed

- Connected instrument Community actions directly to the matching Community idea context.

## [1.2.4] - 2026-09-14

### Changed

- Added a direct `view=chart` destination for Community post chart actions, avoiding the normal instrument-page route.

## [1.2.3] - 2026-09-14

### Added

- Added the instrument Community panel's **View chart** action to Community posts with a symbol mention.

## [1.2.2] - 2026-09-14

### Reverted

- Restored the instrument Community post action to its original **View chart** behavior.

## [1.2.1] - 2026-09-14

### Changed

- Changed instrument community post actions to open the related Community idea instead of incorrectly opening the instrument chart.

## [1.2.0] - 2026-09-14

### Changed

- Restricted Community post chart navigation to the image click itself; it now opens only a new Advanced Chart window.

## [1.1.9] - 2026-09-14

### Changed

- Community post images now open Advanced Chart in a new browser window.

## [1.1.8] - 2026-09-14

### Changed

- Made Community post images directly open the mentioned instrument's Advanced Chart workspace.

## [1.1.7] - 2026-09-14

### Changed

- Updated Community post visuals with an interactive chart action overlay that links mentioned instruments to their instrument workspace.

## [1.1.6] - 2026-09-14

### Changed

- Connected instrument Community sentiment actions to the full Community workspace instead of leaving discussion in demo-only mode.

## [1.1.5] - 2026-09-14

### Added

- Added canonical Forex, Commodities, and Indices demo rows to the Community market table, with five instruments per category.

## [1.1.4] - 2026-09-14

### Fixed

- Corrected community table asset categories to use each instrument's real market classification instead of cyclic placeholder categories.

## [1.1.3] - 2026-09-14

### Changed

- Expanded synced community market data into a randomized 15-row demo table across all asset categories.

## [1.1.2] - 2026-09-14

### Changed

- Synced the community market table with the shared instrument mock data source.

## [1.1.1] - 2026-09-14

### Added

- Added Stocks, Crypto, Forex, Commodities, and Indices filters to the community token table.

## [1.1.0] - 2026-09-14

### Added

- Added Trending, Top gain, and Top loser token tables with 1D, 1W, 1M, and 1Y filters.

## [1.0.9] - 2026-09-14

### Changed

- Replaced community feed tabs with Popular, AI, For You, and Following options.

## [1.0.8] - 2026-09-14

### Changed

- Changed the liquidation mini chart to show long and short bars on the same zero-centered timeline.

## [1.0.7] - 2026-09-14

### Changed

- Moved the market duration selector into the Market Pulse header.

## [1.0.6] - 2026-09-14

### Added

- Restyled market mini charts with duration controls for 1H through 1Y views.

## [1.0.5] - 2026-09-14

### Added

- Added date-range controls to Forecast.

## [1.0.4] - 2026-09-14

### Changed

- Added broker-specific campaign groups for each reward category.
- Reward popup windows now show different campaign counts, broker brands, and campaign details.

## [1.0.3] - 2026-09-14

### Reverted

- Restored the previous behavior where all broker rewards are enabled whenever a matching broker exists.

## [1.0.2] - 2026-09-14

### Changed

- Added per-offer eligibility so only supported broker promotions are enabled.

## [1.0.1] - 2026-09-14

### Fixed

- Broker offer cards now change their reward label, value, and explanation based on the selected promotion.

## [1.0.0] - 2026-09-14

### Changed

- Broker offer windows now carry instrument, product, and reward context into the broker directory.
- Broker directory headings and matching filters reflect the selected offer context.

## [0.99.0] - 2026-09-14

### Changed

- Restored the compact first-format reward buttons.
- Clicking an eligible reward now opens the broker offer window with the selected reward context.

## [0.98.0] - 2026-09-14

### Changed

- Matched broker promotion rewards to different eligible brokers instead of always selecting the first broker.
- Displayed the matched broker name directly in each promotion control.

## [0.97.0] - 2026-09-14

### Added

- Added related-community navigation and highlighting for financial reports.

## [0.96.0] - 2026-09-14

### Changed

- Removed the standalone Analysis tab from the instrument navigation.

## [0.95.0] - 2026-09-14

### Added

- Linked financial report documents to highlighted related news.
- Added document download action.

## [0.94.0] - 2026-09-14

### Added

- Added official release report cards, inline document viewing, related-news linking, and optional AI summary assistance to Financial Report.

## [0.93.0] - 2026-09-14

### Changed

- Removed the standalone Browse broker marketplace button from the Products & Brokers header.
- Kept broker marketplace navigation available through table rows and Connect actions.

## [0.92.0] - 2026-09-14

### Changed

- Made the broker comparison table fit its container without horizontal scrolling.
- Made broker table rows and actions navigate to the full broker marketplace.

## [0.91.0] - 2026-09-14

### Changed

- Linked Products & Brokers access to the full broker marketplace view.
- Added marketplace navigation to the section header and broker Connect actions.

## [0.90.0] - 2026-09-14

### Changed

- Added product categories to each Products & Brokers option.
- Included the selected category in broker comparison rows alongside existing broker information.

## [0.89.0] - 2026-09-14

### Changed

- Added compact broker logo marks beside sponsored scenario disclosures.

## [0.88.0] - 2026-09-14

### Added

- Added sponsored-by-broker labels to selected community scenario cards.
- Kept non-sponsored scenarios clearly unlabelled to distinguish organic community opinions.

## [0.87.0] - 2026-09-14

### Added

- Added Connect & trade actions to community scenario cards.
- Added AI signal-confidence evaluation actions that clearly require a credit unlock.

## [0.86.0] - 2026-09-14

### Changed

- Linked seasonal performance markers with community context tags and posts.
- Added synchronized navigation between the seasonal chart and community context.

## [0.85.0] - 2026-09-14

### Changed

- Linked chart context markers to their matching community posts.
- Added focus behavior when selecting a community post body.

## [0.84.0] - 2026-09-14

### Added

- Added date-range filtering to the Technicals tab, defaulting to the current period.
- Added oscillator and moving-average detail tables to the technical summary.

## [0.83.0] - 2026-09-14

### Changed

- Renamed chart Event intelligence to Real-time AI signal enhancement.
- Clarified that precision evaluation requires a credit unlock.

## [0.82.0] - 2026-09-14

### Changed

- Linked the chart Compare control to the Watchlist sidebar.
- Linked the chart Alert control to the Alerts sidebar.

## [0.81.0] - 2026-09-14

### Fixed

- Imported the React effect hook required by the chart workspace, preventing the Advanced chart view from blanking the page.

## [0.80.0] - 2026-09-14

### Fixed

- Made the primary Advanced chart action explicitly open the chart instead of toggling it closed.

## [0.79.0] - 2026-09-14

### Changed

- Linked community follow-alert actions to the chart workspace Alerts tab.
- Linked community chart actions to the Signals tab and Community Signal filter.

## [0.78.0] - 2026-09-14

### Changed

- Linked followed-user alert filtering to the actual community profile name.
- Added personal AI Tracking defaults to the AI Tracking sidebar panel.

## [0.77.0] - 2026-09-14

### Changed

- Compressed broker promotions into same-line highlighted reward buttons with full offer details available on hover.

## [0.76.0] - 2026-09-14

### Changed

- Restored the spacious two-column promotion-card layout and added hover descriptions for offer details.

## [0.75.0] - 2026-09-14

### Changed

- Compact broker promotion actions into small highlighted offer buttons aligned to the right side of the promotion panel.

## [0.74.0] - 2026-09-14

### Changed

- Replaced the advanced-chart promotion call-to-action with symbol- and product-linked broker offers for points, cashback, credits, and free features.

## [0.73.0] - 2026-09-14

### Changed

- Removed the inline sidebar hide button and chart layout selector.
- Reframed the Data tab as AI Tracking.
- Added followed-user alert filtering and Platform Signal / Community Signal filtering.

## [0.72.0] - 2026-09-14

### Changed

- Removed the Community tab from the chart sidebar and replaced chart sharing with a hide/show sidebar control.
- Added gainers/losers filtering to the watchlist while preserving synchronized comparison overlays.

## [0.71.0] - 2026-09-14

### Added

- Synchronized followed community publishers with the Advanced Chart Alerts sidebar.
- Added a hide/show control for the Advanced Chart right sidebar.
- Added watchlist-driven comparison lines on the active chart timeline.

### Changed

- Removed the comment composer and reply affordance from the Advanced Chart community sidebar.

## [0.70.0] - 2026-09-14

### Added

- Added publisher alert following on community posts with synchronized alert badges on matching Advanced Chart markers.

## [0.69.1] - 2026-09-14

### Added

- Added expandable community comment threads with existing replies and immediate display of newly posted comments.

## [0.69.0] - 2026-09-14

### Added

- Added community-vote colors to chart markers, inline post comments, and direct broker connections from prediction posts.

## [0.68.0] - 2026-09-14

### Changed

- Connected community View chart actions to their highlighted Advanced Chart markers and positioned prediction tags along related price points.

## [0.67.1] - 2026-09-14

### Changed

- Updated community prediction votes with a proportional green Long and red Short split indicator and matching vote colors.

## [0.67.0] - 2026-09-14

### Added

- Added Agree and Disagree voting, live percentages, voter totals, and community Long/Short vote labels to prediction posts.

## [0.66.1] - 2026-09-14

### Changed

- Removed the legacy event-intelligence markers from the Advanced Chart plot to avoid duplicating linked context markers.

## [0.66.0] - 2026-09-14

### Changed

- Moved linked context markers into the Advanced Chart plot and removed the separate timeline strip.

## [0.65.1] - 2026-09-14
### Changed
- Changed chart tag markers to open a News or Community destination chooser before navigating.

## [0.65.0] - 2026-09-14
### Added
- Synchronized linked-tag visibility and News/Community timeline navigation between Performance and Advanced Chart.

## [0.64.2] - 2026-09-14
### Changed
- Moved the Linked tags checkbox to the Performance panel footer and strengthened News and chart destination highlighting.

## [0.64.1] - 2026-09-14
### Added
- Added a Linked tags visibility checkbox and separate News and Community destinations on chart timeline markers.

## [0.64.0] - 2026-09-14
### Added
- Added linked instrument-context hashtags across news, community prediction posts, and performance-chart timeline markers.

## [0.63.2] - 2026-09-14
### Added
- Expanded Forecast to five synchronized community scenarios and matching prediction posts.

## [0.63.1] - 2026-09-14
### Added
- Added a top-of-Forecast scenario chart whose contributor paths scroll to and highlight matching community prediction posts.

## [0.63.0] - 2026-09-14
### Added
- Added contributor-authored scenario summaries to Forecast with smooth-scroll links and temporary highlighting for the original community posts.

## [0.62.0] - 2026-09-14
### Added
- Added an interactive Financial Report visualization with annual/quarterly views, growth charts, profitability trends, valuation ratios, and financial-health indicators.

## [0.61.1] - 2026-09-14
### Added
- Added demo broker coverage for NVDA products and hover/focus detail cards for products and broker rows.

## [0.61.0] - 2026-09-14
### Changed
- Merged the separate Products and Brokers instrument tabs into one product-filtered broker comparison table.

## [0.60.3] - 2026-09-14
### Changed
- Consolidated the duplicate price interval and comparison selectors into one synchronized chart-range control.

## [0.60.2] - 2026-09-14
### Changed
- Consolidated instrument news filters and article details into the Latest News sidebar.

### Removed
- Removed the duplicate News workspace tab and its redundant "View all" navigation.

## [0.60.1] - 2026-09-14
### Added
- Connected community "View chart" actions to the inline Advanced Chart with the selected contributor's shared setup and annotations.

## [0.60.0] - 2026-09-14
### Added
- Added an inline Performance / Advanced chart toggle to the instrument workspace using the integrated technical chart.

### Removed
- Removed the separate "Open advanced chart workspace" link below the performance metrics.

## [0.59.2] - 2026-09-14
### Changed
- Moved the instrument section navigation into the Performance workspace while keeping it available across every instrument tab.

## [0.59.1] - 2026-09-11
### Changed
- Synced the preferred Instrument detail page and styling from `codex/integrate-market-intelligence`.

## [0.59.0] - 2026-09-11
### Changed
- Removed the multi-period filter strip, relabeled the remaining values as 24-hour data, and moved the compact market snapshot into the price area.

## [0.58.0] - 2026-09-11
### Changed
- Replaced the tall market-period card grid with compact adaptive range filters.

## [0.57.0] - 2026-09-11
### Changed
- Added an in-place market range filter with selected-period highlighting and change details.

## [0.56.0] - 2026-09-11
### Added
- Added dated 24-hour OHLC, absolute and percentage changes, volume change, and multi-period market data beneath the instrument identity.

## [0.55.0] - 2026-09-11
### Changed
- Removed the duplicate full Technical Summary from the Technicals workspace, keeping the compact summary in the price area and the detailed signal methods in Technicals.

## [0.54.0] - 2026-09-11
### Added
- Added a compact Technical Summary with oscillator, moving-average, and overall gauges to the instrument price area.

## [0.53.0] - 2026-09-11
### Changed
- Removed the Technical Summary and Technical Signal panels from Overview; they now appear only under Technicals.

## [0.52.0] - 2026-09-11
### Added
- Added five dated technical signal methods covering trend, RSI momentum, relative volume, volatility, and support/resistance.

## [0.51.0] - 2026-09-11
### Added
- Added a second dynamic Technical signal card with description, confidence, direction, and participation summary.

## [0.50.0] - 2026-09-11
### Changed
- Kept Instrument section navigation visible while switching between all analysis tabs.

## [0.49.0] - 2026-09-11
### Changed
- Moved Instrument section navigation into the Performance analysis panel.

## [0.48.0] - 2026-09-11
### Changed
- Removed the duplicate News tab from Instrument navigation because news is already presented in the side panel.

## [0.47.0] - 2026-09-11
### Changed
- Removed the redundant Sponsored example card from the market workspace.
- Kept broker comparison and partner incentives in the dedicated results-area campaign section.

## [0.46.0] - 2026-09-11
### Added
- Added a broker comparison panel below the market results area.
- Added a highlighted partner campaign showing Credit, Point, and cashback incentives.

## [0.45.0] - 2026-09-11
### Changed
- Highlighted Guided comparison as Today’s quest with its +50 Credit reward and daily UTC availability deadline.

## [0.44.0] - 2026-09-11
### Changed
- Removed the duplicate Market Scanner entry from the mobile navigation drawer.

## [0.43.0] - 2026-09-11
### Changed
- Renamed the screener heading to Instrument Analysis and aligned its description with the market highlight data.
- Removed the redundant Market tools navigation bar.

## [0.42.0] - 2026-09-11
### Changed
- Removed the redundant secondary sentiment percentage from Market pulse cards.

## [0.41.0] - 2026-09-11
### Added
- Added market-specific 24-hour highlight metrics for market-size and volume changes.
- Each highlight shows both percentage and absolute value movement.

## [0.40.0] - 2026-09-11
### Added
- Added market-specific derivatives snapshots to each Market pulse card.
- Included liquidation totals, long/short split, activity bars, open interest, and volume changes.

## [0.39.0] - 2026-09-11
### Added
- Added a compact Fear & Greed gauge with score and sentiment label to every Market pulse card.

## [0.38.0] - 2026-09-11
### Changed
- Removed the duplicated Market rewards header, event/tool grid, and expiry strip from the page.
- Quest and tool discovery now lives in the header Quest of the day icon.

## [0.37.0] - 2026-09-11
### Changed
- Replaced the subtle Quests/Tools segmented buttons with an explicit Available tools on/off switch.
- Added accessible switch semantics and a visible sliding thumb.

## [0.36.0] - 2026-09-11
### Changed
- Added a Quests/Tools toggle to the Quest of the day panel.
- Added game-style available-tool cards with Credit pricing and duration messaging.

## [0.35.0] - 2026-09-11
### Changed
- Added a game-style Quest of the day icon beside the user profile controls.
- Added a compact quest panel with Credit rewards, difficulty, cadence, and Start actions.

## [0.34.0] - 2026-09-11
### Changed
- Connected symbol campaigns to the broker directory, selecting eligible brokers and campaign types from spread and cashback details.
- Renamed the screener column to Broker campaign · Connect.

## [0.33.0] - 2026-09-11
### Changed
- Limited partner campaigns to eligible symbols instead of displaying one offer for every pair.
- Added distinct spread and cashback campaign messaging by symbol.

## [0.32.0] - 2026-09-11
### Changed
- Made the screener table's sponsored partner column explicit with broker name and direct Connect broker action.

## [0.31.0] - 2026-09-11
### Changed
- Moved partner offers out of the rewards panel and into symbol-level market research surfaces.
- Added partner access and special cashback highlights to table results, heatmap tiles/tooltips, scatter tooltips, and correlation research.

## [0.30.0] - 2026-09-11
### Changed
- Added Credit/level-gated high-precision signal visibility above 50% confidence.
- Added ±60% high-significance correlation gating through the High-precision signals entitlement.
- Added one-hour, one-day, and seven-day unlock support through the existing Credit unlock dialog.

## [0.29.0] - 2026-09-11
### Changed
- Moved the live Credits, Points, and level summary into the compact global quest strip.
- Reduced duplication in the Market rewards panel header.

## [0.28.0] - 2026-09-11
### Changed
- Added a bottom-right hide/show control for the Market rewards panel.

## [0.27.0] - 2026-09-11
### Changed
- Added formula-aligned credit event cards for daily, research, broker comparison, and risk-control activities.
- Added horizontal sliders for recommended events and available tool unlocks.

## [0.26.0] - 2026-09-11
### Changed
- Moved Market, Sector, Sub-sector, and visualization controls above the Filter logic panel.

## [0.25.0] - 2026-09-11
### Changed
- Removed the default Market custom-filter chip so Market and Sector are controlled only through the dedicated selectors.

## [0.24.0] - 2026-09-11
### Changed
- Added partner logos and per-broker spread, leverage, and cashback offers to the market rewards strip.

## [0.23.0] - 2026-09-11
### Changed
- Renamed the screener comparison panel to “Market × Sector comparison”.

## [0.22.0] - 2026-09-11
### Changed
- Removed the multiplication symbol from screener relative-volume table values while retaining two-decimal precision.

## [0.21.0] - 2026-09-11
### Changed
- Reworked the market rewards strip into recommended quests, feature unlocks, and a Credits/Points eligibility toggle.
- Added a sponsored broker and CFD-pair cashback offer entry point.

## [0.20.0] - 2026-09-11
### Changed
- Standardized screener relative-volume values to two decimal places.

## [0.19.0] - 2026-09-11
### Changed
- Removed demo and simulated-data language from the active product interface.
- Updated broker, market-data, reward, and research surfaces to use production-facing terminology.

## [0.18.0] - 2026-09-11
### Changed
- Replaced the large global beta disclaimer banner with a compact Daily check-in quest bar.
- Kept demo limitations visible as concise supporting text beside the quest action.

## [0.17.0] - 2026-09-11
### Changed
- Renamed the primary CFD Market Scanner surface to Market Scanner.
- Removed the default NVDA instrument label from the scanner navigation.
- Instrument and chart navigation now appear only after a user selects a symbol.
- Symbol-free scanner sessions use a neutral placeholder internally without presenting a default instrument.

## [0.16.0] - 2026-09-11
### Changed
- Moved the Simple chart / Advanced chart toggle into the Instrument Performance card.
- Advanced chart mode now replaces the simple chart in the same content area.
- Removed the separate Instrument-page chart CTA and workspace-level chart toggle.

## [0.15.0] - 2026-09-11
### Changed
- Merged Advanced Chart into Instrument Overview behind an Overview / Advanced chart toggle.
- Removed Advanced Chart from market navigation and redirected legacy chart links to integrated chart mode.
- Preserved chart tools, indicators, watchlist, alerts, signal inspection, and risk-planning journeys in the merged workspace.

## [0.14.0] - 2026-09-11
### Changed
- Replaced the large 3D volume-flow panel with a compact 2D market/sector comparison.
- The comparison now follows the active Screener market and sector filters and keeps period/scope controls.
- Reduced vertical spacing in the highlights comparison area to keep the scanner content visible sooner.

## [0.13.0] - 2026-09-11
### Changed
- Merged Market Explorer highlights, market pulse cards, and volume-flow context into the CFD Market Scanner.
- Removed Market Explorer from navigation and route discovery; legacy `?view=explorer` links redirect to `?view=screener`.
- Renamed the primary market workspace to CFD Market Scanner and kept research, chart, instrument, and broker journeys connected.

## [0.12.0] - 2026-09-11
### Added
- Shared, browser-persisted beta reward ledger with four membership levels at 0 / 100 / 300 / 700 rolling 90-day Points.
- Guided market research quests, capped daily/weekly Credit rewards, a monthly D6 milestone and feature-scoped temporary research access.
- Contextual sponsored examples and broker-access journeys across Explorer, Screener, Instrument and Chart; illustrative Point boost estimates never award trading Points.
### Changed
- Retained 5 Credits = 1 Point conversion by product decision, with exact amounts, balance validation and 90-day Point expiry.
- Unified rewards, plans, guides, header/dashboard progression and activity history; removed click-to-mint and duplicate award paths.
- Broker connection now uses demo identifiers without passwords, simulated verification or automatic rewards.
### Notes
- All accounts, campaign offers, market data and rewards remain a local prototype. Production requires authoritative verification, server-side ledgers/entitlements, moderation, partner agreements and campaign eligibility controls.
- Credit pricing uses integer rounding of the formula; document catalogue examples are approximate, not a separate pricing schedule.

## [0.11.0] - 2026-09-10
### Added
- Integrated Market Explorer, Market Screener, Instrument Overview, and Advanced Chart from the trading-intelligence prototype.
- Desktop Trade menu and mobile navigation entries, shareable `?view=`/`symbol=` links, and browser back/forward support.
- Lazy-loaded market module with scoped component styles, mock market datasets, chart tools, indicators, and TradingView adapter.
- Preserved the main project's dashboard, broker directory, rewards, community, theme, and account header.
### Notes
- Market data and alerts remain demo features. Licensed TradingView Charting Library assets and live data are not bundled.
- The module maps existing member tiers to market feature tiers. No accounts, credentials, or user data are migrated.

All notable changes to this project will be documented in this file.

## [0.5.0] - 2026-09-09
### Added
- **Exact Search Results Command Palette View (Precise match to latest `image.png`)**:
  - **Category Tabs Navigation**:
    - `All`: Active tab with purple indicator underline (`#5945F1`).
    - `Trading Signals`: Purple badge with `99+`.
    - `Trading Calculators`: Purple badge with `11`.
    - `Converter Calculators`: Purple badge with `11`.
    - `Brokers List`: Purple badge with `25`.
    - `Broker Comparison`: Smooth interactive tab.
  - **Top Search Bar**:
    - Full width pill container with purple outline (`border-[#5945F1]`), magnifying search icon, and live typed query display (`Signal`).
  - **Section 1: Trading Signals (Positioned at Top)**:
    - `EUR/USD`: EU & US round flag badges, `BUY (Long Term)` (`#84CC16`), `70%` confidence (`#5945F1`), `Current Price: 1.0690` / `Target Priced: 1.0696`, and `▲ 20 - 29PIPS` expected move.
    - `GOOGL`: Authentic 4-color Google G emblem, `SELL (Intraday)` (`#4F46E5`), `74%` confidence (`#5945F1`), `Current Price: 1.0690` / `Target Priced: 1.0696`, and `▼ 25 - 40 PIPS` expected move.
    - `BTC/USD`: Orange Bitcoin coin emblem, `Premium Signal` indicator with diamond & info icons, level unlock notice ("Higher levels only. Connect broker and trade to unlock."), and direct `Plans` button.
    - `S&P 500`: Red circular `500` index badge, `BUY (Long Term)` (`#84CC16`), `71%` confidence (`#5945F1`), and `▲ 20 - 29PIPS` expected move.
    - `XAU/USD`: Gold bullion bars emblem, `SELL (Intraday)` (`#4F46E5`), `73%` confidence (`#5945F1`), and `▼ 25 - 40 PIPS` expected move.
    - Interactive `More ›` link leading to the signals page.
  - **Section 2: Trusted Broker Network**:
    - **HFM**: `Max Cashback: $8.00`, fuchsia `Top Pick` pill, and `Tier 1 Regulated` pill.
    - **Exness**: Canary yellow `ex` insignia, `Max Cashback: $8.00`, and `Tier 1 Regulated` pill.
    - **XM**: Black emblem with red accent & `XM` insignia, `Max Cashback: $8.00`, and `Regulated` pill.
    - Interactive `More ›` link leading to brokers directory.
  - **Header Direct Search Integration**:
    - Header search box allows direct typing and focus to open the command palette immediately.

## [0.4.0] - 2026-09-09
### Added
- **Command Palette & Search Modal (Exact match to `image.png` design)**:
  - **Search Activation**:
    - Clicking the search bar in the desktop header, tapping the search icon on mobile, or pressing `Cmd+K` / `Ctrl+K` opens the search modal.
    - Backdrop blur overlay (`backdrop-blur-md bg-slate-900/40`) with auto-focused search input container.
    - Search input matches reference design with purple outline (`#5945F1`), `Search...` placeholder, and `ESC` badge / clear icon.
  - **Section 1: Trusted Broker Network**:
    - Header with title and interactive `More ›` link navigating to the brokers directory.
    - 3 institutional broker cards:
      - **HFM**: Black emblem with `HFM` & `HF MARKETS` typography, `Max Cashback: $8.00`, `Top Pick` fuchsia badge, and `Tier 1 Regulated` badge.
      - **Exness**: Canary yellow emblem with signature bold `ex` insignia, `Max Cashback: $8.00`, and `Tier 1 Regulated` badge.
      - **XM**: Black emblem with red corner accent & bold `XM` insignia, `Max Cashback: $8.00`, and `Regulated` badge.
      - Clicking any broker card opens the connection modal.
  - **Section 2: Trading Signals**:
    - Header with title and interactive `More ›` link navigating to the signals page.
    - 5 institutional signal rows matching reference columns:
      - **EUR/USD**: EU/US flag badges, `BUY (Long Term)` in lime green (`#84CC16`), `70%` confidence rate in purple (`#5945F1`), `Current Price: 1.0690` / `Target Priced: 1.0696`, and `▲ 20 - 29PIPS` expected move.
      - **GOOGL**: Google four-color emblem, `SELL (Intraday)` in indigo (`#4F46E5`), `74%` confidence rate, and `▼ 25 - 40 PIPS` expected move.
      - **BTC/USD (Premium Signal)**: Bitcoin orange coin emblem, `Premium Signal` indicator with gem & info icons, locked status text ("Higher levels only. Connect broker and trade to unlock."), and direct `Plans` upgrade button.
      - **S&P 500**: Red index emblem, `BUY (Long Term)` in lime green (`#84CC16`), `71%` confidence rate, and `▲ 20 - 29PIPS` expected move.
      - **XAU/USD**: Gold coin bullion emblem, `SELL (Intraday)` in indigo (`#4F46E5`), `73%` confidence rate, and `▼ 25 - 40 PIPS` expected move.
      - Clicking any signal row opens the detailed institutional signal modal.
  - **Section 3: Spotlight Picks**:
    - Header with info tooltip icon.
    - 2 Canary-yellow (`#FFDE43`) promotional interactive banners:
      - **Banner 1**: Custom illustrated welcome card graphic with comic lettering, "Looking for an attractive banner to draw the subscriber's attention?", and black pill `ORDER NOW` button.
      - **Banner 2**: Custom illustrated interactive coupon window with character gesture, "Looking for a fun way to reveal your offers?", and "Go interactive with the Flip or Scratch effect!" subtitle.


## [0.3.0] - 2026-09-09
### Added
- **Precise User Dashboard Redesign (Matching `Dashboard; Desktop.png` exactly)**:
  - **Header Greeting & Customization**:
    - Two-tone display heading: `Oh look, you're ` in brand purple (`#5945F1`) and `back!` in vibrant magenta (`#FD02B0`).
    - Subtitle: "The market kept moving. Good thing you did too."
    - Top-right edit pencil button in rounded-xl container for trader greeting personalization.
  - **Top Row Bento Cards**:
    - **Card 1 (Ready to Trade)**:
      - Subtle pink/fuchsia border (`border-[#f0abfc]`), dual-tone title ("Ready" in `#5945F1`, "to Trade" in `#FD02B0`), and "Account connected and ready for trading." subtitle.
      - "Connected Accounts" tag pill + quick action links (`+ Add More Accounts ,` and `🔍 Explore Brokers`).
      - 3 interactive broker account status cards:
        - **HFM**: Premium account (`1100045789`), `Pending Approval` amber badge, dual-color progress bar, `Takes 2–3 days`.
        - **XM**: Ultra Low account (`1100098765`), `Pending Approval` amber badge, dual-color progress bar, `Takes 2–3 days`.
        - **FxPro**: Raw+ account (`1100034521`), `Approved` emerald badge, and full-width `Trade Now` action button triggering trade modal.
      - Bottom carousel pagination controls (`< • • • >`).
    - **Card 2 (Rookie Rank)**:
      - Royal purple card (`bg-[#5945F1]`) with custom Rookie Ghost SVG icon.
      - Dual-tone progress bar with magenta fill (`#FD02B0`), `50/150 points.` with gem icon, and volt-lime accent text `Don't Stop Now` (`#CAEB0E`).
      - Bottom perks: `Next level at 50 Points`, `+10% Cashback Boost`, and `Higher Confidence Signals`.
      - Interactive pill button `View Plan` opening the rank progression modal.
    - **Card 3 (You're Connected. Nice!)**:
      - Floating magenta milestone pill on top-right border: `● Next Milestone`.
      - Blue Exness badge with white stylized 'X' logo, "You're Connected. Nice!" heading, and "Start trading to get cashback" subtitle.
      - Dedicated `Trade Now` button triggering immediate trade flow and reward modal.
      - Bottom pagination controls.
  - **Lower Left Section: "Your Stats: March 2026"**:
    - Header with date subtitle, timeframe pills (`1D`, `1W`, `1M` with volt-lime active highlight, `All`), and calendar/grid toggles.
    - 3 metric blocks:
      - **ACTIVE STREAK**: 3D purple calendar tile with green checkmark, `12 days` bold display, subtitle, and 2-row green/volt-lime consistency heatmap.
      - **CUMULATIVE CASHBACK**: 3D blue circle coin and receipt icon, `$3,128.00` bold display, `163.6 Lots`, and smooth neon-lime wave chart filling the base.
      - **TOP 3 PERFORMERS**: Dropdown selector (`Earning Assets ⌄`), custom SVG 3-segment donut ring (Gold, Indigo, Magenta), and asset breakdown with icons:
        - 🪙 `XAU/USD` — `$1,150.00`
        - 🇬🇧 `Dow Jones` — `$1,035.00`
        - 🇦🇺 `AUDUSD` — `$943.00`
    - Secondary 4-column metric row: `Total Cashback (1M)`, `Lots Traded`, `Avg Cashback / Lot`, `Best Day`.
    - 4-tier horizontal dashed chart grid lines (`$100` to `10 lots`, `$90` to `9 lots`, `$80` to `8 lots`, `$70` to `7 lots`).
  - **Lower Right Section (Stacked Cards)**:
    - **Card A (Your Winning Signals.)**:
      - Header with purple highlight and `All Signals >` link.
      - 2x2 grid of white signal cards:
        - 🇪🇺 EUR/USD with green sparkline and `+0.33%`.
        - 🇬🇧 Dow Jones with purple sparkline and `-0.11%`.
        - 🇦🇺 AUDUSD with green sparkline and `+0.44%`.
        - ₿ BTC/USD with vibrant magenta callout: `Your next win?`.
    - **Card B (Tops Earning Points.)**:
      - Magenta border card with "No extra effort required." copy.
      - List of 4 earning assets with purple diamond icons:
        - 🇪🇺 EUR/USD → 💎 50
        - 🇬 GOOGL → 💎 35
        - 🪙 XAU/USD → 💎 20
        - 500 S&P 500 → 💎 20
      - Full-width `View More →` button navigating to Points & Credits center.

## [0.2.7] - 2026-09-09
### Added
- **Earning Reward Modals Full Flow Integration (Matching User Reference Designs Precisely)**:
  - **Earning - Modal of Quest Complete (+5 Credits)**:
    - 3D open purple gift box with neon volt-lime flaps, metallic silver and indigo coins bursting upward, and floating MarketSyde 3D sphere with white swirl `m`.
    - **`Yay!`** display heading in brand magenta (`#FD02B0`).
    - Exact copy: "You earned <span class="text-[#FD02B0] font-bold">5 credits</span> for login in today. Way to go!"
    - Primary full-width **`Nice!`** action button in `#5945F1`.
    - Auto-triggered upon claiming daily login streaks, Syde Credits daily bonus, and interactive demo triggers.
  - **Earning - Modal of Mission Complete (+5 Credits & Points)**:
    - 3D purple sphere with perched neon volt-lime crown, jewel studs, and flowing folded magenta ribbon.
    - Two-tone display heading: **`Mission `** in `#5945F1` and **`Complete!`** in `#FD02B0`.
    - Exact copy: "Wow, look at you go. <span class="text-[#FD02B0] font-bold">5 credits</span> are now in your balance!"
    - Full-width **`Nice!`** action button in `#5945F1`.
    - Auto-triggered when completing mission tasks (e.g. Portfolio Power-up, Market Watch, 7-day Explorer).
  - **Earning - Modal of Completing a Trade (+20 Points & +10 Credits)**:
    - 3D cylinder bar chart with ascending magenta arrow, lilac/lime multi-faceted gemstone, and 3D MarketSyde sphere.
    - Two-tone display heading: **`Look who's `** in `#5945F1` and **`active!`** in `#FD02B0`.
    - Exact copy: "Trading with your broker just got you <span class="text-[#5945F1] font-bold">20 Points</span> and <span class="text-[#FD02B0] font-bold">10 Credits</span>."
    - Full-width **`Nice!`** action button in `#5945F1`.
    - Auto-triggered when linking an account, executing/simulating trades from broker cards, or executing micro-lot simulations.
  - **Interactive Preview & Testing Controls**:
    - Added one-click preview bars on both the **Broker List** page (matching the exact background of the reference screenshots) and the **Mission, Points & Credits** page.
    - Added "Claim Daily +5 Cr" quick-action directly within the Syde Credits balance card.
    - Added "Trade & Earn (+20 Pts, +10 Cr)" directly on connected broker cards.

## [0.2.6] - 2026-09-09
### Added
- **Figma Design Tokens Alignment (Light & Dark Modes)**:
  - Exported and integrated full Figma design token palette into `/src/theme/tokens.ts` and Tailwind CSS v4 `@theme` configuration:
    - **Primary Brand Purple (`prime`)**: Complete scale from `0` (`#FFFFFF`) to `1000` (`#090119`), with core brand color `prime-500` (`#5945F1`), subtle cards `prime-100` (`#ECEEFA`), and background `prime-10` (`#FBFBFF`).
    - **Secondary Volt-Lime (`secon`)**: `secon-500` (`#CAEB0E`), accents `secon-200` (`#F0FCB1`), `secon-300` (`#E6FA76`), `secon-400` (`#DCF73B`).
    - **Tertiary Magenta Hot-Pink (`tert`)**: `tert-500` (`#FD02B0`), `tert-100` (`#FFD6F3`), `tert-200` (`#FE9AE1`), `tert-400` (`#FD35C2`).
    - **Neutrals & Slates (`neut`, `silver`)**: `neut-0` to `neut-1000`, `silver-0` to `silver-1000`, with brand silver `silver-200` (`#E2E8F0`).
    - **Status (`stat`)**: `success` (`#16A34A`), `warning` (`#D97706`), `destructive` (`#E03434`), `info` (`#0284C7`).
  - **Dynamic Theme CSS Variables**:
    - Added surface, border, and text token variables (`--bg-app`, `--bg-card`, `--border-default`, `--border-card`, `--text-primary`, `--text-secondary`).
    - Synchronized document `dark` class toggling with Header theme switcher.

## [0.2.5] - 2026-09-09
### Added
- **Activity Logs Dedicated View (Precise Match to Reference Design)**:
  - **Header & Visual Artwork**:
    - Dual-tone title: `Activity ` in `#5945F1` and `Logs` in `#FE01B1`.
    - Subtitle: "A complete record of every point you’ve earned and credit you’ve spent."
    - Top-right 3D vector art: Faint dotted lavender orbit ring with small indigo sphere and large magenta-to-indigo gradient sphere with soft drop-shadow.
  - **Filter & Date Bar**:
    - Left: `Result: Past 7 Days` dynamic status tag.
    - Right: Purple funnel filter button (`#5945F1`), white calendar button with purple border, and interactive popover matching reference with `Category` (All, Trades & Rebates, Missions, Daily Check-in, Expirations, Conversions), `Movement` (All, In (+), Out (-), Points Only, Credits Only), and `Done` action button.
    - Interactive Date Range selector with options (`Past 7 Days`, `Past 30 Days`, `This Month`, `All Time`).
  - **Summary Metrics (3 Cards)**:
    - **Activities this week**: 3D faceted star with upward arrow graphic, `24` value in deep navy display font.
    - **Points this week**: 3D multi-faceted colored gemstone, `+29` value in `#5945F1`.
    - **Credits this week**: 3D stacked dual-layer coins with lime rim, `+35` value in `#5945F1`.
  - **Activity Log Accordion Groups**:
    - **Today – Apr 26, 2026**: Lavender header bar (`#edf0fe`), `-15 Points` summary, `—` toggle, and detailed rows:
      - `Points expired` with pink stopwatch icon and `-25` points.
      - `Completed first trade` with trophy icon, `+10` points, `+35` credits.
      - `Daily login` with lime sparkle icon, `+5` credits.
      - `Viewed today's Signals` with lime sparkle icon, `+5` credits.
    - **Yesterday – Apr 25, 2026**: Lavender header bar, `+25 Points` & `+35 Credits` summaries, expandable list.
    - **Earlier – Apr 23, 2026**: Lavender header bar, `+115 Points` & `-475 Credits` summaries.
  - **Navigation Integration**:
    - Seamless jump from the sidebar Activity Log widget in Mission, Points & Credits.
    - Added "Activity Logs" shortcut inside the Header Profile dropdown menu.
    - "Back to Mission, Points & Credits" navigation bar.
    - "Open Full Page" quick-action from the Activity Log modal.

## [0.2.4] - 2026-09-09
### Added
- **Unified 2-Column Layout & Sidebar Exact Match**:
  - Aligned page architecture so the top 3 cards (Your Tier, Syde Credits, and Unlock Conversion) sit within the 8-column primary container on the left, running alongside the 4-column sidebar on the right.
  - **Hero Heading**: Updated to exact typography: `Mission, Points & Credits.` (`Mission, Points ` in `#5945F1`, `& Credits` in `#FE01B1`, and `.` in volt-lime `#c6f831`) with subtitle `Everything you’ve earned so far, plus what you’re currently missing out on.`
  - **Top Card 2**: Updated action button to `How to Earn >`.
  - **Top Card 3 (Unlock Conversion)**: Added 3D faceted diamond and coin icon with curved exchange arrow (`UnlockConversionIcon`), copy "Earn more credits or points to unlock conversion.", and `Learn More` action button (with instant toggle to converter when desired).
  - **Sidebar Widget 2 (Tops Earning Points)**: Outlined with crisp hot-pink border (`border-[#FE01B1]`), cleanly spaced asset rows (`EUR/USD`, `GOOGL`, `XAU/USD`, `S&P 500`), and centered solid purple `View More →` button (`bg-[#5945F1]`).
  - **Sidebar Widget 3 (Most Recent Signals)**: Framed with light gray container (`bg-[#f4f5f8]`), header with `Signals.` accent, `More >` button, and 2x2 grid featuring mini sparkline charts and BTC/USD 💎 Premium badge.

## [0.2.3] - 2026-09-09
### Added
- **Mission Tab & Component Redesign (Precise Design Match)**:
  - **Filter Tabs**: Added pill active tab styling with lavender border, purple text (`#5945F1`), and circular count badge (`3` on All Missions, `2` on Active, `1` on New).
  - **Card 1 (Portfolio Power-Up)**:
    - Full-bleed rich royal purple canvas (`bg-[#5338ec]`) with custom 3D candlestick chart badge with fluorescent volt-lime zigzag trendline.
    - Glassmorphism badge tags (`Expires in 5 Days`, `+15 Points`, `+25 Credits`).
    - Right-aligned progress capsule (`1/3 Completed`) and square toggle button (`−` / `+`).
    - Nested high-contrast white card for active subtasks with custom action buttons (`Add Asset`, `Set Position`) and completed state with emerald checkmark badge (`Rebalance Your Holdings`).
  - **Card 2 (Market Watch)**:
    - Clean white card with dual-color title (`Market` in `#5945F1`, `Watch` in `#FE01B1`).
    - Semicircular hot-pink / magenta crescent dome (`linear-gradient(135deg, #FF007A, #FE01B1)`) in the right corner housing the `0/3 Completed` progress pill and square plus button.
    - Soft pink outline badges (`Daily`, `+15 Points`, `+25 Credits`).
  - **Card 3 (7-Day Explorer)**:
    - Clean white card with title in `#FE01B1` and large volt-lime crescent dome (`#c6f831`) in the right corner housing the `3/7 Completed` capsule and plus button.
    - Lime-accented badges (`Expires in 7 Days`, `+300 Credits`).
- **Sidebar Widgets Redesign (Precise Design Match)**:
  - **Widget 1 (Activity Log Card)**:
    - Glowing gradient border container (`#6366f1` to `#FE01B1`).
    - 3-level battery / power meter squircle (yellow, lime, green bars) with direct link to the Activity Log modal.
  - **Widget 2 (Tops Earning Points)**:
    - Custom dual-flag icon for EUR/USD (`DualFlag` EU + US split flag).
    - Google colorful G icon for GOOGL (`GoogleIcon`).
    - 3D Gold bullion bar icon with gold sheen for XAU/USD (`GoldBullionIcon`).
    - Red 500 circular badge for S&P 500 (`Sp500Badge`).
    - Direct modal inspection when clicking each instrument, and "View More" button.
  - **Widget 3 (Most Recent Signals)**:
    - Clean 2x2 grid container with light slate canvas (`#f8f9fc`).
    - Responsive instrument cards for EUR/USD (+0.33%), GOOGL (-0.11%), BTC/USD (Premium badge with faceted gem), and S&P 500 (+0.44%).
    - Direct routing to the trading signals view.

## [0.2.2] - 2026-09-09
### Added
- **User Profile Dropdown Menu (Exact Match to Design)**:
  - **Dropdown Trigger**: Clicking the user profile pill in the navbar toggles the dropdown menu with outside-click dismissal.
  - **Mascot Header Card**: Top section features the purple arcade ghost mascot (`#5945F1`), current rank title (`Rookie`), horizontal progress bar, purple diamond gem indicator with live points (`0/150 pts.`), and an edit pencil button.
  - **Direct Points & Missions Link**: Clicking either the top mascot header card or the **"Points and Credits"** menu item directly opens the comprehensive Points, Credits & Missions page.
  - **Precise Menu Items**:
    - **Dashboard** with 2x2 grid icon (`LayoutGrid`).
    - **Cashback** with circular dollar icon (`CircleDollarSign`).
    - **Profile** with silhouette icon (`User`).
    - **Points and Credits** with faceted diamond icon (`Diamond`).
    - **Account Security** with shield icon (`Shield`).
    - **Notifications** with bell icon (`Bell`) and vibrant purple unread badge (`1`).
  - **Theme Toggle Segmented Control**: Integrated pill controller with Light (Sun) and Dark (Moon) mode buttons.
  - **Sign Out Button**: Centered rounded outline button with purple accent typography and active feedback.
### Changed
- **Navigation Bar Component (High-Fidelity Match to Design)**:
  - **Logo**: Updated MarketSyde logo icon with signature purple circular badge, flowing calligraphic 'm' loop in crisp white, and volt-lime fluorescent accent dot alongside `market`**syde** wordmark.
  - **Desktop Navigation Links**: Aligned desktop header navigation strictly to `Trade ⌵`, `Brokers ⌵`, `Member Plan` (direct link), and `Company ⌵`.
  - **Search Input**: Updated search pill container with light lavender/indigo rounded border (`border-indigo-200/90`), 12px border radius, search icon, and `Search...` placeholder.
  - **User Profile Pill**: Redesigned user profile pill with matching rounded container, white user silhouette box with floating purple notification badge at top-right corner, user greeting (`Hi, Josh`), and arcade purple ghost icon (`👻`) with rank label (`Rookie`).
  - **Submenu Access**: Ensured Missions, Points & Credits, and Community Floor are readily accessible through the Company menu and profile interactions.

## [0.2.0] - 2026-09-09
### Added
- **Credit Earning Guide**: Added dedicated full-fidelity Credit Earning Guide page matching reference design:
  - Hero section with dual-color typography (`Credit Earning Guide.`) and animated orbital graphic with hot pink orb.
  - "How Do Credits Work?" 5 distinct colored bullet points.
  - 10-item Activity rewards table with faceted gem icons and orbital satellite trajectory background.
  - Interactive pagination controls.
  - "Got Questions?" FAQ accordion.
- **Level Points Guide**: Interactive instrument level points guide with dual flags, booster multiplier badges, lot-size calculator, and FAQ.
- **Card Navigation Linking**: Linked "Learn More" on Rookie Card to Level Points Guide and "Learn More" on Syde Credits Card to Credit Earning Guide.
- **Discord Community Icon**: Updated social footer with official Discord icon and copyright 2026.

## [0.1.0] - Initial Release
- Bento Grid Dashboard, Trading Signals, Cashback Overview, Calculators, Missions & Points.
## 1.3.6
- Show instrument-specific special broker offers first in the Broker access dialog, with non-sponsored brokers listed afterward.
## 1.3.7
- Balanced Screener table row spacing and reduced excess vertical gaps while preserving campaign content readability.
## 1.3.8
- Fixed excessive header whitespace by assigning stable Screener column widths and preventing the Instrument column from expanding.
## 1.3.9
- Split Screener logo, symbol, and instrument name into dedicated columns for clearer scanning.
## 1.4.0
- Replaced the instrument broker-promotions banner with a focused market signal feature showing signal, confidence, daily change, and monthly return.
## 1.4.1
- Removed the standalone instrument signal feature box from the top of the instrument page.
## 1.4.2
- Added one compact Trading Signal card on the right side of the instrument quote box.
## 1.4.3
- Moved the single Trading Signal card into its own right-side instrument panel, alongside the Community panel.
## 1.4.4
- Added root demo controls to switch the active member level between 1 and 4 from the profile menu.
## 1.4.5
- Hid the visible Root demo controls panel from the profile dropdown.
## 1.4.6
- Added compact root-level selector buttons beside the profile menu sign-out action.
## 1.4.7
- Matched the instrument quote box width and centered position to the main instrument analysis panel.
## 1.4.8
- Fixed profile level buttons so selecting a level works without toggling the parent profile control.
