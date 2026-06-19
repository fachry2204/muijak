'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function WebTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if we are in the browser
    if (typeof window !== 'undefined') {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathname })
      }).catch(err => console.error('Failed to track:', err));
    }
  }, [pathname]);

  return null;
}
