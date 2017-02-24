var express = require('express');
var app = express();

app.use(express.static(__dirname + "/public"));

var port = 3333;
app.listen(port, '0.0.0.0');
console.log("Listening on port " + port);