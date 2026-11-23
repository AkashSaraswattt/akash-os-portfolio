// Editable local captions for the dock tour. These are UI descriptions, not AI responses.
export const companionPoses = [
  { id: 'idle', label: 'Idle' },
  { id: 'happy', label: 'Happy' },
  { id: 'excited', label: 'Excited' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'sleeping', label: 'Sleeping' },
  { id: 'alert', label: 'Alert' },
  { id: 'dragging', label: 'Dragging' },
  { id: 'celebrating', label: 'Celebrating' },
  { id: 'sad', label: 'Sad' },
  { id: 'flexing', label: 'Biceps flex' },
] as const;
export type CompanionExpression = (typeof companionPoses)[number]['id'];
export const tourExpressions = { rightPause: 'sad', rest: 'sleeping' } as const;
export const companionTour = [
  { id: 'minecraft', expression: 'excited', text: 'Explore my Minecraft portfolio.' },
  { id: 'projects', expression: 'happy', text: 'These are my projects.' },
  { id: 'experience', expression: 'flexing', text: 'Here’s where I’ve worked.' },
  { id: 'stack', expression: 'thinking', text: 'My everyday tools.' },
  { id: 'about', expression: 'happy', text: 'A little about me.' },
  { id: 'whiteboard', expression: 'excited', text: 'You can write here.' },
  { id: 'contact', expression: 'alert', text: 'Let’s get in touch.' },
  { id: 'linkedin', expression: 'happy', text: 'This is my LinkedIn. Let’s connect.' },
  { id: 'github', expression: 'happy', text: 'This is my GitHub.' },
  { id: 'tic-tac-toe', expression: 'excited', text: 'Play Tic-Tac-Toe against the computer.' },
] as const;

export const tourTiming = { caption: 3400, initialDelay: 4500, rightPause: 3000, restAfterReturn: 60_000 } as const;
export function nextTourIndex(index: number, length = companionTour.length): number | null {
  return index + 1 < length ? index + 1 : null;
}
