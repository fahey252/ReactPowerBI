import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Report from 'react-powerbi';

class App extends Component {
  onEmbedded(embed) {
    console.log(`Report embedded: `, embed, this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
      </div>
    );
  }
}

export default App;
