/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",

  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        darkPC: "#320247",
        brightPC: "#461678",
        supertbrightPC: "#6a1678",
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
            "background-color": "rgb(219 234 254)",
          },
          "50%": {
            "background-color": "rgb(209 250 229)",
          },
          to: {
            "background-color": "rgb(219 234 254)",
          },
        },
        bdgb: {
          from: {
            "background-color": "rgb(219 234 254)",
          },
          "50%": {
            "background-color": "rgb(34 197 94)",
          },
          to: {
            "background-color": "rgb(219 234 254)",
          },
        },
        brb: {
          from: {
            "background-color": "rgb(219 234 254)",
          },
          "50%": {
            "background-color": "rgb(252 165 165)",
          },
          to: {
            "background-color": "rgb(219 234 254)",
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
