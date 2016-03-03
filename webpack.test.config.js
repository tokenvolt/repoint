var config  = require("./webpack.base.config");
var webpack = require("webpack");
var path    = require("path");
var TapWebpackPlugin = require('tap-webpack-plugin')

module.exports = {
  context: __dirname,
  target: 'node',
  entry: {
    main: [
      "./test"
    ]
  },
  output: {
    path: "./dist",
    filename: "repoint.test.js"
  },
  resolve: {
    root: [
            path.join(__dirname, "./src"),
          ],
    extensions: [
      "",
      ".js",
      "config.js"
    ]
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },
  plugins: [
    new TapWebpackPlugin()
  ]
}
