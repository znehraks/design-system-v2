import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DesignC v2 Playground",
  description: "HeroUI web playground for DesignC v2 theme packs",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
