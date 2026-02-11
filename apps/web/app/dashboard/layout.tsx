import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-[#0B0B0B] dark">
			<Sidebar />
			<main className="ml-[86px] flex min-h-screen flex-col items-stretch gap-6 pb-6">
				{children}
			</main>
		</div>
	);
}
