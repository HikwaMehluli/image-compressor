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

    const blob = await canvas.convertToBlob({
      type: `image/${settings.format.toLowerCase()}`,
      quality: settings.format !== 'PNG' ? settings.quality / 100 : undefined,
    });

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const head = `data:${blob.type};base64,`;
    const size = Math.round(((dataUrl.length - head.length) * 3) / 4);

    self.postMessage({ dataUrl, size });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};