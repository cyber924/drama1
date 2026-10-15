// One canonical production origin shared by server rendering and browser navigation.
// VERCEL_URL is deployment-specific and must never be used for indexable URLs.
export const PRIMARY_SITE_URL = 'https://dramahub.co.kr';
export const articleUrl = (id: string) => `${PRIMARY_SITE_URL}/blog/${encodeURIComponent(id)}`;
