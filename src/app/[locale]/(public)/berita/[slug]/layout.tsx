import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import pool from '@/lib/db';
import {absoluteUrl, createDescription, getSiteUrl} from '@/lib/siteMetadata';

type NewsMetadataRow = {
  title_id: string;
  title_en: string | null;
  title_ar: string | null;
  content_id: string;
  content_en: string | null;
  content_ar: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  meta_keywords: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  const {locale, slug} = await params;
  const [rows] = await pool.query(
    `SELECT title_id, title_en, title_ar, content_id, content_en, content_ar, image_url,
            meta_title, meta_desc, meta_keywords
     FROM news
     WHERE slug = ? AND UPPER(status) = 'PUBLISHED'
     LIMIT 1`,
    [slug]
  );
  const article = (rows as NewsMetadataRow[])[0];

  if (!article) return {};

  const title = locale === 'ar'
    ? article.title_ar || article.title_id
    : locale === 'en'
      ? article.title_en || article.title_id
      : article.title_id;
  const content = locale === 'ar'
    ? article.content_ar || article.content_id
    : locale === 'en'
      ? article.content_en || article.content_id
      : article.content_id;
  const seoTitle = article.meta_title || title;
  const description = article.meta_desc || createDescription(content);
  const localePath = locale === 'id' ? '' : `/${locale}`;
  const articleUrl = `${getSiteUrl()}${localePath}/berita/${encodeURIComponent(slug)}`;
  const imageUrl = absoluteUrl(article.image_url);

  return {
    title: seoTitle,
    description,
    keywords: article.meta_keywords?.split(',').map((keyword) => keyword.trim()).filter(Boolean),
    alternates: {canonical: articleUrl},
    openGraph: {
      type: 'article',
      siteName: 'MUI Jakarta',
      locale: locale === 'id' ? 'id_ID' : locale === 'ar' ? 'ar_SA' : 'en_US',
      url: articleUrl,
      title: seoTitle,
      description,
      images: [{url: imageUrl, alt: seoTitle}],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default async function NewsDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string; slug: string}>;
}) {
  const {slug} = await params;
  const [rows] = await pool.query(
    "SELECT id FROM news WHERE slug = ? AND UPPER(status) = 'PUBLISHED' LIMIT 1",
    [slug]
  );

  if ((rows as Array<{id: string}>).length === 0) notFound();

  return children;
}
