/**
 * @file HeroLeadArticle.tsx
 * Ultra-modern editorial featured hero showcasing the primary '드라마' category
 * Rendered exclusively with Pretendard typography and contemporary slate styling
 */

import React from 'react';
import { Clock, Eye, Sparkles, ArrowRight, Bookmark, Flame } from 'lucide-react';
import { FirebaseArticleDoc } from '../types';

interface HeroLeadArticleProps {
  article: FirebaseArticleDoc;
  onReadArticle: (article: FirebaseArticleDoc) => void;
}

export const HeroLeadArticle: React.FC<HeroLeadArticleProps> = ({
  article,
  onReadArticle,
}) => {
  return (
    <section className="mb-6 sm:mb-12 font-pretendard">
      {/* Editorial Category Eyebrow */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-600 rounded-none inline-block shrink-0"></span>
          <h2 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight">
            이 주의 에디토리얼 커버 스토리 — 드라마
          </h2>
          <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
            AI 웹진 허브 엄선작
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-semibold tracking-wider uppercase shrink-0">
          <span className="hidden xs:inline">FEATURED ESSAY</span>
          <span className="hidden xs:inline">·</span>
          <span>NO. 01</span>
        </div>
      </div>

      {/* Hero Layout: 2-Column Desktop Editorial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12 items-center bg-white p-4 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
        {/* Left: Unsplash Editorial Visual */}
        <div className="lg:col-span-7 relative group overflow-hidden rounded-xl">
          <div className="aspect-16/10 sm:aspect-16/9 overflow-hidden bg-slate-100">
            <img
              src={article.coverImage.url}
              alt={article.coverImage.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Photo credit overlay */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-xs text-[11px] text-white/90 rounded">
            Photo by {article.coverImage.creditName} on Unsplash
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-blue-300 text-xs font-bold rounded-md shadow-md backdrop-blur-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>드라마 심층 리포트</span>
          </div>
        </div>

        {/* Right: Editorial Narrative Content */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-700 tracking-wider uppercase px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                {article.subCategory}
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {article.readTimeMinutes}분 완독
              </span>
            </div>

            <a
              href={`/blog/${article.id}`}
              onClick={(e) => {
                e.preventDefault();
                onReadArticle(article);
              }}
              className="block text-inherit no-underline"
            >
              <h3 
                className="text-xl sm:text-3xl lg:text-[32px] font-black text-slate-900 leading-[1.3] hover:text-blue-600 transition-colors cursor-pointer"
              >
                {article.title}
              </h3>
            </a>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 font-normal">
              {article.subtitle}
            </p>
          </div>

          {/* Excerpt Box */}
          <div className="border-l-3 border-blue-600 pl-4 py-1.5 text-xs text-slate-600 italic leading-relaxed bg-slate-50 rounded-r-md">
            "{article.excerpt}"
          </div>

          {/* Byline and Action */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {article.author.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {article.author.role}
                </div>
              </div>
            </div>

            <a
              id="btn-read-hero-lead"
              href={`/blog/${article.id}`}
              onClick={(e) => {
                e.preventDefault();
                onReadArticle(article);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-blue-600 transition-all text-xs font-bold tracking-tight shadow-sm cursor-pointer group no-underline"
            >
              <span>상세 칼럼 완독</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-300 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
