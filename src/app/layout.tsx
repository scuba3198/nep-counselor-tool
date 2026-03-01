import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Hamro Foreign Study Guide | Counselor Portal",
	description:
		"Up-to-date global study-abroad information for education counselors in Nepal.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<main>{children}</main>
			</body>
		</html>
	);
}
