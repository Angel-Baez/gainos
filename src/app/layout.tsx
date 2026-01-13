import { AppWrapper } from "@/components/AppWrapper";
import { GlassBackground } from "@/components/GlassBackground";
import { Navigation } from "@/components/Navigation";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GainOS - Weight Gain Tracker",
  description: "PWA para tracking de plan de aumento de peso",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GainOS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <GlassBackground />
        <AppWrapper>
          <main className="min-h-screen pb-20 relative">{children}</main>
          <Navigation />
        </AppWrapper>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
