import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Play Chess Offline",
  description:
    "Learn how to play chess offline on one device. Simple instructions for two-player chess with no account required.",
};

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 md:py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          How to Play Chess Offline
        </h1>

        <section className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Chess Offline is the simplest way to play chess with someone next to
            you. Two players share one device and take turns moving pieces. No
            internet connection, no account signup, no complicated setup—just
            instant offline chess on one device.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            What is Chess Offline?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Chess Offline means two players share a single device to play chess
            together. You sit across from your opponent, make your move by
            dragging a chess piece, then pass the device for their turn.
            It&apos;s the digital equivalent of playing chess on a physical
            board, but with the convenience of automatic move validation and no
            pieces to lose.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Unlike online chess where you play against strangers over the
            internet, Chess Offline keeps the game local and personal. Perfect
            for playing chess offline on planes, trains, cafes, or anywhere
            without reliable internet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How to Start Playing
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              Open the chess board on your device (no account or login required)
            </li>
            <li>
              Position yourselves so both players can see the screen comfortably
            </li>
            <li>White moves first—drag a piece to make your move</li>
            <li>Pass the device to your opponent for Black&apos;s turn</li>
            <li>Continue taking turns until checkmate or stalemate</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mt-4">
            The chess board automatically validates all moves, so you can&apos;t
            make an illegal move. This makes it perfect for beginners learning
            the rules or experienced players who want a casual game without
            worrying about mistakes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Play Offline Chess?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>No internet required</strong> — Play anywhere, even on
                airplanes or in remote areas
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>No account needed</strong> — Start playing immediately
                with zero friction
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Face-to-face interaction</strong> — Enjoy the social
                aspect of sitting with your opponent
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Zero distractions</strong> — No ads, popups, chat
                requests, or notifications
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>
                <strong>Privacy</strong> — Your games stay on your device, no
                data collection
              </span>
            </li>
          </ul>
        </section>

        <section className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-700 mb-4 text-lg">
            Ready to play Chess Offline?
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Playing →
          </Link>
        </section>
      </article>
    </div>
  );
}
