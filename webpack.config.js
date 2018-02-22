const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/js/index.js',
    './src/scss/style.scss'
  ],
  output: {
    filename: './dist/js/bundle.js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader?presets=env'
        }
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: ['css-loader?url=false', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'dist/css/style.bundle.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([{
      from: './node_modules/lightgallery/src/img',
      to: './dist/img'
    }]),
  ],
};