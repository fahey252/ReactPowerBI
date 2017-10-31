import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';
import * as pbi from 'powerbi-client';

ReactDOM.render(<App />, document.getElementById('root'));
unregister();