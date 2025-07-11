module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fade-in 1s ease-in',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}