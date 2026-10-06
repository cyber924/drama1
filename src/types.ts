/**
 * @file types.ts
 * Firebase Firestore DB schema and editorial webzine data structures
 * Designed for seamless integration with 'AI 웹진 허브' data pipeline
 */

export type ThemeMode = 'cool-slate' | 'pure-minimal' | 'sage-tint' | 'midnight-dark' | 'midnight-deep';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  badge: string;
  bgClass: string;
  textClass: string;
  cardClass: string;
  borderClass: string;
  accentClass: string;
  accentBg: string;
  subBg: string;
}

export type EditorialCategory = 'drama' | 'cinema' | 'critique' | 'screenplay' | 'interview' | 'culture' | 'hotinfo';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  organization?: string;
}

export interface SeoMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  naverSearchTitle: string;
  naverBlogSyncTag?: string;
  robots: string;
  structuredDataJsonLd: Record<string, any>;
}

export type EditorialBlockType = 
  | 'paragraph'
  | 'heading'
  | 'pullQuote'
  | 'image'
  | 'dualImage'
  | 'callout'
  | 'sceneBreakdown'
  | 'characterMatrix'
  | 'editorVerdict';

export interface EditorialBlock {
  id: string;
  type: EditorialBlockType;
  content?: string;
  headingLevel?: 2 | 3;
  hasDropCap?: boolean;
  quoteAuthor?: string;
  quoteSource?: string;
  imageUrl?: string;
  caption?: string;
  photoCredit?: string;
  // For dualImage
  leftImage?: { url: string; caption: string; credit: string };
  rightImage?: { url: string; caption: string; credit: string };
  // For callout
  calloutTitle?: string;
  calloutType?: 'hubNote' | 'insight' | 'spoiler';
  // For sceneBreakdown
  sceneEpisode?: string;
  sceneTitle?: string;
  scriptLines?: { speaker: string; text: string; note?: string }[];
  // For characterMatrix
  characters?: { name: string; actor: string; trait: string; conflict: string }[];
  // For editorVerdict
  verdictScore?: number;
  verdictHighlight?: string;
  verdictPoints?: string[];
}

export interface TableOfContentItem {
  id: string;
  title: string;
  level: number;
}

/**
 * Firebase Firestore Document Structure for 'articles' collection
 * Direct mapping for 'AI 웹진 허브' database pipeline
 */
export interface FirebaseArticleDoc {
  id: string; // Firestore document ID
  slug: string;
  category: EditorialCategory;
  categoryNameKo: string;
  subCategory: string; // e.g. 'K-드라마 심층비평', '각본 분석', '연출 미학'
  title: string;
  subtitle: string;
  excerpt: string;
  featured: boolean;
  featuredRank?: number; // 1 for lead story
  coverImage: {
    url: string;
    alt: string;
    creditName: string;
    creditUrl: string;
    blurColor?: string;
  };
  author: Author;
  publishedAt: string; // ISO 8601 string or Firestore Timestamp
  updatedAt?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  tags: string[];
  source: '콘텐츠 허브' | '편집국 자체 기획';
  hubOriginId?: string; // Origin ID from AI Webzine Hub
  syncStatus: 'synced' | 'pending' | 'verified';
  seo: SeoMetadata;
  tableOfContents: TableOfContentItem[];
  contentBlocks: EditorialBlock[];
}

export interface CategoryInfo {
  id: EditorialCategory;
  nameKo: string;
  nameEn: string;
  description: string;
  isPrimary?: boolean;
}
