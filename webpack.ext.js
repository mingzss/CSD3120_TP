const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    entry: path.resolve(__dirname, 'src/index-ext.ts'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist/ext')
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, 
                loader: "ts-loader"
            }
        ]
    },
    mode: "production",
    plugins: [new NodePolyfillPlugin()]
};