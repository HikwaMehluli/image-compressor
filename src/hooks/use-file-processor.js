import { useState, useCallback, useEffect } from 'react';
import { processImage } from '@/lib/image-processor';
import { useToast } from "@/hooks/use-toast";

export const useFileProcessor = () => {
  const [files, setFiles] = useState([]);
  const [queue, setQueue] = useState([]);
  const { toast } = useToast();

  const handleFileUpdate = useCallback((id, newProps) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...newProps } : f));
  }, []);

  const addToQueue = useCallback((files) => {
    setQueue(prev => [...prev, ...files]);
  }, []);

  const processQueue = useCallback(async () => {
    if (queue.length === 0) return;

    const fileToProcess = queue[0];
    setQueue(prev => prev.slice(1));

    handleFileUpdate(fileToProcess.id, { status: 'processing' });
    try {
      const processed = await processImage(fileToProcess.file, fileToProcess.settings);
      handleFileUpdate(fileToProcess.id, { processed, status: 'done' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during processing';
      handleFileUpdate(fileToProcess.id, { status: 'error', error: errorMessage });
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: `Could not process ${fileToProcess.file.name}. ${errorMessage}`,
      });
    }
  }, [queue, handleFileUpdate, toast]);

  useEffect(() => {
    processQueue();
  }, [queue, processQueue]);

  return { files, setFiles, handleFileUpdate, addToQueue };
};