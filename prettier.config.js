module.exports = {
  plugins: [require('prettier-plugin-tailwindcss')],
  arrowParens: 'always',
  bracketSameLine: false,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 68,
        useTabs: false,
        trailingComma: 'none',
      },
    },
  ],
}
