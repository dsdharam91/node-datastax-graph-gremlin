const secrets = require('../secrets.json');
var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
require('isomorphic-fetch');
 
var app = express()
 
var publicDir = path.join(__dirname, 'public')
 
app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded 
app.get('/', function(req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})
 
var server = http.createServer(app)
 
// Reload code here 
reload(server, app)

server.listen(app.get('port'), function() {
    console.log("Web server listening on port " + app.get('port'));

    const {ip, port, name, auth} = secrets.db;
    fetch(`http://${ip}:${port}/command/${name}/gremlin`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 
            'Authorization': `Basic ${auth}`, 
        },
        body: JSON.stringify({
            command: "g.V().has(prop1)",
            parameters: {
                prop1: 'bar'
            }
        })
    }).then( (response) => response.text().then( x => {

        console.log(JSON.stringify(JSON.parse(x), null, 4))
    })).catch( error => console.error(error));
});