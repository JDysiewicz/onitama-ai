import { moveCards } from "../../data/moveCards"
import {
  Board,
  Colour,
  GameState,
  MoveCard,
  Player,
  Tile,
  TileType,
  UnitType,
  VerticalCoordinate,
} from "../../types"

export const newGame = (): GameState => {
  const initialBoard = newBoard()
  const cards = generateCards()
  const blackCards = cards.slice(0, 2)
  const redCards = cards.slice(2, 4)
  const floatingCard = cards[4]

  const blackPlayer = generatePlayer(Colour.BLACK, blackCards)
  const redPlayer = generatePlayer(Colour.RED, redCards)

  return {
    players: {
      [Colour.BLACK]: blackPlayer,
      [Colour.RED]: redPlayer,
    },
    currentTurn: Colour.BLACK,
    board: initialBoard,
    nextMoveCard: floatingCard,
  }
}

const generatePlayer = (colour: Colour, moveCards: MoveCard[]): Player => ({
  colour,
  moveCards,
})

const newBoard = (): Board => {
  return [
    generateNewTempleRow(0, Colour.BLACK),
    ...Array.from({ length: 3 }, (_x, idx) => generateBasicRow(idx + 1)), // +1 as already one temple row,
    generateNewTempleRow(4, Colour.RED),
  ]
}

// Middle-of-grid rows are unoccupied at the start
const generateBasicRow = (verticalIndex: VerticalCoordinate): Tile[] => {
  return Array.from({ length: 5 }, (_x, idx) => ({
    occupied: null,
    position: [verticalIndex, idx],
    type: TileType.BASIC,
  }))
}

// Populates with initial pieces
const generateNewTempleRow = (
  verticalIndex: VerticalCoordinate,
  playerColour: Colour
): Tile[] => {
  return [
    {
      type: TileType.BASIC,
      position: [verticalIndex, 0],
      occupied: {
        colour: playerColour,
        position: [verticalIndex, 0],
        type: UnitType.SOLDIER,
      },
    },
    {
      type: TileType.BASIC,
      position: [verticalIndex, 1],
      occupied: {
        colour: playerColour,
        position: [verticalIndex, 1],
        type: UnitType.SOLDIER,
      },
    },
    {
      type:
        playerColour === Colour.BLACK
          ? TileType.BLACK_TEMPLE
          : TileType.RED_TEMPLE,
      position: [verticalIndex, 2],
      occupied: {
        colour: playerColour,
        position: [verticalIndex, 2],
        type: UnitType.MASTER,
      },
    },
    {
      type: TileType.BASIC,
      position: [verticalIndex, 3],
      occupied: {
        colour: playerColour,
        position: [verticalIndex, 3],
        type: UnitType.SOLDIER,
      },
    },
    {
      type: TileType.BASIC,
      position: [verticalIndex, 4],
      occupied: {
        colour: playerColour,
        position: [verticalIndex, 4],
        type: UnitType.SOLDIER,
      },
    },
  ]
}

const generateCards = (): MoveCard[] => {
  // Pseudo-randomly get 5 elements from the cards array
  // by doing a random sort and slicing the first 5 elements.
  const randomlyOrderedCards = shuffleArray(moveCards)
  const cards = randomlyOrderedCards.slice(0, 5)
  return cards
}

// Durstenfeld Shuffle Algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const copy = structuredClone(array)
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}
