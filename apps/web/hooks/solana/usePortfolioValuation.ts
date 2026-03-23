"use client";

import { useMemo } from "react";

import { getDefaultTrackedMints } from "@/lib/solana/coingecko";
import { useCoinGeckoPrices } from "./useCoinGeckoPrices";
import { useWalletBalances } from "./useWalletBalances";

export function usePortfolioValuation() {
	const {
		address,
		balances,
		loading: balancesLoading,
		error: balancesError,
	} = useWalletBalances();
	const trackedMints = useMemo(
		() =>
			Array.from(
				new Set([...getDefaultTrackedMints(), ...balances.map((b) => b.mint)]),
			),
		[balances],
	);
	const {
		prices,
		loading: pricesLoading,
		error: pricesError,
		lastUpdated,
	} = useCoinGeckoPrices(trackedMints);

	const items = useMemo(
		() =>
			balances.map((b) => {
				const p = prices[b.mint];
				const usdValue = p ? b.amount * p.usd : null;
				return {
					...b,
					priceUsd: p?.usd ?? null,
					change24hPct: p?.usd_24h_change ?? null,
					usdValue,
				};
			}),
		[balances, prices],
	);

	const totalUsd = useMemo(
		() => items.reduce((sum, i) => sum + (i.usdValue ?? 0), 0),
		[items],
	);

	const total24hUsd = useMemo(
		() =>
			items.reduce((sum, i) => {
				if (i.usdValue == null || i.change24hPct == null) return sum;
				return sum + i.usdValue * (i.change24hPct / 100);
			}, 0),
		[items],
	);

	const total24hPct =
		totalUsd > 0
			? (total24hUsd / Math.max(totalUsd - total24hUsd, 1e-12)) * 100
			: 0;

	return {
		address,
		items,
		totalUsd,
		total24hUsd,
		total24hPct,
		lastUpdated,
		loading: balancesLoading || pricesLoading,
		error: balancesError ?? pricesError,
	};
}
