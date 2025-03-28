/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        customGray: 'rgb(203, 213, 225)',
        primaryGray :'#B1B1B1',
        primary:'#FAFBFC' ,
        secondary:'#555555',
        gray2:'#333333',
        ternary:'#009699',
        customPurple:'#5F57FF',
        heading:'#2D2D2D'

      },
      boxShadow: {
       "card":'1px 2px 16px 0px #0000001A',
       'navbar': '0px 1px 4px 0px #00000040',
       'graph': '0px 4px 4px 0px #00000040',
       'tab': '0px 4px 8px 0px #0000001A',




      }



    },
  },
  plugins: [],
}

