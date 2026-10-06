/**
 * @file articlesService.ts
 * Unified service for retrieving public published articles from Firestore & Webzine Hub.
 * Enforces strict Google & Naver SEO filtering rules (excluding draft, private, deleted, and scheduled future posts).
 */

import { FirebaseArticleDoc } from '../types';
import { MOCK_ARTICLES } from '../data/mockArticles';
import { fetchArticlesFromHub } from './firebase';

interface LiveCacheEntry {
  timestamp: number;
  articles: FirebaseArticleDoc[];
}

let liveArticlesCache: LiveCacheEntry | null = null;
const CACHE_TTL_MS = 20 * 1000; // 20 seconds cache for high responsiveness and Firestore safety

/**
 * Priority for last modified date:
 * updatedAt -> modifiedAt -> publishedAt -> createdAt
 */
export function getArticleLastMod(article: FirebaseArticleDoc | any): string {
  const candidate = 
    article.updatedAt || 
    article.modifiedAt || 
    article.publishedAt || 
    article.createdAt;

  if (candidate) {
    try {
      const d = new Date(candidate);
      if (!isNaN(d.getTime())) {
        return d.toISOString();
      }
    } catch (e) {}
  }
  return new Date().toISOString();
}

/**
 * Validates if an article is public, published, and not scheduled for future.
 */
export function isArticlePubliclyIndexable(article: any): boolean {
  if (!article || !article.id) return false;

  // Exclude deleted
  if (article.deleted === true || article.isDeleted === true) return false;

  // Exclude draft or private
  if (article.status === 'draft' || article.status === 'private') return false;
  if (article.isPublished === false) return false;

  // Exclude noindex
  if (article.seo?.robots && article.seo.robots.includes('noindex')) return false;

  // Exclude future scheduled posts
  const now = Date.now();
  if (article.publishedAt) {
    const pubTime = new Date(article.publishedAt).getTime();
    // Allow up to 1 minute clock drift
    if (!isNaN(pubTime) && pubTime > now + 60000) {
      return false;
    }
  }

  return true;
}

/**
 * Retrieves published articles with separate live cache.
 * Supports filtering out mock articles for operating sitemaps (includeMocks = false).
 */
export async function getPublishedArticles(forceRefresh = false, includeMocks = true): Promise<FirebaseArticleDoc[]> {
  const now = Date.now();
  let liveArticles: FirebaseArticleDoc[] = [];

  if (!forceRefresh && liveArticlesCache && (now - liveArticlesCache.timestamp < CACHE_TTL_MS)) {
    liveArticles = liveArticlesCache.articles;
  } else {
    try {
      liveArticles = await fetchArticlesFromHub();
      liveArticlesCache = {
        timestamp: now,
        articles: liveArticles
      };
    } catch (err) {
      console.error('[articlesService] Failed to load live articles from Hub:', err);
      // Propagate the error so that the server/caller knows it's a DB failure (500 status), not just 0 articles
      throw err;
    }
  }

  const seenIds = new Set<string>();
  const combined: FirebaseArticleDoc[] = [];

  // First add live Firestore articles
  for (const post of liveArticles) {
    if (post && post.id && !seenIds.has(post.id) && isArticlePubliclyIndexable(post)) {
      seenIds.add(post.id);
      combined.push(post);
    }
  }

  // Then add mock articles if requested
  if (includeMocks) {
    for (const post of MOCK_ARTICLES) {
      if (post && post.id && !seenIds.has(post.id) && isArticlePubliclyIndexable(post)) {
        seenIds.add(post.id);
        combined.push(post);
      }
    }
  }

  // Sort by publishedAt descending
  combined.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime() || 0;
    const timeB = new Date(b.publishedAt).getTime() || 0;
    return timeB - timeA;
  });

  return combined;
}

/**
 * Find single article by ID or slug.
 */
export async function getArticleById(id: string): Promise<FirebaseArticleDoc | null> {
  if (!id) return null;
  const articles = await getPublishedArticles();
  const target = articles.find(a => a.id === id || a.slug === id);
  return target || null;
}
