import { initializeApp } from "firebase/app";
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

// NOTE : Firestore (db) et Auth (auth) ne sont PLUS initialisés ici.
// Ils vivent dans firebase-admin.js, importé uniquement par les pages qui
// en ont vraiment besoin (Dashboard, AdminLogin, ReplyThread) — toutes déjà
// lazy-loadées. Ça évite de charger ~150 Ko de SDK Firestore/Auth pour un
// visiteur qui ne fait que consulter la page d'accueil.
// Pour le formulaire de contact public (Contact.jsx), qui a besoin d'écrire
// UN document Firestore au moment du submit, on importe dynamiquement
// firebase-admin.js à ce moment précis plutôt qu'au chargement de la page.