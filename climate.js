var express = require('express');
var app = express();
var request = require('request');

app.use(express.static(__dirname + "/public"));

var url1 = "https://www.wunderground.com/history/airport/"
var url2 = "/1/MonthlyHistory.html?format=1&_ga=1.166488574.1780882849.1485640531" 
var props = {
  "max": 1,
  "avg": 2,
  "min": 3,
}

var getStats = function(airport, year, month, property, callback) {
  var url = url1 + airport + "/" + year + "/" + month + url2
  request(url, function(err, response, body) {
    if (err)
      throw err;
    var total = 0;
    count = 0;
    var data = body.split('\n');
    for (var i = 0; i < data.length; i++) {
      var temp = parseInt(data[i].split(',')[property])
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
var obj = {};
var airports = {}
var cities = {}

//Average
app.get('/:prop/:airport/:start/:end', function(req, res) {
  var prop = req.params.prop;
  var airport = req.params.airport
  var start = parseInt(req.params.start);
  var end = parseInt(req.params.end);

  console.log("Gathering " + airport + " " + start + "-" + end)

  var count = 0;
  obj = {}
  var years = [];
  for (var i = start; i <= end; i++) {
    years.push(i);
  };
  years.forEach(function(year) {
    obj[year] = {};
    months.forEach(function(month) {
      getStats(airport, year, month, props[prop], function(temp) {
        if (month == 12) {
          if (year != end)
            obj[year+1][0] = temp;
        } else obj[year][month % 12] = temp;
        count++;
        if (count == 12 * years.length) {
          getStats(airport, start-1, 12, props[prop], function(t) {
            obj[start][0] = t;
            //memoize
            airports[airport] = obj;
            res.send(obj);
          })
        }
      })
    })
  })
})

app.get('/test', function(req, res) {
  console.log(props.max);
  console.log(props.avg);
  getStats('kmic', '2010', '1', props.max, function(temp) {
    res.send("Avg Max: " + temp);
  })
})

app.get('/api/city/:airport', function(req, res) {
  var airport = req.params.airport;

  if (cities[airport])
    res.send(cities[airport]);
  else {
    console.log("Searching " + airport)

    request('https://www.wunderground.com/history/airport/' + airport, function(err, response, body) {
      var title = body.split('title>')[1].substring(20);
      var city = title.substring(0, title.indexOf(' |'));
      cities[airport] = city;
      res.send(city);
    })
  }
})

app.get('/excel/:airport/:start/:end', function(req, res){
  var airport = req.params.airport
  var start = parseInt(req.params.start);
  var end = parseInt(req.params.end);
  
  console.log("Exporting " + airport)
  obj = airports[airport];
  var rows = [['Year', 'Dec', 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov']];
  for (var i = start; i <= end; i++) {
    rows.push([i, obj[i]['0'], obj[i]['1'], obj[i]['2'], obj[i]['3'], obj[i]['4'], obj[i]['5'], obj[i]['6'], obj[i]['7'], obj[i]['8'], obj[i]['9'], obj[i]['10'], obj[i]['11']])
  }
  var result = rows.join('\n');

  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + cities[airport].split(",")[0].replace(' ', '_') + ".csv");
  res.end(result, 'binary');
});




var port = 3333;
server = app.listen(port, '0.0.0.0');
console.log("Listening on port " + port);
module.exports = server;