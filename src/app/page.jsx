"use client";

import React, { useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FileUploader from '@/components/file-uploader';
import ImageList from '@/components/image-list';
import { useToast } from "@/hooks/use-toast";
import { useFileProcessor } from '@/hooks/use-file-processor';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function Home() {
  const { files, setFiles, addToQueue, handleFileUpdate } = useFileProcessor();
  const { toast } = useToast();

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
          id: crypto.randomUUID(),
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
    addToQueue(newImageFiles);
  }, [toast, setFiles, addToQueue]);
  
  const handleSettingsChange = useCallback((id, settings) => {
    setFiles(prev => prev.map(f => {
      if (f.id === id) {
        const newSettings = { ...f.settings, ...settings };
        // Reset PNG quality to 100 as it's lossless
        if(newSettings.format === 'PNG') newSettings.quality = 100;
        
        // Cannot convert to SVG
        if(newSettings.format === 'SVG') newSettings.format = 'PNG';

        const updatedFile = {
          ...f,
          settings: newSettings,
          status: 'idle' // Re-queue for processing
        };

        addToQueue([updatedFile]);

        return updatedFile;
      }
      return f;
    }));
  }, [setFiles, addToQueue]);

  const handleRemoveFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, [setFiles]);

  const handleClearAll = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  const handleDownloadAll = useCallback(async () => {
    const zip = new JSZip();
    let count = 0;

    files.forEach(file => {
      if (file.processed) {
        count++;
        const originalName = file.file.name.substring(0, file.file.name.lastIndexOf('.'));
        const extension = file.settings.format.toLowerCase();
        const fileName = `${originalName}-compressed.${extension}`;
        zip.file(fileName, file.processed.dataUrl.split(',')[1], { base64: true });
      }
    });

    if (count > 0) {
      toast({
        title: "Zipping Files",
        description: `Zipping ${count} compressed image(s)...`,
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'compressed-images.zip');
      toast({
        title: "Download Started",
        description: `Downloading ${count} compressed image(s) as a zip file.`,
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