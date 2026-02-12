"use client";

import { PrivyProviderWrapper } from "./PrivyProviderWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
	return <PrivyProviderWrapper>{children}</PrivyProviderWrapper>;
}
