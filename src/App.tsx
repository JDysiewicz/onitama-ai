import React, { useEffect, useState } from "react"

import { newGame } from "./cli/init-game"
import {
  Colour,
  Coordindates,
  GameState,
  Move,
  MoveCard,
  Tile,
  TileType,
} from "./types"
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material"
import { availableMoves } from "./cli/make-move"
import { executeTurn } from "./cli/turns"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import {
  updateGameState,
  updateMovePreviewCoords,
  updateSelectedUnitCoords,
} from "./state/reducer"

const App = () => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game.gameState)

  // Initial game setup
  useEffect(() => {
    dispatch(updateGameState(newGame()))
  }, [dispatch])

  if (!gameState) {
    return null
  }

  const resetGame = () => {
    dispatch(updateGameState(newGame()))
    dispatch(updateSelectedUnitCoords(null))
    dispatch(updateMovePreviewCoords(null))
  }

  const nextTurn = (newGameState: GameState) => {
    dispatch(updateGameState(newGameState))
    dispatch(updateSelectedUnitCoords(null))
    dispatch(updateMovePreviewCoords(null))
  }

  const handleMove = (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => {
    const newGameState = executeTurn(gameState, move, card, selectedUnitCoords)

    // Winner if no new gamestate
    if (!newGameState) {
      alert(`Winner is: ${gameState.currentTurn}!`)
      resetGame()
      return
    }

    // Continue to next turn with new gamestate
    nextTurn(newGameState)
  }

  return (
    <Grid container rowGap={1}>
      <Grid container item xs={3} columnGap={1}>
        {gameState.players[Colour.BLACK].moveCards.map((card) => (
          <>
            <Grid item xs={5} key={card.name}>
              <MoveCardComponent handleMove={handleMove} moveCard={card} />
            </Grid>
          </>
        ))}
      </Grid>

      <Grid item xs={6}>
        <GameBoard />
      </Grid>

      <Grid container item xs={3} columnGap={1} justifyContent={"right"}>
        {gameState.players[Colour.RED].moveCards.map((card) => (
          <>
            <Grid item xs={5} key={card.name}>
              <MoveCardComponent handleMove={handleMove} moveCard={card} />
            </Grid>
          </>
        ))}
      </Grid>

      <Grid item xs={3}>
        {gameState.currentTurn === Colour.BLACK && (
          <Typography variant="h3">{gameState.currentTurn} Go!</Typography>
        )}
      </Grid>

      <Grid container item xs={6}>
        <Grid item xs={4} />
        <Grid item xs={3}>
          <MoveCardComponent
            handleMove={handleMove}
            moveCard={gameState.nextMoveCard}
          />
        </Grid>
        <Grid item xs={4} />
      </Grid>

      <Grid item xs={3}>
        {gameState.currentTurn === Colour.RED && (
          <Typography variant="h3">{gameState.currentTurn} Go!</Typography>
        )}
      </Grid>
    </Grid>
  )
}

interface GameBoardProps {}

const GameBoard: React.FC<GameBoardProps> = () => {
  const gameState = useSelector((state: RootState) => state.game.gameState)

  if (!gameState) {
    return null
  }

  return (
    <Grid container columns={5}>
      {gameState.board.map((row, i) => (
        <Grid container columns={5} key={i} xs={5}>
          {row.map((tile, idx) => (
            <Grid item key={idx} xs={1}>
              <TileCell tile={tile} />
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}

interface TileCellProps {
  tile: Tile
}

const useTileBackgroundColour = (tile: Tile) => {
  const selectedUnitCoords = useSelector(
    (state: RootState) => state.game.selectedUnitCoords
  )
  const movePreviewCoords = useSelector(
    (state: RootState) => state.game.movePreviewCoords
  )

  const [backgroundColour, setBackgroundColour] = useState("#FFFFFF")

  useEffect(() => {
    const tileIsSelected = coordinatesMatch(
      selectedUnitCoords ?? [100, 100],
      tile.position
    )
    const tileIsHighlighted = coordinatesMatch(
      movePreviewCoords ?? [100, 100],
      tile.position
    )

    if (tileIsSelected) {
      setBackgroundColour("#FF0000")
    } else if (tileIsHighlighted) {
      setBackgroundColour("#FFFF00")
    } else {
      setBackgroundColour("#FFFFFF")
    }
  }, [selectedUnitCoords, movePreviewCoords, tile])

  return backgroundColour
}

const TileCell: React.FC<TileCellProps> = ({ tile }) => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game.gameState)
  const backgroundColour = useTileBackgroundColour(tile)

  if (!gameState) {
    return null
  }

  return (
    <div
      style={{
        height: "7rem",
        border: "2px solid black",
        background: backgroundColour,
      }}
    >
      <h3>{tile.type !== TileType.BASIC && tile.type}</h3>
      {tile.occupied && (
        <Button
          style={{
            color: tile.occupied.colour === Colour.RED ? "red" : "black",
          }}
          variant={"contained"}
          disabled={tile.occupied.colour != gameState.currentTurn}
          onClick={() =>
            dispatch(updateSelectedUnitCoords(tile?.occupied?.position ?? null))
          }
        >
          {tile.occupied?.type}
        </Button>
      )}
    </div>
  )
}

const coordinatesMatch = (coord1: Coordindates, coord2: Coordindates) =>
  coord1[0] === coord2[0] && coord1[1] === coord2[1]

interface MoveCardComponentProps {
  moveCard: MoveCard
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void
}

const MoveCardComponent: React.FC<MoveCardComponentProps> = ({
  moveCard,
  handleMove,
}) => {
  return (
    <Card>
      <CardMedia
        style={{ height: "12rem" }}
        image={moveCard.imageUrl}
        title={`${moveCard.name} card`}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {moveCard.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {moveCard.name}
        </Typography>
      </CardContent>
      <CardActions>
        {<MoveCardMoves handleMove={handleMove} moveCard={moveCard} />}
      </CardActions>
    </Card>
  )
}

interface MoveCardMovesProps {
  moveCard: MoveCard
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void
}

const MoveCardMoves: React.FC<MoveCardMovesProps> = ({
  moveCard,
  handleMove,
}) => {
  const gameState = useSelector((state: RootState) => state.game.gameState)
  const selectedUnitCoords = useSelector(
    (state: RootState) => state.game.selectedUnitCoords
  )
  const dispatch = useDispatch()
  if (!gameState) {
    return null
  }
  // Check what moves on the card can be played
  const legalMoves = selectedUnitCoords
    ? availableMoves(gameState, selectedUnitCoords)
    : []
  const validCardMoves =
    legalMoves.find((card) => card.name === moveCard.name)?.moves ?? []

  const movePreview = (move: Move, selectedUnitCoords: Coordindates | null) => {
    if (!selectedUnitCoords) {
      return
    }

    const previewCoords: Coordindates = [
      selectedUnitCoords[0] + move[0],
      selectedUnitCoords[1] + move[1],
    ]

    dispatch(updateMovePreviewCoords(previewCoords))
  }

  return (
    <ButtonGroup variant="contained">
      {moveCard.moves.map((move) => {
        const isMoveValid = !!validCardMoves.find(
          (validMove) => validMove[0] === move[0] && validMove[1] === move[1]
        )

        return (
          <Button
            key={`${moveCard.name}-${move[0]}-${move[1]}`}
            size="small"
            variant="contained"
            disabled={!isMoveValid}
            onClick={
              selectedUnitCoords
                ? () =>
                    handleMove(move, moveCard, gameState, selectedUnitCoords)
                : () => {}
            }
            onMouseOver={() => movePreview(move, selectedUnitCoords)}
            onMouseOut={() => dispatch(updateMovePreviewCoords(null))}
          >
            {move.join(", ")}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}

export default App
