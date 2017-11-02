const request = require('request-promise');

const clientId = process.env.FAHEY_CLIENT_ID || 'No client id set';
const clientSecret = process.env.FAHEY_CLIENT_SECRET || 'No client secret set';
const proxyUserAuthUrl = process.env.FAHEY_PROXY_USER_AUTH_URL || 'No proxy user auth url set';
const proxyUserUsername = process.env.FAHEY_PROXY_USER_USERNAME || 'No proxy username set';
const proxyUserPassword = process.env.FAHEY_PROXY_USER_PASSWORD || 'No proxy user password set';

const workspaceId = 'ce7f39cb-7ae5-44ee-92a7-c8d53056b64d';
const reportId = '16c93f42-228d-4d66-a6bc-a4ca9f78bbdd';

const microsoftApi = {
  getBearerTokenResponse: async () => {
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
      },
      json: true
    };

    return request(options);
  },

  getPowerBiEmbedTokenForBearerToken: async (bearerToken) => {
    const options = {
      method: 'POST',
      url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/dashboards/${reportId}/GenerateToken`,
      headers:
      {
        'cache-control': 'no-cache',
        authorization: `Bearer  ${bearerToken}`,
        'content-type': 'application/json; charset=utf-8'
      },
      body: {
        accessLevel: 'View'
      },
      json: true
    };

    return request(options);
  }
};

module.exports = microsoftApi;
