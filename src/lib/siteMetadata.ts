const PRODUCTION_SITE_URL = 'https://muijakarta.or.id';

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl && !configuredUrl.includes('localhost')) {
    return configuredUrl.replace(/\/$/, '');
  }

  return PRODUCTION_SITE_URL;
}

export function absoluteUrl(pathOrUrl?: string | null) {
  if (!pathOrUrl) return `${getSiteUrl()}/gambar/logoweb.png`;

  try {
    return new URL(pathOrUrl, `${getSiteUrl()}/`).toString();
  } catch {
    return `${getSiteUrl()}/gambar/logoweb.png`;
  }
}

export function createDescription(html?: string | null, maxLength = 200) {
  const plainText = (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) {
    return 'Portal resmi Majelis Ulama Indonesia Provinsi DKI Jakarta. Berita, kegiatan, fatwa, dan informasi keumatan terkini.';
  }

  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength - 1).trimEnd()}…`
    : plainText;
}
