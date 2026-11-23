export function readLocal<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  try { const value: unknown = JSON.parse(localStorage.getItem(`akash-os-${key}-v1`) || 'null'); return validate(value) ? value : fallback; } catch { return fallback; }
}
export function writeLocal(key: string, value: unknown) { try { localStorage.setItem(`akash-os-${key}-v1`, JSON.stringify(value)); } catch { /* Private mode / quota: retain current session state. */ } }
export function clearLocal() { try { Object.keys(localStorage).filter(key => key.startsWith('akash-os-')).forEach(key => localStorage.removeItem(key)); } catch { /* Storage may be unavailable. */ } }
