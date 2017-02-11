'use strict';

var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser');

const PORT = 8088;

var connections = [], locations = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  false}));

server.listen(PORT);

console.log('Listening on ' + PORT);

app.get('/', function (req, res) {
  res.send('Hello from L26 242 Exhibition St! Woohoooooooooooooo!');
});

app.get('/location', function (req, res) {
  res.json(locations);  
});

app.post('/location', function (req, res) {
  
  console.log(req.body);

  var loc = {
    lon: req.body.lon,
    lat: req.body.lat
  }
  
  addLocation(loc);

  res.json(loc);
});

io.on('connection', function (socket) {
  connectons.push(socket);
  
  console.log('Connection added:');
  console.log(socket);

  socket.on('disconnect', function() {
    removeConnection(socket);
  })
});

function removeConnection(socket) {

  var idx = connections.indexOf(socket);
  if(idx > -1)
    connections.splice(idx, 1);

}

function addLocation(loc) {

  if(loc.lon && loc.lat) {

    locations.push(loc);

    connections.forEach(function(socket) {
      socket.emit('location.update', loc)
    });

  }
}