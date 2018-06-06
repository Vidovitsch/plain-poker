import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import PlainPoker from './PlainPoker';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  (
    <HashRouter>
      <PlainPoker />
    </HashRouter>
  ), document.getElementById('root'),
);
registerServiceWorker();
