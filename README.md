# ReactPowerBI

## Helpful Links
* Demo: <https://fahey-powerbi-react.azurewebsites.net>
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

## Notes
* Can embed dashboard and reports
* Can embed for organization or for customers
  - For customers, at least one PowerBI Pro account is needed, acts as a proxy.
  - User that aren't on AAD, will access PowerBI through embed token.
* Security Contexts - App workspaces (previously groups)

## Agenda
* Start React App
* Create Azure Web App
* Deploy to Azure
* Embed PowerBI

## Steps
* Primarily JavaScript. 
* Create GitHub Repo
* <https://github.com/facebookincubator/create-react-app#getting-started>
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
* add `express`, `body-parser`, `dotenv`
* added node engine version: `"engines":{"node":">= 8.8.1"}`
* moved create-react-app related dependencies as devDependencies. (deploys faster, unecessary remotely.)
```js
// in src/index.js un register service worker. Not needed, causes page to be white on reload due to invalid manifest.json.
import { unregister } from './registerServiceWorker';
unregister();
//registerServiceWorker();
```