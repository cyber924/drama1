/**
 * @file seoHelper.ts
 * Generates SEO meta tags, OpenGraph, Schema.org JSON-LD (BlogPosting & BreadcrumbList),
 * sitemap.xml, robots.txt, and 404 status HTML for Google & Naver Search Engines.
 */

import { FirebaseArticleDoc } from '../types';
import { getArticleLastMod } from './articlesService';

export const DEFAULT_SITE_NAME = '에디토리얼 웹진 블로그';

/**
 * Escapes HTML characters for meta tag attributes and title.
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Normalizes Site URL (no trailing slash, HTTPS enforcement).
 */
export function normalizeSiteUrl(rawUrl: string): string {
  if (!rawUrl) return 'https://ais-dev-dcrcuobfizspf2mhbgcnva-436251446387.asia-northeast1.run.app';
  let url = rawUrl.trim();
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  // Enforce https
  url = url.replace(/^http:\/\//, 'https://');
  return url;
}

/**
 * Builds BlogPosting Schema.org JSON-LD
 */
export function buildBlogPostingJsonLd(siteUrl: string, article: FirebaseArticleDoc, siteName = DEFAULT_SITE_NAME) {
  const postUrl = `${siteUrl}/blog/${article.id}`;
  const pubDateIso = new Date(article.publishedAt).toISOString();
  const modDateIso = getArticleLastMod(article);
  const imageUrl = article.coverImage?.url || 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80';
  const authorName = article.author?.name || '에디토리얼 편집국';
  const authorRole = article.author?.role || '수석 칼럼니스트';
  const description = article.excerpt || article.subtitle || article.title;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200,
      "height": 630
    },
    "datePublished": pubDateIso,
    "dateModified": modDateIso,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "author": {
      "@type": "Person",
      "name": authorName,
      "jobTitle": authorRole,
      "worksFor": {
        "@type": "Organization",
        "name": siteName
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=300&q=80"
      }
    }
  };
}

/**
 * Builds BreadcrumbList Schema.org JSON-LD (Advanced Enhancement)
 */
export function buildBreadcrumbJsonLd(siteUrl: string, article: FirebaseArticleDoc) {
  const postUrl = `${siteUrl}/blog/${article.id}`;
  const categoryName = article.categoryNameKo || '드라마';

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryName,
        "item": `${siteUrl}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": postUrl
      }
    ]
  };
}

/**
 * Generates dynamic sitemap.xml
 */
export function generateSitemapXml(siteUrl: string, articles: FirebaseArticleDoc[]): string {
  const normSiteUrl = normalizeSiteUrl(siteUrl);
  
  // Find latest mod date for homepage
  let latestIso = new Date().toISOString();
  if (articles.length > 0) {
    latestIso = getArticleLastMod(articles[0]);
  }

  const urlsXml = articles.map(art => {
    const postUrl = `${normSiteUrl}/blog/${art.id}`;
    const lastMod = getArticleLastMod(art);
    return `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${normSiteUrl}/</loc>
    <lastmod>${latestIso}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urlsXml}
</urlset>`.trim();
}

/**
 * Generates robots.txt
 */
export function generateRobotsTxt(siteUrl: string): string {
  const normSiteUrl = normalizeSiteUrl(siteUrl);
  return `User-agent: *
Allow: /
Sitemap: ${normSiteUrl}/sitemap.xml
`.trim();
}

/**
 * Generates HTML for 404 (Not Found) with noindex and exact message
 */
export function render404PageHtml(siteName = DEFAULT_SITE_NAME): string {
  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>글을 찾을 수 없습니다 | ${escapeHtml(siteName)}</title>
    <meta name="robots" content="noindex, follow" />
    <meta name="description" content="요청하신 게시글이 삭제되었거나 존재하지 않는 주소입니다." />
    <!-- Notice: NO CANONICAL TAG ON 404 PAGE -->
    <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
        background-color: #0f172a;
        color: #f8fafc;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .container {
        max-width: 680px;
        margin: auto;
        padding: 40px 24px;
        text-align: center;
      }
      .badge {
        display: inline-block;
        padding: 4px 12px;
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.05em;
        margin-bottom: 20px;
      }
      h1 {
        font-size: 28px;
        font-weight: 900;
        color: #ffffff;
        margin-bottom: 12px;
        line-height: 1.3;
      }
      p {
        font-size: 15px;
        color: #94a3b8;
        line-height: 1.6;
        margin-bottom: 32px;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: #2563eb;
        color: #ffffff;
        text-decoration: none;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 700;
        transition: background 0.2s ease;
      }
      .btn:hover {
        background: #1d4ed8;
      }
      .code-box {
        margin-top: 40px;
        padding: 16px;
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        font-size: 12px;
        color: #64748b;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="badge">404 NOT FOUND</div>
      <h1>요청한 글을 찾을 수 없습니다.</h1>
      <p>
        입력하신 주소의 게시글이 존재하지 않거나, 삭제 또는 비공개 처리되었습니다.<br />
        주소가 올바른지 다시 한번 확인해 주시기 바랍니다.
      </p>
      <div>
        <a href="/" class="btn">
          <span>홈으로 돌아가기</span>
        </a>
      </div>
      <div class="code-box">
        HTTP Status: 404 Not Found · Google & Naver noindex 적용
      </div>
    </div>
  </body>
</html>`.trim();
}
