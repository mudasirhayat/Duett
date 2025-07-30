import React from 'react';
import ReactDOM from 'react-dom';

import './assets/fonts/Greycliff-Medium.ttf';
import './sass/index.scss';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
