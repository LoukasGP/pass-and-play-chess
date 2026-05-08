import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pass & Play vs Online Chess — What's the Difference?",
  description:
    "Compare pass and play chess vs online chess platforms. Learn the benefits of offline local chess vs internet-based chess games.",
};

export default function VsOnline() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 md:py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Pass & Play vs Online Chess
        </h1>

        <section className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Pass and play chess and online chess serve different purposes.
            Online platforms like chess.com and lichess.org excel at connecting
            players worldwide, while pass and play chess focuses on local,
            face-to-face gameplay. Here&apos;s how they compare and when each
            makes sense.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            The Key Differences
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Feature
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Pass & Play
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">
                    Online Chess
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Internet Required
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    No — works offline
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Yes — needs connection
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Account Signup
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Not required
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Usually required
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Opponent Location
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Same device, sitting together
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Remote, anywhere in the world
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Social Interaction
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Face-to-face, personal
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Chat-based, digital
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Setup Time
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Instant — open and play
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Requires account, login, matchmaking
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Distractions
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    None — just the board
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Ads, popups, notifications, chat
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-medium">
                    Privacy
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Complete — no data collection
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    Varies — games tracked, profiles public
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            When to Choose Pass & Play Chess
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>
                You&apos;re sitting with a friend and want to play chess
                immediately
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>
                You&apos;re on a plane, train, or anywhere without reliable
                internet
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>
                You want zero distractions — no ads, notifications, or chat
                requests
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>
                You&apos;re teaching someone to play and want to guide them in
                person
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>
                You value privacy and don&apos;t want your games tracked or
                analyzed
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2 font-bold">✓</span>
              <span>
                You want the simplest possible chess experience with no setup
                friction
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            When to Choose Online Chess
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>
                You don&apos;t have someone physically present to play with
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>
                You want to play against AI bots at various skill levels
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>
                You want game analysis tools, opening databases, and tactics
                trainers
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>
                You want to track your rating and improvement over time
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2 font-bold">•</span>
              <span>
                You want to join tournaments and compete in ranked matches
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            The Bottom Line
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Pass and play chess isn&apos;t better or worse than online chess —
            they&apos;re different tools for different situations. Online
            platforms offer features, community, and competitive play. Pass and
            play offers simplicity, offline accessibility, and the social
            experience of sitting across from your opponent. Many chess players
            use both depending on their needs at the moment.
          </p>
        </section>

        <section className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-700 mb-4 text-lg">
            Want the simplest offline chess experience?
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Pass & Play Chess →
          </Link>
        </section>
      </article>
    </div>
  );
}
