/**
 * @file articlesService.ts
 * Unified service for retrieving public published articles from Firestore & Webzine Hub.
 * Enforces strict Google & Naver SEO filtering rules (excluding draft, private, deleted, and scheduled future posts).
 */

import { FirebaseArticleDoc } from '../types';
import { MOCK_ARTICLES } from '../data/mockArticles';
import { fetchArticlesFromHub } from './firebase';

interface CacheEntry {
  timestamp: number;
  articles: FirebaseArticleDoc[];
}

let articlesCache: CacheEntry | null = null;
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
 * Retrieves all published articles with caching.
 */
export async function getPublishedArticles(forceRefresh = false): Promise<FirebaseArticleDoc[]> {
  const now = Date.now();
  if (!forceRefresh && articlesCache && (now - articlesCache.timestamp < CACHE_TTL_MS)) {
    return articlesCache.articles;
  }

  try {
    const liveArticles = await fetchArticlesFromHub();
    
    // Combine live Firestore articles with mock articles (de-duplicating by ID)
    const seenIds = new Set<string>();
    const combined: FirebaseArticleDoc[] = [];

    // First add live Firestore articles
    for (const post of liveArticles) {
      if (post && post.id && !seenIds.has(post.id) && isArticlePubliclyIndexable(post)) {
        seenIds.add(post.id);
        combined.push(post);
      }
    }

    // Then add mock articles if not already present
    for (const post of MOCK_ARTICLES) {
      if (post && post.id && !seenIds.has(post.id) && isArticlePubliclyIndexable(post)) {
        seenIds.add(post.id);
        combined.push(post);
      }
    }

    // Sort by publishedAt descending
    combined.sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime() || 0;
      const timeB = new Date(b.publishedAt).getTime() || 0;
      return timeB - timeA;
    });

    articlesCache = {
      timestamp: now,
      articles: combined
    };

    return combined;
  } catch (err) {
    console.error('[articlesService] Failed to load articles, using fallback mock articles:', err);
    const fallbacks = MOCK_ARTICLES.filter(isArticlePubliclyIndexable);
    return fallbacks;
  }
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
