const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/index.js'],
    admin: ['babel-polyfill', './admin/index.js']
  },
  resolve: {
    extensions: ['.js', '.css', '.scss'],
    alias: {
      normalize: path.join(__dirname, '/node_modules/normalize.css'),
      grid: path.join(__dirname, '/node_modules/bootstrap-4-grid/css/grid.min.css'),
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    inline: true,
    host: '0.0.0.0',
    historyApiFallback: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]'
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ],
      },
    ]
  },
  plugins: [
    new Dotenv(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:6].css",
    }),
    new HtmlWebPackPlugin({
      title: 'Frontend',
      chunks: ['app'],
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new HtmlWebPackPlugin({
      title: 'Admin',
      chunks: ['admin'],
      template: "./admin/index.html",
      filename: "./admin.html"
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/favicon.ico'
        },
        {
          from: './src/manifest.json'
        },
        {
          from: './src/browserconfig.xml'
        },
        {
          from: './src/manifest',
          to: path.resolve(__dirname, 'public', 'manifest')
        },
      ]
    })
  ],
  output: {
    filename: '[name].[contenthash:6].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  }
};
