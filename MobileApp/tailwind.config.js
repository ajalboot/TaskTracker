/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chineseSilver: "#cccccc",
        interdimensionalBlue: "#5e0acc",
      },
    },
  },
  plugins: [require("tailwindcss-logical")],
};
