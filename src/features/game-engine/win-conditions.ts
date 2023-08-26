import {
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
  gameState: GameState
): WinCondition | null => {
  const WIN_CONDITIONS = [winByMasterCapture, winByTempleCapture]

  const winConditionMet = WIN_CONDITIONS.find((condition) =>
    condition.checkFn(gameState)
  )

  return winConditionMet ?? null
}

const winByTempleCapture: WinCondition = {
  condition: WinConditionEnum.TEMPLE_CAPTURE,
  message: "You captured the enemy temple!",
  checkFn: (gameState: GameState) => {
    const opponentTempleCoords =
      mapColourToOpponentTempleCoords[gameState.currentTurn]
    return !!(
      gameState.board[opponentTempleCoords[0]][opponentTempleCoords[1]]
        .occupied &&
      gameState.board[opponentTempleCoords[0]][opponentTempleCoords[1]].occupied
        ?.colour === gameState.currentTurn &&
      gameState.board[opponentTempleCoords[0]][opponentTempleCoords[1]].occupied
        ?.type === UnitType.MASTER
    )
  },
}

const winByMasterCapture: WinCondition = {
  condition: WinConditionEnum.MASTER_CAPTURE,
  message: "You captured the enemy master!",
  checkFn: (gameState: GameState) => {
    const flatenedBoard = gameState.board.flat(1)

    const opponentMasterExists = flatenedBoard.some(
      (tile) =>
        tile.occupied &&
        tile.occupied.colour === mapToOppositePlayer[gameState.currentTurn] &&
        tile.occupied.type === UnitType.MASTER
    )

    // If opponent master is not on the board, it has been taken and therefore this is a win
    return !opponentMasterExists
  },
}
