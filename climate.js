var express = require('express');
var app = express();
var request = require('request');
app.use(express.static(__dirname + "/public"));

var url1 = "https://www.wunderground.com/history/airport/"
var url2 = "/1/MonthlyHistory.html?format=1&_ga=1.166488574.1780882849.1485640531" 
var year = 2007
var month = 8


var getAvg = function(airport, year, month, callback) {
  request(url1 + airport + "/" + year + "/" + month + url2, function(err, response, body) {
    if (err)
      throw err;
    var total = 0;
    count = 0;
    var data = body.split('\n');
    for (var i = 0; i < data.length; i++) {
      var temp = parseInt(data[i].split(',')[2])
      if (!isNaN(temp)) {
        //console.log(temp)
        total+= temp;
        count++;
      }
    }
    if (month < 10)
      month = "0" + month;
    callback(Math.round(total/count))
  })
}

var years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
var months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

app.get('/api/:airport', function(req, res) {
  var airport = req.params.airport
  var count = 0;
  var obj = {}

  years.forEach(function(year) {
    obj[year] = {};
    months.forEach(function(month) {
      getAvg(airport, year, month, function(temp) {
        if (month == 12) {
          if (year != 2016)
            obj[year+1][0] = temp;
        } else obj[year][month % 12] = temp;
        count++;
        if (count == 120) {
          getAvg(airport, 2006, 12, function(t) {
            obj[2007][0] = t;
            res.send(obj);
          })
        }
      })
    })
  })
})

var port = 3333;
app.listen(port, '0.0.0.0');
console.log("Listening on port " + port);