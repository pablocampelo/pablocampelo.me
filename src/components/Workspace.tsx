'use client';

import { useState } from 'react';
import type React from 'react';
import styles from './workspace.module.css';
import { PROJECTS } from '@/content/project';

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'craft', label: 'Craft' },
  { id: 'notes', label: 'Notes' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Workspace() {
  const [active, setActive] = useState<TabId>('projects');

  const focusTab = (id: TabId) => {
    document.getElementById(`tab-${id}`)?.focus();
  };

  const activateTab = (id: TabId) => {
    focusTab(id);
    setActive(id);
    requestAnimationFrame(() => focusTab(id));
  };

  const moveTo = (nextIndex: number) => {
    const wrapped = (nextIndex + TABS.length) % TABS.length;
    const nextId = TABS[wrapped].id;
    activateTab(nextId);
  };

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentId: TabId) => {
    const currentIndex = TABS.findIndex((t) => t.id === currentId);

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        moveTo(currentIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        moveTo(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        moveTo(0);
        break;
      case 'End':
        e.preventDefault();
        moveTo(TABS.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        activateTab(currentId);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <h1 className={styles.title}>Workspace</h1>
            <p className={styles.subtitle}>Explora secciones por tabs.</p>
          </div>

          <nav role="tablist" aria-label="Workspace sections" className={styles.tablist}>
            {TABS.map((tab) => {
              const selected = tab.id === active;
              const tabId = `tab-${tab.id}`;
              const panelId = `panel-${tab.id}`;

              return (
                <button
                  key={tab.id}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => activateTab(tab.id)}
                  onFocus={() => setActive(tab.id)}
                  onKeyDown={(e) => onTabKeyDown(e, tab.id)}
                  className={styles.tab}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {active === 'projects' && (
          <section
            role="tabpanel"
            id="panel-projects"
            aria-labelledby="tab-projects"
            className={styles.panel}
          >
            <h2 className={styles.panelTitle}>Projects</h2>
            <div className={styles.projects}>
              {PROJECTS.map((p) => (
                <a
                  key={p.title}
                  className={styles.projectLink}
                  href={p.href}
                  target={p.href.startsWith('http') ? '_blank' : undefined}
                  rel={p.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <div className={styles.projectHeader}>
                    <h3 className={styles.projectTitle}>{p.title}</h3>
                    {p.meta ? <span className={styles.projectMeta}>{p.meta}</span> : null}
                  </div>

                  <p className={styles.projectDesc}>{p.description}</p>

                  <div className={styles.tags} aria-label={`${p.title} tags`}>
                    {p.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {active !== 'projects' && (
          <section
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            className={styles.panel}
          >
            <h2 className={styles.panelTitle}>{TABS.find((t) => t.id === active)?.label}</h2>
            <p className={styles.panelText}>Contenido de ejemplo de la sección seleccionada.</p>
          </section>
        )}
      </main>
    </div>
  );
}
