import { MoveCard } from "../types"

import elephantImage from "../static/movement-cards/elephant.png"
import tigerImage from "../static/movement-cards/tiger.png"
import crabImage from "../static/movement-cards/crab.png"
import monkeyImage from "../static/movement-cards/monkey.png"
import craneImage from "../static/movement-cards/crane.png"
import boarImage from "../static/movement-cards/boar.png"
import dragonImage from "../static/movement-cards/dragon.png"
import mantisImage from "../static/movement-cards/mantis.png"
import frogImage from "../static/movement-cards/frog.png"
import gooseImage from "../static/movement-cards/goose.png"
import horseImage from "../static/movement-cards/horse.png"
import eelImage from "../static/movement-cards/eel.png"

export const moveCards: MoveCard[] = [
  {
    moves: [
      [-2, 0],
      [1, 0],
    ],
    name: "Tiger",
    imageUrl: tigerImage,
    description: "",
  },
  {
    moves: [
      [-1, 0],
      [0, 2],
      [0, -2],
    ],
    name: "Crab",
    imageUrl: crabImage,
    description: "",
  },
  {
    moves: [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ],
    name: "Monkey",
    imageUrl: monkeyImage,
    description: "",
  },
  {
    moves: [
      [-1, 0],
      [1, 1],
      [1, -1],
    ],
    name: "Crane",
    imageUrl: craneImage,
    description: "",
  },
  {
    moves: [
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    name: "Boar",
    imageUrl: boarImage,
    description: "",
  },
  {
    moves: [
      [-1, 2],
      [-1, -2],
      [1, 1],
      [1, -1],
    ],
    name: "Dragon",
    imageUrl: dragonImage,
    description: "",
  },
  {
    moves: [
      [-1, 1],
      [0, 1],
      [0, -1],
      [-1, -1],
    ],
    name: "Elephant",
    imageUrl: elephantImage,
    description: "",
  },
  {
    moves: [
      [-1, 1],
      [1, 0],
      [-1, -1],
    ],
    name: "Mantis",
    imageUrl: mantisImage,
    description: "",
  },
  {
    moves: [
      [1, 1],
      [0, -2],
      [-1, -1],
    ],
    name: "Frog",
    imageUrl: frogImage,
    description: "",
  },
  {
    moves: [
      [0, 1],
      [1, 1],
      [0, -1],
      [-1, -1],
    ],
    name: "Goose",
    imageUrl: gooseImage,
    description: "",
  },
  {
    moves: [
      [-1, 0],
      [1, 0],
      [0, -1],
    ],
    name: "Horse",
    imageUrl: horseImage,
    description: "",
  },
  {
    moves: [
      [0, 1],
      [1, -1],
      [-1, -1],
    ],
    name: "Eel",
    imageUrl: eelImage,
    description: "",
  },
]
