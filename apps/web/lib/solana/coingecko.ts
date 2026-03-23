import { SOLANA_TOKENS } from "./tokens";

export const COINGECKO_IDS_BY_MINT: Record<string, string> = {
	// Wrapped SOL
	So11111111111111111111111111111111111111112: "solana",
	EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: "usd-coin",
	DezXAZ8z7PnrnRJjz3wXBoRgixCa6A9aQGfY2h2A9jz: "bonk",
	JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN: "jupiter-exchange-solana",
};

export function getCoinGeckoIdByMint(mint: string): string | null {
	return COINGECKO_IDS_BY_MINT[mint] ?? null;
}

export function getTrackedCoinGeckoIds(mints: string[]): string[] {
	return Array.from(
		new Set(
			mints.map((m) => getCoinGeckoIdByMint(m)).filter((v): v is string => !!v),
		),
	);
}

export function getDefaultTrackedMints(): string[] {
	return SOLANA_TOKENS.map((t) => t.mint);
}
