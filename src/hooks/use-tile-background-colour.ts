import { useSelector } from "react-redux"
import { RootState } from "../store"
import { Colour, Tile } from "../types"
import { useEffect, useState } from "react"
import { coordinatesMatch } from "../utils"

export const useTileBackgroundColour = (tile: Tile) => {
  const selectedUnitCoords = useSelector(
    (state: RootState) => state.game.selectedUnitCoords
  )
  const movePreviewCoords = useSelector(
    (state: RootState) => state.game.movePreviewCoords
  )

  const mapPlayerColourToOccupiedColour = {
    [Colour.BLACK]: "#d3d3d3",
    [Colour.RED]: "#AA0000",
  }

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
      setBackgroundColour("#90EE90")
    } else if (tileIsHighlighted) {
      setBackgroundColour("#FFFF00")
    } else if (tile.occupied) {
      setBackgroundColour(mapPlayerColourToOccupiedColour[tile.occupied.colour])
    } else {
      setBackgroundColour("#FFFFFF")
    }
  }, [selectedUnitCoords, movePreviewCoords, tile])

  return backgroundColour
}
