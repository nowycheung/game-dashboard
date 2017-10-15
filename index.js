const http = require("http");
const RequestHandler = require("./requestHandler");

http.createServer((request, response) => {
    RequestHandler.write(request, response);
}).listen(8000);;

console.log("Server running at http://127.0.0.1:8000/");
