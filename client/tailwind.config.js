/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*{jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        customCyan: "#17a2b8",
        customGreen: "#cad2c5",
        customSkin: "#fffcf2",
        chatBubble1: "#3b82f6",
        chatMsg1: "#fffcf2",
      },
    },
  },
  daisyui: {
    themes: false,
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
};
