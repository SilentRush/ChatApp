var webpack = require('webpack');

module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/public"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude:/(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react','es2015']
        }
      }
    ]
  }
};
