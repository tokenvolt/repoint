var config       = require("./webpack.base.config");
var webpack      = require("webpack");
var path         = require("path");

config.output = {
  path: "./dist",
  filename: "repoint.min.js",
  library: 'Repoint',
  libraryTarget: 'umd'
};

config.module.loaders.push(
  { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
  { test: /\.js$/, exclude: [/node_modules/, /src\/ramda/], loader: "eslint-loader" }
);

config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false, // Babel 6 throws error on source-map generation ( see https://github.com/babel/babel/issues/2864 )
    compress: {
      warnings: false
    }
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify("production")
    }
  })
)

module.exports = config;
