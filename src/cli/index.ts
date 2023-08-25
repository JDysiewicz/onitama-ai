import {
  Board,
  Colour,
  Coordindates,
  GameState,
  Meeple,
  Tile,
  TileType,
  UnitType,
} from "../types"

export const doStuff = () => console.log("hi")

// export const newGame = (): GameState => {
//     const board =
// }

const newBoard = (): Board => {}

const generateBasicRow = () => {}

const generateNewTempleRow = (playerColour: Colour): Tile[] => {
  const verticalIndex = playerColour === Colour.BLACK ? 0 : 4
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
