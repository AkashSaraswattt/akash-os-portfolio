export const BOARD_SIZE = 18;
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Cell = { x: number; y: number };
export type SnakeState = { body: Cell[]; direction: Direction; food: Cell | null; score: number; status: 'ready' | 'running' | 'paused' | 'over' | 'won' };
const vectors = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
export const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
export function canTurn(from: Direction, to: Direction) { return vectors[from].x + vectors[to].x !== 0 || vectors[from].y + vectors[to].y !== 0; }
export function spawnFood(body: Cell[], random = Math.random): Cell | null {
  const free: Cell[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) for (let x = 0; x < BOARD_SIZE; x++) if (!body.some(cell => sameCell(cell, { x, y }))) free.push({ x, y });
  return free.length ? free[Math.floor(random() * free.length)] : null;
}
export function newRound(): SnakeState { return { body: [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }], direction: 'right', food: { x: 9, y: 8 }, score: 0, status: 'ready' }; }
export function advanceSnake(state: SnakeState, requested: Direction = state.direction, random = Math.random): SnakeState {
  if (state.status !== 'running') return state;
  const direction = canTurn(state.direction, requested) ? requested : state.direction;
  const v = vectors[direction], head = { x: state.body[0].x + v.x, y: state.body[0].y + v.y };
  const eats = state.food !== null && sameCell(head, state.food);
  const obstacle = eats ? state.body : state.body.slice(0, -1);
  if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || obstacle.some(cell => sameCell(cell, head))) return { ...state, direction, status: 'over' };
  const body = [head, ...state.body]; if (!eats) body.pop();
  const food = eats ? spawnFood(body, random) : state.food;
  return { body, direction, food, score: state.score + (eats ? 10 : 0), status: food ? 'running' : 'won' };
}
