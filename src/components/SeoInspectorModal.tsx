/**
 * @file SeoInspectorModal.tsx
 * Google & Naver Search Optimization Inspector and Live Preview
 * Provides interactive SERP preview (Google/Naver), JSON-LD schemas, and meta tags
 */

import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Smartphone,
  Monitor,
  Share2,
  Search,
  Code
} from 'lucide-react';
import { FirebaseArticleDoc } from '../types';

interface SeoInspectorModalProps {
  article: FirebaseArticleDoc;
  isOpen: boolean;
  onClose: () => void;
}

export const SeoInspectorModal: React.FC<SeoInspectorModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'naver' | 'social' | 'jsonld'>('google');
  const [googleDevice, setGoogleDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonLdString = JSON.stringify(article.seo.structuredDataJsonLd, null, 2);

  const handleCopyJsonLd = () => {
    navigator.clipboard?.writeText(jsonLdString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = 'ais-dev-dcrcuobfizspf2mhbgcnva-436251446387.asia-northeast1.run.app';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-pretendard">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                구글 & 네이버 검색 엔진 최적화 (SEO) 진단
              </h3>
              <p className="text-xs text-slate-500">
                Search Engine Optimization Preview & Structured Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('google')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'google'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            구글 검색 (Google SERP)
          </button>
          <button
            onClick={() => setActiveTab('naver')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'naver'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            네이버 검색 (Naver Search)
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            소셜 / 카카오톡 카드
          </button>
          <button
            onClick={() => setActiveTab('jsonld')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'jsonld'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            JSON-LD 구조화 데이터
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: GOOGLE SERP PREVIEW */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-serif-kr text-stone-700">
                  구글 검색 결과 시뮬레이션
                </span>
                <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setGoogleDevice('desktop')}
                    className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                      googleDevice === 'desktop' ? 'bg-white shadow-xs text-stone-900 font-medium' : 'text-stone-600'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>데스크톱</span>
                  </button>
                  <button
                    onClick={() => setGoogleDevice('mobile')}
                    className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                      googleDevice === 'mobile' ? 'bg-white shadow-xs text-stone-900 font-medium' : 'text-stone-600'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>모바일</span>
                  </button>
                </div>
              </div>

              {/* Google Result Card */}
              <div className={`p-4 bg-white rounded-xl border border-stone-200 font-sans shadow-xs ${
                googleDevice === 'mobile' ? 'max-w-md mx-auto' : ''
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-amber-900 flex items-center justify-center text-[10px] text-white font-bold">
                    D
                  </div>
                  <div className="text-xs text-stone-800">
                    <span className="font-medium text-stone-900">에디토리얼 웹진</span>
                    <span className="text-stone-400 mx-1">›</span>
                    <span className="text-stone-500">{domain} › articles › {article.slug}</span>
                  </div>
                </div>

                <a 
                  href="#preview"
                  onClick={(e) => e.preventDefault()}
                  className="text-lg text-[#1a0dab] hover:underline font-medium leading-snug block mb-1.5 line-clamp-1"
                >
                  {article.seo.metaTitle}
                </a>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                  <span className="text-stone-400 mr-1.5 font-medium">2026. 3. 8. —</span>
                  {article.seo.metaDescription}
                </p>
              </div>

              {/* Technical SEO Verification Status */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="font-bold text-stone-800 font-serif-kr">구글 검색 최적화 핵심 체크리스트</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>시맨틱 &lt;article&gt; 및 &lt;h1&gt; 구조</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Canonical 정규화 URL 설정 완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Robots 메타 (index, follow, max-snippet)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unsplash 이미지 alt 대체 텍스트 적용</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NAVER SEARCH PREVIEW */}
          {activeTab === 'naver' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-serif-kr text-stone-700">
                  네이버 스마트블록 / 통합검색 웹문서 뷰 시뮬레이션
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  NAVER Search Advisor 연동 규격
                </span>
              </div>

              {/* Naver Search Result Card */}
              <div className="p-5 bg-white rounded-xl border border-emerald-100 shadow-xs space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-bold text-emerald-700">웹사이트</span>
                    <span>·</span>
                    <span className="font-medium text-stone-800">에디토리얼 웹진</span>
                    <span className="text-stone-400">{article.seo.naverBlogSyncTag}</span>
                  </div>
                  <span className="text-[11px] text-stone-400">2026.03.08</span>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <h4 className="text-base font-bold text-[#000000] hover:text-emerald-700 leading-snug cursor-pointer">
                      {article.seo.naverSearchTitle}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {article.seo.metaDescription}
                    </p>
                  </div>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <img 
                      src={article.coverImage.url} 
                      alt="네이버 썸네일" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>작성자: {article.author.name} (수석 비평가)</span>
                  <span className="text-emerald-600 font-medium">네이버 사이트 소유확인 메타태그 탑재</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold font-serif-kr">네이버 서치어드바이저 최적화 설정 내역:</div>
                <div className="space-y-1 font-mono text-[11px] text-stone-700 bg-white p-3 rounded border border-emerald-200">
                  <div>&lt;meta name="naver-site-verification" content="naver-editorial-webzine-verification-key" /&gt;</div>
                  <div>&lt;meta property="naver:blog" content="true" /&gt;</div>
                  <div>&lt;meta property="og:title" content="{article.title}" /&gt;</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIAL OPEN GRAPH PREVIEW */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <span className="text-xs font-bold font-serif-kr text-stone-700 block">
                카카오톡 / 페이스북 / X (트위터) 오픈그래프(OG) 카드 미리보기
              </span>

              <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden border border-stone-300 shadow-md font-sans">
                <div className="aspect-16/9 bg-stone-200 overflow-hidden">
                  <img 
                    src={article.seo.ogImage} 
                    alt={article.seo.ogTitle} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-1 bg-stone-50">
                  <div className="text-[10px] uppercase font-bold text-stone-500">
                    {domain}
                  </div>
                  <div className="text-sm font-bold text-stone-900 line-clamp-1">
                    {article.seo.ogTitle}
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {article.seo.ogDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: JSON-LD STRUCTURED DATA */}
          {activeTab === 'jsonld' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-serif-kr text-stone-700">
                  Schema.org NewsArticle 구조화 데이터 (Google Rich Snippets)
                </span>
                <button
                  onClick={handleCopyJsonLd}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사 완료!' : 'JSON 복사'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#1F1C19] text-[#E5E0D5] text-xs font-mono rounded-xl overflow-x-auto max-h-80 leading-relaxed">
                <code>{jsonLdString}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#F4F0E8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-900 text-white text-xs font-serif-kr font-medium hover:bg-amber-900 transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
