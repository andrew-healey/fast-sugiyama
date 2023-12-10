const path = require('path');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.ts', // Path to your main TypeScript file
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, path.resolve(__dirname, 'src/test/')], // Exclude node_modules and src/test/
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle-new.js',
    path: path.resolve(__dirname, 'dist'),
  },
};