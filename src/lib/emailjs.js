import emailjs from '@emailjs/browser';

export const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
export const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Adresse que TOI tu consultes pour être notifié quand un client répond.
export const ADMIN_NOTIFICATION_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

/**
 * Envoie un email via le template "Auto-Reply" (bilingue FR/EN) configuré sur EmailJS.
 */
export function sendReplyEmail({ to_name, to_email, message, reply_link }) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    { to_name, to_email, message, reply_link },
    EMAILJS_PUBLIC_KEY
  );
}