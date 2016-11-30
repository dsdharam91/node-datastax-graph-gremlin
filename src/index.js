const secrets = require('../secrets.json');
const dse = require('dse-driver');

const express = require('express')
const http = require('http')
const path = require('path')
const reload = require('reload')
const bodyParser = require('body-parser')
const logger = require('morgan')
 
const app = express()
 
const publicDir = path.join(__dirname, 'public')
 
app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) //parses json, multi-part (file), url-encoded 
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})
 
const server = http.createServer(app)
 
// Reload code here 
reload(server, app)

server.listen(app.get('port'), () => {
    console.log("Web server listening on port " + app.get('port'));

    const {ip, username, password, name } = secrets.dse;

    const client = new dse.Client({
        contactPoints: [ip],
        graphOptions: { name },
        authProvider: new dse.auth.DsePlainTextAuthProvider(username, password)
    });

    client.executeGraph('g.V()', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }

        results.forEach( vertex => {
            console.log(vertex);
        })
    });
});

/*
results object properties and methods
[ [ 'object', 'info' ],
  [ 'number', 'length' ],
  [ 'object', 'pageState' ],
  [ 'function', 'first' ],
  [ 'function', 'forEach' ],
  [ 'function', 'toArray' ],
  [ 'function', 'values' ] ]
 */