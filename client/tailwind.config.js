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
        darkchatBubble1: "#3b82f6",
        darkchatBubble2: "#4b5563",
        darkchatMsg1: "#fffcf2",
        darkchatMsg2: "#fffcf2",
        lightchatBubble1: "#fff",
        lightchatBubble2: "#3b82f6",
        lightchatMsg1: "#000",
        lightchatMsg2: "#fff",
        darkBg: "#171717",
        lightBg: "#fff",
        darkText1: "#fff",
        darkText2: "#f97316",
        darkText3: "#8b5cf6",
        lightText1: "#000",
        lightText2: "#ec4899",
        LightText3: "#eab308",
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
};
