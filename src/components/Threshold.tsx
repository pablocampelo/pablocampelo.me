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
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

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

  useEffect(() => {
    if (!entered) return;
    requestAnimationFrame(() => {
      document.getElementById('tab-projects')?.focus();
    });
  }, [entered]);

  if (reducedMotion) {
    if (!entered) {
      return (
        <main className={styles.rmMain}>
          <div className={styles.rmContainer}>
            <h1 className={styles.coverTitle}>Cover</h1>
            <p className={styles.coverText}>Acceso por botón o teclado.</p>
            <button type="button" onClick={enter}>
              Enter workspace
            </button>
          </div>
        </main>
      );
    }
    return <Workspace />;
  }

  if (entered) return <Workspace />;

  return (
    <div ref={trackRef} className={styles.track}>
      <div ref={stageRef} className={styles.stage}>
        <div className={`${styles.layer} ${styles.coverLayer}`}>
          <div className={`${styles.card} ${styles.coverCard}`}>
            <div className={styles.coverInner}>
              <h1 className={styles.coverTitle}>Cover</h1>
              <p className={styles.coverText}>Intro editorial (v1). Acceso por botón o teclado.</p>

              <button type="button" onClick={enter}>
                Enter workspace
              </button>

              <p className={styles.hint}>Scroll to enter ↓</p>
            </div>
          </div>
        </div>

        <div className={styles.layer} aria-hidden="true">
          <div className={`${styles.card} ${styles.previewCard}`}>
            <div className={styles.previewInner}>
              <h2 className={styles.previewTitle}>Workspace</h2>
              <p className={styles.previewText}>Navegación por secciones y contenido de ejemplo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
