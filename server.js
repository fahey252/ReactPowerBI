var express = require('express');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var util = require('util');
var bunyan = require('bunyan');
var request = require('request');

require('dotenv').config(); // loads process.env environment variables

const config = require('./config');
const workspaceId = process.env.FAHEY_WORKSPACE_ID || 'No workspace id set';
const reportId = process.env.FAHEY_REPORT_ID || 'No report id set';
const clientId = process.env.FAHEY_CLIENT_ID || 'No client id set';
const clientSecret = process.env.FAHEY_CLIENT_SECRET || 'No client secret set';
const redirectUrl = process.env.FAHEY_REDIRECT_URL || 'No redirect URL set';
const port = process.env.PORT || 3000;

// set up database for express session
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');

// Start QuickStart here
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

var log = bunyan.createLogger({
  name: 'PowerBI Embeded: '
});

/******************************************************************************
 * Set up passport in the app 
 ******************************************************************************/

//-----------------------------------------------------------------------------
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session.  Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
//-----------------------------------------------------------------------------
passport.serializeUser(function (user, done) {
  done(null, user.oid);
});

passport.deserializeUser(function (oid, done) {
  findByOid(oid, function (err, user) {
    done(err, user);
  });
});

// array to hold logged in users
var users = [];

var findByOid = function (oid, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    log.info('we are using user: ', user);
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

//-----------------------------------------------------------------------------
// Use the OIDCStrategy within Passport.
// 
// Strategies in passport require a `verify` function, which accepts credentials
// (in this case, the `oid` claim in id_token), and invoke a callback to find
// the corresponding user object.
// 
// The following are the accepted prototypes for the `verify` function
// (1) function(iss, sub, done)
// (2) function(iss, sub, profile, done)
// (3) function(iss, sub, profile, access_token, refresh_token, done)
// (4) function(iss, sub, profile, access_token, refresh_token, params, done)
// (5) function(iss, sub, profile, jwtClaims, access_token, refresh_token, params, done)
// (6) prototype (1)-(5) with an additional `req` parameter as the first parameter
//
// To do prototype (6), passReqToCallback must be set to true in the config.
//-----------------------------------------------------------------------------
passport.use(new OIDCStrategy({
  identityMetadata: config.creds.identityMetadata,
  clientID: config.creds.clientID,
  responseType: config.creds.responseType,
  responseMode: config.creds.responseMode,
  redirectUrl: config.creds.redirectUrl,
  allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
  clientSecret: config.creds.clientSecret,
  validateIssuer: config.creds.validateIssuer,
  isB2C: config.creds.isB2C,
  issuer: config.creds.issuer,
  passReqToCallback: config.creds.passReqToCallback,
  scope: config.creds.scope,
  loggingLevel: config.creds.loggingLevel,
  nonceLifetime: config.creds.nonceLifetime,
  nonceMaxAmount: config.creds.nonceMaxAmount,
  useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
  cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
  clockSkew: config.creds.clockSkew,
},
  function (iss, sub, profile, accessToken, refreshToken, done) {
    if (!profile.oid) {
      return done(new Error("No oid found"), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByOid(profile.oid, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
));

//-----------------------------------------------------------------------------
// Config the app, include middlewares
//-----------------------------------------------------------------------------
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// app.use(express.logger());
app.use(methodOverride());
app.use(cookieParser());

// set up session middleware
if (config.useMongoDBSessionStore) {
  mongoose.connect(config.databaseUri);
  app.use(express.session({
    secret: 'secret',
    cookie: { maxAge: config.mongoDBSessionMaxAge * 1000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      clear_interval: config.mongoDBSessionMaxAge
    })
  }));
} else {
  app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
}

app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);
// app.use(express.static(__dirname + '/../../public'));

app.use(express.static('build'));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

app.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

var userAuthCache = {}
app.get('/powerbi', function (req, res) {
  var accessToken = userAuthCache.code;
  var options = {
    method: 'POST',
    url: 'https://login.microsoftonline.com/common/oauth2/token',
    headers:
    {
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded'
    },
    form:
    {
      grant_type: 'authorization_code',
      code: accessToken,
      client_id: clientId,
      redirect_uri: redirectUrl,
      client_secret: clientSecret,
      resource: 'https://analysis.windows.net/powerbi/api'
    }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body.access_token);

    const bearerToken = JSON.parse(body).access_token;
    var options = {
      method: 'POST',
      url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/dashboards/${reportId}/GenerateToken`,
      headers:
      {
        'cache-control': 'no-cache',
        authorization: `Bearer ${bearerToken}`,
        'content-type': 'application/json; charset=utf-8'
      },
      body: '{   \n    "accessLevel": "View"\n} '
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      const embedToken = JSON.parse(body || '{}').token
      res.json(embedToken);   // dashboards wont render, 403 forbidden when no embed token
    });
  });
});

app.get('/login',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
        customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    log.info('Login was called in the Sample');
    res.redirect('/');
  });

// 'GET returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// query (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.get(['/auth/openid/return', '/auth/cardinal/powerbi'],
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    log.info('We received a return from AzureAD.');
    res.redirect('/');
  });

// 'POST returnURL'
// `passport.authenticate` will try to authenticate the content returned in
// body (such as authorization code). If authentication fails, user will be
// redirected to '/' (home page); otherwise, it passes to the next middleware.
app.post(['/auth/openid/return', '/auth/cardinal/powerbi'],
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,                      // required
        failureRedirect: '/'
      }
    )(req, res, next);
  },
  function (req, res) {
    log.info('We received a return from AzureAD.');
    userAuthCache = req.body;
    res.redirect('/');
  });

var server = app.listen(port, function () {
  var host = server.address().address,
    port = server.address().port;

  console.log('App running at //%s:%s', host, port);
});