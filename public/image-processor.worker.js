const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

self.onmessage = async (event) => {
  const { file, settings } = event.data;

  try {
    const bitmap = await createImageBitmap(file);

    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get OffscreenCanvas context');
    }

    ctx.drawImage(bitmap, 0, 0);

    const processedMimeType = `image/${settings.format.toLowerCase()}`;
    const processedBlob = await canvas.convertToBlob({
      type: processedMimeType,
      quality: settings.format !== 'PNG' ? settings.quality / 100 : undefined,
    });

    let finalBlob = processedBlob;
    // Safety check: if size increased and format is unchanged, use original file.
    if (processedBlob.size > file.size && processedMimeType === file.type) {
      finalBlob = file;
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(finalBlob);
    });

    self.postMessage({ dataUrl, size: finalBlob.size });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};