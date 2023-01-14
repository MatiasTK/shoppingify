/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F9A109',
        secondary: '#56CCF2',
        mainBg: '#FAFAFE',
        primaryBg: '#FFF0DE',
        cardBg: '#80485B',
        redBg: '#EB5757',
        smallText: '#828282',
        borderColor: '#cccccd',
      },
    },
  },
};
