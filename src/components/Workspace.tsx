'use client';

import { useState } from 'react';
import type React from 'react';
import styles from './workspace.module.css';

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
    <main className={styles.workspace}>
      <h1 className={styles.title}>Workspace</h1>
      <p className={styles.subtitle}>Tabs funcionales con navegación por secciones.</p>

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

      {TABS.map((tab) => {
        const selected = tab.id === active;
        const tabId = `tab-${tab.id}`;
        const panelId = `panel-${tab.id}`;

        return (
          <section
            key={tab.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!selected}
            className={styles.panel}
          >
            <h2 className={styles.panelTitle}>{tab.label}</h2>
            <p className={styles.panelText}>Contenido de ejemplo de {tab.label}.</p>
          </section>
        );
      })}
    </main>
  );
}
