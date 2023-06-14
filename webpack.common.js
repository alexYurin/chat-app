const path = require('path')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')

const isProduction = process.env.MODE === 'production'

module.exports = {
  entry: {
    app: ['./src/app.ts'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.scss|css$/,
        use: [
          {
            loader: isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin(),
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.pug',
      filename: 'index.html',
      minify: false,
    }),
    new HtmlWebpackPugPlugin(),
  ],
  resolve: {
    extensions: ['.pug', '.ts', '.js', '.scss', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      static: path.resolve(__dirname, 'static'),
      api: path.resolve(__dirname, 'src/api'),
      services: path.resolve(__dirname, 'src/services'),
      layouts: path.resolve(__dirname, 'src/layouts'),
      router: path.resolve(__dirname, 'src/router'),
      styles: path.resolve(__dirname, 'src/styles'),
      views: path.resolve(__dirname, 'src/views'),
      components: path.resolve(__dirname, 'src/components'),
      templators: path.resolve(__dirname, 'src/templators'),
      utils: path.resolve(__dirname, 'src/utils'),
      types: path.resolve(__dirname, 'src/types'),
    },
  },
}
