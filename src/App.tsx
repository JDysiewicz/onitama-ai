import React, { useState } from "react"

import { newGame } from "./cli/init-game"
import { Colour, Coordindates, GameState, Move, MoveCard, Tile } from "./types"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material"
import { availableMoves } from "./cli/make-move"
import { executeTurn } from "./cli/turns"

const App = () => {
  const [gameState, setGameState] = useState(newGame())
  const [selectedUnitCoords, setSelectedUnitCoords] =
    useState<Coordindates | null>(null)

  const doMove = (move: Move, card: MoveCard) => {
    if (!selectedUnitCoords) {
      return
    }
    const newGameState = executeTurn(gameState, move, card, selectedUnitCoords)
    console.log("CARDS", newGameState?.players[Colour.BLACK].moveCards)
    if (!newGameState) {
      alert(`Winner is: ${gameState.currentTurn}!`)
      setGameState(newGame())
      setSelectedUnitCoords(null)
      return
    }
    setGameState(newGameState)
    setSelectedUnitCoords(null)
  }

  return (
    <Grid container>
      <Grid container>
        {gameState.players[Colour.BLACK].moveCards.map((card) => (
          <Grid item xs={3} key={card.name}>
            <MoveCardComponent
              doMove={doMove}
              gameState={gameState}
              moveCard={card}
              selectedUnitCoords={selectedUnitCoords}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container item xs={12}>
        <Grid item xs={8}>
          <GameBoard
            gameState={gameState}
            setSelectedUnitCoords={setSelectedUnitCoords}
          />
        </Grid>
        <Grid container item xs={1}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <Typography variant="h3">{gameState.currentTurn} Go!</Typography>
          </Grid>
          <Grid item xs={4} />
        </Grid>
        <Grid item xs={3}>
          <MoveCardComponent
            doMove={doMove}
            gameState={gameState}
            moveCard={gameState.nextMoveCard}
            selectedUnitCoords={selectedUnitCoords}
          />
        </Grid>
      </Grid>
      <Grid container>
        {gameState.players[Colour.RED].moveCards.map((card) => (
          <Grid item xs={4} key={card.name}>
            <MoveCardComponent
              doMove={doMove}
              gameState={gameState}
              moveCard={card}
              selectedUnitCoords={selectedUnitCoords}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

interface GameBoardProps {
  gameState: GameState
  setSelectedUnitCoords: React.Dispatch<
    React.SetStateAction<Coordindates | null>
  >
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  setSelectedUnitCoords,
}) => {
  return (
    <Grid container>
      {gameState.board.map((row, i) => (
        <Grid container key={i}>
          {row.map((tile, idx) => (
            <Grid item key={idx}>
              <TileCell
                gameState={gameState}
                tile={tile}
                setSelectedUnitCoords={setSelectedUnitCoords}
              />
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}

interface TileCellProps {
  gameState: GameState
  tile: Tile
  setSelectedUnitCoords: React.Dispatch<
    React.SetStateAction<Coordindates | null>
  >
}

const TileCell: React.FC<TileCellProps> = ({
  tile,
  setSelectedUnitCoords,
  gameState,
}) => {
  return (
    <div style={{ width: "150px", height: "150px", border: "2px solid black" }}>
      <h3>{tile.type}</h3>
      <Button
        style={{
          color: tile?.occupied?.colour === Colour.RED ? "red" : "black",
        }}
        disabled={tile?.occupied?.colour != gameState.currentTurn}
        onClick={() => setSelectedUnitCoords(tile?.occupied?.position ?? null)}
      >
        {tile.occupied?.type}
      </Button>
      <h3></h3>
    </div>
  )
}

interface MoveCardComponentProps {
  gameState: GameState
  moveCard: MoveCard
  selectedUnitCoords: Coordindates | null
  doMove: (move: Move, card: MoveCard) => void
}

const MoveCardComponent: React.FC<MoveCardComponentProps> = ({
  gameState,
  moveCard,
  selectedUnitCoords,
  doMove,
}) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      /> */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {moveCard.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {moveCard.name}
        </Typography>
      </CardContent>
      <CardActions>
        {
          <MoveCardMoves
            doMove={doMove}
            gameState={gameState}
            moveCard={moveCard}
            selectedUnitCoords={selectedUnitCoords}
          />
        }
      </CardActions>
    </Card>
  )
}

interface MoveCardMovesProps {
  gameState: GameState
  moveCard: MoveCard
  selectedUnitCoords: Coordindates | null
  doMove: (move: Move, card: MoveCard) => void
}

const MoveCardMoves: React.FC<MoveCardMovesProps> = ({
  gameState,
  moveCard,
  selectedUnitCoords,
  doMove,
}) => {
  // Check what moves on the card can be played
  const legalMoves = selectedUnitCoords
    ? availableMoves(gameState, selectedUnitCoords)
    : []
  const validCardMoves =
    legalMoves.find((card) => card.name === moveCard.name)?.moves ?? []

  console.log(moveCard, moveCard.moves)

  return (
    <>
      {moveCard.moves.map((move) => {
        const isMoveValid = !!validCardMoves.find(
          (validMove) => validMove[0] === move[0] && validMove[1] === move[1]
        )

        return (
          <Button
            key={`${moveCard.name}-${move[0]}-${move[1]}`}
            size="small"
            disabled={!isMoveValid}
            onClick={() => doMove(move, moveCard)}
          >
            {move.join(", ")}
          </Button>
        )
      })}
    </>
  )
}

export default App
