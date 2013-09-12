// The VIN model
 
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var vinSchema = new Schema({
  vin: String, 
  year: String, 
  make: String, 
  model: String, 
  trim_level: String, 
  manufactured_in: String, 
  body_style: String, 
  engine_type: String
});
 
module.exports = mongoose.model('Vin', vinSchema);