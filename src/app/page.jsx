"use client";

import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FileUploader from '@/components/file-uploader';
import ImageList from '@/components/image-list';
import { useToast } from "@/hooks/use-toast";
import { processImage } from '@/lib/image-processor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Home() {
  const [files, setFiles] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    let deferredPrompt;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the browser's default prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // You could show a custom install button here and trigger the prompt with deferredPrompt.prompt()
      // For simplicity, we'll prompt immediately
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'pwa_install_prompt_accepted', {
              'event_category': 'pwa',
              'event_label': 'PWA Install Accepted'
            });
          }
        }
        deferredPrompt = null;
      });
    };
    
    const handleInstall = (e) => {
      // Prevent the default install prompt
      e.preventDefault();
      // Send event to Google Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pwa_install', {
          'event_category': 'pwa',
          'event_label': 'PWA Installed'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstall);
    };
  }, []);

  const handleFileUpdate = useCallback((id, newProps) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...newProps } : f));
  }, []);

  const handleProcessQueue = useCallback(async () => {
    const fileToProcess = files.find(f => f.status === 'idle');
    if (!fileToProcess) return;

    handleFileUpdate(fileToProcess.id, { status: 'processing' });
    try {
      const processed = await processImage(fileToProcess.file, fileToProcess.settings);
      handleFileUpdate(fileToCprocess.id, { processed, status: 'done' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during processing';
      handleFileUpdate(fileToProcess.id, { status: 'error', error: errorMessage });
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: `Could not process ${fileToProcess.file.name}. ${errorMessage}`,
      });
    }
  }, [files, handleFileUpdate, toast]);
  
  useEffect(() => {
    handleProcessQueue();
  }, [handleProcessQueue]);

  const handleFilesAdded = useCallback((addedFiles) => {
    const validFiles = [];
    const oversizedFiles = [];
    const unsupportedFiles = [];

    addedFiles.forEach(file => {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
        unsupportedFiles.push(file);
      } else if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (unsupportedFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Unsupported File Type",
        description: "Some files were not added. Only JPG, PNG, WebP and SVG formats are supported.",
      });
    }

    if (oversizedFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: `${oversizedFiles.map(f => f.name).join(', ')} exceeded the 10MB size limit.`,
      });
    }
    
    const newImageFiles = validFiles.map(file => {
        let fileType = file.type.split('/')[1].toUpperCase();
        if (fileType.includes('SVG')) fileType = 'SVG';
        const format = fileType === 'JPEG' ? 'JPG' : fileType;
        
        return {
          id: `${file.name}-${file.lastModified}`,
          file,
          originalUrl: URL.createObjectURL(file),
          originalSize: file.size,
          settings: {
            format: format === 'SVG' ? 'PNG' : format, // Default SVG output to PNG
            quality: 80,
          },
          status: 'idle',
        };
      });

    setFiles(prev => [...prev, ...newImageFiles]);
  }, [toast]);
  
  const handleSettingsChange = useCallback((id, settings) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const newSettings = { ...f.settings, ...settings };
        // Reset PNG quality to 100 as it's lossless
        if(newSettings.format === 'PNG') newSettings.quality = 100;
        
        // Cannot convert to SVG
        if(newSettings.format === 'SVG') newSettings.format = 'PNG';

        return {
          ...f,
          settings: newSettings,
          status: 'idle' // Re-queue for processing
        };
      }
      return f;
    }));
  }, []);

  const handleRemoveFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
  }, []);

  const handleDownloadAll = useCallback(() => {
    let count = 0;
    files.forEach(file => {
      if (file.processed) {
        count++;
        const link = document.createElement('a');
        link.href = file.processed.dataUrl;
        
        const originalName = file.file.name.substring(0, file.file.name.lastIndexOf('.'));
        const extension = file.settings.format.toLowerCase();
        link.download = `${originalName}-compressed.${extension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });

    if (count > 0) {
      toast({
        title: "Download Started",
        description: `Downloading ${count} compressed image(s).`,
      });
    } else {
       toast({
        variant: "destructive",
        title: "Nothing to Download",
        description: "No images have been processed yet.",
      });
    }
  }, [files, toast]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <FileUploader onFilesAdded={handleFilesAdded} disabled={files.some(f => f.status === 'processing')} />
          <ImageList
            files={files}
            onRemoveFile={handleRemoveFile}
            onSettingsChange={handleSettingsChange}
            onClearAll={handleClearAll}
            onDownloadAll={handleDownloadAll}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
