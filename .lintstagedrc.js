const path = require('path')

const buildEslintCommand = (filenames) =>
  `yarn eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`

module.exports = {
  '*.{js,ts,jsx,tsx}': [buildEslintCommand],
  '*.{js,ts,jsx,tsx,json,md}': 'prettier --write',
  // will lint files but will not fix them
  // getting phpcbf to play nicely here is a bit of a pain
  '*.php': ['./vendor/bin/phpcs -n -p'],
}
