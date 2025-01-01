/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '320px',
        'xs': '400px',
        'sm': '500px',
        'md': '700px',
        'lg': '900px',
        'xl': '1200px',
        '2xl': '1350px',
        '3xl': '1400px',
      }
    },
    fontFamily: {
      'sora': ['Sora', 'sans-serif'],
    },
  },
  plugins: [],
}