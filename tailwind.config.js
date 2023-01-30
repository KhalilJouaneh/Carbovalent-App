/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js, ts, tsx, jsx}",
    "./pages/**/*.{html,js, ts, tsx, jsx}",
    './node_modules/tw-elements/dist/js/**/*.js',
    "./components/**/*.{html,js, ts, tsx, jsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
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
    }
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms')
  ],
}
