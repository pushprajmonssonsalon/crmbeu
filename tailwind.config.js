/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customGray: 'rgb(203, 213, 225)', // Add your custom color

      }
    },
  },
  plugins: [],
}

