/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        sparkle: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
        ripple: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 0.45 },
          '70%': { opacity: 0.2 },
          '100%': { transform: 'translate(-50%, -50%) scale(1.6)', opacity: 0 },
        },
        'selected-glow': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            'box-shadow': '0 6px 15px rgba(59, 130, 246, 0.25)',
          },
          '50%': {
            transform: 'translateY(-6px) scale(1.05)',
            'box-shadow': '0 16px 35px rgba(59, 130, 246, 0.45)',
          },
          '100%': {
            transform: 'translateY(-2px) scale(1.02)',
            'box-shadow': '0 10px 25px rgba(59, 130, 246, 0.35)',
          },
        },
      },
      animation: {
        sparkle: 'sparkle 0.5s linear',
        ripple: 'ripple 0.6s ease-out forwards',
        'selected-glow': 'selected-glow 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}