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
        secondaryGray:'#F4F4F4',
        secondary:'#555555',
        gray2:'#333333',
        ternaryGray:'#979797',
        lightGray:"#D9D9D9",
        ternary:'#009699',
        customPurple:'#5F57FF',
        heading:'#2D2D2D',
        primaryGreen:' #4AB58E',
        primaryPurple:"#A657D6",
        primaryYellow:'#FFCE384F',
        secondaryYellow:'#F3B800',
        ternaryYellow:'#F6A000',
        secondaryGreen:'#4AB58E',
        primaryGreen:'#0BB7834A',
        primaryGreen2:'rgba(11, 183, 131, 0.48)',
        primaryRed:'rgba(250, 124, 124, 0.47)',
        primaryRed2:'rgba(246, 78, 96, 0.63)',
        secondaryRed:'rgba(250, 124, 124, 1)',
        

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

