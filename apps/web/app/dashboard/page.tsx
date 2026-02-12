"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Header } from "@/components/dashboard/Header";
import { FloatingChatInput } from "@/components/dashboard/FloatingChatInput";
import {
	Plus,
	ArrowLeftRight,
	ArrowUpRight,
	Wallet,
	TrendingUp,
} from "lucide-react";

const assetCards = [
	{
		label: "Main",
		sub: "1 assets",
		value: "$0.00",
		change: "-$9.09",
		changePct: "-10%",
		icon: Wallet,
	},
	{
		label: "Trading",
		sub: "USDC",
		value: "$0.00",
		change: "-$9.09",
		changePct: "-10%",
		icon: TrendingUp,
	},
];

export default function DashboardPage() {
	const { user } = usePrivy();
	const email = user?.linkedAccounts?.find((a) => a.type === "email") as
		| { address?: string }
		| undefined;
	const name = email?.address?.split("@")[0] ?? "there";

	return (
		<>
			<Header />
			<div className="flex flex-1 flex-col gap-8 px-6 pt-8">
				{/* Welcome */}
				<section>
					<h1
						className="text-2xl text-neutral-900"
						style={{
							fontFamily:
								"var(--font-hedvig-serif), 'Hedvig Letters Serif', serif",
						}}
					>
						Welcome back{name !== "there" ? `, ${name}` : ""}
					</h1>
					<p
						className="mt-1 text-sm text-neutral-500"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Here&apos;s a quick snapshot of your finances
					</p>
				</section>

				{/* TOTAL + Main + Trading on one row */}
				<section className="flex flex-row gap-4">
					{/* TOTAL */}
					<div className="min-w-[280px] flex-1 rounded-sm border border-neutral-200 bg-gradient-to-b from-emerald-950/90 to-neutral-900 p-6 text-white">
						<p
							className="text-sm text-white/80"
							style={{
								fontFamily:
									"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
							}}
						>
							TOTAL
						</p>
						<p
							className="mt-1 text-3xl tracking-tight"
							style={{ fontFamily: "var(--font-geist-mono), monospace" }}
						>
							$0.00
						</p>
						<div className="mt-4 flex gap-3">
							<button
								type="button"
								className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<Plus className="h-4 w-4" strokeWidth={2} />
								Deposit
							</button>
							<button
								type="button"
								className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<ArrowLeftRight className="h-4 w-4" strokeWidth={2} />
								Swap
							</button>
							<button
								type="button"
								className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								<ArrowUpRight className="h-4 w-4" strokeWidth={2} />
								Send
							</button>
						</div>
					</div>
					{/* Main + Trading horizontal */}
					<div className="flex min-w-[200px] flex-1 flex-row gap-4">
						{assetCards.map((card) => {
							const Icon = card.icon;
							const isNegative = card.changePct.startsWith("-");
							return (
								<div
									key={card.label}
									className="flex flex-1 flex-col rounded-sm border border-neutral-200 bg-white p-4"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
											<Icon className="h-5 w-5" strokeWidth={1.5} />
										</div>
										<div className="min-w-0 flex-1">
											<p
												className="text-sm font-medium text-neutral-900"
												style={{
													fontFamily:
														"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
												}}
											>
												{card.label}
											</p>
											<p className="text-xs text-neutral-500">{card.sub}</p>
										</div>
									</div>
									<div className="mt-auto flex flex-col gap-0.5 pt-2">
										<p
											className="text-lg text-neutral-900"
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{card.value}
										</p>
										<p
											className={`text-sm ${isNegative ? "text-red-600" : "text-emerald-600"}`}
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{card.change} {card.changePct}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				{/* Spacer so floating input doesn't cover content */}
				<div className="h-24 shrink-0" />
			</div>

			<FloatingChatInput />
		</>
	);
}
