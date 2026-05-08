'use client'

import { useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

export default function Home() {
  const [game, setGame] = useState(new Chess())

  function onDrop({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string }) {
    try {
      const gameCopy = new Chess(game.fen())
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })
      
      if (move === null) {
        return false
      }
      
      setGame(gameCopy)
      return true
    } catch {
      return false
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <div style={{ maxWidth: 'min(100vh, 100vw)', width: '100%', aspectRatio: '1' }}>
        <Chessboard options={{ position: game.fen(), onPieceDrop: onDrop }} />
      </div>
    </div>
  )
}
