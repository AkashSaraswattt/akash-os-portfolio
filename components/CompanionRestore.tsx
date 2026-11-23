'use client';
import { writeLocal } from '../lib/storage';

export default function CompanionRestore({ onRestore }: { onRestore: () => void }) {
  return <button className="companion-restore" aria-label="Restore little me" title="Bring little me back" onClick={() => {
    writeLocal('companion', { x: 16, y: Math.max(64, innerHeight - 230) });
    writeLocal('companion-hidden', false);
    onRestore();
  }}><img src="/assets/avatar/happy.webp" alt="" width={44} height={64}/><span className="companion-restore-label">Bring me back</span></button>;
}
