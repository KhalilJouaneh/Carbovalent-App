/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js, ts, tsx, jsx}",
    "./pages/**/*.{html,js, ts, tsx, jsx}",
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      height : {
        '128': '42rem',
      },
    },
    borderRadius: {
      '4xl': '1.75rem',
      '5xl': '2rem',
      '8xl': '4rem',
    },
  },
  plugins: [
    require('daisyui'),
    // require('flowbite/plugin'),
  ],
}
