/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0b3b82",
          darkBlue: "#072352",
          lightBlue: "#1e5ebd",
          red: "#d9232d",
          darkRed: "#b01720",
          nexa: "#0f172a",
          gold: "#eab308",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'car-card': '0 10px 30px -5px rgba(11, 59, 130, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'car-hover': '0 20px 35px -10px rgba(11, 59, 130, 0.18), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
