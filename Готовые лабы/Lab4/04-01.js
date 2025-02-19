const http = require('http');
const url = require('url');
const fs = require('fs');
const data = require('./DB');

const db = new data.DB();

db.on('GET', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(db.select()));
});


db.on('POST', (request, response) => {
    request.setEncoding('utf-8');
    request.on('data', data => {
        try {
            let param = JSON.parse(data);
            param.id = db.select().length ? Math.max(...db.select().map(i => i.id)) + 1 : 1;
            let newRecord = { id: param.id, name: param.name, bday: param.bday };
            db.insert(newRecord);
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify(newRecord));
        } catch (err) {
            response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    })
});

db.on('PUT', (request, response) => {
    request.setEncoding('utf-8');
    request.on('data', data => {
        try {
            let param = JSON.parse(data);
            db.update(param);
            response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify(param));
        } catch (err) {
            response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    })
});

db.on('DELETE', (request, response) => {
    const queryParams = new URLSearchParams(url.parse(request.url).query);
    const param = parseInt(queryParams.get('id'));
    const deletedItem = db.delete(param);
    if (deletedItem) {
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify(deletedItem));
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ error: 'Item not found' }));
    }
});

const server = http.createServer(function (request, response) {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/') {
        fs.readFile('./04-01.html', 'utf-8', (err, html) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Error loading index.html');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                response.end(html);
            }
        });
    }
    else if (pathname === '/api/db') {
        db.emit(request.method, request, response);
    }
});

server.listen(5000, () => {
    console.log('Server is running at http://localhost:5000');
});