const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/app.js',
  devtool: 'source-map',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'assets'),
        publicPath: '/assets',
      }
    ],
    port: 8080,
    // open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
    allowedHosts: 'all'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    // filename: 'bundle.js',
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: '[name][ext]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Index',
      filename: 'index.html',
      template: 'src/index.html'
    }),
  ]
};