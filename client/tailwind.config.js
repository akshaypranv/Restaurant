/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          card: 'rgba(255, 255, 255, 0.08)',
          'card-hover': 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.15)',
        },
        amber: { brand: '#F59E0B' },
      },
      backdropBlur: { glass: '12px' },
      backgroundImage: {
        'radial-hero':
          'radial-gradient(ellipse at 80% 0%, rgba(245,158,11,0.15) 0%, transparent 60%), ' +
          'radial-gradient(ellipse at 20% 100%, rgba(109,40,217,0.10) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
