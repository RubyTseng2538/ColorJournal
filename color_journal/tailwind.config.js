// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],  theme: {
    extend: {
      colors: {
        deepMaroon: "#3A0519",
        maroon: "#670D2F",
        darkPink: "#A53860",
        pink: "#EF88AD",
        lightPink: "#fcebf1"
      }
    }
  },
  plugins: [],
};
