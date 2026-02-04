'use client';

import { useState } from 'react';
import type React from 'react';

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

      // Opcional (pero correcto): Enter/Space activan el tab actual
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
    <main style={{ minHeight: '100vh', padding: 24 }}>
      <h1 style={{ margin: 0 }}>Workspace</h1>
      <p style={{ opacity: 0.7 }}>Tabs funcionales con navegación por secciones.</p>

      <nav
        role="tablist"
        aria-label="Workspace sections"
        style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}
      >
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
              style={{
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid currentColor',
                opacity: selected ? 1 : 0.7,
              }}
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
            style={{ marginTop: 16, paddingTop: 8 }}
          >
            <h2 style={{ margin: '0 0 8px 0' }}>{tab.label}</h2>
            <p style={{ margin: 0, opacity: 0.8 }}>Contenido de ejemplo de {tab.label}.</p>
          </section>
        );
      })}
    </main>
  );
}
