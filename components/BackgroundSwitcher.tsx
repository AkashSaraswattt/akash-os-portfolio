'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Palette } from 'lucide-react';
import { backgrounds, type BackgroundMode } from '../content/backgrounds';

export default function BackgroundSwitcher({ mode, onChange }: { mode: BackgroundMode; onChange: (mode: BackgroundMode) => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const selected = backgrounds.find(option => option.id === mode)!;
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  function dismiss() { setOpen(false); trigger.current?.focus({ preventScroll: true }); }
  return <div ref={root} className="background-switcher" onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
    <button ref={trigger} className="background-selector" aria-label={`Background: ${selected.label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? 'background-menu' : undefined} onClick={() => setOpen(value => !value)} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); } }}><Palette size={14}/><span>{selected.label}</span><ChevronDown size={12}/></button>
    {open && <div id="background-menu" className="background-menu" role="menu" aria-label="Choose background" onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); dismiss(); }
      if (event.key === 'Tab') { event.preventDefault(); dismiss(); if (!event.shiftKey) root.current?.closest('.workspace-actions')?.querySelector<HTMLButtonElement>('.background-motion-toggle:not(:disabled),.workspace-info')?.focus({preventScroll:true}); return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { dismiss(); return; }
      const items = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')], current = items.indexOf(document.activeElement as HTMLButtonElement);
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (current + 1) % items.length : event.key === 'ArrowUp' ? (current - 1 + items.length) % items.length : -1;
      if (index >= 0) { event.preventDefault(); items[index]?.focus({ preventScroll: true }); }
    }}>
      {backgrounds.map(option => <button key={option.id} role="menuitemradio" aria-checked={mode === option.id} aria-label={option.label} onClick={() => { onChange(option.id); dismiss(); }}><span className={`background-swatch swatch-${option.id}`} aria-hidden="true"/><span><strong>{option.label}</strong><small>{option.description}</small></span>{mode === option.id && <Check size={16} aria-hidden="true"/>}</button>)}
    </div>}
  </div>;
}
