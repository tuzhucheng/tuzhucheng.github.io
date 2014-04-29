var http = require('http');
var express = require('express');
var app = express();
var router = require('./routes')(app);

app.set('port', process.env.PORT || 3000);

// simple logger
app.use(function(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.use(express.static(__dirname + '/public'));

http.createServer(app).listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});
