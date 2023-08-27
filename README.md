# onitama-ai

An implementation of the board game [_Onitama_](https://boardgamegeek.com/boardgame/160477/onitama), featuring an AI based on the [Minimax](https://en.wikipedia.org/wiki/Minimax) algorithm.

## How to Play

Onitama is a perfect-information game which is fairly simple. 5 movement cards are chosen at random, with 2 being given to each player (face-up so both players can see), and the final card being left on the table. Each card will have a depiction of the various moves that can be made by any piece on the board. Landing on an opponents piece will capture it, and you cannot move onto tiles already occupied by friendly squares.

Upon moving, the card used to play the move is placed in the center of the table, and the player picks up the card which was already in the center (replacing the card that was just used).

Each player takes it in turns to make a move, until a player wins.

## Win conditions

In _Onitama_, there are two win conditions which can be used:

- Reach your opponent's temple with your master.
- Capture your opponent's master.

While the first win condition is supported, it is currently disabled while working on a nicer scoring mechanism (see below). Optimising for the temple-capture win condition led to boring games otherwise.

## Playing against the AI

To play against the AI, choose the AI difficulty when prompted on first loading the page (or, choose _vs player_ to play against someone locally). The AI will always be the _red_ pieces, meaning the player always goes first.

## Scoring

The Minimax algorithm will only be as good as the scoring mechanism used to evaluate a game-state. For this project, a very rudamentry scoring system was used. Points are allocated for:

- Capturing pieces.
- Controlling the center of the board.
- Capturing your opponent's master.

This does not do justice to the complexity that this game can have; for example, there is nothing in the scoring about advantagous positions which can threaten multiple units, or adjustments based on the cards in-play. However, it is sufficient to demonstrate a working AI (and to lose to it often).

## Known issues

There is currently a potential issue wherein a player cannot move based on the cards they have available. This is very rare though as it relies on a very particular hand to be drawn.

## Tech

This project is built almost-completely in TypeScript, using React (via _Vite_) for the UI. The game engine itself is written in TypeScript too, however currently only runs in tandem with the UI (i.e. there is no CLI version which uses the game engine).
