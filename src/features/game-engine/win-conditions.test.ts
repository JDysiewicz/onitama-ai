import { describe, expect, it } from "@jest/globals"
import { Colour, Coordindates, UnitType, WinConditionEnum } from "../types"
import { newGame } from "./init-game"
import { BLACK_TEMPLE_COORDS, RED_TEMPLE_COORDS } from "../utils/utils"
import { checkWinConditionsMet } from "./win-conditions"

describe("temple capture", () => {
  it("red-win by temple capture", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    // make sure temple square is free
    gameState.board[BLACK_TEMPLE_COORDS[0]][BLACK_TEMPLE_COORDS[1]].occupied =
      null

    const newPosition = BLACK_TEMPLE_COORDS
    const unitType = UnitType.MASTER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.TEMPLE_CAPTURE)
  })

  it("black-win by temple capture", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // make sure temple square is free
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = null

    const newPosition = RED_TEMPLE_COORDS
    const unitType = UnitType.MASTER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.TEMPLE_CAPTURE)
  })

  it("soldier piece cant capture temple", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // make sure temple square is free
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = null

    const newPosition = RED_TEMPLE_COORDS
    const unitType = UnitType.SOLDIER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).toBeNull()
  })
})

describe("master capture", () => {
  it("red-win by master capture with soldier", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    const opponentMasterCoords: Coordindates = [2, 3]

    // move master to a different square
    gameState.board[BLACK_TEMPLE_COORDS[0]][BLACK_TEMPLE_COORDS[1]].occupied =
      null
    gameState.board[opponentMasterCoords[0]][opponentMasterCoords[1]].occupied =
      {
        colour: Colour.BLACK,
        position: opponentMasterCoords,
        type: UnitType.MASTER,
      }

    const newPosition = opponentMasterCoords
    const unitType = UnitType.SOLDIER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("red-win by master capture with master", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    const opponentMasterCoords: Coordindates = [1, 1]

    // move master to a different square
    gameState.board[BLACK_TEMPLE_COORDS[0]][BLACK_TEMPLE_COORDS[1]].occupied =
      null
    gameState.board[opponentMasterCoords[0]][opponentMasterCoords[1]].occupied =
      {
        colour: Colour.BLACK,
        position: opponentMasterCoords,
        type: UnitType.MASTER,
      }

    const newPosition = opponentMasterCoords
    const unitType = UnitType.MASTER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("black-win by master capture with soldier", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    const opponentMasterCoords: Coordindates = [3, 1]

    // move master to a different square
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = null
    gameState.board[opponentMasterCoords[0]][opponentMasterCoords[1]].occupied =
      {
        colour: Colour.RED,
        position: opponentMasterCoords,
        type: UnitType.MASTER,
      }

    const newPosition = opponentMasterCoords
    const unitType = UnitType.SOLDIER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("black-win by master capture with master", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    const opponentMasterCoords: Coordindates = [1, 4]

    // move master to a different square
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = null
    gameState.board[opponentMasterCoords[0]][opponentMasterCoords[1]].occupied =
      {
        colour: Colour.RED,
        position: opponentMasterCoords,
        type: UnitType.MASTER,
      }

    const newPosition = opponentMasterCoords
    const unitType = UnitType.MASTER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("cant capture your own master", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    const opponentMasterCoords: Coordindates = [2, 3]

    // move master to a different square
    gameState.board[RED_TEMPLE_COORDS[0]][RED_TEMPLE_COORDS[1]].occupied = null
    gameState.board[opponentMasterCoords[0]][opponentMasterCoords[1]].occupied =
      {
        colour: Colour.BLACK,
        position: opponentMasterCoords,
        type: UnitType.MASTER,
      }

    const newPosition = opponentMasterCoords
    const unitType = UnitType.SOLDIER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).toBeNull()
  })

  it("master capture on temple square with soldier is master capture ", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    const newPosition = RED_TEMPLE_COORDS
    const unitType = UnitType.SOLDIER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })

  it("master capture takes precedence if master capture on temple square", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    const newPosition = BLACK_TEMPLE_COORDS
    const unitType = UnitType.MASTER

    const result = checkWinConditionsMet(gameState, newPosition, unitType)
    expect(result).not.toBeNull()
    expect(result?.condition).toBe(WinConditionEnum.MASTER_CAPTURE)
  })
})
