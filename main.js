const express = require('express');
const app = express(); 
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(compression());

app.get('*', (req, res, next) => { 
    fs.readdir('./data', (err, filelist) => {
        req.list = filelist;
        next();
    });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
// /topic으로 시작하는 주소들에게 topicRouter미들웨어를 적용하겠다.
// router내부에서는 /topic을 담을 필요가 없다.

app.use((req, res, next) => {
    res.status(404).send('Sorry can\'t find that!');
});


app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));


































/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        
      } else {
 
        });
      }
    } else if(pathname === '/create'){
      
    } else if(pathname === '/create_process'){
    
    } else if(pathname === '/update'){
      
    } else if(pathname === '/update_process'){
      
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/