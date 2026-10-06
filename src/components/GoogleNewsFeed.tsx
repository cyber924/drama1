import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Newspaper, 
  Sparkles, 
  Calendar, 
  Tv, 
  User, 
  PlayCircle,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  snippet: string;
  publishedAt: string;
  relativeTime?: string;
  category: 'drama' | 'actor' | 'ott';
}

export const GoogleNewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'drama' | 'actor' | 'ott'>('all');
  const [isFallback, setIsFallback] = useState(false);

  // Fetch articles from our server-side Google News API
  const fetchNews = async (queryTerm = '') => {
    setLoading(true);
    setIsFallback(false);
    try {
      const response = await fetch('/api/google-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: queryTerm }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      if (data.articles) {
        setArticles(data.articles);
      }
      if (data.status === 'fallback' || data.status === 'fallback_error') {
        setIsFallback(true);
      }
    } catch (error) {
      console.error('Failed to fetch google news:', error);
      // Client-side fail-safe fallback
      setIsFallback(true);
      setArticles([
        {
          title: "선재 업고 튀어 글로벌 신드롬 지속... 하반기 음원 챠트 및 소셜 버즈량 통합 1위 장악",
          url: "https://news.google.com/search?q=선재업고튀어",
          source: "에디토리얼 포커스",
          snippet: "드라마 '선재 업고 튀어'는 종영 이후에도 여전히 다양한 동영상 클립과 숏폼에서 조회수 1위를 지속하며 대세 로맨스 판타지로서 신드롬을 유지하고 있습니다.",
          publishedAt: new Date().toISOString().split('T')[0],
          category: "drama"
        },
        {
          title: "배우 변우석, 글로벌 아시아 팬미팅 전 석 매진 대기록... 대세 브랜드 파워 입증",
          url: "https://news.google.com/search?q=변우석",
          source: "스타 인사이트",
          snippet: "대세 배우로 우뚝 선 변우석이 차기 아시아 전역 투어 티켓 오픈과 동시에 트래픽 과부하를 일으키며 막강한 글로벌 브랜드 가치를 증명하고 있습니다.",
          publishedAt: new Date().toISOString().split('T')[0],
          category: "actor"
        },
        {
          title: "오징어 게임 시즌 2 공식 트레일러 글로벌 릴리즈... 전 세계 팬덤 실시간 긴장감 고조",
          url: "https://news.google.com/search?q=오징어게임2",
          source: "미디어 투데이",
          snippet: "넷플릭스의 메가 히트 서바이벌 시리즈 '오징어 게임2'가 티저 예고편과 시놉시스를 공식 발표하며 글로벌 스트리밍 예약 순위에서 압도적인 수치를 보이고 있습니다.",
          publishedAt: new Date().toISOString().split('T')[0],
          category: "ott"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery);
    fetchNews(searchQuery);
  };

  const handleRefresh = () => {
    fetchNews(activeQuery);
  };

  // Local filter
  const filteredArticles = articles.filter(art => {
    if (filterCategory === 'all') return true;
    return art.category === filterCategory;
  });

  const getCategoryBadge = (cat: 'drama' | 'actor' | 'ott') => {
    switch (cat) {
      case 'drama':
        return {
          label: '드라마 관련 기사',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Tv className="w-3 h-3" />
        };
      case 'actor':
        return {
          label: '배우 동향 & 연애',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <User className="w-3 h-3" />
        };
      case 'ott':
        return {
          label: 'OTT & 영화 트렌드',
          className: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: <PlayCircle className="w-3 h-3" />
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar - Emerald Wide Hero Section */}
      <div className="bg-slate-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-lg space-y-4 sm:space-y-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 font-black rounded-full border border-emerald-500/30 uppercase tracking-widest animate-pulse whitespace-nowrap">
                  24H GOOGLE NEWS
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 leading-snug">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-bounce shrink-0" />
                실시간 구글 뉴스 검색 그라운딩 및 연동
              </span>
            </div>
            
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {activeQuery ? `‘${activeQuery}’ 실시간 검색 피드` : '드라마 관련 기사 & 엔터 뉴스 📰'}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 sm:text-slate-400 leading-relaxed max-w-3xl font-normal">
              구글 뉴스 데이터베이스를 실시간 스캔하여 연예 기자들의 핵심 동향, 캐스팅 정보, 지상파 및 OTT 편성과 방영 반응 뉴스들을 24시간 필터링하여 실시간 송출합니다.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full md:w-auto z-10 pt-2 md:pt-0 border-t border-slate-800/80 md:border-t-0">
            <div className="text-left md:text-right">
              <div className="text-[10px] text-slate-500 font-semibold">동작 모드 상태</div>
              <div className="text-xs font-bold text-emerald-400">구글 서치 라이브 파이프라인</div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>뉴스 갱신</span>
            </button>
          </div>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 z-10 relative">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="특정 작품명, 배우 이름, OTT 키워드를 입력해 직접 구글 뉴스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            검색
          </button>
        </form>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800 pt-3 text-xs z-10 relative">
          <span className="text-slate-500 font-semibold mr-1">세부 필터링:</span>
          {[
            { id: 'all', label: '전체 뉴스', count: articles.length },
            { id: 'drama', label: '드라마 관련 기사', count: articles.filter(a => a.category === 'drama').length },
            { id: 'actor', label: '배우 동향 & 연애', count: articles.filter(a => a.category === 'actor').length },
            { id: 'ott', label: 'OTT & 영화 트렌드', count: articles.filter(a => a.category === 'ott').length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                  : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border border-transparent'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Fallback warning info */}
      {isFallback && (
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">실시간 뉴스 데모 모드 동작 중:</span> 현재 API 키 설정 전이거나 한도가 가득 차 고품질 미디어 뉴스 데이터셋으로 대체 로딩되었습니다. API 키가 등록되면 실제 구글 실시간 검색으로 동작합니다.
          </div>
        </div>
      )}

      {/* Loading Skeletal state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 4, 5].map((idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 rounded"></div>
                <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 bg-slate-200 rounded-full"></div>
                <div className="h-3.5 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-dashed border-slate-300">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-base text-slate-600 font-medium">
            조건에 부합하는 구글 실시간 기사가 없습니다.
          </p>
          <button
            onClick={() => {
              setFilterCategory('all');
              setSearchQuery('');
              setActiveQuery('');
              fetchNews();
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
          >
            기본 전체 뉴스로 돌아가기
          </button>
        </div>
      ) : (
        /* Actual Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article, index) => {
            const badge = getCategoryBadge(article.category);
            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={index}
                className="bg-white border border-slate-200 hover:border-blue-300/80 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${badge.className}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      {article.relativeTime || article.publishedAt}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                    {article.snippet}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    출처: {article.source}
                  </span>

                  <a
                    href={article.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <span>기사 전문 보기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
