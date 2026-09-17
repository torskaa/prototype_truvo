import React, { useEffect, useState } from 'react';
import {
  Flame,
  Play,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Vote,
} from 'lucide-react';
import { CommunityInfluencer, CommunityPost, CommunityTopic } from '../../types';
import { COMMUNITY_TOPICS, TOP_INFLUENCERS } from '../../data/communityData';
import { CommunityArticlesView } from './CommunityArticlesView';

interface CommunityTopicsViewProps {
  topics?: CommunityTopic[];
  posts?: CommunityPost[];
  onAnswerTopic: (topicId: string, answerText: string) => void;
  onShowToast: (msg: string) => void;
  onSelectInfluencer?: (influencer: CommunityInfluencer) => void;
  onOpenMedia?: () => void;
}

export const CommunityTopicsView: React.FC<CommunityTopicsViewProps> = ({
  topics = COMMUNITY_TOPICS,
  posts = [],
  onAnswerTopic,
  onShowToast,
  onSelectInfluencer,
  onOpenMedia,
}) => {
  const [selectedTopicForAnswer, setSelectedTopicForAnswer] = useState<CommunityTopic | null>(null);
  const [answerInput, setAnswerInput] = useState('');
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [topicsState, setTopicsState] = useState<CommunityTopic[]>(topics);
  const [marketFilter, setMarketFilter] = useState('All');
  const [exploreSection, setExploreSection] = useState<'home' | 'news' | 'popular' | 'media'>('home');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  useEffect(() => {
    const onHashtagClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest('button');
      const tag = button?.textContent?.trim();
      if (tag === 'Media') { setExploreSection('media'); return; }
      if (tag?.startsWith('#')) {
        setSelectedHashtag(tag);
        setExploreSection('news');
        window.dispatchEvent(new CustomEvent('marketsyde-hashtag-filter', { detail: tag }));
        window.setTimeout(() => window.dispatchEvent(new CustomEvent('marketsyde-hashtag-filter', { detail: tag })), 0);
      }
    };
    document.addEventListener('click', onHashtagClick, true);
    return () => document.removeEventListener('click', onHashtagClick, true);
  }, []);
  const filteredTopics = topicsState.filter((topic) => marketFilter === 'All' || topic.tokens.some((token) => {
    const symbol = token.symbol.toLowerCase();
    if (marketFilter === 'Crypto') return /btc|eth|sol|xrp|uni|bnb|crypto/.test(symbol);
    if (marketFilter === 'Stocks') return /aapl|nvda|stock|nasdaq/.test(symbol);
    if (marketFilter === 'Forex') return /usd|eur|gbp|jpy|forex/.test(symbol);
    if (marketFilter === 'Commodities') return /gold|xau|oil|silver/.test(symbol);
    if (marketFilter === 'Indices') return /spx|s&p|nasdaq|dax|index/.test(symbol);
    return false;
  }));
  const popularTopics = [...filteredTopics].sort((a, b) => b.answersCount - a.answersCount);
  const communityTopics = exploreSection === 'popular' ? popularTopics : filteredTopics;
  const featuredTopic = filteredTopics.find((t) => t.featured) || filteredTopics[0];
  const gridTopics = filteredTopics.filter((t) => !t.featured);

  if (exploreSection === 'media') {
    const shorts = [
      ['/media-covers/live-trading.png', 'FOMC #trading #crypto #bitcoin #shorts', '4.2k views'],
      ['/media-covers/podcast.png', 'Franklin Templeton Already Runs Crypto Validators', '109 views'],
      ['/media-covers/radio.png', 'Democrats block crypto bill, demand rules for lawmakers', '5.1k views'],
      ['/media-covers/community-room.png', 'My TOP 5 Altcoins... you will be surprised', '219k views'],
      ['/media-covers/live-trading.png', '2026 Crypto Predictions!', '1.7m views'],
    ];
    const streams = [
      ['/media-covers/live-trading.png', 'Will Stocks Crash and Take Bitcoin Down With Them?', 'Crypto Banter', '4.3k views · Streamed 3 hours ago'],
      ['/media-covers/podcast.png', 'LIVE TRADING! Key Levels to Watch Next for Bitcoin & Altcoins', 'Crypto Banter', '1k views · Streamed 44 minutes ago'],
      ['/media-covers/radio.png', 'The Fed Just Lit The Fuse For Crypto Markets', 'Altcoin Daily', '55k views · 11 hours ago'],
    ];
    return <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs"><div className="border-b border-[#e2e8f0] p-3"><div className="flex flex-wrap items-center gap-6 text-sm font-semibold"><button type="button" onClick={() => setExploreSection('home')} className="text-slate-500">All</button><button type="button" onClick={() => setExploreSection('news')} className="text-slate-500">Posts</button><button type="button" onClick={() => setExploreSection('home')} className="text-slate-500">Communities</button><button type="button" className="border-b-2 border-[#5338ec] pb-2 text-[#5338ec]">Media</button><button type="button" className="text-slate-500">Profiles</button></div></div><div className="grid grid-cols-1 lg:grid-cols-[190px_1fr]"><aside className="border-b border-[#e2e8f0] bg-slate-50/60 p-4 lg:border-b-0 lg:border-r"><p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Explore topics</p><div className="space-y-1 text-sm"><button onClick={() => setExploreSection('home')} className="w-full rounded-lg px-3 py-2 text-left font-semibold text-slate-600 hover:bg-white">Home</button><button onClick={() => setExploreSection('popular')} className="w-full rounded-lg px-3 py-2 text-left font-semibold text-slate-600 hover:bg-white">Popular</button><button onClick={() => setExploreSection('news')} className="w-full rounded-lg px-3 py-2 text-left font-semibold text-slate-600 hover:bg-white">Market News</button><button onClick={() => onShowToast('Start a topic flow opened')} className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-white">＋ Start a topic</button></div><div className="mt-5 border-t border-[#e2e8f0] pt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Trending hashtags</p><div className="flex flex-wrap gap-1.5">{['#BTC','#Macro','#Technical','#Fundamental','#Forex','#Stocks','#Crypto','#Earnings'].map((tag) => <span key={tag} className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">{tag}</span>)}</div></div></aside><div className="space-y-6 p-4"><section><div className="mb-3 flex items-center gap-2"><span className="text-lg">▶</span><h3 className="text-lg font-bold text-[#0b1c30]">Shorts</h3></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{shorts.map(([image, title, views]) => <article key={title} className="min-w-0"><div className="relative aspect-[9/14] overflow-hidden rounded-xl bg-slate-100"><img src={image} alt={title} className="h-full w-full object-cover" /><span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold">New</span></div><h4 className="mt-2 line-clamp-2 text-xs font-semibold text-[#0b1c30]">{title}</h4><p className="mt-1 text-[10px] text-slate-500">{views}</p></article>)}</div></section><section className="space-y-4">{streams.map(([image, title, creator, meta]) => <article key={title} className="grid grid-cols-1 gap-4 md:grid-cols-[38%_1fr] md:items-start"><div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100"><img src={image} alt={title} className="h-full w-full object-cover" /><span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-white">LIVE</span></div><div><h3 className="text-base font-semibold text-[#0b1c30]">{title}</h3><p className="mt-1 text-[11px] text-slate-500">{meta}</p><p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#474556]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">C</span>{creator} ✓</p><p className="mt-3 line-clamp-2 text-xs text-slate-500">Market commentary, live analysis, and key levels from the community stream.</p><span className="mt-3 inline-block rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600">New · Subtitles</span></div></article>)}</section></div></div></div>;
  }

  const handleOpenAnswer = (topic: CommunityTopic) => {
    setSelectedTopicForAnswer(topic);
    setAnswerInput('');
    setVotedOption(null);
  };

  const handleModalSubmit = () => {
    if (!selectedTopicForAnswer) return;
    if (!answerInput.trim() && !votedOption) {
      onShowToast('Please type an answer or select a thesis option');
      return;
    }

    const submission = votedOption ? `[Voted: ${votedOption}] ${answerInput}` : answerInput;
    onAnswerTopic(selectedTopicForAnswer.id, submission);

    setTopicsState((prev) =>
      prev.map((t) =>
        t.id === selectedTopicForAnswer.id
          ? { ...t, answersCount: t.answersCount + 1, userAnswer: submission }
          : t
      )
    );

    onShowToast('🎉 Answer submitted! +15 Points added for market community contribution');
    setSelectedTopicForAnswer(null);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
        <span className="mr-1 text-xs font-bold text-[#0b1c30]">Market</span>
        {['All', 'Stocks', 'Crypto', 'Forex', 'Commodities', 'Indices'].map((market) => (
          <button key={market} type="button" onClick={() => setMarketFilter(market)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${marketFilter === market ? 'bg-[#5338ec] text-white' : 'border border-[#e2e8f0] text-[#474556] hover:border-[#5338ec] hover:text-[#5338ec]'}`}>
            {market}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xs">
        <div className="border-b border-[#e2e8f0] p-3"><div className="flex flex-wrap items-center gap-6 text-sm font-semibold"><button onClick={() => setExploreSection('home')} className="text-slate-500">All</button><button onClick={() => setExploreSection('news')} className={`pb-2 ${exploreSection === 'news' ? 'border-b-2 border-[#5338ec] text-[#5338ec]' : 'text-slate-500'}`}>Posts</button><button onClick={() => setExploreSection('home')} className={`pb-2 ${exploreSection === 'home' ? 'border-b-2 border-[#5338ec] text-[#5338ec]' : 'text-slate-500'}`}>Communities</button><button className="text-slate-500">Media</button><button className="text-slate-500">Profiles</button></div></div>
        <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr]">
          <aside className="border-b border-[#e2e8f0] bg-slate-50/60 p-4 lg:border-b-0 lg:border-r"><p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Explore topics</p><div className="space-y-1 text-sm"><button onClick={() => setExploreSection('home')} className={`w-full rounded-lg px-3 py-2 text-left font-semibold ${exploreSection === 'home' ? 'bg-violet-100 text-violet-700' : 'text-slate-600 hover:bg-white'}`}>Home</button><button onClick={() => setExploreSection('popular')} className={`w-full rounded-lg px-3 py-2 text-left font-semibold ${exploreSection === 'popular' ? 'bg-violet-100 text-violet-700' : 'text-slate-600 hover:bg-white'}`}>Popular</button><button onClick={() => setExploreSection('news')} className={`w-full rounded-lg px-3 py-2 text-left font-semibold ${exploreSection === 'news' ? 'bg-violet-100 text-violet-700' : 'text-slate-600 hover:bg-white'}`}>Market News</button><button onClick={() => onShowToast('Start a topic flow opened')} className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-white">＋ Start a topic</button></div><div className="mt-5 border-t border-[#e2e8f0] pt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Trending hashtags</p><div className="flex flex-wrap gap-1.5">{['#BTC', '#Macro', '#Technical', '#Fundamental', '#Forex', '#Stocks', '#Crypto', '#Earnings'].map((tag) => <button key={tag} type="button" onClick={() => onShowToast(`${tag} trending now`)} className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700 hover:bg-violet-100">{tag}</button>)}</div></div></aside>
          {exploreSection === 'news' ? <div className="p-4"><CommunityArticlesView marketFilter={marketFilter} onShowToast={onShowToast} /></div> : <div className="divide-y divide-[#e2e8f0]">{communityTopics.slice(0, 8).map((topic, index) => { const roomName = topic.category || 'Market Discussion'; const roomCost = index % 3 === 0 ? 0 : index * 5; const hashtagSets = [['#Macro', '#Fundamental', '#Rates', '#Forex', '#BTC'], ['#Crypto', '#Technical', '#DeFi', '#ETH', '#Trading'], ['#Stocks', '#Institutional', '#Fundamental', '#Earnings', '#BTC'], ['#Commodities', '#Macro', '#Technical', '#Gold', '#Markets']]; const hashtags = hashtagSets[index % hashtagSets.length]; const covers = ['/media-covers/community-room.png', '/media-covers/live-trading.png', '/media-covers/podcast.png', '/media-covers/radio.png']; const roomOwners = ['CZ', 'Michael Saylor', 'Brian Armstrong', 'Donald Trump Jr.', 'Mario Nawfal', 'H.E. Justin Sun', 'MarketSyde Official', 'Ansem']; const roomOwner = roomOwners[index % roomOwners.length]; const owner = TOP_INFLUENCERS.find((influencer) => influencer.name.replace(' 🐂', '') === roomOwner); return <div key={`directory-${topic.id}`} className="flex items-start gap-3 p-4 transition hover:bg-slate-50"><button type="button" onClick={() => handleOpenAnswer(topic)} className="flex min-w-0 flex-1 items-start gap-3 text-left"><div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-violet-100"><img src={covers[index % covers.length]} alt={`${roomName} community`} className="h-full w-full object-cover" /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-[#0b1c30]">{roomName}</h3><span role="button" tabIndex={0} onClick={(event) => { event.stopPropagation(); if (owner) onSelectInfluencer?.(owner); else onShowToast(`Profile for ${roomOwner} is coming soon`); }} className="cursor-pointer text-[10px] text-slate-400 hover:text-[#5338ec]">by {roomOwner} · #{index + 1} trending</span></div><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">{topic.title}</p><div className="mt-1 flex flex-wrap gap-1">{hashtags.map((tag) => <span key={tag} className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700">{tag}</span>)}</div><p className="mt-1 text-[10px] text-slate-400">{topic.answersCount} weekly answers · {topic.tokens.map((token) => token.symbol).join(' · ')} · {120 + index * 47} members online</p></div></button><button type="button" onClick={() => onShowToast(roomCost === 0 ? `Free to join ${roomName}` : `Spent ${roomCost} MarketSyde credits to join ${roomName}`)} className="shrink-0 rounded-full border border-[#5338ec] px-3 py-1.5 text-[10px] font-bold text-[#5338ec] hover:bg-[#5338ec] hover:text-white">{roomCost === 0 ? 'Free to join' : `${roomCost} credits · Join`}</button></div>; })}</div>}
        </div>
      </div>

      {false && (<>
      {/* ─── 1. HERO FEATURED TOPIC ─── */}
      {featuredTopic && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 text-[#0b1c30] shadow-xs relative overflow-hidden group hover:border-[#cbd5e1] hover:shadow-sm transition-all">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left image thumbnail */}
            <div className="md:col-span-4 relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-inner">
              <img
                src={featuredTopic.image}
                alt={featuredTopic.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                <Flame className="w-3 h-3 fill-current" />
                <span>Hot Discussion</span>
              </div>
            </div>

            {/* Right details */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#5338ec] font-bold tracking-wide uppercase">
                  Featured Topic
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-[#474556] font-medium">{featuredTopic.category}</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-display font-bold text-[#0b1c30] leading-snug">
                {featuredTopic.title}
              </h2>

              <div className="flex items-center gap-3 flex-wrap">
                {featuredTopic.tokens.map((tok, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-1 text-xs font-medium"
                  >
                    <span className="text-amber-500 font-bold">₿</span>
                    <span className="text-[#0b1c30] font-semibold">{tok.symbol}</span>
                    <span className="text-emerald-600 font-mono text-[11px] font-semibold">
                      +{tok.change}%
                    </span>
                  </div>
                ))}

                <span className="text-xs text-[#474556] font-mono">
                  {featuredTopic.answersCount} traders answered
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAnswer(featuredTopic)}
                  className="inline-flex items-center gap-2 bg-[#5338ec] hover:bg-[#4326d8] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Answer ({featuredTopic.answersCount})</span>
                </button>

                <button
                  onClick={() => handleOpenAnswer(featuredTopic)}
                  className="inline-flex items-center gap-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30] border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Check it out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. 2-COLUMN GRID OF DISCUSSION TOPICS ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#0b1c30] font-display">All Hot Topics</h3>
          <span className="text-xs text-[#474556] font-mono">
            {gridTopics.length} Active Debates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gridTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 text-[#0b1c30] shadow-xs hover:border-[#cbd5e1] hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-[11px] font-semibold text-[#5338ec] bg-[#ede9fe] px-2.5 py-0.5 rounded-md">
                    {topic.category || 'Trading Strategy'}
                  </span>
                  <span className="text-xs text-[#474556] font-mono">
                    {topic.answersCount} Answers
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#0b1c30] leading-snug mb-3 line-clamp-2">
                  {topic.title}
                </h4>

                {/* Token pills */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  {topic.tokens.map((tok, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2.5 py-1 text-xs font-medium"
                    >
                      <span className="text-[#0b1c30] font-bold">{tok.symbol}</span>
                      <span className="text-emerald-600 font-mono text-[11px] font-semibold">
                        +{tok.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
                {topic.userAnswer ? (
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>You contributed</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-mono">
                    Open for answers
                  </span>
                )}

                <button
                  onClick={() => handleOpenAnswer(topic)}
                  className="inline-flex items-center gap-1.5 bg-[#f1f5f9] hover:bg-[#5338ec] text-[#0b1c30] hover:text-white border border-slate-200 hover:border-[#5338ec] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Answer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      </>)}


      {/* ─── MODAL: ANSWER TOPIC DIALOG ─── */}
      {selectedTopicForAnswer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 w-full max-w-lg text-[#0b1c30] shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#5338ec] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Community Debate
              </span>
              <button
                onClick={() => setSelectedTopicForAnswer(null)}
                className="text-slate-400 hover:text-slate-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-[#0b1c30] mb-3 leading-snug">
              {selectedTopicForAnswer.title}
            </h3>

            {/* Quick Poll Voting Options */}
            <div className="space-y-2 mb-4">
              <label className="text-xs text-[#474556] font-medium block">
                Choose your market thesis:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVotedOption('Bullish - Holds Support')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                    votedOption === 'Bullish - Holds Support'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                      : 'bg-[#f8fafc] border-[#e2e8f0] text-[#0b1c30] hover:bg-[#f1f5f9]'
                  }`}
                >
                  🚀 Bullish (Holds Support)
                </button>
                <button
                  onClick={() => setVotedOption('Bearish - Tests $70K')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                    votedOption === 'Bearish - Tests $70K'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold'
                      : 'bg-[#f8fafc] border-[#e2e8f0] text-[#0b1c30] hover:bg-[#f1f5f9]'
                  }`}
                >
                  📉 Bearish (Tests $70K)
                </button>
              </div>
            </div>

            {/* Answer Input */}
            <div className="mb-4">
              <label className="text-xs text-[#474556] font-medium block mb-1">
                Your detailed technical or macro perspective:
              </label>
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Explain order book liquidity, funding rates, or institutional flow..."
                rows={4}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#0b1c30] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#5338ec] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedTopicForAnswer(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#474556] hover:text-[#0b1c30]"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="inline-flex items-center gap-2 bg-[#5338ec] hover:bg-[#4326d8] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Answer (+15 pts)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
