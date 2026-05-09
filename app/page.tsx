"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GoogleAd from "@/components/GoogleAd";
import Toast from "@/components/Toast";
import SoundToggle from "@/components/SoundToggle";

// Storage keys
const STORAGE_KEYS = {
  SESSION_FEN: "chess_game_fen",
  SESSION_TIMESTAMP: "chess_game_timestamp",
  LOCAL_FEN: "chess_game_last_fen",
  LOCAL_TIMESTAMP: "chess_game_last_timestamp",
} as const;

interface SavedGame {
  readonly fen: string;
  readonly timestamp: string;
}

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [moveCount, setMoveCount] = useState(0);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedGame, setSavedGame] = useState<SavedGame | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("soundEnabled") !== "false";
    }
    return true;
  });

  useEffect(() => {
    // Fire game_start event on mount
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "game_start", {
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  const playSound = (type: "check" | "checkmate") => {
    if (!soundEnabled) return;

    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.play().catch(() => {
      // Browser blocked autoplay — silent fail
    });

    // Fire GA4 event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "sound_played", { sound_type: type });
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem("soundEnabled", String(newValue));

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "sound_toggled", { enabled: newValue });
    }
  };

  // Auto-save to sessionStorage on every move
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_FEN, game.fen());
      sessionStorage.setItem(
        STORAGE_KEYS.SESSION_TIMESTAMP,
        Date.now().toString(),
      );
    } catch (error) {
      // Ignore quota errors gracefully
      console.warn("Failed to save to sessionStorage:", error);
    }
  }, [game]);

  // Check for saved game on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedFen = localStorage.getItem(STORAGE_KEYS.LOCAL_FEN);
      const savedTimestamp = localStorage.getItem(STORAGE_KEYS.LOCAL_TIMESTAMP);

      if (savedFen && savedTimestamp) {
        // Reading from localStorage (external system) on mount is a valid use case
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSavedGame({ fen: savedFen, timestamp: savedTimestamp });
        setShowResumeModal(true);
      }
    } catch (error) {
      // Ignore if localStorage unavailable (incognito mode)
      console.warn("Failed to load from localStorage:", error);
    }
  }, []);

  // Persist to localStorage on tab close
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeUnload = () => {
      try {
        const currentFen = sessionStorage.getItem(STORAGE_KEYS.SESSION_FEN);
        const currentTimestamp = sessionStorage.getItem(
          STORAGE_KEYS.SESSION_TIMESTAMP,
        );

        if (currentFen) {
          localStorage.setItem(STORAGE_KEYS.LOCAL_FEN, currentFen);
          localStorage.setItem(
            STORAGE_KEYS.LOCAL_TIMESTAMP,
            currentTimestamp || Date.now().toString(),
          );
        }
      } catch (error) {
        // Ignore if localStorage unavailable
        console.warn("Failed to persist to localStorage:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  function handleResume() {
    if (!savedGame) return;

    try {
      const restoredGame = new Chess(savedGame.fen);
      setGame(restoredGame);
      setShowResumeModal(false);
    } catch (error) {
      // Corrupted FEN - start new game
      console.warn("Corrupted FEN detected, starting new game:", error);
      localStorage.removeItem(STORAGE_KEYS.LOCAL_FEN);
      localStorage.removeItem(STORAGE_KEYS.LOCAL_TIMESTAMP);
      handleNewGame();
    }
  }

  function handleNewGame() {
    setGame(new Chess());
    setShowResumeModal(false);

    try {
      localStorage.removeItem(STORAGE_KEYS.LOCAL_FEN);
      localStorage.removeItem(STORAGE_KEYS.LOCAL_TIMESTAMP);
    } catch (error) {
      console.warn("Failed to clear localStorage:", error);
    }
  }

  function handleModalEscape(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      handleNewGame();
    }
  }

  function onDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) {
    if (targetSquare === null) {
      return false;
    }

    // Turn validation - check if player is moving their own piece
    const piece = game.get(sourceSquare as import("chess.js").Square);
    const currentTurn = game.turn(); // 'w' | 'b'

    if (piece && piece.color !== currentTurn) {
      setToastMessage(
        `It's ${currentTurn === "w" ? "White" : "Black"}'s turn!`,
      );
      return false;
    }

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        return false;
      }

      setGame(gameCopy);
      setLastMove({ from: sourceSquare, to: targetSquare });
      const newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);

      // Fire move_made event
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "move_made", {
          move_count: newMoveCount,
          timestamp: new Date().toISOString(),
        });
      }

      // Play sound based on game state
      if (gameCopy.isCheckmate()) {
        playSound("checkmate");
      } else if (gameCopy.isCheck()) {
        playSound("check");
      }

      return true;
    } catch {
      return false;
    }
  }

  return (
    <>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      {showResumeModal && savedGame && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="resume-modal-title"
          aria-describedby="resume-modal-description"
          onKeyDown={handleModalEscape}
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-md">
            <h2 id="resume-modal-title" className="text-xl font-bold mb-4">
              Resume last game?
            </h2>
            <p
              id="resume-modal-description"
              className="text-sm text-gray-600 mb-6"
            >
              Last played:{" "}
              {new Date(parseInt(savedGame.timestamp)).toLocaleString()}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleResume}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              >
                Resume
              </button>
              <button
                onClick={handleNewGame}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="sr-only" aria-label="About Pass & Play Chess">
        <h1>Pass & Play Chess — Free Offline Chess Board</h1>
        <p>
          Play chess offline with a friend on the same device. Our pass and play
          chess board lets two players enjoy chess together without any account,
          login, or internet connection. Perfect for playing chess on planes,
          trains, or anywhere offline.
        </p>
        <h2>Simple Two-Player Chess</h2>
        <p>
          Pass and play chess means two players share one device and take turns
          moving pieces. Sit across from your opponent, make your move with drag
          and drop, then pass the device to your friend. No complicated setup,
          no waiting for online opponents — just instant offline chess for two
          players on the same device.
        </p>
        <h2>Features</h2>
        <ul>
          <li>No account required — start playing chess instantly</li>
          <li>Works completely offline — no internet connection needed</li>
          <li>Drag and drop moves — intuitive piece movement</li>
          <li>Legal move validation — ensures valid chess moves only</li>
          <li>Fullscreen chess board — distraction-free gameplay</li>
          <li>Free forever — no subscriptions or hidden costs</li>
        </ul>
        <p>
          Unlike online chess platforms that require accounts and internet, our
          offline chess board focuses on simplicity. Two players, one device,
          pure chess. Whether you&apos;re teaching someone to play or enjoying a
          quick game, pass and play chess delivers the most straightforward
          chess experience possible.
        </p>
      </section>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <GoogleAd slot="left-sidebar" />
        </div>
        <div
          style={{
            maxWidth: "min(100vh, 100vw)",
            width: "100%",
            aspectRatio: "1",
          }}
        >
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop: onDrop,
              ...(lastMove && {
                squareStyles: {
                  [lastMove.from]: {
                    backgroundColor: "rgba(255, 255, 0, 0.4)",
                  },
                  [lastMove.to]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
                },
              }),
            }}
          />
        </div>
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <GoogleAd slot="right-sidebar" />
        </div>
      </div>
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    </>
  );
}
