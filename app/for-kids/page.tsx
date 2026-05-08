import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Teach Kids Chess — No Ads, No Distractions',
  description: 'Ad-free chess for kids. Teach children chess offline with no account signup, no chat features, and zero distractions. Safe, simple, free.',
};

export default function ForKids() {
  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-8 md:py-12">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Teach Kids Chess — No Ads, No Distractions
        </h1>

        <section className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Teaching chess to children should be simple and focused. This pass and play chess board gives 
            kids a clean, distraction-free space to learn and play chess together — no ads, no account 
            required, no chat features, and works completely offline.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Parents & Teachers Choose This Chess Board
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">✓ No Account Signup Required</h3>
              <p className="text-gray-700">
                Open the page and start playing immediately. No email addresses, no passwords, no personal 
                information needed. Perfect for schools and families who want to avoid account management.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">✓ Works Completely Offline</h3>
              <p className="text-gray-700">
                No internet connection needed once the page loads. Great for classrooms with limited connectivity, 
                or keeping kids occupied during travel without burning through mobile data.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">✓ No Chat or Social Features</h3>
              <p className="text-gray-700">
                Just the chess board — no chat boxes, no friend requests, no social interactions with strangers. 
                Kids play face-to-face with someone sitting right next to them.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">✓ Zero Distractions</h3>
              <p className="text-gray-700">
                No ads, no popups, no notifications, no premium upsells. The board fills the screen so kids 
                can focus entirely on learning chess moves and strategy.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">✓ Free Forever</h3>
              <p className="text-gray-700">
                No subscriptions, no in-app purchases, no hidden costs. Use it as much as you want without 
                ever paying anything.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Perfect for Teaching Chess Basics
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            When teaching kids chess, simplicity matters. This pass and play chess board validates all moves 
            automatically, so children can&apos;t make illegal moves — helping them learn the rules naturally through 
            play. The drag-and-drop interface is intuitive for young learners.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Because two players share one device, you can sit next to your child and guide them through their 
            first games. Explain why certain moves work, point out opportunities they missed, and celebrate good 
            plays together — all without the barrier of playing across the internet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How to Use It with Kids
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Open the chess board on a tablet or laptop (no account needed)</li>
            <li>Sit beside your child so you can both see the screen</li>
            <li>Explain that White moves first and show them how to drag pieces</li>
            <li>Let them make their move, then take your turn as Black</li>
            <li>Guide them through the game, explaining piece movements and basic strategy</li>
            <li>Play multiple games — the board resets instantly when you&apos;re ready for another match</li>
          </ol>
        </section>

        <section className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            For Classrooms & Chess Clubs
          </h3>
          <p className="text-gray-700 leading-relaxed mb-3">
            Teachers and chess club organizers use this board because it requires no setup, no accounts to 
            manage, and no worry about inappropriate content or interactions. Students can pair up and play 
            chess together with full adult confidence in a controlled environment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Works on any device with a web browser — school Chromebooks, iPads, laptops, even smartphones. 
            No installation required, nothing to download.
          </p>
        </section>

        <section className="mt-12 p-6 bg-green-50 rounded-lg text-center">
          <p className="text-gray-700 mb-4 text-lg">
            Ready to teach chess with zero distractions?
          </p>
          <Link
            href="/"
            className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Teaching Chess →
          </Link>
        </section>
      </article>
    </div>
  );
}
