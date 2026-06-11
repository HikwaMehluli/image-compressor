import { isTauriAndroid } from "@/lib/platform";
import { ThemeToggle } from "./mode-toggle";

const Header = () => {
	return (
		<header className="bg-background text-foreground border-border sticky top-0 mb-10 z-50 w-full border-b">
			<div className="container mx-auto flex h-14 items-center px-4">
				<div className="flex w-full items-center justify-between">
					<div className="mr-4">
						<a
							className="mr-6 flex items-center space-x-2"
							href="/"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="text-primary size-9"
								viewBox="0 0 256 256"
								fill="currentColor"
							>
								<path d="M208,32H80A16,16,0,0,0,64,48V64H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V192h16a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM80,48H208v69.38l-16.7-16.7a16,16,0,0,0-22.62,0L93.37,176H80Zm96,160H48V80H64v96a16,16,0,0,0,16,16h96ZM104,88a16,16,0,1,1,16,16A16,16,0,0,1,104,88Z" />
							</svg>




							<span className="text-foreground text-lg font-bold sm:inline-block">
								Image Compressor
							</span>
						</a>
					</div>
					{!isTauriAndroid() && <ThemeToggle />}
				</div>
			</div>
		</header>
	);
};

export default Header;
