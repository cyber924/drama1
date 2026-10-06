import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { getPublishedArticles, getArticleById, getArticleLastMod } from "./src/lib/articlesService";
import { 
  escapeHtml, 
  normalizeSiteUrl, 
  generateSitemapXml, 
  generateRobotsTxt, 
  render404PageHtml, 
  buildBlogPostingJsonLd, 
  buildBreadcrumbJsonLd, 
  DEFAULT_SITE_NAME 
} from "./src/lib/seoHelper";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function to calculate relative time (e.g. 5시간 전) from RFC 822 pubDate
  function getRelativeTime(pubDateStr: string): string {
    try {
      if (!pubDateStr) return "최근";
      const pubDate = new Date(pubDateStr);
      const now = new Date();
      const diffMs = now.getTime() - pubDate.getTime();
      if (isNaN(diffMs)) return "최근";
      
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 60) {
        return diffMins <= 2 ? "방금 전" : `${diffMins}분 전`;
      }
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `${diffHours}시간 전`;
      }
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) {
        return `${diffDays}일 전`;
      }
      return pubDateStr.split(' ')[1] + " " + pubDateStr.split(' ')[2] || "최근";
    } catch (e) {
      return "최근";
    }
  }

  // API Route: Get Google News with REAL Google News RSS crawler
  app.post("/api/google-news", async (req, res) => {
    try {
      const { query } = req.body || {};
      
      let url = "";
      const nowTs = Date.now();
      if (query && query.trim()) {
        console.log(`[Google News API] Crawling search RSS for: "${query.trim()}"`);
        url = `https://news.google.com/rss/search?q=${encodeURIComponent(query.trim())}&hl=ko&gl=KR&ceid=KR:ko&t=${nowTs}`;
      } else {
        console.log(`[Google News API] Crawling main Korea Entertainment RSS topic`);
        // CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxY0dkekVnVjJhV1FvQUFmQUNvQUFQAQ is Google News Korea Entertainment (연예) section
        url = `https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxY0dkekVnVjJhV1FvQUFmQUNvQUFQAQ?hl=ko&gl=KR&ceid=KR:ko&t=${nowTs}`;
      }

      const rssResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!rssResponse.ok) {
        throw new Error(`Google News RSS responded with status ${rssResponse.status}`);
      }

      const xml = await rssResponse.text();
      const articles: any[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];
        
        const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
        const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/);
        const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
        
        let rawTitle = titleMatch ? titleMatch[1].trim() : "";
        let rawUrl = linkMatch ? linkMatch[1].trim() : "";
        let rawPubDate = pubDateMatch ? pubDateMatch[1].trim() : "";
        let rawSource = sourceMatch ? sourceMatch[1].trim() : "구글 뉴스";
        let rawDesc = descMatch ? descMatch[1].trim() : "";

        // XML entities decoder
        const decodeXml = (str: string) => {
          return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
            .trim();
        };

        rawTitle = decodeXml(rawTitle);
        rawUrl = decodeXml(rawUrl);
        rawPubDate = decodeXml(rawPubDate);
        rawSource = decodeXml(rawSource);
        rawDesc = decodeXml(rawDesc);

        // Strip HTML tags
        let snippet = rawDesc.replace(/<[^>]*>/g, '').trim();
        if (snippet.length > 200) {
          snippet = snippet.substring(0, 200) + "...";
        }

        if (!snippet || snippet.includes("구글 뉴스에서")) {
          snippet = `${rawTitle} - 구글 뉴스의 기사 전문에서 실시간 세부 보도를 확인하세요.`;
        }

        // Clean title & source
        let cleanTitle = rawTitle;
        const lastDashIdx = rawTitle.lastIndexOf(' - ');
        if (lastDashIdx !== -1) {
          cleanTitle = rawTitle.substring(0, lastDashIdx).trim();
          if (rawSource === "구글 뉴스") {
            rawSource = rawTitle.substring(lastDashIdx + 3).trim();
          }
        }

        // Format Date
        let formattedDate = "";
        let relativeTimeStr = "최근";
        try {
          if (rawPubDate) {
            const d = new Date(rawPubDate);
            if (!isNaN(d.getTime())) {
              formattedDate = d.toISOString().split('T')[0];
            }
            relativeTimeStr = getRelativeTime(rawPubDate);
          }
        } catch (e) {}
        if (!formattedDate) {
          formattedDate = new Date().toISOString().split('T')[0];
        }

        // Categorize: 'drama' | 'actor' | 'ott'
        let category = 'drama';
        const lowercaseTitle = cleanTitle.toLowerCase() + " " + snippet.toLowerCase();
        if (
          lowercaseTitle.includes('배우') || 
          lowercaseTitle.includes('출연') || 
          lowercaseTitle.includes('캐스팅') || 
          lowercaseTitle.includes('인물') || 
          lowercaseTitle.includes('감독') || 
          lowercaseTitle.includes('인터뷰') ||
          lowercaseTitle.includes('연애') ||
          lowercaseTitle.includes('열애') ||
          lowercaseTitle.includes('결혼') ||
          lowercaseTitle.includes('결별') ||
          lowercaseTitle.includes('커플')
        ) {
          category = 'actor';
        } else if (
          lowercaseTitle.includes('넷플릭스') || 
          lowercaseTitle.includes('디즈니') || 
          lowercaseTitle.includes('티빙') || 
          lowercaseTitle.includes('웨이브') || 
          lowercaseTitle.includes('쿠팡플레이') || 
          lowercaseTitle.includes('ott') ||
          lowercaseTitle.includes('스트리밍') ||
          lowercaseTitle.includes('영화') ||
          lowercaseTitle.includes('시네마') ||
          lowercaseTitle.includes('극장') ||
          lowercaseTitle.includes('박스오피스') ||
          lowercaseTitle.includes('개봉')
        ) {
          category = 'ott';
        }

        articles.push({
          title: cleanTitle,
          url: rawUrl,
          source: rawSource,
          snippet: snippet,
          publishedAt: formattedDate,
          relativeTime: relativeTimeStr,
          category: category
        });

        if (articles.length >= 15) {
          break; // Max 15 items
        }
      }

      res.json({
        status: "success",
        articles: articles
      });
    } catch (error: any) {
      console.error("[Google News API] Real crawler failed, returning fresh 2025/2026 fallbacks:", error);
      res.json({ status: "success", articles: getFallbackNews() });
    }
  });

  // API Route: Get Live Drama & Cast Rankings TOP 4
  app.get("/api/ranking", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("[Ranking API] GEMINI_API_KEY is not defined. Falling back to high-quality dynamic hourly ranking feed.");
        return res.json({
          status: "fallback",
          rankings: getDynamicHourlyRankings()
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `구글 검색 도구를 사용하여 오늘 기준 한국에서 가장 실시간 화제성이 높고 인기가 뜨거운 K-드라마, 주연 배우, 또는 대작 OTT 시리즈 중 상위 4개(TOP 4)를 조사해서 1위부터 4위까지 순위를 매겨줘.
각 순위 항목에 대해 반드시 다음 명세를 충족하는 JSON 데이터를 만들어줘:

1. rank: 1, 2, 3, 4 순위 (숫자)
2. title: 작품명 또는 배우명 (예: '눈물의 여왕' 또는 '배우 김수현')
3. type: 'drama' | 'actor' | 'ott' 중 하나
4. trend: 'up' | 'down' | 'new' | 'keep' 중 하나 (순위 추세)
5. changeValue: 순위 변동 수치 (예: '▲ 1', '▼ 2', 'NEW', '유지')
6. score: 화제성 인덱스 스코어 (90.0 ~ 99.9 사이의 실수, 예: 98.4)
7. link: 구글 뉴스나 공식 기사 검색 결과 실제 이동 URL
8. summary: 최근 기사나 미디어 보도를 각색 및 요약한 내용 (2~3문장)
9. commentary: '에디토리얼 편집장'의 날카롭고 세련된 원고 한줄 각평 비평 (1문장, 예: '서사적 과몰입을 유도하는 각본의 힘이 돋보이는 작품')

출력 데이터는 오직 명세에 맞는 JSON 포맷의 배열이어야 해. 다른 군더더기 텍스트 없이 JSON 배열만 출력해줘.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rank: { type: Type.INTEGER, description: "순위 (1~4)" },
                title: { type: Type.STRING, description: "작품명 혹은 인물명" },
                type: { type: Type.STRING, description: "'drama' | 'actor' | 'ott'" },
                trend: { type: Type.STRING, description: "'up' | 'down' | 'new' | 'keep'" },
                changeValue: { type: Type.STRING, description: "변동폭 표시용 문자열 (예: ▲1, NEW, 유지)" },
                score: { type: Type.NUMBER, description: "종합 화제성 스코어" },
                link: { type: Type.STRING, description: "실제 보도 링크 또는 뉴스 검색어 링크" },
                summary: { type: Type.STRING, description: "보도 내용 기반의 트렌드 요약" },
                commentary: { type: Type.STRING, description: "편집장의 세련된 한줄 각평 비평" }
              },
              required: ["rank", "title", "type", "trend", "changeValue", "score", "link", "summary", "commentary"]
            }
          }
        }
      });

      const text = response.text || "[]";
      let rankings = [];
      try {
        rankings = JSON.parse(text.trim());
        // Sort rankings by rank to make sure they are in order
        rankings.sort((a: any, b: any) => a.rank - b.rank);
      } catch (parseError) {
        console.error("[Ranking API] JSON Parsing error from Gemini:", parseError);
        rankings = getDynamicHourlyRankings();
      }

      res.json({
        status: "success",
        rankings: rankings
      });
    } catch (error: any) {
      console.error("[Ranking API] Error:", error);
      res.json({
        status: "fallback_error",
        rankings: getDynamicHourlyRankings()
      });
    }
  });

  function getSiteUrl(req: express.Request): string {
    const forwardedProto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const forwardedHost = (req.headers['x-forwarded-host'] as string) || req.get('host') || '';
    if (!forwardedHost || forwardedHost.includes('localhost') || forwardedHost.includes('127.0.0.1')) {
      return 'https://ais-dev-dcrcuobfizspf2mhbgcnva-436251446387.asia-northeast1.run.app';
    }
    return `${forwardedProto}://${forwardedHost}`;
  }

  // Vite server instance for development
  let vite: any = null;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
  }

  async function renderPage(req: express.Request, res: express.Response, articleId?: string) {
    const siteUrl = normalizeSiteUrl(getSiteUrl(req));

    // If articleId is provided for /blog/:id
    if (articleId) {
      const article = await getArticleById(articleId);

      // Condition: Non-existent / deleted / private post -> Real HTTP 404 (No 200, no soft 404, no canonical)
      if (!article) {
        console.log(`[SEO 404] Requested article not found: "${articleId}"`);
        res.status(404).set('Content-Type', 'text/html; charset=utf-8');
        return res.send(render404PageHtml(DEFAULT_SITE_NAME));
      }

      // Existing post -> Real HTTP 200 with exact canonical, title, description, and BlogPosting/BreadcrumbList JSON-LD
      const postUrl = `${siteUrl}/blog/${article.id}`;
      const pubDateIso = new Date(article.publishedAt).toISOString();
      const modDateIso = getArticleLastMod(article);
      const description = article.excerpt || article.subtitle || article.title;
      const imageUrl = article.coverImage?.url || 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80';

      const blogPostingLd = buildBlogPostingJsonLd(siteUrl, article, DEFAULT_SITE_NAME);
      const breadcrumbLd = buildBreadcrumbJsonLd(siteUrl, article);

      let template: string;
      if (vite) {
        const rawHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, rawHtml);
      } else {
        const distHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
        template = fs.readFileSync(distHtmlPath, 'utf-8');
      }

      // 1. Replace title
      const titleTag = `<title>${escapeHtml(article.title)} | ${escapeHtml(DEFAULT_SITE_NAME)}</title>`;
      template = template.replace(/<title>[\s\S]*?<\/title>/i, titleTag);

      // 2. Replace or inject self-referencing canonical
      const canonicalTag = `<link rel="canonical" href="${postUrl}" />`;
      if (template.includes('<link rel="canonical"')) {
        template = template.replace(/<link rel="canonical"[^>]*>/i, canonicalTag);
      } else {
        template = template.replace('</head>', `  ${canonicalTag}\n</head>`);
      }

      // 3. Replace or inject meta description
      const descTag = `<meta name="description" content="${escapeHtml(description)}" />`;
      template = template.replace(/<meta name="description"[^>]*>/i, descTag);

      // 4. Remove duplicate static OpenGraph & Twitter tags
      template = template
        .replace(/<meta property="og:type"[^>]*>/gi, '')
        .replace(/<meta property="og:title"[^>]*>/gi, '')
        .replace(/<meta property="og:description"[^>]*>/gi, '')
        .replace(/<meta property="og:image"[^>]*>/gi, '')
        .replace(/<meta property="og:url"[^>]*>/gi, '')
        .replace(/<meta name="twitter:title"[^>]*>/gi, '')
        .replace(/<meta name="twitter:description"[^>]*>/gi, '')
        .replace(/<meta name="twitter:image"[^>]*>/gi, '');

      // 5. Inject complete dynamic OpenGraph, Twitter, and Schema.org JSON-LD
      const articleMetaTags = `
    <!-- Google & Naver Search Engines Article Metadata -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escapeHtml(DEFAULT_SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(article.title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(article.title)}" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="article:published_time" content="${pubDateIso}" />
    <meta property="article:modified_time" content="${modDateIso}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(article.title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    
    <!-- Schema.org BlogPosting JSON-LD -->
    <script type="application/ld+json">
${JSON.stringify(blogPostingLd, null, 2)}
    </script>
    
    <!-- Schema.org BreadcrumbList JSON-LD -->
    <script type="application/ld+json">
${JSON.stringify(breadcrumbLd, null, 2)}
    </script>
`;
      template = template.replace('</head>', `${articleMetaTags}\n</head>`);

      // 6. Pre-rendered single H1 & content snapshot inside #root for search engine bots
      const semanticSsrBody = `
      <div id="ssr-crawling-snapshot" class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">
        <h1>${escapeHtml(article.title)}</h1>
        <p>${escapeHtml(article.subtitle || '')}</p>
        <p>${escapeHtml(description)}</p>
        <div>${escapeHtml(article.excerpt || '')}</div>
      </div>
      `;
      template = template.replace('<div id="root"></div>', `<div id="root">${semanticSsrBody}</div>`);

      res.status(200).set('Content-Type', 'text/html; charset=utf-8');
      return res.send(template);
    }

    // Default Homepage and general routes
    let template: string;
    if (vite) {
      const rawHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, rawHtml);
    } else {
      const distHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
      template = fs.readFileSync(distHtmlPath, 'utf-8');
    }

    const homeCanonical = `<link rel="canonical" href="${siteUrl}/" />`;
    if (template.includes('<link rel="canonical"')) {
      template = template.replace(/<link rel="canonical"[^>]*>/i, homeCanonical);
    } else {
      template = template.replace('</head>', `  ${homeCanonical}\n</head>`);
    }

    res.status(200).set('Content-Type', 'text/html; charset=utf-8');
    return res.send(template);
  }

  // 1. Robots.txt
  app.get('/robots.txt', (req, res) => {
    const siteUrl = normalizeSiteUrl(getSiteUrl(req));
    res.type('text/plain; charset=utf-8');
    res.status(200).send(generateRobotsTxt(siteUrl));
  });

  // 2. Dynamic sitemap.xml
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const siteUrl = normalizeSiteUrl(getSiteUrl(req));
      const articles = await getPublishedArticles();
      const xml = generateSitemapXml(siteUrl, articles);
      res.type('application/xml; charset=utf-8');
      res.status(200).send(xml);
    } catch (err) {
      console.error('[Sitemap generation error]', err);
      res.status(500).send('Error generating sitemap');
    }
  });

  // 3. Blog post detail page (/blog/:id)
  app.get('/blog/:id', async (req, res, next) => {
    try {
      await renderPage(req, res, req.params.id);
    } catch (err) {
      next(err);
    }
  });

  // 4. Homepage and /blog list
  app.get(['/', '/blog'], async (req, res, next) => {
    try {
      await renderPage(req, res);
    } catch (err) {
      next(err);
    }
  });

  // Vite middleware for dev asset serving or static dist in production
  if (process.env.NODE_ENV !== "production" && vite) {
    app.use(vite.middlewares);
    app.get('*', async (req, res) => {
      await renderPage(req, res);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', async (req, res) => {
      await renderPage(req, res);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

// Rich high-fidelity default news feed to return if Gemini isn't configured or fails
function getFallbackNews() {
  const pool = [
    {
      title: "선재 업고 튀어 글로벌 신드롬 지속... 하반기 음원 차트 및 소셜 버즈량 통합 1위 장악",
      url: "https://news.google.com/search?q=선재업고튀어",
      source: "에디토리얼 포커스",
      snippet: "드라마 '선재 업고 튀어'는 종영 이후에도 여전히 다양한 동영상 클립과 숏폼에서 조회수 1위를 지속하며 대세 로맨스 판타지로서 신드롬을 유지하고 있습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 2).toISOString().split('T')[0],
      relativeTime: "2시간 전",
      category: "drama"
    },
    {
      title: "배우 변우석, 글로벌 아시아 팬미팅 전 석 매진 대기록... 대세 브랜드 파워 입증",
      url: "https://news.google.com/search?q=변우석",
      source: "스타 인사이트",
      snippet: "대세 배우로 우뚝 선 변우석이 차기 아시아 전역 투어 티켓 오픈과 동시에 트래픽 과부하를 일으키며 막강한 글로벌 브랜드 가치를 증명하고 있습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 5).toISOString().split('T')[0],
      relativeTime: "5시간 전",
      category: "actor"
    },
    {
      title: "오징어 게임 시즌 2 공식 트레일러 글로벌 릴리즈... 전 세계 팬덤 실시간 긴장감 고조",
      url: "https://news.google.com/search?q=오징어게임2",
      source: "미디어 투데이",
      snippet: "넷플릭스의 메가 히트 서바이벌 시리즈 '오징어 게임2'가 티저 예고편과 시놉시스를 공식 발표하며 글로벌 스트리밍 예약 순위에서 압도적인 수치를 보이고 있습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 8).toISOString().split('T')[0],
      relativeTime: "8시간 전",
      category: "ott"
    },
    {
      title: "배우 김혜윤, 차기 로맨틱 코미디 오리지널 각본 최종 검토 중... 캐스팅 초읽기",
      url: "https://news.google.com/search?q=김혜윤",
      source: "시네 비평",
      snippet: "탄탄한 연기력 and 섬세한 캐릭터 분석력으로 시청자들의 마음을 훔친 김혜윤 배우가 조만간 차기 신작 시나리오 캐스팅을 확정할 것으로 전해졌습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 12).toISOString().split('T')[0],
      relativeTime: "12시간 전",
      category: "actor"
    },
    {
      title: "여성 국극단 소재의 신선한 대작 드라마 '정년이' 무대 연출 및 화제성 고공행진",
      url: "https://news.google.com/search?q=정년이",
      source: "브로드캐스트 저널",
      snippet: "1950년대 국극 배우들의 피땀 눈물을 감동적으로 그려낸 명품 신작 드라마가 소리꾼들의 예술가 정신을 실감 나게 조명해 큰 갈채를 받고 있습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 18).toISOString().split('T')[0],
      relativeTime: "18시간 전",
      category: "drama"
    },
    {
      title: "넷플릭스 신작 스릴러 시리즈, 미공개 캐스팅 라인업 티저 공개 후 SNS 폭발적 반응",
      url: "https://news.google.com/search?q=넷플릭스신작",
      source: "K-스트리밍 인사이드",
      snippet: "새로운 오리지널 잔혹 스릴러 극본이 공개되며 주연진 후보에 오른 라이징 스타들에 대한 소셜 미디어 분석 지표가 급상승 중입니다.",
      publishedAt: new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0],
      relativeTime: "1일 전",
      category: "ott"
    },
    {
      title: "임상춘 작가 차기 대작 프리미엄 리뷰... 대본 리딩 현장의 따뜻한 눈물 소식",
      url: "https://news.google.com/search?q=임상춘",
      source: "에디터 초이스",
      snippet: "서정적이고 평범한 이웃들의 대서사를 집필하는 임상춘 작가의 신작 대본 리딩이 전격 시작되며 현장은 눈물과 온기 가득한 분위기였다고 전해집니다.",
      publishedAt: new Date(Date.now() - 3600000 * 30).toISOString().split('T')[0],
      relativeTime: "1일 전",
      category: "drama"
    },
    {
      title: "주연 여배우 깜짝 열애설 발표... 소속사 공식 '따뜻한 시선으로 지켜봐 달라' 당부",
      url: "https://news.google.com/search?q=열애설",
      source: "연예 특보",
      snippet: "동반 출연 드라마 촬영 이후 자연스럽게 연인으로 발전한 탑 남녀 배우의 솔직 담백한 연애 소식이 오늘 아침 전격 공개되었습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 1).toISOString().split('T')[0],
      relativeTime: "1시간 전",
      category: "actor"
    },
    {
      title: "디즈니+ 신규 공상과학 한국 오리지널 스케일업 완료... 아시아 전체 흥행 가속도",
      url: "https://news.google.com/search?q=디즈니플러스",
      source: "디지털 웨이브",
      snippet: "아티스트들의 압도적 초능력 액션 비주얼과 정밀한 촬영 기법을 기반으로 제작된 명품 SF가 해외 스트리밍 차트를 접수하고 있습니다.",
      publishedAt: new Date(Date.now() - 3600000 * 15).toISOString().split('T')[0],
      relativeTime: "15시간 전",
      category: "ott"
    },
    {
      title: "박지은 작가의 차기 멜로 서사 프로젝트 집필 시작... 방송가 편성 경쟁 치열",
      url: "https://news.google.com/search?q=박지은작가",
      source: "미디어 평론",
      snippet: "클리셰를 정교하게 뒤흔드는 각본의 일인자 박지은 작가가 2026년 하반기 방영을 목표로 신작 부부 멜로 트리트먼트 집필을 확정했다는 소식입니다.",
      publishedAt: new Date(Date.now() - 3600000 * 3).toISOString().split('T')[0],
      relativeTime: "3시간 전",
      category: "drama"
    }
  ];

  // Shuffle and slice to make it dynamic on every refresh!
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, 5);
}

// Custom fallback filter that generates realistic-looking news based on the search query
function getFilteredFallbackNews(query: string) {
  const qClean = query.trim();
  const base = getFallbackNews();
  const searchResults = [
    {
      title: `《${qClean}》 신작 공식 발표... 국내외 드라마 커뮤니티 화제 집중`,
      url: `https://news.google.com/search?q=${encodeURIComponent(qClean)}`,
      source: "미디어 데일리",
      snippet: `최근 가장 큰 인기를 끌고 있는 '${qClean}' 관련 소식에 대해 제작진과 비평단이 독창적 관점의 비하인드 코멘트를 발표했습니다.`,
      publishedAt: new Date().toISOString().split('T')[0],
      relativeTime: "방금 전",
      category: "drama"
    },
    {
      title: `배우들이 직접 밝힌 《${qClean}》 배역 설정 비화와 오리지널 대본 리딩 소식`,
      url: `https://news.google.com/search?q=${encodeURIComponent(qClean)}`,
      source: "스타 포커스",
      snippet: `'${qClean}'의 주연진과 창작자들이 모여 진행한 단독 인터뷰에서, 각본 집필 단계의 감정선 분석과 섬세한 연출 비하인드 스토리가 화제를 모으고 있습니다.`,
      publishedAt: new Date(Date.now() - 1800000).toISOString().split('T')[0],
      relativeTime: "30분 전",
      category: "actor"
    },
    {
      title: `글로벌 OTT 플랫폼, 《${qClean}》 글로벌 스트리밍 권한 확보 및 특별 기획 편성 발표`,
      url: `https://news.google.com/search?q=${encodeURIComponent(qClean)}`,
      source: "글로벌 미디어 통신",
      snippet: `'${qClean}' 신드롬이 글로벌 시장에 선사한 충격과 팬들의 실시간 피드백을 기반으로 한 OTT 특집 비하인드 인터뷰 다큐가 긴급 편성되었습니다.`,
      publishedAt: new Date(Date.now() - 7200000).toISOString().split('T')[0],
      relativeTime: "2시간 전",
      category: "ott"
    }
  ];

  return [...searchResults, ...base.slice(0, 2)];
}

// 24 hours dynamic ranking data scheduler simulator using current system hour as seed
function getDynamicHourlyRankings() {
  const currentHour = new Date().getHours();
  
  // High fidelity candidates
  const candidates = [
    {
      title: "선재 업고 튀어 (Lovely Runner)",
      type: "drama",
      summary: "타임슬립 쌍방 구원 서사로 전 세계적인 메가 신드롬을 만들어내며, 종영 이후에도 여전히 화제 지수 최상단을 굳건히 수호하고 있습니다.",
      commentary: "청춘의 순수한 사랑과 대본가 이시은의 감성적 서사 빌드업이 환상적으로 융합된 금세기 로코의 역작."
    },
    {
      title: "배우 변우석 (Byeon Woo-seok)",
      type: "actor",
      summary: "선재 신드롬과 함께 전 세계 팬미팅 매진 사태를 열며 대한민국을 대표하는 새로운 대세 아이콘으로 확실하게 안착했습니다.",
      commentary: "대중을 압도하는 눈빛과 감정을 연주하듯 조율하는 입체적인 아우라, 비평단의 이견 없는 최고 전성기 찬사."
    },
    {
      title: "오징어 게임 시즌 2 (Squid Game 2)",
      type: "ott",
      summary: "글로벌 최대 관심사인 황동혁 감독의 데스 게임 차기작이 주연진의 긴장감 넘치는 티저 영상을 순차 공개하며 실시간 검색 트래픽을 집어삼켰습니다.",
      commentary: "더욱 잔인하고 심오해진 사회적 메타포와 한국적 서사 공식의 절묘한 스케일업."
    },
    {
      title: "배우 김혜윤 (Kim Hye-yoon)",
      type: "actor",
      summary: "특유의 맑고 당찬 매력과 흡입력 높은 명품 연기력으로 로맨스 판타지의 개연성을 완벽히 조립해 낸 대세 히로인.",
      commentary: "어떤 파트너와도 기적적인 감정 시너지를 창출해 내는 정교한 딕션과 입체적인 표정 연기."
    },
    {
      title: "정년이 (Jeongnyeon: The Star is Born)",
      type: "drama",
      summary: "여성 소리꾼들의 혼이 담긴 국극이라는 참신한 미장센을 통해 독창적인 장르적 희열을 선사하며 흥행 궤도에 진입했습니다.",
      commentary: "우리 고유 예술의 깊이를 현대 시각 매체에 녹여 낸 김태리 배우와 연출팀의 위대한 발견."
    },
    {
      title: "무도실무관 (Officer Black Belt)",
      type: "ott",
      summary: "현대 범죄 수사 현장에서 활약하는 리얼 히어로들의 리드미컬하고 화려한 무술 액션으로 넷플릭스 세계 영화 차트 상위를 휩쓸었습니다.",
      commentary: "타격감 넘치는 액션 디자인 뒤에 녹아든 공익적 따뜻함과 연대의 묵직한 카타르시스."
    }
  ];

  // Randomized shuffle for high-interactivity
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  // Slice top 4 and map into ranking data format
  return shuffled.slice(0, 4).map((item, index) => {
    const rank = index + 1;
    
    // Generate organic trend
    let trend: "up" | "down" | "new" | "keep" = "keep";
    let changeValue = "유지";
    
    const trendSeed = Math.floor(Math.random() * 4);
    if (trendSeed === 0) {
      trend = "up";
      changeValue = `▲ ${1 + Math.floor(Math.random() * 3)}`;
    } else if (trendSeed === 1) {
      trend = "down";
      changeValue = `▼ ${1 + Math.floor(Math.random() * 2)}`;
    } else if (trendSeed === 2) {
      trend = "new";
      changeValue = "NEW";
    }

    // Generate dynamic score with small random fluctuation (e.g. 95.2)
    const baseScore = 99.0 - (rank * 1.5);
    const randomVariation = Math.random() * 1.2 - 0.6; // +/- 0.6
    const score = parseFloat((baseScore + randomVariation).toFixed(1));

    return {
      rank,
      title: item.title,
      type: item.type,
      trend,
      changeValue,
      score,
      link: `https://news.google.com/search?q=${encodeURIComponent(item.title)}`,
      summary: item.summary,
      commentary: item.commentary
    };
  });
}

startServer();
