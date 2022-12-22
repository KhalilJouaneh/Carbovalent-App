/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js, ts, tsx, jsx}",
    "./pages/**/*.{html,js, ts, tsx, jsx}",
  ],
  theme: {
    extend: {
      margin: {
        'half-screen' : '-50vw',
      },
    },
  },
  plugins: [require('daisyui')],
}
