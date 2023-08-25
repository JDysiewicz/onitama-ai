export type GameState = {
  board: Board
  blackPlayer: Player
  redPlayer: Player
}

// 5x5 board
export type Board = Tile[][]

export type Tile = {
  position: Coordindates
  occupied: Meeple | null
  type: TileType
}

// Position on Board is tuple of vert,hori position in array.
export type Coordindates = [VerticalCoordinate, HorizontalCoordinate]
export type VerticalCoordinate = number
export type HorizontalCoordinate = number

export type Meeple = {
  type: UnitType
  colour: Colour
  position: Coordindates // Duplicate of 'Tile.position' for ease-of-use when performing moves.
}

export type MoveCard = {
  name: string
  moves: Move[]
}

// Move is still a tuple, however semantically different to 'Coordinates'
// i.e. 'Move' is about displacement, not true position.
export type Move = [VerticalDisplacement, HorizontalDisplacement]
export type VerticalDisplacement = number
export type HorizontalDisplacement = number

export type Player = {
  moveCards: MoveCard[]
  nextMoveCard: MoveCard | null // Can always see what they're next card will be, unless it's opponent's turn
  colour: Colour
  board: Board
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
