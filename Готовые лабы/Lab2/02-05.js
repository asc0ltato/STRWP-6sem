var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) { 
    if (request.url === '/api/name') {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Zhuk Svetlana Sergeevna');
    } else if (request.url === '/fetch'){
        const fname = './fetch.html';

        fs.readFile (fname, (error, data) => {
            if (error) {
                console.log('error: ' + error);
            } else {
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                response.end(data, 'binary');
            }
        });
    }
}).listen(5000); 

console.log("Server running at http://localhost:5000/");