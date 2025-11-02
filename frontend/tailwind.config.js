/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary, #6ED3B5)',
        'secondary': 'var(--color-secondary, #4A90E2)',
        'accent': 'var(--color-accent, #CBA6F7)',
        'highlight': 'var(--color-highlight, #FFCBA4)',
        'background': 'var(--color-background, #F9F9F9)',
        'text-main': 'var(--color-text, #4B4B4B)',
      },
    },
  },
  plugins: [],
}
