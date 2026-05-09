"use client";

import { useEffect } from "react";

interface ToastProps {
  readonly message: string | null;
  readonly onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {message}
    </div>
  );
}
