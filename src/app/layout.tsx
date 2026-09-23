import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RelayOps Intelligence | AI customer ops",
  description:
    "LLM-powered feedback analysis, PostgreSQL persistence, and execution plans for startup teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen bg-slate-950 font-sans antialiased text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
