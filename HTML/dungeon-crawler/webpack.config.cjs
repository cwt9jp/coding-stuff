const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Dev Server Configuration
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serves files from this directory
    },
    compress: true, // Enables gzip compression
    port: 8080,     // Runs the server on port 8080
    open: true,     // Automatically opens the browser
    hot: true,      // Enables Hot Module Replacement (HMR)
  },
};