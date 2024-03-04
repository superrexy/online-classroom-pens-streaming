import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: {
          "50": "#ebeff2",
          "100": "#dae2e8",
          "200": "#a5b6c4",
          "300": "#778ba1",
          "400": "#314059",
          "500": "#060911",
          "600": "#05070f",
          "700": "#03060d",
          "800": "#02040a",
          "900": "#010308",
          "950": "#010105",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-debug-screens"), require("daisyui")],
};
export default config;
