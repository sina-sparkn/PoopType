import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bubblegum: "#FF7AC6",
        sunshine: "#FFD93D",
        mint: "#6BE3B5",
        sky: "#5CC8FF",
        grape: "#9B6BFF",
        tangerine: "#FF9F43",
        "poop-brown": "#8B5A2B",
        cream: "#FFF6E5",
        ink: "#1B1B1F",
      },
      fontFamily: {
        display: ["var(--font-lilita)", "cursive", "sans-serif"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sticker: "6px 6px 0 #1B1B1F",
        "sticker-sm": "3px 3px 0 #1B1B1F",
        "sticker-md": "4px 4px 0 #1B1B1F",
        "sticker-lg": "8px 8px 0 #1B1B1F",
      },
      borderRadius: {
        card: "24px",
        "card-lg": "28px",
      },
    },
  },
};

export default config;
