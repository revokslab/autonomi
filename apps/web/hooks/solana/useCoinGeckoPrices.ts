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

	const ids = useMemo(() => getTrackedCoinGeckoIds(mints), [mints]);

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
				for (const mint of mints) {
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
				for (const mint of mints) {
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
				if (!cancelled) setError("Failed to fetch CoinGecko prices.");
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
	}, [ids, mints]);

	return { prices, loading, error, lastUpdated };
}
