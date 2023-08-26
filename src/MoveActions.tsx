import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { availableMoves } from "./cli/make-move"
import { Coordindates, GameState, Move, MoveCard } from "./types"
import { updateMovePreviewCoords } from "./state/reducer"
import { Button, ButtonGroup } from "@mui/material"
import { useEffect, useState } from "react"

interface MoveActionsProps {
  card: MoveCard
  handleMove: (
    move: Move,
    card: MoveCard,
    gameState: GameState,
    selectedUnitCoords: Coordindates
  ) => void
}

const useGetValidCardMoves = (
  gameState: GameState | null,
  selectedUnitCoords: Coordindates | null
) => {
  const [cardsWithValidMoves, setCardsWithValidMoves] = useState<MoveCard[]>([])

  useEffect(() => {
    if (selectedUnitCoords != null && gameState != null) {
      // Check what moves on the card can be played
      const validMoveCards = selectedUnitCoords
        ? availableMoves(gameState, selectedUnitCoords)
        : []
      setCardsWithValidMoves(validMoveCards)
    }
  }, [selectedUnitCoords, gameState])

  return cardsWithValidMoves
}

const MoveActions: React.FC<MoveActionsProps> = ({ card, handleMove }) => {
  const gameState = useSelector((state: RootState) => state.game.gameState)
  const selectedUnitCoords = useSelector(
    (state: RootState) => state.game.selectedUnitCoords
  )
  const dispatch = useDispatch()
  const validCardMoves = useGetValidCardMoves(gameState, selectedUnitCoords)

  if (!gameState) {
    return null
  }

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
      {card.moves.map((move) => {
        const cardWithValidMoves = validCardMoves.find(
          (c) => c.name === card.name
        )

        // A move is valid if it exists in the list of validated moves
        // from the pre-filtered movelist which checks if each move is valid.
        const isMoveValid =
          cardWithValidMoves &&
          cardWithValidMoves.moves.find(
            (validMove) => validMove[0] === move[0] && validMove[1] === move[1]
          )

        const isPlayersCard = gameState.players[gameState.currentTurn].moveCards
          .map((card) => card.name)
          .includes(card.name)

        const isDisabled = !isMoveValid || !isPlayersCard

        return (
          <Button
            key={`${card.name}-${move[0]}-${move[1]}`}
            size="small"
            variant="contained"
            disabled={isDisabled}
            onClick={
              selectedUnitCoords
                ? () => handleMove(move, card, gameState, selectedUnitCoords)
                : () => {}
            }
            onMouseOver={() => movePreview(move, selectedUnitCoords)}
            onMouseOut={() => dispatch(updateMovePreviewCoords(null))}
          >
            {move.join(",")}
          </Button>
        )
      })}
    </ButtonGroup>
  )
}

export default MoveActions
