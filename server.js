const express = require('express');
require('dotenv').config(); // loads process.env environment variables

const microsoftApi = require('./server/microsoft-api');

const port = process.env.PORT || 4000;
const app = express();
app.use(express.static('build'));

// for local development ease only, should not be in production build
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // port React live reload running
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// TODO: implement embed token cacheing so a new token is retreived when a new one is needed.
app.get('/powerbi-embedtoken', async (req, res) => {
  const bearerTokenResponse = await microsoftApi.getBearerTokenResponse();
  const bearerToken = bearerTokenResponse.access_token;
  const embedTokenResponse = await microsoftApi.getPowerBiEmbedTokenForBearerToken(bearerToken);
  const embedToken = embedTokenResponse.token;

  res.json(embedToken); // dashboards wont render, 403 forbidden when no/invalid embed token
});

const server = app.listen(port, () => {
  const host = server.address().address;
  const serverPort = server.address().port;

  console.log('App running at //%s:%s', host, serverPort);
});
