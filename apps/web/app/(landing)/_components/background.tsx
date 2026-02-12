"use client";
import type { ReactNode } from "react";

import useMouseMove from "@/hooks/use-mouse-move";

export function Background({ children }: { children: ReactNode }) {
	const hasMoved = useMouseMove();
	return (
		<>
			<div className="-z-50 fixed inset-0 top-0 left-0">
				<div className="absolute inset-0 h-full w-full overflow-hidden">
					<div className="absolute inset-0 bg-muted-foreground/15" />
					<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
						<title>Background</title>
						<defs>
							<pattern
								id="plus-pattern"
								width="64"
								height="64"
								patternUnits="userSpaceOnUse"
							>
								<g fill="var(--muted-foreground)">
									<rect x="28" y="31" width="8" height="1" />
									<rect x="31" y="28" width="1" height="8" />
								</g>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="var(--background)" />
						<rect
							width="100%"
							height="100%"
							fill="url(#plus-pattern)"
							opacity="0.15"
						/>
					</svg>
					{hasMoved && (
						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								maskImage: `radial-gradient(circle 180px at var(--x) var(--y), white 0%, transparent 70%)`,
								WebkitMaskImage: `radial-gradient(circle 180px at var(--x) var(--y), white 0%, transparent 70%)`,
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="100%"
								height="100%"
								className="absolute inset-0 h-full w-full"
								aria-hidden
							>
								<title>Spotlight pattern overlay</title>
								<rect
									width="100%"
									height="100%"
									fill="url(#plus-pattern)"
									opacity="0.95"
								/>
							</svg>
						</div>
					)}
				</div>
			</div>

			{children}
		</>
	);
}
