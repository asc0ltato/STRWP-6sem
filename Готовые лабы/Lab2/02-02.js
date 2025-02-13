var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    if (request.method === 'GET' && request.url === '/png') {
        const fname = './pic.png';

        fs.stat (fname, (error, stat) => {
            if (error) {
                console.log('error: ' + error);
            } else {
                png = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': stat.size});
                response.end(png, 'binary');
            }
        })
    }
}).listen(5000);

console.log("Server running at http://localhost:5000/");