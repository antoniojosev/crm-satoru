import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presentation/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        surface: "#1E1E1E",
        "surface-highlight": "#2A2A2A",
        primary: {
          DEFAULT: "#FF5500",
          dark: "#CC4400",
        },
        text: {
          main: "#FFFFFF",
          muted: "#A0A0A0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
