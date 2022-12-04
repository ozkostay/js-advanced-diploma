const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtrackPluin = require('mini-css-extract-plugin');

module.export = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ls$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        use: [
          MiniCSSExtrackPluin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    new MiniCSSExtrackPluin()
  ]
  
};
