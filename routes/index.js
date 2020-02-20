const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/', (req, res) => {
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
    res.send(html); 
});

module.exports = router;