module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
      },
      height: {
        110: "27rem",
      },
      width: {
        90: "23rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
