import { Download, RefreshCcw } from "lucide-react";
import { downloadZip } from "@/lib/download";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ActionButtonsProps {
	zipFile: Blob | null;
	onReset: () => void;
	hasCompressedImages: boolean;
	hasFileList: boolean;
	outputFormat: "jpeg" | "png" | "webp";
	onOutputFormatChange: (format: "jpeg" | "png" | "webp") => void;
}

const ActionButtons = ({
	zipFile,
	onReset,
	hasCompressedImages,
	hasFileList,
	outputFormat,
	onOutputFormatChange,
}: ActionButtonsProps) => {
	if (!hasCompressedImages && !hasFileList) {
		return null;
	}

	return (
		<div className="animate-fadeInFast mt-4 flex justify-end items-center gap-x-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Output Format: {outputFormat.toUpperCase()}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => onOutputFormatChange("jpeg")}>
                        JPEG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOutputFormatChange("png")}>
                        PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOutputFormatChange("webp")}>
                        WebP
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
			{hasCompressedImages && hasFileList && (
				<>
					<Button variant="default" onClick={() => downloadZip(zipFile)}>
						<Download />
						Download All (ZIP)
					</Button>
					<Button variant="destructive" onClick={onReset}>
						<RefreshCcw />
						Reset
					</Button>
				</>
			)}
		</div>
	);
};

export default ActionButtons;
