module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    inset: {
      '0': '0px',
      '1.5': '1.5%',
      '2.5': '2.5%',
      '5': '5%',
      '10': '10%',
      '15': '15%',
      '20': '20%',
      '25': '25%',
      '30': '30%',
      '33': '33.33%',
      '40': '40%',
      '45': '45%',
      '50': '50%', 
      '55': '55%', 
      '70': '70%',   
      '75': '75%',    
      '85': '85%',    
      '100': '100%',
    },
    colors: {
      transparent: 'transparent',
      'coral': '#FA9269',
      'night': '#08040d',
      'night30': '#08040d30',
      'blush': '#FFF2D9',
      'grey': '#d4d3cf',
      'white': '#ffffff',
      'white60': '#ffffff60',
      'white90': '#ffffff90',
      'yellow': '#FFC043',
      'pink' : '#FFD7D2',
      'green' : '#06C167'
      
    },
    screens: {
      sm: '480px',
      md: '1025px',
      xl: '1441px',
    },
    fontFamily: {
      poppins: ['Poppins'],
      mulish: ['Mulish'],
    },
    
    extend: {
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
