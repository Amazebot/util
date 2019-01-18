const path = require('path')

module.exports = {
  name: 'browser',
  target: 'web',
  mode: 'production',
  context: __dirname,
  node: {
    __dirname: false,
    fs: 'empty',
    child_process: 'empty'
  },
  module: {
    rules: [{ use: 'awesome-typescript-loader', exclude: /node_modules/ }]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  entry: {
    main: path.resolve(__dirname,"bug.js"),
  },
  output: {
      path: path.resolve(__dirname),
      filename: "[name].dist.js"
  },
  entry: __dirname + '/src/index.ts',
  output: {
    library: 'Config',
    path: path.resolve(__dirname + '/lib'),
    filename: 'browser.js'
  }
}
