'use client';

import { useEffect, useState } from 'react';
import Workspace from './Workspace';

export default function Threshold() {
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Lee la preferencia del sistema: "reducir movimiento".
  // Esto nos sirve para saltar animaciones (cuando las añadamos) si el usuario lo prefiere.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => setReducedMotion(mq.matches);
    update();

    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Acción única para entrar.
  // Si reducedMotion está activo, la entrada debe ser inmediata (sin efectos).
  const enter = () => {
    setEntered(true);
  };

  // Teclado: solo funciona mientras estás en Cover.
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

  // Al entrar, mandamos foco al primer tab del Workspace.
  useEffect(() => {
    if (!entered) return;

    requestAnimationFrame(() => {
      document.getElementById('tab-projects')?.focus();
    });
  }, [entered]);

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
          <p style={{ opacity: 0.7 }}>Intro editorial (v1). Acceso por botón o teclado.</p>

          <button type="button" onClick={enter}>
            Enter workspace
          </button>

          <p style={{ marginTop: 12, opacity: 0.6 }}>
            Scroll to enter ↓{reducedMotion ? ' (reduced motion activo)' : ''}
          </p>
        </div>
      </main>
    );
  }

  return <Workspace />;
}
