import { app } from '../firebase';

let analyticsInstance = null;
let analyticsReadyPromise = null;

// Le SDK Analytics n'est chargé qu'au premier appel, pas au chargement du module.
function getAnalyticsReady() {
  if (!analyticsReadyPromise) {
    analyticsReadyPromise = import('firebase/analytics').then(({ getAnalytics, isSupported }) =>
      isSupported().then((supported) => {
        if (supported) analyticsInstance = getAnalytics(app);
        return { supported };
      })
    );
  }
  return analyticsReadyPromise;
}

export async function trackPageView(path) {
  const { supported } = await getAnalyticsReady();
  if (!supported || !analyticsInstance) return;
  const { logEvent } = await import('firebase/analytics');
  logEvent(analyticsInstance, 'page_view', { page_path: path });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// Planifie l'exécution pendant un temps mort du thread principal,
// pour ne jamais entrer en concurrence avec le rendu (FCP/LCP).
function scheduleIdle(fn) {
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(fn, { timeout: 2000 });
  } else {
    setTimeout(fn, 300);
  }
}

// À appeler sur CHAQUE page publique visitée (Home, /cv...).
// Incrémente : le détail du jour (stats_daily) + le compteur global all-time (stats/global).
// "unique" ne compte qu'une fois par session navigateur (sessionStorage), "visits" à chaque chargement.
export function trackVisit() {
  if (typeof window === 'undefined') return;

  scheduleIdle(async () => {
    try {
      const [{ db }, { doc, increment, writeBatch }] = await Promise.all([
        import('../firebase-admin'),
        import('firebase/firestore')
      ]);

      const isNewSession = !sessionStorage.getItem('evabas_session');
      if (isNewSession) sessionStorage.setItem('evabas_session', '1');

      const batch = writeBatch(db);

      batch.set(
        doc(db, 'stats_daily', todayKey()),
        {
          visits: increment(1),
          uniqueVisitors: increment(isNewSession ? 1 : 0)
        },
        { merge: true }
      );

      batch.set(
        doc(db, 'stats', 'global'),
        {
          totalVisits: increment(1),
          ...(isNewSession ? { total: increment(1) } : {})
        },
        { merge: true }
      );

      await batch.commit();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('Compteur de visites indisponible :', err?.message);
      }
    }
  });
}