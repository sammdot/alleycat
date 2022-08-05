const plugin = require("tailwindcss/plugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        brand: {
          50: "#f4faff",
          100: "#d3ecff",
          200: "#bde3ff",
          300: "#81c9ff",
          400: "#50b3ff",
          500: "#0091ff",
          600: "#007edd",
          700: "#0067b6",
          800: "#00518f",
          900: "#003a65",
        },
      },
    },
    fontFamily: {
      sans: [
        "BasierSquare",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      mono: [
        "BasierSquareMono",
        "Menlo",
        "Monaco",
        "Roboto Mono",
        "Courier New",
        "Courier",
        "monospace",
      ],
    },
    variants: {
      extend: {
        backgroundColor: ["active"],
        color: ["active"],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("active", '&[data-state="on"]')
      addVariant("disabled-hover", "&:disabled:hover")
    }),
  ],
}
