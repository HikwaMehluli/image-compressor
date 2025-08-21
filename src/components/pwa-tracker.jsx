'use client';

import { useEffect } from 'react';

const PWATracker = () => {
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (typeof window.gtag === 'function') {
      if (isStandalone) {
        window.gtag('event', 'launch', {
          'event_category': 'PWA',
          'event_label': 'Launch from home screen'
        });
      }

      const handleInstall = () => {
        window.gtag('event', 'install', {
          'event_category': 'PWA',
          'event_label': 'Install'
        });
      };

      window.addEventListener('appinstalled', handleInstall);

      return () => window.removeEventListener('appinstalled', handleInstall);
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PWATracker;
