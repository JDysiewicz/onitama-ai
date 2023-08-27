import { useSelector } from "react-redux"
import { RootState } from "../state/store"
import { Colour, Tile } from "../types"
import { useEffect, useState } from "react"
import { coordinatesMatch } from "../utils/utils"

export const useTileBackgroundColour = (tile: Tile) => {
  const selectedUnitCoords = useSelector(
    (state: RootState) => state.game.selectedUnitCoords
  )
  const movePreviewCoords = useSelector(
    (state: RootState) => state.game.movePreviewCoords
  )

  const [backgroundColour, setBackgroundColour] = useState("#FFFFFF")

  useEffect(() => {
    const mapPlayerColourToOccupiedColour = {
      [Colour.BLACK]: "#0A090380",
      [Colour.RED]: "#FF000080",
    }

    const tileIsSelected = coordinatesMatch(
      selectedUnitCoords ?? [100, 100],
      tile.position
    )
    const tileIsHighlighted = coordinatesMatch(
      movePreviewCoords ?? [100, 100],
      tile.position
    )

    if (tileIsSelected) {
      setBackgroundColour("#0A0903")
    } else if (tileIsHighlighted) {
      setBackgroundColour("#FF8200")
    } else if (tile.occupied) {
      setBackgroundColour(mapPlayerColourToOccupiedColour[tile.occupied.colour])
    } else {
      setBackgroundColour("#FFEAAE")
    }
  }, [selectedUnitCoords, movePreviewCoords, tile])

  return backgroundColour
}
