/**
 * @file App.tsx
 * High-End Korean Editorial Webzine Blog Service
 * Primary Featured Topic: 드라마 (Drama)
 * Prepared for Firebase DB integration with 'AI 웹진 허브'
 * Optimized for Google & Naver Search Engines
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroLeadArticle } from './components/HeroLeadArticle';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailView } from './components/ArticleDetailView';
import { Footer } from './components/Footer';
import { EditorialAdSlot } from './components/EditorialAdSlot';
import { GoogleNewsFeed } from './components/GoogleNewsFeed';
import { LiveTopicRankings } from './components/LiveTopicRankings';
import { HotInfoFeed } from './components/HotInfoFeed';
import { 
  MOCK_ARTICLES, 
  PRIMARY_MOCK_ARTICLE, 
  CATEGORIES 
} from './data/mockArticles';
import { EditorialCategory, FirebaseArticleDoc, ThemeMode } from './types';
import { THEME_OPTIONS } from './data/themes';
import { fetchArticlesFromHub } from './lib/firebase';
import { getPublishedArticles, getArticleById } from './lib/articlesService';
import { 
  Tv, 
  Sparkles, 
  Search, 
  Filter, 
  SlidersHorizontal,
  Flame,
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState<FirebaseArticleDoc[]>(MOCK_ARTICLES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const [currentCategory, setCurrentCategory] = useState<EditorialCategory | 'all'>('drama');
  const [selectedArticle, setSelectedArticle] = useState<FirebaseArticleDoc | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('cool-slate');
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState<string>('전체');

  const activeTheme = THEME_OPTIONS[theme] || THEME_OPTIONS['cool-slate'];

  // Route synchronization for /blog/:id and browser navigation
  useEffect(() => {
    const handleLocationChange = async () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/blog/')) {
        const id = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
        if (id) {
          const found = await getArticleById(id);
          if (found) {
            setSelectedArticle(found);
            setIsNotFound(false);
          } else {
            setSelectedArticle(null);
            setIsNotFound(true);
            document.title = '글을 찾을 수 없습니다 | 에디토리얼 웹진 블로그';
          }
          return;
        }
      }
      setSelectedArticle(null);
      setIsNotFound(false);
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Fetch live articles from remote AI Webzine Hub on mount
  useEffect(() => {
    async function syncData() {
      setIsSyncing(true);
      try {
        const allPosts = await getPublishedArticles(true);
        if (allPosts && allPosts.length > 0) {
          setArticles(allPosts);
          setSyncCount(allPosts.length);
          
          // Re-check current route if waiting for async article
          const pathname = window.location.pathname;
          if (pathname.startsWith('/blog/')) {
            const id = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
            const found = allPosts.find(a => a.id === id || a.slug === id);
            if (found) {
              setSelectedArticle(found);
              setIsNotFound(false);
            } else {
              setIsNotFound(true);
            }
          }
        }
      } catch (error) {
        console.error('Articles synchronization failed:', error);
      } finally {
        setIsSyncing(false);
      }
    }
    syncData();
  }, []);

  const navigateToArticle = (art: FirebaseArticleDoc) => {
    window.history.pushState({}, '', `/blog/${art.id}`);
    setSelectedArticle(art);
    setIsNotFound(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = (resetCategory = false) => {
    window.history.pushState({}, '', '/');
    setSelectedArticle(null);
    setIsNotFound(false);
    if (resetCategory) {
      setCurrentCategory('drama');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter articles based on category and search
  const filteredArticles = articles.filter((art) => {
    // Category check
    if (currentCategory !== 'all' && art.category !== currentCategory) {
      return false;
    }
    // Sub-filter check if on drama
    if (currentCategory === 'drama' && subFilter !== '전체') {
      if (!art.subCategory.includes(subFilter) && !art.tags.some(t => t.includes(subFilter))) {
        return false;
      }
    }
    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchSubtitle = art.subtitle.toLowerCase().includes(q);
      const matchTag = art.tags.some(t => t.toLowerCase().includes(q));
      const matchAuthor = art.author.name.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchTag || matchAuthor;
    }
    return true;
  });

  // Current category info object
  const activeCategoryInfo = CATEGORIES.find(c => c.id === currentCategory);

  return (
    <div className={`min-h-screen ${activeTheme.bgClass} ${activeTheme.textClass} flex flex-col font-pretendard selection:bg-blue-100 selection:text-blue-900 transition-all duration-500 ease-in-out`}>
      {/* Top Masthead & Navigation */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          navigateHome(false);
          setSubFilter('전체');
        }}
        currentTheme={theme}
        onSelectTheme={setTheme}
        onGoHome={() => navigateHome(true)}
        isDetailViewOpen={!!selectedArticle}
      />

      {/* Main View Area */}
      <div className="flex-1">
        {isNotFound ? (
          /* ========================================================== */
          /* 0. 404 NOT FOUND VIEW */
          /* ========================================================== */
          <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center font-pretendard">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-full text-xs font-bold tracking-wider mb-5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>404 NOT FOUND</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
              요청한 글을 찾을 수 없습니다.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto font-normal">
              입력하신 주소의 게시글이 존재하지 않거나, 삭제 또는 비공개 처리되었습니다.<br />
              주소가 올바른지 다시 한번 확인해 주시기 바랍니다.
            </p>
            <button
              onClick={() => navigateHome(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>홈으로 돌아가기</span>
            </button>
          </div>
        ) : selectedArticle ? (
          /* ========================================================== */
          /* 1. EDITORIAL ARTICLE DETAIL VIEW */
          /* ========================================================== */
          <ArticleDetailView
            article={selectedArticle}
            theme={theme}
            onBack={() => navigateHome(false)}
            onSelectRelatedArticle={(slug) => {
              const target = articles.find(a => a.slug === slug || a.id === slug);
              if (target) navigateToArticle(target);
            }}
          />
        ) : (
          /* ========================================================== */
          /* 2. MAIN WEBZINE HOME & SUB TOPIC PAGES */
          /* ========================================================== */
          <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 space-y-6 sm:space-y-12 font-pretendard">
            {/* If on Drama or All, display the Hero Lead Feature */}
            {(currentCategory === 'drama' || currentCategory === 'all') && !searchQuery && (
              <HeroLeadArticle
                article={articles[0] || PRIMARY_MOCK_ARTICLE}
                onReadArticle={navigateToArticle}
              />
            )}

            {currentCategory === 'interview' ? (
              <GoogleNewsFeed />
            ) : currentCategory === 'screenplay' ? (
              <LiveTopicRankings articles={articles} onReadArticle={navigateToArticle} />
            ) : currentCategory === 'hotinfo' ? (
              <HotInfoFeed />
            ) : (
              /* Topic Header & Sub-filters */
              <section className="space-y-6">
                {/* 1. Drama Critique / Editorial Wide Hero Section (Blue Slate Theme) */}
                {(currentCategory === 'drama' || currentCategory === 'critique') && (
                  <div className="bg-slate-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-lg space-y-4 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-500/15 text-blue-400 font-black rounded-full border border-blue-500/30 uppercase tracking-widest animate-pulse whitespace-nowrap">
                              K-DRAMA RESEARCH
                            </span>
                            <span className="hidden sm:inline text-slate-600">|</span>
                          </div>
                          <span className="text-xs text-blue-400 font-bold flex items-center gap-1 leading-snug">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            전문가 연재 서사학 비평 칼럼집
                          </span>
                        </div>
                        
                        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                          드라마 심층 비평 아카이브 🎬
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-300 sm:text-slate-400 leading-relaxed max-w-3xl font-normal">
                          박지은, 임상춘, 김은희 등 시대를 풍미하는 한국 최고 극작가들의 서사 설계도를 분해하고, 대사 한 구절 속에 내재된 인물의 심리 구조와 클리셰 전복의 쾌감을 깊이 있게 추적하는 고품격 에디토리얼 평론집입니다.
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full md:w-auto z-10 bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
                        <div className="text-left md:text-right">
                          <div className="text-[10px] text-slate-500 font-semibold">아카이브 분석</div>
                          <div className="text-xs font-bold text-blue-400">{filteredArticles.length}개의 비평 컬렉션 수록</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Cinema & OTT Wide Hero Section (Purple/Violet Theme) */}
                {currentCategory === 'cinema' && (
                  <div className="bg-slate-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-lg space-y-4 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2 z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-purple-500/15 text-purple-400 font-black rounded-full border border-purple-500/30 uppercase tracking-widest animate-pulse whitespace-nowrap">
                              CINEMA & STREAMING
                            </span>
                            <span className="hidden sm:inline text-slate-600">|</span>
                          </div>
                          <span className="text-xs text-purple-400 font-bold flex items-center gap-1 leading-snug">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            스크린 미장센 및 글로벌 OTT 서사학
                          </span>
                        </div>
                        
                        <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                          시네마 & OTT 비평 채널 🎞️
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-slate-300 sm:text-slate-400 leading-relaxed max-w-3xl font-normal">
                          정통 영화관 스크린의 정교한 연출 기법부터 넷플릭스·디즈니+ 등 대작 스트리밍 콘텐츠들의 최신 시각적 패러다임, 고해상도 미장센, 그리고 글로벌 시청 트렌드를 입체적이고 다각적으로 해독합니다.
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full md:w-auto z-10 bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
                        <div className="text-left md:text-right">
                          <div className="text-[10px] text-slate-500 font-semibold">시각 패러다임 분석</div>
                          <div className="text-xs font-bold text-purple-400">{filteredArticles.length}개의 영상 칼럼 발행</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Filters / Search Actions line */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <Tv className="w-4 h-4 text-slate-400" />
                    <span>선택된 주제: <strong className="text-slate-900">{activeCategoryInfo?.nameKo || '전체 아카이브'}</strong></span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-medium">검색된 글 {filteredArticles.length}개</span>
                  </div>

                  {/* Search Bar & Sub Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="작품명, 작가, 키워드 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-60 pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Drama Specific Sub-topics Tag Bar */}
                {currentCategory === 'drama' && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                      <Filter className="w-3 h-3 text-slate-400" /> 세부 분류:
                    </span>
                    {['전체', 'K-드라마 심층비평', '신작 프리뷰', '각본 & 대사학', '눈물의여왕', '임상춘', '김은희'].map((filterName) => (
                      <button
                        key={filterName}
                        onClick={() => setSubFilter(filterName)}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer shrink-0 font-medium ${
                          subFilter === filterName
                            ? 'bg-slate-900 text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {filterName}
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Page Ad Slot (메인페이지 광고 자리 1개) */}
                <EditorialAdSlot
                  slotId="ad-slot-main-feed"
                  placement="main-feed"
                  className="my-1"
                />

                {/* Articles Grid */}
                {filteredArticles.length === 0 ? (
                  <div className="py-16 text-center space-y-3 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-base text-slate-600 font-medium">
                      검색 조건에 맞는 에디토리얼 글이 없습니다.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSubFilter('전체');
                        setCurrentCategory('drama');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      드라마 전체 피드로 돌아가기
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onReadArticle={(art) => setSelectedArticle(art)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

          </main>
        )}
      </div>

      {/* Editorial Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setSelectedArticle(null);
          setSubFilter('전체');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
