# ReactPowerBI
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
```

## Notes
* Proof of concept, some things done in a non-production way.
* No build process, would have a build process that runs `npm run build` and not keep build artifacts in source control
  - Build artifacts kept in source control for quick deployment to Azure Web App.
* Microsoft code samples use JavaScript/jQuery which isn't ideal in a ReactJS app. Would need to break out into components.
  - PowerBI JavaScript SDK <https://github.com/Microsoft/PowerBI-JavaScript>
  - Weak React support from Microosft: <https://github.com/Microsoft/PowerBI-React>
    + Last commit over a year ago, 3 total commits, 2 contributors at the time of this writing.
* Can embed tiles, dashboards and reports.
* Can embed for organization or for customers
  - For customers, at least one PowerBI Pro account is needed, acts as a proxy.
  - User that aren't on AAD, will access PowerBI through embed token.
* Security Contexts - App workspaces (previously groups)

## Helpful Links
* Demo: <https://fahey-react-powerbi.azurewebsites.net>
* Sample PowerBI Embedded
  - <https://azurewebsiteexperience.azurewebsites.net/>
* PowerBI Pricing
  - <https://azure.microsoft.com/en-us/pricing/details/power-bi-embedded/>
  - Cost per node/number of nodes
* <https://azure.microsoft.com/en-us/resources/samples/active-directory-node-webapp-openidconnect/>
* Developer Embedding
  - <https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-embedding/>
* JavaScript embed sample
  - <https://microsoft.github.io/PowerBI-JavaScript/demo/v2-demo/index.html>
* <https://powerbi.microsoft.com/en-us/power-bi-embedded/>
* <https://app.powerbi.com>
* <https://azure.microsoft.com/en-us/resources/samples/powerbi-react-client/>
* <https://www.npmjs.com/package/powerbi-client>
* <https://github.com/Microsoft/PowerBI-JavaScript>
* <https://github.com/Microsoft/PowerBI-React>
* <https://github.com/guyinacube/PowerBI-Developer-Samples>
* React DevTools: <https://fb.me/react-devtools>
* Generating a PowerBI embed token. <https://msdn.microsoft.com/library/mt784614.aspx>
* <https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-register-app/>
* <https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devquickstarts-openidconnect-nodejs>
* Azure Active Directory Authentication Flow
* <https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS/tree/master>
* <https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-protocols-oauth-code>
* <https://powerbi.microsoft.com/en-us/documentation/powerbi-developer-embed-sample-app-owns-data/>

## Agenda
* Start React App
* Create Azure Web App
* Deploy to Azure
* Embed PowerBI

## Scratchpad Notes
* Create GitHub Repo
* Bootstrap new app via Create React App. <https://github.com/facebookincubator/create-react-app#getting-started>
```
npm install -g create-react-app

create-react-app my-app
cd my-app/
npm start
```
* Rename npm script `start` to `start-react`. add `start: node server.js`
* Create `server.js`
* `npm run build`
* Deployment Options > GitHub > Authorize
* Azure Create Web App
* remove /build directory from .gitignore (real app, setup build process)
* add `express`, `dotenv`
* added node engine version: `"engines":{"node":">= 8.8.1"}`
* moved create-react-app related dependencies as devDependencies. (deploys faster, unecessary remotely.)
```js
// in src/index.js un register service worker. Not needed, causes page to be white on reload due to invalid manifest.json.
import { unregister } from './registerServiceWorker';
unregister();
//registerServiceWorker();
```
* Set Application settings in Azure Web App with environment variables
