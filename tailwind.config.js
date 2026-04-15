/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:    '#E6A122',
        crimson: '#840E20',
        maroon:  '#290101',
        wine:    '#591D1F',
        cream:   '#FDF6E3',
      },
      fontFamily: {
        spartan: ['"League Spartan"', 'sans-serif'],
        times:   ['"Times New Roman MT Condensed"', '"Times New Roman"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #290101 0%, #591D1F 50%, #840E20 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E6A122 0%, #c8891c 100%)',
      },
    },
  },
  plugins: [],
}
