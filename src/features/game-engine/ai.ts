import {
  Colour,
  Coordindates,
  GameState,
  Move,
  UnitType,
  WinConditionEnum,
} from "../../types"
import {
  mapColourToOpponentTempleCoords,
  mapToOppositePlayer,
} from "../../utils/utils"
import { WIN_CONDITIONS_ENABLED } from "./env"
import { availableMoves } from "./make-move"
import { executeTurn } from "./turns"
import { checkWinConditionsMet } from "./win-conditions"

// RED = maximising player colour
export const minimax = (
  gameState: GameState,
  depth: number,
  isRed: boolean,
  enabledWinConditions: WinConditionEnum[] = WIN_CONDITIONS_ENABLED
): {
  score: number
  moveCardName: string | null
  move: Move | null
  pieceCoords: Coordindates | null
} => {
  const isTerminalGameState = !!checkWinConditionsMet(gameState)
  if (depth === 0 || isTerminalGameState) {
    const score = evaluateGameState(gameState, enabledWinConditions)
    return {
      score,
      moveCardName: null,
      move: null,
      pieceCoords: null,
    }
  }

  if (isRed) {
    let score = -1 * Infinity // Initialise to very low number; any positive is better
    let moveCardName = null
    let moveOnCard = null
    let pieceCoords = null
    const allPieceLocations = gameState.board
      .flat(1)
      .filter((tile) => tile.occupied && tile.occupied.colour === Colour.RED)
      .map((tile) => tile.position)

    // For every piece, get every single move which could be made
    // (each piece, each card, each valid move on the card)
    for (const coords of allPieceLocations) {
      const allMovesWithCards = availableMoves(gameState, coords)
      for (const card of allMovesWithCards) {
        for (const move of card.moves) {
          // Execute each move to get a new gameState and evaluate score
          const newGameState = executeTurn(gameState, move, card, coords)
          const result = minimax(
            newGameState,
            depth - 1,
            false,
            enabledWinConditions
          )

          // If maximising score and score of move is higher than current
          // best move, overwrite existing best move and score.
          if (result.score > score) {
            score = result.score
            moveCardName = card.name
            moveOnCard = move
            pieceCoords = coords
          }
        }
      }
    }

    // Return the best move after every move evaluated
    return {
      score: score,
      moveCardName,
      move: moveOnCard,
      pieceCoords,
    }
  } else {
    let score = 1 * Infinity // Initialise to very large number; any negative is better
    let moveCardName = null
    let moveOnCard = null
    let pieceCoords = null
    const allPieceLocations = gameState.board
      .flat(1)
      .filter((tile) => tile.occupied && tile.occupied.colour === Colour.BLACK)
      .map((tile) => tile.position)

    // For every piece, get every single move which could be made
    // (each piece, each card, each valid move on the card)
    for (const coords of allPieceLocations) {
      const allMovesWithCards = availableMoves(gameState, coords)
      for (const card of allMovesWithCards) {
        for (const move of card.moves) {
          // Execute each move to get a new gameState and evaluate score
          const newGameState = executeTurn(gameState, move, card, coords)
          const result = minimax(
            newGameState,
            depth - 1,
            true,
            enabledWinConditions
          )

          // If maximising score and score of move is higher than current
          // best move, overwrite existing best move and score.
          if (result.score < score) {
            score = result.score
            moveCardName = card.name
            moveOnCard = move
            pieceCoords = coords
          }
        }
      }
    }
    // Return the best move after every move evaluated
    return {
      score: score,
      moveCardName,
      move: moveOnCard,
      pieceCoords,
    }
  }
}

// Returns an integer value representing how "good"
// the game state would be for a specific colour.
//
// All based on Red, therefore
// high values = better for Red,
// low values = better for Black.
export const evaluateGameState = (
  gameState: GameState,
  enabledWinConditions: WinConditionEnum[] = WIN_CONDITIONS_ENABLED
): number => {
  const maximisingPlayerColour = Colour.RED
  // Arbritary values
  const WIN_STATE_POINTS = 10000
  const DISTANCE_TO_TEMPLE_POINTS = 500
  const MORE_PIECES_POINTS = 100

  const winForPlayer = checkWinConditionsMet(gameState)

  const winStatePoints = !winForPlayer
    ? 0 // If no winner, 0 points
    : winForPlayer.playerColour === maximisingPlayerColour
    ? WIN_STATE_POINTS // Max points if positive favoured player win
    : WIN_STATE_POINTS * -1 // Min points if negative favoured player win

  // Points for how close each other is to opponent temple
  const distanceToOpponentTemple = calculateDistanceToTemple(
    gameState,
    maximisingPlayerColour
  )
  const distanceToOpponentTemplePoints =
    distanceToOpponentTemple !== 0
      ? Math.floor(DISTANCE_TO_TEMPLE_POINTS / distanceToOpponentTemple)
      : DISTANCE_TO_TEMPLE_POINTS

  const opponentDistanceToTemple = calculateDistanceToTemple(
    gameState,
    mapToOppositePlayer[maximisingPlayerColour]
  )
  const opponentDistanceToTemplePoints =
    opponentDistanceToTemple !== 0
      ? Math.floor(DISTANCE_TO_TEMPLE_POINTS / opponentDistanceToTemple)
      : DISTANCE_TO_TEMPLE_POINTS
  const totalTempleDistancePoints =
    distanceToOpponentTemplePoints - opponentDistanceToTemplePoints

  // Points for how many units remaining over the opponent
  const differenceInPieces = calculateDifferenceInPiecesLeft(
    gameState,
    maximisingPlayerColour
  )
  const differenceInPiecesPoints = differenceInPieces * MORE_PIECES_POINTS

  let totalPoints = winStatePoints + differenceInPiecesPoints

  // Master distance to temple is only good if the temple capture
  // win condition is enabled
  if (enabledWinConditions.includes(WinConditionEnum.TEMPLE_CAPTURE)) {
    totalPoints += totalTempleDistancePoints
  }

  return totalPoints
}

const calculateDifferenceInPiecesLeft = (
  gameState: GameState,
  colour: Colour
) => {
  const flattenedBoard = gameState.board.flat(1)
  const piecesLeft = flattenedBoard.reduce<{
    [Colour.BLACK]: number
    [Colour.RED]: number
  }>(
    (acc, curr) => {
      if (curr.occupied && curr.occupied.colour === Colour.BLACK) {
        return { ...acc, [Colour.BLACK]: acc[Colour.BLACK] + 1 }
      }
      if (curr.occupied && curr.occupied.colour === Colour.RED) {
        return { ...acc, [Colour.RED]: acc[Colour.RED] + 1 }
      }
      return acc
    },
    { [Colour.BLACK]: 0, [Colour.RED]: 0 }
  )

  return piecesLeft[colour] - piecesLeft[mapToOppositePlayer[colour]]
}

const calculateDistanceToTemple = (gameState: GameState, colour: Colour) => {
  const opponentTempleCoords = mapColourToOpponentTempleCoords[colour]
  const flatenedBoard = gameState.board.flat(1)

  const masterTile = flatenedBoard.find(
    (tile) =>
      tile.occupied &&
      tile.occupied.type === UnitType.MASTER &&
      tile.occupied.colour === colour
  )
  if (!masterTile) {
    return 0
  }

  const absVerticalDistance = Math.abs(
    masterTile.position[0] - opponentTempleCoords[0]
  )
  const absHorizontalDistance = Math.abs(
    masterTile.position[1] - opponentTempleCoords[1]
  )

  return absVerticalDistance + absHorizontalDistance
}
