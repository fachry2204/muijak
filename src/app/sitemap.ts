import type {MetadataRoute} from 'next';
import type {RowDataPacket} from 'mysql2';
import pool from '@/lib/db';
import {getSiteUrl} from '@/lib/siteMetadata';

export const dynamic = 'force-dynamic';

interface PublishedNews extends RowDataPacket {
  slug: string;
  updated_at: Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [news] = await pool.query<PublishedNews[]>(
    "SELECT slug, updated_at FROM news WHERE UPPER(status) = 'PUBLISHED' ORDER BY updated_at DESC"
  );

  const staticPages: MetadataRoute.Sitemap = [
    {url: siteUrl, changeFrequency: 'daily', priority: 1},
    {url: `${siteUrl}/berita`, changeFrequency: 'daily', priority: 0.9},
  ];
  const articlePages: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${siteUrl}/berita/${encodeURIComponent(article.slug)}`,
    lastModified: article.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
