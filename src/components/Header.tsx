/**
 * @file Header.tsx
 * Editorial Webzine Masthead & Navigation
 * Primary prominent category: 드라마 (Drama)
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Share2, 
  Database, 
  Globe, 
  Sparkles,
  Menu,
  X,
  Palette,
  Check
} from 'lucide-react';
import { EditorialCategory, ThemeMode } from '../types';
import { CATEGORIES } from '../data/mockArticles';
import { THEME_OPTIONS } from '../data/themes';

interface HeaderProps {
  currentCategory: EditorialCategory | 'all';
  onSelectCategory: (category: EditorialCategory | 'all') => void;
  currentTheme: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onGoHome: () => void;
  isDetailViewOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  currentTheme,
  onSelectTheme,
  onGoHome,
  isDetailViewOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const activeTheme = THEME_OPTIONS[currentTheme] || THEME_OPTIONS['cool-slate'];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs font-pretendard">
      {/* Top Editorial Utility Bar */}
      <div className="border-b border-slate-100 text-[11px] sm:text-[12px] text-slate-500 py-1.5">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-8 flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="tracking-tight text-slate-900 font-bold">ISSUE VOL. 48</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline font-medium text-slate-600">{today}</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              드라마 콘텐츠 허브
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Palette Switcher */}
            <div className="relative">
              <button
                id="btn-theme-switcher"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors cursor-pointer border border-slate-200"
                title="에디토리얼 바탕색 변경"
              >
                <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                <span className="hidden xs:inline text-slate-500">바탕색:</span>
                <span className="font-bold">{activeTheme.name.replace('모던 ', '')}</span>
              </button>

              {isThemeMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    새로운 에디토리얼 바탕색
                  </div>
                  <div className="space-y-1 mt-1">
                    {Object.values(THEME_OPTIONS).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTheme(t.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          currentTheme === t.id
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs ${t.bgClass}`}></span>
                          <span>{t.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{t.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onGoHome}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="tracking-[0.18em] text-[9px] sm:text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                EDITORIAL ARCHIVE
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                자사형 고품격 웹진
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2.5">
              {isDetailViewOpen ? (
                <span className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  스튜디오 드라마
                </span>
              ) : (
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  스튜디오 드라마
                </h1>
              )}
              <span className="text-xs sm:text-base lg:text-lg text-slate-400 sm:text-slate-500 font-light tracking-wider">
                Webzine
              </span>
            </div>
          </button>
        </div>

        {/* Action Controls & Fast Detail Preview Button */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            id="btn-share-header"
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
            title="웹진 주소 복사"
          >
            {copiedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar: DRAMA is prominent at the front! */}
      <nav className="border-t border-slate-200 bg-slate-50/90 backdrop-blur-xs px-2.5 sm:px-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max md:min-w-0">
          <ul className="flex items-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-0">
            <li className="shrink-0">
              <button
                id="tab-category-all"
                onClick={() => {
                  onSelectCategory('all');
                  if (isDetailViewOpen) onGoHome();
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  currentCategory === 'all' && !isDetailViewOpen
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                전체 피드
              </button>
            </li>

            {/* DRAMA CATEGORY (PROMINENT HIGHLIGHT) */}
            <li className="shrink-0">
              <button
                id="tab-category-drama"
                onClick={() => {
                  onSelectCategory('drama');
                  if (isDetailViewOpen) onGoHome();
                }}
                className={`relative px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  currentCategory === 'drama' && !isDetailViewOpen
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                    : 'bg-blue-100/70 text-blue-900 hover:bg-blue-200/80 border border-blue-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-200" />
                <span>★ 드라마<span className="hidden sm:inline"> (DRAMA)</span></span>
                <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded bg-blue-800 text-white font-semibold">
                  대표
                </span>
              </button>
            </li>

            {/* Other categories */}
            {CATEGORIES.filter(c => c.id !== 'drama').map(cat => (
              <li key={cat.id} className="shrink-0">
                <button
                  id={`tab-category-${cat.id}`}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    if (isDetailViewOpen) onGoHome();
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    currentCategory === cat.id && !isDetailViewOpen
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                  }`}
                >
                  {cat.nameKo}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              공개형 웹진 (로그인 불필요)
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-semibold">폰트: 프리텐다드 (Pretendard)</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-lg">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase px-2">주제별 둘러보기</div>
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
                if (isDetailViewOpen) onGoHome();
              }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
            >
              전체 피드
            </button>
            <button
              onClick={() => {
                onSelectCategory('drama');
                setMobileMenuOpen(false);
                if (isDetailViewOpen) onGoHome();
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold rounded-lg bg-blue-50 text-blue-700 flex items-center justify-between border border-blue-200"
            >
              <span>★ 드라마 (DRAMA)</span>
              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">대표 주제</span>
            </button>
            {CATEGORIES.filter(c => c.id !== 'drama').map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                  if (isDetailViewOpen) onGoHome();
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 text-slate-700"
              >
                {cat.nameKo}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <div className="text-[11px] font-bold text-slate-400 px-2">바탕색 선택</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEME_OPTIONS).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTheme(t.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 text-xs rounded-lg border text-left transition-all ${
                    currentTheme === t.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.badge}</div>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Copy notification toast */}
      {copiedToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3.5 py-1.5 bg-slate-900 text-white text-xs rounded-full shadow-lg flex items-center gap-1.5 z-50">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>웹진 링크가 클립보드에 복사되었습니다.</span>
        </div>
      )}
    </header>
  );
};

