const fs = require("fs");
const path = require("path");

const RequestHandler = {
    getFilePath: (url) => {
        return url === "/" ? "./static/index.html" : `./static/${url}`;
    },
    getContentType: (filePath) => {
        const extname = path.extname(filePath);
        let contentType = "text/html";

        switch (extname) {
            case ".js":
                contentType = "text/javascript";
                break;
            case ".css":
                contentType = "text/css";
                break;
            case ".json":
                contentType = "application/json";
                break;
            case ".png":
                contentType = "image/png";
                break;
        }

        return contentType;
    },
    write: (request, response) => {
        const { url } = request;
        const filePath = RequestHandler.getFilePath(url);
        const contentType = RequestHandler.getContentType(filePath);

        fs.readFile(filePath, (error, content) => {
            if (!error) {
                response.writeHead(200, {
                    "Content-Type": contentType
                });
                response.end(content, "utf-8");
            } else {
                response.writeHead(200, {
                    "Content-Type": "text/html"
                });
                response.end("File not found", "utf-8");
            }
        });
    }
};

module.exports = RequestHandler;