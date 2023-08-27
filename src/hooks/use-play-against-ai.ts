import { useEffect } from "react"
import {
  AiDifficulty,
  Colour,
  Coordindates,
  GameState,
  Move,
  MoveCard,
  WinConditionEnum,
} from "../types"
import { wait } from "../utils/utils"
import { minimax } from "../features/game-engine/ai"

export const usePlayAgainstAi = (
  gameState: GameState | null,
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void,
  aiDifficulty: AiDifficulty | null,
  enabledWinConditions: WinConditionEnum[]
) => {
  useEffect(() => {
    if (aiDifficulty) {
      const makeAiMove = async (
        gameState: GameState,
        card: MoveCard,
        move: Move,
        piece: Coordindates
      ) => {
        await wait(1)
        handleMove(move, card, gameState, piece)
      }

      if (gameState && gameState.currentTurn === Colour.RED) {
        const bestMove = minimax(
          gameState,
          aiDifficulty,
          true,
          enabledWinConditions
        )

        if (
          !!bestMove.move &&
          !!bestMove.moveCardName &&
          !!bestMove.pieceCoords
        ) {
          const originalCard = gameState.players[Colour.RED].moveCards.find(
            (card) => card.name === bestMove.moveCardName
          ) as MoveCard

          makeAiMove(
            gameState,
            originalCard,
            bestMove.move,
            bestMove.pieceCoords
          )
        }
      }
    }
  }, [gameState, aiDifficulty, handleMove, enabledWinConditions])
}
