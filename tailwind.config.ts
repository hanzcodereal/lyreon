import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0508",
        surface: "#150b10",
        surface2: "#1e0f16",
        line: "#2c1620",
        rose: {
          DEFAULT: "#e11d5e",
          light: "#ff5c8a",
          dim: "#7a1638",
        },
        gold: "#f4c874",
        ivory: "#f6ece9",
        muted: "#9c8189",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wordmark: "0.35em",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(225,29,94,0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
