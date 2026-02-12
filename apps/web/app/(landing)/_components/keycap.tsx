export function Keycap({ letter }: { letter: string }) {
	return (
		<span
			className="inline-flex h-5 w-5 items-center justify-center border border-neutral-800 bg-neutral-900 text-[10px] font-medium text-white"
			style={{ borderRadius: 3 }}
			aria-hidden
		>
			{letter}
		</span>
	);
}
