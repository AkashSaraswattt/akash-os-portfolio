import type { Metadata, Viewport } from 'next';
import './globals.css';
import { profile } from '../content/portfolio';

const site = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: `${profile.os} | Software Developer`,
  description: 'Explore Akash Saraswat’s engineering workspace: backend systems, AI applications, selected projects, experience, and technical case studies.',
  ...(site ? { metadataBase: new URL(site), alternates: { canonical: '/' } } : {}),
  openGraph: { title: `${profile.os} | ${profile.name}`, description: 'A personal operating system for thoughtful engineering.', type: 'website',  },
  twitter: { card: 'summary', title: `${profile.os} | ${profile.name}`, description: 'Backend systems. AI applications. Thoughtful engineering.' },
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b1427' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: 'Software Engineer', ...(site ? { url: site } : {}), sameAs: [profile.github, profile.linkedin, profile.leetcode] };
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />{children}</body></html>;
}
