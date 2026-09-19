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
        'car-card': '0 4px 20px -2px rgba(11, 59, 130, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'car-hover': '0 12px 24px -4px rgba(11, 59, 130, 0.14), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
        'premium': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};
