import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Instances Firestore/Auth partagées par les pages qui en ont besoin.
// Import STATIQUE volontaire depuis Portfolio.jsx et CvPage.jsx (voir la note
// dans firebase.js du 26/07/2026) : le contenu public du site doit refléter
// en direct ce qui est géré depuis le dashboard admin. Ne pas retirer ces
// imports statiques sans relire cette note.
export const db = getFirestore(app);
export const auth = getAuth(app);