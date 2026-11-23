export const profile = {
  name: 'Akash Saraswat',
  os: 'AKASH.OS',
  email: 'akashsaraswat0005@gmail.com',
  phone: '+91 9755901624',
  heroSummary: 'I build web apps with React and payment APIs with Go.',
  heroDetail: 'I’ve also built tools that turn order requests into ready-to-use documents.',
  github: 'https://github.com/AkashSaraswattt',
  linkedin: 'https://www.linkedin.com/in/akash-saraswat-613982257/',
  leetcode: 'https://leetcode.com/u/skysauce/',
  portfolio: 'https://akashs-world.vercel.app/',
  note: "I worked on buy now, pay later services at Tabby. Before that, at VM Agro Foods, I automated the paperwork for orders and requests so the team could spend less time putting documents together.\n\nI studied AI and Data Science at Madhav Institute of Technology and Science, Gwalior. I built Sortify so you can watch sorting algorithms step by step. I also worked on ByteMeet, where learners can meet on video, share materials, and get help from an AI tutor.\n\nThat’s me in the blue T-shirt. Click the portrait for a quick fact, or follow Mini Me around the dock.",
};

type Project = {
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  kind: 'AI applications' | 'Full-stack' | 'Frontend';
  date?: string;
  stack: string[];
  summary: string;
  problem: string;
  work: string[];
  architecture: string[];
  result: string;
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: 'bytemeet', name: 'ByteMeet', subtitle: 'Video calls and AI tutoring in one learning workspace.',
    category: 'Learning platform', kind: 'Full-stack',
    stack: ['Next.js', 'TypeScript', 'WebRTC', 'GraphQL', 'Supabase', 'Redis', 'OpenAI API'],
    summary: 'A learning platform with WebRTC conferencing, GPT-4 tutoring, and real-time artifact sharing.',
    problem: 'Learners can get help and share materials in ByteMeet without leaving the video call.',
    work: ['Built WebRTC conferencing and GPT-4 tutoring for 9+ concurrent participants.', 'Designed 15+ GraphQL queries and mutations to reduce client over-fetching.', 'Used Supabase for real-time sharing, JWT and owner approval for room access, and Redis for caching.'],
    architecture: ['Next.js client', 'JWT and room approval', 'WebRTC and GraphQL', 'Supabase, Redis, and GPT-4'],
    result: 'Delivered video meetings, AI tutoring, and shared artifacts in one application.',
    repo: 'https://github.com/Mohhit1230/bytemeet', demo: 'https://www.bytemeet.in/',
  },
  {
    slug: 'prosmic-agent', name: 'Prosmic Agent', subtitle: 'Ask for an email or a PDF in plain language.',
    category: 'Generative AI assistant', kind: 'AI applications',
    stack: ['React', 'Node.js', 'MCP', 'Gemini API', 'OpenAI API', 'Playwright', 'Nodemailer'],
    summary: 'An MCP-based assistant for email automation, PDF generation, and social media tasks.',
    problem: 'Use one interface for workflows that otherwise require switching between tools.',
    work: ['Integrated Gemini and OpenAI models and Playwright for natural-language-driven workflows.', 'Built a modular MCP server with dynamic tool registration.', 'Supported email, PDF, and social media workflows.'],
    architecture: ['React client', 'Model interprets request', 'MCP tool selection', 'Workflow execution'],
    result: 'The assistant can draft emails, generate PDFs, and handle social media tasks.',
    repo: 'https://github.com/Mohhit1230/AI-Agent', demo: 'https://prosmic.bytemeet.in/',
  },
  {
    slug: 'sortify', name: 'Sortify', subtitle: 'See what each sorting algorithm does to the array.',
    category: 'Sorting algorithm visualizer', kind: 'Frontend', date: 'July 2025',
    stack: ['React', 'Vite', 'Tailwind CSS'],
    summary: 'An interactive visualizer for 16 sorting algorithms, with adjustable controls, sound, and live metrics.',
    problem: 'Make it easier to see how sorting algorithms move elements and compare their behavior.',
    work: ['Implemented 16 sorting algorithms with animation and audio feedback.', 'Added adjustable controls and live performance metrics.', 'Optimized rendering for arrays of 200+ elements.'],
    architecture: ['Array controls', 'Sorting steps', 'Animation and sound', 'Live metrics'],
    result: 'Delivered a browser-based visualizer with adjustable playback and support for 200+ elements.',
    demo: 'https://sortify-sorting-visualizer.vercel.app/',
  },
  {
    slug: 'braintumor-ai', name: 'BrainTumor.ai', subtitle: 'An MRI classification prototype with visual explanations.',
    category: 'MRI classifier prototype', kind: 'AI applications', date: 'May 2025',
    stack: ['TensorFlow', 'Flask', 'JavaScript', 'Grad-CAM', 'Cloud'],
    summary: 'A CNN prototype for binary MRI classification, with Grad-CAM heatmaps and batch predictions.',
    problem: 'Explore binary classification of brain MRI scans and show which image regions contribute to each prediction.',
    work: ['Trained a convolutional neural network for binary classification.', 'Used Grad-CAM to visualize model attention.', 'Deployed a cloud batch-prediction pipeline with encrypted uploads.'],
    architecture: ['MRI batch upload', 'Flask inference', 'TensorFlow classifier', 'Grad-CAM heatmaps'],
    result: 'The resume reports 96.7% accuracy on the project validation set.',
  },
];

export type CompanyId = 'heka' | 'sequence' | 'vm-agro' | 'tabby' | 'freelance';
export type ExperienceEntry = { id: CompanyId; company: string; legalName: string; role: string; date: string; year: string; mode: string; mark: string; logo?: string; points: string[]; tools: string[]; focus: string };
export const experience: ExperienceEntry[] = [
  { id: 'freelance', company: 'Freelance', legalName: 'Self-employed', role: 'Freelance AI & Web Developer', date: 'Jun 2026 – Present', year: '2026', mode: 'Remote', mark: 'AS', focus: 'Custom web applications for international clients', tools: ['Web development', 'AI-assisted development', 'Code review'], points: ['Built custom web applications for international clients.', 'Used AI-assisted debugging and code review to fix bugs and improve implementations.'] },
  { id: 'tabby', logo: '/assets/companies/tabby.webp', company: 'Tabby', legalName: 'Tabby', role: 'Software Engineer Intern', date: 'May – Oct 2026', year: '2026', mode: 'Remote · Dubai, UAE', mark: 'T', focus: 'Buy Now, Pay Later payment workflows', tools: ['Go', 'APIs', 'Distributed systems', 'AI-assisted debugging'], points: ['Contributed to 8+ Go services, APIs, or components supporting fintech payment workflows.', 'Reviewed requirements and worked on request handling, business logic, error handling, and service integrations.', 'Used AI-assisted debugging in a production codebase and contributed to seven issue resolutions or code improvements.'] },
  { id: 'vm-agro', company: 'VM Agro Foods', legalName: 'VM Agro Foods Pvt. Ltd.', role: 'Software Developer Intern', date: 'Jan – May 2026', year: '2026', mode: 'Mumbai', mark: 'VM', focus: 'Internal document and workflow automation', tools: ['AI workflow automation', 'Document generation'], points: ['Automated order and request document generation for internal teams.', 'Integrated AI tools into internal features to reduce repetitive preparation and improve workflow consistency.'] },
  { id: 'sequence', logo: '/assets/companies/sequence.webp', company: 'Sequence 256', legalName: 'Sequence 256 Technowave Pvt. Ltd.', role: 'Frontend Developer Intern', date: 'May – Jul 2025', year: '2025', mode: 'Remote', mark: '256', focus: 'Reusable React interfaces and authenticated APIs', tools: ['React', 'Node.js', 'REST APIs', 'JWT'], points: ['Built reusable responsive React components and improved frontend performance.', 'Enhanced Node.js APIs, tested endpoint behavior, and implemented JWT authentication.'] },
  { id: 'heka', logo: '/assets/companies/heka.webp', company: 'Heka Fashion', legalName: 'Heka Fashion', role: 'Web Developer Intern', date: 'May – Jul 2024', year: '2024', mode: 'Remote', mark: 'HF', focus: 'Responsive Shopify storefronts', tools: ['Shopify Liquid', 'JavaScript', 'HTML', 'CSS', 'Figma'], points: ['Translated Figma designs into mobile-responsive e-commerce layouts.', 'Implemented Shopify storefront pages and reusable elements with Liquid, JavaScript, HTML, and CSS.'] },
];

export const skills = [
  { name: 'Languages', tools: ['Go', 'C', 'C++', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'R'] },
  { name: 'Frontend', tools: ['React', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'HTML', 'CSS', 'Responsive design', 'Shopify Liquid', 'Figma', 'Vite'] },
  { name: 'Backend & APIs', tools: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL', 'gRPC', 'Socket.IO', 'WebRTC', 'JWT', 'Microservices', 'MCP'] },
  { name: 'Databases', tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase'] },
  { name: 'AI development', tools: ['AI agents', 'Gemini API', 'OpenAI API', 'TensorFlow', 'Grad-CAM', 'Workflow automation', 'Prompt engineering', 'AI code generation, review & debugging'] },
  { name: 'Development tools', tools: ['Claude Code', 'Cursor', 'GitHub Copilot', 'Codex', 'Antigravity', 'Postman', 'Playwright', 'Nodemailer', 'Git', 'GitHub'] },
  { name: 'Cloud & delivery', tools: ['AWS', 'Microsoft Azure', 'Docker', 'NGINX', 'SSL/TLS'] },
];

export const evidence = [
  { title: 'Sequence 256 experience', type: 'Resume-linked certificate', url: 'https://drive.google.com/file/d/13O_PLsNz_eGeDO2G6ViZQRsZOWzCSylV/view?usp=drive_link' },
  { title: 'Heka Fashion experience', type: 'Resume-linked certificate', url: 'https://drive.google.com/file/d/1vQFeiGKG1dHsfYYJB6W-CPr_aUsq4vGm/view?usp=sharing' },
  { title: 'ISCMCTR 2025 presentation', type: 'Resume-linked certificate', url: 'https://drive.google.com/file/d/11s42oT0ZcfDC8IgwqTJFL2KeOjVjaDhB/view?usp=drive_link' },
];

export const journey = [
  ['2022–2026', 'B.Tech in AI and Data Science', 'Madhav Institute of Technology and Science, Gwalior · Nov 2022 to Jun 2026 · CGPA 8.'],
  ['2024', 'Storefronts and Smart India Hackathon', 'Built Shopify storefronts at Heka Fashion and led a five-person AI project to institute-level selection at Smart India Hackathon.'],
  ['2025', 'Web engineering and research', 'Worked at Sequence 256, built Sortify and BrainTumor.ai, and presented loan approval research at ISCMCTR 2025.'],
  ['2026', 'Internal tools and payments', 'Automated documents at VM Agro Foods, worked on Go payment services at Tabby, and began freelance web and AI development.'],
];

export const metrics = [
  { value: '8+', label: 'Go services, APIs, or components', source: 'Tabby', note: 'Contributions to Buy Now, Pay Later payment workflows.' },
  { value: '16', label: 'sorting algorithms', source: 'Sortify', note: 'Animated visualizations with sound, adjustable controls, and rendering for 200+ elements.' },
  { value: '9+', label: 'concurrent participants', source: 'ByteMeet', note: 'WebRTC conferencing backed by a GraphQL API with 15+ queries and mutations.' },
  { value: '96.7%', label: 'validation accuracy', source: 'BrainTumor.ai', note: 'Reported on the prototype’s validation set.' },
  { value: '36 hr', label: 'hackathon build', source: 'Smart India Hackathon 2024', note: 'Led a five-person team to top institute-level selection.' },
  { value: '10+', label: 'campus events organized', source: 'MITS Gwalior', note: 'Coordinated academic and cultural events.' },
];
