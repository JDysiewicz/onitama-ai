import {
  Board,
  Colour,
  GameState,
  PlayerWin,
  UnitType,
  WinCondition,
  WinConditionEnum,
} from "../../types"
import {
  mapColourToOpponentTempleCoords,
  mapToOppositePlayer,
} from "../../utils/utils"
import { WIN_CONDITIONS_ENABLED } from "./env"

export const checkWinConditionsMet = (
  gameState: GameState,
  conditionsEnabled: WinConditionEnum[] = WIN_CONDITIONS_ENABLED
): PlayerWin | null => {
  const ALL_WIN_CONDITIONS = [winByMasterCapture, winByTempleCapture]

  const enabledConditions = ALL_WIN_CONDITIONS.filter((con) =>
    conditionsEnabled.includes(con.condition)
  )

  const winConditionMet = enabledConditions.find((condition) =>
    condition.checkFn(gameState)
  )

  if (!winConditionMet) {
    return null
  }

  const playerWin: PlayerWin = {
    playerColour: winConditionMet.checkFn(gameState) as Colour,
    winCondition: winConditionMet,
  }

  return playerWin
}

// eslint-disable-next-line
const winByTempleCapture: WinCondition = {
  condition: WinConditionEnum.TEMPLE_CAPTURE,
  message: "You captured the enemy temple!",
  checkFn: (gameState: GameState): Colour | null => {
    const checkTempleCapture = (board: Board, checkWinPlayer: Colour) => {
      const opponentTempleCoords =
        mapColourToOpponentTempleCoords[checkWinPlayer]
      return !!(
        board[opponentTempleCoords[0]][opponentTempleCoords[1]].occupied &&
        board[opponentTempleCoords[0]][opponentTempleCoords[1]].occupied
          ?.colour === checkWinPlayer &&
        board[opponentTempleCoords[0]][opponentTempleCoords[1]].occupied
          ?.type === UnitType.MASTER
      )
    }

    const redWin = checkTempleCapture(gameState.board, Colour.RED)
    if (redWin) {
      return Colour.RED
    }

    const blackWin = checkTempleCapture(gameState.board, Colour.BLACK)
    if (blackWin) {
      return Colour.BLACK
    }

    return null
  },
}

const winByMasterCapture: WinCondition = {
  condition: WinConditionEnum.MASTER_CAPTURE,
  message: "You captured the enemy master!",
  checkFn: (gameState: GameState) => {
    const checkMasterTaken = (board: Board, checkWinPlayer: Colour) => {
      const flatenedBoard = board.flat(1)
      const opponentMasterExists = flatenedBoard.some(
        (tile) =>
          tile.occupied &&
          tile.occupied.colour === mapToOppositePlayer[checkWinPlayer] &&
          tile.occupied.type === UnitType.MASTER
      )

      // If opponent master doesn't exist, it is a win for `checkWinPlayer`
      return !opponentMasterExists
    }

    const redWin = checkMasterTaken(gameState.board, Colour.RED)
    if (redWin) {
      return Colour.RED
    }

    const blackWin = checkMasterTaken(gameState.board, Colour.BLACK)
    if (blackWin) {
      return Colour.BLACK
    }

    return null
  },
}
