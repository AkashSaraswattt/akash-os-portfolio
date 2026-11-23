'use client';
import { useEffect, useRef } from 'react';
import { BriefcaseBusiness, ChevronLeft, ChevronRight, ExternalLink, Layers3 } from 'lucide-react';
import { experience, type CompanyId, type ExperienceEntry } from '../content/portfolio';
import { CompanyLogo, careerPath } from './CareerPath';

function RoleDetails({ entry }: { entry: ExperienceEntry }) {
  return <article className="role-detail" aria-label={`${entry.company} role details`}>
    <header className="role-detail-header"><CompanyLogo id={entry.id} size="large"/><div><span className="eyebrow">{entry.date} · {entry.mode}</span><h2>{entry.company}</h2><p className="role-title">{entry.role}</p></div></header>
    <div className="role-focus"><BriefcaseBusiness size={19}/><div><span className="eyebrow">WHAT I WORKED ON</span><p>{entry.focus}</p></div></div>
    <h3>Role & responsibilities</h3><ul className="contribution-list">{entry.points.map(point=><li key={point}>{point}</li>)}</ul>
    <h3 className="role-tools-heading"><Layers3 size={18}/>Tech stack & tools</h3><div className="tags role-tools">{entry.tools.map(tool=><span key={tool}>{tool}</span>)}</div>
    <p className="disclosure">Role, responsibilities, and tools are based on the supplied resumes.</p>
  </article>;
}
export default function ExperienceApp({ selected, onSelect }: { selected: CompanyId | null; onSelect: (id: CompanyId | null) => void }) {
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{root.current?.closest('.window-content')?.scrollTo({top:0});},[selected]);
  const index=careerPath.findIndex(entry=>entry.id===selected);
  const entry=experience.find(entry=>entry.id===selected);
  return <div ref={root} className="experience-app">

    <nav className="company-apps" aria-label="Choose a company">{careerPath.map(company=><button key={company.id} className={selected===company.id?'selected':''} aria-pressed={selected===company.id} aria-label={`View ${company.company} role`} onClick={()=>onSelect(company.id)}><CompanyLogo id={company.id}/><strong>{company.company}</strong><span>{company.year}</span></button>)}</nav>
    {entry?<><div className="role-navigation"><button className="text-button" onClick={()=>onSelect(null)}><ChevronLeft size={15}/>All experience</button><div><button className="icon-button" aria-label="Previous role" disabled={index<=0} onClick={()=>onSelect(careerPath[index-1].id)}><ChevronLeft size={18}/></button><button className="icon-button" aria-label="Next role" disabled={index>=careerPath.length-1} onClick={()=>onSelect(careerPath[index+1].id)}><ChevronRight size={18}/></button></div></div><RoleDetails key={entry.id} entry={entry}/></>:<><h2>Work experience</h2><p className="lead">Select a company to see what I worked on there.</p><div className="experience-list">{careerPath.map(company=><article key={company.id}><CompanyLogo id={company.id}/><div className="experience-details"><div className="experience-top"><div><h3>{company.role}</h3><button className="role-overview-link" onClick={()=>onSelect(company.id)}>{company.legalName}</button></div><span>{company.date}<small>{company.mode}</small></span></div><p className="role-overview-focus">{company.focus}</p><div className="tags">{company.tools.map(tool=><span key={tool}>{tool}</span>)}</div><button className="text-button" onClick={()=>onSelect(company.id)}>Open role details</button></div></article>)}</div><p className="disclosure">Ordered by start date. Some role periods overlap, as reported in the supplied resumes.</p></>}
  </div>;
}
