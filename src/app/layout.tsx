import type { Metadata } from "next";
import Script from 'next/script';
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ganguitas.vercel.app';

export const metadata: Metadata = {
  title: {
    template: "%s | Ganguitas",
    default: "Ganguitas | Productos virales y ofertas de Mercado Libre",
  },
  description: "Productos virales que realmente valen la pena. Gadgets, herramientas y cosas útiles que puedes comprar en Mercado Libre.",
  keywords: ["productos virales", "gadgets utiles", "ofertas mercado libre", "cosas utiles para casa", "gadgets baratos", "productos tendencia argentina"],
  authors: [{ name: "Ganguitas Team" }],
  creator: "Ganguitas",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Ganguitas | Productos virales de Mercado Libre",
    description: "Descubre gadgets útiles, productos virales y ofertas que realmente valen la pena.",
    url: "https://ganguitas.vercel.app",
    siteName: "Ganguitas",
    images: [
      {
        url: "https://ganguitas.vercel.app/og-image.jpg", // Asegúrate de o bien crear este archivo en public/ o quitarlo si no tienes imagen default
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
    title: "Ganguitas | Productos virales y ofertas de Mercado Libre",
    description: "Productos virales que realmente valen la pena. Gadgets, herramientas y cosas útiles que puedes comprar en Mercado Libre.",
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
  verification: {
    google: "0hmi_3wpCW017txPargG6OuOs_l6FVdWl60dGDuGKhw",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Ganguitas",
  "url": baseUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${baseUrl}/buscar?q={search_term_string}`,
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
        <Script
          id="global-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
