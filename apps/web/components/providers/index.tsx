"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
	const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

	return <PrivyProvider appId={privyAppId}>{children}</PrivyProvider>;
}
