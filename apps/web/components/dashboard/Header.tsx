"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Search, Wallet } from "lucide-react";

export function Header() {
	const { user } = usePrivy();
	const emailAccount = user?.linkedAccounts?.find((a) => a.type === "email") as
		| { address?: string }
		| undefined;
	const displayName = emailAccount?.address
		? emailAccount.address.split("@")[0]
		: "there";

	return (
		<header className="flex h-[77px] shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6">
			<div className="flex min-w-0 flex-1 items-center gap-2.5">
				<Search
					className="h-[18px] w-[18px] shrink-0 text-neutral-400"
					strokeWidth={1.5}
				/>
				<input
					type="search"
					placeholder="Search..."
					className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
					aria-label="Search"
				/>
			</div>
			<div className="flex shrink-0 items-center gap-3">
				<button
					type="button"
					className="flex items-center gap-2 rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
					aria-label="Wallet balance"
				>
					<Wallet
						className="h-4 w-4 shrink-0 text-neutral-600"
						strokeWidth={1.5}
					/>
					<span
						className="font-mono text-neutral-900"
						style={{ fontFamily: "var(--font-geist-mono), monospace" }}
					>
						$0.00
					</span>
				</button>
				<div
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-700"
					style={{
						fontFamily:
							"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
					}}
					title={displayName}
					aria-label="User avatar"
				>
					{displayName.charAt(0).toUpperCase()}
				</div>
			</div>
		</header>
	);
}
