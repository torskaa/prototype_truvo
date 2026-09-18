import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Eye,
  Heart,
  Share2,
  Clock,
  ChevronRight,
  ExternalLink,
  Sparkles,
  MessageCircle,
  Send,
} from 'lucide-react';
import { CommunityArticle, CommunityPost } from '../../types';
import { COMMUNITY_ARTICLES } from '../../data/communityData';

interface CommunityArticlesViewProps {
  articles?: CommunityArticle[];
  posts?: CommunityPost[];
  marketFilter?: string;
  hashtagFilter?: string;
  onSelectAuthorByName?: (authorName: string) => void;
  onShowToast: (msg: string) => void;
}

export const CommunityArticlesView: React.FC<CommunityArticlesViewProps> = ({
  articles = COMMUNITY_ARTICLES,
  posts = [],
  marketFilter = 'All',
  hashtagFilter = '',
  onSelectAuthorByName,
  onShowToast,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<CommunityArticle | null>(null);
  const articleMarket = (article: CommunityArticle) => {
    const badge = article.tickerBadge.toLowerCase();
    if (marketFilter === 'Crypto') return /btc|eth|hype|dex|rails|crypto|token/.test(badge);
    if (marketFilter === 'Stocks') return /aapl|nvda|stock|equity|health/.test(badge);
    if (marketFilter === 'Forex') return /forex|eur|gbp|jpy|fx/.test(badge);
    if (marketFilter === 'Commodities') return /gold|oil|silver|xau|copper/.test(badge);
    if (marketFilter === 'Indices') return /index|spx|nasdaq|dax|s&p/.test(badge);
    return true;
  };
  const generatedArticles: CommunityArticle[] = [
    { id: 'art-stock-1', title: 'Semiconductor Equipment Orders Point to a Stronger H2', summary: 'Lead times are tightening across chip equipment suppliers as data-center demand broadens beyond the largest cloud platforms.', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80', publisher: { name: 'Equity Lens', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80', verified: true }, views: 736, likes: 41, tickerBadge: 'NVDA', date: '5h ago', readTime: '6 min read', content: 'A review of semiconductor capital spending, inventory normalization, and the risk factors investors should monitor.' },
    { id: 'art-crypto-1', title: 'Stablecoin Settlement Gains Ground in Cross-Border Commerce', summary: 'Treasury teams are testing dollar tokens for faster settlement, but liquidity and compliance remain the key adoption hurdles.', thumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80', publisher: { name: 'Chain Research', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&auto=format&fit=crop&q=80', verified: true }, views: 982, likes: 57, tickerBadge: 'USDC', date: '7h ago', readTime: '5 min read', content: 'Stablecoin payment volumes are expanding into supplier settlement and remittance corridors.' },
    { id: 'art-forex-1', title: 'Dollar Volatility Returns as Central Banks Diverge', summary: 'Rate expectations are pulling major currency pairs in opposite directions while traders watch upcoming inflation releases.', thumbnail: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&auto=format&fit=crop&q=80', publisher: { name: 'FX Desk', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80', verified: true }, views: 618, likes: 34, tickerBadge: 'EUR/USD', date: '9h ago', readTime: '4 min read', content: 'A tactical look at yield spreads, inflation surprises, and the next major support zones.' },
    { id: 'art-commodities-1', title: 'Copper Inventories Tighten as Grid Investment Accelerates', summary: 'Exchange inventories are falling while electrification projects add a new source of structural demand for refined copper.', thumbnail: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&auto=format&fit=crop&q=80', publisher: { name: 'Raw Materials', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80', verified: true }, views: 544, likes: 29, tickerBadge: 'COPPER', date: '11h ago', readTime: '5 min read', content: 'Supply disruptions and grid investment are reshaping the medium-term industrial metals outlook.' },
    { id: 'art-indices-1', title: 'Global Index Breadth Improves Beneath a Narrow Leadership Rally', summary: 'More constituents are participating in the advance, a healthier signal than headline index gains alone.', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80', publisher: { name: 'Index Monitor', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&auto=format&fit=crop&q=80', verified: true }, views: 801, likes: 46, tickerBadge: 'S&P 500', date: '1d ago', readTime: '7 min read', content: 'Breadth, equal-weight performance, and sector participation provide a broader view of index health.' },
  ];
  const expandedArticles = [...articles, ...generatedArticles];
  const [articlesList, setArticlesList] = useState<CommunityArticle[]>(expandedArticles);
  const [activeHashtag, setActiveHashtag] = useState(hashtagFilter);
  useEffect(() => {
    const handleHashtag = (event: Event) => setActiveHashtag((event as CustomEvent<string>).detail);
    window.addEventListener('marketsyde-hashtag-filter', handleHashtag);
    return () => window.removeEventListener('marketsyde-hashtag-filter', handleHashtag);
  }, []);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [articleComments, setArticleComments] = useState<Record<string, string[]>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [commentVotes, setCommentVotes] = useState<Record<string, 'agree' | 'disagree' | undefined>>({});
  const [selectedCommentUser, setSelectedCommentUser] = useState<string | null>(null);
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({});

  const handleAddComment = (articleId: string) => {
    const text = newCommentText[articleId]?.trim();
    if (!text) return;
    setArticleComments((prev) => ({
      ...prev,
      [articleId]: [...(prev[articleId] || []), text],
    }));
    setNewCommentText((prev) => ({ ...prev, [articleId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [articleId]: true }));
    onShowToast('Comment added to the article');
  };

  const handleCommentVote = (commentKey: string, vote: 'agree' | 'disagree') => {
    setCommentVotes((prev) => ({
      ...prev,
      [commentKey]: prev[commentKey] === vote ? undefined : vote,
    }));
  };

  const handleToggleLike = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = !likedArticles[articleId];
    setLikedArticles((prev) => ({ ...prev, [articleId]: isLiked }));
    setArticlesList((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? { ...a, likes: isLiked ? a.likes + 1 : a.likes - 1 }
          : a
      )
    );
    if (isLiked) {
      onShowToast('❤️ Liked article! +5 Points for reading and engaging');
    }
  };

  const articleHashtags = (article: CommunityArticle) => {
    const badge = article.tickerBadge.toLowerCase();
    const marketTags = /btc|eth|hype|dex|rails|crypto|token/.test(badge)
      ? ['#Crypto', '#Technical', '#Fundamental', '#Trading', '#DeFi']
      : /aapl|nvda|stock|equity|health/.test(badge)
        ? ['#Stocks', '#Earnings', '#Fundamental', '#Technical', '#Investing']
        : /forex|eur|gbp|jpy|fx/.test(badge)
          ? ['#Forex', '#Macro', '#Rates', '#Technical', '#Currencies']
          : /gold|oil|silver|xau/.test(badge)
            ? ['#Commodities', '#Macro', '#Gold', '#Inflation', '#Markets']
            : ['#Markets', '#Research', '#Macro', '#Analysis', '#Investing'];
    return marketTags.slice(0, 5);
  };
  const articleCategory = (article: CommunityArticle) => {
    const badge = article.tickerBadge.toLowerCase();
    if (/btc|eth|hype|dex|rails|crypto|token/.test(badge)) return 'Crypto';
    if (/aapl|nvda|stock|equity|health/.test(badge)) return 'Stocks';
    if (/forex|eur|gbp|jpy|fx/.test(badge)) return 'Forex';
    if (/gold|oil|silver|xau|copper/.test(badge)) return 'Commodities';
    if (/index|spx|nasdaq|dax|s&p/.test(badge)) return 'Indices';
    return 'Macro';
  };
  const visibleArticles = articlesList.filter((article) => articleMarket(article) && (!activeHashtag || articleHashtags(article).includes(activeHashtag)));

  return (
    <div className="space-y-5 w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#0b1c30] font-display">Latest Research & Articles</h3>
          <p className="text-xs text-[#474556] mt-0.5">
            Institutional macro reports, market structure breakdowns, and tokenomics analyses.
          </p>
        </div>

        <button
          onClick={() => onShowToast('All 34 verified community reports available')}
          className="flex items-center gap-1 text-xs text-[#5338ec] hover:text-[#4326d8] font-semibold transition-colors"
        >
          <span>See All Articles</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {posts.length > 0 && (
        <section className="rounded-2xl border border-[#e2e8f0] bg-slate-50/70 p-4">
          <div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-bold text-[#0b1c30]">Synced from Feed</h4><span className="text-[10px] text-slate-400">{posts.length} community posts</span></div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{posts.slice(0, 4).map((post) => <article key={`synced-${post.id}`} className="rounded-xl border border-[#e2e8f0] bg-white p-3"><div className="flex items-center gap-2"><img src={post.author.avatar} alt={post.author.name} className="h-7 w-7 rounded-full object-cover" /><div><p className="text-[11px] font-semibold text-[#0b1c30]">{post.author.name}</p><p className="text-[9px] text-slate-400">{post.timestamp}</p></div></div><h5 className="mt-2 line-clamp-2 text-xs font-bold text-[#0b1c30]">{post.title}</h5><p className="mt-1 line-clamp-2 text-[11px] text-slate-500">{post.content}</p><div className="mt-2 flex flex-wrap gap-1">{post.tags.slice(0, 5).map((tag) => <span key={tag} className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700">#{tag.replace(/^#/, '')}</span>)}</div></article>)}</div>
        </section>
      )}

      {/* 3-Column Article Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {visibleArticles.map((art, index) => {
          const isLiked = likedArticles[art.id];
          const isFollowingAuthor = followedAuthors[art.publisher.name];
          const comments = articleComments[art.id] || [];
          const seededComments = [
            'The data supports this direction, though I would watch the next market session before adding exposure.',
            'Interesting angle. Which indicator would invalidate this thesis?',
          ];
          const displayedComments = [...seededComments, ...comments];
          const commentCount = displayedComments.length + (art.likes % 7) + 1;
          return (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`grid grid-cols-1 overflow-hidden border border-[#e2e8f0] bg-white text-[#0b1c30] shadow-xs transition-all hover:border-[#cbd5e1] hover:shadow-sm cursor-pointer group md:grid-cols-[minmax(0,1fr)_148px] ${['rounded-2xl', 'rounded-[26px_12px_26px_12px]', 'rounded-[12px_26px_12px_26px]', 'rounded-xl', 'rounded-[18px_6px_18px_6px]'][index % 5]}`}
            >
              {/* Thumbnail header */}
              <div className="relative order-1 aspect-video w-full overflow-hidden bg-slate-100 md:order-2 md:aspect-auto md:min-h-[190px]">
                <img
                  src={art.thumbnail}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-xs border ${
                      art.badgeColor || 'bg-white/90 text-[#0b1c30] border-slate-200 shadow-xs'
                    }`}
                  >
                    {art.tickerBadge}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="order-2 flex min-w-0 flex-1 flex-col justify-between space-y-3 p-4 md:order-1">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#5338ec] line-clamp-2 leading-snug transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-xs text-[#474556] line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="mr-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">{articleCategory(art)}</span>
                    {articleHashtags(art).map((tag) => (
                      <span key={`${art.id}-${tag}`} className="rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer publisher & stats */}
                <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAuthorByName?.(art.publisher.name);
                    }}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={art.publisher.avatar}
                      alt={art.publisher.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className="font-semibold text-[#0b1c30] text-xs truncate max-w-[110px]">
                      {art.publisher.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFollowedAuthors((prev) => ({ ...prev, [art.publisher.name]: !prev[art.publisher.name] }));
                      }}
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${isFollowingAuthor ? 'bg-slate-100 text-slate-500' : 'bg-violet-50 text-[#5338ec] hover:bg-violet-100'}`}
                    >
                      {isFollowingAuthor ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[#474556] font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{art.views}</span>
                    </span>

                    <button
                      onClick={(e) => handleToggleLike(art.id, e)}
                      className={`flex items-center gap-1 transition-colors ${
                        isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{art.likes}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedComments((prev) => ({ ...prev, [art.id]: !prev[art.id] }));
                      }}
                      className={`flex items-center gap-1 transition-colors ${
                        expandedComments[art.id] ? 'text-[#5338ec]' : 'hover:text-[#5338ec]'
                      }`}
                      aria-label={`View comments for ${art.title}`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{commentCount}</span>
                    </button>
                  </div>
                </div>

                {expandedComments[art.id] && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="pt-3 border-t border-[#f1f5f9] space-y-2"
                  >
                    {displayedComments.length > 0 && (
                      <div className="space-y-1.5 max-h-24 overflow-y-auto">
                        {displayedComments.map((comment, index) => {
                          const commentKey = `${art.id}-${index}`;
                          const vote = commentVotes[commentKey];
                          const commentUser = ['Maya Chen', 'Alex Rivera', 'Jordan Lee'][index % 3];
                          return (
                          <div key={commentKey} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-[#474556]">
                            <button type="button" onClick={() => setSelectedCommentUser(commentUser)} className="mb-0.5 font-semibold text-[#5338ec] hover:underline">{commentUser}</button>
                            <p>{comment}</p>
                            <div className="mt-1 flex items-center gap-2 text-[10px]">
                              <button
                                onClick={() => handleCommentVote(commentKey, 'agree')}
                                className={vote === 'agree' ? 'font-semibold text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}
                              >Agree · {vote === 'agree' ? 1 : 0}
                              </button>
                              <button
                                onClick={() => handleCommentVote(commentKey, 'disagree')}
                                className={vote === 'disagree' ? 'font-semibold text-rose-500' : 'text-slate-400 hover:text-rose-500'}
                              >Disagree · {vote === 'disagree' ? 1 : 0}
                              </button>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        value={newCommentText[art.id] || ''}
                        onChange={(e) => setNewCommentText((prev) => ({ ...prev, [art.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(art.id);
                        }}
                        placeholder="Add a comment..."
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] outline-none focus:border-[#5338ec]"
                      />
                      <button
                        onClick={() => handleAddComment(art.id)}
                        disabled={!newCommentText[art.id]?.trim()}
                        className="rounded-lg bg-[#5338ec] p-1.5 text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Post comment"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* ─── FULL ARTICLE READER MODAL ─── */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-[#0b1c30] shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>

            {/* Modal Article Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    selectedArticle.badgeColor || 'bg-slate-100 text-[#0b1c30]'
                  }`}
                >
                  {selectedArticle.tickerBadge}
                </span>
                <span className="text-xs text-[#474556] font-mono">
                  {selectedArticle.readTime || '4 min read'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-[#474556] font-mono">
                  {selectedArticle.date}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#0b1c30] leading-snug">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 py-3 border-y border-[#f1f5f9]">
                <img
                  src={selectedArticle.publisher.avatar}
                  alt={selectedArticle.publisher.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-[#0b1c30]">
                    {selectedArticle.publisher.name}
                  </p>
                  <p className="text-[11px] text-[#474556] font-mono">Verified Publisher</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden aspect-video w-full bg-slate-100 border border-slate-200">
                <img
                  src={selectedArticle.thumbnail}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[#0b1c30] text-sm leading-relaxed whitespace-pre-line py-2">
                {selectedArticle.content || selectedArticle.summary}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                <button
                  onClick={(e) => handleToggleLike(selectedArticle.id, e)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    likedArticles[selectedArticle.id]
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-[#f1f5f9] text-[#474556] hover:bg-slate-200'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedArticles[selectedArticle.id] ? 'fill-current text-rose-500' : ''
                    }`}
                  />
                  <span>
                    {selectedArticle.likes + (likedArticles[selectedArticle.id] ? 1 : 0)} Likes
                  </span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="bg-[#5338ec] hover:bg-[#4326d8] text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCommentUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 p-4" onClick={() => setSelectedCommentUser(null)}>
          <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-[#5338ec]">{selectedCommentUser.charAt(0)}</div>
            <h3 className="mt-3 font-bold text-[#0b1c30]">{selectedCommentUser}</h3>
            <p className="mt-1 text-xs text-slate-500">Community market analyst</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-slate-50 p-2"><b>87.4</b><br />Influence</div><div className="rounded-lg bg-slate-50 p-2"><b>1.2k</b><br />Followers</div></div>
            <button type="button" onClick={() => { onShowToast(`Following ${selectedCommentUser}`); setSelectedCommentUser(null); }} className="mt-4 w-full rounded-xl bg-[#5338ec] py-2 text-xs font-bold text-white">Follow</button>
            <button type="button" onClick={() => setSelectedCommentUser(null)} className="mt-2 text-xs text-slate-500">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
