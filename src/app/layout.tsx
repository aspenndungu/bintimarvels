import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
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
    default: "Mrembo Pads — Premium African Period Care | BINTI MARVELS LIMITED",
    template: "%s | BINTI MARVELS LIMITED",
  },
  description: "Comfort for the woman who keeps showing up. Premium Kenyan sanitary pads by BINTI MARVELS LIMITED. Shop online or order via WhatsApp.",
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
  address: {
    "@type": "PostalAddress",
    streetAddress: "CIATA MALL, KIAMBU ROAD",
    addressLocality: "Kiambu",
    postalCode: "00200",
    addressCountry: "KE",
  },
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
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="min-h-screen">
            {children}
          </main>
          <WhatsAppFAB />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
