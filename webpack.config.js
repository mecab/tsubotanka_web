const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    style: `${__dirname}/src/css/style.scss`
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'js/[name].js'
  },
  target: ["web", "es2020"],
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false }
          }
        ]
      },
      {
        test: /\.scss/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false },
          },
          "sass-loader",
        ]
      }
    ]
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devServer: {
    static: {
      directory: `${__dirname}/public`
    },
    compress: true,
    port: 3000,
  },
};