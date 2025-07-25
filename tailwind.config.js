/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       aspectRatio: {
        '182/84': '182 / 84', // Custom aspect ratio
        '208/764': '208 / 764', // Custom aspect ratio
        '558/558': '558 / 558', // Custom aspect ratio
        '18/18': '18 / 18', // Custom aspect ratio
        '484/33': '484 / 33', // Custom aspect ratio
      },
      colors:{
        customGray: 'rgb(203, 213, 225)',
        primaryGray :'#B1B1B1',
        primary:'#FAFBFC' ,
        secondaryGray:'#F4F4F4',
        secondary:'#555555',
        gray2:'#333333',
        ternaryGray:'#979797',
        lightGray2:'#636060',
        lightGray:"#D9D9D9",
        // ternary:'#009699',
        ternary:'#6049cd',

        customPurple:'#5F57FF',
        heading:'#2D2D2D',
        primaryGreen:' #4AB58E',
        primaryPurple:"#A657D6",
        ternaryPurple:'#F6F6FF',
        primaryYellow:'#FFCE384F',
        secondaryPurple:'#6049cd',
        // secondaryPurple:'#b169ef',
        secondaryYellow:'#F3B800',
        ternaryYellow:'#F6A000',
        secondaryGreen:'#4AB58E',
        primaryGreen:'#0BB7834A',
        primaryGreen2:'rgba(11, 183, 131, 0.48)',
        primaryRed:'rgba(250, 124, 124, 0.47)',
        primaryRed2:'rgba(246, 78, 96, 0.63)',
        secondaryRed:'rgba(250, 124, 124, 1)',
        darkRedish:'#EE9494',
        lightRedish:'rgba(248, 170, 170, 0.37)',
        darkOrange:'rgba(249, 169, 90, 1)',
        lightOrange:'rgba(255, 190, 125, 0.37)',
        primaryDarkPurple:'rgba(65, 75, 243, 1)',
        primaryLightPurple:'rgba(65, 75, 243, 0.37)',
        primaryDarkGreen:'rgba(93, 197, 116, 1)',
        primaryLightGreen:'rgba(41, 210, 149, 0.22)',
        secondaryDarkPurple:'rgba(188, 93, 255, 1)',
        secondaryLightPurple:'rgba(217, 170, 248, 0.37)',
        secondaryDarkBlue:'rgba(0, 152, 224, 1)',
        secondaryLightBlue:'rgba(41, 154, 210, 0.22)',




        
      },
      boxShadow: {
       "card":'1px 2px 16px 0px #0000001A',
       'navbar': '0px 1px 4px 0px rgba(0, 0, 0, 0.25)',
       'graph': '0px 4px 4px 0px #00000040',
       'tab': '0px 4px 8px 0px #0000001A',




      },
      backgroundImage: {
        'tile1': "url('/src/images/tile1.png')", // correct path for dev
        'tile2': "url('/src/images/tile2.png')", // correct path for dev
        'tile3': "url('/src/images/tile3.png')", // correct path for dev
        'tile4': "url('/src/images/tile4.png')", // correct path for dev
        'tile5': "url('/src/images/tile5.png')", // correct path for dev
        'sidebar': "url('/src/images/sidebar.webp')", 
        // sidebarGradient: 'linear-gradient(176.38deg, #E53232 4.8%, #737373 48.7%)',
        sidebarGradient: 'linear-gradient(176.93deg, #3294E5 3.76%, #737373 96.74%)',
        heading1: "url('/src/images/heading1.png')",
        // sidebarGradient: 'linear-gradient(176.51deg, #8307EF -15.69%, #737373 82.32%)',
        // sidebarGradient: 'linear-gradient(177.5deg, #6049CD 16.34%, #737373 99.32%)',
      },

    },
  },
  plugins: [],
}

