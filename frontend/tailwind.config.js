// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};