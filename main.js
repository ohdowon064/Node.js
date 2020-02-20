const express = require('express');
const app = express(); // express는 함수처럼 호출한다? express는 함수다!
// application 객체를 반환한다. 
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const bodyParser = require('body-parser');
const compression = require('compression');

// public 디렉토리안에서 static file을 찾겠다.
app.use(express.static('public'));


// 프로그램을 실행하면 제일 먼저 app.use를 통해 등록한 body-parser 미들웨어가 실행이 되고 그다음 compression가 실행되고 그 다음 등록한 미들웨어가 실행되고 쭉 실행되면서 해당 패스에 맞는 미들웨어가 실행된다.

// form데이터는 이런식으로 처리해라
app.use(bodyParser.urlencoded({extended : false}));
// bodyParser.url~ 이부분은 미들웨어를 반환한다.
// main.js가 실행될때마다 즉, 사용자가 요청할 때마다
// bodyParser.urlencoded({extended : false})에 의해 만들어진
// 미들웨어가 실행된다.
// 이 미들웨어는 내부적으로 사용자가 전송한 post데이터를 분석해서
// post방식으로 설정된 콜백함수를 호출한다.
// 그리고 호출하면서 콜백함수의 req객체의 body객체를 생성한다.

app.use(compression());
// 미들웨어 등록하기
// compression() 함수를 실행하면 미들웨어가 만들어지고 app.use를 통해서 장착된다.

// 미들웨어 만들기
// 미들웨어는 함수이다.
// next()는 다음에 실행되는 미들웨어 함수이다.
// app.use((req, res, next) => {
app.get('*', (req, res, next) => { // post는 파일 목록이 필요없기 때문에 응답하지 않는다. 그래서 이런식으로 수정하면 get방식으로 들어오는 모든 요청에 응답한다.
    fs.readdir('./data', (err, filelist) => {
        req.list = filelist;
        next();
    });
});
// 모든 라우트안에서 req객체의 list 프로퍼티를 통해서 글 목록에 접근할 수 있다.
// 이제 우리가 등록했던 콜백함수도 모두 미들웨어였다는 것을 알 수 있다.
// Express에서는 모든게 미들웨어이다.

// route, routing : 패스마다 적절한 함수를 등록하는 것이다.
// app.get(path, callback) 첫번째 인자로 패스, 두번째 인자로 콜백을 받는다.
// 패스경로로 접속자가 들어왔을 때 콜백함수가 실행된다.
// if(pathname === '/') {~~~}와 동일한 것이지만 훨씬 간결하고 좋은 코드이다.
app.get('/', (req, res) => {
    console.log('req.list =>', req.list);
    var title = 'Welcome home!';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <img src="/image/hello.jpg" style="width:300px; display:block; margin-top:10px">
        `,
        `<a href="/topic/create">create</a>`
    );
    // res.writeHead(200);
    // res.end(html);
    res.send(html); 
});

app.get('/topic/create', (req, res) => {
    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
    `, '');
    res.send(html);
});

// create를 post방식으로 전송하면 app.post()에 걸릴 것이고,
// create를 get방식으로 전송하면 app.get()에 걸릴 것이다.
// app.post()로 한다.
app.post('/topic/create_process', (req, res) => {
    var post = req.body;
    console.log(post);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        res.redirect(`/topic/${title}`);
    }); 
});
// body-parser 미들웨어를 통해 create_process라는 라우터를 사용할 때
// req객체의 body 프로퍼티의 접근을 통해 간결하게 만들었다.

// 수정
app.get('/topic/update/:pageId', (req, res) => {
    var filteredId = path.parse(req.params.pageId).base;
    console.log(req.params.pageId);
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        var title = req.params.pageId;
        var list = template.list(req.list);
        var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
            <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
            <input type="submit">
            </p>
        </form>
        `,
        `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
        );
        res.send(html);
    });
});

app.post('/topic/update_process', (req, res) => {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, (err) => {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
            res.redirect(`/topic/${title}`);
        });
    });
});

app.post('/topic/delete_process', (req, res) => {
    var post = req.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, (err) => {
        res.redirect('/');
    });
    console.log(post.id, '=> delete is complete.')
});


// url에 쿼리스트링이 아닌 패스방식으로 파라미터가 전달되었을 때 처리하는 방법
// list 항목을 클릭했을 때 나오도록 해보자.
// 사용자가 page/어떤값 으로 들어왔을 때 그 어떤 값에 pageId라는 이름을 붙인것이다.
app.get('/topic/:pageId', (req, res, next) => {
    console.log('req.list => ', req.list);
    var filteredId = path.parse(req.params.pageId).base;
    console.log('pageId : ', filteredId);
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
        if(err) {
            next(err); // 인자가 4개인 error handler 미들웨어가 호출된다.
        } else {
            var title = req.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
            });
            var list = template.list(req.list);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
            );
            res.send(html);
        }
    });
});



app.use((req, res, next) => {
    res.status(404).send('Sorry can\'t find that!');
});

// error handler를 위한 미들웨어
// 4개의 인자를 가지는 함수는 error를 핸들링하는 미들웨어로 약속되어있다.
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
// 3000번 포트에 listen()이 성공하면 등록한 콜백함수가 실행된다.

































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