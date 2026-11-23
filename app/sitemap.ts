import { projects } from '../content/portfolio';
import type { MetadataRoute } from 'next';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap {const site=process.env.NEXT_PUBLIC_SITE_URL;if(!site)return [];return ['', ...projects.map(project=>`/work/${project.slug}/`)].map(path=>({url:`${site.replace(/\/$/,'')}${path}`,changeFrequency:'monthly' as const}));}
