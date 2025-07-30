"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const PwaInstallContext = createContext(null);

export function usePwaInstall() {
  return useContext(PwaInstallContext);
}

export function PwaInstallProvider({ children }) {
  const [canInstall, setCanInstall] = useState(false);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
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
      deferredPrompt.current = null;
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

  const install = () => {
    if (!deferredPrompt.current) return;

    deferredPrompt.current.prompt();

    deferredPrompt.current.userChoice.then((choiceResult) => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pwa_install_prompt_result', {
          'event_category': 'pwa',
          'event_label': `PWA Install ${choiceResult.outcome}`,
          'value': choiceResult.outcome === 'accepted' ? 1 : 0
        });
      }

      if (choiceResult.outcome === 'accepted') {
        // The 'appinstalled' event will handle the rest
      } else {
        // User dismissed the prompt, we can choose to re-enable the button or not.
        // For now, we'll keep it available.
      }
    });
  };

  return (
    <PwaInstallContext.Provider value={{ canInstall, install }}>
      {children}
    </PwaInstallContext.Provider>
  );
}
