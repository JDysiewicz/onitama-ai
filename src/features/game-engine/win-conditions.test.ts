import { describe, expect, it } from "@jest/globals"
import { Colour, UnitType, WinConditionEnum } from "../../types"
import { newGame } from "./init-game"
import { BLACK_TEMPLE_COORDS, RED_TEMPLE_COORDS } from "../../utils/utils"
import { checkWinConditionsMet } from "./win-conditions"

describe("temple capture", () => {
  it("red-win by temple capture", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    // Put opponent master on temple
    // Move master to another square
    gameState.board[2][2].occupied = {
      colour: Colour.BLACK,
      position: [2, 2],
      type: UnitType.MASTER,
    }
    gameState.board[BLACK_TEMPLE_COORDS[0]][BLACK_TEMPLE_COORDS[1]].occupied = {
      colour: Colour.RED,
      position: BLACK_TEMPLE_COORDS,
      type: UnitType.MASTER,
    }

    const result = checkWinConditionsMet(gameState)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.TEMPLE_CAPTURE)
  })

  it("black-win by temple capture", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // Put opponent master on temple
    // Move master to another square
    gameState.board[2][2].occupied = {
      colour: Colour.RED,
      position: [2, 2],
      type: UnitType.MASTER,
    }
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = {
      colour: Colour.BLACK,
      position: RED_TEMPLE_COORDS,
      type: UnitType.MASTER,
    }

    const result = checkWinConditionsMet(gameState)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.TEMPLE_CAPTURE)
  })

  it("soldier piece cant capture temple", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    gameState.board[2][2].occupied = {
      colour: Colour.RED,
      position: [2, 2],
      type: UnitType.MASTER,
    }
    // make sure temple square is free
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = {
      colour: Colour.BLACK,
      position: RED_TEMPLE_COORDS,
      type: UnitType.SOLDIER,
    }

    const result = checkWinConditionsMet(gameState)
    expect(result).toBeNull()
  })
})

describe("master capture", () => {
  it("red-win by master capture", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    // Remove black master from board (assumed taken)
    gameState.board[BLACK_TEMPLE_COORDS[0]][BLACK_TEMPLE_COORDS[1]].occupied =
      null

    const result = checkWinConditionsMet(gameState)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("black-win by master capture", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // move master to a different square
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = null

    const result = checkWinConditionsMet(gameState)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("master capture takes precedence if master capture on temple square", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = {
      colour: Colour.BLACK,
      position: RED_TEMPLE_COORDS,
      type: UnitType.MASTER,
    }

    const result = checkWinConditionsMet(gameState)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })
})
