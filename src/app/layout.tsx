import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-cursive" });

export const metadata: Metadata = {
  metadataBase: new URL('https://bintimarvels.com'),
  title: {
    default: "Binti Marvels — Mrembo Pads & School Support",
    template: "%s | BINTI MARVELS LIMITED",
  },
  description: "Binti Marvels is the company behind made-in-Kenya Mrembo period care, school pad support, Binti Charity and Binti Circles.",
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://bintimarvels.com",
    siteName: "BINTI MARVELS LIMITED",
    images: ["/hero_image wider.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BINTI MARVELS LIMITED",
  legalName: "BINTI MARVELS LIMITED",
  url: "https://bintimarvels.com",
  email: "binticreationsllc@gmail.com",
  telephone: "+254717345841",
  areaServed: "Kenya",
  brand: { "@type": "Brand", name: "Mrembo" },
  sameAs: [
    "https://www.instagram.com/mrembopads/",
    "https://www.tiktok.com/@mrembo_254",
    "https://www.instagram.com/bintipads_ke",
    "https://www.facebook.com/Bintipadske/",
    "https://www.tiktok.com/@bintipads",
    "https://x.com/bintipads_ke",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} ${playfair.variable} ${jetbrains.variable} ${caveat.variable} antialiased font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
        <CartProvider>
          <Header />
          <CartDrawer />
          <div id="main-content" className="min-h-screen">
            {children}
          </div>
          <WhatsAppFAB />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
