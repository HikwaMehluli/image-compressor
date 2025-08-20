const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const processWithCanvas = async (file, settings) => {
  try {
    const imageUrl = await readFileAsDataURL(file);
    const img = await loadImage(imageUrl);

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.drawImage(img, 0, 0);

    const mimeType = `image/${settings.format.toLowerCase()}`;
    const dataUrl = canvas.toDataURL(
      mimeType,
      settings.format !== 'PNG' ? settings.quality / 100 : undefined
    );

    const head = `data:${mimeType};base64,`;
    const size = Math.round(((dataUrl.length - head.length) * 3) / 4);

    return { dataUrl, size };
  } catch (error) {
    console.error("Image processing error:", error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

const processWithWorker = (file, settings) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/image-processor.worker.js');

    worker.onmessage = (event) => {
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data);
      }
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({ file, settings });
  });
};

/**
 * Processes an image file by converting it to a specified format and quality,
 * using a canvas for the transformation.
 *
 * @param {File} file The original image file to be processed.
 * @param {object} settings An object containing the processing settings.
 * @param {string} settings.format The target format for the output image (e.g., 'JPG', 'PNG', 'WebP').
 * @param {number} settings.quality The quality setting for the output image (0-100), applicable to lossy formats like JPG and WebP.
 * @returns {Promise<{dataUrl: string, size: number}>} A promise that resolves with an object containing the processed image as a base64 data URL and its estimated size in bytes.
 */
export const processImage = async (
  file,
  settings
) => {
  if (typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined') {
    return processWithWorker(file, settings);
  } else {
    return processWithCanvas(file, settings);
  }
};
