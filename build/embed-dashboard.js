'use strict'

function setupDashboard(embedToken) {
    const groupId = 'ce7f39cb-7ae5-44ee-92a7-c8d53056b64d';
    const dashboardId = '16c93f42-228d-4d66-a6bc-a4ca9f78bbdd';
    const embedUrl = 'https://app.powerbi.com/dashboardEmbed?dashboardId=' + dashboardId + '&groupId=' + groupId;
    const models = window['powerbi-client'].models;

    // Embed configuration used to describe the what and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
    const config = {
        type: 'dashboard',
        tokenType: models.TokenType.Embed,
        accessToken: embedToken,
        embedUrl: embedUrl,
        id: dashboardId
    };

    const dashboardContainer = window.document.getElementById('dashboardContainer');
    const dashboard = powerbi.embed(dashboardContainer, config);

    // Dashboard.off removes a given event handler if it exists.
    dashboard.off("loaded");

    // Dashboard.on will add an event handler which prints to Log window.
    dashboard.on("loaded", function () {
        Log.logText("Loaded");
    });

    dashboard.on("error", function (event) {
        Log.log(event.detail);

        dashboard.off("error");
    });

    dashboard.off("tileClicked");
    dashboard.on("tileClicked", function (event) {
        Log.log(event.detail);
    });
}

axios.get('/powerbi').then(function (response) {
    const embedToken = response.data;
    setupDashboard(embedToken);
}).catch(function (error) {
    console.log(error);
});