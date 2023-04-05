module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wall: {
          DEFAULT: "#F2F0EA",
        },
      },
      dropShadow: {
        "3xl": "-4px 18px 32px rgba(87, 81, 64, 0.14)",
      },
    },
  },
  plugins: [],
};
