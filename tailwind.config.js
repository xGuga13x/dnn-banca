/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tdb: {
          green:  '#7ab800',
          orange: '#f5821f',
          dark:   '#2d4a1e',
          light:  '#f4f9ec',
          soft:   '#fff8f2',
        }
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body:    ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
