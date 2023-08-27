import { useEffect } from "react"

import { newGame } from "./features/game-engine/init-game"
import {
  AiDifficulty,
  Colour,
  Coordindates,
  GameState,
  Move,
  MoveCard,
  WinConditionEnum,
} from "./types"
import { Grid } from "@mui/material"
import { executeTurn } from "./features/game-engine/turns"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./state/store"
import {
  updateGameState,
  updateMovePreviewCoords,
  updateSelectedUnitCoords,
} from "./state/reducer"
import PlayerMovementCards from "./features/movement-cards/PlayerMovementCards"
import MovementCard from "./features/movement-cards/MovementCard"
import GameBoard from "./features/game-board/GameBoard"
import PlayerTurnIndicator from "./features/player-turn-indicator/PlayerTurnIndicator"
import { checkWinConditionsMet } from "./features/game-engine/win-conditions"
import { minimax } from "./features/game-engine/ai"
import { mapToOppositePlayer, wait } from "./utils/utils"

const usePlayAgainstAi = (
  gameState: GameState | null,
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void,
  depth: number,
  enabledWinConditions: WinConditionEnum[]
) => {
  useEffect(() => {
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
      const bestMove = minimax(gameState, depth, true, enabledWinConditions)

      if (
        !!bestMove.move &&
        !!bestMove.moveCardName &&
        !!bestMove.pieceCoords
      ) {
        const originalCard = gameState.players[Colour.RED].moveCards.find(
          (card) => card.name === bestMove.moveCardName
        ) as MoveCard

        makeAiMove(gameState, originalCard, bestMove.move, bestMove.pieceCoords)
      } else {
        console.log(JSON.stringify(bestMove))
        alert("Error processing AI move")
      }
    }
  }, [gameState, depth, handleMove, enabledWinConditions])
}

// Each time state is updated,
// check if this gameState is winning for a player.
const useCheckWinningState = (
  gameState: GameState | null,
  resetGame: () => void
) => {
  useEffect(() => {
    if (gameState) {
      // Alert async so UI can update first.
      const alertWinner = async (winner: Colour) => {
        await wait(1)
        alert(`Winner is: ${winner}!`)
        resetGame()
      }

      const winningState = checkWinConditionsMet(gameState)
      if (winningState) {
        // Win check is done *after* game state is already updated to be the next person's turn
        // therefore winner is the player who just moved.
        const winner = mapToOppositePlayer[gameState.currentTurn]
        alertWinner(winner)
      }
    }
  }, [gameState, resetGame])
}

const App = () => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game.gameState)

  // Initial game setup
  useEffect(() => {
    dispatch(updateGameState(newGame()))
  }, [dispatch])

  const resetGame = () => {
    dispatch(updateGameState(newGame()))
    dispatch(updateSelectedUnitCoords(null))
    dispatch(updateMovePreviewCoords(null))
  }

  const nextTurn = (newGameState: GameState) => {
    dispatch(updateGameState(newGameState))
    dispatch(updateSelectedUnitCoords(null))
    dispatch(updateMovePreviewCoords(null))
  }

  const handleMove = (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => {
    const newGameState = executeTurn(gameState, move, card, selectedUnitCoords)

    // Continue to next turn with new gamestate
    nextTurn(newGameState)
  }

  usePlayAgainstAi(gameState, handleMove, AiDifficulty.EASY, [
    WinConditionEnum.MASTER_CAPTURE,
  ])

  useCheckWinningState(gameState, resetGame)

  if (!gameState) {
    return null
  }
  return (
    <Grid container rowGap={1}>
      {/* Black cards (Black on left) */}
      <Grid item xs={3}>
        <PlayerMovementCards colour={Colour.BLACK} handleMove={handleMove} />
      </Grid>

      <Grid item xs={6}>
        <GameBoard />
      </Grid>

      {/* Red cards (Red on right) */}
      <Grid item xs={3} columnGap={1}>
        <PlayerMovementCards colour={Colour.RED} handleMove={handleMove} />
      </Grid>

      {/* Black turn indicator (Black on left) */}
      <Grid item xs={3}>
        {gameState.currentTurn === Colour.BLACK && (
          <PlayerTurnIndicator playerColour={gameState.currentTurn} />
        )}
      </Grid>

      {/* Floating Card */}
      <Grid container item xs={6}>
        <Grid item xs={4} />
        <Grid item xs={3}>
          <MovementCard handleMove={handleMove} card={gameState.nextMoveCard} />
        </Grid>
        <Grid item xs={4} />
      </Grid>

      {/* Red turn indicator (Red on right) */}
      <Grid item xs={3}>
        {gameState.currentTurn === Colour.RED && (
          <PlayerTurnIndicator playerColour={gameState.currentTurn} />
        )}
      </Grid>
    </Grid>
  )
}

export default App
