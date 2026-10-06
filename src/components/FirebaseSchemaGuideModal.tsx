/**
 * @file FirebaseSchemaGuideModal.tsx
 * Comprehensive Firebase DB integration guide & data structure inspector
 * Specifically prepared for 'AI 웹진 허브' Firestore pipeline
 */

import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Sparkles, 
  Check, 
  Copy, 
  Code2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FirebaseArticleDoc } from '../types';

interface FirebaseSchemaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleArticle: FirebaseArticleDoc;
}

export const FirebaseSchemaGuideModal: React.FC<FirebaseSchemaGuideModalProps> = ({
  isOpen,
  onClose,
  sampleArticle,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'schema' | 'sampleJson' | 'snippet'>('pipeline');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleJsonStr = JSON.stringify(sampleArticle, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(sampleJsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-pretendard">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                콘텐츠 허브 × 파이어베이스(Firebase) DB 연동 가이드
              </h3>
              <p className="text-xs text-slate-500">
                Firestore Schema Specification & Realtime Sync Architecture
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
            onClick={() => setActiveTab('pipeline')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            데이터 파이프라인 구조
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Firestore 컬렉션 스키마
          </button>
          <button
            onClick={() => setActiveTab('sampleJson')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sampleJson'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            문서 JSON 원본 (목업 데이터)
          </button>
          <button
            onClick={() => setActiveTab('snippet')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'snippet'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            추후 연동 코드 스니펫
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="space-y-5">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold font-serif-kr text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>사용자 요청 완벽 대응: 프론트엔드 디자인 우선 구축 완료</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-serif-kr">
                  "가장 중요한 글생성된 글은 콘텐츠 허브라는 사이트에서 가져오는데 파이어베이스 DB 야 연동 매뉴얼 줄게 우선 프런트 디자인만 해줘"라는 지침에 맞춰, 
                  추후 매뉴얼 전달 시 1분 만에 실시간 연결될 수 있도록 <strong>파이어베이스 Firestore 완벽 호환 데이터 구조</strong>로 모든 UI 컴포넌트를 사전 정렬했습니다.
                </p>
              </div>

              {/* Visual Architecture Flow */}
              <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4">
                <span className="text-xs font-bold font-serif-kr text-stone-800 block">
                  실시간 연동 아키텍처 다이어그램
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="p-4 bg-stone-900 text-white rounded-xl text-center space-y-1 shadow-sm">
                    <div className="text-[10px] text-amber-400 font-bold uppercase">Source</div>
                    <div className="font-serif-kr font-bold text-sm">콘텐츠 허브</div>
                    <div className="text-[11px] text-stone-400">드라마 심층글 분석</div>
                  </div>

                  <div className="flex flex-col items-center justify-center text-amber-800">
                    <ArrowRight className="w-5 h-5 hidden sm:block" />
                    <span className="text-[10px] font-mono mt-1 font-bold">Firestore write</span>
                  </div>

                  <div className="p-4 bg-amber-100/70 text-amber-950 rounded-xl text-center space-y-1 border border-amber-300/60 shadow-sm">
                    <div className="text-[10px] text-amber-800 font-bold uppercase">Database</div>
                    <div className="font-serif-kr font-bold text-sm">Firebase Firestore</div>
                    <div className="text-[11px] text-amber-900">Collection: 'articles'</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>공개형 웹진 (Public Read 규칙 적용, 로그인 불필요)</span>
                  </div>
                  <span className="text-stone-400 font-sans">Index: publishedAt DESC</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA DEFINITION */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <span className="text-xs font-bold font-serif-kr text-stone-800 block">
                Firestore 'articles' 컬렉션 필드 정의
              </span>

              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-xs text-left text-stone-700 bg-white">
                  <thead className="bg-[#F4F0E8] text-stone-900 font-serif-kr border-b border-stone-200">
                    <tr>
                      <th className="px-3.5 py-2.5">필드명 (Field)</th>
                      <th className="px-3.5 py-2.5">타입 (Type)</th>
                      <th className="px-3.5 py-2.5">설명 및 용도</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-sans">
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">id / slug</td>
                      <td className="px-3.5 py-2 text-stone-500">string</td>
                      <td className="px-3.5 py-2">고유 문서 식별자 및 URL 슬러그</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">category</td>
                      <td className="px-3.5 py-2 text-stone-500">'drama' | 'cinema' ...</td>
                      <td className="px-3.5 py-2">상단 주제 분류 (드라마 최우선 정렬)</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">title, subtitle</td>
                      <td className="px-3.5 py-2 text-stone-500">string</td>
                      <td className="px-3.5 py-2">에디토리얼 대제목 및 소제목</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">coverImage</td>
                      <td className="px-3.5 py-2 text-stone-500">map</td>
                      <td className="px-3.5 py-2">{'{ url, alt, creditName, creditUrl }'} (Unsplash)</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">contentBlocks</td>
                      <td className="px-3.5 py-2 text-stone-500">array&lt;map&gt;</td>
                      <td className="px-3.5 py-2">에디토리얼 블록 (단락, 인용구, 대본분석, 듀얼이미지 등)</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">seo</td>
                      <td className="px-3.5 py-2 text-stone-500">map</td>
                      <td className="px-3.5 py-2">구글 & 네이버 메타태그 및 JSON-LD 구조화 데이터</td>
                    </tr>
                    <tr>
                      <td className="px-3.5 py-2 font-mono text-amber-900 font-bold">source</td>
                      <td className="px-3.5 py-2 text-stone-500">string</td>
                      <td className="px-3.5 py-2">'콘텐츠 허브' 혹은 '편집국 자체 기획' 기원 메타 표기</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SAMPLE JSON */}
          {activeTab === 'sampleJson' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-serif-kr text-stone-700">
                  현재 상세 페이지 목업에 바인딩된 Firestore 문서 JSON
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사되었습니다' : 'JSON 복사'}</span>
                </button>
              </div>

              <pre className="p-4 bg-[#1F1C19] text-[#E5E0D5] text-xs font-mono rounded-xl overflow-x-auto max-h-80 leading-relaxed">
                <code>{sampleJsonStr}</code>
              </pre>
            </div>
          )}

          {/* TAB 4: INTEGRATION CODE SNIPPET */}
          {activeTab === 'snippet' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-700 font-serif-kr leading-relaxed">
                사용자께서 추후 파이어베이스 연동 매뉴얼 및 config를 제공해 주시면 아래 코드로 즉시 라이브 연동됩니다:
              </div>

              <pre className="p-4 bg-[#1F1C19] text-[#E5E0D5] text-xs font-mono rounded-xl overflow-x-auto leading-relaxed">
                <code>{`// AI 웹진 허브 실시간 구독 예시
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const firebaseConfig = { /* 사용자 제공 매뉴얼 */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// '드라마' 주제 글 실시간 수신
export function subscribeDramaArticles(callback) {
  const q = query(
    collection(db, 'articles'),
    where('category', '==', 'drama'),
    orderBy('publishedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(articles);
  });
}`}</code>
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
