const path = require('path');
const fs = require('fs');
const util = require("util");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PAGES_DIR = `./src/pug/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))


const svgSpritePath = './dist/svg/sprite.svg';
let svgSprite = false;

try {
  svgSprite = fs.readFileSync(svgSpritePath);
} catch (err) {
  console.log('\x1b[33m%s\x1b[0m', 'Придется перезапустить webpack - для сборки спрайта');
}

module.exports = {
  entry: `./src/js/app.js`,
  output: {
    filename: 'js/[name].js',
    path : path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  optimization: {
    splitChunks:{
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new SpriteLoaderPlugin({
      spriteAttrs: {
        id: 'svg-sprite',
        style: 'position:absolute; left: -20000px; top: -20000px;',
        plainSprite: true
      }
    }),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`,
      templateParameters: {
        svg_sprite: svgSprite ? svgSprite : ''
      }
    })),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ]
      },
      // vue components
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // sass-scss
      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
                sourceMap: true
            }
          }
        ]
      },
      // pug pages
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      // svg sprite
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
                esModule: false,
                extract: true,
                spriteFilename: "svg/sprite.svg"
            }
          }
        ],
      }
    ]
  },
};