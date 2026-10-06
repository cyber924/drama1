/**
 * @file Footer.tsx
 * Editorial Webzine Footer with SEO status, Open Public access notice, and Topic Directory
 */

import React, { useState } from 'react';
import { 
  Tv, 
  Globe, 
  Database, 
  Rss, 
  Mail, 
  Check, 
  Sparkles,
  Shield,
  Search
} from 'lucide-react';
import { EditorialCategory } from '../types';
import { CATEGORIES } from '../data/mockArticles';

interface FooterProps {
  onSelectCategory: (category: EditorialCategory | 'all') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 pt-14 pb-12 font-pretendard">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Manifesto */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="tracking-[0.2em] text-[10px] uppercase font-bold text-blue-400 block">
                THE EDITORIAL WEBZINE
              </span>
              <h3 className="text-2xl font-black text-white">
                스튜디오 드라마 웹진
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md font-normal">
              K-드라마의 서사 구조, 각본의 호흡, 연출 미학을 깊이 있게 조명하는 고품격 공개형 에디토리얼 미디어입니다.
              누구나 로그인 없이 모든 비평과 분석을 온전히 열람할 수 있습니다.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                드라마 콘텐츠 허브
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Google & Naver SEO 표준
              </span>
            </div>
          </div>

          {/* Col 2: Topics Directory */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              주제별 아카이브 (TOPICS)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('drama')}
                  className="hover:text-blue-400 font-bold text-blue-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Tv className="w-3.5 h-3.5 text-blue-400" />
                  <span>★ 드라마 (대표 카테고리)</span>
                </button>
              </li>
              {CATEGORIES.filter(c => c.id !== 'drama').map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-blue-400 text-slate-400 transition-colors cursor-pointer"
                  >
                    {cat.nameKo} ({cat.nameEn})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Public Newsletter & SEO Tools */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              새 글 알림 구독 (로그인 불필요)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              콘텐츠 허브에서 생성되는 새로운 드라마 심층 비평을 이메일로 받아보실 수 있습니다.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="이메일 주소 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-white flex-1"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {subscribed ? '구독완료' : '구독'}
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>구독 등록되었습니다!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-4">
            <span>© 2026 스튜디오 드라마 에디토리얼 웹진. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">사진 출처: Unsplash</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Google · Naver 검색 수집 최적화됨
            </span>
            <span>·</span>
            <span className="text-slate-500">v1.0.0 (Front Prototype)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
