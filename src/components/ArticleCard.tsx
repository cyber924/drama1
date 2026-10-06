/**
 * @file ArticleCard.tsx
 * Editorial Card component for grid and list feeds with Pretendard typography
 */

import React from 'react';
import { Clock, Eye, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { FirebaseArticleDoc } from '../types';

interface ArticleCardProps {
  article: FirebaseArticleDoc;
  onReadArticle: (article: FirebaseArticleDoc) => void;
  layout?: 'grid' | 'horizontal' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onReadArticle,
  layout = 'grid',
}) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (layout === 'horizontal') {
    return (
      <a
        href={`/blog/${article.id}`}
        onClick={(e) => {
          e.preventDefault();
          onReadArticle(article);
        }}
        className="group flex flex-col sm:flex-row gap-5 p-5 bg-white hover:bg-white rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer font-pretendard no-underline text-inherit block"
      >
        <div className="sm:w-1/3 shrink-0 overflow-hidden rounded-lg aspect-16/10 bg-slate-100 relative">
          <img
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-[10px] text-blue-200 font-semibold rounded">
            {article.categoryNameKo}
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="font-bold text-blue-600">{article.subCategory}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {article.readTimeMinutes}분 완독
              </span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
              {article.excerpt}
            </p>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="font-semibold text-slate-800">{article.author.name}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-400" />
                {article.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-rose-600">
                <Heart className="w-3 h-3 fill-rose-500/20 text-rose-500" />
                {article.likes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/blog/${article.id}`}
      onClick={(e) => {
        e.preventDefault();
        onReadArticle(article);
      }}
      className="group flex flex-col bg-white hover:bg-white rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden font-pretendard no-underline text-inherit block"
    >
      <div className="aspect-16/10 w-full overflow-hidden bg-slate-100 relative">
        <img
          src={article.coverImage.url}
          alt={article.coverImage.alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-xs text-[11px] text-blue-200 font-bold rounded">
          {article.categoryNameKo}
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] text-white/80 rounded">
          Unsplash
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-bold text-blue-600">{article.subCategory}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readTimeMinutes}분
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="font-semibold text-slate-800">{article.author.name}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-blue-600 transition-colors">
            <span>{formattedDate}</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </a>
  );
};
