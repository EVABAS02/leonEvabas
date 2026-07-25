import { app, db } from '../firebase';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { doc, increment, updateDoc, setDoc } from 'firebase/firestore';

let analyticsInstance = null;
const analyticsReady = isSupported().then((supported) => {
  if (supported) analyticsInstance = getAnalytics(app);
  return supported;
});

export async function trackPageView(path) {
  await analyticsReady;
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'page_view', { page_path: path });
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// À appeler sur CHAQUE page publique visitée (Home, /cv...).
// Incrémente : le détail du jour (stats_daily) + le compteur global all-time (stats/global).
// "unique" ne compte qu'une fois par session navigateur (sessionStorage), "visits" à chaque chargement.
export async function trackVisit() {
  if (typeof window === 'undefined') return;
  const isNewSession = !sessionStorage.getItem('evabas_session');
  if (isNewSession) sessionStorage.setItem('evabas_session', '1');

  const dailyRef = doc(db, 'stats_daily', todayKey());
  const globalRef = doc(db, 'stats', 'global');

  try {
    await setDoc(
      dailyRef,
      {
        visits: increment(1),
        uniqueVisitors: increment(isNewSession ? 1 : 0)
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Compteur journalier indisponible :', err.message);
  }

  try {
    const updates = { totalVisits: increment(1) };
    if (isNewSession) updates.total = increment(1);
    await updateDoc(globalRef, updates);
  } catch (err) {
    console.warn('Compteur global indisponible :', err.message);
  }
}