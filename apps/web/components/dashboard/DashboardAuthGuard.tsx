"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardAuthGuard({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { ready, authenticated } = usePrivy();

	useEffect(() => {
		if (!ready) return;
		if (!authenticated) {
			router.replace("/login");
		}
	}, [ready, authenticated, router]);

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white">
				<div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
			</div>
		);
	}

	if (!authenticated) {
		return null;
	}

	return <>{children}</>;
}
