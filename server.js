const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

require('dotenv').config(); // loads process.env environment variables

const config = require('./config');
const workspaceId = process.env.FAHEY_WORKSPACE_ID || 'No workspace id set';
const reportId = process.env.FAHEY_REPORT_ID || 'No report id set';
const clientId = process.env.FAHEY_CLIENT_ID || 'No client id set';
const clientSecret = process.env.FAHEY_CLIENT_SECRET || 'No client secret set';
const proxyUserAuthUrl = process.env.FAHEY_PROXY_USER_AUTH_URL || 'No proxy user auth url set';
const proxyUserUsername = process.env.FAHEY_PROXY_USER_USERNAME || 'No proxy username set';
const proxyUserPassword = process.env.FAHEY_PROXY_USER_PASSWORD || 'No proxy user password set';
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('build'));

app.get('/powerbi-embedtoken', function (req, res) {
  const options = {
    method: 'POST',
    url: proxyUserAuthUrl,
    headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data'
    },
    formData:
    {
      resource: 'https://analysis.windows.net/powerbi/api',
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'password',
      username: proxyUserUsername,
      password: proxyUserPassword,
      scope: 'openid'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    const bearerToken = JSON.parse(body || '{}').access_token
    var options = {
      method: 'POST',
      url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/dashboards/${reportId}/GenerateToken`,
      headers:
      {
        'cache-control': 'no-cache',
        authorization: `Bearer  ${bearerToken}`,
        'content-type': 'application/json; charset=utf-8'
      },
      body: '{"accessLevel": "View"}'
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      const embedToken = JSON.parse(body || '{}').token
      res.json(embedToken);   // dashboards wont render, 403 forbidden when no embed token
    });
  });
});

var server = app.listen(port, function () {
  var host = server.address().address,
    port = server.address().port;

  console.log('App running at //%s:%s', host, port);
});