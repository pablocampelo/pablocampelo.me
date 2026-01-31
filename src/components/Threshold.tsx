'use client';

import { useEffect, useState } from 'react';
import Workspace from './Workspace';

export default function Threshold() {
  const [entered, setEntered] = useState(false);

  // 1) Acción única para entrar (evita duplicar lógica)
  const enter = () => setEntered(true);

  // 2) Teclado: solo funciona mientras estás en Cover
  useEffect(() => {
    if (entered) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const isEnter = e.key === 'Enter';
      const isSpace = e.key === ' ';
      const isArrowDown = e.key === 'ArrowDown';

      if (isEnter || isSpace || isArrowDown) {
        e.preventDefault();
        enter();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [entered]);

  // 3) Al entrar, mandamos foco al primer tab del Workspace (detalle pro)
  useEffect(() => {
    if (!entered) return;

    requestAnimationFrame(() => {
      document.getElementById('tab-projects')?.focus();
    });
  }, [entered]);

  // 4) Render condicional: Cover o Workspace
  if (!entered) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: 40, margin: 0 }}>Cover</h1>
          <p style={{ opacity: 0.7 }}>Intro editorial (v1 simple). Entras con botón o teclado.</p>

          <button type="button" onClick={enter}>
            Enter workspace
          </button>

          <p style={{ marginTop: 12, opacity: 0.6 }}>Scroll to enter ↓ (luego)</p>
        </div>
      </main>
    );
  }

  return <Workspace />;
}
