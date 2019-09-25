const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

class Without {
  constructor(patterns) {
    this.patterns = patterns;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('MiniCssExtractPluginCleanup', (compilation, callback) => {
      Object.keys(compilation.assets)
        .filter(asset => {
          let match = false,
            i = this.patterns.length
            ;
          while (i--) {
            if (this.patterns[i].test(asset)) {
              match = true;
            }
          }
          return match;
        }).forEach(asset => {
          delete compilation.assets[asset];
        });

      callback();
    });
  }
}

const esLintOptions = {
  fix: true
};

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  // Enable sourcemaps for debugging webpack's output.
  devtool: (devMode) ? 'source-map' : 'eval-source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  entry: {
    'assets/js/app': './app/root.tsx'
  },
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader'
          },
          {
            loader: 'eslint-loader',
            options: esLintOptions
          }
        ]
      },
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: esLintOptions
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: '/assets/fonts',
            outputPath: './assets/fonts/'
          }
        }]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: '/assets/img',
            outputPath: './assets/img/'
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/styles.css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new Without([/styles.js(\.map)?$/]), // just give a list with regex patterns that should be excluded
    new HtmlWebpackPlugin({
      hash: true,
      title: 'My React Template - Change this',
      template: './app/index.html',
      filename: 'index.html' //relative to root of the application
    }),
    new CopyPlugin([
      { from: './assets/static', to: './' }
    ]),
  ],

  externals: {
    /*
    'react': 'React',
    'react-dom': 'ReactDOM'
    */
  },
  devServer: {
    overlay: true
  }
};
