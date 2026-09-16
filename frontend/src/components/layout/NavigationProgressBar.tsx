'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete navigation when route changes
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal links to start progress immediately
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, hash anchors, new tabs, and non-GET actions
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.getAttribute('target') === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if clicking current path without changes
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl || (href === '/' && currentUrl === '/')) {
        return;
      }

      // Start progress bar
      setIsNavigating(true);
      setProgress(25);

      const t1 = setTimeout(() => setProgress(50), 100);
      const t2 = setTimeout(() => setProgress(80), 250);

      // Failsafe timeout in case route transition cancels or fails
      const failsafe = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 8000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(failsafe);
      };
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(20,184,166,0.8)] transition-all ease-out duration-300 rounded-r-full"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
