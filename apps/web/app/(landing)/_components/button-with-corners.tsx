export function ButtonWithCorners({ children }: { children: React.ReactNode }) {
	const barClass = "pointer-events-none absolute bg-[#7B7B7B] aria-hidden";
	// Each corner gets a full cross (plus): vertical + horizontal bar crossing at the corner
	const arm = 6; // length each way from corner (long arms)
	const stroke = 1; // thin lines
	return (
		<span className="relative inline-block">
			{children}
			{/* Top-left: cross centered on corner */}
			<span
				className={barClass}
				style={{
					left: -stroke / 2,
					top: -arm,
					width: `${stroke}px`,
					height: `${arm * 2}px`,
				}}
			/>
			<span
				className={barClass}
				style={{
					left: -arm,
					top: -stroke / 2,
					width: `${arm * 2}px`,
					height: `${stroke}px`,
				}}
			/>
			{/* Top-right */}
			<span
				className={barClass}
				style={{
					right: -stroke / 2,
					top: -arm,
					width: `${stroke}px`,
					height: `${arm * 2}px`,
				}}
			/>
			<span
				className={barClass}
				style={{
					right: -arm,
					top: -stroke / 2,
					width: `${arm * 2}px`,
					height: `${stroke}px`,
				}}
			/>
			{/* Bottom-left */}
			<span
				className={barClass}
				style={{
					left: -stroke / 2,
					bottom: -arm,
					width: `${stroke}px`,
					height: `${arm * 2}px`,
				}}
			/>
			<span
				className={barClass}
				style={{
					left: -arm,
					bottom: -stroke / 2,
					width: `${arm * 2}px`,
					height: `${stroke}px`,
				}}
			/>
			{/* Bottom-right */}
			<span
				className={barClass}
				style={{
					right: -stroke / 2,
					bottom: -arm,
					width: `${stroke}px`,
					height: `${arm * 2}px`,
				}}
			/>
			<span
				className={barClass}
				style={{
					right: -arm,
					bottom: -stroke / 2,
					width: `${arm * 2}px`,
					height: `${stroke}px`,
				}}
			/>
		</span>
	);
}
