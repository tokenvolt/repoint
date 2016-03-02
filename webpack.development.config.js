// Run like this:
// cd client && webpack-dev-server --config webpack.development.config.js --hot --colors --progress --inline

var config       = require("./webpack.base.config");
var webpack      = require("webpack");
var path         = require("path");

config.debug = true;
config.displayErrorDetails = true;

config.output = {
  path: "./dist",
  filename: "repoint.js"
};

config.module.loaders.push(
  { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
  { test: /\.js$/, exclude: [/node_modules/, /src\/ramda/], loader: "eslint-loader" }
);

config.plugins.push(
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify("development")
    }
  })
)

module.exports = config;
