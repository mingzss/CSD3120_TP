const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
            }
        ]
    },
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        //static: true,
        port: 3000,
        server: 'http'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        }),
        new CopyPlugin({
            patterns: [
                {from: path.resolve(__dirname, 'public')}
            ]
        }),
        new NodePolyfillPlugin()
    ]
};