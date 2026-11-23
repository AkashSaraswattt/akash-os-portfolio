import Link from 'next/link';
import { profile, projects } from '../../../content/portfolio';
import { CaseStudy } from '../../../components/AppContent';
import CaseCompanion from '../../../components/CaseCompanion';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=projects.find(p=>p.slug===slug)!;return {title:`${project.name} | ${profile.name}`,description:project.summary,alternates:process.env.NEXT_PUBLIC_SITE_URL?{canonical:`/work/${slug}/`}:undefined};}
export default async function WorkPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <main className="standalone"><nav className="standalone-nav"><Link href="/">{profile.os}</Link><Link href="/">Back to workspace</Link></nav><div className="standalone-article"><CaseStudy slug={slug}/></div><footer className="standalone-footer">{profile.name} · Engineering case files · <a href={`mailto:${profile.email}`}>Get in touch</a></footer><CaseCompanion/></main>;}
