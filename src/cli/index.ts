import { GameState, MoveCard, Piece } from "../types"
import { newGame } from "./init-game"
import { availableMoves } from "./make-move"
import { executeTurn } from "./turns"

export const runGame = async () => {
  let game: GameState | null = newGame()
  while (game != null) {
    const pieces: Piece[] = getPieces(game)

    // Random selection for now
    const randomPieceIdx = Math.floor(Math.random() * pieces.length)
    const selectedPieceCoords = pieces[randomPieceIdx].position

    // Movecards filtered for possible moves given the piece selected
    const possibleMoves = availableMoves(game, selectedPieceCoords)

    // random move selection
    const randomMoveCardIdx = Math.floor(Math.random() * possibleMoves.length)
    const selectedMoveCard = possibleMoves[randomMoveCardIdx]

    const randomMoveIdx = Math.floor(
      Math.random() * selectedMoveCard.moves.length
    )
    const selectedMove = selectedMoveCard.moves[randomMoveIdx]

    const originalMoveCardSelected = game.players[
      game.currentTurn
    ].moveCards.find((card) => card.name === selectedMoveCard.name) as MoveCard

    game = executeTurn(
      game,
      selectedMove,
      originalMoveCardSelected,
      selectedPieceCoords
    )

    await wait(5)
  }
}

const wait = async (seconds: number) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const getPieces = (gameState: GameState) => {
  const flatBoard = gameState.board.flat(1)
  return flatBoard.reduce<Piece[]>((acc, curr) => {
    const isPiece =
      curr.occupied && curr.occupied.colour === gameState.currentTurn
    return isPiece ? [...acc, curr.occupied as Piece] : acc
  }, [])
}
