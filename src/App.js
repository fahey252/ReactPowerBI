import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Report from 'react-powerbi';
import axios from 'axios';
import powerbi from 'powerbi-client'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      embedToken: ''
    }
  }

  onEmbedded(embed) {
    console.log(`Report embedded: `, embed, this);
  }

  async getEmbedToken() {
    const localDevUrl = 'http://localhost:3000';
    const localDevServerUrl = 'http://localhost:4000';
    const hostname = window.location.href.indexOf(localDevUrl) === 0 ? localDevServerUrl : '';
    const endpoint = `${hostname}/powerbi-embedtoken`;

    axios.get(endpoint).then((response) => {
      const embedToken = response.data;

      this.setState({
        embedToken: embedToken
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  async componentWillMount() {
    await this.getEmbedToken();
  }

  render() {
    const groupId = 'ce7f39cb-7ae5-44ee-92a7-c8d53056b64d';
    const dashboardId = '16c93f42-228d-4d66-a6bc-a4ca9f78bbdd';
    const embedUrl = `https://app.powerbi.com/dashboardEmbed?dashboardId=${dashboardId}&groupId=${groupId}`;
    const { embedToken } = this.state;
    const models = powerbi.models;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        {embedToken &&
          <div>
            <Report
              type='dashboard'
              id={dashboardId}
              tokenType={models.TokenType.Embed}
              embedUrl={embedUrl}
              accessToken={embedToken}
              onEmbedded={this.onEmbedded}
            />
          </div>
        }
      </div>
    );
  }
}

export default App;
