import React from 'react';
import ReactDOM from 'react-dom';
import Exchange from './Exchange'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './State/store';
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Exchange/>
      </Router>
    </Provider>       
  </React.StrictMode>,
  document.getElementById('root')
);