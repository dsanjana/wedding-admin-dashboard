/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          gold: '#D4AF37',
          rose: '#E8B4B8',
          cream: '#F5F5DC',
          burgundy: '#800020',
        },
      },
    },
  },
  plugins: [],
}




