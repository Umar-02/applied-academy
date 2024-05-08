module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/customers/*.liquid',
    './templates/*.liquid',
  ],
  theme: {
    colors: {
      primary_text: 'rgb(var(--color-primary))',
      secondary_text: 'rgb(var(--color-secondary))',
      secondary_background: 'rgb(var(--background-secondary) / 1)',
      danger: 'rgb(var(--danger) / 1)'
    },
    extend: {
      fontFamily: {
        'barlow': ['Barlow', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [],
}