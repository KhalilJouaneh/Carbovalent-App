/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js, ts, tsx, jsx}",
    "./pages/**/*.{html,js, ts, tsx, jsx}",
    './node_modules/tw-elements/dist/js/**/*.js',
    "./components/**/*.{html,js, ts, tsx, jsx}",
  ],
  theme: {
    extend: {
      height : {
        '128': '42rem',
      },
      gridAutoRows: {
        '1fr': 'minmax(0,1fr)',
      },
    },
    borderRadius: {
      '4xl': '1.75rem',
      '5xl': '2rem',
      '8xl': '4rem',
      'full': '9999px',
    },
  },
  plugins: [
    require('daisyui'),
  ],
}
