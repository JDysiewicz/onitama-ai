import { Coordindates, GameState, Move, MoveCard } from "../../types"
import { mapToOppositePlayer } from "../../utils/utils"
import { movePiece } from "./make-move"

export const executeTurn = (
  gameState: GameState,
  selectedMove: Move,
  selectedCard: MoveCard,
  selectedPieceCoords: Coordindates
): GameState => {
  const pieceMoved = movePiece(gameState, selectedMove, selectedPieceCoords)

  // Update player hand
  const changedCards = changeCards(pieceMoved, selectedCard)

  // Move to next player's turn
  const changedTurns = changeTurn(changedCards)

  return changedTurns
}

export const changeCards = (
  gameState: GameState,
  moveCardUsed: MoveCard
): GameState => {
  // Give player new cards based on what was just used
  const newPlayerCards = [
    ...gameState.players[gameState.currentTurn].moveCards.filter(
      (card) => card.name != moveCardUsed.name
    ),
    gameState.nextMoveCard,
  ]

  return {
    board: gameState.board,
    currentTurn: gameState.currentTurn,
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

export const changeTurn = (gameState: GameState): GameState => {
  const nextPlayerTurn = mapToOppositePlayer[gameState.currentTurn]

  return {
    ...gameState,
    board: gameState.board,
    currentTurn: nextPlayerTurn,
  }
}
