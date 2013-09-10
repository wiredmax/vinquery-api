/* The API controller
   Exports 1 methods:
   * check - Displays a vin number information
*/
 
var http = require('http');
var xml2js = require('xml2js');
 
var Vin = require('../models/vin.js');
 
// first locates a thread by title, then locates the replies by thread ID.
exports.check = (function(req, res) {
  var vin = Vin.findOne({vin: req.params.vin}, function(error, vinData) {
    if(vinData) {
      res.send(vinData);
    }
    else {
      var parser = new xml2js.Parser();

      var url = 'http://www.vinquery.com/samples/ws_bas.xml';

      http.get(url, function(httpResonse) {
          var body = '';

          httpResonse.on('data', function(chunk) {
              body += chunk;
          });

          httpResonse.on('end', function() {
              
                parser.parseString(body.replace(/^\uFEFF/, ''), function (err, result) { // Work around to remode the UTF-8 BOM
                
                if(result) {
                  var vin = new Vin({ 
                    vin: result.VINquery.VIN[0].$.Number, 
                    year: result.VINquery.VIN[0].Vehicle[0].Item[1].$.Value, 
                    make: result.VINquery.VIN[0].Vehicle[0].Item[2].$.Value, 
                    model: result.VINquery.VIN[0].Vehicle[0].Item[3].$.Value, 
                    trim_level: result.VINquery.VIN[0].Vehicle[0].Item[4].$.Value, 
                    manufactured_in: result.VINquery.VIN[0].Vehicle[0].Item[5].$.Value, 
                    body_style: result.VINquery.VIN[0].Vehicle[0].Item[7].$.Valuee, 
                    engine_type: result.VINquery.VIN[0].Vehicle[0].Item[8].$.Value, 
                    transmission_long: result.VINquery.VIN[0].Vehicle[0].Item[9].$.Value, 
                    transmission_short: result.VINquery.VIN[0].Vehicle[0].Item[10].$.Value, 
                    driveline: result.VINquery.VIN[0].Vehicle[0].Item[11].$.Value, 
                    tank: result.VINquery.VIN[0].Vehicle[0].Item[12].$.Value, 
                    tank_unit: result.VINquery.VIN[0].Vehicle[0].Item[12].$.Unit,
                    fuel_economy_city: result.VINquery.VIN[0].Vehicle[0].Item[13].$.Value, 
                    fuel_economy_highway: result.VINquery.VIN[0].Vehicle[0].Item[14].$.Value, 
                    fuel_economy_unit: result.VINquery.VIN[0].Vehicle[0].Item[14].$.Unit, 
                    anti_brake_system: result.VINquery.VIN[0].Vehicle[0].Item[15].$.Value, 
                    steering_type: result.VINquery.VIN[0].Vehicle[0].Item[16].$.Value, 
                    standard_seating: result.VINquery.VIN[0].Vehicle[0].Item[17].$.Value, 
                    optional_seating: result.VINquery.VIN[0].Vehicle[0].Item[18].$.Value, 
                    length: result.VINquery.VIN[0].Vehicle[0].Item[19].$.Value, 
                    width: result.VINquery.VIN[0].Vehicle[0].Item[20].$.Value, 
                    height: result.VINquery.VIN[0].Vehicle[0].Item[21].$.Value, 
                    dimension_unit: result.VINquery.VIN[0].Vehicle[0].Item[21].$.Unit 
                  });
                    
                  vin.save(function (err) {
                    if (err) console.log(err)
                    res.send(vin);
                  });
                }
                else {
                  res.send('vinquery.com service error');
                }
            });
                  
          });
      }).on('error', function(e) {
            console.log("Got error: ", e);
      })
    }

  });
});