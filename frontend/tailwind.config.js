/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure Tailwind works across all your React components
  ],
  darkMode: 'class', // ✅ Enables class-based dark mode
  theme: {
    extend: {
      transitionProperty: {
        colors: 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  plugins: [],
};
