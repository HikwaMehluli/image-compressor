import React from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { ShareMenu } from '@/components/share-menu';
import { usePwaInstall } from '@/components/pwa-install-provider';
import { Button } from '@/components/ui/button';
import { AppWindow } from 'lucide-react';

export default function Header() {
  const { canInstall, install } = usePwaInstall();

  return (
    <header className="sticky top-0 z-10 w-full bg-[#0048ce] dark:bg-header-dark text-primary-foreground border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">
                Image Compressor
              </h1>
              <span className="text-sm font-medium text-primary-foreground/80">v0.5.0</span>
            </div>
            <p className="text-sm text-primary-foreground/80 italic">Simple & fast "Image Compression" tool</p>
          </div>
          <div className="flex items-center gap-2 [&_button]:bg-transparent [&_button]:border-primary-foreground [&_button]:text-primary-foreground [&_button:hover]:bg-primary-foreground/20 [&_button:hover]:text-primary-foreground">
            {canInstall && (
              <Button variant="outline" size="sm" onClick={install}>
                <AppWindow size={16} />
                Install App
              </Button>
            )}
            <ShareMenu />
            <ModeToggle />
          </div>
      </div>
    </header>
  );
}
