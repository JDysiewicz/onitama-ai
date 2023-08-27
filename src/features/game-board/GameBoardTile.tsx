import { useDispatch, useSelector } from "react-redux"
import { Colour, Tile, UnitType } from "../../types"
import { RootState } from "../../state/store"
import { useTileBackgroundColour } from "../../hooks/use-tile-background-colour"
import { Button, Grid } from "@mui/material"
import { updateSelectedUnitCoords } from "../../state/reducer"

interface GameBoardTileProps {
  tile: Tile
}

const GameBoardTile: React.FC<GameBoardTileProps> = ({ tile }) => {
  const dispatch = useDispatch()
  const gameState = useSelector((state: RootState) => state.game.gameState)
  const backgroundColour = useTileBackgroundColour(tile)
  const aiDifficulty = useSelector(
    (state: RootState) => state.game.aiDifficulty
  )

  if (!gameState) {
    return null
  }

  return (
    <Grid
      style={{
        background: backgroundColour,
        height: "6rem",
        border:
          tile.occupied && tile.occupied.type === UnitType.MASTER
            ? "4px solid black"
            : "1px solid black",
      }}
      container
    >
      {/* Disable temple for now as more fun games without temple victory */}
      <Grid item xs={3} />
      <Grid item xs={6}>
        {/* {tile.type !== TileType.BASIC && <Typography>{tile.type}</Typography>} */}
      </Grid>
      <Grid item xs={3} />

      <Grid item xs={3} />
      <Grid item xs={6}>
        {tile.occupied && (
          <Button
            variant={"contained"}
            disabled={
              tile.occupied.colour != gameState.currentTurn ||
              (!!aiDifficulty && gameState.currentTurn === Colour.RED) // AI acts as RED
            }
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
