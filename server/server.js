//
// GET PACKAGES
//
var express       = require('express');
var app           = express();
var bodyParser    = require('body-parser');
var morgan        = require('morgan');
var mongoose      = require('mongoose');
var cors          = require('cors');
var routes        = require('./config/routes');
var config        = require('./config/config');

//
// CONFIGURATION
//
var port = process.env.PORT || 8000;
// connect to db
mongoose.connect(config.database);
// setting secret variable
app.set('superSecret', config.secret);
// body parser to get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// log requests to console
app.use(morgan('dev'));
// allow cross origin access
app.use(cors());
// using routes file
app.use('/', routes);

//
// START SERVER
//
app.listen(port);
console.log('Listening at http://localhost:' + port);

//
// EXPORT APP
//
module.exports = app;
