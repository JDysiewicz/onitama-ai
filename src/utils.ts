import { Colour, Coordindates } from "./types"

export const BLACK_TEMPLE_COORDS: Coordindates = [0, 2]
export const RED_TEMPLE_COORDS: Coordindates = [4, 2]

export const mapColourToOpponentTempleCoords = {
  [Colour.BLACK]: RED_TEMPLE_COORDS,
  [Colour.RED]: BLACK_TEMPLE_COORDS,
}

export const mapToOppositePlayer = {
  [Colour.BLACK]: Colour.RED,
  [Colour.RED]: Colour.BLACK,
}

export const coordinatesMatch = (coord1: Coordindates, coord2: Coordindates) =>
  coord1[0] === coord2[0] && coord1[1] === coord2[1]
