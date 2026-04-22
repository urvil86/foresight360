import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foresight 360 — Event-Driven Forecasting Platform",
  description: "Pharma forecasting platform by Chryselys for Gilead Sciences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
