import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material"
import { Coordindates, GameState, Move, MoveCard } from "../../types"
import MoveActions from "./MoveActions"

interface MovementCardProps {
  card: MoveCard
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void
}

const MovementCard: React.FC<MovementCardProps> = ({ card, handleMove }) => {
  return (
    <Card>
      <CardMedia
        style={{ height: "12rem" }}
        image={card.imageUrl}
        title={`${card.name} card`}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {card.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {card.name}
        </Typography>
      </CardContent>
      <CardActions>
        <MoveActions handleMove={handleMove} card={card} />
      </CardActions>
    </Card>
  )
}

export default MovementCard
