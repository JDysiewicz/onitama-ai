import { Board, Coordindates, GameState, Move, MoveCard, Piece } from "../types"
import { checkWinConditionsMet } from "./win-conditions"

export const availableMoves = (
  gameState: GameState,
  piecePosition: Coordindates
) => {
  const validMoves: MoveCard[] = gameState.players[
    gameState.currentTurn
  ].moveCards.map(({ name, moves }) => ({
    name,
    moves: moves.filter((move) => {
      const newPosition: Coordindates = [
        piecePosition[0] + move[0],
        piecePosition[1] + move[1],
      ]
      return checkValidMove(gameState, newPosition)
    }),
  }))

  const removeEmptyMoves = validMoves.filter(
    (moveCard) => moveCard.moves.length > 0
  )
  return removeEmptyMoves
}

export const movePiece = (
  gameState: GameState,
  displacement: Move,
  pieceOriginalPosition: Coordindates
): GameState | null => {
  const newPosition: Coordindates = [
    pieceOriginalPosition[0] + displacement[0],
    pieceOriginalPosition[1] + displacement[1],
  ]
  const pieceMoved =
    gameState.board[pieceOriginalPosition[0]][pieceOriginalPosition[1]].occupied
  if (!pieceMoved) {
    throw new Error("Invalid piece moved")
  }

  // Check can move that piece
  const isValidMove = checkValidMove(gameState, newPosition)
  if (!isValidMove) {
    throw new Error("Invalid move!")
  }

  // Check if won
  const winConditionMet = checkWinConditionsMet(
    gameState,
    newPosition,
    pieceMoved.type
  )
  if (winConditionMet) {
    return null
    // TODO: reset game once win condition met
  }

  // Capture opponent piece
  const captureOpponentPiece =
    gameState.board[newPosition[0]][newPosition[1]].occupied
  if (captureOpponentPiece) {
    // #TODO: Do something when capturing enemy piece?
  }

  // Update board positions
  const newBoard = updateBoard(
    gameState,
    pieceOriginalPosition,
    newPosition,
    pieceMoved
  )

  return {
    board: newBoard,
    currentTurn: gameState.currentTurn,
    nextMoveCard: gameState.nextMoveCard,
    players: gameState.players,
  }
}

// Update gameboard via isolated mutation of a deepcopy
export const updateBoard = (
  gameState: GameState,
  pieceOriginalPosition: Coordindates,
  newPosition: Coordindates,
  piece: Piece
): Board => {
  const newBoard = structuredClone(gameState.board)
  newBoard[pieceOriginalPosition[0]][pieceOriginalPosition[1]].occupied = null
  newBoard[newPosition[0]][newPosition[1]].occupied = {
    ...piece,
    position: newPosition,
  }

  return newBoard
}

export const checkValidMove = (
  gameState: GameState,
  newPosition: Coordindates
): boolean => {
  // Move will keep piece in 5x5 grid
  const staysOnBoard =
    newPosition[0] <= 4 &&
    newPosition[0] >= 0 &&
    newPosition[1] <= 4 &&
    newPosition[1] >= 0

  if (!staysOnBoard) {
    return false
  }

  // Two pieces of the same colour cannot occupy the same square
  const isFreeSpace =
    gameState.board[newPosition[0]][newPosition[1]].occupied == null ||
    gameState.board[newPosition[0]][newPosition[1]].occupied?.colour !=
      gameState.currentTurn

  if (!isFreeSpace) {
    return false
  }

  return true
}
