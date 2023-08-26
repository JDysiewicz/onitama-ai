import { describe, expect, it } from "@jest/globals"
import { newGame } from "./init-game"
import { moveCards } from "../data/moveCards"
import { changeTurn } from "./turns"
import { Colour } from "../types"

describe("changeTurn", () => {
  it("updates player turn", () => {
    const originalGameState = newGame()
    originalGameState.currentTurn = Colour.BLACK
    const moveCardUsed = moveCards[0]

    const result = changeTurn(originalGameState, moveCardUsed)

    expect(result.currentTurn).toBe(Colour.RED)
  })

  it("updates next move card", () => {
    const originalGameState = newGame()
    originalGameState.currentTurn = Colour.BLACK
    const moveCardUsed = moveCards[0]

    const result = changeTurn(originalGameState, moveCardUsed)

    expect(result.nextMoveCard).toBe(moveCardUsed)
  })

  it("updates players cards correctly", () => {
    const originalGameState = newGame()
    originalGameState.currentTurn = Colour.BLACK
    const moveCardUsed = moveCards[0]

    const result = changeTurn(originalGameState, moveCardUsed)

    const blackPlayerCards = [
      ...new Set(
        result.players[Colour.BLACK].moveCards.map((card) => card.name)
      ),
    ]

    expect(blackPlayerCards.length).toBe(2)
    expect(blackPlayerCards.includes(originalGameState.nextMoveCard.name)).toBe(
      true
    )
    expect(blackPlayerCards.includes(moveCardUsed.name)).toBe(false)
  })
})
