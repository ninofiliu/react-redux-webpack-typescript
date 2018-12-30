import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app';
import { store } from './store';

ReactDOM.render(
    (<Provider store={store}><App/></Provider>),
    document.querySelector('#react-root')
);