"use client";

import { useEffect, useState } from 'react';

type BannerSlot = 'home' | 'bottom' | 'sidebar' | 'below_news';

const keys: Record<BannerSlot, { image: string; link: string; alt: string; enabled: string }> = {
  home: { image: 'home_banner_image', link: 'home_banner_link', alt: 'home_banner_alt', enabled: 'home_banner_enabled' },
  bottom: { image: 'bottom_banner_image', link: 'bottom_banner_link', alt: 'bottom_banner_alt', enabled: 'bottom_banner_enabled' },
  sidebar: { image: 'sidebar_banner_image', link: 'sidebar_banner_link', alt: 'sidebar_banner_alt', enabled: 'sidebar_banner_enabled' },
  below_news: { image: 'below_news_banner_image', link: 'below_news_banner_link', alt: 'below_news_banner_alt', enabled: 'below_news_banner_enabled' },
};

export function ManagedBanner({ slot, className = '' }: { slot: BannerSlot; className?: string }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const config = keys[slot];

  useEffect(() => {
    fetch('/api/settings').then((res) => res.json()).then((data) => {
      if (data.success && data.data) setSettings(data.data);
    }).catch(() => undefined);
  }, []);

  if (settings[config.enabled] === '0' || !settings[config.image]) return null;
  const image = settings[config.image];
  const link = settings[config.link];
  const content = <img src={image} alt={settings[config.alt] || 'Banner MUI Provinsi DKI Jakarta'} className="w-full h-full object-cover" />;

  return (
    <div className={`overflow-hidden rounded-2xl shadow-lg ${className}`}>
      {link ? <a href={link} target="_blank" rel="noopener noreferrer" className="block">{content}</a> : content}
    </div>
  );
}

