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
export const processImage = (
  file,
  settings
) => {
  // Return a new Promise to handle the asynchronous nature of file reading and image loading.
  return new Promise((resolve, reject) => {
    // Create a new FileReader to read the contents of the image file.
    const reader = new FileReader();

    // Start reading the file as a Data URL. This will give us a base64 encoded string.
    reader.readAsDataURL(file);

    // Define the onload event handler, which fires when the file has been successfully read.
    reader.onload = (event) => {
      // Create a new Image object. This will be our in-memory representation of the image.
      const img = new Image();

      // Set the source of the Image object to the result from the FileReader (the data URL).
      // This begins the process of decoding the image data.
      img.src = event.target?.result;

      // Define the onload event handler for the Image object, which fires when the image has been fully decoded and is ready to be used.
      img.onload = () => {
        // Create a new <canvas> element in memory. This canvas will be used to draw the image on,
        // which allows us to manipulate it and export it in a different format or quality.
        const canvas = document.createElement('canvas');

        // Set the canvas dimensions to match the original image dimensions.
        canvas.width = img.width;
        canvas.height = img.height;

        // Get the 2D rendering context for the canvas. This context provides the methods for drawing.
        const ctx = canvas.getContext('2d');

        // If for some reason the context could not be created, reject the promise.
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        // Draw the loaded image onto the canvas at position (0,0).
        ctx.drawImage(img, 0, 0);
        
        // Construct the MIME type string for the target format (e.g., 'image/jpeg', 'image/png').
        const mimeType = `image/${settings.format.toLowerCase()}`;

        // Convert the canvas content to a data URL in the specified format and quality.
        // For PNG, which is lossless, the quality argument is ignored, so we pass undefined.
        // For JPG and WebP, we convert the quality from a 0-100 scale to a 0.0-1.0 scale.
        const dataUrl = canvas.toDataURL(mimeType, settings.format !== 'PNG' ? settings.quality / 100 : undefined);
        
        // --- Size Calculation from Base64 ---
        // Get the header of the data URL (e.g., "data:image/jpeg;base64,").
        const head = `data:${mimeType};base64,`;
        // The actual base64 string is the part after the header.
        // Base64 encoding represents 3 bytes of binary data as 4 characters.
        // So, we can estimate the original file size by the length of the base64 string.
        // The formula is: (base64_length * 3) / 4. Padding characters ('=') might slightly affect this,
        // but this gives a very close approximation of the file size in bytes.
        const size = Math.round(((dataUrl.length - head.length) * 3) / 4);

        // Resolve the promise with the final data URL and the calculated size.
        resolve({ dataUrl, size });
      };

      // Define the onerror handler for the Image object. If the image data is corrupt or can't be loaded, reject the promise.
      img.onerror = (error) => reject(error);
    };

    // Define the onerror handler for the FileReader. If the file can't be read, reject the promise.
    reader.onerror = (error) => reject(error);
  });
};
