import { useEffect } from "react"

import { newGame } from "./game-engine/init-game"
import { Colour, Coordindates, GameState, Move, MoveCard } from "./types"
import { Grid } from "@mui/material"
import { executeTurn } from "./game-engine/turns"
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

const App = () => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game.gameState)

  // Initial game setup
  useEffect(() => {
    dispatch(updateGameState(newGame()))
  }, [dispatch])

  if (!gameState) {
    return null
  }

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

    // Winner if no new gamestate
    if (!newGameState) {
      alert(`Winner is: ${gameState.currentTurn}!`)
      resetGame()
      return
    }

    // Continue to next turn with new gamestate
    nextTurn(newGameState)
  }

  return (
    <Grid container rowGap={1}>
      <Grid item xs={3}>
        <PlayerMovementCards colour={Colour.BLACK} handleMove={handleMove} />
      </Grid>

      <Grid item xs={6}>
        <GameBoard />
      </Grid>

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
