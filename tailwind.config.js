const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        sng: ["SNG Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        wall: {
          DEFAULT: "#F2F0EA",
        },
        red: {
          DEFAULT: "#B43244",
        },
        green: {
          DEFAULT: "#31FF00",
        },
      },
      dropShadow: {
        "3xl": "-4px 18px 32px rgba(87, 81, 64, 0.14)",
      },
      screens: {
        "2xl": "1800px",
      },
      animation: {
        bounce: "bounce 1s infinite",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateX(-25%)" },
          "50%": { ttransform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
}
