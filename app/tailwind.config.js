

module.exports =  {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          300: '#CCC',
          500: '#A0AEC0',
        },
      },
      spacing: {
        2.5: '10px',
        10: '40px',
        75: '300px',
      },
    },
  },
  plugins: [],
};


