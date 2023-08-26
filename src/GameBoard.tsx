import { useSelector } from "react-redux"
import { RootState } from "./store"
import GameBoardTile from "./GameBoardTile"
import { Grid } from "@mui/material"

interface GameBoardProps {}

const GameBoard: React.FC<GameBoardProps> = () => {
  const gameState = useSelector((state: RootState) => state.game.gameState)

  if (!gameState) {
    return null
  }

  return (
    <Grid container columns={5}>
      {gameState.board.map((row, i) => (
        <Grid container item columns={5} key={i} xs={5}>
          {row.map((tile, idx) => (
            <Grid item key={idx} xs={1}>
              <GameBoardTile tile={tile} />
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}

export default GameBoard
