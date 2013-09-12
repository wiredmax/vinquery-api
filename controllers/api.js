/* The API controller
   Exports 1 methods:
   * check - Displays a vin number information
*/
 
var http = require('http');
var xml2js = require('xml2js');
 
var Vin = require('../models/vin.js');
 
// first locates a thread by title, then locates the replies by thread ID.
exports.check = (function(req, res) {
  var vin = Vin.findOne({vin: '' + req.params.vin.substring(0, 10) + 'xxxxxx'}, function(error, vinData) {
    if(vinData) {
      res.send(vinData);
    }
    else {
      var parser = new xml2js.Parser();
      
      var access_code = 'YOUR_VIN_QUERY_ACCESS_CODE';
      var report_type = '0';
      
      var url = 'http://ws.vinquery.com/restxml.aspx?accessCode=' + access_code + '&vin='+ req.params.vin +'&reportType='+ report_type +'';


      http.get(url, function(httpResonse) {
          var body = '';

          httpResonse.on('data', function(chunk) {
              body += chunk;
          });

          httpResonse.on('end', function() {
              
                parser.parseString(body.replace(/^\uFEFF/, ''), function (err, result) { // Work around to remode the UTF-8 BOM
                
                if(result) {
                  if(result.VINquery.VIN[0].$.Status == 'FAILED') {
                    res.send('Invalid VIN');
                  }
                  else {
                    var vin = new Vin({ 
                      vin: '' + result.VINquery.VIN[0].$.Number.substring(0, 10)+ 'xxxxxx', 
                      year: result.VINquery.VIN[0].Vehicle[0].Item[0].$.Value, 
                      make: result.VINquery.VIN[0].Vehicle[0].Item[1].$.Value, 
                      model: result.VINquery.VIN[0].Vehicle[0].Item[2].$.Value, 
                      trim_level: result.VINquery.VIN[0].Vehicle[0].Item[3].$.Value, 
                      manufactured_in: result.VINquery.VIN[0].Vehicle[0].Item[4].$.Value, 
                      body_style: result.VINquery.VIN[0].Vehicle[0].Item[5].$.Value, 
                      engine_type: result.VINquery.VIN[0].Vehicle[0].Item[6].$.Value
                    });
                      
                    vin.save(function (err) {
                      if (err) console.log(err)
                      res.send(vin);
                    });
                  }
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