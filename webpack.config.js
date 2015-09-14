var webpack = require('webpack');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports = {
  entry: __dirname + '/parse.js',
  target: 'node',
  output: {
    filename: 'dist.js',
    path: __dirname
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: [ 'babel-loader'], include: __dirname }
    ]
  },
  externals: nodeModules
}
