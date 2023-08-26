import {
  Coordindates,
  GameState,
  UnitType,
  WinCondition,
  WinConditionEnum,
} from "../../types"
import {
  mapColourToOpponentTempleCoords,
  mapToOppositePlayer,
} from "../../utils/utils"

export const checkWinConditionsMet = (
  gameState: GameState,
  newPosition: Coordindates,
  unitType: UnitType
): WinCondition | null => {
  const WIN_CONDITIONS = [winByMasterCapture, winByTempleCapture]

  const winConditionMet = WIN_CONDITIONS.find((condition) =>
    condition.checkFn(gameState, newPosition, unitType)
  )

  return winConditionMet ?? null
}

const winByTempleCapture: WinCondition = {
  condition: WinConditionEnum.TEMPLE_CAPTURE,
  message: "You captured the enemy temple!",
  checkFn: (
    gameState: GameState,
    newPosition: Coordindates,
    pieceType: UnitType
  ) => {
    return (
      pieceType === UnitType.MASTER &&
      newPosition.every(
        (coord, idx) =>
          coord === mapColourToOpponentTempleCoords[gameState.currentTurn][idx]
      )
    )
  },
}

const winByMasterCapture: WinCondition = {
  condition: WinConditionEnum.MASTER_CAPTURE,
  message: "You captured the enemy master!",
  checkFn: (gameState: GameState, newPosition: Coordindates) => {
    return (
      gameState.board[newPosition[0]][newPosition[1]]?.occupied?.type ===
        UnitType.MASTER &&
      gameState.board[newPosition[0]][newPosition[1]]?.occupied?.colour ===
        mapToOppositePlayer[gameState.currentTurn]
    )
  },
}
