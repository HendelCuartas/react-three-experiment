const webpack = require('webpack');
const stylusLoader = require("stylus-loader");

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.styl$/,
            use: [
              'style-loader',
              'css-loader',
              'stylus-loader',
            ],
          },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new stylusLoader.OptionsPlugin({
          default: {
              use: [
                  require("nib")(),
                  require("rupture")(),
                  require("poststylus")([
                      require("rucksack-css")({
                          autoprefixer: false,
                          fallbacks: false
                      }),
                      require("lost")()
                  ])
              ],
              import: [
                  "~nib/lib/nib/index.styl",
                  "~rupture/rupture/index.styl"
              ]
          }
      })
    ],
    devServer: {
        contentBase: './dist',
        port: '8888'
    }
};