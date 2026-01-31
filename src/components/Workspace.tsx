'use client';

import { useState } from 'react';

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

  return (
    <main style={{ minHeight: '100vh', padding: 24 }}>
      <h1 style={{ margin: 0 }}>Workspace</h1>
      <p style={{ opacity: 0.7 }}>
        Tabs funcionales (v1). Luego pulimos diseño y añadimos contenido real.
      </p>

      <nav
        role="tablist"
        aria-label="Workspace sections"
        style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          const tabId = `tab-${tab.id}`; // id del botón
          const panelId = `panel-${tab.id}`; // id del panel

          return (
            <button
              key={tab.id}
              id={tab.id === 'projects' ? 'tab-projects' : tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
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
        const tabId = tab.id === 'projects' ? 'tab-projects' : `tab-${tab.id}`;
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
            <p style={{ margin: 0, opacity: 0.8 }}>
              Placeholder de {tab.label}. (Luego metemos contenido real.)
            </p>
          </section>
        );
      })}
    </main>
  );
}
