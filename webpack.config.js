const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetPlugin = require('css-minimizer-webpack-plugin') 
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
        //     {
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {
        //         hmr: isDev,
        //         reloadAll: true
        //     },
        //   }, 
        'style-loader',
          'css-loader'
        ]

        if(extra) {
            loaders.push(extra)
        }

        return loaders
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env',
        ]         
    }

if(preset) {
    opts.presets.push(preset)
}

    return opts
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
      }]

      if(isDev) {
        loaders.push('eslint-loader')
      }

    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Webpack Oleh',
            template: './index.html',
            minify: {
                collapseWhitespace: isDev
            }
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin([
        //             {
        //                 from: path.resolve(__dirname, 'src/favicon.ico'),
        //                 to: path.resolve(__dirname, 'dist')
        //             }
        // ])
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },{
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            // {
            //     test: /\.(png|jpg|svg|git)$/i,
            //     use: ['file-loader']
            // }
            // {
            //     test: /\.(ttf|woff|woff|eot)$/,
            //     use: ['file-loader']
            // }
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                  loader: 'babel-loader',
                  options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                  loader: 'babel-loader',
                  options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
}