'use client';

import { useEffect, useRef, useState } from 'react';
import Workspace from './Workspace';
import styles from './threshold.module.css';

export default function Threshold() {
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const committedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();

    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const enter = () => {
    setEntered(true);
    // Cuando entras, queremos empezar arriba del workspace (evita quedarte “abajo” por el track).
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  // Teclado: solo mientras estás en Cover
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

  // Scroll → progreso (0..100) → CSS var --p. Al llegar a 100: commit.
  useEffect(() => {
    if (entered || reducedMotion) return;

    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let raf = 0;

    const update = () => {
      raf = 0;

      const start = track.offsetTop;
      const end = start + track.offsetHeight - window.innerHeight;
      const y = window.scrollY;

      const raw = (y - start) / Math.max(1, end - start);
      const clamped = Math.min(1, Math.max(0, raw));
      const p = Math.round(clamped * 100);

      stage.style.setProperty('--p', String(p));

      if (p >= 100 && !committedRef.current) {
        committedRef.current = true;
        enter();
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [entered, reducedMotion]);

  // Al entrar, foco al primer tab del Workspace
  useEffect(() => {
    if (!entered) return;
    requestAnimationFrame(() => {
      document.getElementById('tab-projects')?.focus();
    });
  }, [entered]);

  // Si reduced motion está activo, evitamos el umbral por scroll.
  if (reducedMotion) {
    if (!entered) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontSize: 40, margin: 0 }}>Cover</h1>
            <p style={{ opacity: 0.7 }}>Acceso por botón o teclado.</p>
            <button type="button" onClick={enter}>
              Enter workspace
            </button>
          </div>
        </main>
      );
    }
    return <Workspace />;
  }

  // Commit: una vez dentro, mostramos el Workspace real.
  if (entered) return <Workspace />;

  // Intro con scroll “natural”: track alto + stage sticky que anima por --p.
  return (
    <div ref={trackRef} className={styles.track}>
      <div ref={stageRef} className={styles.stage}>
        {/* Cover */}
        <div className={`${styles.layer} ${styles.coverLayer}`}>
          <div className={`${styles.card} ${styles.coverCard}`}>
            <div style={{ textAlign: 'left', width: 'min(680px, 88vw)' }}>
              <h1 style={{ fontSize: 40, margin: 0 }}>Cover</h1>
              <p style={{ opacity: 0.7 }}>Intro editorial (v1). Acceso por botón o teclado.</p>

              <button type="button" onClick={enter}>
                Enter workspace
              </button>

              <p className={styles.hint}>Scroll to enter ↓</p>
            </div>
          </div>
        </div>

        {/* Workspace preview (visual, no interactivo) */}
        <div className={styles.layer} aria-hidden="true">
          <div className={`${styles.card} ${styles.previewCard}`}>
            <div className={styles.previewInner}>
              <h2 style={{ margin: 0 }}>Workspace</h2>
              <p style={{ marginTop: 8, marginBottom: 0 }}>
                Vista previa del sistema. Al final del scroll entras al workspace real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
