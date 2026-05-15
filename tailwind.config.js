/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FDF8F0',
          100: '#F5EDD8',
          200: '#E8DFD0',
          300: '#C4A35A',
          400: '#B8922A',
          500: '#8B6914',
          600: '#6B4F0F',
          700: '#4A2C1A',
          800: '#2C1810',
          900: '#1A0E08',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
