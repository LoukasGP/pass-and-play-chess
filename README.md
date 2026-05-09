# Chess Offline

Offline two-player chess board built with Next.js. Two players can play chess together on one device using drag-and-drop piece movement.

## Features

- Fullscreen chess board interface
- Drag-and-drop piece movement
- Legal move validation via chess.js
- No login or server required — play offline
- Clean, distraction-free UI

## Tech Stack

- [Next.js 16.2](https://nextjs.org) — React framework
- [chess.js](https://github.com/jhlywa/chess.js) — Game logic and move validation
- [react-chessboard](https://github.com/Clariity/react-chessboard) — Chessboard UI component
- TypeScript — Type safety
- Tailwind CSS 4 — Styling
- Jest + React Testing Library — Testing

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play chess.

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

## License

MIT
