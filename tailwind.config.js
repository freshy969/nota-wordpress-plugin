const defaultTheme = require('tailwindcss/defaultTheme')

const toRem = (px) => {
  return `${px / 16}rem`
}

module.exports = {
  // this nests all tailwind rules under .nota to increase specificity
  // and allows us to reset styles in styles.css without overriding tailwind styles
  important: '.nota',
  content: ['./assets/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: '0px 0px 4px rgba(0, 0, 0, 0.16)',
      },
      fontFamily: {
        sans: ['Manrope', ...defaultTheme.fontFamily.sans],
        google: ['Arial', 'sans-serif'],
      },
      fontSize: {
        'h-900': [
          toRem(28),
          {
            lineHeight: toRem(32),
            fontWeight: 700,
          },
        ],
        'h-800': [
          toRem(24),
          {
            lineHeight: toRem(32),
            fontWeight: 700,
          },
        ],
        'paragraph-xs': [
          toRem(12),
          {
            lineHeight: toRem(12),
            fontWeight: 500,
          },
        ],
        'paragraph-tight': [
          toRem(16),
          {
            lineHeight: toRem(16),
            fontWeight: 400,
          },
        ],
        'paragraph-base': [
          toRem(16),
          {
            lineHeight: toRem(24),
            fontWeight: 500,
          },
        ],
        'paragraph-medium': [
          toRem(18),
          {
            lineHeight: toRem(18),
            fontWeight: 600,
          },
        ],
        'paragraph-large': [
          toRem(20),
          {
            lineHeight: toRem(24),
            fontWeight: 400,
          },
        ],
      },
      spacing: {
        '2px': toRem(2),
        '4px': toRem(4),
        '8px': toRem(8),
        '16px': toRem(16),
        '24px': toRem(24),
        '32px': toRem(32),
        '64px': toRem(64),
      },
    },
    colors: {
      button: {
        default: '#3A7DFF',
        hover: '#2267EC',
        destructive: '#D83E35',
        'destructive-hover': '#BC342C',
      },
      gray: {
        100: '#E9E9E9',
      },
      typography: {
        dark: '#050E21',
        medium: '#5E6064',
        light: '#FFFFFF',
        disabled: '#8B8B8B',
      },
      'gamma-ray': {
        100: '#EBF2FF',
        200: '#D7E5FF',
        400: '#AFCBFF',
        600: '#88B0FF',
        800: '#6096FF',
        900: '#387CFF',
      },
    },
  },
  plugins: [],

  // add a prefix so we don't conflict with other WP plugins
  prefix: 'ntw-',
  corePlugins: {
    // disable preflight so that we don't override WP styles
    preflight: false,
  },
}
