# React + Redux + Webpack + TypeScript : Building a front-end from scratch

[`create-react-app`][create-react-app] and [`ng new`][angular cli] are useful tools to quickly create a client application, but they hide an awful lot of actions that are valuable to know about from a developer point of view. Building an application from an empty folder is slower but every line in the source code is fully understood by the developer, and that is **a huge plus**.

In this article, we're going to build a React/Redux app in TypeScript that is built with Webpack, keeping things as simple as possible in every step of the way. The finished code can be found on [this github repo][github].

## Step 1 : NPM, Webpack and Babel

Let's start with the core of the project. Move to the folder project and create these files:

* `./package.json`, file content: `{}`
* `./src/index.tsx`, file content: `console.log('Hello from index.ts');`
* `./src/index.html`, file content below

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
        <p>
            Hello from index.html
        </p>
    </body>
</html>
```

The goal for now is to:

1. transform the source code (only composed of `index.tsx` for now) into into some JS that can be handled by the browser
2. Make `index.html` include this JS
3. Serve `index.html`

[Webpack][webpack] and [Babel][babel] are two tools that can be combined to do that: Babel will transform `.tsx` files into `.js` files that can be understood by Webpack, and Webpack will bundle all the source code into a code that can be served by a server and handled by a browser. Create a `./webpack.config.js` file that contains the following:

```js
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
        extensions: ['.ts', '.tsx']
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
```

We're also going to need the following `./babelrc` file:

```json
{
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
    ],
}
```

To oversimplify a bit, this tells Babel to:

1. Transform `.tsx` into `.jsx` (`@babel/preset-typescript`)
2. Transform `.jsx` into `.js` (`@babel/preset-react`)
3. Transform the remaining `.js` to make it understandable by browsers (`@babel/preset-env`)

We can now launch two useful commands:

* `webpack`: build the whole project into `./dist`
* `webpack-dev-server --open`: like `webpack`, but serves the content of `./dist` and reload upon code change

Let's add them to the script entry of `package.json`, which now must look like:

```json
{
    "scripts": {
        "build": "webpack",
        "start": "webpack-dev-server --open"
    }
}
```

Finally, install required dependencies:

```bash
npm install --save-dev webpack webpack-dev-server html-webpack-plugin webpack-cli
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript babel-loader
```

If everything is working, your app should have the following behavior:

```bash
npm run build
    # creates ./dist/bundle.js, with the code of ./src/index.tsx at the bottom
    # creates ./dist/index.html: similar to ./src/index.html, but a script referencing bundle.js has been added

npm run start
    # builds the project into an in-memory ./dist folder (ie you can't navigate to it)
    # opens your default browser
    # 'Hello from index.html' is being displayed in the page
    # 'Hello from index.tsx' is being displayed in the console
```

**Congratulations! You just done the first step of this tutorial! Reward yourself with some cola or something.**

> NB: if you're following via [my github repo][github], we're now at the commit `Step 1 : NPM, Webpack and Babel`.

[create-react-app]: https://facebook.github.io/create-react-app/
[angular cli]: https://cli.angular.io/
[github]: https://github.com/ninofiliu/react-redux-webpack-typescript
[webpack]: https://webpack.js.org
[babel]: https://babeljs.io/