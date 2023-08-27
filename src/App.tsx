import { useEffect, useState } from "react"

import { newGame } from "./features/game-engine/init-game"
import {
  Colour,
  Coordindates,
  GameState,
  Move,
  MoveCard,
  WinConditionEnum,
} from "./types"
import { Grid, Typography } from "@mui/material"
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
import { usePlayAgainstAi } from "./hooks/use-play-against-ai"
import { useCheckWinningState } from "./hooks/use-check-winning-state"
import SelectDifficulty from "./features/select-difficulty/SelectDifficulty"
import { mapAiDifficultyToString } from "./utils/utils"

const App = () => {
  const [firstTimeLoad, setFirstTimeLoad] = useState(true)
  const dispatch = useDispatch()

  const gameState = useSelector((state: RootState) => state.game.gameState)
  const aiDifficulty = useSelector(
    (state: RootState) => state.game.aiDifficulty
  )

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

  // RED will move as AI
  usePlayAgainstAi(gameState, handleMove, aiDifficulty, [
    WinConditionEnum.MASTER_CAPTURE,
  ])

  // Scan for winning state after each gameState update
  useCheckWinningState(gameState, resetGame, [WinConditionEnum.MASTER_CAPTURE])

  if (firstTimeLoad) {
    return <SelectDifficulty setFirstTimeLoad={setFirstTimeLoad} />
  }

  // Keep TS happy when handling potentially null gamestate
  if (!gameState) {
    return null
  }

  return (
    <Grid container rowGap={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Onitama AI</Typography>
        {aiDifficulty && (
          <Typography variant="subtitle1">
            Ai Difficulty: {mapAiDifficultyToString[aiDifficulty]}
          </Typography>
        )}
      </Grid>
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
