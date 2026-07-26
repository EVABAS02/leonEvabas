import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Instances Firestore/Auth "eager" — réservées aux pages déjà lazy-loadées
// (Dashboard, AdminLogin, AdminArea, ReplyThread). Ne jamais importer ce
// fichier depuis un composant rendu sur la page d'accueil (Home) : ça
// annulerait le découpage de bundle mis en place dans firebase.js.
export const db = getFirestore(app);
export const auth = getAuth(app);