import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "./contexts/ThemeContext";



export const metadata: Metadata = {
	title: "Spark — AI Chat",
	description: "A full-stack AI chat application with Google auth and persistent history.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									const theme = localStorage.getItem('themePreference') || 'dark';
									document.documentElement.classList.remove('light', 'dark', 'green');
									document.documentElement.classList.add(theme);
								} catch (e) {}
							})();
						`,
					}}
				/>
			</head>
			<body
				className={`antialiased`}
			>
				<ThemeProvider>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
