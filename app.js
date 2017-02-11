var express = require('express'),
    bodyParser = require('body-parser');

var connections = [];

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  false}));

app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    if(req.method == 'OPTIONS')
        res.status(200).end();
    else
        next();
});

app.get('/locations', function (req, res) {
    if(req.headers.accept == 'text/event-stream') {
        res.writeHead(200, {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            'connection': 'keep-alive'
        });

        connections.push(res);

        console.log('Connection added: ' + req.ip);

        req.on('close', function() {
            removeConnection(res);
        })
    }
});

app.post('/locations', function(req, res) {
    connections.forEach(function(conn) {
        conn.write('data: ' + JSON.stringify(req.body) + '\n\n');
    })
});

function removeConnection(res) {
    var conn = connections.indexOf(res);
    if(conn !== -1) 
        connections.splice(conn, 1);
}

app.listen(8088);