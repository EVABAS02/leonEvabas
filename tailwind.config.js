/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F8F6F0',       // Fond principal beige/crème
        teal: {
          DEFAULT: '#0D6E6E',   // Vert canard principal
          hover: '#0A5858',
        },
        gold: '#C59B27',         // Accents dorés/ocres (usage décoratif : italiques, tags, bordures)
        'gold-dark': '#8A6B1C',  // Variante accessible (contraste 5:1 sur blanc) — à utiliser quand du texte
                                  // repose sur un fond doré (boutons actifs FR/EN, ACCUEIL, etc.)
        charcoal: '#111827',     // Texte foncé
        night: '#0F172A',        // Footer bleu nuit
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}