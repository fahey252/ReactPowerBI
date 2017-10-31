exports.creds = {
    // Required
    identityMetadata: 'https://login.microsoftonline.com/ajgdemos.onmicrosoft.com/.well-known/openid-configuration', 
    // or equivalently: 'https://login.microsoftonline.com/<tenant_guid>/.well-known/openid-configuration'
    //
    // or you can use the common endpoint
    // 'https://login.microsoftonline.com/common/.well-known/openid-configuration'
    // To use the common endpoint, you have to either set `validateIssuer` to false, or provide the `issuer` value.
  
    // Required, the client ID of your app in AAD  
    clientID: '898dacf7-1f9f-4934-b6bf-a078cd6a40bf',
  
    // Required, must be 'code', 'code id_token', 'id_token code' or 'id_token' 
    responseType: 'code id_token', 
  
    // Required
    responseMode: 'form_post', 
  
    // Required, the reply URL registered in AAD for your app
    redirectUrl: 'http://localhost:3000/auth/openid/return', 
  
    // Required if we use http for redirectUrl
    allowHttpForRedirectUrl: true,
    
    // Required if `responseType` is 'code', 'id_token code' or 'code id_token'. 
    // If app key contains '\', replace it with '\\'.
    clientSecret: 'SyxzkdaG/hMzwtY37LACf6it2iBorC55OKcI5oCBSNw=', 
  
    // Required to set to false if you don't want to validate issuer
    validateIssuer: true,
    
    // Required to set to true if you are using B2C endpoint
    // This sample is for v1 endpoint only, so we set it to false
    isB2C: false,
  
    // Required if you want to provide the issuer(s) you want to validate instead of using the issuer from metadata
    issuer: null,
  
    // Required to set to true if the `verify` function has 'req' as the first parameter
    passReqToCallback: false,
  
    // Recommended to set to true. By default we save state in express session, if this option is set to true, then
    // we encrypt state and save it in cookie instead. This option together with { session: false } allows your app
    // to be completely express session free.
    useCookieInsteadOfSession: true,
  
    // Required if `useCookieInsteadOfSession` is set to true. You can provide multiple set of key/iv pairs for key
    // rollover purpose. We always use the first set of key/iv pair to encrypt cookie, but we will try every set of
    // key/iv pair to decrypt cookie. Key can be any string of length 32, and iv can be any string of length 12.
    cookieEncryptionKeys: [ 
      { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
      { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
    ],
  
    // Optional. The additional scope you want besides 'openid', for example: ['email', 'profile'].
    scope: null,
  
    // Optional, 'error', 'warn' or 'info'
    loggingLevel: 'info',
  
    // Optional. The lifetime of nonce in session or cookie, the default value is 3600 (seconds).
    nonceLifetime: null,
  
    // Optional. The max amount of nonce saved in session or cookie, the default value is 10.
    nonceMaxAmount: 5,
  
    // Optional. The clock skew allowed in token validation, the default value is 300 seconds.
    clockSkew: null,
  };
  
  // Optional.
  // If you want to get access_token for a specific resource, you can provide the resource here; otherwise, 
  // set the value to null.
  // Note that in order to get access_token, the responseType must be 'code', 'code id_token' or 'id_token code'.
  exports.resourceURL = 'https://graph.windows.net';
  
  // The url you need to go to destroy the session with AAD
  exports.destroySessionUrl = 'https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=http://localhost:3000';
  
  // If you want to use the mongoDB session store for session middleware; otherwise we will use the default
  // session store provided by express-session.
  // Note that the default session store is designed for development purpose only.
  exports.useMongoDBSessionStore = false;
  
  // If you want to use mongoDB, provide the uri here for the database.
  exports.databaseUri = 'mongodb://localhost/OIDCStrategy';
  
  // How long you want to keep session in mongoDB.
  exports.mongoDBSessionMaxAge = 24 * 60 * 60;  // 1 day (unit is second)
  