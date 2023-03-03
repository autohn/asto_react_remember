/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  daisyui: {
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: "",

    themes: [
      {
        mytheme: {
          primary: "#222B19", //cooBlackOlive
          "primary-focus": "#32381A",
          "primary-content": "#CFCFCE", //cooTimberWolf
          neutral: "#000000", //cooBlackOlive
          "neutral-focus": "#32381A",
          "neutral-content": "#CFCFCE", //cooTimberWolf
          accent: "#32381A", //cooBlackOlive
          secondary: "#4C5A3A", //cooDarkMossGreen
          "base-100": "#455A59", //cooFeldgrau
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
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
        greenSD: "#021b02",
        greenD: "#034801",
        greenM: "#057d03",
        greenL: "#07a004",
        greenSL: "#08c605",
        cooDarkBlackOlive: "#11150c", //под текст
        cooBlackOlive: "#222B19", //кнопки
        cooDrabDarkBrown: "#32381A", //ховер кнопок
        cooDarkMossGreen: "#4C5A3A",
        cooTimberWolf: "#CFCFCE", //текст
        cooFeldgrau: "#455A59", //поля ввода
        error: "#F87272",
      },

      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "1px 0 10px var(--tw-shadow-color)",
      },
      keyframes: {
        bgb: {
          from: {
            "background-color": "#222B19",
          },
          "50%": {
            "background-color": "#1ac709",
          },
          to: {
            "background-color": "#222B19",
          },
        },
        bdgb: {
          from: {
            "background-color": "#222B19",
          },
          "50%": {
            "background-color": "#1a8607",
          },
          to: {
            "background-color": "#222B19",
          },
        },
        brb: {
          from: {
            "background-color": "#222B19",
          },
          "50%": {
            "background-color": "#ba0005",
          },
          to: {
            "background-color": "#222B19",
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
    require("daisyui"),
  ],
};
