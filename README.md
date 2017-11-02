# React PowerBI Sample (Proxy User)
Sample NodeJS application to authenticate to Azure Active Directory, get a PowerBI Embed Token and embed PowerBI into a React app via proxy user.

Demo site: <https://fahey-react-powerbi.azurewebsites.net>. Note: may load slow due to shared/free hosting app service plan.

## Getting Started
```bash
$ git clone https://github.com/fahey252/ReactPowerBI
$ npm install   # using node version 9.0.0
$ npm run build  # compiles frontend ReactJS code to /build
$ cp .env.sample .env  # populate environment variable values.
$ node server.js

# Open web browser, go to http://localhost:3000 to see PowerBI embeded in React app
# If this fails, it is likely because values in .env files are not populated correctly.

# Recommend to run for live reload during local development
# Note: if running as same time, client may run before server causing race condition, failed request.
$ nodemon     # assumed installed globally, assumes server.js is the entry point, reloads server code on save
$ npm run start-react # compiles ES6/React on file save
```

## Notes
* Proof of concept, some things done in a non-production way.
* No build process, would have a build process that runs `npm run build` and not keep build artifacts in source control
  - Build artifacts kept in source control for quick deployment to Azure Web App.
* Microsoft code samples use JavaScript/jQuery which isn't ideal in a ReactJS app. Would need to break out into components.
  - PowerBI JavaScript SDK <https://github.com/Microsoft/PowerBI-JavaScript>
  - Weak React support from Microosft: <https://github.com/Microsoft/PowerBI-React>
    + Last commit over a year ago, 3 total commits, 2 contributors at the time of this writing.
* Note handling refresh tokens for the proxy user. New token is regenerate each request. Could be improved/cached.
* Could use axious client and server side instead of `request-promise`
* Can embed tiles, dashboards and reports.
* Can embed for organization or for customers
  - For customers, at least one PowerBI Pro account is needed, acts as a proxy.
  - User that aren't on AAD, will access PowerBI through embed token.
* Security Contexts - App workspaces (previously groups)

## Helpful Links
* Microsft's Sample PowerBI Embedded
  - <https://azurewebsiteexperience.azurewebsites.net>
* PowerBI Pricing
  - <https://azure.microsoft.com/en-us/pricing/details/power-bi-embedded/>
  - Cost per node/number of nodes
* Sample Node Auth for when user owns data: <https://azure.microsoft.com/en-us/resources/samples/active-directory-node-webapp-openidconnect/>
* PowerBI Developer Embedding Getting Started
  - <https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-embedding/>
* PowerBI JavaScript Embed Sample
  - <https://microsoft.github.io/PowerBI-JavaScript/demo/v2-demo/index.html>
* PowerBI Portal: <https://app.powerbi.com>
* Sample PowerBI React Client: <https://azure.microsoft.com/en-us/resources/samples/powerbi-react-client/>
* NPM PowerBI Client: <https://www.npmjs.com/package/powerbi-client>
* PowerBI JavaScript SDK: <https://github.com/Microsoft/PowerBI-JavaScript>
* PowerBI React plugin (not widely contributed to): <https://github.com/Microsoft/PowerBI-React>
* App Owns/User Owns Data Samples: <https://github.com/guyinacube/PowerBI-Developer-Samples>
* React DevTools: <https://fb.me/react-devtools>
* Generating a PowerBI embed token: <https://msdn.microsoft.com/library/mt784614.aspx>
* Registering a PowerBI App: <https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-register-app/>
* Good starting points for Azure Active Directory Auth Flow:
  - <https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devquickstarts-openidconnect-nodejs>
  - <https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS/tree/master>
  - <https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-code>
  - <https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-embed-sample-app-owns-data/>

## High Level Steps
* Create Git Repo
* Start React App
  - <https://github.com/facebookincubator/create-react-app#getting-started>
```bash
npm install -g create-react-app
create-react-app my-app
cd my-app/
npm start
```
* Create Azure Web App
* Deployment Options > GitHub > Authorize
* Rename npm script `start` to `start-react`. add `start: node server.js`.
  - start command conflicts, called by Azure when deploying.
* Create `server.js`
* add `express`, `dotenv`
* Added node engine version: `"engines":{"node":">= 8.8.1"}` to `package.json` for Azure.
* Move `create-react-app` related dependencies as devDependencies. (deploys faster, unecessary remotely.)
* `npm run build` before deploying to Azure to get JavaScript compiled.
* Remove `/build` directory from .gitignore (real app, setup build process)
  - Wouldn't do this for a production based application.
```js
// in src/index.js un register service worker. Not needed, causes page to be white on reload due to invalid manifest.json.
import { unregister } from './registerServiceWorker';
unregister();
//registerServiceWorker();
```
* Set Application settings in Azure Web App with environment variables
* Deploy to Azure
* Embed PowerBI
