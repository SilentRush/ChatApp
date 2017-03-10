const Server = require('./server.js')
var http = require('http');
var https = require('https');
var fs = require('fs');
const port = (process.env.PORT || 1010)
const app = Server.app()

var sslOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

http.createServer(app).listen(8000);
https.createServer(sslOptions, app).listen(port);
