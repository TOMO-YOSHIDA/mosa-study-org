var express = require('express')
	, http = require('http')
	, path = require('path')
	, compress = require('compression')
	, app = express();

app.use(compress());
app.use(express.static(path.join(__dirname, './public')));

var httpPort = process.env.HTTP_PORT || 10080;
http.createServer(app).listen(httpPort, function(){
	console.log('Express server (HTTP) listening on port ' + httpPort);
});
