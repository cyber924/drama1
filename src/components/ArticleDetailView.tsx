/**
 * @file ArticleDetailView.tsx
 * Ultra-high-craft Editorial Webzine Detail Page Mockup
 * Designed for client verification of layout, typography, Unsplash visuals,
 * Firebase data structure components, and Google/Naver SEO readiness.
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  BookmarkCheck,
  Check, 
  Database, 
  Globe, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  Send,
  ChevronRight,
  Tv,
  Star
} from 'lucide-react';
import { FirebaseArticleDoc, EditorialBlock, ThemeMode } from '../types';
import { THEME_CONFIGS } from '../data/themes';
import { EditorialAdSlot } from './EditorialAdSlot';
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd, normalizeSiteUrl, DEFAULT_SITE_NAME } from '../lib/seoHelper';

interface ArticleDetailViewProps {
  article: FirebaseArticleDoc;
  onBack: () => void;
  onSelectRelatedArticle: (slug: string) => void;
  theme?: ThemeMode;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onSelectRelatedArticle,
  theme = 'cool-slate',
}) => {
  const activeTheme = THEME_CONFIGS[theme] || THEME_CONFIGS['cool-slate'];
  const [likes, setLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [comments, setComments] = useState<{ id: string; name: string; text: string; time: string }[]>([
    {
      id: 'c-1',
      name: '드라마애호가',
      text: '용두리와 독일 포츠담의 미장센 대비를 짚어주신 부분이 정말 탁월합니다. 멜로 클리셰를 비틀어낸 박지은 작가의 완급조절이 다시금 보이네요!',
      time: '1시간 전',
    },
    {
      id: 'c-2',
      name: '각본연구생',
      text: '제5화 대본 지문 분석에서 소음 페이드아웃 디테일까지 정리되어 있어서 감탄했습니다. 에디토리얼 웹진 퀄리티 최고입니다.',
      time: '3시간 전',
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Dynamic Google & Naver SEO Meta, Self-Referencing Canonical & JSON-LD Sync
  useEffect(() => {
    const siteUrl = normalizeSiteUrl(window.location.origin);
    const postUrl = `${siteUrl}/blog/${article.id}`;
    const previousTitle = document.title;

    // 1. Title
    document.title = `${article.title} | ${DEFAULT_SITE_NAME}`;

    // 2. Canonical
    let canonicalTag = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    const previousCanonical = canonicalTag.href;
    canonicalTag.href = postUrl;

    // 3. OpenGraph & Twitter Meta Tags
    const setMetaTag = (propertyOrName: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property='${propertyOrName}']` : `meta[name='${propertyOrName}']`;
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) tag.setAttribute('property', propertyOrName);
        else tag.setAttribute('name', propertyOrName);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const description = article.excerpt || article.subtitle || article.title;
    setMetaTag('description', description, false);
    setMetaTag('og:type', 'article', true);
    setMetaTag('og:title', article.title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', article.coverImage?.url || '', true);
    setMetaTag('og:url', postUrl, true);
    setMetaTag('article:published_time', new Date(article.publishedAt).toISOString(), true);
    setMetaTag('article:modified_time', article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date(article.publishedAt).toISOString(), true);
    setMetaTag('twitter:card', 'summary_large_image', false);
    setMetaTag('twitter:title', article.title, false);
    setMetaTag('twitter:description', description, false);
    setMetaTag('twitter:image', article.coverImage?.url || '', false);

    // 4. Schema.org JSON-LD (BlogPosting & BreadcrumbList)
    let jsonLdScript = document.getElementById('client-article-ld') as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'client-article-ld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify([
      buildBlogPostingJsonLd(siteUrl, article, DEFAULT_SITE_NAME),
      buildBreadcrumbJsonLd(siteUrl, article)
    ]);

    return () => {
      document.title = previousTitle || `${DEFAULT_SITE_NAME} | 드라마 & 문화 아카이브`;
      if (canonicalTag && previousCanonical) {
        canonicalTag.href = previousCanonical;
      }
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    };
  }, [article]);

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const authorName = newCommentName.trim() || '익명의 독자';
    setComments(prev => [
      {
        id: `c-${Date.now()}`,
        name: authorName,
        text: newCommentText.trim(),
        time: '방금 전',
      },
      ...prev,
    ]);
    setNewCommentName('');
    setNewCommentText('');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={`min-h-screen ${activeTheme.bg} pb-24 ${activeTheme.text} font-pretendard transition-colors duration-300`}>
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Breadcrumb & Action Sub-nav */}
      <div className={`border-b ${activeTheme.border} ${activeTheme.card} backdrop-blur-md py-3 px-4 sm:px-8 sticky top-0 z-30 shadow-xs`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
            <button
              id="btn-back-to-list"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>홈</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium hidden sm:inline">{article.categoryNameKo || '드라마'}</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-blue-600 font-semibold truncate max-w-[180px] sm:max-w-[340px]">{article.title}</span>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-article-share"
              onClick={handleCopyLink}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              title="링크 복사"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Copy notification toast */}
      {copiedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full shadow-xl flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>기사 링크가 클립보드에 복사되었습니다!</span>
        </div>
      )}

      {/* Article Header Section */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
        {/* Category & Tag Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-md tracking-wide">
            <Tv className="w-3.5 h-3.5 text-blue-300" />
            ★ {article.categoryNameKo}
          </span>
          <span className="text-xs text-blue-700 font-bold px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md">
            {article.subCategory}
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {article.readTimeMinutes}분 완독
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-200/80">
            실시간 콘텐츠 허브 연동작
          </span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 leading-[1.25] tracking-tight mb-5">
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 border-l-3 border-blue-600 pl-4 py-0.5 font-normal">
          {article.subtitle}
        </p>

        {/* Author Byline & Meta Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3.5">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <div className="font-bold text-sm sm:text-base text-slate-900">
                {article.author.name}
              </div>
              <div className="text-xs text-slate-500 font-normal">
                {article.author.role} · {article.author.organization}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">발행일</span>
              <span className="font-semibold text-slate-800">{formattedDate}</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">조회수</span>
              <span className="font-semibold text-slate-800">{article.views.toLocaleString()}회</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Unsplash Feature Photography */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <figure className="space-y-2">
          <div className="overflow-hidden rounded-2xl bg-stone-200 aspect-16/9 shadow-sm">
            <img
              src={article.coverImage.url}
              alt={article.coverImage.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-xs text-[#7A7166] flex flex-wrap items-center justify-between px-1 pt-1 font-sans">
            <span>{article.coverImage.alt}</span>
            <a
              href={article.coverImage.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-stone-800 underline inline-flex items-center gap-1"
            >
              <span>Photo by {article.coverImage.creditName} (Unsplash)</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </figcaption>
        </figure>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sticky Sidebar: Table of Contents & Hub Metadata */}
        <aside className="lg:col-span-4 space-y-6 font-pretendard">
          {/* Table of contents */}
          <div className="sticky top-20 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                목차 (CONTENTS)
              </span>
              <span className="text-[11px] text-blue-600 font-bold">6개 챕터</span>
            </div>

            <nav className="space-y-1.5">
              {article.tableOfContents.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left py-2 px-2.5 rounded-lg text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-colors flex items-start gap-2 group cursor-pointer"
                >
                  <span className="text-blue-500 font-bold group-hover:text-blue-700">
                    0{idx + 1}.
                  </span>
                  <span className="line-clamp-1">
                    {item.title.replace(/^\d+\.\s*/, '')}
                  </span>
                </button>
              ))}
            </nav>

            {/* Content Hub Sync Info Card */}
            <div className="pt-4 border-t border-slate-100 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>실시간 콘텐츠 허브 연동 메타데이터</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">컬렉션:</span>
                  <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800 font-mono">articles</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">문서 ID:</span>
                  <code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800 truncate max-w-[140px] font-mono" title={article.id}>
                    {article.id}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">동기화 상태:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    검증 완료 (Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Reading Actions Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <button
                id="btn-like-article"
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hasLiked 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                <span>{likes.toLocaleString()}</span>
              </button>

              <button
                id="btn-bookmark-article"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isBookmarked ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="북마크"
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-blue-700" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                id="btn-copy-link-sidebar"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>공유</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Main Article Content (Typography & Blocks) */}
        <main className="lg:col-span-8 space-y-8 font-pretendard">
          {/* Render Editorial Blocks */}
          {article.contentBlocks.map((block) => {
            if (block.type === 'paragraph') {
              return (
                <p 
                  key={block.id}
                  className={`text-base sm:text-[17px] leading-[1.85] text-slate-800 font-normal ${
                    block.hasDropCap ? 'editorial-drop-cap' : ''
                  }`}
                >
                  {block.content}
                </p>
              );
            }

            if (block.type === 'heading') {
              // Map heading to TOC ID
              const matchingToc = article.tableOfContents.find(t => 
                block.content?.includes(t.title) || t.title.includes(block.content || '')
              );
              const anchorId = matchingToc ? matchingToc.id : block.id;

              return (
                <div key={block.id} id={anchorId} className="pt-8 scroll-mt-24">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="w-2.5 h-2.5 bg-blue-600 inline-block"></span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {block.content}
                    </h2>
                  </div>
                  <div className="h-px w-full bg-slate-200"></div>
                </div>
              );
            }

            if (block.type === 'pullQuote') {
              return (
                <figure key={block.id} className="my-8 py-6 px-6 sm:px-8 bg-blue-50/70 border-l-4 border-blue-600 rounded-r-xl">
                  <blockquote className="italic text-lg sm:text-xl text-slate-800 leading-relaxed font-semibold">
                    “{block.content}”
                  </blockquote>
                  {(block.quoteAuthor || block.quoteSource) && (
                    <figcaption className="mt-3 text-right text-xs text-blue-700 font-bold">
                      — {block.quoteAuthor} {block.quoteSource && <span className="text-slate-500 font-normal">({block.quoteSource})</span>}
                    </figcaption>
                  )}
                </figure>
              );
            }

            if (block.type === 'dualImage' && block.leftImage && block.rightImage) {
              return (
                <div key={block.id} className="my-8 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <figure className="space-y-1.5">
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100">
                        <img 
                          src={block.leftImage.url} 
                          alt={block.leftImage.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-600 font-medium">
                        {block.leftImage.caption}
                      </figcaption>
                    </figure>

                    <figure className="space-y-1.5">
                      <div className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100">
                        <img 
                          src={block.rightImage.url} 
                          alt={block.rightImage.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <figcaption className="text-[11px] text-slate-600 font-medium">
                        {block.rightImage.caption}
                      </figcaption>
                    </figure>
                  </div>
                  <div className="text-[10px] text-right text-slate-400">
                    Unsplash Editorial Curation / Scene Contrast Study
                  </div>
                </div>
              );
            }

            if (block.type === 'sceneBreakdown' && block.scriptLines) {
              return (
                <React.Fragment key={block.id}>
                  <section className="my-8 bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">
                        {block.sceneEpisode}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {block.sceneTitle}
                      </h3>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-blue-200 font-semibold border border-slate-700">
                      대본 텍스트 분석
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    {block.scriptLines.map((line, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-blue-300 min-w-[70px] shrink-0">
                            {line.speaker}:
                          </span>
                          <span className="text-slate-200 leading-relaxed font-normal">
                            "{line.text}"
                          </span>
                        </div>
                        {line.note && (
                          <div className="pl-[78px] text-[11px] text-slate-400 italic">
                            {line.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* In-Article Advertisement Slot (상세페이지 본문 광고 자리 1개) */}
                <EditorialAdSlot
                  slotId="ad-slot-in-article"
                  placement="article-content"
                  className="my-8"
                />
              </React.Fragment>
            );
          }

            if (block.type === 'callout') {
              return (
                <div key={block.id} className="my-8 p-5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>{block.calloutTitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {block.content}
                  </p>
                </div>
              );
            }

            if (block.type === 'characterMatrix' && block.characters) {
              return (
                <div key={block.id} className="my-8 space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    인물 심리 축 & 서사적 갈등 구도
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {block.characters.map((char, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-lg border border-slate-200 space-y-2 shadow-xs">
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {char.name}
                          </div>
                          <div className="text-[11px] text-blue-600 font-semibold">
                            {char.actor}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed font-normal">
                          <span className="text-slate-400 text-[10px] block font-medium">성격 및 내면:</span>
                          {char.trait}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2 font-normal">
                          <span className="text-slate-400 text-[10px] block font-medium">서사적 핵심 갈등:</span>
                          {char.conflict}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (block.type === 'editorVerdict') {
              return (
                <div key={block.id} className="my-10 p-6 sm:p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-5 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                        에디터 최종 총평 & 3줄 요약
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white">
                        {block.verdictHighlight}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-lg shadow-xs">
                      <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span className="font-bold text-lg">{block.verdictScore?.toFixed(1)}</span>
                      <span className="text-xs text-blue-200">/ 5.0</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 font-normal">
                    {block.verdictPoints?.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-blue-400 font-bold">•</span>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            return null;
          })}

          {/* Article Tags */}
          <div className="pt-8 border-t border-slate-200">
            <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
              관련 키워드 및 색인 (Google & Naver Search Keywords)
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs rounded-full transition-colors font-medium cursor-pointer border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Extended Profile Box */}
          <div className="my-8 p-6 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-5 items-start shadow-xs">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <h4 className="font-bold text-base text-slate-900">
                  {article.author.name}
                </h4>
                <span className="text-xs text-slate-500">{article.author.role}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {article.author.bio}
              </p>
            </div>
          </div>

          {/* Open Reaction & Comment Section (No login required!) */}
          <section className="pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>독자 코멘트 및 한줄 평 ({comments.length})</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                로그인 없이 누구나 자유롭게 작성 가능
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="작성자 닉네임 (예: 드라마광)"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-1/3 bg-slate-50 text-slate-800"
                />
                <input
                  type="text"
                  placeholder="드라마나 글에 대한 생각이나 의견을 남겨주세요."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 bg-slate-50 text-slate-800"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{comment.name}</span>
                    <span className="text-[11px] text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-normal">{comment.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Navigation Button */}
          <div className="pt-10 flex items-center justify-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white hover:bg-blue-600 text-sm font-bold tracking-tight shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>웹진 목록 및 다른 드라마 기사 보기</span>
            </button>
          </div>
        </main>
      </div>
    </article>
  );
};
