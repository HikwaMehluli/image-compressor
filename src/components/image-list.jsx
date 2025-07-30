"use client";

import React from 'react';
import ImageCard from './image-card';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

export default function ImageList({
  files,
  onRemoveFile,
  onSettingsChange,
  onClearAll,
  onDownloadAll,
}) {
  if (files.length === 0) {
    return null;
  }

  const hasProcessedFiles = files.some(f => f.status === 'done');

  const actionButtons = (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onDownloadAll} disabled={!hasProcessedFiles}>
        <Download size={16} className="mr-2 h-4 w-4" />
        Download All
      </Button>
      <Button variant="destructive" onClick={onClearAll}>
        <Trash2 size={16} className="mr-2 h-4 w-4" />
        Clear All
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold font-headline tracking-tight">
          Your Images ({files.length})
        </h2>
        {actionButtons}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {files.map(file => (
          <ImageCard
            key={file.id}
            file={file}
            onRemove={() => onRemoveFile(file.id)}
            onSettingsChange={(settings) => onSettingsChange(file.id, settings)}
          />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
        {actionButtons}
      </div>
    </div>
  );
}
