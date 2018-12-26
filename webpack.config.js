// packages imports
const HtmlWebpackPLugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    
    // webpack will begin its module resolution there...
    entry: './src/index.tsx',

    // ...and outputs it to ./dist/bundle.js
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                // for all files in the source code that ends by .ts or .tsx...
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                // ...transform it in JS thanks to Babel (more below)
                loader: 'babel-loader'
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        // copy ./src/index.html to ./dist/index.html and adds a script tag referencing ./dist/bundle.js
        new HtmlWebpackPLugin({template: './src/index.html'})
    ],
    devServer: {
        // the dev server will serve the content of ./dist (more below)
        contentBase: './dist'
    }
}