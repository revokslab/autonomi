import { Background } from "./_components/background";

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Background>{children}</Background>;
}
