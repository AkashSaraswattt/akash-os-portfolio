'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { advanceSnake, BOARD_SIZE, canTurn, newRound, sameCell, type Direction } from '../lib/snake';
import { readLocal, writeLocal } from '../lib/storage';

export default function SnakeGame({ active }: { active: boolean }) {
  const [game, setGame] = useState(newRound);
  const [speed, setSpeed] = useState(190);
  const [best, setBest] = useState(0);
  const board = useRef<HTMLDivElement>(null);
  const pending = useRef<Direction | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => setBest(readLocal('snake-best', 0, (v): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0)), []);
  useEffect(() => { if (game.score > best) { setBest(game.score); writeLocal('snake-best', game.score); } }, [game.score, best]);
  useEffect(() => {
    const pause = () => { pending.current = null; setGame(current => current.status === 'running' ? { ...current, status: 'paused' } : current); };
    const visibility = () => { if (document.hidden) pause(); };
    if (!active) pause();
    window.addEventListener('blur', pause); document.addEventListener('visibilitychange', visibility);
    return () => { window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility); };
  }, [active]);
  useEffect(() => {
    if (!active || game.status !== 'running') return;
    const timer = setInterval(() => { const requested = pending.current; pending.current = null; setGame(current => advanceSnake(current, requested ?? current.direction)); }, speed);
    return () => clearInterval(timer);
  }, [active, game.status, speed]);
  function turn(direction: Direction) { if (game.status === 'running' && direction !== game.direction && pending.current === null && canTurn(game.direction, direction)) pending.current = direction; board.current?.focus({ preventScroll: true }); }
  function toggle() {
    pending.current = null;
    setGame(current => current.status === 'over' || current.status === 'won' ? { ...newRound(), status: 'running' } : { ...current, status: current.status === 'running' ? 'paused' : 'running' });
    board.current?.focus({ preventScroll: true });
  }
  function restart() { pending.current = null; setGame(newRound()); board.current?.focus({ preventScroll: true }); }
  const messages = { ready: 'Ready to compile?', running: 'Build running. Collect the next code token.', paused: 'Build paused. Resume when you’re ready.', over: 'Build stopped. Try another run.', won: 'Perfect build. You filled the board!' };
  return <div className="snake-game">
    <div className="eyebrow">A TINY ARCADE BREAK</div><h2>Byte Snake.</h2><p>Collect <strong>{'{}'}</strong> code tokens. Avoid walls and your own trail.</p>
    <div className="snake-toolbar"><div className="snake-scores"><span>Score <strong>{game.score}</strong></span><span>Best <strong>{best}</strong></span></div><label>Speed <select aria-label="Snake speed" value={speed} disabled={game.status === 'running'} onChange={e => setSpeed(Number(e.target.value))}><option value={190}>Relaxed</option><option value={125}>Classic</option></select></label></div>
    <div className="snake-actions"><button className="button primary" onClick={toggle}>{game.status === 'running' ? <Pause size={16}/> : <Play size={16}/>} {game.status === 'ready' ? 'Start game' : game.status === 'running' ? 'Pause game' : game.status === 'paused' ? 'Resume game' : 'Play again'}</button><button className="button" onClick={restart}><RotateCcw size={16}/>Reset game</button></div>
    <div className="snake-playfield">
    <div ref={board} className="snake-board" tabIndex={0} role="group" aria-label="Byte Snake game board" aria-describedby="snake-controls" data-status={game.status} data-head={`${game.body[0].x},${game.body[0].y}`} onKeyDown={event => {
      const keys: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
      const direction = keys[event.key] ?? keys[event.key.toLowerCase()];
      if (direction) { event.preventDefault(); turn(direction); }
      if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); toggle(); }
    }} onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; board.current?.focus({ preventScroll: true }); swipe.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={event => {
      const start = swipe.current; swipe.current = null; if (!start) return;
      const dx = event.clientX - start.x, dy = event.clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
      turn(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
    }} onPointerCancel={() => { swipe.current = null; }}>
      <div className="snake-cells" aria-hidden="true">{Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
        const cell = { x: i % BOARD_SIZE, y: Math.floor(i / BOARD_SIZE) }, segment = game.body.findIndex(part => sameCell(part, cell)), food = game.food && sameCell(game.food, cell);
        return <span key={i} className={segment === 0 ? 'snake-head' : segment > 0 ? 'snake-body' : food ? 'snake-food' : ''}>{food ? '{}' : segment === 0 ? '··' : ''}</span>;
      })}</div>
      {game.status !== 'running' && <div className="snake-overlay"><strong>{messages[game.status]}</strong><span>{game.status === 'ready' ? 'Press Start or Enter' : game.status === 'paused' ? 'Press Resume or Space' : `Score: ${game.score} · Ready for a fresh run?`}</span></div>}
    </div>
    <div className="snake-dpad" role="group" aria-label="Snake direction controls">{([{ direction: 'up', Icon: ArrowUp }, { direction: 'left', Icon: ArrowLeft }, { direction: 'down', Icon: ArrowDown }, { direction: 'right', Icon: ArrowRight }] as const).map(({ direction, Icon }) => <button key={direction} className={`direction-${direction}`} aria-label={`Move snake ${direction}`} disabled={game.status !== 'running'} onClick={() => turn(direction)}><Icon size={22}/></button>)}</div>
    </div>
    <p className="snake-status" role="status">{messages[game.status]} {game.score > 0 ? `${game.score / 10} tokens collected.` : ''}</p>
    <p id="snake-controls" className="snake-help">Arrow keys or WASD to steer · Space to pause · Swipe the board or use the direction buttons on your phone. Pauses when you switch windows.</p>
  </div>;
}
