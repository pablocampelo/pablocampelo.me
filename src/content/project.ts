export type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    title: 'TrazoAI',
    description: 'Frontend demo con arquitectura limpia y UX cuidada.',
    tags: ['Next.js', 'UI', 'A11y'],
    href: '#',
  },
  {
    title: 'Portfolio System',
    description: 'Sistema interactivo para explorar diseño y producto.',
    tags: ['Design', 'Frontend'],
    href: '#',
  },
];
