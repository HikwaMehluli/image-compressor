"use client";

import Image from 'next/image';
import React from 'react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Download, X, LoaderCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export default function ImageCard({
  file,
  onRemove,
  onSettingsChange,
}) {
  const {
    originalUrl,
    originalSize,
    file: originalFile,
    settings,
    processed,
    status,
    error,
  } = file;

  const isOriginalSvg = originalFile.type === 'image/svg+xml';

  const savings = originalSize - (processed?.size || 0);
  const changePercentage =
    processed && originalSize > 0
      ? Math.round((savings / originalSize) * 100)
      : 0;

  const handleDownload = () => {
    if (!processed) return;
    const link = document.createElement('a');
    link.href = processed.dataUrl;

    const originalName = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    const extension = settings.format.toLowerCase();
    link.download = `${originalName}-compressed.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStatus = () => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary"><LoaderCircle size={12} className="mr-1 h-3 w-3 animate-spin" />Processing</Badge>;
      case 'done':
        return <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30 hover:bg-green-500/30"><CheckCircle size={12} className="mr-1 h-3 w-3" />Done</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle size={12} className="mr-1 h-3 w-3" />Error</Badge>;
      default:
        return <Badge variant="outline">Queued</Badge>;
    }
  };
  
  const renderSavings = () => {
    if (status !== 'done' || !processed) return null;

    if (savings >= 0) {
      return (
        <p className="text-sm text-green-600 dark:text-green-500">
          You&apos;ll save <span className="font-semibold text-foreground">{formatBytes(savings)}</span> ({changePercentage}%)
        </p>
      );
    } else {
       const increasePercentage = Math.abs(changePercentage);
       return (
        <p className="text-sm text-destructive">
          File will increase by <span className="font-semibold text-foreground">{formatBytes(Math.abs(savings))}</span> ({increasePercentage}%)
        </p>
      );
    }
  }


  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-4 bg-muted/50">
        <div className="truncate">
          <p className="font-semibold text-sm truncate" title={originalFile.name}>{originalFile.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(originalSize)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {renderStatus()}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex flex-col gap-4 items-center">
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {status === 'processing' && <LoaderCircle size={32} className="h-8 w-8 animate-spin text-primary" />}
                {status === 'error' && <div className="text-center text-destructive p-4"><AlertCircle size={32} className="mx-auto mb-2 h-8 w-8" /><p className="text-xs">{error}</p></div>}
                {(status === 'done' && processed) && (
                <>
                    <Image src={processed.dataUrl} alt="Processed" fill style={{ objectFit: 'contain' }} />
                    <Badge variant="secondary" className="absolute top-2 right-2">{formatBytes(processed.size)}</Badge>
                </>
                )}
                 {(status === 'idle' || (status !== 'done' && isOriginalSvg)) && isOriginalSvg && (
                    <img src={originalUrl} alt="Original SVG Preview" className="object-contain w-full h-full" />
                )}
                {status === 'idle' && !isOriginalSvg && <div className="text-muted-foreground text-sm">Waiting to process...</div>}
          </div>
           <div className="text-center">
             {renderSavings()}
           </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`format-${file.id}`}>Format</Label>
              <Select
                value={settings.format}
                onValueChange={(v) => onSettingsChange({ format: v })}
              >
                <SelectTrigger id={`format-${file.id}`}>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JPG">JPG</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                  <SelectItem value="WebP">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`quality-${file.id}`}>Quality: {settings.quality}</Label>
              <Slider
                id={`quality-${file.id}`}
                min={0}
                max={100}
                step={1}
                value={[settings.quality]}
                onValueChange={(v) => onSettingsChange({ quality: v[0] })}
                disabled={settings.format === 'PNG'}
              />
            </div>
          </div>
           {error && status === 'error' && (
             <Alert variant="destructive">
               <AlertCircle size={16} />
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex gap-2 bg-muted/50">
        <Button onClick={handleDownload} className="w-full" disabled={status !== 'done' || !processed}>
          <Download size={16} className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
