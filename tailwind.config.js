/** @type {import('tailwindcss').Config} */
const { colors } = require("./constants");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: colors,
    },
    screens: {
      xs: "320px",
      sm: "380px",
      md: "480px",
      lg: "680px",
      tablet: "744px",
      desktop: "1024px",
    },
  },
};
