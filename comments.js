// Create web server with Node.js
// Run with: node comments.js
// Access with: http://localhost:3000/comments

var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (request, response) {
	var path = url.parse(request.url).pathname;
	
	// GET method
	if (request.method == 'GET') {
		if (path == '/comments') {
			fs.readFile('comments.json', function (err, data) {
				if (err) {
					response.writeHead(404);
					response.write('File not found!');
					response.end();
				} else {
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.write(data.toString());
					response.end();
				}
			});
		} else {
			response.writeHead(404);
			response.write('File not found!');
			response.end();
		}
	}
	
	// POST method
	if (request.method == 'POST') {
		if (path == '/comments') {
			var body = '';
			request.on('data', function (data) {
				body += data;
			});
			request.on('end', function () {
				var comment = JSON.parse(body);
				fs.readFile('comments.json', function (err, data) {
					if (err) {
						response.writeHead(404);
						response.write('File not found!');
						response.end();
					} else {
						var comments = JSON.parse(data.toString());
						comments.push(comment);
						fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
							if (err) {
								response.writeHead(404);
								response.write('File not found!');
								response.end();
							} else {
								response.writeHead(200);
								response.end();
							}
						});
					}
				});
			});
		} else {
			response.writeHead(404);
			response.write('File not found!');
			response.end();
		}
	}
}).listen(3000);