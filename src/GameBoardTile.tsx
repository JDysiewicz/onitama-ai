import { useDispatch, useSelector } from "react-redux"
import { Tile, TileType } from "./types"
import { RootState } from "./store"
import { useTileBackgroundColour } from "./hooks/use-tile-background-colour"
import { Button, Grid, Typography } from "@mui/material"
import { updateSelectedUnitCoords } from "./state/reducer"

interface GameBoardTileProps {
  tile: Tile
}

const GameBoardTile: React.FC<GameBoardTileProps> = ({ tile }) => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game.gameState)
  const backgroundColour = useTileBackgroundColour(tile)

  if (!gameState) {
    return null
  }

  return (
    <Grid
      style={{
        background: backgroundColour,
        height: "6rem",
        border: "2px solid black",
      }}
      container
    >
      <Grid item xs={3} />
      <Grid item xs={6}>
        {tile.type !== TileType.BASIC && <Typography>{tile.type}</Typography>}
      </Grid>
      <Grid item xs={3} />

      <Grid item xs={3} />
      <Grid item xs={6}>
        {tile.occupied && (
          <Button
            variant={"contained"}
            disabled={tile.occupied.colour != gameState.currentTurn}
            onClick={() =>
              dispatch(
                updateSelectedUnitCoords(tile?.occupied?.position ?? null)
              )
            }
          >
            {tile.occupied?.type}
          </Button>
        )}
      </Grid>
      <Grid item xs={3} />
    </Grid>
  )
}

export default GameBoardTile
