import { describe, expect, it } from "@jest/globals"
import { newGame } from "./init-game"
import { evaluateGameState } from "./ai"
import { Colour, UnitType } from "../../types"

// describe("minimax", () => {
//   it("from initial board position", () => {
//     const gameState = newGame()
//     // Make it red's move as minimax based around red
//     gameState.currentTurn = Colour.RED

//     const predictedBestMove = minimax(gameState, 2, true)

//     console.log(`Best move score = ${predictedBestMove.score}`)
//     console.log(`Best move card = ${predictedBestMove.moveCard?.name}`)
//     console.log(`Best move = ${predictedBestMove.move}`)
//     console.log(`Best unit to move = ${predictedBestMove.pieceCoords}`)

//     expect(true).toBe(false)
//   })
// })

describe("evaluateGameState", () => {
  it("One less black piece is good for red", () => {
    const gameState = newGame()
    gameState.board[0][0].occupied = null

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeGreaterThan(0)
  })

  it("Two less black piece is good for red", () => {
    const gameState = newGame()
    gameState.board[0][0].occupied = null
    gameState.board[0][1].occupied = null

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeGreaterThan(0)
  })

  it("One more piece than black is good for red", () => {
    const gameState = newGame()
    gameState.board[4][0].occupied = null
    gameState.board[0][0].occupied = null
    gameState.board[0][1].occupied = null

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeGreaterThan(0)
  })

  it("Red master closer to temple is good for red", () => {
    const gameState = newGame()
    gameState.board[4][2].occupied = null
    gameState.board[2][2].occupied = {
      colour: Colour.RED,
      position: [2, 2],
      type: UnitType.MASTER,
    }

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeGreaterThan(0)
  })

  it("Black master closer to temple is bad for red", () => {
    const gameState = newGame()
    gameState.board[0][2].occupied = null
    gameState.board[2][2].occupied = {
      colour: Colour.BLACK,
      position: [2, 2],
      type: UnitType.MASTER,
    }

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeLessThan(0)
  })

  it("Red winning gamestate by temple capture is highly favoured", () => {
    const gameState = newGame()

    // Move black master to another square
    gameState.board[0][2].occupied = null
    gameState.board[2][2].occupied = {
      colour: Colour.BLACK,
      position: [2, 2],
      type: UnitType.MASTER,
    }

    // Move red master to black temple
    gameState.board[0][2].occupied = {
      colour: Colour.RED,
      position: [0, 2],
      type: UnitType.MASTER,
    }

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeGreaterThan(1000)
  })

  it("Black winning gamestate by master capture is highly disfavoured for red", () => {
    const gameState = newGame()

    // Move red master to another square
    gameState.board[4][2].occupied = null
    gameState.board[2][2].occupied = {
      colour: Colour.RED,
      position: [2, 2],
      type: UnitType.MASTER,
    }

    // Capture red master with black soldier piece
    gameState.board[2][2].occupied = {
      colour: Colour.BLACK,
      position: [2, 2],
      type: UnitType.SOLDIER,
    }

    const gameStateScore = evaluateGameState(gameState)

    expect(gameStateScore).toBeLessThan(-1000)
  })
})
