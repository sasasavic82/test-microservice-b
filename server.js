'use strict';

var app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    _ = require('lodash');

const PORT = 8088;

var connections = [], customers = [
    {
        id: 1,
        name: "Tasja",
        surname: "Laurie",
        town: "St Kilda"
    }
];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  false}));

server.listen(PORT);

console.log('Listening on ' + PORT);

app.get('/', function (req, res) {
  res.send('Welcome to Microservice Bounded-Context B! (Natasja)');
});

app.get('/customer', function (req, res) {
  return res.json(customers);  
});

app.get('/customer/:customerId', function(req, res) {
    var customer = _.find(customers, function(o) { return o.id == req.params.customerId; });
    return res.json(customer);
});

app.post('/customer', function (req, res) {
  
  var customer = {
      id: req.body.customerId,
      name: req.body.name,
      surname: req.body.surname,
      town: req.body.town
  }
  
  addCustomer(customer);

  return res.json(customer);
});

app.delete('/customer/:customerId', function(req, res) {
    _.remove(customers, function(o) {
        return o.id == req.params.customerId;
    });

    res.status(204).end();
});

app.put('/customer/:customerId', function(req, res) {
    customers = _.map(customers, function(o) {
        return o.id == req.params.customerId ? req.body : o;
    });

    res.status(204).end();
});


// Helpers

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

function addCustomer(customer) {
    
    customers.push(customer);

    connections.forEach(function(socket) {
      socket.emit('customer.created', loc)
    });

}