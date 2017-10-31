# ReactPowerBI

## Links
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
* <https://github.com/Microsoft/PowerBI-JavaScript>
* <https://azure.microsoft.com/en-us/resources/samples/powerbi-react-client/>
* <https://www.npmjs.com/package/powerbi-client>
* <https://github.com/Microsoft/PowerBI-React>

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
* Create `server.js`
* `npm run build`
* Deployment Options > GitHub > Authorize
* Azure Create Web App
* remove /build directory from .gitignore (real app, setup build process)
* add `express`, `body-parser`, `dotenv`
* added node engine version: `"engines":{"node":">= 8.8.1"}`
* moved create-react-app related dependencies as devDependencies. (deploys faster, unecessary remotely.)
