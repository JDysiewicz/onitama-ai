export type GameState = {
  board: Board
  players: {
    [Colour.BLACK]: Player
    [Colour.RED]: Player
  }
  currentTurn: Colour
  nextMoveCard: MoveCard
}

export enum WinConditionEnum {
  TEMPLE_CAPTURE = "temple-capture",
  MASTER_CAPTURE = "master-capture",
}

export type PlayerWin = {
  winCondition: WinCondition
  playerColour: Colour
}

export type WinCondition = {
  condition: WinConditionEnum
  checkFn: (gameState: GameState) => Colour | null
  message: string
}

// 5x5 board
export type Board = Tile[][]

export type Tile = {
  position: Coordindates
  occupied: Piece | null
  type: TileType
}

// Position on Board is tuple of vert,hori position in array.
export type Coordindates = [VerticalCoordinate, HorizontalCoordinate]
export type VerticalCoordinate = number
export type HorizontalCoordinate = number

export type Piece = {
  type: UnitType
  colour: Colour
  position: Coordindates // Duplicate of 'Tile.position' for ease-of-use when performing moves.
}

export type MoveCard = {
  name: string
  imageUrl: string
  moves: Move[]
}

// Move is still a tuple, however semantically different to 'Coordinates'
// i.e. 'Move' is about displacement, not true position.
export type Move = [VerticalDisplacement, HorizontalDisplacement]
export type VerticalDisplacement = number
export type HorizontalDisplacement = number

export type Player = {
  moveCards: MoveCard[]
  colour: Colour
}

export enum Colour {
  RED = "red",
  BLACK = "black",
}

export enum TileType {
  BASIC = "basic",
  RED_TEMPLE = "red-temple",
  BLACK_TEMPLE = "black-temple",
}

export enum UnitType {
  MASTER = "master",
  SOLDIER = "soldier",
}
