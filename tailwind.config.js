/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // adjust if your source files are elsewhere
  ],
  theme: {
    extend: {
        fontFamily: {
          sans: ["Inter", "system-ui", "sans-serif"],
        },
    },
  },
  plugins: [],
}
