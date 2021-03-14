module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        // Adds a white border to the bottom of a tab so it doesn't interfere with the card shadow
        tab: '0 3px 0 #fff, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['hover'],
    },
  },
  plugins: [],
}
