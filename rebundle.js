const path = require('path');

module.exports = {
  entry: './out/src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  // Add additional configurations as needed
};