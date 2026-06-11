import JSZip from "jszip";
import type { CompressedImage } from "../types/image-compressor";

/**
 * Shared utility function to process an image using Canvas API
 */
const processImageWithCanvas = (
	file: File | Blob,
	outputMimeType: string,
	quality?: number
): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			reject(new Error('Canvas context not available'));
			return;
		}

		const img = new Image();
		img.src = URL.createObjectURL(file);

		img.onload = () => {
			try {
				// Set canvas dimensions to match the image
				canvas.width = img.width;
				canvas.height = img.height;

				// Draw the image on the canvas
				ctx.drawImage(img, 0, 0);

				// Convert to blob with specified format and quality
				canvas.toBlob(
					(blob) => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error(`Failed to process image as ${outputMimeType}`));
						}
					},
					outputMimeType,
					quality !== undefined ? quality : undefined
				);

				// Clean up
				URL.revokeObjectURL(img.src);
			} catch (error) {
				URL.revokeObjectURL(img.src);
				reject(error);
			}
		};

		img.onerror = (error) => {
			URL.revokeObjectURL(img.src);
			reject(error);
		};
	});
};

/**
 * Compresses an image using Canvas API
 */
export const compressImage = (file: File, quality: number): Promise<Blob> => {
	// Use JPEG format for compression by default, applying the quality setting
	return processImageWithCanvas(file, 'image/jpeg', quality / 100);
};

/**
 * Converts an image to a different format using Canvas API
 */
export const convertImageFormat = (file: File | Blob, targetFormat: "jpeg" | "png" | "webp"): Promise<Blob> => {
	const mimeType = `image/${targetFormat}`;
	// Use a default quality for lossy formats (jpeg, webp), undefined for lossless (png)
	const quality = targetFormat === 'jpeg' || targetFormat === 'webp' ? 0.85 : undefined;
	return processImageWithCanvas(file, mimeType, quality);
};

/**
 * Processes images by compressing and/or converting format
 */
export const processImages = async (
	files: File[],
	quality: number,
	onProgress: (progress: number) => void,
	outputFormat: "jpeg" | "png" | "webp"
): Promise<{ compressedImages: CompressedImage[]; zipFile: Blob }> => {
	const compressedImgs: CompressedImage[] = [];
	const zip = new JSZip();
	const imgZipFolder = zip.folder("compressed_images");
	let processedCount = 0;

	for (const file of files) {
		try {
			let processedBlob: Blob = file;

			// Step 1: Compress the image
			processedBlob = await compressImage(processedBlob as File, quality);

			// Step 2: Convert format if different from current format
			const currentFormat = getImageFormatFromMime(processedBlob.type) ||
				getImageFormatFromFilename(file.name);

			if (currentFormat !== outputFormat) {
				processedBlob = await convertImageFormat(processedBlob, outputFormat);
			}

			// Convert Blob to DataURL for frontend display
			const compressedImgDataUrl = await blobToBase64(processedBlob);

			const originalImageSize = file.size;
			const compressedImageSize = processedBlob.size;
			const compressionPercentage = ((compressedImageSize - originalImageSize) / originalImageSize) * 100;
			const dotIndex = file.name.lastIndexOf(".");

			compressedImgs.push({
				fileName:
					"compressed_" +
					file.name.slice(0, dotIndex) +
					"." +
					outputFormat,
				originalImageSize: originalImageSize,
				compressedImageSize: compressedImageSize,
				fileType: `image/${outputFormat}`,
				content: compressedImgDataUrl,
				compressionPercentage: compressionPercentage.toFixed(2),
			});

			// Add to zip file
			imgZipFolder?.file(`compressed_${file.name.slice(0, dotIndex)}.${outputFormat}`, processedBlob);
		} catch (error) {
			console.error(`Error processing ${file.name}:`, error);
		}

		processedCount++;
		onProgress(Math.floor((processedCount / files.length) * 100));
	}

	const zipBlob = await zip.generateAsync({ type: "blob" });

	return {
		compressedImages: compressedImgs,
		zipFile: zipBlob,
	};
};

/**
 * Gets image format from MIME type
 */
const getImageFormatFromMime = (mimeType: string): "jpeg" | "png" | "webp" | null => {
	if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return "jpeg";
	if (mimeType.includes('png')) return "png";
	if (mimeType.includes('webp')) return "webp";
	return null;
};

/**
 * Gets image format from filename
 */
const getImageFormatFromFilename = (filename: string): "jpeg" | "png" | "webp" => {
	const parts = filename.toLowerCase().split('.');
	const ext = parts.pop();

	if (ext === 'jpg' || ext === 'jpeg') return "jpeg";
	if (ext === 'png') return "png";
	if (ext === 'webp') return "webp";

	// Default fallback
	return "jpeg";
};

/**
 * Converts a Blob to Base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};