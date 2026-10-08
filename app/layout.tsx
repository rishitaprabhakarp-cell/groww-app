import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Groww GenZ",
  description: "Invest like a GenZ — smart, social, and jargon-free.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d0d0d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d0d0d] text-white antialiased">
        {/* Mobile container */}
        <div className="min-h-screen flex flex-col relative">
          <main className="flex-1 pb-16">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
