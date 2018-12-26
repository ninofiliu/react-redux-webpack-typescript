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

We also need to add `./tsconfig.json` so as to insctruct Babel how to handle typescript:

```json
{
    "compilerOptions": {
        "allowJs": true,
        "jsx": "react"
    },
    "include": ["./src"]
}
```

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



## Step 2: React and TypeScript

### The components

React is pretty cool. But you know what's cooler? The Vostok Station in Antartica ([-89°C recorded in July 1983][vostok]). Enough with bad jokes - let's make React cooler by writing it in TypeScript.

First, install React and ReactDOM with their type declarations: React is written is JS, but installing [declaration files][declaration files] allows to type React:

```bash
npm install --save react react-dom
npm install --save-dev @types/react @types/react-dom
```

Now let's build the application. It's going to be an *extremely simple* one consisting of two components:

* `display`: displays '(name) is (age) years old'
* `edit`: inputs to change the name and the age

For now we'll pass everything as static props, but we'll link the two via a redux store later on.

Let's write the display component in `components/display.tsx`:

```js
import * as React from 'react';

export default class Display extends React.Component {
    render() {
        return (
            <p>
                {this.props.name} is {this.props.age} years old.
            </p>
        )
    }
}
```

Oh no! We have errors:

```
[TS2339] property 'name' does not exist on type 'Readonly<{children?: ReactNode}> & ReadOnly<{}>'
[TS2339] property 'age' does not exist on type 'Readonly<{children?: ReactNode}> & ReadOnly<{}>'
```

This is because, as of now, `Display.props` is inherited from `React.Component` and its only valid property is `children`. Let's change `React.Component` to `React.Component<{ name: string, age: number}>`. This instructs `Display.props` to have additional `name` and `age` properties. Error gone!

Let's build the edit component having that in mind. We can define additional state properties just like we can define additional props properties. In `./src/components/edit.tsx`:

```js
import * as React from 'react';

type EditProps = {
    setName: (name: string) => void,
    setAge: (age: number) => void
}
type EditState = {
    name: string,
    age: number
}
export default class Edit extends React.Component<EditProps, EditState> {
    constructor(props) {
        super(props);
        this.state = {
            name: 'James Foobar',
            age: 25
        }
    }
    render() {
        return (
            <div>
                <p>
                    <input
                        value={this.state.name}
                        onChange={evt => this.setState({name: evt.target.value})}
                    />
                    <button onClick={() => this.props.setName(this.state.name)}>
                        Set new name
                    </button>
                </p>
                <p>
                    <input
                        value={this.state.age}
                        onChange={evt => this.setState({age: +evt.target.value})}
                    />
                    <button onClick={() => this.props.setAge(this.state.age)}>
                        Set new age
                    </button>
                </p>
            </div>
        )
    }
}
```

Finally, we wrap them up in an app component. Note that components written as functions can also be typed as show below. In `./src/components/app.tsx`:

```js
import * as React from 'react';

import Display from './display';
import Edit from './edit';

export default (props: {}) => (
    <div>
        <Display
            name={'John Doe'}
            age={20}
        />
        <Edit
            setName={name => alert(`setName(${name}): not coded yet`)}
            setAge={age => alert(`setAge(${age}): not coded yet`)}
        />
    </div>
)
```

### Bootstrapping the app

This is a basic operation when creating a React app, but it also gets abstracted by `react-create-app`.

Change `./src/index.html` so that the body looks like: `<body><div id="react-root"></div></body>`. This will allow React to bootstrap from the `#react-root` element.

Change `./src/index.tsx` to the following:

```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/app';

ReactDOM.render(
    (<App/>),
    document.querySelector('#react-root')
);
```

**Annnnnd we're good to go! Launch `npm run start` and play around with the app you created. We still don't have a redux store to link the components together, but the components should work by themselves now.**



[create-react-app]: https://facebook.github.io/create-react-app/
[angular cli]: https://cli.angular.io/
[github]: https://github.com/ninofiliu/react-redux-webpack-typescript
[webpack]: https://webpack.js.org
[babel]: https://babeljs.io/
[vostok]: https://en.wikipedia.org/wiki/Lowest_temperature_recorded_on_Earth
[declaration files]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html