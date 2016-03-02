// Common webpack configuration used by other webpack configurations

var path    = require("path");
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    main: [
      "./src/index"
    ]
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
    loaders: []
  },

  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
