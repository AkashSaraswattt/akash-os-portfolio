'use client';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { X, Pause, Play } from 'lucide-react';
import { readLocal, writeLocal } from '../lib/storage';
import { companionTour, nextTourIndex, tourTiming, tourExpressions, type CompanionExpression } from '../content/companion-tour';

type Point = { x: number; y: number };
type TourPhase = 'tour' | 'exiting' | 'descending' | 'right-pause' | 'returning' | 'rest';

export default function DraggableCompanion({ state = 'idle', onOpen, onHide, focusOnMount = false }: { focusOnMount?: boolean; state?: CompanionExpression; onOpen: () => void; onHide: () => void }) {
  const element = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; grabX: number; grabY: number; startX: number; startY: number; moved: boolean } | null>(null);
  const latest = useRef<Point>({ x: 24, y: 0 });
  const ignoreClick = useRef(false);
  const focusPending = useRef(focusOnMount);
  const [position, setPosition] = useState<Point | null>(null);
  const [holding, setHolding] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [roamingPaused, setRoamingPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);
  const [viewport, setViewport] = useState(0);
  const [motion, setMotion] = useState<'idle' | 'walking' | 'climbing'>('idle');
  const platform = useRef(false);
  const tourStarted = useRef(false);
  const tourCursor = useRef({index:0,arrived:false});
  const phase = useRef<TourPhase>('tour');
  const waitUntil = useRef(0);
  const [tourPhase, setTourPhase] = useState<TourPhase>('tour');
  const bubble = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState<{id:string;text:string}|null>(null);
  const [stopExpression, setStopExpression] = useState<CompanionExpression | null>(null);
  const [bubbleLeft, setBubbleLeft] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  function trackY(onPlatform = platform.current) {
    const rect = element.current?.getBoundingClientRect();
    const dock = document.querySelector('.dock');
    const dockRect = dock?.getBoundingClientRect();
    const lift = dock ? new DOMMatrixReadOnly(getComputedStyle(dock).transform).m42 : 0;
    const characterHeight = element.current?.querySelector<HTMLElement>('.companion-character')?.offsetHeight || 115;
    return Math.max(0, dockRect ? (onPlatform ? dockRect.top - lift - characterHeight : dockRect.bottom - lift - (rect?.height || 130)) : innerHeight - 48 - (rect?.height || 130));
  }
  function clamp(point: Point): Point {
    const width = element.current?.getBoundingClientRect().width || 90;
    return { x: Math.max(0, Math.min(innerWidth - width, point.x)), y: trackY() };
  }
  function place(point: Point, persist = false) {
    const next = clamp(point); latest.current = next; setPosition(next);
    if (persist) writeLocal('companion', next);
  }
  useEffect(() => {
    // Each visit starts a fresh tour from the left, regardless of the last drag position.
    place({ x: 16, y: trackY(false) }, true);
    setRoamingPaused(readLocal('companion-roaming-paused', false, (value): value is boolean => typeof value === 'boolean'));
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion(); updateVisibility();
    const resize = () => { place(latest.current, true); setViewport(value => value + 1); };
    media.addEventListener('change', updateMotion); document.addEventListener('visibilitychange', updateVisibility);
    addEventListener('resize', resize);
    return () => { removeEventListener('resize', resize); media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);

  useEffect(() => {
    if (position && focusPending.current) {
      focusPending.current = false;
      element.current?.querySelector<HTMLButtonElement>('.companion-character')?.focus({ preventScroll: true });
    }
  }, [position]);

  useLayoutEffect(() => {
    if (!note || !bubble.current || !element.current) return;
    const width = bubble.current.offsetWidth, petWidth = element.current.offsetWidth;
    const left = Math.max(12 - latest.current.x, Math.min(innerWidth - 12 - width - latest.current.x, (petWidth - width) / 2));
    setBubbleLeft(left);
  }, [note, position, viewport]);

  useEffect(() => {
    // Capture the current animation position before React updates hover/pause state.
    setPosition({ ...latest.current });
    setMotion('idle');
    if (state !== 'idle' || holding || hovered || focused || roamingPaused || reduced || !visible) return;
    let frame = 0, timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    function schedule(callback: () => void, delay: number) { timer = setTimeout(callback, delay); }
    function draw(point: Point) {
      if (!element.current) return;
      latest.current = point;
      element.current.style.setProperty('--companion-x', `${point.x}px`);
      element.current.style.setProperty('--companion-y', `${point.y}px`);
    }
    function animate(destination: Point, climbing: boolean, done: () => void) {
      const start = { ...latest.current };
      const distance = Math.abs(destination.x - start.x);
      setDirection(destination.x >= start.x ? 'right' : 'left');
      setMotion(climbing ? 'climbing' : 'walking');
      const duration = climbing ? 1100 : Math.max(500, distance / 95 * 1000);
      const started = performance.now();
      function step(now: number) {
        if (cancelled || !element.current) return;
        const p = Math.min(1, (now - started) / duration);
        const ease = p * p * (3 - 2 * p);
        let point: Point;
        if (climbing) {
          // Two small steps onto the dock, confined to its height.
          const phase = p * 4, midX = (start.x + destination.x) / 2, midY = (start.y + destination.y) / 2;
          const part = Math.min(1, phase % 1), e = part * part * (3 - 2 * part);
          point = phase < 1 ? {x:start.x+(midX-start.x)*e,y:start.y} : phase < 2 ? {x:midX,y:start.y+(midY-start.y)*e} : phase < 3 ? {x:midX+(destination.x-midX)*e,y:midY} : {x:destination.x,y:midY+(destination.y-midY)*e};
          if (p === 1) point = destination;
        } else point = { x: start.x + (destination.x - start.x) * ease, y: destination.y };
        draw(point);
        if (p < 1) frame = requestAnimationFrame(step);
        else { setPosition(destination); writeLocal('companion', destination); done(); }
      }
      frame = requestAnimationFrame(step);
    }
    function changePhase(next: TourPhase) { phase.current=next;setTourPhase(next); }
    function clearCaption() {
      setNote(null);setStopExpression(null);document.querySelectorAll('[data-companion-active]').forEach(el=>el.removeAttribute('data-companion-active'));
    }
    function returnBehind() {
      changePhase('returning');platform.current=false;clearCaption();
      animate(clamp({x:16,y:trackY(false)}),false,()=>{
        place({x:16,y:trackY(false)},true);setMotion('idle');changePhase('rest');
        waitUntil.current=performance.now()+tourTiming.restAfterReturn;
        schedule(visit,tourTiming.restAfterReturn);
      });
    }
    function descend() {
      changePhase('descending');
      const point={x:latest.current.x,y:trackY(false)};
      animate(point,true,()=>{
        platform.current=false;place(point,true);setMotion('idle');changePhase('right-pause');
        waitUntil.current=performance.now()+tourTiming.rightPause;schedule(visit,tourTiming.rightPause);
      });
    }
    function exitRight() {
      changePhase('exiting');clearCaption();
      const edge=document.querySelector('.dock-cluster')?.getBoundingClientRect().right ?? innerWidth-100;
      const width=element.current?.offsetWidth||90;
      animate({x:Math.max(0,Math.min(innerWidth-width,edge+8)),y:trackY(true)},false,descend);
    }
    function visit() {
      if (cancelled || !element.current) return;
      tourStarted.current = true;
      const hasDock = !!document.querySelector('.dock');
      if (!hasDock) {
        const maxX = Math.max(0, innerWidth - element.current.offsetWidth), goRight = latest.current.x < maxX / 2;
        animate(clamp({x:goRight?maxX*.9:maxX*.1,y:trackY()}),false,()=>{setMotion('idle');schedule(visit,3000);});
        return;
      }
      if(phase.current==='rest') {
        const remaining=waitUntil.current-performance.now();
        if(remaining>0){schedule(visit,remaining);return;}
        changePhase('tour');tourCursor.current={index:0,arrived:false};
      }
      if(phase.current==='right-pause') {
        const remaining=waitUntil.current-performance.now();
        if(remaining>0){schedule(visit,remaining);return;}
        returnBehind();return;
      }
      if(phase.current==='returning'){returnBehind();return;}
      if(phase.current==='descending'){descend();return;}
      if(phase.current==='exiting'){exitRight();return;}
      const cursor = tourCursor.current;
      if(cursor.arrived){
        const next=nextTourIndex(cursor.index);
        if(next===null){exitRight();return;}
        cursor.index=next;cursor.arrived=false;
      }
      const stop = companionTour[cursor.index];
      const target = document.querySelector<HTMLElement>(`[data-tour-stop="${stop.id}"]`);
      if (!target || target.offsetWidth === 0) { cursor.arrived=true; schedule(visit,100); return; }
      setNote(null);setStopExpression(null);
      document.querySelectorAll('[data-companion-active]').forEach(el=>el.removeAttribute('data-companion-active'));
      const dock = target.closest<HTMLElement>('.dock');
      if (dock && dock.scrollWidth > dock.clientWidth) {
        const r=target.getBoundingClientRect(), d=dock.getBoundingClientRect();
        if(r.left<d.left+8||r.right>d.right-8) dock.scrollLeft += r.left+r.width/2-d.left-d.width/2;
      }
      const r=target.getBoundingClientRect(), width=element.current.offsetWidth;
      const destination={x:Math.max(0,Math.min(innerWidth-width,r.left+r.width/2-width/2)),y:trackY(true)};
      const arrive=()=>{
        if(cancelled)return;
        platform.current=true;place(destination,true);setMotion('idle');cursor.arrived=true;
        setNote(stop);setStopExpression(stop.expression);target.setAttribute('data-companion-active','true');
        schedule(visit, tourTiming.caption);
      };
      if (!platform.current) {
        const entry=document.querySelector(`[data-tour-stop="${companionTour[0].id}"]`)?.getBoundingClientRect();
        const approach=clamp({x:Math.max(0,(entry?.left??destination.x)-width+8),y:trackY(false)});
        animate(approach,false,()=>animate(destination,true,arrive));
      } else animate(destination,false,arrive);
    }
    schedule(visit, tourStarted.current ? 0 : tourTiming.initialDelay);
    return () => { cancelled=true;clearTimeout(timer);cancelAnimationFrame(frame);writeLocal('companion',latest.current);document.querySelectorAll('[data-companion-active]').forEach(el=>el.removeAttribute('data-companion-active')); };
  }, [state, holding, hovered, focused, roamingPaused, reduced, visible, viewport]);

  function finish(pointerId: number) {
    const active = drag.current;
    if (!active || active.pointerId !== pointerId) return;
    ignoreClick.current = active.moved;
    writeLocal('companion', latest.current);
    drag.current = null; setHolding(false);
  }

  const automaticExpression = tourPhase === 'rest' ? tourExpressions.rest : tourPhase === 'right-pause' ? tourExpressions.rightPause : stopExpression ?? 'idle';
  const expression = holding ? 'dragging' : state !== 'idle' ? state : automaticExpression;

  return <div ref={element} className={`desktop-companion free-companion state-${holding ? 'dragging' : state} ${holding ? 'is-dragging' : ''}`} data-roaming={roamingPaused || reduced ? 'paused' : motion} data-direction={direction} data-tour-stop-active={note?.id} data-platform={platform.current} data-tour-phase={tourPhase} data-expression={expression} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={event => setFocused((event.target as HTMLElement).matches(':focus-visible'))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }} style={{ '--companion-x': `${position?.x ?? 24}px`, '--companion-y': `${position?.y ?? 0}px`, visibility: position ? 'visible' : 'hidden' } as CSSProperties}>
    {note && <div ref={bubble} className="companion-tour-bubble" role="note" aria-label="Dock tour tip" style={{left:bubbleLeft}}><span>{note.text}</span><button aria-label="Dismiss tour tip" onClick={()=>{setNote(null);element.current?.querySelector<HTMLButtonElement>('.companion-character')?.focus({preventScroll:true});}}><X size={12}/></button></div>}
    <button className="companion-roam-toggle" aria-label={reduced ? 'Reduced motion: roaming off' : roamingPaused ? 'Resume companion roaming' : 'Pause companion roaming'} disabled={reduced} onClick={() => { setRoamingPaused(value => { writeLocal('companion-roaming-paused', !value); return !value; }); }}>{roamingPaused || reduced ? <Play size={12}/> : <Pause size={12}/>}</button>
    <button className="companion-hide" aria-label="Hide companion" onClick={() => { onHide(); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.companion-restore')?.focus({ preventScroll: true })); }}><X size={12}/></button>
    <button className="companion-character" aria-label="Open AI Companion" title="I tour the dock. Hover or pause to stop; drag left or right. X minimizes me." onClick={() => { if (!ignoreClick.current) onOpen(); }}
      onPointerDown={event => {
        if (event.button !== 0 || !event.isPrimary) return;
        const rect = element.current!.getBoundingClientRect();
        ignoreClick.current = false;
        drag.current = { pointerId: event.pointerId, grabX: event.clientX - rect.left, grabY: event.clientY - rect.top, startX: event.clientX, startY: event.clientY, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId); setHolding(true);
      }}
      onPointerMove={event => {
        const active = drag.current;
        if (!active || active.pointerId !== event.pointerId) return;
        if (Math.hypot(event.clientX - active.startX, event.clientY - active.startY) > 3) active.moved = true;
        if (active.moved) { event.preventDefault(); place({ x: event.clientX - active.grabX, y: event.clientY - active.grabY }); }
      }}
      onPointerUp={event => finish(event.pointerId)} onPointerCancel={event => finish(event.pointerId)} onLostPointerCapture={event => finish(event.pointerId)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') ignoreClick.current = false;
        const directions: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
        const direction = directions[event.key];
        if (direction) { event.preventDefault(); const step = event.shiftKey ? 40 : 10; place({ x: latest.current.x + direction.x * step, y: latest.current.y + direction.y * step }, true); }
      }}>
      <span className="companion-walk-sprite" aria-hidden="true"/>
      {expression === 'sleeping' && <>
        <span className="companion-cloud" aria-hidden="true"/>
        <span className="companion-snores" aria-hidden="true"><span>Z</span><span>Z</span><span>Z</span></span>
      </>}
      <img draggable={false} onDragStart={event => event.preventDefault()} src={`/assets/avatar/${expression}.webp`} alt="" width={80} height={115}/>
    </button>
  </div>;
}
