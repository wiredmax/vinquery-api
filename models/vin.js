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
  engine_type: String, 
  transmission_long: String, 
  transmission_short: String, 
  driveline: String, 
  tank: String, 
  tank_unit: String,
  fuel_economy_city: String,
  fuel_economy_highway: String, 
  fuel_economy_unit: String, 
  anti_brake_system: String, 
  steering_type: String,
  standard_seating: String,
  optional_seating: String,
  length: String,
  width: String,
  height: String,
  dimension_unit: String 
});
 
module.exports = mongoose.model('Vin', vinSchema);