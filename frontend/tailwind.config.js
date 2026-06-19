/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "rgba(30, 30, 30, 0.4)",
        primary: {
          DEFAULT: "#ff5e3a",
          hover: "#e04e2a"
        },
        secondary: {
          DEFAULT: "#00f0ff",
          hover: "#00c3d9"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"]
      }
    },
  },
  plugins: [],
}
