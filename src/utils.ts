import { Colour } from "./types"

export const BLACK_TEMPLE_COORDS = [0, 2]
export const RED_TEMPLE_COORDS = [4, 2]

export const mapColourToOpponentTempleCoords = {
  [Colour.BLACK]: RED_TEMPLE_COORDS,
  [Colour.RED]: BLACK_TEMPLE_COORDS,
}

export const mapToOppositePlayer = {
  [Colour.BLACK]: Colour.RED,
  [Colour.RED]: Colour.BLACK,
}
