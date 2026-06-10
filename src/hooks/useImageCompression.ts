import { filterValidFiles } from "@/lib/file-validation";
import { processImages } from "@/lib/image-processing";
import { useCallback, useEffect, useState } from "react";
import type { CompressedImage } from "../types/image-compressor";
import { toast } from "sonner";

export const useImageCompression = () => {
	const [compressedImages, setCompressedImages] = useState<CompressedImage[]>(
		[]
	);
	const [zipFile, setZipFile] = useState<Blob | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [value, setValue] = useState<number>(60);
	const [filelist, setFilelist] = useState<FileList | File[]>([]);
	const [compressProgress, setCompressProgress] = useState<number>(0);
	const [outputFormat, setOutputFormat] = useState<"jpeg" | "png" | "webp">(
		"webp"
	); // New state for output format

	const handleImages = useCallback(
		async (files: File[]) => {
			setLoading(true);
			try {
				const {
					compressedImages: newCompressedImages,
					zipFile: newZipFile,
				} = await processImages(
					files,
					value,
					setCompressProgress,
					outputFormat
				);

				setCompressedImages(newCompressedImages);
				setZipFile(newZipFile);
			} catch (error) {
				console.error("Error processing images:", error);
                toast.error("Error processing images: " + (error as Error).message);
			} finally {
				setLoading(false);
			}
		},
		[value, outputFormat] // Update dependencies
	);

	const handleImageUpload = (files: FileList | File[]) => {
		const validFiles = filterValidFiles(files);
		if (validFiles.length === 0) {
			return;
		}
		setCompressedImages([]);
		setCompressProgress(0);
		setFilelist(validFiles);
	};

	const onImageQualityChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setValue(parseInt(event.target.value, 10));
	};

	const onOutputFormatChange = (format: "jpeg" | "png" | "webp") => {
		setOutputFormat(format);
	};

	const resetCompression = () => {
		setValue(60);
		setCompressProgress(0);
		setCompressedImages([]);
		setFilelist([]);
		setOutputFormat("webp"); // Reset output format
	};

	useEffect(() => {
		const filesArr = Array.from(filelist as FileList | File[]);
		if (filesArr.length > 0) {
			handleImages(filesArr);
		}
	}, [value, filelist, handleImages, outputFormat]); // Update dependencies

	return {
		compressedImages,
		zipFile,
		loading,
		value,
		filelist,
		compressProgress,
		outputFormat,
		handleImageUpload,
		onImageQualityChange,
		onOutputFormatChange,
		resetCompression,
	};
};
