import { describe, expect, it } from "vitest";

import { getCoinGeckoIdByMint, getTrackedCoinGeckoIds } from "../coingecko";

describe("coingecko mapping", () => {
	it("maps known mints to coingecko ids", () => {
		expect(
			getCoinGeckoIdByMint("So11111111111111111111111111111111111111112"),
		).toBe("solana");
		expect(
			getCoinGeckoIdByMint("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
		).toBe("usd-coin");
	});

	it("returns null for unknown mints and dedupes ids", () => {
		const ids = getTrackedCoinGeckoIds([
			"So11111111111111111111111111111111111111112",
			"So11111111111111111111111111111111111111112",
			"unknown-mint",
		]);
		expect(ids).toEqual(["solana"]);
		expect(getCoinGeckoIdByMint("unknown-mint")).toBeNull();
	});
});
