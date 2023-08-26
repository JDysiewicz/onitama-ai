import { Coordindates, GameState, Move, MoveCard } from "../types"
import { mapToOppositePlayer } from "../utils"
import { movePiece } from "./make-move"

export const executeTurn = (
  gameState: GameState,
  selectedMove: Move,
  selectedCard: MoveCard,
  selectedPieceCoords: Coordindates
): GameState | null => {
  const pieceMoved = movePiece(gameState, selectedMove, selectedPieceCoords)
  if (!pieceMoved) {
    // if no gamestate returned, game was won by current player
    console.log(`${gameState.currentTurn} has won!`)
    return null
  }
  const changedTurns = changeTurn(pieceMoved, selectedCard)
  return changedTurns
}

export const changeTurn = (
  gameState: GameState,
  moveCardUsed: MoveCard
): GameState => {
  const nextPlayerTurn = mapToOppositePlayer[gameState.currentTurn]

  // Give player new cards based on what was just used
  const newPlayerCards = [
    gameState.players[gameState.currentTurn].moveCards.filter(
      (card) => card.name != moveCardUsed.name
    ),
    gameState.nextMoveCard,
  ]

  return {
    board: gameState.board,
    currentTurn: nextPlayerTurn,
    nextMoveCard: moveCardUsed,
    players: {
      ...gameState.players,
      [gameState.currentTurn]: {
        ...gameState.players[gameState.currentTurn],
        moveCards: newPlayerCards,
      },
    },
  }
}
