const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => ({
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
      },
    ]
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    ...argv.mode === 'production' ? [ new CssMinimizerPlugin() ] : [],
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img'),
          to: path.resolve(__dirname, 'dist/img'),
        },
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new ImageMinimizerPlugin({
      test: /\.(png|jpe?g)$/i,
      loader: false,
      minimizer: [
        {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            encodeOptions: {
              oxipng: {
                level: 5,
              },
            },
          }
        },
        {
          filter: (_, sourcePath) => (/_512w\.(png|jpe?g)$/i).test(sourcePath),
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            resize: {
              enabled: true,
              width: 512,
            },
            encodeOptions: {
              oxipng: {
                level: 5,
              },
            },
          }
        }
      ]
    }),
  ],
  devServer: {
    static: {
      directory: `${__dirname}/public`
    },
    compress: true,
    port: 3000,
  },
});