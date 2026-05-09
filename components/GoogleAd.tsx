"use client";

import { useEffect } from "react";

interface GoogleAdProps {
  readonly slot: string;
  readonly format?: "auto" | "rectangle" | "vertical";
}

export default function GoogleAd({ slot, format = "auto" }: GoogleAdProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (clientId) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [clientId]);

  return (
    <div
      className="min-h-[600px] w-[160px] bg-gray-200 flex items-center justify-center"
      data-testid={`google-ad-${slot}`}
    >
      {clientId ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
        />
      ) : (
        <div className="text-gray-400 text-sm text-center px-2">Ad Space</div>
      )}
    </div>
  );
}
