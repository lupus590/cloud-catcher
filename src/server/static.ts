import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

const mimeTypes: { [key: string]: string | undefined } = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpg",
};

export const handle = (dir: string) => (request: http.ServerRequest, response: http.ServerResponse) => {
  const requestUrl = url.parse(request.url || "");
  const filePath = path.join(dir, !requestUrl.pathname || requestUrl.pathname === "/"
    ? "index.html"
    : requestUrl.pathname);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mime = mimeTypes[extname];

  if (!mime) {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end("404 - Page not found", "utf-8");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        response.writeHead(404, { "Content-Type": "text/html" });
        response.end("404 - Page not found", "utf-8");
      } else {
        response.writeHead(500);
        response.end("Sorry, check with the site admin for error: " + error.code + " ..\n");
        response.end();
      }
    } else {
      response.writeHead(200, { "Content-Type": mime });
      response.end(content, "utf-8");
    }
  });
};
