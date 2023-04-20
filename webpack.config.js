const path = require('path')
const defaultConfig = require('@wordpress/scripts/config/webpack.config')

module.exports = {
  ...defaultConfig,
  entry: {
    postTools: path.resolve(process.cwd(), 'assets/js/postTools.ts'),
  },
  output: {
    ...defaultConfig.output,
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].js',
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    ...(defaultConfig.resolve ? defaultConfig.resolve : {}),
    alias: {
      assets: path.resolve(process.cwd(), 'assets/'),
    },
    extensions: [
      '.ts',
      '.tsx',
      ...(defaultConfig.resolve
        ? defaultConfig.resolve.extensions || ['.js', '.jsx']
        : []),
    ],
  },
}
