import { Typography } from "@mui/material"
import { Colour } from "./types"

interface PlayerTurnIndicatorProps {
  playerColour: Colour
}

const PlayerTurnIndicator: React.FC<PlayerTurnIndicatorProps> = ({
  playerColour,
}) => {
  const mapColourEnumToNiceString = {
    [Colour.BLACK]: "Black",
    [Colour.RED]: "Red",
  }

  return (
    <Typography variant="h4">
      {mapColourEnumToNiceString[playerColour]}'s turn
    </Typography>
  )
}

export default PlayerTurnIndicator
