"use client";

import { useEffect, useMemo, useState } from "react";

import {
	getCoinGeckoIdByMint,
	getTrackedCoinGeckoIds,
} from "@/lib/solana/coingecko";

type PriceEntry = { usd: number; usd_24h_change?: number };
export type PriceByMint = Record<string, PriceEntry>;

let cachedPriceById: Record<string, PriceEntry> = {};
let cachedAt = 0;

export function useCoinGeckoPrices(mints: string[]) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [prices, setPrices] = useState<PriceByMint>({});
	const [lastUpdated, setLastUpdated] = useState<number | null>(null);

	// Stabilize dependencies to avoid refetch loops from new array instances.
	const mintsKey = useMemo(
		() => Array.from(new Set(mints)).sort().join(","),
		[mints],
	);
	const normalizedMints = useMemo(
		() => (mintsKey ? mintsKey.split(",").filter(Boolean) : []),
		[mintsKey],
	);
	const ids = useMemo(
		() => getTrackedCoinGeckoIds(normalizedMints),
		[normalizedMints],
	);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			if (!ids.length) {
				setPrices({});
				return;
			}

			// stale-while-revalidate: serve cache immediately
			if (cachedAt && Date.now() - cachedAt < 60_000) {
				const fromCache: PriceByMint = {};
				for (const mint of normalizedMints) {
					const id = getCoinGeckoIdByMint(mint);
					if (!id) continue;
					if (cachedPriceById[id]) fromCache[mint] = cachedPriceById[id];
				}
				setPrices(fromCache);
				setLastUpdated(cachedAt);
			}

			setLoading(true);
			setError(null);
			try {
				const url =
					`https://api.coingecko.com/api/v3/simple/price?` +
					`ids=${encodeURIComponent(ids.join(","))}&` +
					`vs_currencies=usd&include_24hr_change=true`;
				const res = await fetch(url);
				if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
				const json = (await res.json()) as Record<string, PriceEntry>;

				cachedPriceById = { ...cachedPriceById, ...json };
				cachedAt = Date.now();

				const next: PriceByMint = {};
				for (const mint of normalizedMints) {
					const id = getCoinGeckoIdByMint(mint);
					if (!id) continue;
					const p = json[id] ?? cachedPriceById[id];
					if (p && Number.isFinite(p.usd)) next[mint] = p;
				}
				if (!cancelled) {
					setPrices(next);
					setLastUpdated(cachedAt);
				}
			} catch (e) {
				console.error(e);
				// Fallback: Jupiter price API provides robust public Solana pricing.
				try {
					const res = await fetch(
						`https://price.jup.ag/v6/price?ids=${encodeURIComponent(
							normalizedMints.join(","),
						)}`,
					);
					if (!res.ok) throw new Error(`Jupiter HTTP ${res.status}`);
					const json = (await res.json()) as {
						data?: Record<string, { price?: number }>;
					};
					const next: PriceByMint = {};
					for (const mint of normalizedMints) {
						const p = json.data?.[mint]?.price;
						if (typeof p === "number" && Number.isFinite(p)) {
							next[mint] = { usd: p };
						}
					}
					if (!cancelled && Object.keys(next).length > 0) {
						setPrices(next);
						setLastUpdated(Date.now());
						setError(null);
						return;
					}
				} catch (fallbackError) {
					console.error(fallbackError);
				}
				if (!cancelled) setError("Failed to fetch market prices.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void run();
		const t = window.setInterval(run, 12_000);
		return () => {
			cancelled = true;
			window.clearInterval(t);
		};
	}, [ids, normalizedMints]);

	return { prices, loading, error, lastUpdated };
}
