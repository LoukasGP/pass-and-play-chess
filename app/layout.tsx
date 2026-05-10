import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Offline – Play 2 Player Chess on One Device",
  description:
    "Play chess offline with someone next to you. Free chess board with drag-and-drop moves. No login, no download required.",
  openGraph: {
    title: "Chess Offline – Play 2 Player Chess on One Device",
    description:
      "Play chess offline with someone next to you. Free chess board with drag-and-drop moves. No login, no download required.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess Offline – Play 2 Player Chess on One Device",
    description:
      "Play chess offline with someone next to you. Free chess board with drag-and-drop moves. No login, no download required.",
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
    name: "Chess Offline",
    description: "Free offline chess board for two players on one device",
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {adsenseClientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
