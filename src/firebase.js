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
// Ils vivent dans firebase-admin.js.
//
// DÉCISION D'ARCHITECTURE (26/07/2026) : Portfolio.jsx et CvPage.jsx importent
// firebase-admin.js de façon STATIQUE et EAGER, y compris Portfolio.jsx qui est
// rendu sur la page d'accueil. C'est volontaire : le dashboard admin (Gérer les
// projets / Mon CV) doit piloter en direct le contenu public du site — un projet
// ajouté depuis /admin doit apparaître immédiatement sur la page d'accueil, sans
// édition manuelle de translations.js. Le compromis assumé : le bundle initial
// de la page d'accueil inclut le SDK Firestore (quelques centaines de Ko de plus).
// Ne pas "corriger" cet import vers une forme dynamique sans en discuter d'abord —
// ça casserait l'affichage des projets/CV gérés depuis le dashboard.
//
// Le formulaire de contact public (Contact.jsx) et les compteurs de visites
// (analytics.js), eux, continuent d'importer firebase-admin.js dynamiquement,
// puisqu'ils n'ont besoin d'écrire qu'au moment d'une action utilisateur
// (submit du formulaire), pas au chargement de la page.