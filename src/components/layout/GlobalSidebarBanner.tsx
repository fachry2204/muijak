"use client";

import { usePathname } from 'next/navigation';
import { ManagedBanner } from '@/components/ui/ManagedBanner';

export function GlobalSidebarBanner() {
  const pathname = usePathname() || '/';
  const isHome = /^\/(id|en|ar)?\/?$/.test(pathname);
  if (isHome) return null;

  return <ManagedBanner slot="sidebar" className="hidden xl:block fixed right-5 top-28 w-56 aspect-square z-20" />;
}

