import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { AiDifficulty, Coordindates, GameState } from "../types"

interface State {
  gameState: GameState | null
  selectedUnitCoords: Coordindates | null
  movePreviewCoords: Coordindates | null
  aiDifficulty: AiDifficulty | null
}

const initialState: State = {
  gameState: null,
  selectedUnitCoords: null,
  movePreviewCoords: null,
  aiDifficulty: null,
}

const gameSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    updateGameState: (
      state: State,
      action: PayloadAction<GameState | null>
    ) => {
      state.gameState = action.payload
    },
    updateSelectedUnitCoords: (
      state: State,
      action: PayloadAction<Coordindates | null>
    ) => {
      state.selectedUnitCoords = action.payload
    },

    updateMovePreviewCoords: (
      state: State,
      action: PayloadAction<Coordindates | null>
    ) => {
      state.movePreviewCoords = action.payload
    },
    updateAiDifficulty: (
      state: State,
      action: PayloadAction<AiDifficulty | null>
    ) => {
      state.aiDifficulty = action.payload
    },
  },
})

export const {
  updateGameState,
  updateSelectedUnitCoords,
  updateMovePreviewCoords,
  updateAiDifficulty,
} = gameSlice.actions
export default gameSlice.reducer
