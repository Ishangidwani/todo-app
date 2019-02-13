var express = require('express');
var app = express();
var fs = require("fs");

app.get('/api/get', function (req, res) {
   fs.readFile( __dirname + "/" + "todo_list.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
});
app.post('/api/save', function (req, res) {
    var body = '';
    filePath = __dirname + '/todo_list.json';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function (){
        fs.write(filePath, body, function() {
            res.end();
        });
    });
});
var cors = require('cors');

app.use(cors());
var server = app.listen(4201, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
