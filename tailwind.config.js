module.exports = {

  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'inter': ['"Inter"', 'sans-serif'],
        'display': ['"Inter"'],
        'body': ['"Inter"'],
      },
      colors: {
        green: {
          DEFAULT: '#3FB0B0',
          hover : '#059669',
          ligth: "#36D28F",

        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // import tailwind forms
 ],
}
