module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendfile(__dirname + '/public/index.html')
    });
};

