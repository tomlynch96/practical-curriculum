import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#1a1a2e",
          light: "#2d2d4e",
        },
        slate: {
          lab: "#f0f2f5",
        },
        acid: {
          DEFAULT: "#c8f135",
          dark: "#a8cc1a",
        },
        chalk: {
          DEFAULT: "#ffffff",
          off: "#f8f9fa",
        },
        coral: "#ff6b6b",
        sky: "#4ecdc4",
      },
      borderRadius: {
        lab: "2px",
      },
    },
  },
  plugins: [],
};

export default config;