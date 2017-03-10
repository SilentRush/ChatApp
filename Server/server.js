const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8082});
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const MessageState = [];

wss.on('connection', function connection(ws) {
  console.log(ws);
  ws.on('message', function incoming(message) {
    try{
      let data = JSON.parse(message);
      if(data.IsMessage){
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
