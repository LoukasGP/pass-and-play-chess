"use client";

import { useEffect, useRef, useState } from "react";

interface GoogleAdProps {
  readonly slot: string;
  readonly format?: "auto" | "rectangle" | "vertical";
}

export default function GoogleAd({ slot, format = "auto" }: GoogleAdProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);
  const [shouldRenderAd, setShouldRenderAd] = useState(false);

  // Step 1: Check if container is visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkVisibility = () => {
      const isVisible = container.offsetWidth > 0 && container.offsetHeight > 0;
      setShouldRenderAd(isVisible);
    };

    checkVisibility();
    const timeoutId = setTimeout(checkVisibility, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Step 2: Initialize ad after <ins> element is rendered and has dimensions
  useEffect(() => {
    if (!clientId || !shouldRenderAd || initializedRef.current) return;

    const ins = insRef.current;
    if (!ins) return;

    // Wait for <ins> element to have dimensions before pushing to adsbygoogle
    const initializeAd = () => {
      const hasWidth = ins.offsetWidth > 0;
      const hasHeight = ins.offsetHeight > 0;

      if (hasWidth && hasHeight) {
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          initializedRef.current = true;
        } catch (error) {
          console.error("AdSense error:", error);
        }
      }
    };

    // Check after <ins> has been laid out
    const timeoutId = setTimeout(initializeAd, 150);

    return () => clearTimeout(timeoutId);
  }, [clientId, shouldRenderAd]);

  return (
    <div
      ref={containerRef}
      className="min-h-[600px] w-[160px] bg-gray-200 flex items-center justify-center"
      data-testid={`google-ad-${slot}`}
    >
      {clientId && shouldRenderAd ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="text-gray-400 text-sm text-center px-2">Ad Space</div>
      )}
    </div>
  );
}
