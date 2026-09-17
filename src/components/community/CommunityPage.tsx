import React, { useEffect, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Sparkles,
  Flame,
  Radio,
  BookOpen,
  User,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Award,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  CommunitySubTab,
  CommunityPost,
  UserProfile,
  CommunityInfluencer,
} from '../../types';
import {
  INITIAL_FEED_POSTS,
  MORE_FEED_POSTS,
  COMMUNITY_TOPICS,
  CRYPTO_ADVENTURE_PROFILE,
  CRYPTO_ADVENTURE_POSTS,
  TOP_INFLUENCERS,
} from '../../data/communityData';
import { CommunityFeedsView } from './CommunityFeedsView';
import { CommunityTopicsView } from './CommunityTopicsView';
import { CommunityMyPageView } from './CommunityMyPageView';
import { CommunityProfileView } from './CommunityProfileView';
import { CommunityRightSidebar } from './CommunityRightSidebar';
import { CreateCommunityPostModal } from './CreateCommunityPostModal';

interface CommunityPageProps {
  user: UserProfile;
  onUpdateUserProfile: (updatedUser: Partial<UserProfile>) => void;
  onRewardPoints: (points: number, reason: string) => void;
  onOpenConnectModal?: () => void;
  onOpenAdvancedChart?: (symbol: string) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  user,
  onUpdateUserProfile,
  onRewardPoints,
  onOpenConnectModal,
  onOpenAdvancedChart,
}) => {
  useEffect(() => {
    const handleMediaClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest('button');
      if (button?.textContent?.trim() === 'Media') setActiveSubTab('topics');
    };
    document.addEventListener('click', handleMediaClick, true);
    return () => document.removeEventListener('click', handleMediaClick, true);
  }, []);
  // Community opens on the Home directory so the first visit lands in the room browser.
  const [activeSubTab, setActiveSubTab] = useState<CommunitySubTab>('topics');
  const [selectedInfluencer, setSelectedInfluencer] = useState<CommunityInfluencer | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([
    ...INITIAL_FEED_POSTS,
    ...MORE_FEED_POSTS,
  ]);
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [connectedLivePlatforms, setConnectedLivePlatforms] = useState<Record<string, boolean>>({});
  const [liveSourceUrl, setLiveSourceUrl] = useState('');
  const [mediaFilter, setMediaFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All languages');
  const [customMedia, setCustomMedia] = useState<Array<[string, string, string]>>([
    ['🔴', 'Gold + Crypto Live Trading', 'YouTube · Live now'],
    ['🎙️', 'The Alpha Signals Podcast', 'Spotify · Episode 42'],
    ['📻', 'Global Markets Radio', 'TuneIn · On air'],
    ['🎧', 'Trading Floor After Hours', 'Apple Music · Mix'],
    ['🟣', 'DeFi Builders Room', 'Twitch · Starting soon'],
    ['🎶', 'Macro Voices Weekly', 'SoundCloud · New episode'],
    ['📺', 'Day Trading Explained', 'YouTube · 10:58'],
    ['🎤', 'Forex London Session', 'Instagram · Live now'],
    ['💬', 'Trader Lounge Community Call', 'Discord · 38 listening'],
    ['🎼', 'Weekend Market Recap', 'Mixcloud · Replay'],
  ]);
  const getPlatformTheme = (source: string) => {
    if (source.startsWith('YouTube')) return { tile: 'from-red-600 via-red-500 to-orange-400', badge: 'bg-red-500/20 text-red-100' };
    if (source.startsWith('Spotify')) return { tile: 'from-emerald-700 via-emerald-500 to-lime-400', badge: 'bg-emerald-500/20 text-emerald-100' };
    if (source.startsWith('Twitch')) return { tile: 'from-violet-800 via-violet-600 to-fuchsia-500', badge: 'bg-violet-500/20 text-violet-100' };
    if (source.startsWith('Discord')) return { tile: 'from-indigo-800 via-indigo-600 to-blue-400', badge: 'bg-indigo-500/20 text-indigo-100' };
    if (source.startsWith('Apple Music')) return { tile: 'from-pink-700 via-rose-500 to-orange-400', badge: 'bg-pink-500/20 text-pink-100' };
    if (source.startsWith('SoundCloud')) return { tile: 'from-orange-700 via-orange-500 to-amber-300', badge: 'bg-orange-500/20 text-orange-100' };
    if (source.startsWith('TuneIn')) return { tile: 'from-sky-800 via-sky-600 to-cyan-400', badge: 'bg-sky-500/20 text-sky-100' };
    if (source.startsWith('Mixcloud')) return { tile: 'from-blue-800 via-blue-600 to-cyan-400', badge: 'bg-blue-500/20 text-blue-100' };
    if (source.startsWith('Instagram')) return { tile: 'from-purple-800 via-pink-600 to-yellow-400', badge: 'bg-pink-500/20 text-pink-100' };
    return { tile: 'from-slate-700 via-slate-600 to-slate-400', badge: 'bg-slate-500/20 text-slate-100' };
  };
  const getMediaCover = (source: string) => {
    if (source.startsWith('YouTube') || source.startsWith('Twitch') || source.startsWith('Instagram')) return '/media-covers/live-trading.png';
    if (source.startsWith('Spotify') || source.startsWith('Apple Music') || source.startsWith('SoundCloud') || source.startsWith('Mixcloud')) return '/media-covers/podcast.png';
    if (source.startsWith('TuneIn')) return '/media-covers/radio.png';
    return '/media-covers/community.png';
  };
  const getMediaLanguage = (title: string) => /lounge|defi/i.test(title) ? 'ไทย' : /weekend/i.test(title) ? 'Español' : 'English';
  const platformIcons: Record<string, { mark: string; color: string }> = {
    All: { mark: '✦', color: 'bg-violet-600' }, Twitch: { mark: 'T', color: 'bg-violet-700' }, YouTube: { mark: '▶', color: 'bg-red-600' }, TikTok: { mark: '♪', color: 'bg-slate-900' }, Facebook: { mark: 'f', color: 'bg-blue-600' }, Instagram: { mark: '◎', color: 'bg-pink-600' }, Discord: { mark: '⌁', color: 'bg-indigo-600' }, Spotify: { mark: '◉', color: 'bg-emerald-600' }, 'Apple Music': { mark: '♪', color: 'bg-rose-600' }, SoundCloud: { mark: '≋', color: 'bg-orange-500' }, Mixcloud: { mark: 'M', color: 'bg-blue-600' }, TuneIn: { mark: 'T', color: 'bg-sky-600' }, 'Other radio': { mark: '◉', color: 'bg-slate-600' },
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Like / Upvote
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          const delta = hasLiked ? 1 : -1;
          if (hasLiked) {
            showToast('Post upvoted. Reactions do not earn rewards.');
          }
          return { ...p, likes: p.likes + delta, hasLiked };
        }
        return p;
      })
    );
  };

  // Toggle Follow author from feed
  const handleToggleFollowAuthor = (authorHandle: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.author.handle === authorHandle) {
          const nextState = !p.isFollowingAuthor;
          showToast(
            nextState
              ? `⭐ You are now following ${p.author.name}`
              : `Unfollowed ${p.author.name}`
          );
          return { ...p, isFollowingAuthor: nextState };
        }
        return p;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: user.username || 'You',
            avatar: user.avatar.startsWith('http')
              ? user.avatar
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&auto=format&fit=crop&q=80',
            tier: 'Bronze',
            time: 'Just now',
            text,
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );
    showToast('Comment posted locally. Credit rewards require moderation, which is not connected in this demo.');
  };

  // Create new post
  const handleCreatePost = (newPostData: Partial<CommunityPost>) => {
    const newPost: CommunityPost = {
      id: `user-post-${Date.now()}`,
      author: {
        name: user.username || 'You',
        handle: `@${user.username || 'trader'}`,
        avatar: user.avatar.startsWith('http')
          ? user.avatar
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
        verified: true,
        influenceScore: 100.0,
      },
      timestamp: 'Just now',
      title: newPostData.title || 'Market Analysis',
      content: newPostData.content || '',
      image: newPostData.image,
      tokenMentions: newPostData.tokenMentions || [],
      tags: newPostData.tags || ['CommunityAlpha'],
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: [],
      reactions: [
        { emoji: '🚀', count: 1, active: true },
        { emoji: '🔥', count: 1, active: false },
      ],
      viewsCount: '1',
      repostsCount: 0,
      bookmarksCount: 0,
      isCurrentUser: true,
    };

    setPosts([newPost, ...posts]);
    setUserPosts([newPost, ...userPosts]);
    showToast('Post published locally to Feed and My Page. Credit rewards require moderation, which is not connected in this demo.');
  };

  // Navigate to Influencer Profile
  const handleSelectInfluencer = (influencer: CommunityInfluencer) => {
    setSelectedInfluencer(influencer);
    setActiveSubTab('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectInfluencerByHandle = (handle: string) => {
    const found = TOP_INFLUENCERS.find((inf) => inf.handle === handle);
    if (found) {
      handleSelectInfluencer(found);
    } else {
      // Default to Crypto Adventure profile
      handleSelectInfluencer(CRYPTO_ADVENTURE_PROFILE);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#c6f831] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ─── SUB-MENU NAVIGATION BAR ─── */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-2 sm:p-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* Left Sub-Menu Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {/* Feeds Tab */}
            <button
              onClick={() => {
                setActiveSubTab('feeds');
                setSelectedInfluencer(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSubTab === 'feeds'
                  ? 'bg-[#5338ec] text-white shadow-xs'
                  : 'text-[#474556] hover:text-[#0b1c30] hover:bg-[#f1f5f9]'
              }`}
            >
              <span>Feeds</span>
            </button>

            {/* Topics Tab */}
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('topics');
                setSelectedInfluencer(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSubTab === 'topics'
                  ? 'bg-[#5338ec] text-white shadow-xs'
                  : 'text-[#474556] hover:text-[#0b1c30] hover:bg-[#f1f5f9]'
              }`}
            >
              <span>Topics</span>
            </button>

            {/* My Page Tab */}
            <button
              onClick={() => {
                setActiveSubTab('my-page');
                setSelectedInfluencer(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeSubTab === 'my-page'
                  ? 'bg-[#5338ec] text-white shadow-xs'
                  : 'text-[#474556] hover:text-[#0b1c30] hover:bg-[#f1f5f9]'
              }`}
            >
              <span>My Page</span>
            </button>

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-[#474556] hover:text-[#0b1c30] hover:bg-[#f1f5f9] transition-all flex items-center gap-1"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl py-2 z-40">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      showToast('Community Guidelines: 100% verified alpha, no spam, institutional respectful analysis.');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#0b1c30] hover:bg-[#f8fafc] flex items-center gap-2 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#5338ec]" />
                    <span>Community Guidelines</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      showToast('Redirecting to MarketSyde VIP Discord');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#0b1c30] hover:bg-[#f8fafc] flex items-center gap-2 font-medium"
                  >
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                    <span>VIP Discord Lounge</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      showToast('Rebate Pool: $142,850 distributed to traders this month');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#0b1c30] hover:bg-[#f8fafc] flex items-center gap-2 font-medium"
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Cashback Rebate Pools</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Notifications Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setUnreadNotifications(0);
              }}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-slate-200 text-xs font-semibold text-[#0b1c30] transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-[#5338ec]" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadNotifications > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#5338ec] text-white text-[10px] flex items-center justify-center font-mono font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── NOTIFICATIONS DRAWER / MODAL ─── */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl w-full max-w-sm text-[#0b1c30] shadow-2xl p-5 space-y-4 mt-16 animate-in slide-in-from-right-5 duration-200">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#5338ec]" />
                <h4 className="text-sm font-bold text-[#0b1c30]">Community Alerts</h4>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="text-[#474556] hover:text-[#0b1c30]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="font-semibold text-[#0b1c30]">
                  Michael Saylor commented on your Bitcoin thesis
                </p>
                <span className="text-[10px] text-[#474556] font-mono">15m ago</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="font-semibold text-[#0b1c30]">
                  Upcoming Live: "Weekly Crypto Forecast" in 2 hours
                </p>
                <span className="text-[10px] text-[#474556] font-mono">1h ago</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <p className="font-semibold text-[#0b1c30]">
                  Cashback reward of $14.80 credited from IC Markets trades
                </p>
                <span className="text-[10px] text-[#474556] font-mono">3h ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <main>
        {/* SUB-VIEW 1: FEEDS */}
        {activeSubTab === 'feeds' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-9">
              <CommunityFeedsView
                posts={posts}
                onToggleLike={handleToggleLike}
                onToggleFollowAuthor={handleToggleFollowAuthor}
                onAddComment={handleAddComment}
                onOpenCreatePost={() => setIsCreateModalOpen(true)}
                onSelectInfluencerByHandle={handleSelectInfluencerByHandle}
                onOpenAdvancedChart={(symbol) => onOpenAdvancedChart?.(symbol)}
                user={user}
              />
            </div>
            <div className="xl:col-span-3">
              <CommunityRightSidebar
                mode="default"
                onSelectInfluencer={handleSelectInfluencer}
                onOpenHotTopic={() => setActiveSubTab('topics')}
                onShowToast={showToast}
              />
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: TOPICS */}
        {activeSubTab === 'lives' && (
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-rose-500" />
                    <h2 className="text-lg font-bold text-[#0b1c30]">Community Media Hub</h2>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-[#64748b]">Collect live streams, podcasts, music shows, and internet radio from every platform into one MarketSyde community hub.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Creator tools</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {['All', 'Twitch', 'YouTube', 'TikTok', 'Facebook', 'Instagram', 'Discord', 'Spotify', 'Apple Music', 'SoundCloud', 'Mixcloud', 'TuneIn', 'Other radio'].map((platform) => {
                  const connected = connectedLivePlatforms[platform];
                  const selected = mediaFilter === platform;
                  return (
                    <button key={platform} type="button" onClick={() => { setMediaFilter(platform); showToast(platform === 'All' ? 'Showing all community media' : `Filtering media from ${platform}`); }} className={`rounded-lg border p-2.5 text-left transition-colors ${selected ? 'border-[#5338ec] bg-violet-50 ring-1 ring-[#5338ec]' : 'border-[#e2e8f0] hover:border-[#5338ec] hover:bg-violet-50'}`}>
                      <div className="flex items-center gap-2"><span className={`flex h-6 w-6 items-center justify-center rounded-md ${platformIcons[platform].color} text-[11px] font-black text-white`}>{platformIcons[platform].mark}</span><span className="truncate text-xs font-bold text-[#0b1c30]">{platform}</span>{connected && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-600" />}</div>
                      <span className="mt-1 block pl-8 text-[9px] text-slate-500">{selected ? 'Selected' : 'Filter source'}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50/60 p-2.5">
                <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-wide text-violet-700">Sub-channel</span><span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#0b1c30]">{mediaFilter === 'All' ? 'All channels' : `${mediaFilter} channels`}</span><span className="text-[10px] text-slate-500">Live streams · Podcasts · Radio · Replays</span></div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5"><span className="mr-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">Language</span>{['All languages', 'English', 'ไทย', 'Español', '日本語', '한국어', '中文'].map((language) => <button key={language} type="button" onClick={() => setLanguageFilter(language)} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition ${languageFilter === language ? 'border-[#5338ec] bg-[#5338ec] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'}`}>{language}</button>)}</div>
            </section>
            {customMedia.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-rose-200 bg-[#0b1c30] text-white shadow-xs">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" /><span className="text-sm font-bold">Live now</span></div>
                  <span className="rounded-full bg-rose-500/20 px-2 py-1 text-[10px] font-semibold text-rose-200">Community stream</span>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                  {customMedia.map(([icon, title, source], index) => (
                    <button key={`${title}-${index}`} type="button" onClick={() => showToast(`Opening ${title}`)} className="group rounded-xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-white/50 hover:bg-white/10">
                      <div className="relative h-24 overflow-hidden rounded-lg bg-slate-800 shadow-inner"><img src={getMediaCover(source)} alt={`${title} cover`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /></div>
                      <div className="mt-3 flex items-start justify-between gap-2"><div><p className="text-xs font-bold text-white">{title}</p><p className="mt-1 text-[10px] text-slate-300">{source}</p></div><span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${getPlatformTheme(source).badge}`}>{String(source).includes('Live') || String(source).includes('On air') ? 'LIVE' : 'MEDIA'}</span></div>
                    </button>
                  ))}
                </div>
              </section>
            )}
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-[#0b1c30]">Add media to your hub</h3>
              <p className="mt-1 text-xs text-slate-500">Paste a public live stream, podcast episode, music show, radio station, or channel URL.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input value={liveSourceUrl} onChange={(event) => setLiveSourceUrl(event.target.value)} placeholder="https://open.spotify.com/... or https://youtube.com/..." className="min-w-0 flex-1 rounded-xl border border-[#e2e8f0] px-3 py-2 text-sm outline-none focus:border-[#5338ec]" />
                <button type="button" disabled={!liveSourceUrl.trim()} onClick={() => {
                  const url = liveSourceUrl.trim();
                  const platform = url.includes('spotify') ? 'Spotify' : url.includes('youtube') || url.includes('youtu.be') ? 'YouTube' : url.includes('twitch') ? 'Twitch' : url.includes('soundcloud') ? 'SoundCloud' : url.includes('mixcloud') ? 'Mixcloud' : url.includes('tunein') ? 'TuneIn' : 'Other radio';
                  setCustomMedia((current) => [['✨', `Community media · ${platform}`, `${platform} · Just added`], ...current]);
                  setMediaFilter('All');
                  showToast('Media source added to your community hub.');
                  setLiveSourceUrl('');
                }} className="rounded-xl bg-[#5338ec] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Add media</button>
              </div>
            </section>
            <section className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-bold text-[#0b1c30]">Unified community media</h3><p className="mt-1 text-xs text-slate-500">Everything your community has synced, in one place.</p></div><span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">{mediaFilter === 'All' ? `${customMedia.length + 6} items synced` : `Filtered: ${mediaFilter}`}</span></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ['🔴', 'Crypto Market Open Live', 'YouTube · Live now'],
                  ['🎙️', 'The Alpha Signals Podcast', 'Spotify · Episode 42'],
                  ['📻', 'Global Markets Radio', 'TuneIn · On air'],
                  ['🎧', 'Trading Floor After Hours', 'Apple Music · Mix'],
                  ['🟣', 'DeFi Builders Room', 'Twitch · Starting soon'],
                  ['🎶', 'Macro Voices Weekly', 'SoundCloud · New episode'],
                  ...customMedia,
                ].filter(([, title, source]) => (mediaFilter === 'All' || String(source).startsWith(mediaFilter)) && (languageFilter === 'All languages' || getMediaLanguage(String(title)) === languageFilter)).map(([icon, title, source]) => <button key={`${title}-${source}`} type="button" onClick={() => showToast(`Opening ${title}`)} className="rounded-xl border border-[#e2e8f0] p-3 text-left hover:border-[#5338ec] hover:bg-violet-50"><div className="flex items-start gap-2"><span className="text-xl">{icon}</span><div><p className="text-xs font-bold text-[#0b1c30]">{title}</p><p className="mt-1 text-[10px] text-slate-500">{source} · {getMediaLanguage(String(title))}</p></div></div></button>)}
              </div>
            </section>
          </div>
        )}

        {/* SUB-VIEW 2: TOPICS */}
        {activeSubTab === 'topics' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-9">
              <CommunityTopicsView
                topics={COMMUNITY_TOPICS}
                posts={posts}
                onAnswerTopic={(topicId, answer) => {
                  showToast('Answer saved locally. Credit rewards require moderation, which is not connected in this demo.');
                }}
                onShowToast={showToast}
                onSelectInfluencer={handleSelectInfluencer}
                onOpenMedia={() => setActiveSubTab('lives')}
              />
            </div>
            <div className="xl:col-span-3">
              <CommunityRightSidebar
                mode="default"
                onSelectInfluencer={handleSelectInfluencer}
                onOpenHotTopic={() => {}}
                onShowToast={showToast}
              />
            </div>
          </div>
        )}

        {/* SUB-VIEW 3: MY PAGE */}
        {activeSubTab === 'my-page' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-9">
              <CommunityMyPageView
                user={user}
                userPosts={userPosts}
                onOpenCreatePost={() => setIsCreateModalOpen(true)}
                onUpdateUserProfile={onUpdateUserProfile}
                onDeletePost={(postId) => {
                  setUserPosts(userPosts.filter((p) => p.id !== postId));
                  setPosts(posts.filter((p) => p.id !== postId));
                  showToast('Post deleted');
                }}
                onShowToast={showToast}
              />
            </div>
            <div className="xl:col-span-3">
              <CommunityRightSidebar
                mode="default"
                onSelectInfluencer={handleSelectInfluencer}
                onOpenHotTopic={() => setActiveSubTab('topics')}
                onShowToast={showToast}
              />
            </div>
          </div>
        )}

        {/* SUB-VIEW 5: PROFILE PAGE (Viewing another creator, e.g. Crypto Adventure) */}
        {activeSubTab === 'profile' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-9">
              <CommunityProfileView
                influencer={selectedInfluencer || CRYPTO_ADVENTURE_PROFILE}
                posts={
                  selectedInfluencer?.id === 'inf-cryptoadventure' || !selectedInfluencer
                    ? CRYPTO_ADVENTURE_POSTS
                    : CRYPTO_ADVENTURE_POSTS.slice(0, 3)
                }
                onBackToFeeds={() => {
                  setActiveSubTab('feeds');
                  setSelectedInfluencer(null);
                }}
                onToggleFollow={(id) => {
                  showToast('Creator followed. Following does not earn rewards.');
                }}
                onShowToast={showToast}
              />
            </div>
            <div className="xl:col-span-3">
              <CommunityRightSidebar
                mode="profile"
                onSelectInfluencer={handleSelectInfluencer}
                onOpenHotTopic={() => setActiveSubTab('topics')}
                onShowToast={showToast}
              />
            </div>
          </div>
        )}
      </main>

      {/* ─── CREATE POST MODAL ─── */}
      <CreateCommunityPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        user={user}
      />
    </div>
  );
};
