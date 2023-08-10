/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'j-dark': '#023047',
        'j-blue': '#264653',
        'j-green': '#2A9D8F',
        'j-yellow': '#E9C46A',
        'j-orange': '#F4A261',
        'j-red': '#E76F51',
        'j-card': '#FFFFFF',
        'p-red': '#F06B64',
        'p-gray': '#18191D',
        's-gray': '#242426',
      },
    },
    fontFamily: {
      'p-light': ['Poppins-Light'],
      'p-regular': ['Poppins-Regular'],
      'p-bold': ['Poppins-Bold'],
    },
  },
  plugins: [],
};
