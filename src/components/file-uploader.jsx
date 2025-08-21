"use client";

import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FileUploader({ onFilesAdded, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    handleDrag(e);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    handleDrag(e);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesAdded]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  const onAreaClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      onClick={onAreaClick}
      onDrop={handleDrop}
      onDragOver={handleDragIn}
      onDragLeave={handleDragOut}
      onDragEnter={handleDragIn}
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-8 md:p-12 border-2 border-dashed rounded-xl text-center transition-colors duration-300 cursor-pointer bg-muted",
        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadCloud size={64} className={cn("w-16 h-16", isDragging ? "text-primary" : "text-muted-foreground")} />
        <p className="text-lg font-semibold text-foreground">Click or drag & drop to upload</p>
        <div className="text-xs text-muted-foreground mt-1 leading-tight">
          <p>Supported formats: JPG, PNG, WebP.</p>
          <p>Max 10MB per file.</p>
        </div>
      </div>
      {isDragging && <div className="absolute inset-0 bg-primary/10 rounded-xl" />}
    </div>
  );
}
