'use client';
import { ChevronDown } from 'lucide-react';
import { experience, type CompanyId } from '../content/portfolio';

export const careerPath = [...experience].reverse();
const homepageCareerPath = careerPath.filter(entry => entry.id !== 'freelance' && entry.id !== 'vm-agro');

export function CompanyLogo({ id, size = 'normal' }: { id: CompanyId; size?: 'normal' | 'large' }) {
  const company = experience.find(entry => entry.id === id)!;
  return <span className={`company-app-icon ${id} ${size}`}>{company.logo ? <img src={company.logo} alt="" width={64} height={64}/> : <span aria-hidden="true">{company.mark}</span>}</span>;
}
export default function CareerPath({ onSelect, selected }: { onSelect: (id: CompanyId | null) => void; selected: CompanyId | null }) {
  return <section className="career-flow" aria-label="Career path">
    <h2>Experience</h2>
    <ol aria-label="Companies ordered by start date">{homepageCareerPath.map((entry,index)=><li key={entry.id}>
      <button className={`career-node ${selected === entry.id ? 'selected' : ''}`} aria-label={`Open ${entry.company} experience`} onClick={()=>onSelect(entry.id)}>
        <CompanyLogo id={entry.id}/><span className="career-node-copy"><strong>{entry.company}</strong><span className="career-node-role">{entry.role}</span><span className="career-node-date">{entry.date} · {entry.mode}</span></span>
      </button>
      {index<homepageCareerPath.length-1&&<span className="career-connector" aria-hidden="true"><ChevronDown size={12}/></span>}
    </li>)}</ol>
    <button className="career-overview" onClick={()=>onSelect(null)}>View experience</button>
  </section>;
}
