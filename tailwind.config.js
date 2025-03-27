/* eslint-disable sort-keys */

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Roboto"],
    },
    extend: {
      flex: {
        2: "2 2 0%",
      },
      colors: {
        // https://uicolors.app/create
        black: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#000000",
        },
        primary: {
          50: "#f0f7ff",
          100: "#e8f2f8",
          200: "#bbddfc",
          300: "#7fc0fa",
          400: "#3ba1f5",
          500: "#1185e6",
          600: "#0567c4",
          700: "#054f99",
          800: "#094683",
          900: "#0d3c6d",
          950: "#092648",
        },
        secondary: {
          50: "#f1fafe",
          100: "#e3f3fb",
          200: "#bde8f7",
          300: "#88d8f1",
          400: "#48c5e8",
          500: "#21add6",
          600: "#138db6",
          700: "#107094",
          800: "#125f7a",
          900: "#144f66",
          950: "#0e3243",
        },
      },
    },
  },
};
