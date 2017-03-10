const express = require('express');
const http = require('http');
const https = require('https');
const url = require('url');
const WebSocket = require('ws');
const fs = require('fs');

var sslOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

var app = express();

app.use((req,res)=>{
  res.send({msg:"hello"});
})

var server = https.createServer(sslOptions, app).listen(8082, function listening() {
  console.log('Listening on %d', server.address().port);
});

const wss = new WebSocket.Server({server});
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const MessageState = [];

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try{
      let data = JSON.parse(message);
      if(data.IsMessage){
        console.log(data);
        MessageState.push(data);
      }
      if(data.GetMessages){
        wss.clients.forEach(function each(client) {
          if (client === ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({GetMessages:true,Messages:MessageState}));
          }
        });
      }else{
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    }catch(e){
      console.log('error', message);
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }

  });
});
