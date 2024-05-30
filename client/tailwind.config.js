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
      },
    },
    screens: {
      sm: "640px", // default Tailwind CSS sm breakpoint
      md: "768px", // default Tailwind CSS md breakpoint
      lg: "1024px", // default Tailwind CSS lg breakpoint
      xl: "1280px", // default Tailwind CSS xl breakpoint
      "2xl": "1536px", // default Tailwind CSS 2xl breakpoint
      // You can customize or add new breakpoints here
    },
  },
  plugins: [require("daisyui")],
};
