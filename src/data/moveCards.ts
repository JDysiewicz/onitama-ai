import { MoveCard } from "../types"

export const moveCards: MoveCard[] = [
  {
    moves: [
      [1, 0],
      [-2, 0],
    ],
    name: "tiger",
    imageUrl: "src/static/movement-cards/tiger.png",
  },
  {
    moves: [
      [-1, 0],
      [0, 2],
      [0, -2],
    ],
    name: "crab",
    imageUrl: "src/static/movement-cards/crab.png",
  },
  {
    moves: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ],
    name: "monkey",
    imageUrl: "src/static/movement-cards/monkey.png",
  },
  {
    moves: [
      [-1, 0],
      [1, 1],
      [1, -1],
    ],
    name: "crane",
    imageUrl: "src/static/movement-cards/crane.png",
  },
  {
    moves: [
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    name: "boar",
    imageUrl: "src/static/movement-cards/boar.png",
  },
]
