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
  const colour = Colour.RED

  // Arbritary values
  const WIN_STATE_POINTS = 10000
  const DISTANCE_TO_TEMPLE_POINTS = 500
  const MORE_PIECES_POINTS = 100

  // Max points as this is most desirable state
  const winStatePoints = checkWinConditionsMet(gameState) ? WIN_STATE_POINTS : 0

  // Points for how close each other is to opponent temple
  const distanceToOpponentTemple = calculateDistanceToTemple(gameState, colour)
  const distanceToOpponentTemplePoints =
    distanceToOpponentTemple !== 0
      ? Math.floor(DISTANCE_TO_TEMPLE_POINTS / distanceToOpponentTemple)
      : DISTANCE_TO_TEMPLE_POINTS

  const opponentDistanceToTemple = calculateDistanceToTemple(
    gameState,
    mapToOppositePlayer[colour]
  )
  const opponentDistanceToTemplePoints =
    opponentDistanceToTemple !== 0
      ? Math.floor(DISTANCE_TO_TEMPLE_POINTS / opponentDistanceToTemple)
      : DISTANCE_TO_TEMPLE_POINTS
  const totalTempleDistancePoints =
    distanceToOpponentTemplePoints - opponentDistanceToTemplePoints

  // Points for how many units remaining over the opponent
  const differenceInPieces = calculateDifferenceInPiecesLeft(gameState, colour)
  const differenceInPiecesPoints = differenceInPieces * MORE_PIECES_POINTS

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

const calculateDistanceToTemple = (gameState: GameState, aiColour: Colour) => {
  const opponentTempleCoords = mapColourToOpponentTempleCoords[aiColour]

  const masterPosition = gameState.board.filter((row) =>
    row.filter(
      (tile) =>
        tile.occupied &&
        tile.occupied.type === UnitType.MASTER &&
        tile.occupied.colour === aiColour
    )
  )[0][0].position

  const absVerticalDistance = Math.abs(
    masterPosition[0] - opponentTempleCoords[0]
  )
  const absHorizontalDistance = Math.abs(
    masterPosition[1] - opponentTempleCoords[1]
  )

  return absVerticalDistance + absHorizontalDistance
}
