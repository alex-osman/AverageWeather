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
var obj = {};
var airports = {}
var cities = {}

app.get('/api/:airport', function(req, res) {
  var airport = req.params.airport
  console.log("Gathering " + airport)

  if (airports[airport])
    res.send(airports[airport])
  else {
    var count = 0;
    obj = {}

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
              //memoize
              airports[airport] = obj;
              res.send(obj);
            })
          }
        })
      })
    })
  }
})

app.get('/api/city/:airport', function(req, res) {
  var airport = req.params.airport;
  console.log("Searching " + airport)

  request('https://www.wunderground.com/history/airport/' + airport, function(err, response, body) {
    var title = body.split('title>')[1].substring(20);
    var city = title.substring(0, title.indexOf(' |'));
    cities[airport] = city;
    res.send(city);
  })
})

app.get('/excel/:airport', function(req, res){
  var airport = req.params.airport
  console.log("Exporting " + airport)
  obj = airports[airport];
  var rows = [
    ['Year', 'Dec', 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov'],
    ['2007', obj['2007']['0'], obj['2007']['1'], obj['2007']['2'], obj['2007']['3'], obj['2007']['4'], obj['2007']['5'], obj['2007']['6'], obj['2007']['7'], obj['2007']['8'], obj['2007']['9'], obj['2007']['10'], obj['2007']['11']],
    ['2008', obj['2008']['0'], obj['2008']['1'], obj['2008']['2'], obj['2008']['3'], obj['2008']['4'], obj['2008']['5'], obj['2008']['6'], obj['2008']['7'], obj['2008']['8'], obj['2008']['9'], obj['2008']['10'], obj['2008']['11']],
    ['2009', obj['2009']['0'], obj['2009']['1'], obj['2009']['2'], obj['2009']['3'], obj['2009']['4'], obj['2009']['5'], obj['2009']['6'], obj['2009']['7'], obj['2009']['8'], obj['2009']['9'], obj['2009']['10'], obj['2009']['11']],
    ['2010', obj['2010']['0'], obj['2010']['1'], obj['2010']['2'], obj['2010']['3'], obj['2010']['4'], obj['2010']['5'], obj['2010']['6'], obj['2010']['7'], obj['2010']['8'], obj['2010']['9'], obj['2010']['10'], obj['2010']['11']],
    ['2011', obj['2011']['0'], obj['2011']['1'], obj['2011']['2'], obj['2011']['3'], obj['2011']['4'], obj['2011']['5'], obj['2011']['6'], obj['2011']['7'], obj['2011']['8'], obj['2011']['9'], obj['2011']['10'], obj['2011']['11']],
    ['2012', obj['2012']['0'], obj['2012']['1'], obj['2012']['2'], obj['2012']['3'], obj['2012']['4'], obj['2012']['5'], obj['2012']['6'], obj['2012']['7'], obj['2012']['8'], obj['2012']['9'], obj['2012']['10'], obj['2012']['11']],
    ['2013', obj['2013']['0'], obj['2013']['1'], obj['2013']['2'], obj['2013']['3'], obj['2013']['4'], obj['2013']['5'], obj['2013']['6'], obj['2013']['7'], obj['2013']['8'], obj['2013']['9'], obj['2013']['10'], obj['2013']['11']],
    ['2014', obj['2014']['0'], obj['2014']['1'], obj['2014']['2'], obj['2014']['3'], obj['2014']['4'], obj['2014']['5'], obj['2014']['6'], obj['2014']['7'], obj['2014']['8'], obj['2014']['9'], obj['2014']['10'], obj['2014']['11']],
    ['2015', obj['2015']['0'], obj['2015']['1'], obj['2015']['2'], obj['2015']['3'], obj['2015']['4'], obj['2015']['5'], obj['2015']['6'], obj['2015']['7'], obj['2015']['8'], obj['2015']['9'], obj['2015']['10'], obj['2015']['11']],
    ['2016', obj['2016']['0'], obj['2016']['1'], obj['2016']['2'], obj['2016']['3'], obj['2016']['4'], obj['2016']['5'], obj['2016']['6'], obj['2016']['7'], obj['2016']['8'], obj['2016']['9'], obj['2016']['10'], obj['2016']['11']]
  ];
  var result = rows.join('\n');

  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + cities[airport].split(",")[0].replace(' ', '_') + ".xls");
  res.end(result, 'binary');
});




var port = 3333;
app.listen(port, '0.0.0.0');
console.log("Listening on port " + port);