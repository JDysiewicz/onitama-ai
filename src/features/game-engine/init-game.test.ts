import { describe, expect, it } from "@jest/globals"
import { newGame } from "./init-game"
import { Colour, UnitType } from "../../types"

describe("game initialisation", () => {
  it("creates a new game with the correct sized board", () => {
    const game = newGame()
    expect(game.board.length).toBe(5)
    expect(game.board.every((row) => row.length === 5)).toBe(true)
  })

  it("creates a new game with the correct cards", () => {
    const game = newGame()
    const allCards = [
      ...game.players[Colour.BLACK].moveCards,
      ...game.players[Colour.RED].moveCards,
      game.nextMoveCard,
    ].map((card) => card.name)

    const allCardsDeduplicated = [...new Set(allCards)]

    expect(allCardsDeduplicated.length).toBe(5)
    expect(game.players[Colour.BLACK].moveCards.length).toBe(2)
    expect(game.players[Colour.RED].moveCards.length).toBe(2)
  })

  it("black starts first", () => {
    const game = newGame()
    expect(game.currentTurn).toBe(Colour.BLACK)
  })

  it("Board has correct units in the correct spaces", () => {
    const game = newGame()
    const unitsInRows = game.board.map((row) =>
      row.map((tile) => tile.occupied)
    )

    // Black starting row is fine
    expect(unitsInRows[0].every((unit) => unit)).toBe(true)
    expect(unitsInRows[0].every((unit) => unit?.colour === Colour.BLACK))
    expect(unitsInRows[0][0]?.type).toBe(UnitType.SOLDIER)
    expect(unitsInRows[0][1]?.type).toBe(UnitType.SOLDIER)
    expect(unitsInRows[0][2]?.type).toBe(UnitType.MASTER)
    expect(unitsInRows[0][3]?.type).toBe(UnitType.SOLDIER)
    expect(unitsInRows[0][4]?.type).toBe(UnitType.SOLDIER)

    // Middle rows contain no units
    expect(unitsInRows[1].every((unit) => !unit)).toBe(true)
    expect(unitsInRows[2].every((unit) => !unit)).toBe(true)
    expect(unitsInRows[3].every((unit) => !unit)).toBe(true)

    // Red starting row is fine
    expect(unitsInRows[4].every((unit) => unit)).toBe(true)
    expect(unitsInRows[4].every((unit) => unit?.colour === Colour.RED))
    expect(unitsInRows[0][0]?.type).toBe(UnitType.SOLDIER)
    expect(unitsInRows[0][1]?.type).toBe(UnitType.SOLDIER)
    expect(unitsInRows[0][2]?.type).toBe(UnitType.MASTER)
    expect(unitsInRows[0][3]?.type).toBe(UnitType.SOLDIER)
    expect(unitsInRows[0][4]?.type).toBe(UnitType.SOLDIER)
  })
})
