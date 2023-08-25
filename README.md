# onitama-ai

## Things to think about

- implement as CLI first then translate to React?
  - easy to manage state that way

### Scoring

- Taking enemy master = max points (win)
- Landing on enemey temple = max points (win)
- move closer = some points
- take pieces = some points (more than above)

- master can be taken = min points (loss)

- use minimax algoirthm

- use only like 3 cards to start with

-

## Things

- Board
  - 5x5 2D grid
  - contains units or not
  - (0,2) and (4,2) are temple squares
- Piece
  - Is master piece or not
- Card
  - Array of moves which any piece can make
- Move
  - A tuple of vertical,horiztonal displacement
