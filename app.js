// The main application script
 
var express = require('express');
var mongoose = require('mongoose');
var app = express();
 
// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/test_vin');
 
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});
 
// set up the RESTful API, handler methods are defined in api.js
var api = require('./controllers/api.js');
app.get('/vin/:vin', api.check);
 
app.listen(3000);
console.log("Express server listening on port 3000");