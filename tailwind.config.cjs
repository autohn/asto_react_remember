/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",

  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        darkPC: "#320247",
        superdarkPC: "#1c011c",
        brightPC: "#461678",
        supertbrightPC: "#6a1678",
        lightstarC: "#fefecd",
        starC: "#feec5b",
        darkstarC: "#fe7a39",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "1px 0 10px var(--tw-shadow-color)",
      },
      keyframes: {
        bgb: {
          from: {
            "background-color": "#1c011c",
          },
          "50%": {
            "background-color": "#1ac709",
          },
          to: {
            "background-color": "#1c011c",
          },
        },
        bdgb: {
          from: {
            "background-color": "#1c011c",
          },
          "50%": {
            "background-color": "#1a8607",
          },
          to: {
            "background-color": "#1c011c",
          },
        },
        brb: {
          from: {
            "background-color": "#1c011c",
          },
          "50%": {
            "background-color": "#ba0005",
          },
          to: {
            "background-color": "#1c011c",
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
