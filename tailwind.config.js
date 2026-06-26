/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Anthropic Sans", "Arial", "sans-serif"],
        serif: ["Anthropic Serif", "Georgia", "serif"],
        mono: ["Anthropic Mono", "monospace"],
      },
    },
  },
  plugins: [forms],
};
