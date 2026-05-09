"use client";

interface SoundToggleProps {
  readonly enabled: boolean;
  readonly onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle sound"
      className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 z-50 flex items-center justify-center text-xl"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
