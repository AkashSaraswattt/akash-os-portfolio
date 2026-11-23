'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pause, Play, X, Lightbulb, Braces, Folder, ExternalLink, RotateCcw, EyeOff, MessageCircle } from 'lucide-react';
import { readLocal, writeLocal } from '../lib/storage';
import { companionNotes, type NoteCategory } from '../content/companion-notes';

type Activity = 'idle' | 'greeting' | 'thinking' | 'blinking';
type Panel = 'welcome' | 'menu' | 'note' | null;
type Placement = { x: number; y: number; maxHeight: number };
const welcomeKey = 'akash-os-central-welcome-v1';

export default function CentralCharacter({ onExplore, embedded = false }: { onExplore: () => void; embedded?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLElement>(null);
  const welcomeChecked = useRef(false);
  const welcomeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const focusOnOpen = useRef(false);
  const lastNote = useRef({ insight: -1, fact: -1 });
  const remainingNotes = useRef<Record<NoteCategory, number[]>>({ insight: [], fact: [] });
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [frame, setFrame] = useState(0);
  const [activity, setActivity] = useState<Activity>('idle');
  const [portraitTap, setPortraitTap] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [note, setNote] = useState<{ category: NoteCategory; index: number } | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [layoutVersion, setLayoutVersion] = useState(0);

  useEffect(() => {
    setPaused(readLocal('central-animation-paused', false, (value): value is boolean => typeof value === 'boolean'));
    setHidden(readLocal('central-character-hidden', false, (value): value is boolean => typeof value === 'boolean'));
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
    const updateLayout = () => setLayoutVersion(value => value + 1);
    const closeForApp = () => { if (welcomeTimer.current) clearTimeout(welcomeTimer.current); setPanel(null); };
    updateMotion(); updateVisibility();
    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting), { threshold: .35 });
    if (root.current) observer.observe(root.current);
    media.addEventListener('change', updateMotion); document.addEventListener('visibilitychange', updateVisibility);
    addEventListener('resize', updateLayout); addEventListener('scroll', updateLayout, { passive: true });
    addEventListener('akash-os-open-app', closeForApp);
    return () => { observer.disconnect(); media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); removeEventListener('resize', updateLayout); removeEventListener('scroll', updateLayout); removeEventListener('akash-os-open-app', closeForApp); };
  }, []);

  useEffect(() => {
    if (!inView || hidden || welcomeChecked.current) return;
    welcomeChecked.current = true;
    try {
      if (!sessionStorage.getItem(welcomeKey)) {
        sessionStorage.setItem(welcomeKey, 'shown');
        welcomeTimer.current = setTimeout(() => { setPanel(current => current ?? 'welcome'); setActivity('greeting'); }, 1800);
      }
    } catch { /* Omit automatic greetings if session storage is unavailable. */ }
    return () => { if (welcomeTimer.current) clearTimeout(welcomeTimer.current); };
  }, [inView, hidden]);

  useEffect(() => {
    if (panel !== 'welcome') return;
    const timer = setTimeout(() => setPanel(current => current === 'welcome' ? null : current), 8000);
    return () => clearTimeout(timer);
  }, [panel]);

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    function queue(delay: number, callback: () => void) { const id = setTimeout(() => { timers.delete(id); callback(); }, delay); timers.add(id); }
    function sequence(frames: number[], interval: number, done: () => void, index = 0) {
      setFrame(frames[index]);
      queue(interval, () => index + 1 < frames.length ? sequence(frames, interval, done, index + 1) : done());
    }
    function blinkLater() { queue(7200 + Math.random() * 2200, () => sequence([1, 2, 1, 0], 85, blinkLater)); }
    if (paused || reduced || hidden || !inView || !pageVisible) { setFrame(0); return; }
    if (activity === 'blinking') sequence([1, 2, 1, 0], 85, () => setActivity('idle'));
    else if (activity === 'greeting') sequence([3, 4, 3, 0], 220, () => setActivity('idle'));
    else if (activity === 'thinking') sequence([5, 6, 5, 0], 230, () => setActivity('idle'));
    else { setFrame(0); blinkLater(); }
    return () => timers.forEach(clearTimeout);
  }, [paused, reduced, hidden, inView, pageVisible, activity, portraitTap]);

  useLayoutEffect(() => {
    if (embedded || !panel || !bubble.current || !portrait.current) { setPlacement(null); return; }
    const anchor = portrait.current.getBoundingClientRect();
    const rect = bubble.current.getBoundingClientRect();
    const bar = document.querySelector('.system-bar')?.getBoundingClientRect();
    const dock = document.querySelector('.dock')?.getBoundingClientRect();
    let top = bar && bar.bottom > 0 && bar.top < innerHeight ? Math.max(12, bar.bottom + 10) : 12;
    let bottom = dock ? Math.min(innerHeight - 12, dock.top - 12) : innerHeight - 12;
    // On narrow screens, reserve a clear vertical band for notes and let their
    // content scroll, so a tall bubble cannot cover navigation or contact actions.
    if (innerWidth <= 768) {
      const blocked = Array.from(document.querySelectorAll('.hero-actions,.system-date'))
        .map(el => el.getBoundingClientRect()).filter(r => r.bottom > top && r.top < bottom)
        .sort((a, b) => a.top - b.top);
      const gaps: { top: number; bottom: number }[] = [];
      let cursor = top;
      for (const r of blocked) {
        if (r.top - 10 > cursor) gaps.push({ top: cursor, bottom: r.top - 10 });
        cursor = Math.max(cursor, r.bottom + 10);
      }
      if (cursor < bottom) gaps.push({ top: cursor, bottom });
      const gap = gaps.sort((a, b) => (b.bottom - b.top) - (a.bottom - a.top))[0];
      if (gap && gap.bottom - gap.top >= 140) { top = gap.top; bottom = gap.bottom; }
    }
    const maxHeight = Math.max(100, bottom - top);
    const width = Math.min(rect.width, innerWidth - 24), height = Math.min(rect.height, maxHeight);
    const obstacles = Array.from(document.querySelectorAll('.hero-actions,.system-date,.contact-app .button-row,.email-address,.window-controls')).map(el => el.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight);
    const candidates = [
      { x: anchor.right + 12, y: anchor.top - 15 }, { x: anchor.left - width - 12, y: anchor.top - 15 },
      { x: anchor.left, y: anchor.bottom + 10 }, { x: anchor.left, y: anchor.top - height - 12 },
      { x: innerWidth - width - 12, y: top }, { x: 12, y: top },
      { x: 12, y: bottom - height }, { x: innerWidth - width - 12, y: bottom - height },
    ].map(point => ({ x: Math.max(12, Math.min(innerWidth - width - 12, point.x)), y: Math.max(top, Math.min(bottom - height, point.y)) }));
    function score(point: { x: number; y: number }) {
      const overlap = obstacles.reduce((sum, r) => sum + Math.max(0, Math.min(point.x + width, r.right) - Math.max(point.x, r.left)) * Math.max(0, Math.min(point.y + height, r.bottom) - Math.max(point.y, r.top)), 0);
      return overlap * 100 + Math.hypot(point.x - anchor.right, point.y - anchor.top);
    }
    const best = candidates.reduce((best, point) => score(point) < score(best) ? point : best);
    setPlacement({ ...best, maxHeight });
  }, [panel, note, layoutVersion, embedded]);

  useEffect(() => {
    if (panel && (embedded || placement) && focusOnOpen.current) {
      bubble.current?.querySelector<HTMLButtonElement>('.central-note-actions button')?.focus({ preventScroll: true });
      focusOnOpen.current = false;
    }
  }, [panel, placement, embedded]);

  function cancelWelcome() { if (welcomeTimer.current) clearTimeout(welcomeTimer.current); }
  function dismiss() { cancelWelcome(); setPanel(null); portrait.current?.focus({ preventScroll: true }); }
  function togglePause() { setPaused(value => { writeLocal('central-animation-paused', !value); return !value; }); }
  function hide() { setPanel(null); setHidden(true); writeLocal('central-character-hidden', true); }
  function requestNote(category: NoteCategory) {
    cancelWelcome();
    const unseen = remainingNotes.current[category];
    const remaining = unseen.length ? unseen : companionNotes[category].map((_, index) => index);
    const choices = unseen.length ? unseen : remaining.filter(index => index !== lastNote.current[category]);
    const index = choices[Math.floor(Math.random() * choices.length)];
    remainingNotes.current[category] = remaining.filter(candidate => candidate !== index);
    lastNote.current[category] = index;
    setNote({ category, index });
    setPanel('note'); setActivity('thinking');
  }
  const selected = note ? companionNotes[note.category][note.index] : null;
  const animation = paused || reduced || hidden || !inView || !pageVisible ? 'static' : activity !== 'idle' ? activity : frame === 0 ? 'idle' : 'blinking';

  return <section ref={root} className={`portrait-section central-character${embedded ? ' about-character' : ''}`} aria-label="Interactive coding guide" onKeyDownCapture={event => { if (event.key === 'Escape' && panel) { event.preventDefault(); event.stopPropagation(); dismiss(); } }}>
    <div className="central-card">
      <div className="central-card-header"><span>{embedded ? 'FACTS & INSIGHTS' : 'BETWEEN BUILDS'}</span><button className="central-pause" aria-label={reduced ? 'Reduced motion enabled' : paused ? 'Resume central animation' : 'Pause central animation'} disabled={reduced || hidden} onClick={togglePause}>{paused || reduced ? <Play size={14}/> : <Pause size={14}/>}</button></div>
      {hidden ? <div className="central-hidden"><MessageCircle size={26}/><p>A quieter workspace.</p><button onClick={() => { setHidden(false); writeLocal('central-character-hidden', false); }}>Show coding guide</button></div> : <>
        <button ref={portrait} className="central-portrait-button" aria-label="Open central coding guide" aria-expanded={!!panel} aria-controls="central-coding-notes" title="Click for a tech insight or fun fact" onClick={() => { cancelWelcome(); setActivity('blinking'); setPortraitTap(value => value + 1); focusOnOpen.current = !panel; setPanel(current => current ? null : 'menu'); }} onKeyDown={event => { if (event.key === 'Escape' && panel) { event.stopPropagation(); dismiss(); } }}>
          <span className="central-sprite" role="img" aria-label="Illustrated portrait of Akash Saraswat" data-animation={animation} data-frame={frame} style={{ backgroundPosition: `${frame % 4 * 100 / 3}% ${Math.floor(frame / 4) * 100}%` }}/>
          <span className="central-tap"><MessageCircle size={13}/>A thought, on tap.</span>
        </button>
        <button className="central-open-notes" onClick={() => { cancelWelcome(); focusOnOpen.current = true; setPanel('menu'); }}><Lightbulb size={14}/>Choose a fact or insight</button>
      </>}
      <span className="central-art-disclosure">ILLUSTRATED GUIDE · CURATED NOTES</span>
    </div>
    {panel && !hidden && <aside ref={bubble} id="central-coding-notes" className="central-note-bubble" aria-label="Central character coding notes" style={embedded ? undefined : { left: placement?.x ?? 12, top: placement?.y ?? 70, maxHeight: placement?.maxHeight, visibility: placement ? 'visible' : 'hidden' }} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); dismiss(); } }}>
      <header><span>{panel === 'welcome' ? 'A SMALL HELLO' : panel === 'note' ? note?.category === 'fact' ? 'FUN FACT' : 'TECH INSIGHT' : 'A LITTLE CURIOSITY'}</span><button className="icon-button" aria-label="Dismiss coding notes" onClick={dismiss}><X size={16}/></button></header>
      <div className="central-note-copy" aria-live={panel === 'note' ? 'polite' : 'off'}><p>{panel === 'welcome' ? companionNotes.welcome : panel === 'note' && selected ? selected.text : 'Pick a fun fact or find out how an everyday technology works.'}</p></div>
      {panel === 'note' && selected && <a className="central-note-source" href={selected.url} target="_blank" rel="noopener noreferrer">{selected.source}<ExternalLink size={12}/></a>}
      <div className="central-note-actions"><button onClick={() => requestNote('insight')}><Lightbulb size={15}/>Tech insight</button><button onClick={() => requestNote('fact')}><Braces size={15}/>Fun fact</button><button onClick={() => { setPanel(null); onExplore(); }}><Folder size={15}/>Explore my work</button></div>
      {panel === 'note' && <button className="central-another" onClick={() => requestNote(note?.category ?? 'insight')}><RotateCcw size={13}/>{note?.category === 'fact' ? 'Another fact' : 'Another insight'}</button>}
      <footer><button disabled={reduced} onClick={togglePause}>{paused || reduced ? <Play size={13}/> : <Pause size={13}/>} {reduced ? 'Reduced motion' : paused ? 'Resume animation' : 'Pause animation'}</button><button onClick={hide}><EyeOff size={13}/>Hide</button></footer>
      <span className="central-note-provenance">{companionNotes.provenance}</span>
    </aside>}
  </section>;
}
