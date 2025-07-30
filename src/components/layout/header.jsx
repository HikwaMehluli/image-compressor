import React from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { ShareMenu } from '@/components/share-menu';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-[#0048ce] dark:bg-header-dark text-primary-foreground border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">
              Image Compressor
            </h1>
            <p className="text-sm text-primary-foreground/80">Simple & fast "Image Compression" tool</p>
          </div>
          <div className="flex items-center gap-2 [&_button]:bg-transparent [&_button]:border-primary-foreground [&_button]:text-primary-foreground [&_button:hover]:bg-primary-foreground/20 [&_button:hover]:text-primary-foreground">
            <ShareMenu />
            <ModeToggle />
          </div>
      </div>
    </header>
  );
}
