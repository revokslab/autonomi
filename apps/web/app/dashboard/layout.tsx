import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardAuthGuard } from "@/components/dashboard/DashboardAuthGuard";
import { Providers } from "@/components/providers";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Providers>
			<DashboardAuthGuard>
				<div className="min-h-screen bg-neutral-50">
					<Sidebar />
					<main className="ml-[96px] flex min-h-screen flex-col items-stretch pb-6">
						{children}
					</main>
				</div>
			</DashboardAuthGuard>
		</Providers>
	);
}
