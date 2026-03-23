"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";

import {
	createSolanaConnection,
	getTokenByMint,
	type SolanaToken,
} from "@/lib/solana";
import { useWalletAddress } from "./useWalletAddress";

export type WalletBalance = {
	mint: string;
	symbol: string;
	decimals: number;
	amount: number;
	token?: SolanaToken;
};

const SOL_MINT = "So11111111111111111111111111111111111111112";

export function useWalletBalances() {
	const { address } = useWalletAddress();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [balances, setBalances] = useState<WalletBalance[]>([]);

	const connection = useMemo(() => createSolanaConnection(), []);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			if (!address) {
				setBalances([]);
				return;
			}
			setLoading(true);
			setError(null);
			try {
				const owner = new PublicKey(address);
				const [solLamports, tokenAccounts] = await Promise.all([
					connection.getBalance(owner, "confirmed"),
					connection.getParsedTokenAccountsByOwner(owner, {
						programId: new PublicKey(
							"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
						),
					}),
				]);

				const next: WalletBalance[] = [
					{
						mint: SOL_MINT,
						symbol: "SOL",
						decimals: 9,
						amount: solLamports / 1_000_000_000,
						token: getTokenByMint(SOL_MINT),
					},
				];

				for (const ta of tokenAccounts.value) {
					const info = (ta.account.data as any).parsed?.info;
					const mint = info?.mint as string | undefined;
					const tokenAmount = info?.tokenAmount;
					if (!mint || !tokenAmount) continue;

					const amount = Number(
						tokenAmount.uiAmountString ?? tokenAmount.uiAmount ?? 0,
					);
					const decimals = Number(tokenAmount.decimals ?? 0);
					if (!Number.isFinite(amount) || amount <= 0) continue;

					const token = getTokenByMint(mint);
					next.push({
						mint,
						symbol: token?.symbol ?? `${mint.slice(0, 4)}…${mint.slice(-4)}`,
						decimals,
						amount,
						token,
					});
				}

				if (!cancelled) setBalances(next);
			} catch (e) {
				console.error(e);
				if (!cancelled) setError("Failed to fetch wallet balances.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void run();
		const timer = window.setInterval(run, 15_000);
		return () => {
			cancelled = true;
			window.clearInterval(timer);
		};
	}, [address, connection]);

	return { address, balances, loading, error };
}
