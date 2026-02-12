"use client";

import { PrivyProvider } from "@privy-io/react-auth";

import { PRIVY_APP_ID } from "@/lib/constants";

export function PrivyProviderWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<PrivyProvider
			appId={PRIVY_APP_ID}
			config={{
				loginMethods: ["email", "google", "twitter", "wallet"],
				appearance: {
					theme: "light",
				},
				embeddedWallets: {
					disableAutomaticMigration: true,
				},
			}}
		>
			{children}
		</PrivyProvider>
	);
}
