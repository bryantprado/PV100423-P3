/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#121212',
        secondary: '#1E1E1E',
        tertiary: '#2A2A2A',
        accent: '#00D084',
        text: '#FFFFFF',
        textSecondary: '#A1A1AA',
      },
    },
  },
  plugins: [],
}
