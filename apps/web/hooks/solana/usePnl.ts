"use client";

import { useMemo } from "react";

import {
	computeWalletWideEstimatePnlUsd,
	computeUnrealizedPnlUsd,
	derivePositions,
	type ExecutedSwap,
} from "@/lib/solana/pnl";

type BalanceLike = { mint: string; amount: number };
type PriceLike = Record<string, { usd: number }>;

export function usePnl(
	swaps: ExecutedSwap[],
	balances: BalanceLike[],
	prices: PriceLike,
) {
	const priceMap = useMemo(() => {
		const out: Record<string, number> = {};
		for (const [mint, p] of Object.entries(prices)) out[mint] = p.usd ?? 0;
		return out;
	}, [prices]);

	const appPositions = useMemo(
		() => derivePositions(swaps, priceMap),
		[swaps, priceMap],
	);
	const appTradesPnlUsd = useMemo(
		() => computeUnrealizedPnlUsd(appPositions, priceMap),
		[appPositions, priceMap],
	);

	const walletEstimate = useMemo(() => {
		return computeWalletWideEstimatePnlUsd(appPositions, balances, priceMap);
	}, [balances, appPositions, priceMap]);

	return {
		appPositions,
		appTradesPnlUsd,
		walletWideEstimatePnlUsd: walletEstimate.pnlUsd,
		hasIncompleteBasisEstimate: walletEstimate.hasIncompleteBasisEstimate,
	};
}
