import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '../globals.css';
import WebTracker from '@/components/layout/WebTracker';
import type {Metadata} from 'next';
import {absoluteUrl, getSiteUrl} from '@/lib/siteMetadata';

const siteDescription = 'Portal resmi Majelis Ulama Indonesia Provinsi DKI Jakarta. Berita, kegiatan, fatwa, dan informasi keumatan terkini.';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const localePath = locale === 'id' ? '' : `/${locale}`;
  const canonicalUrl = `${getSiteUrl()}${localePath}/`;
  const imageUrl = absoluteUrl('/gambar/logoweb.png');

  return {
    metadataBase: new URL(getSiteUrl()),
    title: 'MUI Jakarta | Majelis Ulama Indonesia Provinsi DKI Jakarta',
    description: siteDescription,
    alternates: {canonical: canonicalUrl},
    openGraph: {
      type: 'website',
      siteName: 'MUI Jakarta',
      locale: locale === 'id' ? 'id_ID' : locale === 'ar' ? 'ar_SA' : 'en_US',
      url: canonicalUrl,
      title: 'MUI Jakarta | Majelis Ulama Indonesia Provinsi DKI Jakarta',
      description: siteDescription,
      images: [{url: imageUrl, alt: 'MUI Jakarta'}],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'MUI Jakarta | Majelis Ulama Indonesia Provinsi DKI Jakarta',
      description: siteDescription,
      images: [imageUrl],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Determine text direction
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <WebTracker />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
