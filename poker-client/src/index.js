import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import PlainPoker from './PlainPoker';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  (
    <BrowserRouter>
      <PlainPoker />
    </BrowserRouter>
  ), document.getElementById('root'),
);
registerServiceWorker();
