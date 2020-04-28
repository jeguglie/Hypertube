var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = env => {
    return {
        resolve: {
            extensions: ['.js', '.scss', '.css', '.png'],
        },
        entry: ["@babel/polyfill", "./src/index.js"],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            warnings: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true
                        },
                    },
                    parallel: true,
                    cache: true,
                })
            ],
        },
        plugins: [
            // new CopyWebpackPlugin([{from:'src/Assets', to:'assets/'}, 'src/manifest.json']),
            new CopyWebpackPlugin([{from:'src/assets', to:'assets/'}]),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
            }),
            new HtmlWebPackPlugin({
                template: "./public/index.html",
                filename: "./index.html",
            }),
            new CompressionPlugin({
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            new webpack.DefinePlugin({
                    'process.env.REACT_APP_CUSTOM_NODE_ENV' : JSON.stringify(env.REACT_APP_CUSTOM_NODE_ENV),
                    'process.env.REACT_APP_SOCKET_PORT' : JSON.stringify(env.REACT_APP_SOCKET_PORT),
                    'process.env.REACT_APP_SERVER_PORT' : JSON.stringify(env.REACT_APP_SERVER_PORT),
                }),
            new CleanWebpackPlugin(),

        ],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(js)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader',
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }
                    ]
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: "html-loader"
                        }
                    ]
                }
            ]
        },
        mode: 'production',
        output: {
            path: __dirname + '/build',
            filename: 'index.js',
            publicPath: '/'
        },
        devtool: 'source-map',
        devServer: {
            historyApiFallback: true,
            contentBase: './'
        }
    }
};