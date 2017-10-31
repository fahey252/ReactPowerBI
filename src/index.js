import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';       // service workers don't work in all web browsers yet

ReactDOM.render(<App />, document.getElementById('root'));
unregister();

