import { describe, expect, it } from "@jest/globals"
import { newGame } from "./init-game"
import { Colour, Coordindates, Move, Piece, UnitType } from "../../types"
import { checkValidMove, movePiece, updateBoard } from "./make-move"

describe("updateBoard", () => {
  it("original board is not mutated", () => {
    const gameState = newGame()
    const pieceOriginalPosition: Coordindates = [0, 1]
    const newPosition: Coordindates = [1, 1]
    const piece: Piece = {
      colour: Colour.BLACK,
      position: [1, 1],
      type: UnitType.SOLDIER,
    }

    const newBoard = updateBoard(
      gameState,
      pieceOriginalPosition,
      newPosition,
      piece
    )

    expect(newBoard[newPosition[0]][newPosition[1]].occupied).not.toBeNull()
    expect(newBoard[newPosition[0]][newPosition[1]].occupied?.type).toBe(
      piece.type
    )
    expect(gameState.board[newPosition[0]][newPosition[1]].occupied).toBeNull()

    expect(
      newBoard[pieceOriginalPosition[0]][pieceOriginalPosition[1]].occupied
    ).toBeNull()
    expect(
      gameState.board[pieceOriginalPosition[0]][pieceOriginalPosition[1]]
        .occupied
    ).not.toBeNull()
  })
})

describe("checkValidMove", () => {
  it("valid move is valid", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    const newPosition: Coordindates = [3, 0]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(true)
  })

  it("moving onto opponent soldier is valid move", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // RED soldier starts in 4,0
    const newPosition: Coordindates = [4, 0]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(true)
  })

  it("moving onto opponent master is valid move", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    // BLACK master starts at 0,2
    const newPosition: Coordindates = [0, 2]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(true)
  })

  it("moving onto same colour soldier is invalid", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    // BLACK master starts at 0,2
    const newPosition: Coordindates = [4, 1]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(false)
  })

  it("moving onto same colour master is invalid", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // BLACK master starts at 0,2
    const newPosition: Coordindates = [0, 2]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(false)
  })

  it("moving off board vertically is invalid", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // BLACK master starts at 0,2
    const newPosition: Coordindates = [5, 0]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(false)
  })

  it("moving off board horizontally is invalid", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.BLACK

    // BLACK master starts at 0,2
    const newPosition: Coordindates = [2, 7]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(false)
  })

  it("moving off board horizontally and vertically is invalid", () => {
    const gameState = newGame()
    gameState.currentTurn = Colour.RED

    // BLACK master starts at 0,2
    const newPosition: Coordindates = [14, 12]

    const result = checkValidMove(gameState, newPosition)

    expect(result).toBe(false)
  })
})

describe("movePiece", () => {
  it("invalid move throws err", () => {
    const gameState = newGame()

    // Piece will move horizontally 1 to 0,3
    // which is occupied by same colour piece
    const displacement: Move = [0, 1]
    const pieceOriginalPosition: Coordindates = [0, 2]

    const t = () => movePiece(gameState, displacement, pieceOriginalPosition)

    expect(t).toThrow(Error)
  })

  it("win condition met returns null gamestate", () => {
    const gameState = newGame()

    // Capture opposing master on start square
    const displacement: Move = [4, 0]
    const pieceOriginalPosition: Coordindates = [0, 2]

    const result = movePiece(gameState, displacement, pieceOriginalPosition)
    expect(result).toBeNull()
  })

  it("regular move updates gamestate accordinly", () => {
    const originalGameState = newGame()

    // Move to free square
    const displacement: Move = [2, 0]
    const pieceOriginalPosition: Coordindates = [0, 2]

    const result = movePiece(
      originalGameState,
      displacement,
      pieceOriginalPosition
    )

    expect(
      originalGameState.board[pieceOriginalPosition[0]][
        pieceOriginalPosition[1]
      ].occupied
    ).not.toBeNull()
    expect(
      originalGameState.board[pieceOriginalPosition[0] + displacement[0]][
        pieceOriginalPosition[1] + displacement[1]
      ].occupied
    ).toBeNull()

    expect(result).not.toBeNull()
    expect(
      result?.board[pieceOriginalPosition[0]][pieceOriginalPosition[1]].occupied
    ).toBeNull()
    expect(
      result?.board[pieceOriginalPosition[0] + displacement[0]][
        pieceOriginalPosition[1] + displacement[1]
      ].occupied
    ).not.toBeNull()
  })
})
