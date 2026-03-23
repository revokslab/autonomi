"use client";

import Image from "next/image";
import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { FloatingChatInput } from "@/components/dashboard/FloatingChatInput";
import { SOLANA_TOKENS } from "@/lib/solana";
import { usePortfolioValuation } from "@/hooks/solana";
import {
	Plus,
	ArrowLeftRight,
	ArrowUpRight,
	Wallet,
	TrendingUp,
	BarChart3,
	ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
	const router = useRouter();
	const { user } = usePrivy();
	const email = user?.linkedAccounts?.find((a) => a.type === "email") as
		| { address?: string }
		| undefined;
	const name = email?.address?.split("@")[0] ?? "there";

	const { items, totalUsd, total24hUsd, total24hPct, loading, lastUpdated } =
		usePortfolioValuation();
	const assetCards = useMemo(
		() => [
			{
				label: "Main",
				sub: `${items.length} assets`,
				value: totalUsd.toLocaleString(undefined, {
					style: "currency",
					currency: "USD",
					maximumFractionDigits: 2,
				}),
				change: total24hUsd.toLocaleString(undefined, {
					style: "currency",
					currency: "USD",
					maximumFractionDigits: 2,
				}),
				changePct: `${total24hPct >= 0 ? "+" : ""}${total24hPct.toFixed(2)}%`,
				icon: Wallet,
			},
			{
				label: "Trading",
				sub: items[0]?.symbol ?? "No token",
				value:
					items[0]?.usdValue != null
						? items[0].usdValue.toLocaleString(undefined, {
								style: "currency",
								currency: "USD",
								maximumFractionDigits: 2,
							})
						: "$—",
				change:
					items[0]?.change24hPct != null
						? `${items[0].change24hPct >= 0 ? "+" : ""}${items[0].change24hPct.toFixed(2)}%`
						: "—",
				changePct: "",
				icon: TrendingUp,
			},
		],
		[items, totalUsd, total24hPct, total24hUsd],
	);

	const marketRows = useMemo(
		() =>
			SOLANA_TOKENS.map((t) => {
				const item = items.find((i) => i.mint === t.mint);
				return {
					pair: `${t.symbol} · USD`,
					price: item?.priceUsd ?? null,
					changePct: item?.change24hPct ?? null,
					logoUrl:
						t.symbol === "SOL"
							? "https://assets.coingecko.com/coins/images/4128/small/solana.png"
							: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
				};
			}),
		[items],
	);

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
							{loading
								? "Loading…"
								: totalUsd.toLocaleString(undefined, {
										style: "currency",
										currency: "USD",
										maximumFractionDigits: 2,
									})}
						</p>
						<p className="mt-1 text-xs text-white/70">
							{`${total24hUsd >= 0 ? "+" : ""}${total24hUsd.toLocaleString(
								undefined,
								{
									style: "currency",
									currency: "USD",
									maximumFractionDigits: 2,
								},
							)} (${total24hPct >= 0 ? "+" : ""}${total24hPct.toFixed(2)}%) 24h`}
						</p>
						<div className="mt-4 flex gap-3">
							<button
								type="button"
								onClick={() => router.push("/dashboard/deposit")}
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
								onClick={() => router.push("/dashboard/swap")}
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
								onClick={() => router.push("/dashboard/withdraw")}
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

				{/* Trade */}
				<section className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-sm bg-neutral-100 text-neutral-600">
								<BarChart3 className="h-4 w-4" strokeWidth={1.5} />
							</div>
							<h2
								className="text-lg font-medium text-neutral-900"
								style={{
									fontFamily:
										"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
								}}
							>
								Trade
							</h2>
						</div>
						<button
							type="button"
							className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
							aria-label="View all"
						>
							<ChevronRight className="h-5 w-5" strokeWidth={2} />
						</button>
					</div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{marketRows.map((item) => {
							const isNegative = (item.changePct ?? 0) < 0;
							return (
								<button
									key={item.pair}
									type="button"
									className="flex items-start gap-3 rounded-sm border border-neutral-200 bg-white p-3 text-left transition-colors hover:bg-neutral-50"
								>
									<div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
										<Image
											src={item.logoUrl}
											alt=""
											width={40}
											height={40}
											className="object-cover"
										/>
									</div>
									<div className="min-w-0 flex-1">
										<p
											className="text-sm font-medium text-neutral-900"
											style={{
												fontFamily:
													"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
											}}
										>
											{item.pair}
										</p>
										<p
											className="text-xs text-neutral-500"
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{item.price == null
												? "—"
												: item.price.toLocaleString(undefined, {
														style: "currency",
														currency: "USD",
														maximumFractionDigits: item.price < 1 ? 6 : 2,
													})}
										</p>
									</div>
									<div className="flex shrink-0 flex-col items-end gap-0.5">
										<span
											className={`text-xs font-medium ${isNegative ? "text-red-600" : "text-emerald-600"}`}
											style={{
												fontFamily: "var(--font-geist-mono), monospace",
											}}
										>
											{item.changePct == null
												? "—"
												: `${isNegative ? "" : "+"}${item.changePct.toFixed(2)}%`}
										</span>
										<span className="text-xs text-neutral-500">24h</span>
									</div>
								</button>
							);
						})}
					</div>
				</section>

				{/* Snapshot */}
				<section className="flex flex-col gap-2">
					<h2
						className="text-lg font-medium text-neutral-900"
						style={{
							fontFamily:
								"var(--font-hedvig-sans), 'Hedvig Letters Sans', sans-serif",
						}}
					>
						Portfolio snapshot
					</h2>
					<div className="rounded-sm border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
						{lastUpdated
							? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`
							: "Waiting for market data..."}
					</div>
				</section>

				{/* Spacer so floating input doesn't cover content */}
				<div className="h-24 shrink-0" />
			</div>

			<FloatingChatInput />
		</>
	);
}
