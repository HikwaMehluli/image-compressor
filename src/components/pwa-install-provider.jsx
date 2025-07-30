"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

const PwaInstallContext = createContext(null);

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}

export function PwaInstallProvider({ children }) {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Don't prevent the native browser prompt.
      // e.preventDefault();
      setCanInstall(true);
      
      // Track that the install prompt is available
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pwa_install_prompt_available', {
          'event_category': 'pwa',
          'event_label': 'PWA Install Available'
        });
      }
    };
    
    const handleAppInstalled = () => {
      setCanInstall(false);
      // Track successful installation
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pwa_installed', {
          'event_category': 'pwa',
          'event_label': 'PWA Installed'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);


  return (
    <PwaInstallContext.Provider value={{ canInstall, install: () => {} }}>
      {children}
    </PwaInstallContext.Provider>
  );
}
