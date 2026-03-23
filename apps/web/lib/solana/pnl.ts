import { getTokenByMint } from "./tokens";

export type ExecutedSwap = {
	id: string;
	ts: number;
	signature: string;
	inMint: string;
	outMint: string;
	inAmountAtomic: string;
	outAmountAtomic: string;
};

export type Position = {
	mint: string;
	quantity: number;
	costBasisUsd: number;
	avgCostUsd: number;
};

const SWAPS_STORAGE_KEY = "autonomi.solana.swaps.v1";

export function loadExecutedSwaps(): ExecutedSwap[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(SWAPS_STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as ExecutedSwap[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function saveExecutedSwaps(swaps: ExecutedSwap[]) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(SWAPS_STORAGE_KEY, JSON.stringify(swaps));
}

export function atomicToUi(amountAtomic: string, decimals: number): number {
	const n = Number(amountAtomic);
	if (!Number.isFinite(n)) return 0;
	return n / 10 ** decimals;
}

export function derivePositions(
	swaps: ExecutedSwap[],
	pricesUsd: Record<string, number>,
): Position[] {
	const positions = new Map<string, { qty: number; cost: number }>();

	for (const s of swaps) {
		const inToken = getTokenByMint(s.inMint);
		const outToken = getTokenByMint(s.outMint);
		if (!inToken || !outToken) continue;
		const inQty = atomicToUi(s.inAmountAtomic, inToken.decimals);
		const outQty = atomicToUi(s.outAmountAtomic, outToken.decimals);
		if (inQty <= 0 || outQty <= 0) continue;

		const inPrice = pricesUsd[s.inMint] ?? 0;
		const outPrice = pricesUsd[s.outMint] ?? 0;

		const inValueUsd = inQty * inPrice;

		// Reduce sold token position
		const inPos = positions.get(s.inMint) ?? { qty: 0, cost: 0 };
		if (inPos.qty > 0 && inQty > 0) {
			const avgCost = inPos.cost / Math.max(inPos.qty, 1e-12);
			const soldQty = Math.min(inQty, inPos.qty);
			inPos.qty -= soldQty;
			inPos.cost -= soldQty * avgCost;
			if (inPos.qty < 1e-12) {
				inPos.qty = 0;
				inPos.cost = 0;
			}
			positions.set(s.inMint, inPos);
		}

		// Increase bought token position using trade value as cost basis
		const outPos = positions.get(s.outMint) ?? { qty: 0, cost: 0 };
		const fallbackOutValue = outQty * outPrice;
		const assignedCost = inValueUsd > 0 ? inValueUsd : fallbackOutValue;
		outPos.qty += outQty;
		outPos.cost += assignedCost;
		positions.set(s.outMint, outPos);
	}

	return Array.from(positions.entries())
		.filter(([, p]) => p.qty > 0)
		.map(([mint, p]) => ({
			mint,
			quantity: p.qty,
			costBasisUsd: p.cost,
			avgCostUsd: p.cost / Math.max(p.qty, 1e-12),
		}));
}

export function computeUnrealizedPnlUsd(
	positions: Position[],
	pricesUsd: Record<string, number>,
): number {
	return positions.reduce((acc, p) => {
		const px = pricesUsd[p.mint] ?? 0;
		return acc + (px - p.avgCostUsd) * p.quantity;
	}, 0);
}

export function computeWalletWideEstimatePnlUsd(
	positions: Position[],
	balances: Array<{ mint: string; amount: number }>,
	pricesUsd: Record<string, number>,
): { pnlUsd: number; hasIncompleteBasisEstimate: boolean } {
	const posByMint = new Map(positions.map((p) => [p.mint, p]));
	let totalValue = 0;
	let inferredCostBasis = 0;
	let hasIncompleteBasisEstimate = false;

	for (const b of balances) {
		const px = pricesUsd[b.mint] ?? 0;
		const value = b.amount * px;
		totalValue += value;

		const p = posByMint.get(b.mint);
		if (p && p.quantity > 0) {
			const matchedQty = Math.min(b.amount, p.quantity);
			inferredCostBasis += matchedQty * p.avgCostUsd;
			const externalQty = Math.max(0, b.amount - matchedQty);
			if (externalQty > 0) hasIncompleteBasisEstimate = true;
			inferredCostBasis += externalQty * px;
		} else {
			hasIncompleteBasisEstimate = hasIncompleteBasisEstimate || b.amount > 0;
			inferredCostBasis += value;
		}
	}

	return {
		pnlUsd: totalValue - inferredCostBasis,
		hasIncompleteBasisEstimate,
	};
}
