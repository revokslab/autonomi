"use client";

import { ImagePlus, Paperclip, Mic, Send } from "lucide-react";

export function AIInputBox() {
	return (
		<div className="mx-auto flex min-h-[150px] w-full max-w-[856px] flex-col justify-end gap-2.5 border border-[#1E1E1E] bg-[#0B0B0B] px-6 pb-4 pt-8">
			<div className="flex items-center justify-between gap-2.5">
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						className="flex h-10 w-10 items-center justify-center border border-[#1E1E1E] bg-[#0B0B0B] text-white transition-colors hover:bg-[#141414]"
						aria-label="Upload image"
					>
						<ImagePlus className="h-4 w-4" strokeWidth={1} />
					</button>
					<button
						type="button"
						className="flex h-10 w-10 items-center justify-center border border-[#1E1E1E] bg-[#0B0B0B] text-white transition-colors hover:bg-[#141414]"
						aria-label="Attach file"
					>
						<Paperclip className="h-4 w-4" strokeWidth={1} />
					</button>
					<button
						type="button"
						className="flex h-10 w-10 items-center justify-center border border-[#1E1E1E] bg-[#0B0B0B] text-white transition-colors hover:bg-[#141414]"
						aria-label="Voice input"
					>
						<Mic className="h-4 w-4" strokeWidth={1} />
					</button>
				</div>
				<button
					type="button"
					className="flex h-10 w-10 items-center justify-center border border-[#989898] bg-[#FAFAFA] text-[#0B0B0B] transition-colors hover:bg-[#EDEDED]"
					aria-label="Send"
				>
					<Send className="h-4 w-4" strokeWidth={1} />
				</button>
			</div>
		</div>
	);
}
