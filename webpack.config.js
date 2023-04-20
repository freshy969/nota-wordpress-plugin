const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    postTools: "./assets/js/tools.ts",
  },
  output: {
    ...defaultConfig.output,
    path: path.resolve("dist", "js"),
    filename: "[name].js",
  },
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ...(defaultConfig.resolve
        ? defaultConfig.resolve.extensions || [".js", ".jsx"]
        : []),
    ],
  },
};
