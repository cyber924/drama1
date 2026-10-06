import React, { useState } from 'react';
import { 
  Flame, 
  ExternalLink, 
  Users, 
  Tv, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Instagram, 
  BookOpen, 
  Calendar,
  Share2,
  Check,
  Music,
  Award
} from 'lucide-react';
import { EditorialAdSlot } from './EditorialAdSlot';

interface NaverBlogInfluencer {
  id: number;
  name: string;
  blogName: string;
  followers: string;
  description: string;
  highlights: string[];
  link: string;
  bgColorClass: string;
  borderColorClass: string;
  hoverBorderColorClass: string;
  badgeColorClass: string;
}

interface OttPlatform {
  name: string;
  logoColor: string;
  textColor: string;
  description: string;
  killerContents: string[];
  subTitle: string;
  link: string;
}

interface InstaCelebrity {
  name: string;
  id: string;
  followers: string;
  recentWork: string;
  role: string;
  imgPlaceholder: string;
  link: string;
}

export const HotInfoFeed: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState<number | null>(null);

  // 1. 네이버 방송/연예 인플루언서 블로그 6개 (업로드된 스크린샷 기준 실제 파워 블로거 목록)
  const naverBlogs: NaverBlogInfluencer[] = [
    {
      id: 1,
      name: "아멜리에",
      blogName: "아멜리에의 뷰티 & 드라마",
      followers: "3.2만",
      description: "SBS 아침드라마 및 지상파 일일/주말 드라마 분석의 대가. 숨겨진 출생의 비밀과 섬세한 감정적 복선 분석 전문가.",
      highlights: ["사랑이온다 친딸 고백 및 출생의 비밀 해석", "주말/일일드라마 매회차 꿀잼 복선 요약"],
      link: "https://blog.naver.com/amelie_m",
      bgColorClass: "bg-rose-50/95",
      borderColorClass: "border-rose-100",
      hoverBorderColorClass: "hover:border-rose-300",
      badgeColorClass: "text-rose-600 bg-rose-100/60 border-rose-200"
    },
    {
      id: 2,
      name: "덕빛",
      blogName: "슬기로운 덕빛생활☆",
      followers: "2.1만",
      description: "메디컬 드라마 및 웹소설 원작 지식 가이드 블로그. 등장인물의 입체적인 심리 변화 및 전개 방향을 철저하게 추적.",
      highlights: ["중증외상센터 골든아워2 하차 및 배역 분석", "웰메이드 의학 드라마 등장인물 캐스팅 총정리"],
      link: "https://blog.naver.com/js2y86",
      bgColorClass: "bg-sky-50/95",
      borderColorClass: "border-sky-100",
      hoverBorderColorClass: "hover:border-sky-300",
      badgeColorClass: "text-sky-600 bg-sky-100/60 border-sky-200"
    },
    {
      id: 3,
      name: "깜상",
      blogName: "깜상의 대중문화 & 스릴러 연구실",
      followers: "4.5만",
      description: "웹툰 원작 드라마 및 하드보일드 스릴러 전문 해설가. 극 중 이스터에그와 살인마의 모방 범죄를 소름 돋게 유추.",
      highlights: ["유부녀 킬러 킹피셔 정체와 실제 사건 모티브 유추", "스릴러 드라마 속 모방 범죄 복선 추적"],
      link: "https://blog.naver.com/sand614",
      bgColorClass: "bg-amber-50/95",
      borderColorClass: "border-amber-100",
      hoverBorderColorClass: "hover:border-amber-300",
      badgeColorClass: "text-amber-700 bg-amber-100/60 border-amber-200"
    },
    {
      id: 4,
      name: "욕심토끼",
      blogName: "욕심토끼의 일드일음",
      followers: "1.8만",
      description: "일본 드라마, 감성 로맨스 일드, 사운드트랙 명곡을 가장 풍부하고 유니크하게 다루는 글로벌 드라마 전문 채널.",
      highlights: ["연애 만화가 최종화 해피엔딩 심층 후기", "감성을 적시는 최고의 일본 드라마 OST 추천"],
      link: "https://blog.naver.com/yoksimtoki",
      bgColorClass: "bg-purple-50/95",
      borderColorClass: "border-purple-100",
      hoverBorderColorClass: "hover:border-purple-300",
      badgeColorClass: "text-purple-600 bg-purple-100/60 border-purple-200"
    },
    {
      id: 5,
      name: "노바디",
      blogName: "노바디의 드라마 직관 리뷰방",
      followers: "5.2만",
      description: "티빙(TVING) 오리지널 드라마, tvN 월화/수목 드라마 솔직 발랄 감상평. 시청자들의 답답한 가슴을 뻥 뚫어주는 돌직구 후기.",
      highlights: ["로또 1등도 출근합니다 티빙 오리지널 후기", "이번 주 방영 예정 드라마 평점 예측"],
      link: "https://blog.naver.com/nobody",
      bgColorClass: "bg-indigo-50/95",
      borderColorClass: "border-indigo-100",
      hoverBorderColorClass: "hover:border-indigo-300",
      badgeColorClass: "text-indigo-600 bg-indigo-100/60 border-indigo-200"
    },
    {
      id: 6,
      name: "silver3358",
      blogName: "silver3358의 드라마 일기장",
      followers: "3.4만",
      description: "웰메이드 사극, 스위트홈, 지상파 대작 판타지물 중심의 주옥같은 연기자 가치 평가 및 캐릭터 해석 전문 기록소.",
      highlights: ["별들에게 물어봐 최신 에피소드 분석", "K-크리처물 및 대작 사극 속 명배우 연기 비평"],
      link: "https://blog.naver.com/silver3358",
      bgColorClass: "bg-emerald-50/95",
      borderColorClass: "border-emerald-100",
      hoverBorderColorClass: "hover:border-emerald-300",
      badgeColorClass: "text-emerald-700 bg-emerald-100/60 border-emerald-200"
    }
  ];

  // 2. 드라마 다시보기 정보 사이트 (넷플릭스, 티빙 등)
  const ottPlatforms: OttPlatform[] = [
    {
      name: "NETFLIX (넷플릭스)",
      subTitle: "글로벌 OTT의 절대강자",
      logoColor: "bg-red-600",
      textColor: "text-red-500",
      description: "최신 K-드라마의 전세계 독점 스트리밍과 높은 퀄리티의 고품격 오리지널 시리즈 독점 배포.",
      killerContents: ["오징어 게임", "눈물의 여왕", "스위트홈", "더 글로리"],
      link: "https://www.netflix.com/kr/"
    },
    {
      name: "TVING (티빙)",
      subTitle: "웰메이드 K-콘텐츠 보물창고",
      logoColor: "bg-orange-500",
      textColor: "text-orange-500",
      description: "tvN, JTBC, OCN 등 최고 화제의 방송사 드라마를 라이브와 다시보기로 가장 빠르게 즐길 수 있는 플랫폼.",
      killerContents: ["선재 업고 튀어", "정년이", "비밀의 숲", "환승연애"],
      link: "https://www.tving.com/"
    },
    {
      name: "Wavve (웨이브)",
      subTitle: "지상파 예능/드라마 본방 사수",
      logoColor: "bg-blue-600",
      textColor: "text-blue-500",
      description: "KBS, MBC, SBS 지상파 방송 3사의 최신 드라마 스트리밍 및 명작 드라마 최다 아카이브 보유.",
      killerContents: ["연인", "모범택시", "태어난 김에 세계일주", "펜트하우스"],
      link: "https://www.wavve.com/"
    },
    {
      name: "DISNEY+ (디즈니 플러스)",
      subTitle: "글로벌 스케일의 한국 오리지널",
      logoColor: "bg-slate-900",
      textColor: "text-sky-400",
      description: "글로벌 프랜차이즈 콘텐츠와 함께 탄탄한 연출진과 초호화 캐스팅의 웰메이드 로컬 시리즈 제작처.",
      killerContents: ["무빙", "킬러들의 쇼핑몰", "삼식이 삼촌", "최악의 악"],
      link: "https://www.disneyplus.com/ko-kr"
    }
  ];

  // 3. 인스타 팔로워 많은 핫 스타
  const hotCelebrities: InstaCelebrity[] = [
    {
      name: "차은우",
      id: "eunwo.o_c",
      followers: "4,610만",
      recentWork: "〈원더풀 월드〉, 〈오늘도 사랑스럽개〉",
      role: "배우 겸 아티스트",
      imgPlaceholder: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60",
      link: "https://www.instagram.com/eunwo.o_c/"
    },
    {
      name: "김수현",
      id: "soohyun_k216",
      followers: "1,680만",
      recentWork: "〈눈물의 여왕〉, 〈사이코지만 괜찮아〉",
      role: "배우",
      imgPlaceholder: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=60",
      link: "https://www.instagram.com/soohyun_k216/"
    },
    {
      name: "카리나",
      id: "katarinabluu",
      followers: "1,510만",
      recentWork: "에스파 글로벌 투어, 드라마 OST 참여",
      role: "아티스트 & 트렌드 아이콘",
      imgPlaceholder: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60",
      link: "https://www.instagram.com/katarinabluu/"
    },
    {
      name: "김지원",
      id: "geewonii",
      followers: "1,120만",
      recentWork: "〈눈물의 여왕〉, 〈나의 해방일지〉",
      role: "배우",
      imgPlaceholder: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=60",
      link: "https://www.instagram.com/geewonii/"
    },
    {
      name: "변우석",
      id: "byeonwooseok",
      followers: "1,040만",
      recentWork: "〈선재 업고 튀어〉, 〈청춘기록〉",
      role: "배우",
      imgPlaceholder: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=60",
      link: "https://www.instagram.com/byeonwooseok/"
    }
  ];

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(index);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-8 sm:space-y-12 font-pretendard">
      {/* 1. TOP HEADER SECTION - Sunset Amber/Rose Wide Hero Section */}
      <div className="bg-slate-950 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-rose-500/15 text-rose-400 font-black rounded-full border border-rose-500/30 uppercase tracking-widest animate-pulse whitespace-nowrap">
                  REALTIME TREND
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
              </div>
              <span className="text-xs text-rose-400 font-bold flex items-center gap-1 leading-snug">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-bounce shrink-0" />
                드라마 매니아를 위한 실시간 알짜 트렌드 백과사전
              </span>
            </div>
            
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              HOT 정보 채널 🌟
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 sm:text-slate-400 leading-relaxed max-w-3xl font-normal">
              네이버 최고 존엄 드라마 인플루언서 블로그 6선의 맞춤 컬러 분석, 메이저 OTT 플랫폼 공식 라이브 다시보기 직통 링크, 그리고 인스타그램 초인기 스타들의 실시간 팔로워 분석 수치까지 동시대 미디어 시장의 핵심 트렌드를 수려하게 담아낸 공간입니다.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full md:w-auto z-10 bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3.5 rounded-xl">
            <div className="text-left md:text-right">
              <div className="text-[10px] text-slate-500 font-semibold">데이터 동기화 상태</div>
              <div className="text-xs font-bold text-rose-400">실시간 연동 정보 업데이트 완료</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AD SLOT 1 (첫 번째 광고 위치) */}
      <div className="my-6">
        <EditorialAdSlot 
          slotId="ad-hotinfo-top" 
          placement="main-feed" 
        />
      </div>

      {/* 3. NAVER BLOG INFLUENCERS (드라마/연애 인플루언서 블로그 6선) */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-5 sm:h-6 bg-emerald-500 rounded-xs"></span>
              인기 연애 & 드라마 전문 네이버 블로그 TOP 6
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              디테일한 연출 분석, 연애 리얼리티 매트릭스, 이스터에그 발굴 등 독창적인 블로거들입니다.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
            블로그로 직결 이동
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {naverBlogs.map((blog, idx) => (
            <div 
              key={blog.id}
              className={`${blog.bgColorClass} border ${blog.borderColorClass} rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md ${blog.hoverBorderColorClass} transition-all flex flex-col justify-between group`}
            >
              <div className="space-y-3 sm:space-y-4">
                {/* Influencer Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className={`${blog.badgeColorClass} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border`}>
                      NAVER INFLUENCER
                    </span>
                    <h4 className="text-base font-bold text-slate-900 transition-colors pt-1">
                      {blog.blogName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium">이웃</span>
                    <p className="text-xs text-slate-800 font-bold">{blog.followers}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal min-h-[38px] line-clamp-2">
                  {blog.description}
                </p>

                {/* Hot Topics tag list */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">주요 다룬 주제:</span>
                  <div className="flex flex-col gap-1">
                    {blog.highlights.map((h, i) => (
                      <span key={i} className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5 bg-white/70 border border-white/80 px-2.5 py-1 rounded-lg shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-slate-100/50 mt-3 sm:mt-4 text-xs font-semibold">
                <a 
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-center flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>블로그 방문</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleCopy(blog.link, idx)}
                  className="p-2 rounded-lg border border-slate-200/60 bg-white/50 hover:bg-white text-slate-500 hover:text-slate-900 cursor-pointer transition-all"
                  title="주소 복사"
                >
                  {copiedLink === idx ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DRAMA REPLAY SITES (드라마 다시보기 플랫폼 소개 & 링크) */}
      <section className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 sm:h-6 bg-blue-600 rounded-xs"></span>
            드라마 공식 다시보기 & OTT 플랫폼 정보
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            방송사 드라마 본방 스트리밍과 오리지널 신작을 고화질로 안심하고 볼 수 있는 안전한 공식 다시보기 링크입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {ottPlatforms.map((ott, index) => (
            <div 
              key={index}
              className="bg-white border border-slate-100 hover:border-slate-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 text-[10px] font-black text-white rounded ${ott.logoColor}`}>
                    OFFICIAL OTT
                  </span>
                  <Tv className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{ott.name}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{ott.subTitle}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {ott.description}
                </p>

                {/* Killer Contents */}
                <div className="pt-1.5 sm:pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">대표 킬러 타이틀:</div>
                  <div className="flex flex-wrap gap-1">
                    {ott.killerContents.map((content, i) => (
                      <span key={i} className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                        {content}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3.5 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
                <a 
                  href={ott.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 rounded-lg text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 cursor-pointer`}
                >
                  <span>공식 다시보기 이동</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EXTRA CREATIVE SECTIONS (직접 추가하는 알짜 드라마 부가 정보) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 pt-2 sm:pt-4">
        {/* 5-A. 실시간 공식 드라마/OTT 인기 차트 연동 포털 (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 animate-pulse" /> LIVE STREAMING TRENDS
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">실시간 플랫폼별 드라마 공식 순위 포털</h4>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 animate-pulse whitespace-nowrap">공식 실시간 연동</span>
          </div>

          <div className="p-3 sm:p-3.5 bg-slate-950/60 rounded-xl border border-rose-500/10 text-[11px] text-slate-300 leading-relaxed font-normal">
            <span className="font-bold text-rose-400">🚨 공지:</span> 개발자가 작성한 정적/가상 순위 대신, 넷플릭스·티빙·웨이브 본사 및 공인 빅데이터 기관이 제공하는 <strong className="text-white">실시간 100% 라이브 인기 순위 및 검색어 추이</strong> 공식 페이지로 다이렉트 연동됩니다. 항상 동시대 최고의 핫 드라마 지표를 즉각 확인하세요.
          </div>

          <div className="space-y-3">
            {[
              {
                rank: 1,
                platform: "키노라이츠 통합 차트",
                desc: "대한민국 모든 스트리밍(넷플릭스, 티빙, 웨이브, 디즈니+ 등) 전체 시청 점유율 & 실시간 검색량 합산 통합 1위 일일 차트",
                badge: "국내 유일 통합 랭킹",
                badgeColor: "text-red-400 bg-red-400/10 border-red-500/20",
                link: "https://m.kinolights.com/ranking/ott",
                btnText: "통합 실시간 순위 보기"
              },
              {
                rank: 2,
                platform: "넷플릭스 공식 TOP 10",
                desc: "넷플릭스 본사 공식 글로벌 지표 - 주간 대한민국에서 가장 많이 본 최고의 인기 TV 쇼 & 드라마 공식 탑 10 차트",
                badge: "Netflix Official",
                badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
                link: "https://www.netflix.com/tudum/top10/south-korea",
                btnText: "넷플릭스 주간 순위 보기"
              },
              {
                rank: 3,
                platform: "티빙(TVING) 인기 차트",
                desc: "tvN, JTBC 명작 방영작 및 오리지널 콘텐츠 독점 강자 티빙의 실시간 최신 방영 에피소드 종합 검색 및 시청 순위",
                badge: "티빙 오리지널 & 라이브",
                badgeColor: "text-pink-400 bg-pink-400/10 border-pink-500/20",
                link: "https://www.tving.com/",
                btnText: "티빙 공식 순위 보기"
              },
              {
                rank: 4,
                platform: "웨이브(Wavve) 인기 차트",
                desc: "지상파 3사(KBS, SBS, MBC)의 높은 실시간 방송 본방 시청률과 웨이브 독점 인기작 일간/주간 통합 드라마 순위 인덱스",
                badge: "지상파 & 드라마 종합",
                badgeColor: "text-blue-400 bg-blue-400/10 border-blue-500/20",
                link: "https://www.wavve.com/",
                btnText: "웨이브 공식 순위 보기"
              },
              {
                rank: 5,
                platform: "굿데이터 펀덱스(FUNdex)",
                desc: "뉴스, 블로그, 커뮤니티, 동영상 바이럴 반응 분석 기반 대한민국 방송업계 표준 공인 주간 드라마 화제성 & 출연자 랭킹",
                badge: "공인 화제성 1위",
                badgeColor: "text-amber-400 bg-amber-400/10 border-amber-500/20",
                link: "https://www.fundex.co.kr/",
                btnText: "화제성 주간 분석 보기"
              }
            ].map((item) => (
              <div key={item.rank} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition-all">
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 shrink-0 rounded bg-slate-800 text-slate-400 font-mono font-black text-[11px] flex items-center justify-center border border-slate-700">
                      {item.rank}
                    </span>
                    <span className="text-sm font-bold text-white tracking-tight">
                      {item.platform}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-linear-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-[11px] font-black flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <span>{item.btnText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-B. 이번 달 화제 드라마 OST 차트 & 추천작 (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <Music className="w-4 h-4 text-pink-500" />
                이 달의 화제 드라마 OST TOP 4
              </h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-50 text-pink-600 font-bold border border-pink-100">멜론 종합랭킹 반영</span>
            </div>

            <div className="space-y-3">
              {[
                { track: "소나기", artist: "이클립스 (변우석)", subtitle: "선재 업고 튀어 OST Vol.1", rank: "▲ 1" },
                { track: "미안해 미워해 사랑해", artist: "크러쉬 (Crush)", subtitle: "눈물의 여왕 OST Part 4", rank: "▼ 1" },
                { track: "천사", artist: "헤이즈", subtitle: "신작 드라마 로맨스 OST", rank: "▲ 2" },
                { track: "멈춰줘", artist: "10CM", subtitle: "오리지널 사운드트랙 싱글", rank: "NEW" }
              ].map((ost, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black text-slate-400 w-4">{idx + 1}</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{ost.track}</h5>
                      <p className="text-[10px] text-slate-500 font-medium">{ost.artist} · <span className="text-slate-400">{ost.subtitle}</span></p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    ost.rank.includes('▲') ? 'text-red-500 bg-red-50' : ost.rank.includes('NEW') ? 'text-pink-500 bg-pink-50' : 'text-blue-500 bg-blue-50'
                  }`}>
                    {ost.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium OST album download banner */}
          <div className="bg-gradient-to-r from-pink-50 to-indigo-50 border border-pink-100 rounded-xl p-4 text-slate-800 space-y-1.5">
            <span className="text-[9px] font-black text-pink-600 tracking-wider flex items-center gap-0.5">
              <Award className="w-3 h-3 text-pink-500" /> RECOMMENDED SOUNDTRACK
            </span>
            <h5 className="text-xs font-bold text-slate-900">드라마 한정판 실물 각본집 & OST 프리오더 이벤트</h5>
            <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
              본 웹진 독자를 위해 기획된 특전 굿즈 한정 수량 패키지. 인터파크 도서 공식 페이지에서 최저가로 즉시 사전 예약하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 6. HOT INSTAGRAM CELEBRITIES (인스타 구독자/팔로워 폭발 연예인) */}
      <section className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 sm:h-6 bg-purple-600 rounded-xs"></span>
            드라마 화제성 폭발! 인스타 초인기 스타 TOP 5
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            인스타그램 팔로워 수 지표에서 압도적 인기를 달리는 대한민국 핫 연예인들의 프로필 및 공식 인스타그램 바로가기입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {hotCelebrities.map((celeb, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 hover:border-purple-200 rounded-xl sm:rounded-2xl p-4 hover:shadow-md transition-all flex flex-col justify-between group text-center relative overflow-hidden"
            >
              {/* Decorative Insta Icon in background */}
              <div className="absolute right-2 top-2 opacity-5 text-purple-600">
                <Instagram className="w-12 h-12" />
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Profile Placeholder Image with Gradient Ring */}
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-linear-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-sm relative overflow-hidden">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    <img 
                      src={celeb.imgPlaceholder} 
                      alt={celeb.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>

                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {celeb.role}
                  </span>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-purple-600 transition-colors pt-0.5">
                    {celeb.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-semibold">@{celeb.id}</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">INSTA 팔로워</span>
                  <p className="text-xs sm:text-sm font-black text-purple-600">{celeb.followers}</p>
                </div>

                <div className="text-left">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">최근 대표작:</span>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium line-clamp-2 leading-relaxed">
                    {celeb.recentWork}
                  </p>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100">
                <a 
                  href={celeb.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>인스타 바로가기</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AD SLOT 2 (두 번째 광고 위치) */}
      <div className="pt-4">
        <EditorialAdSlot 
          slotId="ad-hotinfo-bottom" 
          placement="article-content" 
        />
      </div>
    </div>
  );
};
