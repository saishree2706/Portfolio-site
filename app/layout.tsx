import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ModeProvider } from "@/context/ModeContext";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saishree SV | Creative & Tech Portfolio",
  description:
    "Saishree SV — software engineer, travel creator, and storyteller. Building beautiful things in code and on camera.",
  keywords: ["Saishree SV", "software engineer", "travel creator", "content creator", "portfolio"],
  openGraph: {
    title: "Saishree SV | Creative & Tech Portfolio",
    description:
      "Software engineer, travel creator, and storyteller — all in one portfolio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${geistMono.variable}`}>
      <body className="antialiased" data-mode="passion" suppressHydrationWarning>
        <SmoothScroll />
        <ModeProvider>
          {children}
        </ModeProvider>
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
