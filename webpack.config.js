const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PAGES_DIR = `./src/pug/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: `./src/js/app.js`,
    devtool: 'source-map',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].css',
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
        })),
    ],
    module: {
        rules: [
            // js
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
            // css
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ]
            },
            // vue components
            {
                test: /\.vue$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'vue-loader'
            },
            // sass-scss
            {
                test: /\.(sass|scss)$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            // pug pages
            {
                test: /\.pug$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'pug-loader',
                query: {
                    pretty: isDev ? false : true,
                }
            },
            // image optimization
            {
                test: /\.(gif|png|jpe?g)$/i,
                use: [{
                        loader: isDev ? 'url-loader' : 'file-loader',
                        options: {
                            name: '[folder]/[name].[ext]',
                            publicPath: '../',
                            outputPath: '/',
                            emitFile: true,
                            // useRelativePaths: true
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ],
            },
            // svg sprite
            {
                test: /(icons).*\.svg$/,
                use: [{
                        loader: "svg-sprite-loader",
                        options: {
                            esModule: false,
                            extract: true,
                            runtimeCompat: true,
                            spriteFilename: "svg/sprite.svg"
                        }
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { removeAttrs: { attrs: '(fill|fill-rule|stroke|clip-rule)' } },
                                { removeTitle: true },
                                { removeUselessDefs: true },
                                { removeDesc: true },
                                { convertPathData: false },
                                { convertColors: { shorthex: false } },
                                { convertPathData: false }
                            ]
                        }
                    }
                ],
            }
        ]
    },
};