

module.exports =  {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    
  ],
  theme: {
    extend: {
        colors: {
            primary: "#035c66",
            "primary-content": "#6decfb",
            "primary-dark": "#022f34",
            "primary-light": "#048997",

            secondary: "#3e0366",
            "secondary-content": "#c26dfb",
            "secondary-dark": "#200234",
            "secondary-light": "#5c0497",

            background: "#eff1f1",
            foreground: "#fbfbfb",
            border: "#dde1e2",

            copy: "#232929",
            "copy-light": "#5e6c6e",
            "copy-lighter": "#849395",

            success: "#036603",
            warning: "#666603",
            error: "#660303",

            "success-content": "#6dfb6d",
            "warning-content": "#fbfb6d",
            "error-content": "#fb6d6d"
        },
    }
},
  plugins: [],
};


