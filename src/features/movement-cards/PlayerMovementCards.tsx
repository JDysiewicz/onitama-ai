import { useSelector } from "react-redux"
import { RootState } from "../../state/store"
import { Colour, Coordindates, GameState, Move, MoveCard } from "../../types"
import { Grid } from "@mui/material"
import MovementCard from "./MovementCard"

interface PlayerMovementCardsProps {
  colour: Colour
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void
}

const PlayerMovementCards: React.FC<PlayerMovementCardsProps> = ({
  colour,
  handleMove,
}) => {
  const gameState = useSelector((state: RootState) => state.game.gameState)

  if (!gameState) {
    return null
  }

  const mapPlayerColourToJustify = {
    [Colour.BLACK]: "left",
    [Colour.RED]: "right",
  }

  return (
    <Grid
      container
      columnGap={1}
      justifyContent={mapPlayerColourToJustify[colour]}
    >
      {gameState.players[colour].moveCards.map((card) => (
        <Grid item xs={5} key={card.name}>
          <MovementCard handleMove={handleMove} card={card} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PlayerMovementCards
