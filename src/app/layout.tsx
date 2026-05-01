import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Celebration.com | Premium Catering & Event Management in Purnia, Bihar",
  description: "Craft your perfect celebration with Celebration.com. Premium catering and end-to-end event management for weddings, corporate events, and private parties in Purnia, Bihar. Serving across India since 2021.",
  keywords: ["catering", "event management", "wedding catering", "corporate events", "private parties", "Purnia", "Bihar", "celebration", "food customization"],
  authors: [{ name: "Nitin Kumar", url: "https://celebration.com" }],
  openGraph: {
    title: "Celebration.com | Premium Catering & Event Management",
    description: "Craft your perfect celebration with premium catering and event management services in Purnia, Bihar.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
