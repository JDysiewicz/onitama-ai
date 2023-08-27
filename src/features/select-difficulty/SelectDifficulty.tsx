import { Button, ButtonGroup, Grid, Typography } from "@mui/material"
import { useDispatch } from "react-redux"
import { updateAiDifficulty } from "../../state/reducer"
import { AiDifficulty } from "../../types"

interface SelectDifficultyProps {
  setFirstTimeLoad: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectDifficulty: React.FC<SelectDifficultyProps> = ({
  setFirstTimeLoad,
}) => {
  const dispatch = useDispatch()
  return (
    <Grid container>
      <Grid item xs={4} />
      <Grid container item xs={4}>
        <Grid item xs={12}>
          <Typography variant="h3">AI Difficulty:</Typography>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup variant="contained">
            <Button
              size="medium"
              onClick={() => {
                setFirstTimeLoad(false)
                dispatch(updateAiDifficulty(AiDifficulty.EASY))
              }}
            >
              Easy
            </Button>
            <Button
              size="medium"
              onClick={() => {
                setFirstTimeLoad(false)
                dispatch(updateAiDifficulty(AiDifficulty.MEDIUM))
              }}
            >
              MEDIUM
            </Button>
            <Button
              size="medium"
              onClick={() => {
                setFirstTimeLoad(false)
                dispatch(updateAiDifficulty(AiDifficulty.HARD))
              }}
            >
              HARD
            </Button>
            <Button
              size="medium"
              onClick={() => {
                setFirstTimeLoad(false)
                dispatch(updateAiDifficulty(null))
              }}
            >
              VS PLAYER
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Grid item xs={4} />
    </Grid>
  )
}

export default SelectDifficulty
