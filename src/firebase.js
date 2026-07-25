import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Toutes les valeurs viennent maintenant de ton fichier .env (jamais commité sur Git).
// Voir .env.example pour la liste des variables attendues.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

// App Check : protège Firestore contre les abus (bots, scripts automatisés).
// Ne s'active que si VITE_RECAPTCHA_SITE_KEY est renseignée (voir étape App Check).
// En dev localhost, Firebase te demandera un "debug token" la première fois
// (regarde la console du navigateur, un lien apparaît pour l'enregistrer).
if (import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}

export const db = getFirestore(app);
export const auth = getAuth(app);