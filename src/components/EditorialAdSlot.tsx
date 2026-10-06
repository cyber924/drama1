import React, { useState } from 'react';
import { ExternalLink, Info, Sparkles, Code, Check } from 'lucide-react';

interface EditorialAdSlotProps {
  slotId: string;
  placement: 'main-feed' | 'article-content';
  className?: string;
}

export const EditorialAdSlot: React.FC<EditorialAdSlotProps> = ({
  slotId,
  placement,
  className = '',
}) => {
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMain = placement === 'main-feed';

  const sampleAdSenseSnippet = `<!-- Google AdSense / In-Feed Unit (${slotId}) -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(sampleAdSenseSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      id={slotId}
      aria-label="광고 영역"
      className={`relative w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 sm:p-5 transition-all hover:border-slate-400 font-pretendard ${className}`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
            AD
          </span>
          <span className="font-semibold text-slate-600">
            {isMain ? '메인 피드 스폰서십 광고 슬롯' : '본문 인-아티클 광고 슬롯'}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-400">
            {isMain ? '반응형 와이드 리더보드 (728×90 / 970×90 / 모바일 자동 맞춤)' : '반응형 본문 삽입형 (Responsive In-Article Banner)'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowCodeGuide(!showCodeGuide)}
          className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{showCodeGuide ? '배너 보기' : '애드센스 코드 가이드'}</span>
        </button>
      </div>

      {/* Code Guide Overlay / View */}
      {showCodeGuide ? (
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-blue-400 font-semibold">
              구글 애드센스 / 카카오 애드핏 연동 스크립트 위치
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Code className="w-3 h-3" />}
              <span>{copied ? '복사 완료' : '코드 복사'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] overflow-x-auto text-slate-300 leading-relaxed border border-slate-800">
            {sampleAdSenseSnippet}
          </pre>
          <p className="text-[11px] text-slate-400">
            * 본 컴포넌트의 <code>EditorialAdSlot</code> 내부에 실제 발급받으신 광고 스크립트 또는 배너 이미지를 삽입하시면 됩니다.
          </p>
        </div>
      ) : (
        /* Visual Advertisement Unit Placeholder */
        <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-slate-900 via-slate-850 to-blue-950 p-4 sm:p-6 text-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wide border border-blue-400/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  SPONSORED
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {isMain ? 'K-드라마 & 시네마 글로벌 스트리밍 페스티벌' : '드라마 각본가 마스터클래스 2026'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {isMain 
                  ? '동시대 최고의 K-드라마 전편 4K UHD 무제한 스트리밍' 
                  : '《도깨비》《미스터 션샤인》김은숙·김은희 작가의 대사 집필 비법'}
              </h4>
              <p className="text-xs text-slate-300 font-normal line-clamp-1 sm:line-clamp-none">
                {isMain
                  ? '웹진 독자 전용 1개월 무료 체험 혜택과 프리미엄 각본집 e-book 다운로드 제공'
                  : '현업 작가 및 영상 콘텐츠 제작자를 위한 실전 서사 아카데미 개강'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>자세히 보기</span>
                <ExternalLink className="w-3 h-3 text-blue-200" />
              </button>
            </div>
          </div>

          <div className="absolute right-2 bottom-1 text-[9px] text-slate-500/80 font-mono select-none pointer-events-none">
            Google AdSense / Sponsorship Ad Slot #{slotId}
          </div>
        </div>
      )}
    </aside>
  );
};
