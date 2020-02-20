const express = require('express');
const router = express.Router();
// express()는 application 객체를 반환하고
// express.Router()는 router 객체를 반환한다.
const path = require('path');
const fs = require('fs');
const template = require('../lib/template');
const sanitizeHtml = require('sanitize-html');

router.get('/create', (req, res) => {
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

router.post('/create_process', (req, res) => {
    var post = req.body;
    console.log(post);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        res.redirect(`/topic/${title}`);
    }); 
});

router.get('/update/:pageId', (req, res) => {
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

router.post('/update_process', (req, res) => {
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

router.post('/delete_process', (req, res) => {
    var post = req.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, (err) => {
        res.redirect('/');
    });
    console.log(post.id, '=> delete is complete.')
});

router.get('/:pageId', (req, res, next) => {
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

module.exports = router;