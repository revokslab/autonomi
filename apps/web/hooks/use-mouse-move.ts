"use client";

import React from "react";

export default function useMouseMove() {
	const [hasMoved, setHasMoved] = React.useState(false);

	React.useEffect(() => {
		const body = document.body;
		body.style.setProperty("--x", "-9999px");
		body.style.setProperty("--y", "-9999px");

		function mouseMoveEvent(e: MouseEvent) {
			const scale = window.visualViewport?.scale;
			if (scale === 1) {
				setHasMoved(true);
				const targetX = e.clientX;
				const targetY = e.clientY;
				body.style.setProperty("--x", `${targetX}px`);
				body.style.setProperty("--y", `${targetY}px`);
			}
		}

		document.addEventListener("mousemove", mouseMoveEvent);
		return () => {
			document.removeEventListener("mousemove", mouseMoveEvent);
		};
	}, []);

	return hasMoved;
}
