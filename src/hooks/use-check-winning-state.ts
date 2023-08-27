// Each time state is updated,

import { useEffect } from "react"
import { Colour, GameState, WinConditionEnum } from "../types"
import { mapToOppositePlayer, wait } from "../utils/utils"
import { checkWinConditionsMet } from "../features/game-engine/win-conditions"

// check if this gameState is winning for a player.
export const useCheckWinningState = (
  gameState: GameState | null,
  resetGame: () => void,
  winConditionsEnabled: WinConditionEnum[]
) => {
  useEffect(() => {
    if (gameState) {
      // Alert async so UI can update first.
      const alertWinner = async (winner: Colour) => {
        await wait(1)
        alert(`Winner is: ${winner}!`)
        resetGame()
      }

      const winningState = checkWinConditionsMet(
        gameState,
        winConditionsEnabled
      )
      if (winningState) {
        // Win check is done *after* game state is already updated to be the next person's turn
        // therefore winner is the player who just moved.
        const winner = mapToOppositePlayer[gameState.currentTurn]
        alertWinner(winner)
      }
    }
  }, [gameState, resetGame, winConditionsEnabled])
}
