/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
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
  },
  plugins: [],
}
