module.exports = {
  content: ['./assets/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],

  // add a prefix so we don't conflict with other WP plugins
  prefix: 'ntw-',
  corePlugins: {
    // disable preflight so that we don't override WP styles
    preflight: false,
  },
}
