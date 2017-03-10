var express = require('express');
const path = require('path');
module.exports = {
  app: function () {
    const app = express()
    const indexPath = path.join(__dirname, 'index.html');
    const publicPath = express.static('public');
    app.use(express.static('public'))
    app.use('/', function(req, res) {
        res.sendFile('index.html', {
            root: __dirname
        });});
    return app
  }
}
