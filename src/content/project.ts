export type Project = {
  title: string;
  description: string;
  tags: string[];
  href: string;
  meta?: string;
};

export const PROJECTS: Project[] = [
  {
    title: 'TrazoAI',
    description: 'Frontend demo con UX cuidada y arquitectura clara.',
    tags: ['Next.js', 'UI', 'A11y'],
    href: 'https://github.com/pablocampelo/trazoai-web',
    meta: 'Case study',
  },
  {
    title: 'Portfolio',
    description: 'Sistema interactivo para explorar diseño y frontend.',
    tags: ['Design', 'Frontend'],
    href: 'https://pablocampelo.me',
    meta: 'Live',
  },
];
