import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pass & Play Chess | Free Offline Chess Board",
  description: "Play chess offline with a friend on the same device. Pass-and-play chess board with drag-and-drop moves. No login, no download required.",
  openGraph: {
    title: "Pass & Play Chess | Free Offline Chess Board",
    description: "Play chess offline with a friend on the same device. Pass-and-play chess board with drag-and-drop moves. No login, no download required.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pass & Play Chess | Free Offline Chess Board",
    description: "Play chess offline with a friend on the same device. Pass-and-play chess board with drag-and-drop moves. No login, no download required.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pass & Play Chess",
    "description": "Free offline chess board for two players on the same device",
    "applicationCategory": "Game",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
        {adsenseClientId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
        {ga4MeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4MeasurementId}', {
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
