"use client";

import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import GoogleAd from "@/components/GoogleAd";

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    // Fire game_start event on mount
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "game_start", {
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

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
      const newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);

      // Fire move_made event
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "move_made", {
          move_count: newMoveCount,
          timestamp: new Date().toISOString(),
        });
      }

      return true;
    } catch {
      return false;
    }
  }

  return (
    <>
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
          <Chessboard options={{ position: game.fen(), onPieceDrop: onDrop }} />
        </div>
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <GoogleAd slot="right-sidebar" />
        </div>
      </div>
    </>
  );
}
