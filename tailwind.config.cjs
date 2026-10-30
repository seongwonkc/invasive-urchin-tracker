/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050a14",
          900: "#081120",
          850: "#0c1830",
          800: "#11203d",
          700: "#1b2d50",
          600: "#2a3f66",
        },
        foam: "#e8f0fb",
        mist: "#9fb0cc",
        urchin: {
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        uni: {
          300: "#ffc785",
          400: "#ffb054",
          500: "#ff9a2e",
        },
        kelp: {
          300: "#8fe0b0",
          400: "#5ccf8e",
          500: "#34b373",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ["\"Instrument Sans\"", "system-ui", "-apple-system", '"Segoe UI"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
