var express = require('express')
	, app = express()
	, http = require('http').Server(app)
	, io = require('socket.io')(http)
	, socket = require('./socket')
	, Q = require('q')
	, path = require('path');

var ROOT = path.resolve(__dirname + '/../')
	, SENDFILE_OPTS = { root: ROOT }
	, PORT = 55221
	, START_TIMEOUT = 5;

app.use('/components', express.static(ROOT + '/components'));
app.use('/dist', express.static(ROOT + '/dist'));
app.use('/fonts', express.static(ROOT + '/fonts'));
app.get('/', function(req, res) {
	res.sendFile('atom-app.html', SENDFILE_OPTS);
});

io.on('connection', socket.setUpListeners);

module.exports = {
	start: function startServer() {
		return Q.promise(function(resolve, reject) {
			var timeout = setTimeout(function() {
				reject('Server did not start within ' + START_TIMEOUT + ' seconds');
			}, START_TIMEOUT * 1000);

			http.listen(PORT, function() {
				clearTimeout(timeout);
				console.log('Server listening on port %s', PORT);
				resolve(http);
			});
		});
	}
}