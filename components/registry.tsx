import { Folder, BriefcaseBusiness, ChartNoAxesCombined, Layers3, BadgeCheck, Route, Globe2, Sparkles, FileText, PencilRuler, CalendarDays, Compass, Mail, Files, FlaskConical, Gamepad2, Grid2X2 } from 'lucide-react';
export const apps = [
  { id: 'projects', name: 'Projects', description: 'Things I’ve built', icon: Folder, color: 'violet', art: 0 },
  { id: 'experience', name: 'Experience', description: 'Where I’ve contributed', icon: BriefcaseBusiness, color: 'blue', art: 1 },
  { id: 'stack', name: 'Tech Stack', description: 'Tools of the trade', icon: Layers3, color: 'mint', art: 3 },
  { id: 'cases', name: 'Case Files', description: 'Behind the build', icon: Files, color: 'amber', art: 2 },
  { id: 'about', name: 'Akash.txt', description: 'A little about me', icon: FileText, color: 'pink', art: 2 },
  { id: 'journey', name: 'Journey', description: 'The story so far', icon: Route, color: 'blue', art: 4 },
  { id: 'whiteboard', name: 'Whiteboard', description: 'Room for your ideas', icon: PencilRuler, color: 'mint', art: 5 },
  { id: 'contact', name: 'Contact', description: 'Let’s connect', icon: Mail, color: 'violet', art: 0 },
  { id: 'results', name: 'Results', description: 'Reported impact', icon: ChartNoAxesCombined, color: 'mint', art: 3 },
  { id: 'proof', name: 'Proof', description: 'Sources & certificates', icon: BadgeCheck, color: 'amber', art: 2 },
  { id: 'socials', name: 'Socials', description: 'Elsewhere on the web', icon: Globe2, color: 'blue', art: 4 },
  { id: 'companion', name: 'AI Companion', description: 'Meet your desktop guide', icon: Sparkles, color: 'pink', art: 3 },
  { id: 'calendar', name: 'Calendar', description: 'Time & availability', icon: CalendarDays, color: 'pink', art: 5 },
  { id: 'browser', name: 'Browser', description: 'Explore this workspace', icon: Compass, color: 'blue', art: 4 },
  { id: 'notes', name: 'AI Field Notes', description: 'Engineering, unpacked', icon: FlaskConical, color: 'violet', art: 5 },
  { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', description: 'Play against the computer', icon: Grid2X2, color: 'mint', art: 3 },
  { id: 'game', name: 'Game Room', description: 'A small mental reset', icon: Gamepad2, color: 'mint', art: 1 },
] as const;
export type AppId = typeof apps[number]['id'];
export function AppIcon({ id, small = false }: { id: AppId; small?: boolean }) {
  const app = apps.find(a => a.id === id)!; const Icon = app.icon;
  return <span className={`app-art ${app.color} ${small ? 'small' : ''}`}><img src={`/assets/icons/app-${app.art}.webp`} alt="" width="64" height="64" /><Icon size={small ? 21 : 27} strokeWidth={1.6} className="fallback-glyph" /></span>;
}
