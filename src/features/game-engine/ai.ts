import { Colour, GameState, UnitType } from "../../types"
import {
  mapColourToOpponentTempleCoords,
  mapToOppositePlayer,
} from "../../utils/utils"
import { checkWinConditionsMet } from "./win-conditions"

// Returns an integer value representing how "good"
// the game state would be for a specific colour.
//
// All based on Red, therefore
// high values = better for Red,
// low values = better for Black.
export const evaluateGameState = (gameState: GameState): number => {
  const positiveColour = Colour.RED

  // Arbritary values
  const WIN_STATE_POINTS = 10000
  const DISTANCE_TO_TEMPLE_POINTS = 500
  const MORE_PIECES_POINTS = 100

  // Max points if winning position found
  const lastPlayerMoved = mapToOppositePlayer[gameState.currentTurn]
  const winStatePoints = checkWinConditionsMet(gameState)
    ? lastPlayerMoved === positiveColour // Is a winning position for lastPlayerMoved
      ? WIN_STATE_POINTS // Positive = good for positiveColour
      : WIN_STATE_POINTS * -1 // Negative = good for opponent
    : 0 // If not a winning state, no points on offer

  console.log(`WinStatePoints = ${winStatePoints}`)

  // Points for how close each other is to opponent temple
  const distanceToOpponentTemple = calculateDistanceToTemple(
    gameState,
    positiveColour
  )
  const distanceToOpponentTemplePoints =
    distanceToOpponentTemple !== 0
      ? Math.floor(DISTANCE_TO_TEMPLE_POINTS / distanceToOpponentTemple)
      : DISTANCE_TO_TEMPLE_POINTS

  const opponentDistanceToTemple = calculateDistanceToTemple(
    gameState,
    mapToOppositePlayer[positiveColour]
  )
  const opponentDistanceToTemplePoints =
    opponentDistanceToTemple !== 0
      ? Math.floor(DISTANCE_TO_TEMPLE_POINTS / opponentDistanceToTemple)
      : DISTANCE_TO_TEMPLE_POINTS
  const totalTempleDistancePoints =
    distanceToOpponentTemplePoints - opponentDistanceToTemplePoints

  console.log(
    `distanceToOpponentTemplePoints = ${distanceToOpponentTemplePoints}`
  )
  console.log(
    `opponentDistanceToTemplePoints = ${opponentDistanceToTemplePoints}`
  )
  console.log(`totalTempleDistancePoints = ${totalTempleDistancePoints}`)

  // Points for how many units remaining over the opponent
  const differenceInPieces = calculateDifferenceInPiecesLeft(
    gameState,
    positiveColour
  )
  const differenceInPiecesPoints = differenceInPieces * MORE_PIECES_POINTS
  console.log(`differenceInPiecesPoints = ${differenceInPiecesPoints}`)

  return winStatePoints + totalTempleDistancePoints + differenceInPiecesPoints
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

  console.log(
    `Distance ${colour} to opponent temple: ${
      absVerticalDistance + absHorizontalDistance
    }`
  )

  return absVerticalDistance + absHorizontalDistance
}
