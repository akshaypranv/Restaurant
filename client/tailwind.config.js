/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── NEW SILVERTIP PALETTE ─────────────────────────────────────────
        'brand-red':     '#A41F13', // Primary: CTAs, active states, highlights
        'surface-white': '#FAF5F1', // Primary background, card surfaces
        'surface-gray':  '#E0DBD8', // Secondary backgrounds, inputs, dividers
        'text-dark':     '#292F36', // All headings and body text
        'accent-taupe':  '#8F7A6E', // Muted text, borders (NOT for body text — fails WCAG AA)
        // ── SEMANTIC ALIASES ─────────────────────────────────────────────
        'btn-primary':   '#A41F13',
        'btn-hover':     '#7D1710', // 15% darker for hover state
        'card-bg':       '#FAF5F1',
        'card-border':   '#E0DBD8',
        'page-bg':       '#FAF5F1',
        'danger':        '#A41F13', // Reuse brand red for errors
        'success':       '#2D6A4F', // Forest green — readable on white
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body':    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-overlay':   'linear-gradient(to top, rgba(41,47,54,0.75) 0%, rgba(41,47,54,0.2) 60%, transparent 100%)',
        'card-shine':     'linear-gradient(135deg, rgba(250,245,241,0) 0%, rgba(250,245,241,0.6) 50%, rgba(250,245,241,0) 100%)',
      },
      keyframes: {
        'light-sweep': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center'  },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'light-sweep': 'light-sweep 4s ease-in-out infinite',
        'fade-in':     'fade-in 0.5s ease forwards',
      },
    },
  },
  plugins: [],
};
