var express = require('express'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 7000,
    app = express();

require('dotenv').config(); // loads process.env environment variables

app.use(express.static('build'));
/*
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
*/

var server = app.listen(port, function () {
    var host = server.address().address,
        port = server.address().port;

    console.log('App running at //%s:%s', host, port);
});