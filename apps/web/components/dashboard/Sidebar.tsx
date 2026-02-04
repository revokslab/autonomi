"use client";

import { LayoutGrid, Wallet, Bot, Briefcase, Zap } from "lucide-react";
import Link from "next/link";

function CatLogo() {
	return (
		<svg
			width={20}
			height={20}
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="shrink-0"
		>
			<path
				d="M10 2c-1.5 0-2.5 1-3 2.5-.5 1.5 0 3 1 4s2.5 1.5 4 1.5 3-.5 4-1.5 1.5-2.5 1-4C12.5 3 11.5 2 10 2z"
				fill="currentColor"
			/>
			<ellipse cx="7" cy="8" rx="1.2" ry="1.5" fill="currentColor" />
			<ellipse cx="13" cy="8" rx="1.2" ry="1.5" fill="currentColor" />
			<path
				d="M6 12h8"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

const navItems = [
	{ href: "/dashboard", icon: LayoutGrid, label: "Dashboard", active: true },
	{ href: "#", icon: Wallet, label: "Wallet", active: false },
	{ href: "#", icon: Bot, label: "AI", active: false },
	{ href: "#", icon: Briefcase, label: "Portfolio", active: false },
	{ href: "#", icon: Zap, label: "Actions", active: false },
];

export function Sidebar() {
	return (
		<aside className="fixed left-0 top-0 z-30 flex h-screen w-[86px] flex-col border-r border-[#1E1E1E] bg-[#0B0B0B]">
			<div className="flex h-[77px] shrink-0 items-center justify-center border-b border-[#1E1E1E] px-6">
				<CatLogo />
			</div>
			<nav className="flex flex-1 flex-col gap-3 p-6">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = item.active;
					return (
						<Link
							key={item.label}
							href={item.href}
							className={`flex h-10 w-10 items-center justify-center transition-colors ${
								isActive
									? "border border-[#1E1E1E] bg-[#141414] text-white"
									: "text-[#494949] hover:text-[#8A8A8A]"
							}`}
							aria-label={item.label}
						>
							<Icon className="h-[14px] w-[14px]" strokeWidth={1.5} />
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
