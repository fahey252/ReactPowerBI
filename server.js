const express = require('express');
require('dotenv').config(); // loads process.env environment variables

const microsoftApi = require('./server/microsoft-api');

const port = process.env.PORT || 3000;
const app = express();
app.use(express.static('build'));

app.get('/powerbi-embedtoken', async (req, res) => {
  const bearerTokenResponse = await microsoftApi.getBearerTokenResponse();
  const bearerToken = bearerTokenResponse.access_token;
  const embedTokenResponse = await microsoftApi.getPowerBiEmbedTokenForBearerToken(bearerToken);
  const embedToken = embedTokenResponse.token;

  res.json(embedToken); // dashboards wont render, 403 forbidden when no embed token
});

const server = app.listen(port, () => {
  const host = server.address().address;
  const serverPort = server.address().port;

  console.log('App running at //%s:%s', host, serverPort);
});
