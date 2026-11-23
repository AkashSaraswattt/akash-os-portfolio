'use client';
import { useEffect, useState } from 'react';

type Mark = 'X' | 'O';
type Board = (Mark | null)[];
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Result = { winner: Mark; line: number[] } | { winner: 'draw' };
const levels: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const emptyBoard = (): Board => Array.from({ length: 9 }, () => null);
const available = (board: Board) => board.flatMap((mark, index) => mark ? [] : [index]);
const place = (board: Board, square: number, mark: Mark): Board =>
  board.map((cell, index) => index === square ? mark : cell);

function outcome(board: Board): Result | null {
  for (const line of lines) {
    const [a,b,c] = line;
    const winner = board[a];
    if (winner && winner === board[b] && winner === board[c]) return { winner, line };
  }
  return board.every(Boolean) ? { winner: 'draw' } : null;
}

function scoreMove(board: Board, turn: Mark, depth: number): number {
  const result = outcome(board);
  if (result) return result.winner === 'draw' ? 0 : result.winner === 'O' ? 10 - depth : depth - 10;
  const nextTurn = turn === 'O' ? 'X' : 'O';
  const scores = available(board).map(square => scoreMove(place(board, square, turn), nextTurn, depth + 1));
  return turn === 'O' ? Math.max(...scores) : Math.min(...scores);
}

function computerMove(board: Board, difficulty: Difficulty): number {
  const squares = available(board);
  const random = squares[Math.floor(Math.random() * squares.length)];
  if (difficulty === 'Easy') return random;
  if (difficulty === 'Medium') {
    const winningSquare = (mark: Mark) => squares.find(square => outcome(place(board, square, mark))?.winner === mark);
    return winningSquare('O') ?? winningSquare('X') ?? random;
  }
  const scores = squares.map(square => scoreMove(place(board, square, 'O'), 'X', 0));
  return squares[scores.indexOf(Math.max(...scores))];
}

type Match = { board: Board; scores: Record<Mark | 'draw', number> };
function play(match: Match, square: number, mark: Mark): Match {
  const board = place(match.board, square, mark);
  const result = outcome(board);
  const scores = result ? { ...match.scores, [result.winner]: match.scores[result.winner] + 1 } : match.scores;
  return { board, scores };
}

export default function TicTacToe() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [match, setMatch] = useState<Match>(() => ({ board: emptyBoard(), scores: { X: 0, O: 0, draw: 0 } }));
  const { board, scores } = match;
  const result = outcome(board);
  const computerTurn = !result && available(board).length % 2 === 0;

  useEffect(() => {
    if (!computerTurn) return;
    const timer = window.setTimeout(() => {
      const square = computerMove(board, difficulty);
      setMatch(current => current.board === board ? play(current, square, 'O') : current);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [board, computerTurn, difficulty]);

  const message = result?.winner === 'X' ? 'You win!' : result?.winner === 'O' ? 'Computer wins.' :
    result ? 'Draw.' : computerTurn ? 'Computer is thinking…' : 'Your turn. Place an X.';

  return <section className="tic-tac-toe" aria-label="Tic-Tac-Toe game">
    <h2>Tic-Tac-Toe</h2>
    <p>Play as X against the computer.</p>
    <div className="ttt-levels" role="group" aria-label="Difficulty">
      {levels.map(level => <button key={level} type="button" aria-pressed={level === difficulty} onClick={() => setDifficulty(level)}>{level}</button>)}
    </div>
    <div className="ttt-scores" aria-label="Scores"><span>You <strong>{scores.X}</strong></span><span>Draws <strong>{scores.draw}</strong></span><span>Computer <strong>{scores.O}</strong></span></div>
    <p className="ttt-status" role="status">{message}</p>
    <div className="ttt-board" role="group" aria-label="Game board">
      {board.map((mark, square) => <button
        key={square}
        type="button"
        aria-label={`Row ${Math.floor(square / 3) + 1}, column ${square % 3 + 1}, ${mark ?? 'empty'}`}
        aria-disabled={!!mark || !!result || computerTurn}
        data-mark={mark}
        data-winning={!!result && 'line' in result && result.line.includes(square)}
        onClick={() => {
          if (mark || result || computerTurn) return;
          setMatch(current => current.board === board ? play(current, square, 'X') : current);
        }}
      >{mark}</button>)}
    </div>
    <button className="button" type="button" onClick={() => setMatch(current => ({ ...current, board: emptyBoard() }))}>{result ? 'Play again' : 'Restart round'}</button>
  </section>;
}
