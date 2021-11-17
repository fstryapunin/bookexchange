import React from 'react';
import ReactDOM from 'react-dom';
import Exchange from './Exchange'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Exchange/>
    </Router>       
  </React.StrictMode>,
  document.getElementById('root')
);