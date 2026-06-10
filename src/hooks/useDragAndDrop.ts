import { filterValidFiles } from "@/lib/file-validation";
import { listen } from "@tauri-apps/api/event";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

export const useDragAndDrop = (onFilesDropped: (files: File[]) => void) => {
	const [isDragActive, setIsDragActive] = useState<boolean>(false);

	useEffect(() => {
		const unlistenDrop = listen<{ paths: string[] }>(
			"tauri://drop",
			async (event) => {
				setIsDragActive(false);
				const files: File[] = [];
				for (const path of event.payload.paths) {
					try {
						const fileContent = await readFile(path);
						const fileName = path.split(/[\\/]/).pop() || "unknown";
						const mimeType = getMimeType(fileName); // Helper needed or rely on extension
						const file = new File([new Blob([fileContent])], fileName, {
							type: mimeType,
						});
						files.push(file);
					} catch (error) {
						console.error(`Error reading file ${path}:`, error);
					}
				}
				const validFiles = filterValidFiles(files);
				if (validFiles.length > 0) {
					onFilesDropped(validFiles);
				}
			}
		);

		const unlistenDragEnter = listen("tauri://drag-enter", () => {
			setIsDragActive(true);
		});

		const unlistenDragLeave = listen("tauri://drag-leave", () => {
			setIsDragActive(false);
		});

		return () => {
			unlistenDrop.then((f) => f());
			unlistenDragEnter.then((f) => f());
			unlistenDragLeave.then((f) => f());
		};
	}, [onFilesDropped]);

	// Simple MIME type inference based on extension
	const getMimeType = (fileName: string) => {
		const ext = fileName.split(".").pop()?.toLowerCase();
		switch (ext) {
			case "png":
				return "image/png";
			case "jpg":
			case "jpeg":
				return "image/jpeg";
			case "webp":
				return "image/webp";
			default:
				return "";
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isDragActive) setIsDragActive(true);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();

		// Check if we're leaving the drop area entirely
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setIsDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragActive(false);

		const validFiles = filterValidFiles(e.dataTransfer.files);
		if (validFiles.length === 0) {
			return;
		}

		onFilesDropped(validFiles);
	};

	return {
		isDragActive,
		handleDragOver,
		handleDragEnter,
		handleDragLeave,
		handleDrop,
	};
};
