var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
var http = require('http');
var Routes = require('./server/routes');
var expressValidator = require('express-validator');
var helmet = require('helmet');
var mongodb = require('./server/config/configMongoDb.js');
var allowCors = require('./server/config/allowCors');


var app = express();
var server = http.createServer(app);

app.use(allowCors);


app.use(bodyParser.urlencoded({
	limit: '50mb'
}));
app.use(bodyParser.json({
	limit: '50mb'
}));


app.use(helmet());
mongodb.init;

app.disable('x-powered-by');

app.use(helmet.xssFilter({
	setOnOldIE: true
}));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(expressValidator());

routes = new Routes(app);
routes.setup();


server.listen(port, function() {
	console.log("Servidor iniciado na porta " + port);
});