"use client";

import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";

import {
	getEmbeddedSolanaAddressFromLinkedAccounts,
	type PrivyLinkedAccount,
} from "@/lib/solana";

export function useWalletAddress() {
	const { user } = usePrivy();

	const address = useMemo(
		() =>
			getEmbeddedSolanaAddressFromLinkedAccounts(
				(user?.linkedAccounts as unknown as PrivyLinkedAccount[]) ?? [],
			),
		[user?.linkedAccounts],
	);

	return { address };
}
