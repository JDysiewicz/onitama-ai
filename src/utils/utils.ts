import { AiDifficulty, Colour, Coordindates } from "../types"

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

export const wait = async (seconds: number) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

export const mapAiDifficultyToString = {
  [AiDifficulty.EASY]: "EASY",
  [AiDifficulty.MEDIUM]: "MEDIUM",
  [AiDifficulty.HARD]: "HARD",
}
