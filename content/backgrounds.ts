export const backgrounds = [
  { id: 'city', label: 'City', description: 'Cinematic skyline · sideways drift' },
  { id: 'aurora', label: 'Aurora', description: 'Soft veils · navy blue glow' },
  { id: 'ambient', label: 'Ambient Light', description: 'Gentle light fields · minimal detail' },
  { id: 'binary', label: 'Binary Rain', description: 'Falling 0s and 1s · hacker-inspired' },
  { id: 'circuit', label: 'Circuit Flow', description: 'Fine traces · travelling signals' },
] as const;
export type BackgroundMode = typeof backgrounds[number]['id'];
export function isBackgroundMode(value: unknown): value is BackgroundMode { return backgrounds.some(mode => mode.id === value); }
