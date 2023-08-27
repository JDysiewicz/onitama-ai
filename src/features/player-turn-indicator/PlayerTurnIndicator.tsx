import { Typography } from "@mui/material"
import { Colour } from "../../types"
import { useSelector } from "react-redux"
import { RootState } from "../../state/store"

interface PlayerTurnIndicatorProps {
  playerColour: Colour
}

const PlayerTurnIndicator: React.FC<PlayerTurnIndicatorProps> = ({
  playerColour,
}) => {
  const aiDifficulty = useSelector(
    (state: RootState) => state.game.aiDifficulty
  )

  const mapColourEnumToNiceString = {
    [Colour.BLACK]: "Black",
    [Colour.RED]: "Red",
  }

  if (aiDifficulty && playerColour === Colour.RED) {
    return <Typography variant="h4">AI's turn</Typography>
  }

  return (
    <Typography variant="h4">
      {mapColourEnumToNiceString[playerColour]}'s turn
    </Typography>
  )
}

export default PlayerTurnIndicator
