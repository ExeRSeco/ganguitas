import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ganguitas",
    default: "Ganguitas - Ofertas reales y hallazgos en Mercado Libre",
  },
  description: "Descubre los mejores chollos, gangas y productos recomendados con descuentos reales en Mercado Libre. Reseñamos para que compres inteligente.",
  keywords: ["ofertas", "gangas", "mercado libre", "descuentos", "chollos", "productos recomendados", "compras inteligentes", "argentina"],
  authors: [{ name: "Ganguitas Team" }],
  creator: "Ganguitas",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL 
      ? (process.env.NEXT_PUBLIC_BASE_URL.startsWith('http') ? process.env.NEXT_PUBLIC_BASE_URL : `https://${process.env.NEXT_PUBLIC_BASE_URL}`)
      : 'https://ganguitas.com'
  ),
  openGraph: {
    title: "Ganguitas - Ofertas reales y hallazgos en Mercado Libre",
    description: "Productos útiles, ofertas reales y hallazgos recomendados para ti.",
    url: "/",
    siteName: "Ganguitas",
    images: [
      {
        url: "/og-image.jpg", // Asegúrate de o bien crear este archivo en public/ o quitarlo si no tienes imagen default
        width: 1200,
        height: 630,
        alt: "Ganguitas - Las mejores gangas",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ganguitas - Ofertas reales y hallazgos",
    description: "Descubre chollos y gangas con descuentos reales recomendados.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ganguitas",
  "url": process.env.NEXT_PUBLIC_BASE_URL || "https://ganguitas.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${process.env.NEXT_PUBLIC_BASE_URL || "https://ganguitas.com"}/buscar?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
